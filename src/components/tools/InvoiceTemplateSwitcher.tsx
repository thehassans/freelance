import React from 'react';
import { Mail, Phone, MapPin, Globe, CreditCard } from 'lucide-react';

interface InvoiceTemplateProps {
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'corporate' | 'clean' | 'minimalist' | 'stylized';
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
  columns: any[];
  formatCurrency: (value: number) => string;
  senderCustomFields: { label: string; value: string }[];
  clientCustomFields: { label: string; value: string }[];
}

const computeRowValues = (item: any, columns: any[]): Record<string, number> => {
  const values: Record<string, number> = {};
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
        else if (c.name === 'VAT Rate') val = item.taxRate || 0;
        else val = 0;
      }
      values[c.name] = typeof val === 'string' ? parseFloat(val) || 0 : (val as number || 0);
    }
  });
  columns.forEach(c => {
    if (c.type === 'FORMULA' && c.formula) {
      let parsed = c.formula.replace(/^=/, '').trim();
      Object.keys(values).sort((a, b) => b.length - a.length).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        parsed = parsed.replace(regex, values[key].toString());
      });
      try {
        const fn = new Function(`return ${parsed}`);
        values[c.name] = isNaN(fn()) ? 0 : fn();
      } catch {
        values[c.name] = 0;
      }
    }
  });
  return values;
};

