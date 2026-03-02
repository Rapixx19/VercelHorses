/**
 * FILE SUMMARY:
 * Core type definitions for the Stable Management System.
 * Supports bilingual preferences and profile structures.
 * Path: src/types/stable.ts
 */

export type Language = 'en' | 'it';

export interface StableProfile {
  id: string;
  name: string;
  logoUrl: string;
  totalBoxes: number;
  bankDetails: { iban: string; swift: string };
}

export interface HorseProfile {
  id: string;
  name: string;
  ownerId: string;
  boxId: string;
  microchip?: string;
  vaultDocs: string[]; // Limited to 5
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  lang: Language;
  vaultDocs: string[]; // Limited to 5
}
