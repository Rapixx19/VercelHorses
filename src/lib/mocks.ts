/**
 * FILE SUMMARY:
 * Mock data for development and UI testing.
 * Simulates the Supabase response for Horses and Stable occupancy.
 * Path: src/lib/mocks.ts
 */

import { HorseProfile } from '../types/stable';

export const MOCK_HORSES: HorseProfile[] = [
  { id: 'h1', name: 'Thunder', ownerId: 'c1', boxId: '101', vaultDocs: [] },
  { id: 'h2', name: 'Storm', ownerId: 'c2', boxId: '102', vaultDocs: [] },
  { id: 'h3', name: 'Goldie', ownerId: 'c1', boxId: '105', vaultDocs: [] },
];

export const MOCK_BOXES = Array.from({ length: 12 }, (_, i) => ({
  id: (101 + i).toString(),
  status: i === 2 ? 'maintenance' : i < 3 ? 'occupied' : 'free',
  horse: MOCK_HORSES.find(h => h.boxId === (101 + i).toString())
}));
