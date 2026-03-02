/**
 * FILE SUMMARY:
 * Service to push alerts from the Web App to Telegram.
 * Used for critical events like "New Swiss IBAN Ingested."
 * Risk Zone: YELLOW (Outbound Notifications).
 * Path: src/services/telegramNotify.ts
 */

import { crumb, errorCrumb } from '@/lib/logger';

export const sendTelegramAlert = async (text: string) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

  crumb('telegram', `Sending alert: ${text.substring(0, 20)}...`);

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
    });
  } catch (e) {
    errorCrumb('telegram', 'Failed to send notification', e);
  }
};
