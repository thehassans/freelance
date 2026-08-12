import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Printer, Download, Layout, Palette, Settings2, 
  Check, Upload, MinusCircle, PlusCircle, History, FileText, 
  Maximize2, ShieldCheck, Loader2, Save, GripVertical, 
  UserPlus, PackagePlus, Lock, X, Eye, Share2
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { useLocation, Link } from 'react-router-dom';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { historyService, HistoryItem } from '../../lib/history-service';
import { useUser } from '../../contexts/UserContext';
import { useFeatureGate } from '../../hooks/useFeatureGate';
import UniversalDocumentPreview from '../common/UniversalDocumentPreview';
import InvoicePDF from './InvoicePDF';
import { InvoiceTemplateSwitcher } from './InvoiceTemplateSwitcher';
import InvoiceSEO from './InvoiceSEO';
import { COUNTRIES, COUNTRY_DIAL_CODES } from '../../lib/countries';

interface InvoiceItem {
  id: string;
  description?: string;
  quantity?: number;
  rate?: number;
  taxable?: boolean;
  [key: string]: any;
}

type HeaderStyle = 'classic' | 'modern' | 'minimal' | 'bold' | 'corporate' | 'clean' | 'minimalist' | 'stylized';

interface SortableItemProps {
  item: InvoiceItem;
  currencySymbol: string;
  updateItem: (id: string, field: string, value: string | number | boolean) => void;
  removeItem: (id: string) => void;
  formatCurrency: (value: number) => string;
  columns: any[];
  taxType: string;
}

const computeRowValues = (item: any, columns: any[]): Record<string, number> => {
  const values: Record<string, number> = {};
  
  // Base values mapping based on current column structure
  columns.forEach(c => {
    if (c.type !== 'FORMULA') {
      let fieldId = c.id;
      if (c.name === 'Item') fieldId = 'description';
      else if (c.name === 'Quantity') fieldId = 'quantity';
      else if (c.name === 'Rate') fieldId = 'rate';

      let val = item[fieldId];
      if (val === undefined) {
        if (c.name === 'Quantity') val = item.quantity || 0;
        else if (c.name === 'Rate') val = item.rate || 0;
        else if (c.name === 'VAT Rate') val = item.taxRate || item.col_2 || 0;
        else val = 0;
      }
      values[c.name] = typeof val === 'string' ? parseFloat(val) || 0 : (val as number || 0);
    }
  });

  // Fallback explicit values for hardcoded column formulas if a column is missing or unmapped
  values['Quantity'] = values['Quantity'] ?? (item.quantity || item.col_3 || 0);
  values['Rate'] = values['Rate'] ?? (item.rate || item.col_4 || 0);
  values['VAT Rate'] = values['VAT Rate'] ?? (item.taxRate || item.col_2 || 0);

  // Evaluate formula columns dynamically
  columns.forEach(c => {
    if (c.type === 'FORMULA' && c.formula) {
      let parsed = c.formula.replace(/^=/, '').trim();
      const keys = Object.keys(values).sort((a, b) => b.length - a.length); // Prevent partial matching
      
      keys.forEach(key => {
        // Simple case-insensitive global replacement for words
        const regex = new RegExp(`\\b${key}\\b|${key}`, 'gi');
        parsed = parsed.replace(regex, values[key].toString());
      });

      try {
        const fn = new Function(`return ${parsed}`);
        const result = fn();
        values[c.name] = isNaN(result) ? 0 : result;
      } catch {
        values[c.name] = 0;
      }
    }
  });

  return values;
};

// Original SortableRow mapping
function SortableRow({ item, currencySymbol, updateItem, removeItem, formatCurrency, columns, taxType }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: 'relative' as const,
  };

  const values = computeRowValues(item, columns);
  
  const getEvaluatedValue = (colName: string) => {
    return formatCurrency(values[colName] || 0);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`p-4 hover:bg-slate-50 group border-b border-slate-100 last:border-0 ${isDragging ? 'bg-white shadow-xl rounded-xl border-0 ring-2 ring-primary/20 z-50' : 'z-0'}`}
    >
      <div className="sm:grid items-center gap-4 hidden" style={{ gridTemplateColumns: `30px repeat(${columns.filter(c => c.visible).length - 1}, minmax(100px, 1fr)) 120px 30px` }}>
        <div 
          ref={setActivatorNodeRef}
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-300 flex items-center justify-center hover:text-primary transition-colors shrink-0"
        >
          <GripVertical size={16} />
        </div>

        {columns.filter(c => c.visible).map((col, idx) => {
          const isLast = idx === columns.filter(c => c.visible).length - 1;
          
          let displayName = col.name;
          if (displayName === 'VAT Rate') displayName = `${taxType} Rate`;
          if (displayName === 'VAT') displayName = taxType;

          // Map hardcoded properties from old items
          let fieldId = col.id;
          if (col.name === 'Item') fieldId = 'description';
          else if (col.name === 'Quantity') fieldId = 'quantity';
          else if (col.name === 'Rate') fieldId = 'rate';

          if (col.type === 'FORMULA') {
             return (
               <div key={col.id} className={isLast ? 'flex justify-end' : ''}>
                 <input 
                   type="text"
                   readOnly
                   value={`${col.formula?.includes('Rate') || col.formula?.includes('Amount') || col.formula?.includes('Price') ? currencySymbol : ''}${getEvaluatedValue(col.name)}`}
                   className="w-full bg-slate-50 px-3 py-2 rounded-lg text-slate-500 cursor-not-allowed font-mono text-[13px] border border-transparent focus:outline-none text-end"
                 />
               </div>
             );
          }
          if (col.type === 'CURRENCY') {
             return (
               <div key={col.id} className={isLast ? 'flex justify-end' : ''}>
                 <div className="w-full flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500 transition-colors rounded-lg overflow-hidden shadow-sm">
                   <span className="text-slate-400 text-[11px] px-3 font-medium bg-slate-50 border-r border-slate-200 h-full flex items-center">{currencySymbol}</span>
                   <input 
                     type="number" 
                     value={item[fieldId] || ''}
                     onChange={(e) => updateItem(item.id, fieldId, parseFloat(e.target.value) || 0)}
                     className="w-full px-3 py-2 bg-transparent outline-none text-[13px] font-mono text-end placeholder:text-slate-300"
                   />
                 </div>
               </div>
             )
          }
          if (col.name === 'VAT Rate') {
             return (
               <div key={col.id} className={isLast ? 'flex justify-end' : ''}>
                 <div className="relative w-full">
                   <input 
                     type="number" 
                     placeholder="%"
                     value={item[fieldId] || ''}
                     onChange={(e) => updateItem(item.id, fieldId, parseFloat(e.target.value) || 0)}
                     className="w-full pl-3 pr-8 py-2 bg-white outline-none border border-slate-200 hover:border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 rounded-lg text-[13px] font-mono transition-colors shadow-sm placeholder:text-slate-300"
                   />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                     <span className="text-slate-400 text-sm font-medium">%</span>
                   </div>
                 </div>
               </div>
             )
          }
          if (col.type === 'NUMBER') {
             return (
               <div key={col.id} className={isLast ? 'flex justify-end' : ''}>
                 <input 
                   type="number" 
                   value={item[fieldId] || ''}
                   onChange={(e) => updateItem(item.id, fieldId, parseFloat(e.target.value) || 0)}
                   className="w-full px-3 py-2 bg-white outline-none border border-slate-200 hover:border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 rounded-lg text-[13px] font-mono transition-colors shadow-sm placeholder:text-slate-300"
                 />
               </div>
             )
          }
          return (
             <div key={col.id} className={isLast ? 'flex justify-end' : ''}>
               <input 
                 type="text" 
                 placeholder={displayName}
                 value={item[fieldId] || ''}
                 onChange={(e) => updateItem(item.id, fieldId, e.target.value)}
                 className="w-full bg-white outline-none px-3 py-2 border border-slate-200 hover:border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 rounded-lg text-sm placeholder:text-slate-300 transition-colors shadow-sm"
               />
             </div>
          )
        })}

        <button 
          onClick={() => removeItem(item.id)} 
          className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0"
          title="Remove Item"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {/* Mobile view logic */}
      <div className="flex flex-col gap-4 sm:hidden">
         {columns.filter(c => c.visible).map(col => {
           let displayName = col.name;
           if (displayName === 'VAT Rate') displayName = `${taxType} Rate`;
           if (displayName === 'VAT') displayName = taxType;

           let fieldId = col.id;
           if (col.name === 'Item') fieldId = 'description';
           else if (col.name === 'Quantity') fieldId = 'quantity';
           else if (col.name === 'Rate') fieldId = 'rate';

           return (
             <div key={col.id} className="space-y-1">
               <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{displayName.toUpperCase()}</label>
               {col.type === 'FORMULA' ? (
                 <input 
                   type="text"
                   readOnly
                   value={`${currencySymbol}${getEvaluatedValue(col.name)}`}
                   className="w-full px-3 py-2 bg-slate-50 border border-transparent rounded-lg text-slate-500 cursor-not-allowed font-mono text-[13px] shadow-sm text-end"
                 />
               ) : col.name === 'VAT Rate' ? (
                 <div className="relative w-full">
                   <input 
                     type="number" 
                     placeholder="%"
                     value={item[fieldId] || ''}
                     onChange={(e) => updateItem(item.id, fieldId, parseFloat(e.target.value) || 0)}
                     className="w-full pl-3 pr-8 py-2 bg-white outline-none border border-slate-200 hover:border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 rounded-lg text-sm transition-colors shadow-sm placeholder:text-slate-300"
                   />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                     <span className="text-slate-400 text-sm font-medium">%</span>
                   </div>
                 </div>
               ) : (
                 <input 
                   type={col.type === 'TEXT' ? 'text' : 'number'}
                   placeholder={displayName}
                   value={item[fieldId] || ''}
                   onChange={(e) => updateItem(item.id, fieldId, col.type === 'TEXT' ? e.target.value : (parseFloat(e.target.value) || 0))}
                   className="w-full bg-white outline-none px-3 py-2 border border-slate-200 hover:border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 rounded-lg text-sm transition-colors shadow-sm placeholder:text-slate-300"
                 />
               )}
             </div>
           )
         })}
         <button onClick={() => removeItem(item.id)} className="w-full py-2 border border-red-200 text-red-500 rounded-lg flex justify-center items-center gap-2"><Trash2 size={16}/> Remove Item</button>
      </div>
    </div>
  );
}

