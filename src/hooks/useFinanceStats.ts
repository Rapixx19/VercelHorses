/**
 * FILE SUMMARY:
 * Calculate real-time unbilled revenue for the finance dashboard.
 * Aggregates service_logs by client for monthly billing overview.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/hooks/useFinanceStats.ts
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

interface ClientAccrual {
  clientId: string;
  clientName: string;
  horseCount: number;
  totalAccrued: number;
}

interface FinanceStats {
  totalAccrued: number;
  totalLogs: number;
  pendingInvoices: number;
  clientBreakdown: ClientAccrual[];
}

export const useFinanceStats = () => {
  const [stats, setStats] = useState<FinanceStats>({
    totalAccrued: 0,
    totalLogs: 0,
    pendingInvoices: 0,
    clientBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    crumb('finance', 'Fetching unbilled revenue stats');

    try {
      // Fetch all unbilled service logs with horse and client info
      const { data: logs, error: logsError } = await supabase
        .from('service_logs')
        .select(`
          id,
          fixed_price,
          service_type,
          horses (
            id,
            name,
            clients:client_id (
              id,
              full_name
            )
          )
        `)
        .eq('is_billed', false);

      if (logsError) throw logsError;

      // Fetch pending (draft) invoices count
      const { count: pendingCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      // Calculate totals
      const total = logs?.reduce((sum, log) => sum + Number(log.fixed_price || 0), 0) || 0;

      // Group by client
      const clientMap = new Map<string, ClientAccrual>();
      const horsesByClient = new Map<string, Set<string>>();

      logs?.forEach(log => {
        const horse = Array.isArray(log.horses) ? log.horses[0] : log.horses;
        const client = horse?.clients;

        if (client?.id) {
          const existing = clientMap.get(client.id);
          const horses = horsesByClient.get(client.id) || new Set();

          if (horse?.id) horses.add(horse.id);
          horsesByClient.set(client.id, horses);

          clientMap.set(client.id, {
            clientId: client.id,
            clientName: client.full_name || 'Unknown',
            horseCount: horses.size,
            totalAccrued: (existing?.totalAccrued || 0) + Number(log.fixed_price || 0)
          });
        }
      });

      // Update horse counts from the Set
      clientMap.forEach((value, key) => {
        value.horseCount = horsesByClient.get(key)?.size || 0;
      });

      const breakdown = Array.from(clientMap.values()).sort(
        (a, b) => b.totalAccrued - a.totalAccrued
      );

      setStats({
        totalAccrued: total,
        totalLogs: logs?.length || 0,
        pendingInvoices: pendingCount || 0,
        clientBreakdown: breakdown
      });

      crumb('finance', `Calculated €${total} across ${logs?.length || 0} unbilled logs`);
    } catch (err) {
      errorCrumb('finance', 'Failed to fetch finance stats', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Real-time listener for service_logs changes
    const channel = supabase
      .channel('finance-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_logs' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
