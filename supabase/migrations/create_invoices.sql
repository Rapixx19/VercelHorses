/**
 * FILE SUMMARY:
 * Table for tracking finalized monthly invoices.
 * Risk Zone: RED (Schema Change).
 * Path: supabase/migrations/create_invoices.sql
 */

CREATE TABLE invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  total_amount numeric NOT NULL,
  currency text DEFAULT 'EUR',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
  billing_period_start date,
  billing_period_end date,
  created_at timestamp with time zone DEFAULT now()
);

-- Add invoice_id to service_logs to link them
ALTER TABLE service_logs ADD COLUMN IF NOT EXISTS invoice_id uuid REFERENCES invoices(id);

-- RLS Policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert invoices" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update invoices" ON invoices FOR UPDATE USING (true);
