import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Calendar, DollarSign, ArrowRight, Gavel, History, Check, FileText, Lock, Globe, X } from 'lucide-react';
import { historyService, HistoryItem } from '../../lib/history-service';
import { useNavigate } from 'react-router-dom';
import { useEcosystemStore } from '../../store/useEcosystemStore';

const CURRENCIES = [
  { symbol: '$', label: 'USD' },
  { symbol: '£', label: 'GBP' },
  { symbol: '€', label: 'EUR' },
  { symbol: '¥', label: 'JPY' },
  { symbol: '₹', label: 'INR' },
];

export default function LatePaymentCalculator() {
  const navigate = useNavigate();
  const { setInvoicePayload } = useEcosystemStore();
  const [amount, setAmount] = useState(1500);
  const [currency, setCurrency] = useState('$');
  const [dueDate, setDueDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [interestRate, setInterestRate] = useState(8); // Statutory 8%
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFixedFeeEnabled, setIsFixedFeeEnabled] = useState(false);
  const [fixedFeeAmount, setFixedFeeAmount] = useState(70);
  const [tone, setTone] = useState<'gentle' | 'firm' | 'legal'>('firm');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  useEffect(() => {
    const unsub = historyService.subscribe((items) => {
      setHistory(items.filter(i => i.toolId === 'late-payment-calculator'));
    });
    return unsub;
  }, []);

  const calc = () => {
    const start = new Date(dueDate);
    const end = new Date(paymentDate);
    const diffTime = Math.max(0, end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Simple interest calculation: (Amount * Rate * Days) / (365 * 100)
    const interest = (amount * (interestRate / 100) * diffDays) / 365;
    
    let compensation = 0;
    if (diffDays > 0) {
      if (isFixedFeeEnabled) {
        compensation = fixedFeeAmount;
      } else {
        if (amount < 1000) compensation = 40;
        else if (amount < 10000) compensation = 70;
        else compensation = 100;
      }
    }

    return {
      daysLate: diffDays,
      interest: Number(interest.toFixed(2)),
      compensation: compensation,
      totalOwed: Number((amount + interest + compensation).toFixed(2))
    };
  };

  const results = calc();

  const getMessage = () => {
    const { interest, compensation, totalOwed } = results;
    const items = [];
    if (interest > 0) items.push(`${currency}${interest} statutory interest`);
    if (compensation > 0) items.push(`${currency}${compensation} fixed compensation fee`);
    
    const breakdown = items.join(" plus a ");

    switch (tone) {
      case 'gentle':
        return `Hi there, we noticed your payment for this invoice is slightly past due. To keep things simple, we've applied a small late fee of ${currency}${(interest + compensation).toFixed(2)}. We'd appreciate if you could settle the total balance of ${currency}${totalOwed} as soon as possible. Thanks!`;
      case 'legal':
        return `FINAL NOTICE: Your payment is now significantly overdue. We have exercised our statutory right to claim interest (${currency}${interest}) and compensation (${currency}${compensation}) under late payment legislation. Unless the sum of ${currency}${totalOwed} is received within 7 days, we will refer this matter to formal debt collection.`;
      default:
        return `Pursuant to Late Payment of Commercial Debts legislation, we are charging ${breakdown || 'a late fee'} for this overdue payment. The total now due is ${currency}${totalOwed}.`;
    }
  };

  const saveToHistory = () => {
    historyService.addToHistory({
      toolId: 'late-payment-calculator',
      toolName: 'Late Payment',
      summary: `${results.daysLate} days late - ${currency}${results.totalOwed} total`,
      data: { amount, dueDate, interestRate, paymentDate, currency, isFixedFeeEnabled, fixedFeeAmount }
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    setAmount(item.data.amount);
    setDueDate(item.data.dueDate);
    setInterestRate(item.data.interestRate);
    setPaymentDate(item.data.paymentDate);
    setCurrency(item.data.currency || '$');
    setIsFixedFeeEnabled(item.data.isFixedFeeEnabled || false);
    setFixedFeeAmount(item.data.fixedFeeAmount || 70);
    setShowHistory(false);
  };

  const handleGenerateInvoice = () => {
    setInvoicePayload({
      itemName: "Overdue Balance + Statutory Interest & Fees",
      quantity: 1,
      rate: results.totalOwed,
      description: `Original Balance: ${currency}${amount} | Interest: ${currency}${results.interest.toFixed(2)} | Late Fee: ${currency}${results.compensation.toFixed(2)}`
    });
    navigate('/tools/invoice-generator');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Form */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldAlert className="text-danger" size={20} /> Overdue Invoice
            </h3>
            <button 
              onClick={() => setShowHistory(true)}
              className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
            >
              <History size={14} /> History
            </button>
          </div>

          <div className="space-y-6">
            {/* Amount & Currency */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Original Invoice Amount</label>
              <div className="flex gap-3">
                <div className="relative w-28 shrink-0">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <select
                    value={currency || '$'}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full pl-8 pr-2 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-danger text-sm appearance-none cursor-pointer"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.symbol} value={c.symbol}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-grow">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">{currency}</span>
                  <input 
                    type="number" 
                    value={amount || 0}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-danger/5 focus:border-danger font-mono text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                  <Calendar size={10} /> Invoice Due Date
                </label>
                <input 
                  type="date" 
                  value={dueDate || ''}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-danger text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                  <Calendar size={10} /> Payment Date
                </label>
                <input 
                  type="date" 
                  value={paymentDate || ''}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-danger text-sm"
                />
              </div>
            </div>

            {/* Interest & Fixed Fee Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Annual Interest RATE (%)</label>
                <input 
                  type="number" 
                  value={interestRate || 0}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-danger font-mono"
                />
                <p className="text-[9px] text-slate-400 px-1 italic">Statutory rate is usually ~8%</p>
              </div>

              <div className="flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fixed compensation fee</span>
                  {/* Custom Toggle Switch */}
                  <button 
                    onClick={() => setIsFixedFeeEnabled(!isFixedFeeEnabled)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${isFixedFeeEnabled ? 'bg-[#0f4c75]' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      layout
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                      animate={{ x: isFixedFeeEnabled ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
                {isFixedFeeEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">{currency}</span>
                    <input 
                      type="number" 
                      placeholder="Amount"
                      value={fixedFeeAmount || 0}
                      onChange={(e) => setFixedFeeAmount(Number(e.target.value))}
                      className="w-full pl-7 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-danger font-mono text-sm"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Result Card */}
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-stretch sticky top-24">
        <label className="text-danger font-black text-[10px] uppercase tracking-[0.3em] mb-4 block text-center">Days Overdue</label>
        <div className="text-8xl font-black font-display text-slate-900 mb-12 text-center flex items-baseline justify-center gap-2">
          {results.daysLate} <span className="text-2xl text-slate-300 font-sans tracking-normal uppercase italic">Days</span>
        </div>

        <div className="space-y-5 mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Interest Owed ({interestRate}%)</span>
            <span className="font-bold font-mono text-slate-900">{currency}{results.interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-500">
             <div className="flex items-center gap-1.5">
               <span>Late Compensation</span>
               <div className="group relative">
                 <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-slate-800 text-white text-[10px] rounded-xl shadow-2xl w-48 z-20 leading-relaxed">
                   Fixed fee allowed for debt recovery under commercial payment acts.
                 </div>
                 <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] cursor-help">?</div>
               </div>
             </div>
            <span className="font-bold font-mono text-slate-900">{currency}{results.compensation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="pt-5 border-t border-slate-200 flex justify-between items-center">
            <span className="text-slate-900 font-bold uppercase tracking-widest text-[11px]">Revised Total</span>
            <span className="text-4xl font-black text-danger font-mono">{currency}{results.totalOwed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="space-y-4">
           <button 
            onClick={handleGenerateInvoice}
            className="w-full py-5 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
           >
             Generate Revised Invoice <ArrowRight size={18} />
           </button>
           <button 
            onClick={saveToHistory}
            className="w-full py-4 bg-white text-slate-400 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm"
           >
             <History size={16} /> Save to Calculation History
           </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
           <div className="flex items-center justify-between mb-5">
             <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
               <Gavel size={14} className="text-danger" /> Escalation Segment
             </h4>
           </div>

           {/* Segmented Control */}
           <div className="bg-slate-100 p-1 rounded-2xl flex mb-4 border border-slate-200 sm:max-w-xs sm:mx-auto">
             {[
               { id: 'gentle', label: 'Gentle', pro: true },
               { id: 'firm', label: 'Firm', pro: false },
               { id: 'legal', label: 'Legal', pro: true }
             ].map(t => (
               <button
                key={t.id}
                onClick={() => t.pro ? setShowProModal(true) : setTone(t.id as any)}
                className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${tone === t.id ? 'bg-white text-danger shadow-md shadow-danger/5' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {t.label}
                 {t.pro && <Lock size={10} className="opacity-50" />}
               </button>
             ))}
           </div>

           <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed font-mono select-all relative group italic">
             <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-danger border border-slate-100 rounded-full">Drafted Message</span>
             "{getMessage()}"
           </div>
        </div>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                    <History size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Calculation History</h3>
                    <p className="text-xs text-slate-400 font-medium tracking-wide font-sans">RELOAD PREVIOUS FEE SCHEDULES</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-8 overflow-y-auto space-y-3">
                {history.length > 0 ? (
                  history.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-6 bg-slate-50 hover:bg-white rounded-3xl transition-all border border-transparent hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-danger border border-slate-100 shadow-sm transition-colors">
                           <DollarSign size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.summary}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">
                            {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 items-center justify-center flex opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRight size={16} className="text-danger" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-20 px-10">
                    <History size={48} className="mx-auto text-slate-200 mb-6" />
                    <h4 className="text-lg font-bold text-slate-300">No records found</h4>
                    <p className="text-sm text-slate-400 mt-2">Saved calculations will appear here for quick drafting.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pro Modal */}
      <AnimatePresence>
        {showProModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative"
            >
              <div className="w-20 h-20 bg-danger/10 rounded-3xl flex items-center justify-center text-danger mb-8 mx-auto">
                <Lock size={36} />
              </div>
              <h3 className="text-3xl font-black mb-4 text-center">Escalation Scripts</h3>
              <p className="text-slate-500 mb-10 text-center leading-relaxed">
                Unlock AI-powered escalation scripts and legal terminology to protect your client relationships and recover debt professionally.
              </p>
              <div className="space-y-4">
                <button className="w-full py-5 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
                  Upgrade to Pro Access
                </button>
                <button 
                  onClick={() => setShowProModal(false)}
                  className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all text-sm"
                >
                  Return to Firm Tone
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
