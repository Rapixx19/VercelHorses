/**
 * FILE SUMMARY:
 * Fetches data needed for the onboarding form.
 * Only returns boxes that are 'free'.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/hooks/useRegistrationData.ts
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb } from '@/lib/logger';

export const useRegistrationData = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [freeBoxes, setFreeBoxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      crumb('onboarding', 'Fetching clients and free stalls');
      const [cRes, bRes] = await Promise.all([
        supabase.from('clients').select('id, full_name'),
        supabase.from('boxes').select('id').eq('status', 'free').order('id')
      ]);

      setClients(cRes.data || []);
      setFreeBoxes(bRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return { clients, freeBoxes, loading };
};
