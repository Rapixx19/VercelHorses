/**
 * FILE SUMMARY:
 * Centralized "Crumb" logger for EquineOS.
 * Ensures consistent diagnostic markers across the app.
 * Path: src/lib/logger.ts
 */

export const crumb = (feature: string, action: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${feature.toUpperCase()}] ${action}`, data || '');
};

export const errorCrumb = (feature: string, message: string, error: unknown) => {
  console.error(`[ERROR] [${feature.toUpperCase()}] ${message}`, error);
  // Future: Send to Sentry or internal DB
};
