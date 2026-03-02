/**
 * FILE SUMMARY:
 * Bilingual Footer for Invoices featuring Swiss Bank Details.
 * Risk Zone: GREEN (UI Component).
 * Path: src/components/billing/InvoiceFooter.tsx
 */

interface BankProps {
  details: { name: string; iban: string; bic: string; clearing?: string };
  lang: 'en' | 'it';
}

export const InvoiceFooter = ({ details, lang }: BankProps) => {
  const t = {
    en: { title: 'Payment Details', bank: 'Bank', clearing: 'Clearing' },
    it: { title: 'Dettagli di Pagamento', bank: 'Banca', clearing: 'Codice di avviamento' }
  }[lang];

  return (
    <div className="mt-8 pt-4 border-t border-slate-200 text-xs">
      <h4 className="font-bold mb-2 uppercase tracking-tighter">{t.title}</h4>
      <p><strong>{t.bank}:</strong> {details.name}</p>
      <p><strong>IBAN:</strong> {details.iban}</p>
      <p><strong>BIC/SWIFT:</strong> {details.bic}</p>
      {details.clearing && <p><strong>{t.clearing}:</strong> {details.clearing}</p>}
    </div>
  );
};
