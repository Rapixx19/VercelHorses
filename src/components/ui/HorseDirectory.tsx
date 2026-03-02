/**
 * FILE SUMMARY:
 * A high-fidelity directory of all horses with ID and Owner tracking.
 * Shows microchip, box assignment, and document vault access.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/HorseDirectory.tsx
 */

'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb } from '@/lib/logger';

interface HorseWithRelations {
  id: string;
  name: string;
  microchip: string | null;
  box_id: string | null;
  clients: {
    id: string;
    full_name: string;
  } | null;
}

interface HorseDirectoryProps {
  lang: 'en' | 'it';
  onSelectHorse?: (horseId: string) => void;
  onOpenVault?: (horseId: string) => void;
}

export const HorseDirectory: React.FC<HorseDirectoryProps> = ({
  lang,
  onSelectHorse,
  onOpenVault
}) => {
  const [horses, setHorses] = useState<HorseWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHorses = async () => {
      crumb('directory', 'Fetching horse directory');

      const { data } = await supabase
        .from('horses')
        .select(`
          id,
          name,
          microchip,
          box_id,
          clients:client_id (
            id,
            full_name
          )
        `)
        .order('name', { ascending: true });

      setHorses((data as HorseWithRelations[]) || []);
      setLoading(false);
      crumb('directory', `Loaded ${data?.length || 0} horses`);
    };

    fetchHorses();
  }, []);

  const t = {
    en: {
      title: 'Horse Profiles',
      owner: 'Owner',
      micro: 'Microchip',
      box: 'Box',
      away: 'Away',
      notRegistered: 'NOT REGISTERED',
      vault: 'Vault',
      noHorses: 'No horses registered yet'
    },
    it: {
      title: 'Anagrafica Cavalli',
      owner: 'Proprietario',
      micro: 'Microchip',
      box: 'Box',
      away: 'Fuori',
      notRegistered: 'NON REGISTRATO',
      vault: 'Archivio',
      noHorses: 'Nessun cavallo registrato'
    }
  }[lang];

  if (loading) {
    return (
      <div className="p-10 animate-pulse text-xs font-black uppercase text-slate-300">
        Syncing Asset Profiles...
      </div>
    );
  }

  if (horses.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400">
        <p className="text-sm">{t.noHorses}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tight">{t.title}</h2>
        <span className="text-xs font-bold text-slate-400 uppercase">
          {horses.length} {horses.length === 1 ? 'horse' : 'horses'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {horses.map((horse) => {
          const isInStall = !!horse.box_id;
          const hasMicrochip = !!horse.microchip;

          return (
            <div
              key={horse.id}
              onClick={() => onSelectHorse?.(horse.id)}
              className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                onSelectHorse ? 'cursor-pointer hover:border-blue-200 active:scale-[0.98]' : ''
              }`}
            >
              {/* Box Badge */}
              <div
                className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  isInStall
                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                    : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}
              >
                {isInStall ? `${t.box} ${horse.box_id}` : t.away}
              </div>

              {/* Horse Info */}
              <div className="mb-6 pr-20">
                <h3 className="text-xl font-black uppercase tracking-tight leading-none mb-1">
                  {horse.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {t.owner}:{' '}
                  <span className="text-slate-900">
                    {horse.clients?.full_name || '—'}
                  </span>
                </p>
              </div>

              {/* Microchip Section */}
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-2xl border ${
                    hasMicrochip
                      ? 'bg-slate-50 border-slate-100'
                      : 'bg-amber-50 border-amber-100'
                  }`}
                >
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">
                    {t.micro}
                  </p>
                  <p
                    className={`font-mono text-xs tracking-wider ${
                      hasMicrochip ? 'text-slate-700' : 'text-amber-600'
                    }`}
                  >
                    {horse.microchip || t.notRegistered}
                  </p>
                </div>

                {/* Action Row */}
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5">
                      Status
                    </p>
                    <p className="text-[10px] font-bold">
                      {isInStall ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenVault?.(horse.id);
                    }}
                    className="px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors active:scale-95"
                  >
                    {t.vault}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
