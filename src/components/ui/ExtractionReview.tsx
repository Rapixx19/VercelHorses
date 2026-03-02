/**
 * FILE SUMMARY:
 * Confirmation UI for AI-extracted data.
 * Allows approval before saving to permanent record.
 * Risk Zone: YELLOW (Human-in-the-Loop).
 * Path: src/components/ui/ExtractionReview.tsx
 */

'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';
import { ExtractionResult } from '@/hooks/useExtraction';

interface ExtractionReviewProps {
  suggestion: ExtractionResult;
  type: 'horse' | 'client';
  id: string;
  onComplete: () => void;
  lang: 'en' | 'it';
}

const FIELD_LABELS: Record<string, { en: string; it: string }> = {
  microchip: { en: 'Microchip ID', it: 'ID Microchip' },
  passport_number: { en: 'Passport Number', it: 'Numero Passaporto' },
  bank_iban: { en: 'Swiss IBAN', it: 'IBAN Svizzero' },
  bank_bic: { en: 'BIC / SWIFT', it: 'BIC / SWIFT' },
  bank_name: { en: 'Bank Name', it: 'Nome Banca' },
  bank_clearing: { en: 'Clearing Number', it: 'Numero Clearing' }
};

export const ExtractionReview: React.FC<ExtractionReviewProps> = ({
  suggestion,
  type,
  id,
  onComplete,
  lang
}) => {
  const [saving, setSaving] = useState(false);

  if (!suggestion) return null;

  const t = {
    en: {
      title: 'AI Found Data',
      subtitle: 'Should we update the profile with these details?',
      ignore: 'Ignore',
      update: 'Update Profile',
      saving: 'Saving...'
    },
    it: {
      title: 'Dati Estratti',
      subtitle: 'Vuoi aggiornare il profilo con questi dettagli?',
      ignore: 'Ignora',
      update: 'Aggiorna Profilo',
      saving: 'Salvataggio...'
    }
  }[lang];

  const handleApprove = async () => {
    setSaving(true);
    const table = type === 'horse' ? 'horses' : 'clients';

    crumb('extraction', `Saving extracted data to ${table}`, suggestion);

    try {
      const { error } = await supabase.from(table).update(suggestion).eq('id', id);

      if (error) throw error;

      crumb('extraction', 'Profile updated successfully');
      onComplete();
    } catch (err) {
      errorCrumb('extraction', 'Failed to update profile', err);
      setSaving(false);
    }
  };

  const entries = Object.entries(suggestion).filter(
    ([, val]) => val !== null && val !== undefined
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* AI Icon */}
        <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-xl">
          <span role="img" aria-label="AI">
            🤖
          </span>
        </div>

        {/* Header */}
        <div>
          <h2 className="text-xl font-black uppercase italic leading-tight">{t.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{t.subtitle}</p>
        </div>

        {/* Extracted Fields */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {entries.map(([key, val]) => (
            <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black uppercase text-blue-500 mb-1">
                {FIELD_LABELS[key]?.[lang] || key.replace(/_/g, ' ')}
              </p>
              <p className="text-xs font-bold text-slate-900 font-mono">{String(val)}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onComplete}
            disabled={saving}
            className="flex-1 py-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {t.ignore}
          </button>
          <button
            onClick={handleApprove}
            disabled={saving}
            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-500 transition-colors disabled:opacity-50 active:scale-95"
          >
            {saving ? t.saving : t.update}
          </button>
        </div>
      </div>
    </div>
  );
};
