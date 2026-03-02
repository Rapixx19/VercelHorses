/**
 * FILE SUMMARY:
 * The primary owner dashboard.
 * Integrates the StableGrid and language toggles.
 * Path: src/app/dashboard/page.tsx
 */

'use client';
import React, { useState } from 'react';
import { StableGrid } from '@/components/layout/StableGrid';
import { Language } from '@/types/stable';

export default function DashboardPage() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Equine Dashboard</h1>
          <p className="text-slate-500">Stable Overview & Real-time Occupancy</p>
        </div>
        <button
          onClick={() => setLang(l => l === 'en' ? 'it' : 'en')}
          className="px-4 py-2 bg-slate-100 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          {lang === 'en' ? 'Italiano' : 'English'}
        </button>
      </header>

      <StableGrid lang={lang} />
    </main>
  );
}
