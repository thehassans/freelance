import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image, Link } from '@react-pdf/renderer';

// Register a cursive-like font for signature
Font.register({
  family: 'Cursive',
  src: 'https://fonts.gstatic.com/s/sacramento/v15/buE7po69S3pfPvEB9p7jO2Ub.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  coverPage: {
    padding: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverHeader: {
    width: '100%',
    padding: 60,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  },
  coverFooter: {
    width: '100%',
    padding: 40,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 40,
    objectFit: 'contain',
  },
  proposalLabel: {
    fontSize: 12,
    fontWeight: 'normal',
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: '#64748b',
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    lineHeight: 1.1,
  },
  clientName: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 2,
    paddingBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#334155',
  },
  signatureContainer: {
    marginTop: 60,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#94a3b8',
    marginBottom: 20,
  },
  signatureText: {
    fontFamily: 'Cursive',
    fontSize: 24,
    color: '#0f172a',
    marginBottom: 5,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    marginBottom: 5,
    height: 10,
  },
  dateText: {
    fontSize: 9,
    color: '#94a3b8',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 15,
  }
});

interface ProposalPDFProps {
  formData: any;
  proposalContent: string;
  logo: string | null;
  primaryColor: string;
  signatureName: string;
  isPro?: boolean;
}

const ProposalPDF = ({ formData, proposalContent, logo, primaryColor, signatureName, isPro = false }: ProposalPDFProps) => {
  // Enhanced HTML to PDF Mapping
  const renderContent = (html: string) => {
    // Naive HTML parser for TipTap output
    const parts = html.split(/(<h[123]>.*?<\/h[123]>|<p>.*?<\/p>|<li>.*?<\/li>|<ul>|<\/ul>)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('<h2')) {
        const text = part.replace(/<[^>]*>?/gm, '');
        return (
          <View key={index} style={[styles.section, { marginTop: 20 }]}>
            <Text style={[styles.header, { borderBottomColor: primaryColor, color: primaryColor }]}>{text}</Text>
          </View>
        );
      }
      if (part.startsWith('<h3')) {
        const text = part.replace(/<[^>]*>?/gm, '');
        return (
          <Text key={index} style={[styles.content, { fontWeight: 'bold', fontSize: 13, marginTop: 10, marginBottom: 5 }]}>
            {text}
          </Text>
        );
      }
      if (part.startsWith('<p')) {
        const text = part.replace(/<[^>]*>?/gm, '');
        if (!text.trim()) return null;
        return (
          <Text key={index} style={[styles.content, { marginBottom: 10 }]}>
            {text}
          </Text>
        );
      }
      if (part.startsWith('<li>')) {
        const text = part.replace(/<[^>]*>?/gm, '');
        return (
          <View key={index} style={{ flexDirection: 'row', marginBottom: 5, paddingLeft: 10 }}>
            <Text style={[styles.content, { marginRight: 5 }]}>•</Text>
            <Text style={styles.content}>{text}</Text>
          </View>
        );
      }
      return null;
    });
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={[styles.accentBar, { backgroundColor: primaryColor }]} />
        <View style={styles.coverHeader}>
          {logo && <Image src={logo} style={styles.logo} />}
          <Text style={styles.proposalLabel}>Project Proposal</Text>
          <Text style={styles.projectTitle}>{formData.projectType || 'Project Transformation'}</Text>
          <Text style={styles.clientName}>Prepared for {formData.clientName || 'Valued Client'}</Text>
        </View>
        <View style={styles.coverFooter}>
          <Text style={styles.content}>Confidential & Proprietary</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
        </View>
        {!isPro && (
          <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center' }}>
            <Text style={{ fontSize: 8, color: '#cbd5e1', letterSpacing: 2, textTransform: 'uppercase' }}>
              Generated via FreelancerKit.io (Free Version)
            </Text>
          </View>
        )}
      </Page>

      {/* Content Page(s) */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.accentBar, { backgroundColor: primaryColor, height: 5 }]} />
        
        <View style={{ flexGrow: 1 }}>
          {renderContent(proposalContent)}
        </View>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Freelancer Signature</Text>
            {signatureName ? (
              <Text style={styles.signatureText}>{signatureName}</Text>
            ) : (
              <View style={styles.signatureLine} />
            )}
            <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Client Acceptance</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.dateText}>Date</Text>
          </View>
        </View>

        {!isPro && (
          <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', opacity: 0.5 }}>
            <Text style={{ fontSize: 7, color: '#94a3b8', letterSpacing: 1 }}>
              Upgrade to Pro at FreelancerKit.io to remove branding and unlock high-ticket templates.
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ProposalPDF;
