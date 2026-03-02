/**
 * FILE SUMMARY:
 * Fetch deep relational data for a specific horse/box.
 * Includes owner details, banking info, and document vault.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/hooks/useHorseDetails.ts
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export interface HorseDetails {
  id: string;
  name: string;
  microchip: string | null;
  box_id: string | null;
  clients: {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    language: string;
    bank_name: string | null;
    bank_iban: string | null;
    bank_bic: string | null;
    bank_clearing: string | null;
  } | null;
  documents: Array<{
    id: string;
    slot_index: number;
    file_url: string | null;
    kind: string | null;
  }>;
}

export const useHorseDetails = (horseId: string | null) => {
  const [details, setDetails] = useState<HorseDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!horseId) {
      setDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      crumb('details', `Fetching details for horse: ${horseId}`);

      const { data, error: fetchError } = await supabase
        .from('horses')
        .select(`
          *,
          clients:client_id (*),
          documents!documents_owner_id_fkey (*)
        `)
        .eq('id', horseId)
        .single();

      if (fetchError) {
        errorCrumb('details', 'Failed to fetch horse details', fetchError);
        setError(fetchError.message);
        setDetails(null);
      } else {
        setDetails(data as HorseDetails);
        crumb('details', `Loaded details for ${data?.name}`);
      }

      setLoading(false);
    };

    fetchDetails();
  }, [horseId]);

  return { details, loading, error };
};
