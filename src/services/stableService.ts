/**
 * FILE SUMMARY:
 * Modular service for Stable data fetching.
 * Uses the Crumb Logger for high observability.
 * Path: src/services/stableService.ts
 */

import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export const getBoxOccupancy = async () => {
  crumb('stable', 'Fetching all box data');

  const { data, error } = await supabase
    .from('boxes')
    .select('*, horses(name)')
    .order('id');

  if (error) {
    errorCrumb('stable', 'Failed to fetch boxes', error);
    throw error;
  }

  crumb('stable', `Successfully fetched ${data.length} boxes`);
  return data;
};
