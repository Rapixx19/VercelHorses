/**
 * FILE SUMMARY:
 * Supabase Edge Function to handle Telegram Webhooks.
 * Receives button taps from workers and writes to service_logs.
 * Risk Zone: RED (External Input → Database).
 * Path: supabase/functions/telegram-bot/index.ts
 */

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { message, callback_query } = await req.json();

  // Logic: Identify the worker by their Telegram ID
  // Logic: If they tapped a service button, log it to Supabase

  console.log(`[TELEGRAM CRUMB] Received action: ${callback_query?.data || message?.text}`);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
