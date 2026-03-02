/**
 * FILE SUMMARY:
 * Fetches all boxes with their horses from Supabase.
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

  useEffect(() => {
    const fetchBoxes = async () => {
      crumb('stable', 'Fetching 25 boxes with horse data');

      const { data, error: fetchError } = await supabase
        .from('boxes')
        .select(`
          id,
          status,
          horses (
            name
          )
        `)
        .order('id', { ascending: true });

      if (fetchError) {
        errorCrumb('stable', 'Failed to fetch boxes', fetchError);
        setError(fetchError.message);
      } else {
        // Flatten horses array to single horse object (1 horse per box)
        const processed = data?.map(box => ({
          ...box,
          horses: box.horses?.[0] || null
        })) || [];
        setBoxes(processed);
        crumb('stable', `Loaded ${processed.length} boxes`);
      }

      setLoading(false);
    };

    fetchBoxes();
  }, []);

  return { boxes, loading, error };
};
