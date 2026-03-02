/**
 * FILE SUMMARY:
 * Service for managing the lifecycle of finalized invoices.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/services/invoiceService.ts
 */

import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export const updateInvoiceStatus = async (invoiceId: string, status: InvoiceStatus) => {
  crumb('billing', `Updating Invoice ${invoiceId} status to: ${status}`);

  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId);

  if (error) {
    errorCrumb('billing', 'Failed to update invoice status', error);
    throw error;
  }

  crumb('billing', 'Status update confirmed');
  return true;
};
