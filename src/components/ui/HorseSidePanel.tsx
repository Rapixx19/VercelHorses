/**
 * FILE SUMMARY:
 * A slide-over drawer showing horse and owner details.
 * Displays Swiss Bank Details and the 5-slot PDF Vault.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/HorseSidePanel.tsx
 */

import React from 'react';
import { useHorseDetail } from '@/hooks/useHorseDetail';

interface PanelProps {
  horseId: string | null;
  onClose: () => void;
  lang: 'en' | 'it';
}

export const HorseSidePanel: React.FC<PanelProps> = ({ horseId, onClose, lang }) => {
  const { data, loading } = useHorseDetail(horseId);

  if (!horseId) return null;

  const t = {
    en: { owner: 'Owner', bank: 'Swiss Bank Details', vault: 'Document Vault' },
    it: { owner: 'Proprietario', bank: 'Dettagli Bancari Svizzeri', vault: 'Documenti' }
  }[lang];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl p-6 z-50 border-l border-slate-200 transform transition-transform">
      <button onClick={onClose} className="mb-4 text-slate-400 hover:text-slate-900">✕ Close</button>

      {loading ? (
        <p className="animate-pulse">Loading profile...</p>
      ) : data && (
        <div className="space-y-6">
          <header>
            <h2 className="text-2xl font-black uppercase italic">{data.name}</h2>
            <p className="text-sm text-slate-500">{t.owner}: {data.clients?.full_name}</p>
          </header>

          <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase mb-2 text-blue-600">{t.bank}</h3>
            <p className="text-xs font-mono">{data.clients?.bank_iban}</p>
            <p className="text-[10px] text-slate-400 uppercase mt-1">BIC: {data.clients?.bank_bic}</p>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase mb-3">{t.vault}</h3>
            <div className="space-y-2">
              {/* Logic: Map through 5 document slots */}
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between p-2 border-dashed border-2 border-slate-100 rounded-lg text-[10px] text-slate-400 uppercase">
                  Slot {i}: Empty
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
