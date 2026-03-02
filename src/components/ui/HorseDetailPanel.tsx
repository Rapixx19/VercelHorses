/**
 * FILE SUMMARY:
 * iOS-style slide-over panel for deep horse/client data.
 * Shows owner info, Swiss banking, and 5-slot document vault.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/HorseDetailPanel.tsx
 */

'use client';
import React from 'react';
import { useHorseDetails } from '@/hooks/useHorseDetails';
import { QuickLogButtons } from './QuickLogButtons';

interface HorseDetailPanelProps {
  horseId: string | null;
  boxId?: string;
  onClose: () => void;
  lang: 'en' | 'it';
}

const DOCUMENT_SLOTS = ['Passport', 'Medical', 'Insurance', 'Contract', 'Pedigree'];
const DOCUMENT_SLOTS_IT = ['Passaporto', 'Medico', 'Assicurazione', 'Contratto', 'Pedigree'];

export const HorseDetailPanel: React.FC<HorseDetailPanelProps> = ({ horseId, boxId, onClose, lang }) => {
  const { details, loading } = useHorseDetails(horseId);

  if (!horseId) return null;

  const t = {
    en: {
      close: 'Close',
      owner: 'Owner',
      contact: 'Contact',
      bank: 'Swiss Banking',
      vault: 'Document Vault',
      microchip: 'Microchip',
      slots: DOCUMENT_SLOTS
    },
    it: {
      close: 'Chiudi',
      owner: 'Proprietario',
      contact: 'Contatto',
      bank: 'Dati Bancari Svizzeri',
      vault: 'Archivio Documenti',
      microchip: 'Microchip',
      slots: DOCUMENT_SLOTS_IT
    }
  }[lang];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[100] transform transition-transform border-l border-slate-100 animate-in slide-in-from-right duration-300">
        <div className="p-8 h-full overflow-y-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <button
              onClick={onClose}
              className="text-xs font-black uppercase opacity-30 hover:opacity-100 transition-opacity"
            >
              {t.close} &times;
            </button>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-slate-100 rounded-xl w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-40 bg-slate-50 rounded-3xl" />
              <div className="h-32 bg-slate-50 rounded-3xl" />
            </div>
          ) : details ? (
            <>
              {/* Horse Header */}
              <section>
                <h2 className="text-3xl font-black tracking-tight italic uppercase text-slate-900">
                  {details.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                    Box {details.box_id || boxId}
                  </span>
                  {details.microchip && (
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded-full">
                      {details.microchip}
                    </span>
                  )}
                </div>
              </section>

              {/* Quick Log Buttons */}
              <QuickLogButtons
                horseId={details.id}
                horseName={details.name}
                lang={lang}
              />

              {/* Owner Section */}
              {details.clients && (
                <section className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-400">{t.owner}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{details.clients.full_name}</span>
                    <span className="text-[10px] bg-white px-2 py-1 rounded-full border border-slate-200 uppercase font-black">
                      {details.clients.language?.toUpperCase() || 'IT'}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-300">{t.contact}</p>
                    {details.clients.email && (
                      <p className="text-sm text-slate-600">{details.clients.email}</p>
                    )}
                    {details.clients.phone && (
                      <p className="text-sm text-slate-600 font-mono">{details.clients.phone}</p>
                    )}
                  </div>
                </section>
              )}

              {/* Swiss Banking Section */}
              {details.clients && (
                <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-400">{t.bank}</h3>

                  {details.clients.bank_name && (
                    <div className="text-sm font-bold text-slate-700 mb-2">
                      {details.clients.bank_name}
                    </div>
                  )}

                  <div className="font-mono text-xs p-4 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100 space-y-3">
                    <div>
                      <p className="text-[10px] opacity-60 uppercase mb-1">IBAN</p>
                      <p className="font-bold select-all tracking-wider">
                        {details.clients.bank_iban || '—'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-100">
                      <div>
                        <p className="text-[10px] opacity-60 uppercase mb-1">BIC</p>
                        <p className="font-bold">{details.clients.bank_bic || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-60 uppercase mb-1">Clearing</p>
                        <p className="font-bold">{details.clients.bank_clearing || '—'}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Document Vault */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400">{t.vault}</h3>
                <div className="grid grid-cols-5 gap-2">
                  {t.slots.map((label, i) => {
                    const doc = details.documents?.find(d => d.slot_index === i);
                    const hasDoc = !!doc?.file_url;

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                          hasDoc
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : 'bg-slate-50 border-dashed border-slate-200 text-slate-300'
                        }`}
                      >
                        <span className="text-lg">{hasDoc ? '✓' : '+'}</span>
                        <span className="text-[7px] font-black uppercase mt-1 text-center px-1 leading-tight">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">No data found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
