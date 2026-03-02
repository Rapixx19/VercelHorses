/**
 * FILE SUMMARY:
 * A scrollable sidebar for managing past invoices.
 * Color-coded by status (Paid/Sent/Draft).
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/InvoiceHistory.tsx
 */

import React from 'react';
import { updateInvoiceStatus, InvoiceStatus } from '@/services/invoiceService';

interface Invoice {
  id: string;
  total_amount: number;
  status: InvoiceStatus;
  created_at: string;
  client_name: string;
}

export const InvoiceHistory: React.FC<{
  invoices: Invoice[];
  lang: 'en' | 'it';
}> = ({ invoices, lang }) => {
  const t = {
    en: { history: 'Invoice History', paid: 'Paid', sent: 'Sent', draft: 'Draft' },
    it: { history: 'Storico Fatture', paid: 'Pagata', sent: 'Inviata', draft: 'Bozza' }
  }[lang];

  const statusColors = {
    paid: 'bg-green-100 text-green-700',
    sent: 'bg-blue-100 text-blue-700',
    draft: 'bg-slate-100 text-slate-500'
  };

  return (
    <div className="w-80 border-l border-slate-200 bg-white h-screen p-6 overflow-y-auto">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
        {t.history}
      </h3>

      <div className="space-y-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}>
                {t[inv.status]}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">#{inv.id.slice(0, 5)}</span>
            </div>

            <p className="text-sm font-bold text-slate-900 truncate">{inv.client_name}</p>
            <p className="text-lg font-black text-blue-600">€{inv.total_amount.toFixed(2)}</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                className="text-[10px] font-bold uppercase text-blue-600 hover:underline"
              >
                {lang === 'en' ? 'Mark Paid' : 'Segna Pagata'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
