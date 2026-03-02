/**
 * FILE SUMMARY:
 * Trigger AI parsing on a new vault document.
 * Extracts microchip IDs, Swiss IBANs, and other identifiers.
 * Risk Zone: YELLOW (AI Integration).
 * Path: src/hooks/useExtraction.ts
 */

import { useState } from 'react';
import { crumb, errorCrumb } from '@/lib/logger';

export interface HorseExtraction {
  microchip?: string;
  passport_number?: string;
}

export interface ClientExtraction {
  bank_iban?: string;
  bank_bic?: string;
  bank_name?: string;
  bank_clearing?: string;
}

export type ExtractionResult = HorseExtraction | ClientExtraction;

interface UseExtractionReturn {
  suggestion: ExtractionResult | null;
  loading: boolean;
  error: string | null;
  runExtraction: (fileUrl: string, type: 'horse' | 'client') => Promise<void>;
  clearSuggestion: () => void;
}

export const useExtraction = (): UseExtractionReturn => {
  const [suggestion, setSuggestion] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runExtraction = async (fileUrl: string, type: 'horse' | 'client') => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    crumb('extraction', `Starting ${type} extraction from: ${fileUrl}`);

    try {
      // In production, this calls a Supabase Edge Function or AI Endpoint
      // Example: const { data } = await supabase.functions.invoke('extract-document', { body: { fileUrl, type } });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock extraction results based on document type
      const mockData: ExtractionResult =
        type === 'horse'
          ? {
              microchip: '756' + Math.random().toString().slice(2, 14),
              passport_number: `CH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`
            }
          : {
              bank_iban: 'CH93 0076 2011 6238 5295 7',
              bank_bic: 'UBSWCHZH80A',
              bank_name: 'UBS Switzerland AG',
              bank_clearing: '230'
            };

      setSuggestion(mockData);
      crumb('extraction', 'Extraction complete', mockData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Extraction failed';
      errorCrumb('extraction', message, err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearSuggestion = () => {
    setSuggestion(null);
    setError(null);
  };

  return { suggestion, loading, error, runExtraction, clearSuggestion };
};
