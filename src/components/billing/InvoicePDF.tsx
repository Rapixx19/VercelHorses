/**
 * FILE SUMMARY:
 * Refined React-PDF template with line-item mapping and locale-aware dates.
 * Risk Zone: RED (Financial Document Generation).
 * Path: src/components/billing/InvoicePDF.tsx
 */

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { invoiceTranslations } from '@/i18n/invoice';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#111', paddingBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 8, alignItems: 'center' },
  totalRow: { flexDirection: 'row', marginTop: 15, paddingVertical: 10, borderTopWidth: 2, borderTopColor: '#111' },
  totalText: { fontSize: 14, fontWeight: 'bold' },
  footer: { marginTop: 50, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#EEE', color: '#666' }
});

export const InvoicePDF = ({ data, lang }: { data: any; lang: 'en' | 'it' }) => {
  const t = invoiceTranslations[lang];
  const formattedDate = new Date().toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Equine-OS {t.inv}</Text>
          <Text style={{ marginTop: 5 }}>{t.date}: {formattedDate}</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{data.horseName}</Text>
          <Text style={{ color: '#444' }}>{t.owner}: {data.clientName}</Text>
        </View>

        {/* Table Header */}
        <View style={[styles.row, { backgroundColor: '#F3F4F6' }]}>
          <Text style={{ flex: 3, fontWeight: 'bold', paddingLeft: 5 }}>{t.desc}</Text>
          <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', paddingRight: 5 }}>{t.amount}</Text>
        </View>

        {/* Scalable Line Items Mapping */}
        {(data.items || [{ description: t.boarding, amount: data.amount }]).map((item: any, i: number) => (
          <View key={i} style={styles.row}>
            <Text style={{ flex: 3, paddingLeft: 5 }}>{item.description}</Text>
            <Text style={{ flex: 1, textAlign: 'right', paddingRight: 5 }}>€{item.amount.toFixed(2)}</Text>
          </View>
        ))}

        {/* Total Highlight */}
        <View style={styles.totalRow}>
          <Text style={{ flex: 3, textAlign: 'right', paddingRight: 10 }}>{t.total}</Text>
          <Text style={[styles.totalText, { flex: 1, textAlign: 'right' }]}>€{data.amount.toFixed(2)}</Text>
        </View>

        {/* Swiss/International Bank Footer */}
        <View style={styles.footer}>
          <Text style={{ fontWeight: 'bold', color: '#111', marginBottom: 5 }}>{t.bank}</Text>
          <Text>IBAN: {data.iban}</Text>
          <Text>BIC/SWIFT: {data.bic}</Text>
          <Text>Bank: {data.bankName}</Text>
          {data.clearing && <Text>Clearing: {data.clearing}</Text>}
        </View>
      </Page>
    </Document>
  );
};
