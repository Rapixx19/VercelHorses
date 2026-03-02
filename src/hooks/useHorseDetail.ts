/**
 * FILE SUMMARY:
 * Fetches deep data for a specific horse.
 * Joins Horse -> Client (Owner) -> Swiss Bank Details.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/hooks/useHorseDetail.ts
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export const useHorseDetail = (horseId: string | null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!horseId) return;

    const fetchDetail = async () => {
      setLoading(true);
      crumb('profiles', `Fetching deep detail for horse: ${horseId}`);

      const { data, error } = await supabase
        .from('horses')
        .select(`
          *,
          clients (
            full_name,
            bank_iban,
            bank_bic,
            bank_clearing
          )
        `)
        .eq('id', horseId)
        .single();

      if (error) {
        errorCrumb('profiles', 'Failed to fetch horse detail', error);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    fetchDetail();
  }, [horseId]);

  return { data, loading };
};
