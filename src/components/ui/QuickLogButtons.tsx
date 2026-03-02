/**
 * FILE SUMMARY:
 * One-tap action buttons for horse services.
 * Logs to service_logs table for monthly billing.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/ui/QuickLogButtons.tsx
 */

'use client';
import React, { useState } from 'react';
import { logHorseService } from '@/services/logService';
import { STABLE_SERVICES, QUICK_LOG_SERVICES, ServiceID } from '@/lib/constants';

interface QuickLogButtonsProps {
  horseId: string;
  horseName?: string;
  lang: 'en' | 'it';
  onLogged?: () => void;
}

export const QuickLogButtons: React.FC<QuickLogButtonsProps> = ({
  horseId,
  horseName,
  lang,
  onLogged
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [lastLogged, setLastLogged] = useState<string | null>(null);

  const handleLog = async (serviceId: ServiceID) => {
    setLoading(serviceId);
    setLastLogged(null);

    try {
      await logHorseService(horseId, serviceId);

      // Success feedback
      setLastLogged(serviceId);
      setTimeout(() => setLastLogged(null), 2000);

      // Haptic feedback for iOS
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }

      onLogged?.();
    } catch {
      // Error is already logged by logService
    } finally {
      setLoading(null);
    }
  };

  const t = {
    en: { title: 'Quick Log', logged: 'Logged!' },
    it: { title: 'Registra Servizio', logged: 'Registrato!' }
  }[lang];

  return (
    <section className="space-y-3">
      <h3 className="text-[10px] font-black uppercase text-slate-400">{t.title}</h3>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_LOG_SERVICES.map((serviceId) => {
          const service = STABLE_SERVICES[serviceId];
          const isLoading = loading === serviceId;
          const justLogged = lastLogged === serviceId;

          return (
            <button
              key={serviceId}
              disabled={!!loading}
              onClick={() => handleLog(serviceId)}
              className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                justLogged
                  ? 'bg-emerald-500 border-emerald-500'
                  : isLoading
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-slate-100 hover:border-blue-500'
              }`}
            >
              <p
                className={`text-[9px] font-black uppercase tracking-tighter ${
                  justLogged
                    ? 'text-emerald-200'
                    : isLoading
                    ? 'text-blue-200'
                    : 'text-slate-400'
                }`}
              >
                {justLogged ? t.logged : isLoading ? '...' : `€${service.price}`}
              </p>
              <p
                className={`text-xs font-bold ${
                  justLogged || isLoading ? 'text-white' : 'text-slate-900'
                }`}
              >
                {lang === 'it' ? service.it : service.en}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
