import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Square, Save, RotateCcw, Clock, Trash2, Layout, History, Check, FileText, Plus, DollarSign, Briefcase, Tag, X, ArrowRight, PlusCircle 
} from 'lucide-react';
import { historyService, HistoryItem } from '../../lib/history-service';
import { useNavigate } from 'react-router-dom';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { useUser } from '../../contexts/UserContext';

interface TimeLog {
  id: string;
  project: string;
  taskType: string;
  duration: number; // in seconds
  hourlyRate: number;
  earned: number;
  timestamp: number;
}

const TASK_TYPES = ['Development', 'Design', 'Consulting', 'Admin', 'Meeting'];

export default function BillableTracker() {
  const navigate = useNavigate();
  const { isPro } = useUser();
  const setInvoicePayload = useEcosystemStore((state) => state.setInvoicePayload);
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const [project, setProject] = useState('');
  const [taskType, setTaskType] = useState('Development');
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Manual entry state
  const [manualData, setManualData] = useState({
    project: '',
    taskType: 'Development',
    hours: 0,
    minutes: 0,
    rate: 0
  });

  useEffect(() => {
    const unsub = historyService.subscribe((items) => {
      setHistory(items.filter(i => i.toolId === 'billable-tracker'));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const storedLogs = localStorage.getItem('billable_logs');
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('billable_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (active) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const delta = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setSeconds(accumulatedTime + delta);
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        setAccumulatedTime(seconds);
      }
      startTimeRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculatedEarned = useMemo(() => {
    return (seconds / 3600) * (hourlyRate || 0);
  }, [seconds, hourlyRate]);

  const handleSave = () => {
    if (seconds === 0) return;
    const earned = (seconds / 3600) * (hourlyRate || 0);
    const newLog: TimeLog = {
      id: Date.now().toString(),
      project: project || 'Untitled Project',
      taskType,
      duration: seconds,
      hourlyRate: hourlyRate || 0,
      earned: Number(earned.toFixed(2)),
      timestamp: Date.now()
    };
    setLogs([newLog, ...logs]);
    
    historyService.addToHistory({
      toolId: 'billable-tracker',
      toolName: 'Time Tracking',
      summary: `${newLog.project} (${taskType}): ${formatTime(seconds)} - $${newLog.earned}`,
      data: { log: newLog }
    });

    setSeconds(0);
    setAccumulatedTime(0);
    setActive(false);
    setProject('');
  };

  const handleManualSave = () => {
    const totalSeconds = (manualData.hours * 3600) + (manualData.minutes * 60);
    if (totalSeconds === 0) return;
    
    const earned = (totalSeconds / 3600) * (manualData.rate || 0);
    const newLog: TimeLog = {
      id: Date.now().toString(),
      project: manualData.project || 'Untitled Project',
      taskType: manualData.taskType,
      duration: totalSeconds,
      hourlyRate: manualData.rate || 0,
      earned: Number(earned.toFixed(2)),
      timestamp: Date.now()
    };
    
    setLogs([newLog, ...logs]);
    setShowManualModal(false);
    setManualData({ project: '', taskType: 'Development', hours: 0, minutes: 0, rate: 0 });
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const totalTrackedSeconds = logs.reduce((acc, l) => acc + l.duration, 0);
  const totalEarnedAmount = logs.reduce((acc, l) => acc + l.earned, 0);

  const handleGenerateInvoice = () => {
    const totalHours = Number((totalTrackedSeconds / 3600).toFixed(2));
    const avgRate = totalHours > 0 ? totalEarnedAmount / totalHours : 0;
    
    setInvoicePayload({
      itemName: "Development Services (Tracked Hours)",
      quantity: totalHours,
      rate: Number(avgRate.toFixed(2)),
      description: `Aggregated from ${logs.length} tracked sessions`
    });

    navigate('/tools/invoice-generator');
  };

  const exportToCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Project', 'Task Type', 'Duration (Seconds)', 'Formatted Time', 'Rate ($/hr)', 'Earned ($)', 'Date'];
    const rows = logs.map(log => [
      log.project,
      log.taskType,
      log.duration,
      formatTime(log.duration),
      log.hourlyRate,
      log.earned,
      new Date(log.timestamp).toLocaleDateString()
    ]);
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      !isPro ? '\n"---"' : '',
      !isPro ? '"Exported from FreelancerKit. Upgrade to Pro to remove branding."' : ''
    ].filter(Boolean).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `billable-hours-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Timer */}
      <div className={`bg-slate-900 text-white p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 ${active ? 'ring-2 ring-[#0f4c75] shadow-[#0f4c75]/20' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
          {active && <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-1/3 h-full bg-[#0f4c75]"
          />}
        </div>

        <div className="mb-10 w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="text" 
                  value={project || ''}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="Project / Client"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
                />
             </div>
             <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <select 
                  value={taskType || 'Development'}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  {TASK_TYPES.map(type => (
                    <option key={type} value={type} className="bg-slate-900 text-white">{type}</option>
                  ))}
                </select>
             </div>
          </div>

          <div className="max-w-[200px] mx-auto relative group">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="number" 
              placeholder="0.00 rate"
              value={hourlyRate || 0}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-center text-sm font-bold focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-white/20">/ hr</span>
          </div>
        </div>

        <div className="relative mb-12">
          <motion.div 
            animate={active ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tighter tabular-nums mb-2"
          >
            {formatTime(seconds)}
          </motion.div>
          <div 
            className="text-lg font-mono text-emerald-400 font-bold transition-all duration-300" 
            style={{ opacity: hourlyRate > 0 ? 1 : 0, transform: hourlyRate > 0 ? 'translateY(0)' : 'translateY(10px)' }}
          >
            ${calculatedEarned.toFixed(2)} Earned
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
           {!active ? (
             <button 
              onClick={() => setActive(true)}
              className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all group"
             >
               <Play size={28} fill="currentColor" className="ml-1" />
             </button>
           ) : (
             <button 
              onClick={() => setActive(false)}
              className="w-20 h-20 rounded-full bg-slate-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
             >
               <Square size={28} fill="currentColor" />
             </button>
           )}

           <button 
            disabled={seconds === 0}
            onClick={handleSave}
            className="w-20 h-20 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 hover:bg-slate-50 relative group"
           >
             <Save size={28} />
             <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Complete & Log</span>
           </button>

           <button 
            onClick={() => { setSeconds(0); setAccumulatedTime(0); setActive(false); }}
            className="w-20 h-20 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center shadow-lg hover:bg-white/20 transition-all active:scale-95"
           >
             <RotateCcw size={28} />
           </button>
        </div>
        
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${active ? 'text-emerald-400' : 'text-white/30'}`}>
          {active ? 'Recording Session...' : 'Ready to track'}
        </p>
      </div>

      {/* Right Column: Sessions */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[600px] relative">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-bold flex items-center gap-2">
             <Clock className="text-primary" /> Session History
           </h3>
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setShowManualModal(true)}
               className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1.5 hover:bg-primary/5 rounded-lg transition-all"
             >
               + Add Manual Entry
             </button>
             <button 
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all border border-slate-200"
              >
                <History size={16} />
              </button>
           </div>
        </div>

        <div className="flex-grow space-y-4 max-h-[450px] overflow-y-auto pr-2">
          <AnimatePresence initial={false}>
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-24">
                 <Layout size={48} className="mb-4 text-slate-300" />
                 <p className="text-lg text-slate-400">No active tracking logs.</p>
              </div>
            ) : (
              logs.map(log => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-100 shadow-sm">
                      {log.taskType === 'Development' ? <Check size={18} /> : 
                       log.taskType === 'Design' ? <Layout size={18} /> : 
                       log.taskType === 'Meeting' ? <Clock size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{log.project}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{log.taskType}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400 font-mono">${log.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-mono font-black text-slate-900 text-sm">{formatTime(log.duration)}</p>
                      <p className="text-[10px] font-bold text-emerald-500 mt-0.5">${log.earned.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => {
                          setInvoicePayload({
                            itemName: `${log.project}: ${log.taskType}`,
                            quantity: Number((log.duration / 3600).toFixed(2)),
                            rate: log.hourlyRate,
                            description: `Tracked session on ${new Date(log.timestamp).toLocaleDateString()}`
                          });
                          navigate('/tools/invoice-generator');
                        }}
                        className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all"
                        title="Generate Invoice Line Item"
                      >
                        <PlusCircle size={16} />
                      </button>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="p-2 text-slate-300 hover:text-danger rounded-lg transition-all"
                        title="Delete Session"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 space-y-4 pt-8 border-t border-slate-100">
          <div className="flex justify-between items-center px-2 text-sm">
            <div className="text-[10px] font-black font-sans uppercase tracking-[0.2em] text-slate-400">Aggregate Tracked</div>
            <div className="text-right">
               <div className="text-xl font-black text-slate-900 font-mono">{formatTime(totalTrackedSeconds)}</div>
               <div className="text-xs font-bold text-emerald-500 font-mono">${totalEarnedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} Total</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={exportToCSV}
              className="py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <FileText size={18} /> Export CSV
            </button>
            <button 
              onClick={handleGenerateInvoice}
              className="py-4 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Generate Invoice <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Manual Entry Modal */}
        <AnimatePresence>
          {showManualModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowManualModal(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-md shadow-2xl relative overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tight">Manual Time Log</h3>
                  <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Name</label>
                    <input 
                      type="text" 
                      value={manualData.project || ''}
                      onChange={(e) => setManualData({...manualData, project: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm font-bold transition-all"
                      placeholder="e.g. Website Redesign"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Task Type</label>
                    <select 
                      value={manualData.taskType || 'Development'}
                      onChange={(e) => setManualData({...manualData, taskType: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold appearance-none"
                    >
                      {TASK_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hours</label>
                      <input 
                        type="number" 
                        value={manualData.hours || 0}
                        onChange={(e) => setManualData({...manualData, hours: Number(e.target.value)})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Minutes</label>
                      <input 
                        type="number" 
                        value={manualData.minutes || 0}
                        onChange={(e) => setManualData({...manualData, minutes: Number(e.target.value)})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hourly Rate ($)</label>
                    <input 
                      type="number" 
                      value={manualData.rate || 0}
                      onChange={(e) => setManualData({...manualData, rate: Number(e.target.value)})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold font-mono"
                    />
                  </div>
                  <button 
                    onClick={handleManualSave}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all mt-4"
                  >
                    Log Entry
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Global History Modal */}
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
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="text-xl font-black uppercase">Session Archive</h3>
                   <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                </div>
                <div className="p-8 overflow-y-auto space-y-3">
                   {history.length > 0 ? (
                    history.map(item => (
                        <button 
                           key={item.id}
                           onClick={() => {
                              const l = item.data.log;
                              if (!logs.find(existing => existing.id === l.id)) setLogs([l, ...logs]);
                              setShowHistory(false);
                           }}
                           className="w-full text-left p-4 hover:bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 flex items-center justify-between group transition-all"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                                 <FileText className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-800">{item.summary}</p>
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                              </div>
                           </div>
                           <motion.div 
                            whileHover={{ x: 4 }}
                            className="bg-slate-100 p-2 rounded-xl text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100"
                           >
                            <ArrowRight size={16} />
                           </motion.div>
                        </button>
                     ))
                   ) : (
                    <div className="py-20 text-center">
                      <History size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-400 font-medium">No archived sessions found.</p>
                    </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
