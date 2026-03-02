/**
 * FILE SUMMARY:
 * Smart card that displays live occupancy data.
 * Shows horse name + owner from relational join.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/BoxCard.tsx
 */

'use client';
import React from 'react';

interface Horse {
  name: string;
  microchip?: string;
  clients?: {
    full_name: string;
  };
}

interface BoxCardProps {
  id: string;
  status: 'free' | 'occupied' | 'maintenance' | 'cleaning';
  horses?: Horse | Horse[];
  lang: 'en' | 'it';
  onClick?: () => void;
}

export const BoxCard: React.FC<BoxCardProps> = ({ id, status, horses, lang, onClick }) => {
  // Extract relational data if horse exists (handle array or single object)
  const horse = Array.isArray(horses) ? horses[0] : horses;
  const ownerName = horse?.clients?.full_name;

  const labels = {
    en: { stall: 'Stall', free: 'Vacant', occupied: 'Occupied', cleaning: 'Cleaning', maintenance: 'Maint.' },
    it: { stall: 'Box', free: 'Libero', occupied: 'Occupato', cleaning: 'Pulizia', maintenance: 'Manutenzione' }
  }[lang];

  const statusColors = {
    free: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400',
    occupied: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400',
    cleaning: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400',
    maintenance: 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-400'
  };

  const dotColors = {
    free: 'bg-emerald-500',
    occupied: 'bg-rose-500',
    cleaning: 'bg-amber-500',
    maintenance: 'bg-slate-400'
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-3xl border-2 transition-all ${statusColors[status]} hover:shadow-lg cursor-pointer active:scale-95`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">
          {labels.stall} {id}
        </span>
        <div className={`h-2 w-2 rounded-full ${dotColors[status]}`} />
      </div>

      <div className="h-12 flex flex-col justify-center">
        {horse ? (
          <>
            <h3 className="text-sm font-black uppercase truncate tracking-tight">{horse.name}</h3>
            {ownerName && (
              <p className="text-[9px] font-bold opacity-60 truncate uppercase">{ownerName}</p>
            )}
          </>
        ) : (
          <h3 className="text-xs font-bold uppercase opacity-40 italic">
            {labels[status] || labels.free}
          </h3>
        )}
      </div>
    </div>
  );
};