const TemplateTable = ({ items, columns, currencySymbol, formatCurrency, primaryColor }: { items: any[], columns: any[], currencySymbol: string, formatCurrency: (v: number) => string, primaryColor: string }) => {
  const visibleCols = columns.filter(c => c.visible);

  return (
    <div className="w-full overflow-x-auto print:overflow-visible mb-8">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            {visibleCols.map((col, idx) => {
              const isNumeric = col.type === 'NUMBER' || col.type === 'CURRENCY' || (col.type === 'FORMULA' && col.name !== 'Item');
              return (
                <th 
                  key={col.id} 
                  className={`py-3 px-4 text-[10px] uppercase font-black tracking-widest text-slate-400 ${isNumeric ? 'text-right' : 'text-left'}`}
                  style={idx === 0 ? { width: '40%' } : {}}
                >
                  {col.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, i) => {
            const vals = computeRowValues(item, columns);
            return (
              <tr key={item.id || i} className="group hover:bg-slate-50 transition-colors">
                {visibleCols.map((col, idx) => {
                  const isNumeric = col.type === 'NUMBER' || col.type === 'CURRENCY' || (col.type === 'FORMULA' && col.name !== 'Item');
                  const isDescription = col.name === 'Item' || col.id === 'col_1';
                  
                  let displayValue = '';
                  if (col.type === 'CURRENCY' || (col.type === 'FORMULA' && ['Amount', 'Total', 'VAT'].includes(col.name))) {
                    displayValue = `${currencySymbol}${formatCurrency(vals[col.name] || 0)}`;
                  } else {
                    displayValue = isDescription ? (item.description || '--') : (vals[col.name]?.toString() || '--');
                  }

                  return (
                    <td 
                      key={col.id} 
                      className={`py-4 px-4 text-sm break-words whitespace-normal ${isNumeric ? 'text-right font-mono' : 'text-left'} ${isDescription ? 'font-semibold text-slate-900' : 'text-slate-600'}`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const TotalsSection = ({ subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, formatCurrency, primaryColor, taxType }: any) => (
  <div className="flex justify-end mt-8 print:mt-4">
    <div className="w-full max-w-[300px] space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500 font-medium">Subtotal</span>
        <span className="text-slate-900 font-semibold">{currencySymbol}{formatCurrency(subtotal)}</span>
      </div>
      {taxAmount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">{taxType}</span>
          <span className="text-slate-900 font-semibold">{currencySymbol}{formatCurrency(taxAmount)}</span>
        </div>
      )}
      {discountAmount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Discount</span>
          <span className="text-emerald-600 font-semibold">-{currencySymbol}{formatCurrency(discountAmount)}</span>
        </div>
      )}
      <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center">
        <span className="text-lg font-bold text-slate-900">Total</span>
        <span className="text-2xl font-black" style={{ color: primaryColor }}>{currencySymbol}{formatCurrency(total)}</span>
      </div>
      {balanceDue !== total && (
        <div className="flex justify-between items-center text-sm pt-2">
          <span className="text-slate-500 font-medium">Balance Due</span>
          <span className="text-slate-900 font-bold">{currencySymbol}{formatCurrency(balanceDue)}</span>
        </div>
      )}
    </div>
  </div>
);

export const InvoiceTemplateSwitcher: React.FC<InvoiceTemplateSwitcherProps> = (props) => {
  const { style, invoiceData, items, logo, primaryColor, currencySymbol, subtotal, taxAmount, discountAmount, total, balanceDue, columns, formatCurrency, senderCustomFields, clientCustomFields } = props;

  const renderModern = () => (
    <div className="flex min-h-[900px] print:min-h-0 bg-white">
      <div className="w-[260px] flex-shrink-0 bg-indigo-600 print:bg-white print:text-slate-900 flex flex-col p-9 text-white items-center space-y-6" style={{ backgroundColor: primaryColor }}>
        <div className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center overflow-hidden mb-5">
          {logo ? <img src={logo} className="w-full h-full object-contain" alt="logo" /> : <span className="text-2xl font-bold" style={{ color: primaryColor }}>FK</span>}
        </div>
        <div className="text-center">
          <p className="font-bold text-sm tracking-tight">{invoiceData.fromBusiness}</p>
          <p className="text-[10px] opacity-75">{invoiceData.fromEmail}</p>
        </div>
        <div className="w-full h-px bg-white/20 my-5" />
        <div className="w-full space-y-4">
          <div>
            <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1">Phone</p>
            <p className="text-xs font-semibold">{invoiceData.fromContact || '--'}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1">Address</p>
            <p className="text-xs font-semibold whitespace-pre-line">{invoiceData.fromAddress || '--'}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1">Due Date</p>
            <p className="text-xs font-semibold">{invoiceData.dueDate}</p>
          </div>
        </div>
        <div className="mt-auto w-full bg-white/10 rounded-xl p-4 text-center">
          <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1">Invoice No.</p>
          <p className="text-2xl font-black">#{invoiceData.invoiceNumber}</p>
        </div>
      </div>
      <div className="flex-1 p-10 bg-white min-w-0">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-[11px] uppercase font-bold tracking-[0.15em] text-indigo-500" style={{ color: primaryColor }}>Invoice</p>
            <p className="text-3xl font-black text-slate-900">Tax Invoice</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Issue Date</p>
            <p className="text-sm font-bold text-slate-900">{invoiceData.date}</p>
          </div>
        </div>
        <div className="mb-8">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Bill To</p>
          <p className="text-lg font-black text-slate-900">{invoiceData.toBusiness}</p>
          <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{invoiceData.toAddress}</p>
          <p className="text-xs text-slate-500 mt-1">{invoiceData.toEmail}</p>
        </div>
        <TemplateTable {...props} />
        <TotalsSection {...props} taxType={invoiceData.taxType} />
      </div>
    </div>
  );

  const renderClassic = () => (
    <div className="bg-white w-full">
      <div className="bg-slate-900 p-8 flex justify-between items-center" style={{ backgroundColor: primaryColor }}>
        <h1 className="text-3xl font-black text-white tracking-[0.1em]">INVOICE</h1>
        <div className="w-24 h-14 border border-white/20 rounded flex items-center justify-center overflow-hidden">
          {logo ? <img src={logo} className="w-full h-full object-contain" alt="logo" /> : <span className="text-white text-[10px] font-bold">LOGO</span>}
        </div>
      </div>
      <div className="p-9">
        <p className="text-sm font-bold text-slate-900 mb-6">{invoiceData.fromBusiness} · {invoiceData.fromEmail} · {invoiceData.fromContact || '--'}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Bill To</p>
            <p className="text-sm font-bold text-slate-900">{invoiceData.toBusiness}</p>
            <p className="text-xs text-slate-500 whitespace-pre-line">{invoiceData.toAddress}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Invoice #</p>
            <p className="text-sm font-bold text-slate-900">#{invoiceData.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Issue Date</p>
            <p className="text-sm font-bold text-slate-900">{invoiceData.date}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Due Date</p>
            <p className="text-sm font-bold text-slate-900">{invoiceData.dueDate}</p>
          </div>
        </div>
        <TemplateTable {...props} />
        <TotalsSection {...props} taxType={invoiceData.taxType} />
        {invoiceData.paymentInstructions && (
          <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 whitespace-pre-line leading-relaxed">
            {invoiceData.paymentInstructions}
          </div>
        )}
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="bg-white p-12 md:p-14">
      <h1 className="text-5xl font-light text-slate-900 tracking-tight mb-1">Invoice</h1>
      <p className="text-xs text-slate-400 mb-9 uppercase tracking-widest">No. {invoiceData.invoiceNumber} · {invoiceData.fromBusiness}</p>
      <div className="h-px bg-slate-200 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <p className="text-[9px] uppercase font-semibold tracking-[0.2em] text-slate-400 mb-2">From</p>
          <p className="text-sm font-semibold text-slate-900">{invoiceData.fromBusiness}</p>
          <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{invoiceData.fromAddress}</p>
          <p className="text-xs text-slate-500">{invoiceData.fromEmail}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase font-semibold tracking-[0.2em] text-slate-400 mb-2">Bill To</p>
          <p className="text-sm font-semibold text-slate-900">{invoiceData.toBusiness}</p>
          <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{invoiceData.toAddress}</p>
          <p className="text-xs text-slate-500">{invoiceData.toEmail}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase font-semibold tracking-[0.2em] text-slate-400 mb-2">Issued</p>
          <p className="text-sm font-semibold text-slate-900 mb-3">{invoiceData.date}</p>
          <p className="text-[9px] uppercase font-semibold tracking-[0.2em] text-slate-400 mb-2">Due</p>
          <p className="text-sm font-semibold text-slate-900">{invoiceData.dueDate}</p>
        </div>
      </div>
      <TemplateTable {...props} />
      <TotalsSection {...props} taxType={invoiceData.taxType} />
    </div>
  );

  const renderBold = () => (
    <div className="bg-white p-10">
      <div className="mb-10">
        <h1 className="text-[64px] font-black leading-none tracking-tighter text-slate-900 mb-3 print:text-5xl">INVOICE</h1>
        <div className="w-20 h-2 bg-amber-500 rounded-full mb-6" style={{ backgroundColor: primaryColor }} />
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="bg-amber-100 text-amber-900 px-4 py-1.5 rounded-lg text-xs font-black">#{invoiceData.invoiceNumber} · {invoiceData.fromBusiness}</div>
          <div className="text-xs font-bold text-slate-500">Due: {invoiceData.dueDate}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest text-amber-600 mb-1" style={{ color: primaryColor }}>From</p>
          <p className="text-sm font-bold text-slate-900">{invoiceData.fromBusiness}</p>
          <p className="text-xs text-slate-500 whitespace-pre-line">{invoiceData.fromAddress}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest text-amber-600 mb-1" style={{ color: primaryColor }}>Bill To</p>
          <p className="text-sm font-bold text-slate-900">{invoiceData.toBusiness}</p>
          <p className="text-xs text-slate-500 whitespace-pre-line">{invoiceData.toAddress}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest text-amber-600 mb-1" style={{ color: primaryColor }}>Issue Date</p>
          <p className="text-sm font-bold text-slate-900">{invoiceData.date}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest text-amber-600 mb-1" style={{ color: primaryColor }}>Terms</p>
          <p className="text-sm font-bold text-slate-900">{invoiceData.paymentTerms}</p>
        </div>
      </div>
      <TemplateTable {...props} />
      <TotalsSection {...props} taxType={invoiceData.taxType} />
    </div>
  );

  const renderCorporate = () => (
    <div>
      <div className="h-3 bg-slate-800" style={{ backgroundColor: primaryColor }} />
      <div className="bg-white p-8 md:p-10">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
              {logo ? <img src={logo} className="w-full h-full object-contain" alt="logo" /> : <span className="text-xs font-black">FK</span>}
            </div>
            <div>
              <p className="text-lg font-black text-slate-800">{invoiceData.fromBusiness}</p>
              <p className="text-[11px] text-slate-500">{invoiceData.fromEmail} · {invoiceData.fromContact || '--'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-blue-50 px-4 py-2 rounded-lg inline-block border border-blue-100">
              <p className="text-[9px] uppercase font-bold tracking-widest text-blue-900 opacity-60 mb-1">Invoice</p>
              <p className="text-lg font-black text-blue-900">#{invoiceData.invoiceNumber}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-50">
            <p className="text-[9px] uppercase font-bold tracking-widest text-blue-900 opacity-60 mb-2">From</p>
            <p className="text-sm font-bold text-blue-900 mb-1">{invoiceData.fromBusiness}</p>
            <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">{invoiceData.fromAddress}</p>
          </div>
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-50">
            <p className="text-[9px] uppercase font-bold tracking-widest text-blue-900 opacity-60 mb-2">Bill To</p>
            <p className="text-sm font-bold text-blue-900 mb-1">{invoiceData.toBusiness}</p>
            <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">{invoiceData.toAddress}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-50 text-center">
            <p className="text-[9px] uppercase font-bold text-blue-900 opacity-60 mb-1">Issue Date</p>
            <p className="text-xs font-bold text-blue-900">{invoiceData.date}</p>
          </div>
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-50 text-center">
            <p className="text-[9px] uppercase font-bold text-blue-900 opacity-60 mb-1">Due Date</p>
            <p className="text-xs font-bold text-blue-900">{invoiceData.dueDate}</p>
          </div>
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-50 text-center">
            <p className="text-[9px] uppercase font-bold text-blue-900 opacity-60 mb-1">Terms</p>
            <p className="text-xs font-bold text-blue-900">{invoiceData.paymentTerms}</p>
          </div>
        </div>
        <TemplateTable {...props} />
        <TotalsSection {...props} taxType={invoiceData.taxType} />
        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 italic">Thank you for your business — we look forward to working with you again.</p>
        </div>
      </div>
    </div>
  );

  const renderClean = () => (
    <div className="bg-slate-50 p-8 min-h-full">
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-teal-600 mb-1" style={{ color: primaryColor }}>Invoice</h1>
        <div className="bg-teal-50 text-teal-700 font-bold px-4 py-1.5 rounded-full text-xs inline-block mb-10" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>#{invoiceData.invoiceNumber} · {invoiceData.fromBusiness}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-50">
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-2">From</p>
            <p className="text-sm font-bold text-slate-800">{invoiceData.fromBusiness}</p>
            <p className="text-[11px] text-slate-500 whitespace-pre-line">{invoiceData.fromAddress}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-50">
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-2">Bill To</p>
            <p className="text-sm font-bold text-slate-800">{invoiceData.toBusiness}</p>
            <p className="text-[11px] text-slate-500 whitespace-pre-line">{invoiceData.toAddress}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-50">
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-2">Due Date</p>
            <p className="text-sm font-bold text-slate-800">{invoiceData.dueDate}</p>
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-2 mb-1">Terms</p>
            <p className="text-sm font-bold text-slate-800">{invoiceData.paymentTerms}</p>
          </div>
        </div>
        <TemplateTable {...props} />
        <TotalsSection {...props} taxType={invoiceData.taxType} />
      </div>
    </div>
  );

  const renderMinimalist = () => (
    <div className="bg-white p-14 space-y-8">
      <div className="flex justify-between items-end border-b border-black pb-2">
        <p className="text-sm font-light uppercase tracking-[0.4em]">Invoice</p>
        <p className="text-sm font-bold italic">#{invoiceData.invoiceNumber}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div className="space-y-1">
          <p className="font-bold">{invoiceData.fromBusiness}</p>
          <p className="text-slate-600">{invoiceData.fromEmail}</p>
          <p className="text-slate-600 whitespace-pre-line">{invoiceData.fromAddress}</p>
        </div>
        <div className="space-y-1">
          <p className="font-bold">{invoiceData.toBusiness}</p>
          <p className="text-slate-600">{invoiceData.toEmail}</p>
          <p className="text-slate-600 whitespace-pre-line">{invoiceData.toAddress}</p>
        </div>
        <div className="space-y-1">
          <p><strong>Issued</strong> {invoiceData.date}</p>
          <p><strong>Due</strong> {invoiceData.dueDate}</p>
        </div>
      </div>
      <div className="w-full h-px bg-slate-200" />
      <TemplateTable {...props} />
      <div className="flex justify-end pt-8">
        <div className="w-full max-w-[240px] space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Subtotal</span>
            <span>{currencySymbol}{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Tax ({invoiceData.taxRate}%)</span>
            <span>{currencySymbol}{formatCurrency(taxAmount)}</span>
          </div>
          <div className="w-full h-px bg-black my-4" />
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Total Due</span>
            <span className="text-3xl font-black">{currencySymbol}{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStylized = () => (
    <div className="bg-white relative overflow-hidden min-h-[1056px] print:min-h-0">
      <div className="absolute top-0 left-0 w-[240px] h-[240px] print:w-40 print:h-40 bg-indigo-600" style={{ backgroundColor: primaryColor, clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <div className="absolute bottom-0 right-0 w-[120px] h-[120px] bg-slate-100" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
      <div className="relative z-10 px-10 pt-10">
        <div className="text-white mb-10">
          <h1 className="text-[44px] font-black leading-none mb-1 tracking-wider">INVOICE</h1>
          <p className="bg-white/20 inline-block px-3 py-1 rounded-full text-[10px] font-bold">#{invoiceData.invoiceNumber}</p>
        </div>
        <div className="flex justify-end mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-indigo-600 p-1 bg-white overflow-hidden flex items-center justify-center shrink-0" style={{ borderColor: primaryColor }}>
            {logo ? <img src={logo} className="w-full h-full object-contain" alt="logo" /> : <span className="font-black text-xs">FK</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 mb-8">
          <div className="border-l-4 border-indigo-600 pl-5" style={{ borderColor: primaryColor }}>
            <p className="text-[9px] uppercase font-bold tracking-widest text-indigo-500 mb-1" style={{ color: primaryColor }}>From</p>
            <p className="text-lg font-bold text-slate-800">{invoiceData.fromBusiness}</p>
            <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{invoiceData.fromAddress}</p>
            <p className="text-xs text-slate-500 mt-1">{invoiceData.fromEmail}</p>
          </div>
          <div className="border-l-4 border-indigo-600 pl-5" style={{ borderColor: primaryColor }}>
            <p className="text-[9px] uppercase font-bold tracking-widest text-indigo-500 mb-1" style={{ color: primaryColor }}>Bill To</p>
            <p className="text-lg font-bold text-slate-800">{invoiceData.toBusiness}</p>
            <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{invoiceData.toAddress}</p>
            <p className="text-xs text-slate-500 mt-1">{invoiceData.toEmail}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
           {[
             { l: 'Issue Date', v: invoiceData.date },
             { l: 'Due Date', v: invoiceData.dueDate },
             { l: 'Terms', v: invoiceData.paymentTerms },
             { l: 'Currency', v: invoiceData.currency }
           ].map((meta, i) => (
             <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center text-center">
               <p className="text-[8px] uppercase tracking-widest text-indigo-500 font-bold mb-1" style={{ color: primaryColor }}>{meta.l}</p>
               <p className="text-xs font-black text-slate-800">{meta.v}</p>
             </div>
           ))}
        </div>
        <TemplateTable {...props} />
        <TotalsSection {...props} taxType={invoiceData.taxType} />
        <div className="flex justify-end mt-4">
           {invoiceData.paymentInstructions && (
             <div className="w-full max-w-sm mt-8 border-l-2 border-slate-100 pl-6 py-2 italic text-slate-400 text-xs">
                {invoiceData.paymentInstructions}
             </div>
           )}
        </div>
      </div>
    </div>
  );

  switch (style) {
    case 'modern': return renderModern();
    case 'classic': return renderClassic();
    case 'minimal': return renderMinimal();
    case 'bold': return renderBold();
    case 'corporate': return renderCorporate();
    case 'clean': return renderClean();
    case 'minimalist': return renderMinimalist();
    case 'stylized': return renderStylized();
    default: return renderClassic();
  }
};

interface InvoiceTemplateSwitcherProps extends InvoiceTemplateProps {}
