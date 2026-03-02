/**
 * FILE SUMMARY:
 * High-level financial status card.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/BillingSummaryCard.tsx
 */

import React from 'react';
import { useBillingOverview } from '@/hooks/useBillingOverview';

export const BillingSummaryCard: React.FC<{ lang: 'en' | 'it' }> = ({ lang }) => {
  const { totalAccrued } = useBillingOverview();

  const t = {
    en: { title: 'Accrued Revenue', ready: 'Ready to Bill' },
    it: { title: 'Entrate Maturate', ready: 'Pronto da Fatturare' }
  }[lang];

  return (
    <div className="p-6 bg-blue-600 text-white rounded-3xl shadow-lg mb-8">
      <p className="text-xs font-bold uppercase tracking-widest opacity-80">{t.title}</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-4xl font-black">€{totalAccrued.toLocaleString()}</h2>
        <span className="text-sm font-medium opacity-90 italic">{t.ready}</span>
      </div>
    </div>
  );
};
