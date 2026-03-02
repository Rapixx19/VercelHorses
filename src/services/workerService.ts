/**
 * FILE SUMMARY:
 * Logic for updating and fetching worker data.
 * Includes "crumbs" for tracking on-site transitions.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/services/workerService.ts
 */

import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export const toggleWorkerStatus = async (workerId: string, currentStatus: boolean) => {
  const newStatus = !currentStatus;
  crumb('workers', `Toggling status for ${workerId} to ${newStatus}`);

  const { error } = await supabase
    .from('workers')
    .update({ is_on_site: newStatus })
    .eq('id', workerId);

  if (error) {
    errorCrumb('workers', 'Failed to toggle status', error);
    throw error;
  }

  return newStatus;
};
