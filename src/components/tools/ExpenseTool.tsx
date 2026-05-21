import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, PieChart, TrendingDown, DollarSign, Wallet, History, Check, FileText, Flame, TrendingUp } from 'lucide-react';
import { historyService, HistoryItem } from '../../lib/history-service';
import { toast } from 'sonner';

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
}

export default function ExpenseTool() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Software Subscriptions', amount: 99, category: 'Software' },
    { id: '2', name: 'Co-working Space', amount: 250, category: 'Office' },
  ]);
  
  const [income, setIncome] = useState<number | string>(5000);
  const [savings, setSavings] = useState<number | string>(10000);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snapshots, setSnapshots] = useState<any[]>([]);

  const handleNumericInput = (value: string, setter: (val: number | string) => void) => {
    if (value === "") {
      setter("");
      return;
    }
    // Remove leading zeros but keep 0 if it's the only character
    const sanitized = value.replace(/^0+(?!$)/, '');
    const parsed = parseFloat(sanitized);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now().toString(), name: '', amount: 0, category: 'General' }]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpense = (id: string, field: keyof Expense, value: string | number) => {
    if (field === 'amount' && typeof value === 'string') {
      const sanitized = value.replace(/^0+(?!$)/, '');
      const num = sanitized === "" ? 0 : parseFloat(sanitized);
      setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: num } : e));
    } else {
      setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
    }
  };

  const totals = useMemo(() => {
    const monthlyTotal = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const numIncome = Number(income) || 0;
    const numSavings = Number(savings) || 0;
    const profit = numIncome - monthlyTotal;
    const burnRate = monthlyTotal - numIncome; // Positive if spending more than earning
    const runway = burnRate > 0 ? numSavings / burnRate : (numIncome >= monthlyTotal ? Infinity : 0);

    // Category distribution
    const distribution = expenses.reduce((acc, e) => {
      const amt = Number(e.amount) || 0;
      acc[e.category] = (acc[e.category] || 0) + amt;
      return acc;
    }, {} as Record<string, number>);

    return {
      monthlyTotal,
      annualTotal: monthlyTotal * 12,
      profit,
      runway: runway === Infinity ? '∞' : Math.floor(runway),
      distribution
    };
  }, [expenses, income, savings]);

  const history = useMemo(() => historyService.getHistory().filter(i => i.toolId === 'expense-tracker'), [showHistory]);

  const handleSaveSnapshot = async () => {
    if (totals.monthlyTotal === 0) {
      toast.error('Add some expenses before saving a snapshot.');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const snapshot = {
      id: Date.now().toString(),
      timestamp: new Date(),
      burn: totals.monthlyTotal,
      runway: totals.runway,
      profit: totals.profit,
      data: {
        expenses: JSON.parse(JSON.stringify(expenses)), // Deep copy
        income,
        savings
      }
    };

    setSnapshots([snapshot, ...snapshots]);

    historyService.addToHistory({
      toolId: 'expense-tracker',
      toolName: 'Expenses',
      summary: `Expenses: $${totals.monthlyTotal}/mo - Runway: ${totals.runway} months`,
      data: { expenses, income, savings }
    });
    
    setIsSaving(false);
    toast.success('Financial snapshot saved to history.');
  };

  const loadFromHistory = (item: HistoryItem) => {
    setExpenses(item.data.expenses);
    setIncome(item.data.income);
    setSavings(item.data.savings);
    setShowHistory(false);
    toast.success('Loaded financial snapshot from history.');
  };

  const loadSnapshot = (snap: any) => {
    setExpenses(snap.data.expenses);
    setIncome(snap.data.income);
    setSavings(snap.data.savings);
    toast.success(`Loaded financial snapshot from ${new Date(snap.timestamp).toLocaleDateString()}.`);
  };

  const categories = ['General', 'Software', 'Office', 'Marketing', 'Legal', 'Tax', 'Hardware'];
  const categoryColors: Record<string, string> = {
    'Software': 'bg-blue-500',
    'Office': 'bg-purple-500',
    'Marketing': 'bg-amber-500',
    'Legal': 'bg-slate-500',
    'Tax': 'bg-red-500',
    'Hardware': 'bg-emerald-500',
    'General': 'bg-slate-300'
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                <Wallet className="text-[#0f4c75]" size={20} /> Expenses
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
                >
                  <History size={14} /> {showHistory ? 'Close History' : 'History'}
                </button>
                <button 
                  onClick={addExpense}
                  className="flex items-center justify-center gap-1 text-xs font-bold bg-[#0f4c75] text-white px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showHistory && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 overflow-hidden"
                >
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 max-h-60 overflow-y-auto">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Previous Expense Snapshots</h4>
                    {history.length > 0 ? (
                      history.map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => loadFromHistory(item)}
                          className="w-full text-left p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-[#0f4c75] border border-slate-100">
                               <Wallet size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">{item.summary}</p>
                              <p className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <Check size={14} className="text-[#0f4c75] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">No history yet.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {expenses.map((expense) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={expense.id} 
                    className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl group relative"
                  >
                    <div className="flex-grow space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                      <div className="w-full sm:w-1/2">
                        <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Name</label>
                        <input 
                          type="text" 
                          placeholder="Expense name..."
                          value={expense.name || ''}
                          onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0f4c75] text-sm shadow-sm"
                        />
                      </div>
                      <div className="w-full sm:w-1/4">
                        <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                        <select 
                          value={expense.category || 'General'}
                          onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0f4c75] text-sm shadow-sm"
                        >
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="w-full sm:w-1/4">
                        <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                          <input 
                            type="number" 
                            value={expense.amount === 0 ? "" : expense.amount}
                            onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                            className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0f4c75] text-sm font-mono text-right shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 sm:pt-0">
                      <button 
                        onClick={() => removeExpense(expense.id)}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group-hover:text-slate-400"
                        title="Remove expense"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly Income ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                  <input 
                    type="number" 
                    value={income}
                    onChange={(e) => handleNumericInput(e.target.value, setIncome)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c75]/20 focus:border-[#0f4c75] font-mono shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Cash Savings ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                  <input 
                    type="number" 
                    value={savings}
                    onChange={(e) => handleNumericInput(e.target.value, setSavings)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4c75]/20 focus:border-[#0f4c75] font-mono shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Snapshots Table/List */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 mb-6">
              <History className="text-[#0f4c75]" size={20} /> Saved Snapshots
            </h3>
            <div className="space-y-3">
              {snapshots.length > 0 ? (
                snapshots.map((snap) => (
                  <button 
                    key={snap.id} 
                    onClick={() => loadSnapshot(snap)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0f4c75] font-bold shadow-sm group-hover:scale-110 transition-transform">
                        {snap.runway}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">${snap.burn.toLocaleString()} Monthly Burn</p>
                          <span className="text-[9px] font-black text-[#0f4c75] opacity-0 group-hover:opacity-100 uppercase tracking-tighter transition-opacity">Load Snapshot</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                          {new Date(snap.timestamp).toLocaleDateString()} at {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${snap.profit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      ${snap.profit.toLocaleString()} Net
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <FileText size={24} />
                  </div>
                  <p className="text-sm text-slate-400">No snapshots saved this session.</p>
                  <p className="text-xs text-slate-400 mt-1">Click "Save Snapshot" above to log your runway.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-24">
          <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0f4c75]/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2 relative z-10">
              <PieChart className="text-[#0f4c75]" size={20} /> Breakdown
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-slate-400">
                <span>Monthly Burn</span>
                <span className="font-mono text-white font-bold text-xl">${totals.monthlyTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Annual Expenses</span>
                <span className="font-mono text-white font-bold text-xl">${totals.annualTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Monthly Net {totals.profit >= 0 ? 'Profit' : 'Loss'}</span>
                <span className={`font-mono font-bold text-xl ${totals.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totals.profit >= 0 ? '+' : ''}${totals.profit.toLocaleString()}
                </span>
              </div>

              {/* Expense Distribution Bar */}
              <div className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expense Distribution</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
                  {Object.entries(totals.distribution).map(([cat, amount]) => {
                    if (amount === 0) return null;
                    const percentage = (amount / (totals.monthlyTotal || 1)) * 100;
                    return (
                      <div 
                        key={cat}
                        className={`h-full ${categoryColors[cat] || 'bg-slate-500'}`}
                        style={{ width: `${percentage}%` }}
                        title={`${cat}: ${percentage.toFixed(0)}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                  {Object.entries(totals.distribution).map(([cat, amount]) => {
                    if (amount === 0) return null;
                    return (
                      <div key={cat} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${categoryColors[cat] || 'bg-slate-500'}`} />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8">
                 <div className="flex items-center justify-between mb-2">
                   <label className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] block">Runway (Months)</label>
                   <button 
                    onClick={handleSaveSnapshot}
                    disabled={isSaving}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/50 text-[10px] font-bold rounded-lg border border-white/10 transition-colors disabled:opacity-50"
                   >
                     {isSaving ? 'Saving...' : 'Save Snapshot'}
                   </button>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className={`text-6xl font-black font-display ${totals.runway === '∞' ? 'text-emerald-400' : (Number(totals.runway) || 0) < 3 ? 'text-red-400' : 'text-[#0f4c75]'}`}>
                      {totals.runway}
                    </span>
                    <span className="text-slate-500 uppercase text-xs font-bold">Months left</span>
                 </div>
                 <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                    {totals.runway === '∞' 
                      ? "Congratulations! Your income covers all expenses. You're profitable." 
                      : `Based on your savings and monthly burn, you can survive for ${totals.runway} months without any new income.`}
                 </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 shrink-0">
               <TrendingDown size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Reducing Burn</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Freelancers often forget about minor subscriptions that add up. 
                Aim for at least 6 months of runway to handle the "feast or famine" cycles of client work patch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Section - Moved outside flex container */}
      <div className="w-full max-w-5xl mx-auto mt-16 pt-12 border-t border-slate-200 block">
        <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">The Financial Runway Methodology.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <h4 className="font-bold text-slate-900">Isolate the Accounts</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Never mix personal and business finances. Calculate your exact monthly business overhead here, and set up an automatic transfer to move exactly that amount into a dedicated business checking account every month.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <Flame size={24} />
            </div>
            <h4 className="font-bold text-slate-900">Know Your Burn Rate</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your "Monthly Burn" is the absolute minimum amount of cash your agency needs to survive for 30 days. Software subscriptions, hosting, and co-working spaces are quiet killers. Audit them quarterly.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <h4 className="font-bold text-slate-900">Build the Runway</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Freelancing is cyclical. You will have feast and famine months. Your ultimate goal is to build a "Cash Savings" runway of at least 6 months. This gives you the leverage to say "No" to bad clients.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Frequently Asked Questions.</h2>
        <div className="space-y-6">
          <div className="group">
            <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2 group-hover:text-[#0f4c75] transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f4c75]" />
              How often should I update my expense snapshot?
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed pl-3.5 border-l border-slate-100">
              We recommend logging a new snapshot on the 1st of every month. This allows you to track your burn rate over time and instantly spot unused "zombie" subscriptions that need to be canceled.
            </p>
          </div>

          <div className="group">
            <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2 group-hover:text-[#0f4c75] transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f4c75]" />
              Are all the expenses I track here tax-deductible?
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed pl-3.5 border-l border-slate-100">
              Generally, ordinary and necessary business expenses (like software, hosting, and office space) are deductible. By categorizing them here, you create a clean record to hand off to your CPA during tax season. Always consult a tax professional for local laws.
            </p>
          </div>

          <div className="group">
            <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2 group-hover:text-[#0f4c75] transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f4c75]" />
              What is a safe "Runway" target for an independent agency?
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed pl-3.5 border-l border-slate-100">
              The golden rule is 3 to 6 months of your "Monthly Burn". If your burn is $4,000/mo, aim for $12,000 to $24,000 in cash savings. This ensures you can survive client churn or seasonal dips without having to take on bad projects out of desperation.
            </p>
          </div>

          <div className="group">
            <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2 group-hover:text-[#0f4c75] transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f4c75]" />
              What happens to my historical data if I close the browser?
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed pl-3.5 border-l border-slate-100">
              On the Free tier, snapshots are saved securely in your browser's local storage. Upgrading to Agency Pro enables Cloud Sync, backing up your entire financial history to your account so you can access it from any device.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
