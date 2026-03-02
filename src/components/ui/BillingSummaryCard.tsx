/**
 * FILE SUMMARY:
 * High-visibility revenue tracking for the dashboard header.
 * Shows real-time unbilled revenue with invoice generation CTA.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/BillingSummaryCard.tsx
 */

'use client';
import React from 'react';
import { useFinanceStats } from '@/hooks/useFinanceStats';

interface BillingSummaryCardProps {
  lang: 'en' | 'it';
  onGenerateInvoices?: () => void;
}

export const BillingSummaryCard: React.FC<BillingSummaryCardProps> = ({
  lang,
  onGenerateInvoices
}) => {
  const { stats, loading } = useFinanceStats();

  const t = {
    en: {
      title: 'Accrued Revenue',
      subtitle: 'Unbilled this month',
      action: 'Generate Invoices',
      logs: 'service logs',
      clients: 'clients'
    },
    it: {
      title: 'Ricavi Maturati',
      subtitle: 'Non fatturati questo mese',
      action: 'Genera Fatture',
      logs: 'servizi registrati',
      clients: 'clienti'
    }
  }[lang];

  return (
    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 overflow-hidden relative">
      {/* Decorative Background Element */}
      <div className="absolute -right-10 -top-10 h-40 w-40 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-60 w-60 bg-emerald-600/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">
              {t.title}
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-black italic tracking-tighter">
                {loading ? '---' : `€${stats.totalAccrued.toLocaleString()}`}
              </h2>
              <span className="text-xs font-bold text-slate-400">EUR</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">{t.subtitle}</p>
          </div>

          <button
            onClick={onGenerateInvoices}
            disabled={loading || stats.totalAccrued === 0}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg shadow-blue-600/30"
          >
            {t.action}
          </button>
        </div>

        {/* Stats Row */}
        {!loading && (
          <div className="flex gap-6 mt-6 pt-6 border-t border-slate-800">
            <div>
              <p className="text-2xl font-black">{stats.totalLogs}</p>
              <p className="text-[10px] uppercase text-slate-500 font-bold">{t.logs}</p>
            </div>
            <div>
              <p className="text-2xl font-black">{stats.clientBreakdown.length}</p>
              <p className="text-[10px] uppercase text-slate-500 font-bold">{t.clients}</p>
            </div>
            {stats.pendingInvoices > 0 && (
              <div>
                <p className="text-2xl font-black text-amber-400">{stats.pendingInvoices}</p>
                <p className="text-[10px] uppercase text-slate-500 font-bold">drafts</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