import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';

export default function InvoiceGenerator({ onPricingClick }: { onPricingClick?: () => void }) {
  const { user, isPro } = useUser();
  const { executeAction, isProcessing } = usePremiumAction('invoice-gen');
  const { requirePro } = useFeatureGate();
  const location = useLocation();

  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isAutosaved, setIsAutosaved] = useState(false);
  
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '1',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentTerms: 'Immediate',
    poNumber: '',
    fromBusiness: '',
    fromEmail: '',
    fromContact: '',
    fromAddress: '',
    fromPostalCode: '',
    fromCountry: '',
    toBusiness: '',
    toEmail: '',
    toContact: '',
    toAddress: '',
    toPostalCode: '',
    toCountry: '',
    shipTo: '',
    taxRate: 0,
    taxType: 'VAT',
    gstType: 'IGST',
    gstCess: false,
    gstReverseCharge: false,
    discount: 0,
    discountType: 'flat' as 'percent' | 'flat',
    shipping: 0,
    amountPaid: 0,
    notes: '',
    terms: '',
    currency: 'USD',
    paymentInstructions: '',
    paymentUrl: ''
  });

  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#0f4c75');
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>('classic');
  const [hoveredStyle, setHoveredStyle] = useState<HeaderStyle | null>(null);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(true);

  const [showNotes, setShowNotes] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);

  const [attachment, setAttachment] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setAttachment(e.target.files[0]);
    }
  };

  const handleCloseColumnsModal = () => {
    if (JSON.stringify(draftColumns) !== JSON.stringify(columns)) {
      setShowUnsavedPrompt(true);
    } else {
      setShowColumnsModal(false);
    }
  };
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [senderCustomFields, setSenderCustomFields] = useState<{label: string, value: string}[]>([]);
  const [clientCustomFields, setClientCustomFields] = useState<{label: string, value: string}[]>([]);

  const [columns, setColumns] = useState<any[]>([
    { id: 'col_1', name: 'Item', type: 'TEXT', visible: true, locked: true },
    { id: 'col_2', name: 'VAT Rate', type: 'NUMBER', visible: true, locked: false },
    { id: 'col_3', name: 'Quantity', type: 'NUMBER', visible: true, locked: false },
    { id: 'col_4', name: 'Rate', type: 'CURRENCY', visible: true, locked: false },
    { id: 'col_5', name: 'Amount', type: 'FORMULA', formula: 'Quantity * Rate', visible: false, locked: true },
    { id: 'col_6', name: 'VAT', type: 'FORMULA', formula: 'Amount * (VAT Rate / 100)', visible: false, locked: true },
    { id: 'col_7', name: 'Total', type: 'FORMULA', formula: 'Amount + VAT', visible: false, locked: true }
  ]);
  const [draftColumns, setDraftColumns] = useState<any[]>([...columns]);

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem('invoice_draft');
    if (saved) {
      try {
        const { invoiceData: d, items: i, logo: l, primaryColor: c, headerStyle: s } = JSON.parse(saved);
        setInvoiceData(d);
        setItems(i);
        setLogo(l);
        setPrimaryColor(c);
        setHeaderStyle(s || 'classic');
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    } else {
      setItems([
        { id: '1', description: 'Design Consultation & Strategy', quantity: 1, rate: 1500 },
        { id: '2', description: 'React component development', quantity: 40, rate: 85 }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoice_draft', JSON.stringify({ 
      invoiceData, items, logo, primaryColor, headerStyle 
    }));
    setIsAutosaved(true);
    const timer = setTimeout(() => setIsAutosaved(false), 2000);
    return () => clearTimeout(timer);
  }, [invoiceData, items, logo, primaryColor, headerStyle]);

  const clearDraft = () => {
    if (window.confirm('Clear all drafted content?')) {
      localStorage.removeItem('invoice_draft');
      window.location.reload();
    }
  };

  const calculateDueDate = (dateStr: string, terms: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    let days = 0;
    if (terms === 'Net 15') days = 15;
    else if (terms === 'Net 30') days = 30;
    else if (terms === 'Net 60') days = 60;
    else if (terms === 'Due on Receipt' || terms === 'Immediate') days = 0;
    else return invoiceData.dueDate;

    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handlePaymentTermsChange = (terms: string) => {
    const newDueDate = calculateDueDate(invoiceData.date, terms);
    setInvoiceData({ ...invoiceData, paymentTerms: terms, dueDate: newDueDate });
  };


  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'CAD', symbol: '$' },
    { code: 'AUD', symbol: '$' },
    { code: 'SAR', symbol: 'SR' },
    { code: 'AED', symbol: 'د.إ' },
    { code: 'JPY', symbol: '¥' },
    { code: 'INR', symbol: '₹' },
    { code: 'SGD', symbol: '$' },
    { code: 'CHF', symbol: 'CHF' },
    { code: 'ZAR', symbol: 'R' },
    { code: 'PKR', symbol: 'Rs' },
    { code: 'BDT', symbol: '৳' },
    { code: 'IDR', symbol: 'Rp' },
    { code: 'MYR', symbol: 'RM' },
    { code: 'PHP', symbol: '₱' },
    { code: 'VND', symbol: '₫' },
    { code: 'THB', symbol: '฿' }
  ];

  const currencySymbol = useMemo(() => 
    currencies.find(c => c.code === invoiceData.currency)?.symbol || '$'
  , [invoiceData.currency, currencies]);

  // Consuming payload from Zustand Store (Ecosystem Pipeline)
  const { invoicePayload, clearAllPayloads } = useEcosystemStore();

  useEffect(() => {
    if (invoicePayload) {
      const newItem: InvoiceItem = {
        id: crypto.randomUUID(),
        description: invoicePayload.itemName + (invoicePayload.description ? ` (${invoicePayload.description})` : ''),
        quantity: invoicePayload.quantity,
        rate: invoicePayload.rate,
        taxable: true
      };
      setItems(prev => [...prev, newItem]);
      clearAllPayloads();
    }
  }, [invoicePayload, clearAllPayloads]);

  // Logic to handle query parameters for late payment routing
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const original = params.get('original') || params.get('originalAmt');
    const lateFee = params.get('lateFee') || params.get('lateFeeAmt');
    const totalHours = params.get('totalHours') || params.get('totalHoursAmt');
    const totalEarned = params.get('totalEarned') || params.get('totalEarnedAmt');
    const currencyParam = params.get('currency');

    if (original || lateFee || totalHours || totalEarned) {
      const newItems: InvoiceItem[] = [];
      if (original) newItems.push({ id: 'original-invoice', description: 'Original Invoice Balance', quantity: 1, rate: Number(original) });
      if (lateFee) newItems.push({ id: 'late-fee', description: 'Late Payment Interest & Compensation', quantity: 1, rate: Number(lateFee) });
      if (totalEarned) newItems.push({ id: 'billable-hours', description: totalHours ? `Billable Hours (${totalHours} hrs)` : 'Logged Billable Hours', quantity: 1, rate: Number(totalEarned) });
      setItems(newItems);
      
      if (currencyParam) {
        const foundCurrency = currencies.find(c => c.symbol === currencyParam || c.code === currencyParam);
        if (foundCurrency) setInvoiceData(prev => ({ ...prev, currency: foundCurrency.code }));
      }

      setInvoiceData(prev => ({
        ...prev,
        notes: totalEarned ? 'Invoice generated from tracked billable hours.' : 'Revised invoice inclusive of late payment charges as per our terms.',
        invoiceNumber: (totalEarned ? 'BILL-' : 'REV-') + Math.floor(Math.random() * 1000)
      }));
    }
  }, [location.search, currencies]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const history = useMemo(() => historyService.getHistory().filter(i => i.toolId === 'invoice-generator'), [showHistory]);

  const saveToHistory = () => {
    historyService.addToHistory({
      toolId: 'invoice-generator',
      toolName: 'Invoice',
      summary: `Invoice #${invoiceData.invoiceNumber} for ${invoiceData.toBusiness || 'Client'} - $${total.toLocaleString()}`,
      data: { invoiceData, items, logo, primaryColor, headerStyle }
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    const { invoiceData, items, logo, primaryColor, headerStyle } = item.data;
    setInvoiceData(invoiceData);
    setItems(items);
    setLogo(logo);
    setPrimaryColor(primaryColor);
    setHeaderStyle(headerStyle);
    setShowHistory(false);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString() + Math.random().toString(36).substring(2, 9), description: '', quantity: 1, rate: 0, taxable: true }]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number | boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const hasVatColumn = columns.some(c => c.name === 'VAT' && c.visible);
  
  const subtotal = useMemo(() => items.reduce((acc, item) => {
    const vals = computeRowValues(item, columns); 
    return acc + (vals['Amount'] !== undefined ? vals['Amount'] : (item.quantity * item.rate) || 0);
  }, 0), [items, columns]);

  const taxAmount = useMemo(() => {
    if (hasVatColumn) {
      return items.reduce((acc, item) => acc + (computeRowValues(item, columns)['VAT'] || 0), 0);
    }
    const taxableSubtotal = items.reduce((acc, item) => acc + (item.taxable ? (item.quantity * item.rate) : 0), 0);
    return (taxableSubtotal * invoiceData.taxRate) / 100;
  }, [items, columns, hasVatColumn, invoiceData.taxRate]);
  
  const discountAmount = useMemo(() => {
    if (invoiceData.discountType === 'percent') {
      return (subtotal * invoiceData.discount) / 100;
    }
    return Number(invoiceData.discount) || 0;
  }, [subtotal, invoiceData.discount, invoiceData.discountType]);

  const total = subtotal + taxAmount + (Number(invoiceData.shipping) || 0) - discountAmount;
  const balanceDue = total - (Number(invoiceData.amountPaid) || 0);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    loadFromHistory(item);
  };

  const mockRecentInvoices: HistoryItem[] = [
    {
      id: 'mock-1',
      userId: user?.uid || 'temp',
      toolId: 'invoice-generator',
      toolName: 'Invoice',
      summary: 'Invoice #101 - Creative Direct Inc',
      timestamp: Date.now() - 86400000,
      data: {
        invoiceData: { ...invoiceData, invoiceNumber: '101', toBusiness: 'Creative Direct Inc' },
        items: [{ id: 'm1', description: 'Brand Identity', quantity: 1, rate: 3500 }],
        logo: null,
        primaryColor: '#0f4c75',
        headerStyle: 'modern'
      }
    },
    {
      id: 'mock-2',
      userId: user?.uid || 'temp',
      toolId: 'invoice-generator',
      toolName: 'Invoice',
      summary: 'Invoice #102 - TechFlow Solutions',
      timestamp: Date.now() - 172800000,
      data: {
        invoiceData: { ...invoiceData, invoiceNumber: '102', toBusiness: 'TechFlow Solutions' },
        items: [{ id: 'm2', description: 'API Development', quantity: 40, rate: 120 }],
        logo: null,
        primaryColor: '#1b998b',
        headerStyle: 'classic'
      }
    },
    {
      id: 'mock-3',
      userId: user?.uid || 'temp',
      toolId: 'invoice-generator',
      toolName: 'Invoice',
      summary: 'Invoice #103 - Stellar Agency',
      timestamp: Date.now() - 259200000,
      data: {
        invoiceData: { ...invoiceData, invoiceNumber: '103', toBusiness: 'Stellar Agency' },
        items: [{ id: 'm3', description: 'E-commerce Setup', quantity: 1, rate: 8000 }],
        logo: null,
        primaryColor: '#6c63ff',
        headerStyle: 'minimal'
      }
    }
  ];

  const displayedHistory = history.length > 0 ? history : mockRecentInvoices;

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setInvoiceData({
        invoiceNumber: '1',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentTerms: 'Immediate',
        poNumber: '',
        fromBusiness: '',
        fromEmail: '',
        fromContact: '',
        fromAddress: '',
        fromPostalCode: '',
        fromCountry: '',
        toBusiness: '',
        toEmail: '',
        toContact: '',
        toAddress: '',
        toPostalCode: '',
        toCountry: '',
        shipTo: '',
        taxRate: 0,
        taxType: 'VAT',
        gstType: 'IGST',
        gstCess: false,
        gstReverseCharge: false,
        discount: 0,
        discountType: 'flat',
        shipping: 0,
        amountPaid: 0,
        notes: '',
        terms: '',
        currency: 'USD',
        paymentInstructions: '',
        paymentUrl: ''
      });
      setItems([{ id: '1', description: '', quantity: 1, rate: 0 }]);
      setLogo(null);
      setSenderCustomFields([]);
      setClientCustomFields([]);
      localStorage.removeItem('invoice_draft');
    }
  };

  const exportToPDF = async () => {
    executeAction(async (userId) => {
      setIsExporting(true);
      try {
        await DatabaseService.logToolUsage('invoice-generator-pdf');
        const blob = await pdf(
          <InvoicePDF 
            invoiceData={invoiceData}
            items={items}
            logo={logo}
            primaryColor={primaryColor}
            currencySymbol={currencySymbol}
            subtotal={subtotal}
            taxAmount={taxAmount}
            discountAmount={discountAmount}
            total={total}
            balanceDue={balanceDue}
            isPro={isPro}
          />
        ).toBlob();
        
        await DatabaseService.saveUserDocument(userId, 'invoice_pdf', { invoiceData, items });
        
        const fileName = `Invoice_${invoiceData.toBusiness || 'Client'}_${invoiceData.invoiceNumber}.pdf`;
        saveAs(blob, fileName);
        saveToHistory();
      } catch (error) {
        console.error('PDF Generation failed:', error);
      } finally {
        setIsExporting(false);
      }
    });
  };

  const handleHistoryClick = () => {
    requirePro("Invoicing History", () => setShowHistory(!showHistory));
  };

  const handleReviewInvoice = () => {
    const errors: string[] = [];
    if (!invoiceData.fromBusiness?.trim()) errors.push("1. Your Business Name is required.");
    if (!invoiceData.toBusiness?.trim()) errors.push("2. Client Business Name is Empty.");
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setViewMode('preview');
  };

  const handleLoadMyProfile = () => {
    setInvoiceData({
      ...invoiceData,
      fromBusiness: 'DesignStudio LLC',
      fromEmail: 'hello@designstudio.com',
      fromContact: '+1 (555) 019-8273',
      fromAddress: '123 Creative Avenue, Suite 100\nSan Francisco, CA',
      fromPostalCode: '94107',
      fromCountry: 'United States'
    });
    setToastMessage('Profile data loaded securely.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoadItem = () => {
    // Stub for future inventory wiring
    console.log('Load saved item clicked');
  };

  const colors = ['#0f4c75', '#1b998b', '#6c63ff', '#1a1a2e', '#ff6b6b', '#f59e0b', '#10b981'];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {viewMode === 'edit' ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col space-y-6"
          >
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-4">
               <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-center">
                  <Layout className="text-primary" size={24} />
               </div>
               <div>
                 <div className="flex items-center gap-3">
                   <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice Generator</h1>
                   <button className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full" title="Share">
                     <Share2 size={16} />
                   </button>
                 </div>
                 <div className="flex items-center gap-3 mt-1.5">
                   <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-2 py-1 rounded">FREEMIUM</span>
                   {isAutosaved && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1"
                    >
                      <Check size={12} /> Autosaved
                    </motion.span>
                  )}
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleHistoryClick}
                className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <History size={14} /> {showHistory ? 'Back' : 'History'}
              </button>
              <button 
                onClick={handleClear}
                className="px-3 py-1.5 bg-slate-50 text-danger/70 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-danger/10 hover:text-danger transition-all border border-slate-200"
                title="Clear all fields"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showUnsavedPrompt && (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div initial={{scale: 0.95}} animate={{scale: 1}} exit={{scale: 0.95}} className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col relative text-center">
             <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <ShieldCheck size={24} />
             </div>
             <h3 className="text-xl font-bold mb-2">Discard changes?</h3>
             <p className="text-sm text-slate-500 mb-6">You have unused modifications to your formulas and columns. Are you sure you want to discard them?</p>
             <div className="flex gap-3 justify-center">
               <button onClick={() => setShowUnsavedPrompt(false)} className="px-5 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">No, Continue</button>
               <button onClick={() => { setShowUnsavedPrompt(false); setShowColumnsModal(false); setDraftColumns([...columns]); }} className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl transition-colors hover:bg-red-700">Yes, Discard</button>
             </div>
          </motion.div>
        </motion.div>
      )}

      {showHistory && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 max-h-60 overflow-y-auto">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Recently Generated Invoices</h4>
                  {displayedHistory.length > 0 ? (
                    displayedHistory.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => handleHistorySelect(item)}
                        className="w-full text-start p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-primary border border-slate-100">
                             <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">{item.summary}</p>
                            <p className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <Check size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No history yet.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-12">
            
            {/* Brand Identity / Design Section */}
            <div className="space-y-6 pb-8 border-b border-slate-100">
              <h4 className="text-xl font-bold flex items-center gap-2 mb-6">Brand Identity</h4>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Business Logo</label>
                <div className="flex items-center gap-6">
                  {logo ? (
                    <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
                      <img src={logo} alt="Logo" className="h-24 w-40 object-contain" />
                      <button 
                        onClick={() => setLogo(null)}
                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-primary transition-all group">
                      <Upload size={24} className="text-slate-400 group-hover:text-primary mb-2" />
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-primary uppercase tracking-widest">Upload High-Res Logo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Primary Brand Color</label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, index) => {
                      const isLocked = index > 0 && !isPro;
                      return (
                        <button 
                          key={color}
                          onClick={() => {
                            requirePro("Premium Colors", () => setPrimaryColor(color));
                          }}
                          className="w-10 h-10 rounded-full border-2 transition-all relative flex items-center justify-center shadow-md active:scale-95"
                          style={{ 
                            backgroundColor: color, 
                            borderColor: primaryColor === color ? 'white' : 'transparent', 
                            boxShadow: primaryColor === color ? `0 0 0 2px ${color}` : 'none' 
                          }}
                        >
                          {primaryColor === color && <Check size={20} className="text-white" />}
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                              <Lock size={14} className="text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => isPro ? document.getElementById('colorPicker')?.click() : requirePro("Custom Hex Branding", () => {})}
                      className="w-10 h-10 rounded-full border-2 border-transparent transition-all relative flex items-center justify-center shadow-md active:scale-95"
                      style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                    >
                      {!isPro && <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"><Lock size={14} className="text-white" /></div>}
                    </button>
                    <input 
                      type="color"
                      id="colorPicker"
                      value={primaryColor || '#0f4c75'}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-0 h-0 opacity-0 absolute"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Your Details</label>
                      <button 
                        onClick={handleLoadMyProfile}
                        className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline transition-opacity"
                      >
                        Load My Profile
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Your Business Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Business Name"
                          value={invoiceData.fromBusiness || ''}
                          onChange={(e) => setInvoiceData({...invoiceData, fromBusiness: e.target.value})}
                          className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="Add Email"
                          value={invoiceData.fromEmail || ''}
                          onChange={(e) => setInvoiceData({...invoiceData, fromEmail: e.target.value})}
                          className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Street Address</label>
                        <textarea 
                          rows={2}
                          placeholder="Add Street Address"
                          value={invoiceData.fromAddress || ''}
                          onChange={(e) => setInvoiceData({...invoiceData, fromAddress: e.target.value})}
                          className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Postal / Zip Code</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 94107"
                            value={invoiceData.fromPostalCode || ''}
                            onChange={(e) => setInvoiceData({...invoiceData, fromPostalCode: e.target.value})}
                            className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Country</label>
                          <select 
                            value={invoiceData.fromCountry || ''}
                            onChange={(e) => setInvoiceData({...invoiceData, fromCountry: e.target.value})}
                            className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors appearance-none shadow-sm"
                          >
                            <option value="">Select Country...</option>
                            <option value="United States">🇺🇸 United States</option>
                            <option value="United Kingdom">🇬🇧 United Kingdom</option>
                            <option value="Canada">🇨🇦 Canada</option>
                            <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                            <option disabled>──────────</option>
                            {COUNTRIES.filter(c => !["United States", "United Kingdom", "Canada", "Saudi Arabia"].includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Contact Number</label>
                        <div className="flex bg-white border border-slate-200 focus-within:border-slate-500 rounded-lg overflow-hidden shadow-sm transition-colors">
                          <select className="bg-slate-50 border-r border-slate-200 px-2 py-3 text-sm outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors">
                            {COUNTRY_DIAL_CODES.map(c => <option key={`from-${c.country}`} value={c.code}>{c.flag} {c.code}</option>)}
                          </select>
                          <input 
                            type="tel"
                            placeholder="(555) 000-0000"
                            className="w-full px-3 py-3 text-sm outline-none"
                            value={invoiceData.fromContact}
                            onChange={(e) => {
                               const val = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
                               setInvoiceData({...invoiceData, fromContact: val});
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {senderCustomFields.map((field, i) => (
                          <div key={`sender-cf-${i}`} className="col-span-2 flex items-center gap-2">
                             <input type="text" placeholder="Field Name (e.g., Tax ID)" value={field.label} onChange={(e) => { const newF = [...senderCustomFields]; newF[i].label = e.target.value; setSenderCustomFields(newF); }} className="w-1/3 bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-2 text-sm focus:outline-none" />
                             <input type="text" placeholder="Value" value={field.value} onChange={(e) => { const newF = [...senderCustomFields]; newF[i].value = e.target.value; setSenderCustomFields(newF); }} className="flex-1 bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-2 text-sm focus:outline-none" />
                             <button onClick={() => setSenderCustomFields(f => f.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 p-1"><X size={16}/></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setSenderCustomFields([...senderCustomFields, {label: '', value: ''}])} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors mt-2">
                        <PlusCircle size={12} /> Add Custom Fields
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Client's Details</label>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Client Business Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Client / Company Name"
                          value={invoiceData.toBusiness || ''}
                          onChange={(e) => setInvoiceData({...invoiceData, toBusiness: e.target.value})}
                          className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="Add Email"
                          value={invoiceData.toEmail || ''}
                          onChange={(e) => setInvoiceData({...invoiceData, toEmail: e.target.value})}
                          className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Street Address</label>
                        <textarea 
                          rows={2}
                          placeholder="Add Street Address"
                          value={invoiceData.toAddress || ''}
                          onChange={(e) => setInvoiceData({...invoiceData, toAddress: e.target.value})}
                          className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Postal / Zip Code</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 94107"
                            value={invoiceData.toPostalCode || ''}
                            onChange={(e) => setInvoiceData({...invoiceData, toPostalCode: e.target.value})}
                            className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Country</label>
                          <select 
                            value={invoiceData.toCountry || ''}
                            onChange={(e) => setInvoiceData({...invoiceData, toCountry: e.target.value})}
                            className="w-full bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-3 text-sm focus:outline-none transition-colors appearance-none shadow-sm"
                          >
                            <option value="">Select Country...</option>
                            <option value="United States">🇺🇸 United States</option>
                            <option value="United Kingdom">🇬🇧 United Kingdom</option>
                            <option value="Canada">🇨🇦 Canada</option>
                            <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                            <option disabled>──────────</option>
                            {COUNTRIES.filter(c => !["United States", "United Kingdom", "Canada", "Saudi Arabia"].includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Contact Number</label>
                        <div className="flex bg-white border border-slate-200 focus-within:border-slate-500 rounded-lg overflow-hidden shadow-sm transition-colors">
                          <select className="bg-slate-50 border-r border-slate-200 px-2 py-3 text-sm outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors">
                            {COUNTRY_DIAL_CODES.map(c => <option key={`to-${c.country}`} value={c.code}>{c.flag} {c.code}</option>)}
                          </select>
                          <input 
                            type="tel"
                            placeholder="(555) 000-0000"
                            className="w-full px-3 py-3 text-sm outline-none"
                            value={invoiceData.toContact}
                            onChange={(e) => {
                               const val = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
                               setInvoiceData({...invoiceData, toContact: val});
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {clientCustomFields.map((field, i) => (
                          <div key={`client-cf-${i}`} className="col-span-2 flex items-center gap-2">
                             <input type="text" placeholder="Field Name (e.g., Tax ID)" value={field.label} onChange={(e) => { const newF = [...clientCustomFields]; newF[i].label = e.target.value; setClientCustomFields(newF); }} className="w-1/3 bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-2 text-sm focus:outline-none" />
                             <input type="text" placeholder="Value" value={field.value} onChange={(e) => { const newF = [...clientCustomFields]; newF[i].value = e.target.value; setClientCustomFields(newF); }} className="flex-1 bg-white border border-slate-200 focus:border-slate-500 rounded-lg p-2 text-sm focus:outline-none" />
                             <button onClick={() => setClientCustomFields(f => f.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 p-1"><X size={16}/></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setClientCustomFields([...clientCustomFields, {label: '', value: ''}])} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors mt-2">
                        <PlusCircle size={12} /> Add Custom Fields
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Invoice #</label>
                      <input 
                        type="text" 
                        value={invoiceData.invoiceNumber || ''}
                        onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-mono text-sm shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                      <input 
                        type="date" 
                        value={invoiceData.date || ''}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          const newDueDate = calculateDueDate(newDate, invoiceData.paymentTerms);
                          setInvoiceData({...invoiceData, date: newDate, dueDate: newDueDate});
                        }}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Terms</label>
                      <select 
                        value={invoiceData.paymentTerms || ''}
                        onChange={(e) => handlePaymentTermsChange(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="Immediate">Immediate</option>
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 60">Net 60</option>
                        <option value="Due on Receipt">Due...</option>
                        <option value="TBD">TBD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                      <input 
                        type="date" 
                        value={invoiceData.dueDate || ''}
                        readOnly
                        className="w-full px-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none text-slate-500 text-sm shadow-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PO Number</label>
                      <input 
                        type="text" 
                        value={invoiceData.poNumber || ''}
                        onChange={(e) => setInvoiceData({...invoiceData, poNumber: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm"
                      />
                    </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-lg p-2 mb-4">
                     <div className="flex flex-wrap gap-2">
                       <button onClick={() => setShowTaxModal(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                         <Settings2 size={14} /> Configure {invoiceData.taxType || 'Tax'}
                       </button>
                       <select 
                          value={invoiceData.currency} 
                          onChange={(e) => setInvoiceData({...invoiceData, currency: e.target.value})}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer outline-none"
                       >
                          {currencies.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                       </select>
                     </div>
                     <button onClick={() => { setDraftColumns([...columns]); setShowColumnsModal(true); }} className="px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2">
                       <Settings2 size={12} /> Edit Columns/Formulas
                     </button>
                  </div>
                  <div className="bg-slate-900 text-white px-5 py-4 rounded-t-xl hidden sm:grid overflow-x-auto whitespace-nowrap items-center gap-4" style={{ gridTemplateColumns: `30px repeat(${columns.filter(c => c.visible).length - 1}, minmax(100px, 1fr)) 120px 30px` }}>
                     <span className="w-8 shrink-0"></span>
                     {columns.filter(c => c.visible).map((col, idx) => {
                       let displayName = col.name;
                       if (displayName === 'VAT Rate') displayName = `${invoiceData.taxType} Rate`;
                       if (displayName === 'VAT') displayName = invoiceData.taxType;
                       return (
                         <span key={col.id} className={`text-[10px] font-black uppercase tracking-widest ${idx === columns.filter(c => c.visible).length - 1 ? 'text-end' : ''}`}>{displayName.toUpperCase()}</span>
                       );
                     })}
                     <span className="w-8 shrink-0"></span>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-b-2xl overflow-hidden shadow-sm">
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="divide-y divide-slate-100">
                          <AnimatePresence initial={false}>
                            {items.map((item) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <SortableRow 
                                  item={item} 
                                  currencySymbol={currencySymbol}
                                  updateItem={updateItem}
                                  removeItem={removeItem}
                                  formatCurrency={formatCurrency}
                                  columns={columns}
                                  taxType={invoiceData.taxType}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </SortableContext>
                    </DndContext>
                    <div className="p-4 bg-slate-50/50 flex justify-between items-center">
                      <button onClick={addItem} className="text-xs font-black uppercase tracking-widest text-white bg-primary px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        <Plus size={16} /> Add Item
                      </button>
                      <button 
                        onClick={handleLoadItem}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <PackagePlus size={14} /> From Inventory
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <div className="w-full md:max-w-md bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Subtotal</span>
                      <span className="font-mono font-bold text-slate-900">{currencySymbol}{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm gap-4">
                      <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">{invoiceData.taxType} (%)</span>
                      <input 
                        type="number" 
                        value={invoiceData.taxRate || 0}
                        onChange={(e) => setInvoiceData({...invoiceData, taxRate: Number(e.target.value)})}
                        className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 text-sm text-end font-mono"
                      />
                    </div>

                    <div className="flex justify-between items-center text-sm gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Discount</span>
                        <button 
                          onClick={() => setInvoiceData({...invoiceData, discountType: invoiceData.discountType === 'percent' ? 'flat' : 'percent'})}
                          className="text-[9px] font-black uppercase tracking-widest bg-white border border-slate-200 px-1.5 py-0.5 rounded-md hover:border-slate-500 transition-colors"
                        >
                          {invoiceData.discountType === 'percent' ? '%' : 'Flat'}
                        </button>
                      </div>
                      <div className="relative">
                        {invoiceData.discountType === 'flat' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{currencySymbol}</span>}
                        <input 
                          type="number" 
                          value={invoiceData.discount || 0}
                          onChange={(e) => setInvoiceData({...invoiceData, discount: Number(e.target.value)})}
                          className={`w-24 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 text-sm text-end font-mono ${invoiceData.discountType === 'flat' ? 'pl-6 pr-3' : 'px-3'}`}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm gap-4">
                      <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Shipping</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{currencySymbol}</span>
                        <input 
                          type="number" 
                          value={invoiceData.shipping || 0}
                          onChange={(e) => setInvoiceData({...invoiceData, shipping: Number(e.target.value)})}
                          className="w-24 pl-6 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 text-sm text-end font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-lg font-black text-slate-900">Total</span>
                      <span className="text-lg font-black text-slate-900">{currencySymbol}{formatCurrency(total)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200">
                      <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Amount Paid</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{currencySymbol}</span>
                        <input 
                          type="number" 
                          value={invoiceData.amountPaid || 0}
                          onChange={(e) => setInvoiceData({...invoiceData, amountPaid: Number(e.target.value)})}
                          className="w-32 pl-6 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-500 text-sm text-end font-black"
                        />
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl flex justify-between items-center ${balanceDue > 0 ? 'bg-slate-800 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                      <span className="font-black uppercase tracking-[0.2em] text-[10px]">
                        {balanceDue > 0 ? 'Balance Due' : 'Overpaid / Credit'}
                      </span>
                      <span className="font-black text-lg font-mono">
                        {currencySymbol}{formatCurrency(Math.abs(balanceDue))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Additional Information</h4>
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <button onClick={() => setShowSignature(!showSignature)} className={`px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest border transition-colors ${showSignature ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>+ Add Signature</button>
                    <button onClick={() => setShowTerms(!showTerms)} className={`px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest border transition-colors ${showTerms ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>+ Add Terms & Conditions</button>
                    <button onClick={() => setShowNotes(!showNotes)} className={`px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest border transition-colors ${showNotes ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>+ Add Notes</button>
                    <button onClick={() => setShowAttachments(!showAttachments)} className={`px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest border transition-colors ${showAttachments ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>+ Add Attachments</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <AnimatePresence>
                     {showSignature && (
                       <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}} className="p-4 bg-slate-50 rounded-lg border border-slate-200 h-full">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Signature</label>
                          <div className="bg-white border border-slate-200 rounded-lg h-32 flex flex-col items-center justify-center text-slate-400 italic mt-4">
                            <p>Signature Field</p>
                            <p className="text-xs font-sans not-italic text-slate-300">Client will sign here</p>
                          </div>
                       </motion.div>
                     )}
                     {showAttachments && (
                       <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}} className="p-4 bg-slate-50 rounded-lg border border-slate-200 h-full relative">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attachments</label>
                          <input type="file" id="invoice-attachment" className="hidden" accept=".pdf,.jpg,.png" onChange={handleFileUpload} />
                          {attachment ? (
                            <div className="border-2 border-slate-200 bg-white rounded-xl p-4 flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText size={24} className="text-primary shrink-0" />
                                <span className="text-sm font-bold text-slate-700 truncate">{attachment.name}</span>
                              </div>
                              <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-red-500 p-2 shrink-0 transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ) : (
                            <div onClick={() => document.getElementById('invoice-attachment')?.click()} className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100 mt-4 font-sans transition-colors">
                              <Upload size={24} className="text-slate-400 mb-2" />
                              <span className="text-sm font-bold text-slate-500">Drop files here or click to upload</span>
                              <span className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</span>
                            </div>
                          )}
                       </motion.div>
                     )}
                     {showTerms && (
                       <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}}>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Terms & Conditions</label>
                          <textarea 
                            placeholder="Payment terms, late fees, etc."
                            rows={5}
                            value={invoiceData.terms || ''}
                            onChange={(e) => setInvoiceData({...invoiceData, terms: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-500 resize-none text-sm shadow-sm"
                          />
                       </motion.div>
                     )}
                     {showNotes && (
                       <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}}>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
                          <textarea 
                            placeholder="Additional notes for the client..."
                            rows={5}
                            value={invoiceData.notes || ''}
                            onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-500 resize-none text-sm shadow-sm"
                          />
                       </motion.div>
                     )}
                     </AnimatePresence>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 mt-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Payment Instructions</h4>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bank Details</label>
                      <textarea 
                        placeholder="Bank Name, Account #, SWIFT/BIC..."
                        rows={3}
                        value={invoiceData.paymentInstructions || ''}
                        onChange={(e) => setInvoiceData({...invoiceData, paymentInstructions: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary resize-none text-sm placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Online Payment URL</label>
                      <input 
                        type="url" 
                        placeholder="https://paypal.me/yourbusiness"
                        value={invoiceData.paymentUrl || ''}
                        onChange={(e) => setInvoiceData({...invoiceData, paymentUrl: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold flex items-center gap-2 mb-6 mt-12 pt-8 border-t border-slate-100">Display Layout & Settings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Display & Visibility</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Palette size={16} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-700">Tax Breakdown</span>
                        </div>
                        <button 
                          onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
                          className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${showTaxBreakdown ? 'bg-primary' : 'bg-slate-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showTaxBreakdown ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Invoice Layout Template</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(['classic', 'modern', 'minimal', 'bold', 'corporate', 'clean', 'minimalist', 'stylized'] as HeaderStyle[]).map((style, index) => {
                      const isLocked = style !== 'classic' && !isPro;
                      return (
                        <div key={style} className="relative group/template">
                          <button 
                            onClick={() => {
                              requirePro("Premium Layouts", () => {
                                setHeaderStyle(style);
                                // Template specific defaults
                                if (style === 'bold') setPrimaryColor('#1a1a2e');
                                if (style === 'corporate') setPrimaryColor('#0f4c75');
                                if (style === 'minimal') setPrimaryColor('#334155');
                                if (style === 'clean') setPrimaryColor('#2563eb');
                                if (style === 'stylized') setPrimaryColor('#8b5cf6');
                              });
                            }}
                            className={`w-full p-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all relative overflow-hidden h-24 flex flex-col items-center justify-center gap-2 ${
                              headerStyle === style 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-primary/40'
                            }`}
                          >
                            <span className={isLocked ? 'opacity-30' : ''}>{style}</span>
                            {isLocked && <Lock size={12} className="text-slate-300" />}
                            {headerStyle === style && (
                              <div className="absolute top-2 right-2">
                                <Check size={14} className="text-white" />
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          {/* Validation Errors */}
          <AnimatePresence>
            {validationErrors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex flex-col gap-1 mb-4 mt-8"
              >
                <p className="font-bold text-sm mb-1">Please fix the following errors to continue:</p>
                {validationErrors.map((err, i) => (
                  <p key={i} className="text-sm font-medium">{err}</p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Bar */}
            <div className="sticky bottom-4 z-40 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex justify-between items-center mt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">Ready to preview?</p>
              <button 
                onClick={handleReviewInvoice}
                className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg active:scale-95"
              >
                Review Invoice &rarr;
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="w-full flex-col gap-6 h-fit"
          >
        <UniversalDocumentPreview
          isLoading={isExporting}
          documentName={`Invoice_${invoiceData.toBusiness || 'Client'}_${invoiceData.invoiceNumber}`}
          onExportStart={exportToPDF}
          primaryColor={primaryColor}
          toolId="invoice-generator"
          containerClassName="w-full max-w-[1120px] mx-auto"
          extraActions={
            <button 
              onClick={() => setViewMode('edit')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              &larr; Back to Edit
            </button>
          }
        >
          <div 
            ref={invoiceRef}
            className="w-full max-w-[1120px] mx-auto bg-white p-4 sm:p-8 md:p-12 shadow-2xl ring-1 ring-slate-200 sm:rounded-lg mb-20"
            style={{ 
              minHeight: '1056px',
            }}
          >
            <InvoiceTemplateSwitcher 
              style={headerStyle as any}
              invoiceData={invoiceData}
              items={items}
              logo={logo}
              primaryColor={primaryColor}
              currencySymbol={currencySymbol}
              subtotal={subtotal}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              total={total}
              balanceDue={balanceDue}
              columns={columns}
              formatCurrency={formatCurrency}
              senderCustomFields={senderCustomFields}
              clientCustomFields={clientCustomFields}
            />
          </div>
        </UniversalDocumentPreview>
      </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {showTaxModal && (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div initial={{scale: 0.95}} animate={{scale: 1}} exit={{scale: 0.95}} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Configure Tax</h3>
              <button onClick={() => setShowTaxModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">1. Select Tax Type <span className="text-red-500">*</span></label>
                <select 
                  value={invoiceData.taxType}
                  onChange={(e) => setInvoiceData({...invoiceData, taxType: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-slate-500 appearance-none font-medium text-slate-700 text-sm"
                >
                  <option value="NONE">NONE</option>
                  <option value="VAT">VAT</option>
                  <option value="GST">GST</option>
                  <option value="Sales Tax">Sales Tax</option>
                  <option value="PPN">PPN</option>
                  <option value="TVA">TVA</option>
                  <option value="HST">HST</option>
                </select>
              </div>
              
              {invoiceData.taxType === 'GST' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">2. GST Type <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="gstType" 
                          value="IGST" 
                          checked={invoiceData.gstType === 'IGST'}
                          onChange={(e) => setInvoiceData({...invoiceData, gstType: e.target.value})}
                          className="accent-primary"
                        />
                        <span className="text-sm font-medium text-slate-700">IGST</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="gstType" 
                          value="CGST_SGST" 
                          checked={invoiceData.gstType === 'CGST_SGST'}
                          onChange={(e) => setInvoiceData({...invoiceData, gstType: e.target.value})}
                          className="accent-primary"
                        />
                        <span className="text-sm font-medium text-slate-700">CGST & SGST</span>
                      </label>
                    </div>
                    
                    <div className="mt-3">
                      <button 
                        onClick={() => setInvoiceData({...invoiceData, gstCess: !invoiceData.gstCess})}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${invoiceData.gstCess ? 'bg-primary text-white border-primary' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {invoiceData.gstCess ? '- Remove Cess' : '+ Add Cess'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-4">3. Other Options</label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={invoiceData.gstReverseCharge}
                        onChange={(e) => setInvoiceData({...invoiceData, gstReverseCharge: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" 
                      />
                      <span className="text-sm font-medium text-slate-700">Is Reverse Charge Applicable?</span>
                    </label>
                  </div>
                </>
              )}
              {invoiceData.taxType !== 'GST' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-4">2. Other Options</label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={invoiceData.gstReverseCharge}
                      onChange={(e) => setInvoiceData({...invoiceData, gstReverseCharge: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" 
                    />
                    <span className="text-sm font-medium text-slate-700">Is Reverse Charge Applicable?</span>
                  </label>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-slate-100">
              <button onClick={() => setShowTaxModal(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-colors">Cancel</button>
              <button onClick={() => setShowTaxModal(false)} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl transition-colors shadow-md hover:bg-slate-800">Save Changes</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showColumnsModal && (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div initial={{scale: 0.95}} animate={{scale: 1}} exit={{scale: 0.95}} className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl flex flex-col relative max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Customize Columns & Formulas</h3>
              <button onClick={handleCloseColumnsModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0"><Settings2 size={16} /></div>
                <div>
                  <p className="font-bold text-pink-900 text-sm">Need Advanced Formulas?</p>
                  <p className="text-xs text-pink-700">Add custom calculations tailored to your business logic.</p>
                </div>
              </div>
              <Link to="/contact">
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors whitespace-nowrap shrink-0">
                  Talk to an expert now
                </button>
              </Link>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 pb-4">
              {draftColumns.map((col, i) => (
                <div key={col.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 group">
                  <div className="text-slate-400 cursor-grab px-1 hover:text-slate-600"><GripVertical size={16} /></div>
                  <span className="text-xs font-mono font-bold text-slate-400 w-6 text-center">{String.fromCharCode(65 + (i % 26))}{Math.floor(i/26) + 1}</span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      value={col.name} 
                      onChange={(e) => {
                        const newCols = [...draftColumns];
                        newCols[i].name = e.target.value;
                        setDraftColumns(newCols);
                      }}
                      readOnly={col.locked}
                      className={`w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-bold focus:outline-none ${col.locked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:border-slate-500'}`} 
                    />
                    {col.type === 'FORMULA' ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 bg-slate-100 px-1 rounded">fx</span>
                        <input 
                           type="text" 
                           value={col.formula || ''} 
                           onChange={(e) => {
                              const newCols = [...draftColumns];
                              newCols[i].formula = e.target.value;
                              setDraftColumns(newCols);
                           }}
                           placeholder="=C1 * D1"
                           className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pr-2.5 pl-10 text-xs font-mono text-slate-700 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" 
                        />
                      </div>
                    ) : (
                      <select 
                        value={col.type} 
                        onChange={(e) => {
                          const newCols = [...draftColumns];
                          newCols[i].type = e.target.value;
                          setDraftColumns(newCols);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-slate-500 appearance-none"
                      >
                        <option value="TEXT">TEXT</option>
                        <option value="NUMBER">NUMBER</option>
                        <option value="CURRENCY">CURRENCY</option>
                        <option value="FORMULA">FORMULA</option>
                      </select>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        const newCols = [...draftColumns];
                        newCols[i].visible = !newCols[i].visible;
                        setDraftColumns(newCols);
                      }}
                      className={`p-2 transition-colors ${col.visible ? 'text-slate-600 hover:text-slate-800' : 'text-slate-300 hover:text-slate-500'}`}
                    >
                      <Eye size={18} />
                    </button>
                    {!col.locked && (
                      <button 
                        onClick={() => {
                          const newCols = draftColumns.filter((_, idx) => idx !== i);
                          setDraftColumns(newCols);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <button 
                  onClick={() => setDraftColumns([...draftColumns, { id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, name: 'New Column', type: 'TEXT', visible: true, locked: false }])}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
                >
                  <Plus size={16} /> Add New Column
                </button>
              </div>
            </div>
            
            <div className="w-full bg-primary text-white flex items-center justify-between px-4 py-3 rounded-t-lg mt-8 text-sm font-medium overflow-x-auto">
              <div className="flex items-center gap-6 min-w-max">
                {draftColumns.filter(c => c.visible).map(c => (
                  <span key={c.id}>{c.name}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 bg-slate-50 px-4 pb-4 -mx-6 -mb-6 rounded-b-2xl">
              <button 
                onClick={handleCloseColumnsModal} 
                className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setColumns(draftColumns);
                  setShowColumnsModal(false);
                }} 
                className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl transition-colors shadow-md hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm"
        >
          <Check size={16} className="text-emerald-400" />
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>

    {/* SEO Section */}
    <InvoiceSEO />
    {/* Refactoring... everything below this will be removed in next step */}
    <div className="hidden opacity-0 pointer-events-none">
      {/* Intro */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-6">Online Invoice Generator for Pakistan — GST, NTN, STRN & FBR Compliance</h2>
        <div className="text-lg leading-relaxed text-slate-600 space-y-6">
          <p>
            In Pakistan, business invoicing is governed by the Federal Board of Revenue (FBR) under the Sales Tax Act 1990. The standard GST (General Sales Tax) rate in Pakistan is 18%, applicable to most taxable goods. For services, the rate varies by province — administered separately by provincial revenue authorities such as the Sindh Revenue Board (SRB), Punjab Revenue Authority (PRA), and KPK Revenue Authority (KPKRA).
          </p>
          <p>
            Every GST-registered business must include its National Tax Number (NTN) and Sales Tax Registration Number (STRN) — both issued by the FBR — on every invoice they create. Pakistan has also introduced mandatory e-invoicing through the FBR's PRAL system (Pakistan Revenue Automation Limited), requiring large businesses to report invoices electronically in real time.
          </p>
          <p>
            Refrens free invoice generator helps Pakistani businesses create professional invoices with NTN and STRN details, correct GST rates, and totals in Pakistani Rupee (PKR) — keeping every invoice FBR-compliant.
          </p>
        </div>
      </div>

      {/* GST Registration Threshold */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">GST Registration Threshold in Pakistan</h3>
        <p className="text-lg leading-relaxed text-slate-600">
          Manufacturers with annual turnover above PKR 10 million, importers, and exporters are required to register for GST with the FBR. Service providers register with their respective provincial revenue authority. Refrens online invoice generator supports both goods and services invoice formats for Pakistani businesses.
        </p>
      </div>

      {/* What is a Tax Invoice */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">What is a Tax Invoice in Pakistan? — Invoice Generator Guide</h3>
        <p className="text-lg leading-relaxed text-slate-600">
          A sales tax invoice in Pakistan is the official billing document for FBR-registered businesses supplying taxable goods or services. It is the document your business client uses to claim input tax adjustments on their GST return — reducing the net GST they owe to the FBR. Issuing an incomplete or non-compliant invoice can trigger FBR penalties and block your client's input tax claim, damaging business relationships.
        </p>
      </div>

      {/* Valid Pakistan Sales Tax Invoice Must Include */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">What a Valid Pakistan Sales Tax Invoice Must Include</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-8">
          Refrens online invoice generator ensures every invoice you create meets FBR requirements:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">"Tax Invoice"</span>
             <p className="text-slate-600">Clearly labelled at the top</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Supplier Details</span>
             <p className="text-slate-600">Supplier's name, address, NTN, and STRN — your FBR-registered details</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Sequential Data</span>
             <p className="text-slate-600">Invoice date and sequential invoice number</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Buyer Information</span>
             <p className="text-slate-600">Buyer's name, address, and NTN/STRN — for input tax adjustment claims</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Goods/Services</span>
             <p className="text-slate-600">Description of goods or services — with HS code for goods</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Line Items</span>
             <p className="text-slate-600">Quantity, unit price, and value excluding GST — per line item</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">GST Details</span>
             <p className="text-slate-600">GST rate (18% or applicable rate) and GST amount — clearly separated</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <span className="block font-black text-slate-900 mb-2">Total Amount</span>
             <p className="text-slate-600">Total amount payable — in Pakistani Rupee (PKR)</p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 md:col-span-2">
             <span className="block font-black text-slate-900 mb-2">FBR Reference</span>
             <p className="text-slate-600">FBR invoice reference number — for businesses on the PRAL e-invoicing system</p>
           </div>
        </div>
        <p className="mt-8 text-lg leading-relaxed text-slate-600">
          Use Refrens free invoice generator to draft and organise invoice details before submitting through PRAL — keeping your FBR records accurate and reducing the risk of audit discrepancies.
        </p>
      </div>

      {/* Invoice Definition & Concepts */}
      <div className="space-y-12">
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Invoice Definition - What is an Invoice?</h3>
          <p className="text-lg leading-relaxed text-slate-600">
            An invoice summarizes the transactions between the buyer(customer) and the seller(vendor) for the sales of goods or services. It showcases the total amount to be paid for the services or products rendered by the customer. It holds all the necessary information like buyer details, seller details, reference number, product/service description, quantity, rate, tax amount, terms, and conditions of the payment. It also has information about the available payment mode for the buyer.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Online Invoice - What is an Online Invoice?</h3>
          <div className="text-lg leading-relaxed text-slate-600 space-y-4">
            <p>
              An invoice created using either Google Docs, Google Sheets, online invoice templates, or using an invoice software like Refrens is considered as online invoicing. It holds the same information as traditional invoices do. Creating invoices online is easy and also saves your hard-earned time which you can utilize further for business growth. It is always harder to create invoice online at the end of the month and search for the older invoices.
            </p>
            <p>
              So using an invoice maker like Refrens, less to no Paperwork is required and also no risk of losing invoices. You can easily create invoices, manage, send and track all your invoice in one place. No fear of losing your invoices and can also access them whenever you required them. The best part about Refrens is - you can create invoices online without paying a single penny. FREE INVOICES FOR LIFETIME.
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-6">Invoice Purpose - What is an invoice used for?</h3>
          <p className="text-lg leading-relaxed text-slate-600 mb-8">
            Invoice is one of the major business documents used for accounting purposes. Using invoice, one can easily manage and track all the payment received and due from a particular client. It helps businesses to record all the sales transactions happening between both the parties, i.e.: between client and vendor. Here are some other reasons why one should invoice in business:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "One of the best ways to accept payment from the clients.",
              "To track future growth of the business.",
              "To keep track of sales.",
              "To keep track of inventory.",
              "Easy to file tax returns.",
              "Proof of sales happened between both the parties.",
              "Easy to track pending payments.",
              "Legal protection against lawsuits."
            ].map((purpose, i) => (
              <div key={`purpose-${i}`} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-emerald-100 text-emerald-600 rounded-full p-1 mt-1 shrink-0"><Check size={16} /></div>
                <p className="text-slate-700 font-medium">{purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Generator Intro */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">Invoice Generator</h3>
        <p className="text-lg leading-relaxed text-slate-600">
          An invoice generator or free invoice maker is a tool used to create an invoice online without any hassle or error. Using an online invoice generator, create invoices, send PDF invoices, customize invoices with invoice templates, download or print invoices etc. which is not possible in handwritten invoices. It has become easy for small business owners and freelancers to automate the invoicing process using a free invoice generator.
        </p>
      </div>

      {/* Q&A styled sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">What is the difference between invoice and receipt?</h3>
          <p className="text-slate-600 leading-relaxed">
            An invoice is a document asking for the payment. Whereas the receipt is a proof of payment done by the buyer to seller. A receipt is proof that the buyer has received the goods or services from the seller. You can create both invoice and payment receipt on Refrens using invoice maker.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">What is an invoice format?</h3>
          <p className="text-slate-600 leading-relaxed">
            An invoice format is basically the invoice template or layout. An invoice format breaks all the elements of invoice in a simple format so that it becomes easy for you to create invoice online. For different professions, there are different invoice format like consultant invoice format.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Who can issue the invoice?</h3>
          <p className="text-slate-600 leading-relaxed">
            Generally, the supplier issues the invoice for the goods or services they offer to the customer.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">What is the difference between an invoice and a bill?</h3>
          <p className="text-slate-600 leading-relaxed">
            Yes, both are the same and portray the same information. Only difference is that invoice is issued by the supplier or the business providing the products or services. The same invoice is recorded as a bill for the customer or the person receiving the products or service.
          </p>
        </div>
      </div>

      {/* How Online Invoice Saves your Time */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">How Online Invoice Saves your Time?</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-8">
          Use an invoice maker like Refrens can help you to save a lot of time and energy, thus helps you to focus on growing your business. Here are some of the reasons:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             "Easily generate invoices instantly.",
             "Autosave your client data and item description for further use.",
             "Organize all your invoice in seconds.",
             "Get Essential Business Reports.",
             "Use professional templates that are compatible with printers.",
             "Track all your invoices - know if the customer opened your mail.",
             "Share your invoices quickly via email or WhatsApp share.",
             "Check Invoice status - paid, unpaid, overdue, part-paid.",
             "Access your invoice and client data from anywhere in the world.",
             "Use other free tools offered by Refrens"
           ].map((benefit, i) => (
              <div key={`benefit-${i}`} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Check size={18} /></div>
                <p className="font-semibold text-slate-800">{benefit}</p>
              </div>
           ))}
        </div>
      </div>

      {/* Types of invoices */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">What are the types of invoices in Invoice Generator Software?</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-8">
          There are a total 6 types of invoices created in a business according to the needs and requirements. All the invoices mentioned below carry different purposes in invoicing. Creating the right type of invoice for the right client at the right time is extremely important to get sales done and get paid faster.
        </p>
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Standard Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Standard invoice is a normal invoice created by the vendor for the client which includes all the basic details like invoice date, invoice number, payment due date, vendor address, client address, product or service name with quantity, rate, subtotal and total amount.
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Proforma Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Proforma invoice is a non legal invoice created for the supplier to make agreement between both the parties for the payment terms and committing to deliver the products or services at a specified date and time. You can create the proforma invoice template here.
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Service Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Service invoice is usually created by service based businesses who do not deal with the products. Service businesses like digital marketers, lawyers, Shopify developers, consultants etc. charge their client hourly rather than quantity wise for the services. Using our free invoice generator, you can easily use the “Add/Rename Column” feature to hide, add or edit the column name and can charge hourly.
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Commercial Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Commercial invoices are used by the export/import business owners which include slightly more information than a standard invoice. It has all the information similar to standard invoice and extra information like shipping details, country of supply, place of supply, total packages to be delivered and weight of the packages.
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Recurring Invoice</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Recurring invoices are created by the businesses who charge fixed prices from their client and are charged either on a weekly or monthly basis like apartment rent, bills, subscription or any fixed price software. Recurring invoice is created and sent to the client on a monthly basis until the client cancels or ends the contract or subscription.
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="md:w-1/4">
              <h4 className="text-lg font-bold text-slate-900">Credit Note</h4>
            </div>
            <div className="md:w-3/4 text-slate-600">
              Credit note is issued by the supplier when the client returns the product for reasons like damage or mistake. Here on Refrens, you can create all the above invoices easily without any hassle using our online invoice maker.
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Number */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">Invoice Number - Basics Explained in Invoice Generator</h3>
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">What is an invoice number?</h4>
            <p className="text-lg leading-relaxed text-slate-600">
              An invoice number is one of the most important elements of the invoice. Invoice number helps to track and organize each invoice you create. When creating invoice, invoice number should be unique for every invoice and also it should be sequentially followed. Invoice numbers can contain both numbers and alphabets. For example: When the first invoice is created, you can assign invoice number either 001 or INV/001. The same should be followed when creating the second invoice, it can be either 001 or INV/002.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-4">How to assign invoice number when using online invoice maker?</h4>
            <p className="text-lg leading-relaxed text-slate-600 mb-6">
              There are numerous methods to adding the invoice number when using the invoice maker. Of which the best methods are as followers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Sequential Method</h5>
                <p className="text-slate-600 text-sm">
                  This is the most common and easy method to assign the invoice number and also used by most of the businesses. Here your invoice number is in increasing order and starts from 1. For example: Invoice No 001, Invoice No 002, Invoice No 003 and so on or 2021/INV/001, 2021/INV/002, 2021/INV/003 and so on.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Date Wise Method</h5>
                <p className="text-slate-600 text-sm">
                  Here, you use the date and unique number as the invoice number. For example: If you are issuing the invoice on April 23, 2021 then you can have the invoice number 2021-04-23-001. Here it becomes easy to track the invoice, date wise.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Project/Client Id Method</h5>
                <p className="text-slate-600 text-sm">
                  Many businesses work on different projects. Here you can assign the project number as the invoice number. For example, if you have completed the project number 185, then you can assign invoice number 185. Or issue by Client ID like 387-001.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-6">How to Make an Invoice Online using Free Invoice Generator?</h3>
        <p className="text-lg leading-relaxed text-slate-600 mb-8">
          When creating an invoice for the first time, you have to add the invoicing details to the blank invoice. Here is the step by step guide on how to make an invoice using all the essential elements of a free invoice generator. You only need a mobile or laptop or desktop with internet connection.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">1</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Invoice Header</h4>
               <p className="text-slate-600 text-sm">This is the section where you add the invoice number, Issue and Due Date of the invoice. You can also add the company or business logo to look more professional.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">2</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Billed By</h4>
               <p className="text-slate-600 text-sm">It means to add the information of the seller(vendor) who is offering the product or service. It holds all the information of the seller like business name, address, email, phone number.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">3</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Billed To</h4>
               <p className="text-slate-600 text-sm">Opposite to billed by, billed to holds all the necessary information of the buyer of the product or service. It holds all the information about the buyer.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">4</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Tax</h4>
               <p className="text-slate-600 text-sm">Add your tax rate, it will auto calculate your tax amount and the final amount of the invoice.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">5</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Product/Service Details</h4>
               <p className="text-slate-600 text-sm">Add the product/service name and description along with the quantity and rate of the particular product offered by the seller.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">6</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Discounts & Charges</h4>
               <p className="text-slate-600 text-sm">You can give discounts on the item that you sold. Refrens’ online invoice generator automatically calculates the discounts & additional charges.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">7</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Terms & Conditions</h4>
               <p className="text-slate-600 text-sm">Add your company or invoicing terms and conditions so that you can get paid faster or to be clear on the record.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">8</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Additional Notes</h4>
               <p className="text-slate-600 text-sm">As the name suggests, you can add extra information or instruction related to the product or service you offered.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">9</div>
             <div>
               <h4 className="font-bold text-slate-900 mb-2">Customize Invoice</h4>
               <p className="text-slate-600 text-sm">Once the invoice is created you can customize the invoice as per your requirement by changing the invoice template, or changing the color of the invoice.</p>
             </div>
           </div>
        </div>
      </div>

      {/* Mistakes */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">What are the invoicing mistakes to avoid when you create invoice online?</h3>
        <ul className="list-disc pl-6 space-y-4 text-lg text-slate-600 marker:text-slate-400">
           <li><strong className="text-slate-900">Incorrect invoice date</strong> - The date should be correct in it should be the date when the invoice was created.</li>
           <li><strong className="text-slate-900">Incomplete details</strong> - Invoice must have all the details of the vendor or service provider and client details. It should include all the detailed information about the product or service offered.</li>
           <li><strong className="text-slate-900">Spelling mistakes</strong> - Avoid spelling mistakes when creating the invoice. Create an invoice in simple terms and language. Avoid using technical jargon or the short form of any word.</li>
           <li><strong className="text-slate-900">Incorrect total</strong> - The price and quantity decided at the time of agreement is different and the invoice created for the same agreement is different. This is the most common cause of the rejection of the invoice. Avoid adding the wrong tax rate.</li>
        </ul>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-8">Frequently Asked Questions (FAQ)</h3>
        <div className="space-y-4">
           {[
             {
               q: "What is an invoice?",
               a: "An invoice is a business financial document that a seller gives to a buyer. It acts like a bill. The invoice shows what products or services the seller gave, how much each one cost, and the total money the buyer needs to pay. The invoice is important because it asks the buyer for money and keeps a record of the transaction for both the buyer and the seller."
             },
             {
               q: "How to use invoice generator online?",
               a: "Refrens invoice generator allows you to create invoices for free without taking much time. Head over to Refrens invoice generator and start creating invoices using pre-formatted invoice templates. You can add your logo, brand colors, and multiple invoice templates and use many more such features to keep your brand consistent."
             },
             {
               q: "What is an invoice generator?",
               a: "Invoice generator or free invoice maker is a software tool used to create invoices online which is similar to handwritten invoices or created using excel sheet. It includes all the basics of an invoice like company logo, invoice title, invoice date, company and client details, product or service sold, quantity, rate and information related to tax and payment details. Send PDF invoices, customize invoices with invoice templates, download or print invoices etc. which is not possible in handwritten invoices."
             },
             {
               q: "Is Refrens invoice generator free?",
               a: "FREE! Refrens invoice generator is free for every small business, agency, startup, and entrepreneur. You can generate 15 documents every year. Also, manage invoices and access free templates."
             },
             {
               q: "Are there Multiple Invoice Templates?",
               a: "Yes, there are multiple invoice templates on Refrens you can use. Not just templates, you can also change the color of each template and font headings as well."
             },
             {
               q: "Can I create a recurring invoice online?",
               a: "Yes, you can create weekly, monthly, and yearly recurring invoices on Refrens. You can also customize the dates as per your requirements."
             },
             {
               q: "Do I need to sign up to use this invoice maker?",
               a: "Yes, Refrens account is necessary to use this invoice generator. While creating an account, you can access all the invoices in one place and also make the invoice creation process easy."
             },
             {
               q: "Can I add Custom Fields while generating invoices online?",
               a: "Yes, you can add additional fields and columns as well. Refrens allow extra fields that help you to add more information about the company or product/service you offer."
             },
             {
               q: "Can I save the invoice created online?",
               a: "Yes. All the invoices created by you are saved online. You can access all the invoices anytime just by logging into your account."
             },
             {
               q: "Can I do client management and save information for further invoicing requirements?",
               a: "Yes, you can save and manage all the details of your client under client management tab. This feature helps you to avoid retying of customer details every time on the invoice."
             },
             {
               q: "Is my data secure?",
               a: "Yes. Your data is stored securely with encryption and cloud protection. We are ISO/IEC 27001:2022 certified. Your data stays private and is safely stored on the cloud."
             },
             {
               q: "Can I Add my Company Logo?",
               a: "Yes. You can upload your logo by clicking on the logo box from the top right corner. You can upload both .jpg and .png format for the logo image."
             },
             {
               q: "Why is an invoice maker free?",
               a: "We want to enable easy transactions for Freelancers, Service Agencies and Small Businesses. We make revenue through Refrens marketplace."
             },
             {
               q: "Why Refrens free invoice generator is best?",
               a: "Refrens is a top-tier free invoice generator because it provides a comprehensive, no-cost business solution. You create and send invoices to clients without paying any amount. The tool offers total customization, letting you adjust fields and columns freely. Refrens gives you flexible sharing options like to download the invoice as a PDF or send it directly via email or WhatsApp."
             }
           ].map((faq, i) => (
              <details key={`faq-${i}`} className="group bg-white border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900 font-bold">
                  <h4 className="text-lg">{faq.q}</h4>
                  <span className="shrink-0 rounded-full bg-slate-50 p-2 text-slate-900 group-open:-rotate-180 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 text-lg leading-relaxed">
                  {faq.a}
                </div>
              </details>
           ))}
        </div>
      </div>
    </div>
  </div>
);
}
