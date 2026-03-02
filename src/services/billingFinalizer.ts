/**
 * FILE SUMMARY:
 * Logic to finalize pending logs into a formal Invoice record.
 * Risk Zone: RED (Direct Financial Impact).
 * Path: src/services/billingFinalizer.ts
 */

import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export const finalizeInvoicesForClient = async (clientId: string, amount: number) => {
  crumb('billing', `Finalizing €${amount} for Client ${clientId}`);

  // 1. Create the Invoice record
  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .insert({ client_id: clientId, total_amount: amount })
    .select()
    .single();

  if (invError) {
    errorCrumb('billing', 'Failed to create invoice record', invError);
    throw invError;
  }

  // 2. Link all unbilled logs to this invoice and mark as billed
  const { error: logError } = await supabase
    .from('service_logs')
    .update({ is_billed: true, invoice_id: invoice.id })
    .eq('horse_id', clientId) // Assuming 1:1 for this simple loop
    .eq('is_billed', false);

  if (logError) {
    errorCrumb('billing', 'Failed to update service logs', logError);
    throw logError;
  }

  crumb('billing', `Invoice ${invoice.id} finalized successfully.`);
  return invoice;
};
