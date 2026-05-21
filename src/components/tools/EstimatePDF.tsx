import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed, for now standard ones
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#334155',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#0f4c75',
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f4c75',
    letterSpacing: 1,
  },
  metaSection: {
    marginBottom: 30,
  },
  metaItem: {
    fontSize: 10,
    marginBottom: 4,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 12,
    marginBottom: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f4c75',
    marginBottom: 15,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    padding: 8,
    alignItems: 'center',
  },
  col1: { width: '40%', fontSize: 10 },
  col2: { width: '20%', fontSize: 10, textAlign: 'right' },
  col3: { width: '20%', fontSize: 10, textAlign: 'right' },
  col4: { width: '20%', fontSize: 10, textAlign: 'right', fontWeight: 'bold' },
  
  colExp1: { width: '70%', fontSize: 10 },
  colExp2: { width: '30%', fontSize: 10, textAlign: 'right', fontWeight: 'bold' },

  summaryBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f4c75',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f4c75',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
  },
  disclaimer: {
    fontSize: 8,
    color: '#94a3b8',
    fontStyle: 'italic',
    lineHeight: 1.5,
  }
});

interface Task {
  id: string;
  name: string;
  hours: number;
  rate?: number;
}

interface FixedExpense {
  id: string;
  name: string;
  cost: number;
}

interface EstimatePDFProps {
  projectName: string;
  clientName: string;
  preparedBy: string;
  tasks: Task[];
  fixedExpenses: FixedExpense[];
  globalRate: number;
  buffer: number;
  pricingModel: 'global' | 'per-task';
  laborTotal: number;
  bufferAmount: number;
  expensesTotal: number;
  grandTotal: number;
}

export const EstimatePDF = ({
  projectName,
  clientName,
  preparedBy,
  tasks,
  fixedExpenses,
  globalRate,
  buffer,
  pricingModel,
  laborTotal,
  bufferAmount,
  expensesTotal,
  grandTotal,
}: EstimatePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>ESTIMATE</Text>
        <Text style={{ fontSize: 10, color: '#94a3b8' }}>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.metaSection}>
        <View style={{ flexDirection: 'row', gap: 40 }}>
          <View>
            <Text style={styles.metaItem}>Project Name</Text>
            <Text style={styles.metaValue}>{projectName || 'Untitled Project'}</Text>
          </View>
          <View>
            <Text style={styles.metaItem}>Client Name</Text>
            <Text style={styles.metaValue}>{clientName || 'Valued Client'}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.metaItem}>Prepared By</Text>
          <Text style={styles.metaValue}>{preparedBy || 'Service Provider'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Labor & Tasks</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Task Description</Text>
          <Text style={styles.col2}>Hours</Text>
          <Text style={styles.col3}>Rate</Text>
          <Text style={styles.col4}>Subtotal</Text>
        </View>
        {tasks.map((task) => (
          <View key={task.id} style={styles.tableRow}>
            <Text style={styles.col1}>{task.name || 'Untitled Task'}</Text>
            <Text style={styles.col2}>{task.hours}h</Text>
            <Text style={styles.col3}>${(pricingModel === 'per-task' ? (task.rate || globalRate) : globalRate).toFixed(2)}</Text>
            <Text style={styles.col4}>${(task.hours * (pricingModel === 'per-task' ? (task.rate || globalRate) : globalRate)).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {fixedExpenses.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Fixed Expenses</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colExp1}>Expense Item</Text>
              <Text style={styles.colExp2}>Cost</Text>
            </View>
            {fixedExpenses.map((expense) => (
              <View key={expense.id} style={styles.tableRow}>
                <Text style={styles.colExp1}>{expense.name || 'Untitled Expense'}</Text>
                <Text style={styles.colExp2}>${expense.cost.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Labor Effort</Text>
          <Text style={styles.summaryValue}>${laborTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Contingency Buffer ({buffer}%)</Text>
          <Text style={styles.summaryValue}>+ ${bufferAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Fixed Expenses</Text>
          <Text style={styles.summaryValue}>${expensesTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Project Estimate</Text>
          <Text style={styles.totalValue}>${Math.ceil(grandTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          This is an estimate of costs based on current requirements. Final scope and billing may vary. Valid for 30 days.
        </Text>
      </View>
    </Page>
  </Document>
);
