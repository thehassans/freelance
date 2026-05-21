import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    padding: 8,
  },
  col1: { width: '25%' },
  col2: { width: '20%' },
  col3: { width: '15%', textAlign: 'center' },
  col4: { width: '15%', textAlign: 'center' },
  col5: { width: '12.5%', textAlign: 'right' },
  col6: { width: '12.5%', textAlign: 'right' },
  headerText: { fontSize: 8, fontWeight: 'bold' },
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
  }
});

interface Props {
  members: any[];
  stats: any;
  timeHorizon: string;
}

export default function CapacityPlannerPDF({ members, stats, timeHorizon }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Agency Capacity Report</Text>
            <Text style={styles.subtitle}>Resource Forecasting & Financial Projection</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{timeHorizon} View</Text>
            <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Global Utilization</Text>
            <Text style={[styles.statValue, { color: stats.utilization > 90 ? '#ef4444' : '#10b981' }]}>{stats.utilization}%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Cost</Text>
            <Text style={styles.statValue}>${stats.totalCost.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Projected Revenue</Text>
            <Text style={styles.statValue}>${stats.projectedRevenue.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Est. Profit</Text>
            <Text style={[styles.statValue, { color: '#0f172a' }]}>${stats.grossProfit.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resource Roster ({members.length} Members)</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={styles.col1}><Text style={styles.headerText}>Member</Text></View>
              <View style={styles.col2}><Text style={styles.headerText}>Role</Text></View>
              <View style={styles.col3}><Text style={styles.headerText}>Capacity</Text></View>
              <View style={styles.col4}><Text style={styles.headerText}>Assigned</Text></View>
              <View style={styles.col5}><Text style={styles.headerText}>Cost</Text></View>
              <View style={styles.col6}><Text style={styles.headerText}>Billable</Text></View>
            </View>
            {members.map((m, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.col1}><Text style={{ fontSize: 9, fontWeight: 'bold' }}>{m.name || 'Unnamed Member'}</Text></View>
                <View style={styles.col2}><Text style={{ fontSize: 9 }}>{m.role || 'Unassigned'}</Text></View>
                <View style={styles.col3}><Text style={{ fontSize: 9 }}>{m.capacityHours}h</Text></View>
                <View style={styles.col4}><Text style={{ fontSize: 9 }}>{m.assignedHours}h</Text></View>
                <View style={styles.col5}><Text style={{ fontSize: 9 }}>${m.costRate}/h</Text></View>
                <View style={styles.col6}><Text style={{ fontSize: 9 }}>${m.billRate}/h</Text></View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={[styles.statCard, { backgroundColor: '#f8fafc' }]}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text>Gross Profit Margin</Text>
                <Text style={{ fontWeight: 'bold' }}>{stats.margin}%</Text>
             </View>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>Total Overbooked Members</Text>
                <Text style={{ fontWeight: 'bold' }}>{stats.overbookedCount}</Text>
             </View>
          </View>
        </View>

        <Text style={styles.footer}>
          ENTERPRISE AGENCY REPORT | CONFIDENTIAL | FreelancerKit Capacity Engine
        </Text>
      </Page>
    </Document>
  );
}
