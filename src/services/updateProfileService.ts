/**
 * FILE SUMMARY:
 * Updates client/horse profiles with validated extraction data.
 * Risk Zone: RED (Database Writes from AI Data).
 * Path: src/services/updateProfileService.ts
 */

import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export const updateClientWithExtractedData = async (clientId: string, data: any) => {
  crumb('ingestion', `Updating client ${clientId} with approved AI data`);

  const { error } = await supabase
    .from('clients')
    .update({
      bank_iban: data.iban,
      bank_bic: data.bic,
      bank_clearing: data.clearing
    })
    .eq('id', clientId);

  if (error) {
    errorCrumb('ingestion', 'Failed to update approved data', error);
    throw error;
  }

  crumb('ingestion', 'Profile successfully synchronized with PDF data');
  return true;
};
