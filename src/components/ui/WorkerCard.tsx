/**
 * FILE SUMMARY:
 * A compact, bilingual card for stable staff.
 * Features an instant "On-Site" toggle.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/WorkerCard.tsx
 */

import React from 'react';
import { toggleWorkerStatus } from '@/services/workerService';

interface WorkerProps {
  worker: { id: string; full_name: string; role: string; is_on_site: boolean };
  lang: 'en' | 'it';
}

export const WorkerCard: React.FC<WorkerProps> = ({ worker, lang }) => {
  const roles = {
    en: { groom: 'Groom', trainer: 'Trainer', night_watch: 'Night Watch' },
    it: { groom: 'Groom', trainer: 'Istruttore', night_watch: 'Guardia Notturna' }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div>
        <h4 className="font-bold text-slate-900">{worker.full_name}</h4>
        <p className="text-xs text-slate-500 uppercase font-semibold">
          {roles[lang][worker.role as keyof typeof roles['en']]}
        </p>
      </div>
      <button
        onClick={() => toggleWorkerStatus(worker.id, worker.is_on_site)}
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-colors ${
          worker.is_on_site ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
        }`}
      >
        {worker.is_on_site ? (lang === 'en' ? 'On Site' : 'Presente') : (lang === 'en' ? 'Away' : 'Assente')}
      </button>
    </div>
  );
};
