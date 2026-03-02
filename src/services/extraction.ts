/**
 * FILE SUMMARY:
 * Enhanced extraction logic for Swiss Banking Details.
 * Detects CH-prefix IBANs and BIC codes.
 * Risk Zone: YELLOW (Business Logic).
 * Path: src/services/extraction.ts
 */

import { crumb } from '@/lib/logger';

// Known Swiss bank BIC prefixes
const SWISS_BANK_BICS: Record<string, string> = {
  'UBSWCHZH': 'UBS Switzerland',
  'CRESCHZZ': 'Credit Suisse',
  'ZKBKCHZZ': 'Zürcher Kantonalbank',
  'RAABORAC': 'Raiffeisen Switzerland',
  'PABORAC': 'PostFinance',
  'BABORAC': 'Banque Cantonale',
};

export const extractSwissBankDetails = (text: string) => {
  crumb('extraction', 'Scanning for Swiss financial patterns');

  // Regex for Swiss IBAN: CHxx xxxx xxxx xxxx xxxx x
  const ibanRegex = /CH\d{2}[ ]?\d{4}[ ]?\d{4}[ ]?\d{4}[ ]?\d{4}[ ]?\d{1}/;
  const bicRegex = /[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?/;

  const iban = text.match(ibanRegex)?.[0];
  const bic = text.match(bicRegex)?.[0];

  // Flag Swiss IBAN detection
  if (iban) {
    crumb('extraction', `🇨🇭 Swiss IBAN detected: ${iban.substring(0, 4)}****`);
  }

  // Flag Swiss bank detection by BIC
  if (bic) {
    const bicPrefix = bic.substring(0, 8);
    const bankName = SWISS_BANK_BICS[bicPrefix];

    if (bankName) {
      crumb('extraction', `🇨🇭 Swiss Bank detected: ${bankName} (${bicPrefix})`);
    } else if (bic.includes('CH')) {
      crumb('extraction', `🇨🇭 Swiss BIC detected: ${bicPrefix}`);
    } else {
      crumb('extraction', `BIC detected (non-Swiss): ${bicPrefix}`);
    }
  }

  return { iban, bic };
};

export const extractDataFromPDF = async (fileUrl: string) => {
  crumb('extraction', `Processing PDF extraction for: ${fileUrl}`);

  // Placeholder for PDF parsing - will integrate with PyMuPDF or pdf-parse
  return {
    microchip: null,
    iban: null,
  };
};
