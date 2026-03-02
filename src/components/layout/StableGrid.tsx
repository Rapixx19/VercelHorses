/**
 * FILE SUMMARY:
 * The live engine for the 25-box grid.
 * Fetches directly from Supabase.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/layout/StableGrid.tsx
 */

'use client';
import React from 'react';
import { BoxCard } from '../ui/BoxCard';
import { useStableData } from '@/hooks/useStableData';

export const StableGrid: React.FC<{ lang: 'en' | 'it' }> = ({ lang }) => {
  const { boxes, loading, error } = useStableData();

  if (loading) return (
    <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-slate-300">
      Connecting to Stable Database...
    </div>
  );

  if (error) return (
    <div className="p-20 text-red-500 text-center">
      Error loading stalls. Check Vercel Env Vars.
    </div>
  );

  return (
    <section className="p-6 bg-white rounded-3xl shadow-inner min-h-[400px]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {boxes.map((box) => (
          <BoxCard
            key={box.id}
            id={box.id}
            status={box.status}
            horseName={box.horses?.name}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
};
