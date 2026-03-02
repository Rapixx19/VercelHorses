/**
 * FILE SUMMARY:
 * Single source of truth for stable services and pricing.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/lib/constants.ts
 */

export const STABLE_SERVICES = {
  BOARDING: { id: 'BOARDING', en: 'Monthly Boarding', it: 'Pensione Mensile', price: 800 },
  EXTRA_FEED: { id: 'EXTRA_FEED', en: 'Extra Feed', it: 'Mangime Extra', price: 15 },
  TRAINING: { id: 'TRAINING', en: 'Training Session', it: 'Sessione di Lavoro', price: 40 },
  VET: { id: 'VET', en: 'Vet Check', it: 'Controllo Veterinario', price: 50 },
  FARRIER: { id: 'FARRIER', en: 'Farrier', it: 'Maniscalco', price: 80 },
};

// Quick-log services (subset shown in the panel)
export const QUICK_LOG_SERVICES: ServiceID[] = ['EXTRA_FEED', 'TRAINING', 'VET', 'FARRIER'];

export type ServiceID = keyof typeof STABLE_SERVICES;
