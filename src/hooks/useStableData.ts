/**
 * FILE SUMMARY:
 * Real-time relational hook for the 25-box grid.
 * Joins boxes → horses → clients in one atomic call.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/hooks/useStableData.ts
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export const useStableData = () => {
  const [boxes, setBoxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStable = async () => {
    crumb('stable', 'Fetching 25 boxes with horse + owner data');

    // Join 'boxes' with 'horses' and 'clients' in one atomic call
    const { data, error: fetchError } = await supabase
      .from('boxes')
      .select(`
        id,
        status,
        horses (
          id,
          name,
          microchip,
          clients:client_id (
            full_name
          )
        )
      `)
      .order('id', { ascending: true });

    if (fetchError) {
      errorCrumb('stable', 'Failed to fetch boxes', fetchError);
      setError(fetchError.message);
    } else {
      setBoxes(data || []);
      crumb('stable', `Grid updated. ${data?.length || 0} stalls synced.`);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStable();

    // Real-time listener: Refresh grid when any box or horse changes
    const channel = supabase
      .channel('stable-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boxes' }, fetchStable)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'horses' }, fetchStable)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { boxes, loading, error, refetch: fetchStable };
};
