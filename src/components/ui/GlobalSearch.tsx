/**
 * FILE SUMMARY:
 * Polished search bar with Cmd+K shortcut and visual hints.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/GlobalSearch.tsx
 */

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { globalSearch } from '@/services/searchService';

export const GlobalSearch: React.FC<{ lang: 'en' | 'it' }> = ({ lang }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard Shortcut Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        const res = await globalSearch(query);
        setResults(res);
      } else {
        setResults(null);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const labels = {
    en: { placeholder: 'Search...', h: 'Horses', c: 'Owners', i: 'Invoices' },
    it: { placeholder: 'Cerca...', h: 'Cavalli', c: 'Proprietari', i: 'Fatture' }
  }[lang];

  return (
    <div className="relative w-full max-w-xl mx-auto group">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={labels.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all shadow-inner pr-16"
        />
        {/* Visual Shortcut Hint */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-black text-slate-400 uppercase pointer-events-none">
          <span>⌘</span><span>K</span>
        </div>
      </div>

      {results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[200] overflow-hidden">
          <Section title={labels.h} items={results.horses} />
          <Section title={labels.c} items={results.clients} />
          <Section title={labels.i} items={results.invoices} />
        </div>
      )}
    </div>
  );
};

const Section = ({ title, items }: { title: string; items: any[] }) => {
  if (items.length === 0) return null;
  return (
    <div className="p-3 border-b border-slate-50 last:border-0">
      <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 px-3">{title}</h4>
      {items.map(item => (
        <button key={item.id} className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-blue-50 rounded-lg transition-colors flex justify-between">
          <span>{item.name || item.full_name || `#${item.id.slice(0, 8)}`}</span>
          {item.total_amount && <span className="text-blue-600">€{item.total_amount}</span>}
        </button>
      ))}
    </div>
  );
};
