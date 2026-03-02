/**
 * FILE SUMMARY:
 * A stylized card representing a single horse stall.
 * Handles three states: Occupied (Red), Free (Green), Maintenance (Yellow).
 * Path: src/components/ui/BoxCard.tsx
 */

import React from 'react';
import { HorseProfile } from '../../types/stable';

interface BoxCardProps {
  id: string;
  status: 'occupied' | 'free' | 'maintenance';
  horse?: HorseProfile;
  lang: 'en' | 'es';
}

export const BoxCard: React.FC<BoxCardProps> = ({ id, status, horse, lang }) => {
  const styles = {
    occupied: 'border-red-400 bg-red-50 text-red-900',
    free: 'border-emerald-400 bg-emerald-50 text-emerald-900',
    maintenance: 'border-amber-400 bg-amber-50 text-amber-900',
  };

  const labels = {
    en: { stall: 'Stall', empty: 'Vacant', repair: 'Cleaning' },
    es: { stall: 'Box', empty: 'Libre', repair: 'Limpieza' },
  };

  return (
    <div className={`p-4 border-2 rounded-2xl shadow-sm transition-all hover:shadow-md ${styles[status]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
          {labels[lang].stall} {id}
        </span>
        <div className={`w-2 h-2 rounded-full ${status === 'free' ? 'bg-emerald-500' : 'bg-current'}`} />
      </div>
      <h3 className="text-lg font-bold truncate">
        {status === 'occupied' ? horse?.name : status === 'maintenance' ? labels[lang].repair : labels[lang].empty}
      </h3>
    </div>
  );
};
