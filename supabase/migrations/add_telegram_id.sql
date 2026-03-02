/**
 * FILE SUMMARY:
 * Adds telegram_id to workers for bot authentication.
 * Risk Zone: RED (Schema Change).
 * Path: supabase/migrations/add_telegram_id.sql
 */

ALTER TABLE workers
ADD COLUMN IF NOT EXISTS telegram_handle text,
ADD COLUMN IF NOT EXISTS telegram_id bigint UNIQUE;
