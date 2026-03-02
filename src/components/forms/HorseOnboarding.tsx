/**
 * FILE SUMMARY:
 * Pro-grade form for registering a horse.
 * Supports PDF extraction for Swiss Bank/Horse details.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/forms/HorseOnboarding.tsx
 */

'use client';
import React, { useState } from 'react';
import { useRegistrationData } from '@/hooks/useRegistrationData';
import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

export const HorseOnboarding = ({ lang }: { lang: 'en' | 'it' }) => {
  const { clients, freeBoxes, loading } = useRegistrationData();
  const [formData, setFormData] = useState({ name: '', microchip: '', client_id: '', box_id: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    en: { title: 'New Horse', name: 'Horse Name', microchip: 'Microchip ID', owner: 'Owner', box: 'Box', save: 'Register' },
    it: { title: 'Nuovo Cavallo', name: 'Nome Cavallo', microchip: 'ID Microchip', owner: 'Proprietario', box: 'Box', save: 'Registra' }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    crumb('onboarding', `Registering ${formData.name} to Box ${formData.box_id}`);

    try {
      // 1. Create the horse record
      const { error: horseErr } = await supabase.from('horses').insert([formData]);
      if (horseErr) throw horseErr;

      // 2. Update box status to occupied
      const { error: boxErr } = await supabase
        .from('boxes')
        .update({ status: 'occupied' })
        .eq('id', formData.box_id);
      if (boxErr) throw boxErr;

      crumb('onboarding', 'Success! Horse registered and stall locked.');
      window.location.reload(); // Quick refresh to update the map
    } catch (err) {
      errorCrumb('onboarding', 'Registration failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 animate-pulse text-xs uppercase font-bold">Initializing Form...</div>;

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-black uppercase italic mb-6 text-slate-900">{t.title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.name}</label>
            <input
              required
              className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.microchip}</label>
            <input
              placeholder="756..."
              className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-mono"
              onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.owner}</label>
            <select
              required
              className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm"
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            >
              <option value="">--</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.box}</label>
            <select
              required
              className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm"
              onChange={(e) => setFormData({ ...formData, box_id: e.target.value })}
            >
              <option value="">--</option>
              {freeBoxes.map(b => <option key={b.id} value={b.id}>{b.id}</option>)}
            </select>
          </div>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-colors"
        >
          {isSubmitting ? '...' : t.save}
        </button>
      </form>
    </div>
  );
};
