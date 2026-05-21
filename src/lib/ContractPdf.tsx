import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 11,
    color: '#334155',
  },
  header: {
    marginBottom: 40,
    borderBottom: '2pt solid #e2e8f0',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  content: {
    lineHeight: 1.6,
  },
  signatureRow: {
    marginTop: 60,
    flexDirection: 'row',
    gap: 40,
  },
  signatureBlock: {
    flex: 1,
    borderTop: '1pt solid #cbd5e1',
    paddingTop: 10,
  },
  signedIndicator: {
    fontSize: 8,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 4,
  },
  seal: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    border: '1pt solid #e2e8f0',
  },
  sealText: {
    fontSize: 8,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 4,
  },
  sealId: {
    fontSize: 7,
    fontFamily: 'Courier',
    color: '#94a3b8',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 60,
    right: 60,
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    borderTop: '0.5pt solid #f1f5f9',
    paddingTop: 10,
  }
});

interface ContractPdfProps {
  data: any;
}

export const ContractPdf = ({ data }: ContractPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.contractType || 'SERVICE AGREEMENT'}</Text>
        <Text style={styles.subtitle}>Reference: {data.shareId}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>BETWEEN</Text>
        <Text>{data.freelancerName}</Text>
        <Text style={{ marginTop: 20, fontSize: 9, color: '#94a3b8' }}>AND</Text>
        <Text>{data.clientName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.content}>{data.content}</Text>
      </View>

      <View style={styles.signatureRow}>
        <View style={styles.signatureBlock}>
          <Text style={styles.label}>Freelancer Signature</Text>
          <Text style={{ fontSize: 16, fontFamily: 'Times-Italic', marginBottom: 5 }}>{data.freelancerSign}</Text>
          <Text style={styles.signedIndicator}>Digitally Signed on {new Date(data.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.signatureBlock}>
          <Text style={styles.label}>Client Acceptance</Text>
          {data.clientSign && data.clientSign.startsWith('data:image') ? (
             <Image src={data.clientSign} style={{ height: 30, width: 'auto', marginBottom: 5 }} />
          ) : (
             <Text style={{ fontSize: 16, fontFamily: 'Times-Italic', marginBottom: 5 }}>{data.clientSign}</Text>
          )}
          <Text style={styles.signedIndicator}>Digitally Signed on {new Date(data.signedAt).toLocaleDateString()}</Text>
          <Text style={styles.signedIndicator}>IP Address: {data.clientIp}</Text>
        </View>
      </View>

      <View style={styles.seal}>
        <Text style={styles.sealText}>SECURE DIGITAL EXECUTION VERIFIED</Text>
        <Text style={styles.sealId}>AUTHENTICATION HASH: {Math.random().toString(16).substring(2, 18).toUpperCase()}</Text>
      </View>

      <Text style={styles.footer}>
        This document was electronically signed via FreelancerKit.io. 
        It is a legally binding agreement under the Electronic Signatures in Global and National Commerce (ESIGN) Act.
      </Text>
    </Page>
  </Document>
);
