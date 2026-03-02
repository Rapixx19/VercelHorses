/**
 * FILE SUMMARY:
 * Single source of truth for stable services and pricing.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/lib/constants.ts
 */

export const STABLE_SERVICES = {
  BOARDING: { id: 'BOARDING', en: 'Monthly Boarding', it: 'Pensione Mensile', price: 800 },
  FARRIER: { id: 'FARRIER', en: 'Farrier Visit', it: 'Visita Maniscalco', price: 60 },
  TRAINING: { id: 'TRAINING', en: 'Training Session', it: 'Sessione di Addestramento', price: 45 },
  VET: { id: 'VET', en: 'Vet Checkup', it: 'Controllo Veterinario', price: 0 }, // Variable
};

export type ServiceID = keyof typeof STABLE_SERVICES;
