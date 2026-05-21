import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#94a3b8',
    fontSize: 8,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  impactBox: {
    backgroundColor: '#fff1f2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe4e6',
    marginTop: 10,
  },
  impactText: {
    color: '#e11d48',
    fontWeight: 'bold',
  },
  actionCard: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.4,
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
  }
});

interface Props {
  report: any;
}

export default function AlgorithmicRecoveryPDF({ report }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Algorithmic Recovery Audit</Text>
          <Text style={styles.subtitle}>Domain: {report.domain} | Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnostic Summary</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.label}>Identified Update</Text>
                <Text style={styles.value}>{report.updateHit.name}</Text>
              </View>
              <View style={{ textAlign: 'right' }}>
                <Text style={styles.label}>Impact Severity</Text>
                <Text style={[styles.value, { color: '#e11d48' }]}>{report.dropSeverity}</Text>
              </View>
            </View>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.label}>Primary Target</Text>
                <Text style={styles.value}>{report.updateHit.impact}</Text>
              </View>
              <View style={{ textAlign: 'right' }}>
                <Text style={styles.label}>Recovery Score</Text>
                <Text style={styles.value}>{report.recoveryScore}/100</Text>
              </View>
            </View>
            <View style={styles.impactBox}>
              <Text style={{ fontSize: 9, lineHeight: 1.5 }}>
                Correlation analysis confirms a significant traffic drop beginning on {report.updateHit.date}. 
                The site is currently showing underperformance in topical authority and E-E-A-T signals required by this specific core update.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Procedural Recovery Roadmap</Text>
          {report.actions.map((action: any, i: number) => (
            <View key={i} style={styles.actionCard}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDesc}>{action.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Guidance</Text>
          <View style={[styles.card, { backgroundColor: '#eff6ff', borderColor: '#dbeafe' }]}>
            <Text style={{ fontSize: 9, color: '#1e40af', lineHeight: 1.6 }}>
              Recovery from algorithmic hits is a long-term process involving systemic content and technical improvements. 
              We recommend implementing the above actions over the next 90 days. Avoid taking "short-cuts" like mass deletion 
              or rapid AI-heavy republishing which can trigger additional quality filters.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          PRO ELITE AUDIT — CONFIDENTIAL REPORT | Generated by FreelancerKit Algorithmic Recovery Engine
        </Text>
      </Page>
    </Document>
  );
}
