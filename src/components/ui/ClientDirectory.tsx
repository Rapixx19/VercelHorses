/**
 * FILE SUMMARY:
 * A high-end directory of all stable owners and their profiles.
 * Shows horse count and Swiss Banking status at a glance.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/ClientDirectory.tsx
 */

'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb } from '@/lib/logger';

interface ClientWithHorses {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  language: string;
  bank_name: string | null;
  bank_iban: string | null;
  bank_bic: string | null;
  horses: { count: number }[];
}

interface ClientDirectoryProps {
  lang: 'en' | 'it';
  onSelectClient?: (clientId: string) => void;
}

export const ClientDirectory: React.FC<ClientDirectoryProps> = ({ lang, onSelectClient }) => {
  const [clients, setClients] = useState<ClientWithHorses[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      crumb('directory', 'Fetching client directory');

      const { data } = await supabase
        .from('clients')
        .select('*, horses(count)')
        .order('full_name', { ascending: true });

      setClients((data as ClientWithHorses[]) || []);
      setLoading(false);
      crumb('directory', `Loaded ${data?.length || 0} clients`);
    };

    fetchClients();
  }, []);

  const t = {
    en: {
      title: 'Client Directory',
      horses: 'Horses',
      horse: 'Horse',
      banking: 'Swiss Banking',
      missingIban: 'IBAN MISSING',
      noClients: 'No clients registered yet'
    },
    it: {
      title: 'Anagrafica Clienti',
      horses: 'Cavalli',
      horse: 'Cavallo',
      banking: 'Dati Bancari Svizzeri',
      missingIban: 'IBAN MANCANTE',
      noClients: 'Nessun cliente registrato'
    }
  }[lang];

  if (loading) {
    return (
      <div className="p-10 animate-pulse text-xs font-black uppercase text-slate-300">
        Syncing Directory...
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400">
        <p className="text-sm">{t.noClients}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tight">{t.title}</h2>
        <span className="text-xs font-bold text-slate-400 uppercase">
          {clients.length} {clients.length === 1 ? 'client' : 'clients'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((client) => {
          const horseCount = client.horses?.[0]?.count || 0;
          const hasIban = !!client.bank_iban;

          return (
            <div
              key={client.id}
              onClick={() => onSelectClient?.(client.id)}
              className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all ${
                onSelectClient ? 'cursor-pointer hover:border-blue-200 active:scale-[0.98]' : ''
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black uppercase tracking-tight truncate">
                      {client.full_name}
                    </h3>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-black uppercase">
                      {client.language?.toUpperCase() || 'IT'}
                    </span>
                  </div>
                  {client.email && (
                    <p className="text-xs text-slate-400 font-medium truncate mt-1">
                      {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {client.phone}
                    </p>
                  )}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ml-2 ${
                    horseCount > 0
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}
                >
                  {horseCount} {horseCount === 1 ? t.horse : t.horses}
                </span>
              </div>

              {/* Banking Section */}
              <div className="pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] font-black uppercase text-blue-500 tracking-tighter">
                    {t.banking}
                  </p>
                  {!hasIban && (
                    <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-black">
                      !
                    </span>
                  )}
                </div>

                <div
                  className={`p-3 rounded-xl font-mono text-[10px] truncate ${
                    hasIban
                      ? 'bg-slate-50 text-slate-600'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}
                >
                  {client.bank_iban || t.missingIban}
                </div>

                {hasIban && client.bank_name && (
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">
                    {client.bank_name}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
