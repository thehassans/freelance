import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link, Image } from '@react-pdf/renderer';

// Register fonts if needed, for now we will use standard ones or system fonts
// Font.register({
//   family: 'Inter',
//   fonts: [
//     { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf', fontWeight: 400 },
//     { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf', fontWeight: 700 },
//   ],
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: -1,
  },
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  column: {
    width: '32%',
  },
  addressBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    minHeight: 50,
  },
  table: {
    width: 'auto',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  column1: { width: '55%' },
  column2: { width: '10%', textAlign: 'center' },
  column3: { width: '15%', textAlign: 'right' },
  column4: { width: '20%', textAlign: 'right' },
  totals: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsColumn: {
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  grandTotal: {
    marginTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#0f172a',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    color: '#94a3b8',
    fontSize: 8,
  },
  paymentBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  link: {
    color: '#0f4c75',
    textDecoration: 'underline',
  }
});

interface Props {
  invoiceData: any;
  items: any[];
  logo: string | null;
  primaryColor: string;
  currencySymbol: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  balanceDue: number;
  isPro?: boolean;
}

export default function InvoicePDF({ 
  invoiceData, 
  items, 
  logo, 
  primaryColor, 
  currencySymbol,
  subtotal,
  taxAmount,
  discountAmount,
  total,
  balanceDue,
  isPro = false
}: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for non-pro */}
        {!isPro && (
          <View style={{ position: 'absolute', top: 10, right: 40, opacity: 0.5 }}>
            <Text style={{ fontSize: 8, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Free Version — Upgrade to PRO for white-label
            </Text>
          </View>
        )}
        {/* Header */}
        <View style={styles.header}>
          <View>
            {logo && <Image src={logo} style={styles.logo} />}
            <Text style={[styles.title, { color: '#0f172a' }]}>{invoiceData.fromBusiness || 'Your Name'}</Text>
            {invoiceData.fromEmail && <Text style={{ fontSize: 10, color: '#64748b' }}>{invoiceData.fromEmail}</Text>}
            {invoiceData.fromAddress && <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{invoiceData.fromAddress}</Text>}
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={[styles.title, { color: '#f1f5f9', fontSize: 40, marginBottom: 10 }]}>INVOICE</Text>
            <Text style={styles.label}>Invoice Number</Text>
            <Text style={[styles.value, { color: primaryColor, fontSize: 18 }]}>#{invoiceData.invoiceNumber}</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.section}>
          <View style={styles.column}>
            <Text style={styles.label}>Bill To</Text>
            <View style={styles.addressBox}>
              <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{invoiceData.toBusiness || 'Client Name'}</Text>
              {invoiceData.toEmail && <Text style={{ color: '#64748b' }}>{invoiceData.toEmail}</Text>}
              {invoiceData.toAddress && <Text style={{ color: '#64748b', marginTop: 2 }}>{invoiceData.toAddress}</Text>}
              {!invoiceData.toEmail && !invoiceData.toAddress && <Text style={{ color: '#cbd5e1', fontSize: 9 }}>[Client Address]</Text>}
            </View>
          </View>
          {invoiceData.shipTo && (
            <View style={styles.column}>
              <Text style={styles.label}>Ship To</Text>
              <View style={styles.addressBox}>
                <Text style={{ color: '#64748b', fontStyle: 'italic' }}>{invoiceData.shipTo}</Text>
              </View>
            </View>
          )}
          <View style={[styles.column, { alignItems: 'flex-end' }]}>
            <View style={{ marginBottom: 8, textAlign: 'right' }}>
              <Text style={styles.label}>Date</Text>
              <Text style={{ fontWeight: 'bold' }}>{invoiceData.date}</Text>
            </View>
            <View style={{ marginBottom: 8, textAlign: 'right' }}>
              <Text style={styles.label}>Payment Terms</Text>
              <Text style={{ fontWeight: 'bold' }}>{invoiceData.paymentTerms}</Text>
            </View>
            <View style={{ textAlign: 'right' }}>
              <Text style={styles.label}>Due Date</Text>
              <Text style={{ fontWeight: 'bold' }}>{invoiceData.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.column1, { fontSize: 8, fontWeight: 'bold' }]}>ITEM</Text>
            <Text style={[styles.column2, { fontSize: 8, fontWeight: 'bold' }]}>QTY</Text>
            <Text style={[styles.column3, { fontSize: 8, fontWeight: 'bold' }]}>RATE</Text>
            <Text style={[styles.column4, { fontSize: 8, fontWeight: 'bold' }]}>AMOUNT</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.column1}>{item.description}</Text>
              <Text style={styles.column2}>{item.quantity}</Text>
              <Text style={styles.column3}>{currencySymbol}{Number(item.rate).toFixed(2)}</Text>
              <Text style={styles.column4}>{currencySymbol}{Number(item.quantity * item.rate).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Footer Content */}
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View style={{ flex: 1 }}>
            {invoiceData.notes && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.label}>Notes</Text>
                <Text style={{ color: '#64748b', fontSize: 9 }}>{invoiceData.notes}</Text>
              </View>
            )}
            {invoiceData.terms && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.label}>Terms & Conditions</Text>
                <Text style={{ color: '#64748b', fontSize: 9 }}>{invoiceData.terms}</Text>
              </View>
            )}
            
            {/* Payment Details */}
            {(invoiceData.paymentInstructions || invoiceData.paymentUrl) && (
              <View style={styles.paymentBox}>
                <Text style={[styles.label, { color: primaryColor, marginBottom: 5 }]}>Payment Instructions</Text>
                {invoiceData.paymentInstructions && (
                  <Text style={{ color: '#64748b', fontSize: 9, marginBottom: 8 }}>{invoiceData.paymentInstructions}</Text>
                )}
                {invoiceData.paymentUrl && (
                  <Link src={invoiceData.paymentUrl} style={[styles.link, { fontSize: 9 }]}>
                    Pay Online: {invoiceData.paymentUrl}
                  </Link>
                )}
              </View>
            )}
          </View>

          <View style={styles.totalsColumn}>
            <View style={styles.totalRow}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={{ fontWeight: 'bold' }}>{currencySymbol}{Number(subtotal).toFixed(2)}</Text>
            </View>
            {taxAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.label}>Tax ({invoiceData.taxRate}%)</Text>
                <Text style={{ fontWeight: 'bold' }}>{currencySymbol}{Number(taxAmount).toFixed(2)}</Text>
              </View>
            )}
            {discountAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.label}>Discount {invoiceData.discountType === 'percent' ? `(${invoiceData.discount}%)` : ''}</Text>
                <Text style={{ fontWeight: 'bold' }}>-{currencySymbol}{Number(discountAmount).toFixed(2)}</Text>
              </View>
            )}
            {invoiceData.shipping > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.label}>Shipping</Text>
                <Text style={{ fontWeight: 'bold' }}>+{currencySymbol}{Number(invoiceData.shipping).toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={[styles.grandTotalValue, { color: primaryColor }]}>{currencySymbol}{Number(total).toFixed(2)}</Text>
            </View>
            {invoiceData.amountPaid > 0 && (
              <View style={[styles.totalRow, { marginTop: 10 }]}>
                <Text style={styles.label}>Amount Paid</Text>
                <Text style={{ fontWeight: 'bold' }}>{currencySymbol}{Number(invoiceData.amountPaid).toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.totalRow, { marginTop: 10, backgroundColor: primaryColor, color: 'white', padding: 10, borderRadius: 8 }]}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>Balance Due</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{currencySymbol}{Number(balanceDue).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {!isPro && (
          <Text style={styles.footer}>
            Thank you for your business. Generated by FreelancerKit.io
          </Text>
        )}
      </Page>
    </Document>
  );
}
