/**
 * FILE SUMMARY:
 * One-tap buttons for workers to log services.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/QuickLog.tsx
 */

import React from 'react';
import { STABLE_SERVICES, ServiceID } from '@/lib/constants';
import { logHorseService } from '@/services/logService';

export const QuickLog: React.FC<{ horseId: string; lang: 'en' | 'it' }> = ({ horseId, lang }) => {
  const handleLog = async (id: ServiceID) => {
    try {
      await logHorseService(horseId, id);
      alert(lang === 'en' ? 'Logged!' : 'Registrato!');
    } catch (e) {
      alert('Error');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {(Object.keys(STABLE_SERVICES) as ServiceID[]).map((key) => (
        <button
          key={key}
          onClick={() => handleLog(key)}
          className="p-3 text-[10px] font-bold uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
        >
          {STABLE_SERVICES[key][lang]}
        </button>
      ))}
    </div>
  );
};
