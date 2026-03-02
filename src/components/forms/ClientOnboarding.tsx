/**
 * FILE SUMMARY:
 * Pro-grade form for registering new clients/owners.
 * Supports Swiss Banking precision (IBAN, BIC, Clearing).
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/forms/ClientOnboarding.tsx
 */

'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { crumb, errorCrumb } from '@/lib/logger';

type Lang = 'en' | 'it';

interface ClientFormData {
  full_name: string;
  email: string;
  phone: string;
  language: Lang;
  bank_name: string;
  bank_iban: string;
  bank_bic: string;
  bank_clearing: string;
}

export const ClientOnboarding = ({ lang }: { lang: Lang }) => {
  const [formData, setFormData] = useState<ClientFormData>({
    full_name: '',
    email: '',
    phone: '',
    language: lang,
    bank_name: '',
    bank_iban: '',
    bank_bic: '',
    bank_clearing: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    en: {
      title: 'New Owner',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      bankSection: 'Swiss Banking Details',
      bankName: 'Bank Name',
      iban: 'IBAN',
      bic: 'BIC / SWIFT',
      clearing: 'Clearing No.',
      save: 'Create Client'
    },
    it: {
      title: 'Nuovo Proprietario',
      name: 'Nome Completo',
      email: 'Email',
      phone: 'Telefono',
      bankSection: 'Coordinate Bancarie Svizzere',
      bankName: 'Nome Banca',
      iban: 'IBAN',
      bic: 'BIC / SWIFT',
      clearing: 'No. Clearing',
      save: 'Crea Cliente'
    }
  }[lang];

  const handleChange = (field: keyof ClientFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    crumb('onboarding', `Creating client: ${formData.full_name}`);

    try {
      const { error } = await supabase.from('clients').insert([formData]);
      if (error) throw error;

      crumb('onboarding', 'Success! Client created.');
      window.location.reload();
    } catch (err) {
      errorCrumb('onboarding', 'Client creation failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-black uppercase italic mb-6 text-blue-600">{t.title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identity Section */}
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.name}</label>
          <input
            required
            className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm"
            value={formData.full_name}
            onChange={handleChange('full_name')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.email}</label>
            <input
              type="email"
              className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm"
              value={formData.email}
              onChange={handleChange('email')}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.phone}</label>
            <input
              type="tel"
              className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm"
              value={formData.phone}
              onChange={handleChange('phone')}
            />
          </div>
        </div>

        {/* Swiss Banking Section */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase text-slate-300 mb-3">{t.bankSection}</p>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.bankName}</label>
              <input
                placeholder="e.g. UBS, Credit Suisse, PostFinance"
                className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm"
                value={formData.bank_name}
                onChange={handleChange('bank_name')}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.iban}</label>
              <input
                placeholder="CH93 0076 2011 6238 5295 7"
                className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-mono tracking-wider"
                value={formData.bank_iban}
                onChange={handleChange('bank_iban')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.bic}</label>
                <input
                  placeholder="UBSWCHZH80A"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-mono"
                  value={formData.bank_bic}
                  onChange={handleChange('bank_bic')}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">{t.clearing}</label>
                <input
                  placeholder="230"
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-mono"
                  value={formData.bank_clearing}
                  onChange={handleChange('bank_clearing')}
                />
              </div>
            </div>
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
