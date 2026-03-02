/**
 * FILE SUMMARY:
 * Modal to review data extracted by the MyPDF Engine.
 * Allows selective merging of Swiss bank details and horse info.
 * Risk Zone: YELLOW (Human-in-the-Loop).
 * Path: src/components/ui/ExtractionReview.tsx
 */

import React from 'react';

interface ExtractionReviewProps {
  currentData: any;
  extractedData: any;
  onConfirm: (mergedData: any) => void;
  onCancel: () => void;
  lang: 'en' | 'it';
}

export const ExtractionReview: React.FC<ExtractionReviewProps> = ({
  currentData, extractedData, onConfirm, onCancel, lang
}) => {
  const t = {
    en: { title: 'Review Extracted Data', accept: 'Accept All', reject: 'Discard' },
    it: { title: 'Revisione Dati Estratti', accept: 'Accetta Tutto', reject: 'Scarta' }
  }[lang];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
        <header className="p-6 border-b border-slate-100 bg-blue-50">
          <h2 className="text-xl font-black italic uppercase text-blue-900">{t.title}</h2>
        </header>

        <div className="p-6 space-y-4">
          {/* Comparison Row for IBAN */}
          {extractedData.iban && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Swiss IBAN</span>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-mono line-through opacity-40">{currentData.iban || 'N/A'}</span>
                <span className="text-xs font-mono font-bold text-green-600">→ {extractedData.iban}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 italic">
            {lang === 'en' ? 'Reviewing these changes will update the owner profile.' : 'La revisione di queste modifiche aggiornerà il profilo del proprietario.'}
          </p>
        </div>

        <footer className="p-6 flex gap-3 border-t border-slate-100">
          <button onClick={onCancel} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            {t.reject}
          </button>
          <button
            onClick={() => onConfirm(extractedData)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest"
          >
            {t.accept}
          </button>
        </footer>
      </div>
    </div>
  );
};
