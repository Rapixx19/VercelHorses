/**
 * FILE SUMMARY:
 * Unified search engine for the stable.
 * Searches across Horses, Clients, and Invoice IDs.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/services/searchService.ts
 */

import { supabase } from '@/lib/supabase';
import { crumb } from '@/lib/logger';

export const globalSearch = async (query: string) => {
  if (query.length < 2) return { horses: [], clients: [], invoices: [] };

  crumb('search', `Querying database for: "${query}"`);

  const [horses, clients, invoices] = await Promise.all([
    supabase.from('horses').select('id, name').ilike('name', `%${query}%`),
    supabase.from('clients').select('id, full_name').ilike('full_name', `%${query}%`),
    supabase.from('invoices').select('id, total_amount').ilike('id', `%${query}%`)
  ]);

  return {
    horses: horses.data || [],
    clients: clients.data || [],
    invoices: invoices.data || []
  };
};
