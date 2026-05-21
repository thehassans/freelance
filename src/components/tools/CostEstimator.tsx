import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calculator, Info, FileText, Download, History, Check, DollarSign, ArrowRight, Settings2, User, Briefcase, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EstimatePDF } from './EstimatePDF';
import { historyService, HistoryItem } from '../../lib/history-service';
import { useUser } from '../../contexts/UserContext';

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

export default function CostEstimator() {
  const { user } = useUser();
  const [showHistory, setShowHistory] = useState(false);
  const [pricingModel, setPricingModel] = useState<'global' | 'per-task'>('global');

  // Metadata state
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [preparedBy, setPreparedBy] = useState(user?.name || '');

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'UI/UX Design Phase', hours: 10, rate: 85 },
    { id: '2', name: 'Front-end Development', hours: 25, rate: 85 },
    { id: '3', name: 'Backend Integration', hours: 15, rate: 85 },
  ]);

  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    { id: 'e1', name: 'Software Licenses', cost: 150 },
  ]);
  
  const [globalRate, setGlobalRate] = useState(85);
  const [buffer, setBuffer] = useState(15);

  const addTask = () => {
    setTasks([...tasks, { id: Date.now().toString(), name: '', hours: 0, rate: globalRate }]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, field: keyof Task, value: string | number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addExpense = () => {
    setFixedExpenses([...fixedExpenses, { id: Date.now().toString(), name: '', cost: 0 }]);
  };

  const removeExpense = (id: string) => {
    setFixedExpenses(fixedExpenses.filter(e => e.id !== id));
  };

  const updateExpense = (id: string, field: keyof FixedExpense, value: string | number) => {
    setFixedExpenses(fixedExpenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const totalHours = tasks.reduce((acc, t) => acc + t.hours, 0);
  
  const laborTotal = useMemo(() => {
    if (pricingModel === 'global') {
      return totalHours * globalRate;
    }
    return tasks.reduce((acc, t) => acc + (t.hours * (t.rate || globalRate)), 0);
  }, [tasks, globalRate, pricingModel, totalHours]);

  const bufferAmount = (laborTotal * buffer) / 100;
  const expensesTotal = fixedExpenses.reduce((acc, e) => acc + e.cost, 0);
  const grandTotal = laborTotal + bufferAmount + expensesTotal;

  const history = useMemo(() => historyService.getHistory().filter(i => i.toolId === 'cost-estimator'), [showHistory]);

  const saveToHistory = () => {
    historyService.addToHistory({
      toolId: 'cost-estimator',
      toolName: 'Cost Estimate',
      summary: `${projectName || 'Estimate'}: $${Math.ceil(grandTotal).toLocaleString()} (${totalHours}h labor + $${expensesTotal} expenses)`,
      data: { tasks, globalRate, buffer, pricingModel, fixedExpenses, projectName, clientName, preparedBy }
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    setTasks(item.data.tasks);
    setGlobalRate(item.data.globalRate || 85);
    setBuffer(item.data.buffer);
    setPricingModel(item.data.pricingModel || 'global');
    setFixedExpenses(item.data.fixedExpenses || []);
    setProjectName(item.data.projectName || '');
    setClientName(item.data.clientName || '');
    setPreparedBy(item.data.preparedBy || user?.name || '');
    setShowHistory(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        {/* Project Details Block */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Plus size={14} /> Project Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                <Briefcase size={10} /> Project Name
              </label>
              <input 
                type="text" 
                placeholder="e.g., E-commerce Redesign"
                value={projectName || ''}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                <Building size={10} /> Client Name
              </label>
              <input 
                type="text" 
                placeholder="e.g., Acme Corp"
                value={clientName || ''}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                <User size={10} /> Prepared By
              </label>
              <input 
                type="text" 
                placeholder="Your Name"
                value={preparedBy || ''}
                onChange={(e) => setPreparedBy(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calculator className="text-primary" size={20} /> Project Tasks
            </h3>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setPricingModel('global')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pricingModel === 'global' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Global Rate
                </button>
                <button 
                  onClick={() => setPricingModel('per-task')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pricingModel === 'per-task' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Per-Task Rate
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
                >
                  <History size={14} /> {showHistory ? 'Close' : 'History'}
                </button>
                <button 
                  onClick={addTask}
                  className="flex items-center gap-1 text-xs font-bold bg-primary text-white px-3 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  <Plus size={14} /> Add Task
                </button>
              </div>
            </div>
          </div>

          <div className="flex sm:hidden items-center bg-slate-100 p-1 rounded-xl border border-slate-200 mb-6">
            <button 
              onClick={() => setPricingModel('global')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pricingModel === 'global' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
            >
              Global
            </button>
            <button 
              onClick={() => setPricingModel('per-task')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pricingModel === 'per-task' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
            >
              Per-Task
            </button>
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
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Previous Estimates</h4>
                  {history.length > 0 ? (
                    history.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 flex items-center justify-between group"
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
        </div>

        <div className="space-y-4 mb-8">
          {tasks.map((task, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={task.id} 
              className="flex gap-3 items-center group"
            >
              <span className="text-slate-300 font-mono text-xs w-6">{index + 1}.</span>
              <div className="flex-grow">
                <input 
                  type="text" 
                  placeholder="Task description..."
                  value={task.name || ''}
                  onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div className="w-24 relative shrink-0">
                <input 
                  type="number" 
                  placeholder="Hrs"
                  value={task.hours || 0}
                  onChange={(e) => updateTask(task.id, 'hours', Number(e.target.value))}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-mono text-right"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">HRS</span>
              </div>
              {pricingModel === 'per-task' && (
                <div className="w-28 relative shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">$</span>
                  <input 
                    type="number" 
                    placeholder="Rate"
                    value={task.rate || 0}
                    onChange={(e) => updateTask(task.id, 'rate', Number(e.target.value))}
                    className="w-full pl-6 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-mono text-right"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">/hr</span>
                </div>
              )}
              {tasks.length > 1 && (
                <button 
                  onClick={() => removeTask(task.id)}
                  className="p-2.5 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mt-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Settings2 className="text-primary" size={20} /> Fixed Expenses
            </h3>
            <button 
              onClick={addExpense}
              className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
            >
              <Plus size={14} /> Add Expense
            </button>
          </div>

          <div className="space-y-4">
            {fixedExpenses.map((expense) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={expense.id} 
                className="flex gap-3 items-center group"
              >
                <div className="flex-grow">
                  <input 
                    type="text" 
                    placeholder="Expense Name (e.g., Hosting, Assets)..."
                    value={expense.name || ''}
                    onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div className="w-32 relative shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">$</span>
                  <input 
                    type="number" 
                    placeholder="Cost"
                    value={expense.cost || 0}
                    onChange={(e) => updateExpense(expense.id, 'cost', Number(e.target.value))}
                    className="w-full pl-6 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-mono text-right"
                  />
                </div>
                <button 
                  onClick={() => removeExpense(expense.id)}
                  className="p-2.5 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
            {fixedExpenses.length === 0 && (
              <p className="text-center text-slate-400 text-xs py-4 italic">No fixed expenses added yet.</p>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-8">
          {pricingModel === 'global' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hourly Rate ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="number" 
                  value={globalRate || 0}
                  onChange={(e) => setGlobalRate(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                />
              </div>
            </div>
          )}
          <div className={pricingModel === 'per-task' ? 'sm:col-span-2' : ''}>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Buffer / Contingency (%)</label>
            <input 
              type="number" 
              value={buffer || 0}
              onChange={(e) => setBuffer(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-24 space-y-6">
        <div 
          className="bg-slate-900 text-white p-10 rounded-3xl overflow-hidden font-sans"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-primary" size={20} /> Project Quote
            </h3>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
              <p className="text-xs font-bold text-primary truncate max-w-[150px]">{projectName || 'Draft Estimate'}</p>
            </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-3">
                {tasks.map((t, i) => (
                  <div key={t.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-[#94a3b8]">{i + 1}. {t.name || 'Task Item'}</span>
                    <span className="font-mono">{t.hours}h</span>
                  </div>
                ))}
             </div>

            <div className="pt-6 border-t space-y-4" style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex justify-between items-center text-[#94a3b8]">
                <span>Total Labor</span>
                <span className="font-mono text-white flex items-center gap-1">
                  <span className="text-xl font-bold">${laborTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-[#94a3b8]">
                <span>Labor Buffer ({buffer}%)</span>
                <span className="font-mono text-white font-bold">
                  + ${bufferAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#94a3b8]">
                <span>Fixed Expenses</span>
                <span className="font-mono text-white font-bold text-lg">
                  ${expensesTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-8 border-t" style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}>
                <label className="text-[#64748b] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Total Project estimate</label>
                <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-black font-display text-[#0f4c75]">${Math.ceil(grandTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl flex gap-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Info size={24} className="text-[#0f4c75] flex-shrink-0" />
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Agency Insight: <strong className="text-white">Fixed expenses</strong> are kept outside the labor buffer to ensure software and asset costs remain transparent and non-scaled.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <PDFDownloadLink
            document={
              <EstimatePDF 
                projectName={projectName}
                clientName={clientName}
                preparedBy={preparedBy}
                tasks={tasks}
                fixedExpenses={fixedExpenses}
                globalRate={globalRate}
                buffer={buffer}
                pricingModel={pricingModel}
                laborTotal={laborTotal}
                bufferAmount={bufferAmount}
                expensesTotal={expensesTotal}
                grandTotal={grandTotal}
              />
            }
            fileName={`Estimate_${projectName.replace(/\s+/g, '_') || 'Quote'}_${Date.now()}.pdf`}
            className="w-full"
            onClick={saveToHistory}
          >
            {({ loading }) => (
              <button 
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Download size={18} />}
                {loading ? 'Generating PDF...' : 'Download Quote PDF'}
              </button>
            )}
          </PDFDownloadLink>
          
          <Link 
            to="/tools/proposal-generator"
            className="w-full py-4 bg-transparent text-slate-300 border border-white/10 rounded-2xl font-bold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            Draft Formal Proposal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
