/**
 * FILE SUMMARY:
 * Grid container for the BoxCards.
 * Uses CSS Grid for a clean, responsive "Stable Floor Plan" feel.
 * Path: src/components/layout/StableGrid.tsx
 */

import React from 'react';
import { BoxCard } from '../ui/BoxCard';
import { MOCK_BOXES } from '../../lib/mocks';
import { Language } from '../../types/stable';

export const StableGrid: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <section className="p-6 bg-white rounded-3xl shadow-inner min-h-[400px]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {MOCK_BOXES.map((box) => (
          <BoxCard
            key={box.id}
            id={box.id}
            status={box.status as 'occupied' | 'free' | 'maintenance'}
            horse={box.horse}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
};
