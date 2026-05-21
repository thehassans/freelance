import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#ffffff',
    color: '#334155',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 40,
    borderBottomWidth: 3,
    borderBottomColor: '#0f4c75',
    paddingBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f4c75',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 5,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'Courier',
  },
  mainGrid: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 40,
  },
  rateCard: {
    flex: 1,
    padding: 25,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rateLabel: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  rateValue: {
    fontSize: 36,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  rateUnit: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 5,
  },
  statsBox: {
    padding: 30,
    backgroundColor: '#0f172a',
    borderRadius: 15,
    marginBottom: 40,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 15,
  },
  statsTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statsLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  distributionSection: {
    marginTop: 20,
  },
  distributionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f4c75',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 15,
  },
  distColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distLabel: {
    flex: 1,
    fontSize: 10,
    color: '#64748b',
  },
  distValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
  },
  metaGrid: {
    marginTop: 'auto',
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  metaBox: {
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    width: '30%',
  },
  metaLabel: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  metaText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#cbd5e1',
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  reportBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
    backgroundColor: '#0f4c75',
    color: '#ffffff',
    fontSize: 6,
    borderBottomLeftRadius: 6,
  }
});

interface RateCalculatorPDFProps {
  income: number;
  symbol: string;
  results: {
    totalRequired: number;
    taxAmount: number;
    bufferAmount: number;
    totalExpenses: number;
    takeHome: number;
    totalHours: number;
    hourlyRate: number;
    dailyRate: number;
    monthlyTarget: number;
  };
  weeksOff: number;
  hoursPerDay: number;
  unbillablePercent: number;
  expenses: number;
  taxRate: number;
  profitBuffer: number;
}

export const RateCalculatorPDF = ({
  income,
  symbol,
  results,
  weeksOff,
  hoursPerDay,
  unbillablePercent,
  expenses,
  taxRate,
  profitBuffer,
}: RateCalculatorPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>RATE AUDIT</Text>
          <Text style={styles.subtitle}>Freelance Financial Forecast</Text>
        </View>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
      </View>

      <View style={styles.mainGrid}>
        <View style={styles.rateCard}>
          <Text style={styles.rateLabel}>Hourly Rate</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.rateValue}>{symbol}{results.hourlyRate}</Text>
            <Text style={styles.rateUnit}>/ hr</Text>
          </View>
        </View>
        <View style={styles.rateCard}>
          <Text style={styles.rateLabel}>Daily Rate</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.rateValue}>{symbol}{results.dailyRate}</Text>
            <Text style={styles.rateUnit}>/ day</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsBox}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Revenue Targets</Text>
          <Text style={{ color: '#0f4c75', fontSize: 10, fontWeight: 'bold' }}>AUDIT VERIFIED</Text>
        </View>
        
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Annual Gross Target</Text>
          <Text style={styles.statsValue}>{symbol}{Math.ceil(results.totalRequired).toLocaleString()}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Monthly Gross Target</Text>
          <Text style={styles.statsValue}>{symbol}{results.monthlyTarget.toLocaleString()}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Net Annual Draw (Post-Tax)</Text>
          <Text style={styles.statsValue}>{symbol}{income.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.distributionSection}>
        <Text style={styles.distributionTitle}>Financial Allocation</Text>
        
        <View style={styles.distRow}>
          <View style={[styles.distColor, { backgroundColor: '#0f4c75' }]} />
          <Text style={styles.distLabel}>Take-Home Pay</Text>
          <Text style={styles.distValue}>{symbol}{results.takeHome.toLocaleString()} ({(results.takeHome / results.totalRequired * 100).toFixed(1)}%)</Text>
        </View>
        
        <View style={styles.distRow}>
          <View style={[styles.distColor, { backgroundColor: '#f87171' }]} />
          <Text style={styles.distLabel}>Tax Allocation</Text>
          <Text style={styles.distValue}>{symbol}{results.taxAmount.toLocaleString()} ({(results.taxAmount / results.totalRequired * 100).toFixed(1)}%)</Text>
        </View>
        
        <View style={styles.distRow}>
          <View style={[styles.distColor, { backgroundColor: '#94a3b8' }]} />
          <Text style={styles.distLabel}>Business Expenses</Text>
          <Text style={styles.distValue}>{symbol}{results.totalExpenses.toLocaleString()} ({(results.totalExpenses / results.totalRequired * 100).toFixed(1)}%)</Text>
        </View>
        
        <View style={styles.distRow}>
          <View style={[styles.distColor, { backgroundColor: '#34d399' }]} />
          <Text style={styles.distLabel}>Profit Buffer</Text>
          <Text style={styles.distValue}>{symbol}{results.bufferAmount.toLocaleString()} ({(results.bufferAmount / results.totalRequired * 100).toFixed(1)}%)</Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Weeks Off</Text>
          <Text style={styles.metaText}>{weeksOff} Weeks</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Billable Day</Text>
          <Text style={styles.metaText}>{hoursPerDay} Hours</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Admin Overhead</Text>
          <Text style={styles.metaText}>{unbillablePercent}%</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Tax Rate</Text>
          <Text style={styles.metaText}>{taxRate}%</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Safe Buffer</Text>
          <Text style={styles.metaText}>{profitBuffer}%</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Billable Hours/Yr</Text>
          <Text style={styles.metaText}>{Math.round(results.totalHours)} Hours</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Strategy Note: These rates are calculated to ensure long-term sustainability by accounting for unbillable time, taxes, and profit reinvestment. Rates should be adjusted quarterly.
        </Text>
      </View>
    </Page>
  </Document>
);
