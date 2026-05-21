import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ticket, History, AlertCircle, Plus, 
  ArrowRight, ShieldAlert, CheckCircle2, 
  MessageSquare, User, Receipt, DollarSign,
  Save, ChevronDown, ShieldCheck, Target, TrendingUp, Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface Revision {
  id: string;
  date: string;
  time: string;
  description: string;
}

interface ClientState {
  id: string;
  name: string;
  totalTokens: number;
  usedTokens: number;
  revisionLog: Revision[];
  tokenValue: number;
}

export default function RevisionTracker() {
  // 1. STATE ENGINE
  const [clients, setClients] = useState<ClientState[]>(() => {
    const saved = localStorage.getItem('revision_tracker_clients');
    return saved ? JSON.parse(saved) : [{
      id: 'default',
      name: 'Nebula Dynamics',
      totalTokens: 3,
      usedTokens: 0,
      revisionLog: [],
      tokenValue: 250
    }];
  });

  const [activeClientId, setActiveClientId] = useState('default');
  
  // Local state for the inputs to avoid too many re-renders of the whole app
  const [clientName, setClientName] = useState('');
  const [totalTokens, setTotalTokens] = useState(3);
  const [usedTokens, setUsedTokens] = useState(0);
  const [revisionLog, setRevisionLog] = useState<Revision[]>([]);
  const [tokenValue, setTokenValue] = useState(250);
  const [currentDescription, setCurrentDescription] = useState('');

  // Sync internal state when active client changes OR when initial load happens
  useEffect(() => {
    const client = clients.find(c => c.id === activeClientId);
    if (client) {
      setClientName(client.name);
      setTotalTokens(client.totalTokens);
      setUsedTokens(client.usedTokens);
      setRevisionLog(client.revisionLog);
      setTokenValue(client.tokenValue);
    }
  }, [activeClientId, clients]);

  const isExhausted = usedTokens >= totalTokens;

  const saveClientState = () => {
    const updatedClients = clients.map(c => {
      if (c.id === activeClientId) {
        return {
          ...c,
          name: clientName,
          totalTokens,
          usedTokens,
          revisionLog,
          tokenValue
        };
      }
      return c;
    });

    setClients(updatedClients);
    localStorage.setItem('revision_tracker_clients', JSON.stringify(updatedClients));
    toast.success('Client state saved successfully');
  };

  const createNewClient = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newClient: ClientState = {
      id: newId,
      name: 'New Client',
      totalTokens: 3,
      usedTokens: 0,
      revisionLog: [],
      tokenValue: 250
    };
    
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem('revision_tracker_clients', JSON.stringify(updatedClients));
    setActiveClientId(newId);
    toast.success('New client workspace created');
  };

  const deductToken = () => {
    if (isExhausted || !currentDescription.trim()) return;

    const now = new Date();
    const newRevision: Revision = {
      id: Math.random().toString(36).substr(2, 9),
      date: now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      description: currentDescription
    };

    setRevisionLog(prev => [newRevision, ...prev]);
    setUsedTokens(prev => prev + 1);
    setCurrentDescription('');
    toast.info('Revision logged. Token deducted.');
  };

  const scopeValueProtected = totalTokens * tokenValue;
  const valueBurned = usedTokens * tokenValue;

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8">
      <div className="flex flex-col lg:flex-row gap-8 min-h-[700px]">
        {/* 2. THE AGENCY CONTROL PANEL (Left Pane) */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-900">Agency Control</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Scope Governance Terminal</p>
                </div>
              </div>
              <button 
                onClick={createNewClient}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                title="Add New Client"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Client Workspace</label>
                <div className="relative group">
                  <select 
                    value={activeClientId}
                    onChange={(e) => setActiveClientId(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all cursor-pointer"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Client Identifier</label>
                  <input 
                    type="text" 
                    value={clientName || ''}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Revision Quota</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="1"
                        max="20"
                        value={totalTokens || 0}
                        onChange={(e) => setTotalTokens(parseInt(e.target.value) || 1)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Token Value ($)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="0"
                        value={tokenValue}
                        onChange={(e) => setTokenValue(parseInt(e.target.value) || 0)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Log New Revision</label>
                <textarea 
                  placeholder="Describe the requested change..."
                  value={currentDescription || ''}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                  disabled={isExhausted}
                  className="w-full h-28 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={deductToken}
                  disabled={isExhausted || !currentDescription.trim()}
                  className="py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <Ticket size={16} className="group-hover:-rotate-12 transition-transform" />
                  Log Token
                </button>
                <button 
                  onClick={saveClientState}
                  className="py-5 bg-blue-50 text-blue-700 border border-blue-100 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-100 active:scale-95 transition-all shadow-sm group"
                >
                  <Save size={16} />
                  Save State
                </button>
              </div>
              
              {isExhausted && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                   <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold text-red-700 uppercase leading-relaxed">
                     Scope Limit Reached. Further revisions require additional billing logic.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. THE CLIENT PORTAL PREVIEW (Right Pane) */}
        <div className="flex-1 flex flex-col gap-6" id="client-portal">
          <div className="bg-[#0B1120] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-full relative">
            <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">
                  <ShieldAlert size={12} />
                  Client Resource Status
                </div>
                <h2 className="text-2xl font-black text-white capitalize tracking-tight">{clientName}</h2>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-6 border-r border-white/10 pr-6">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Protected Value</p>
                    <p className="text-xl font-black text-emerald-400 tracking-tight">${scopeValueProtected.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Value Burned</p>
                    <p className="text-xl font-black text-rose-400 tracking-tight">${valueBurned.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isExhausted ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                      {isExhausted ? 'Scope Locked' : 'Active Status'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-10 flex flex-col gap-12 overflow-y-auto custom-scrollbar">
              {/* Financial Metrics Mini Bar (Mobile/Internal) */}
              <div className="sm:hidden grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Protected Value</p>
                  <p className="text-lg font-black text-emerald-400">${scopeValueProtected.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Value Burned</p>
                  <p className="text-lg font-black text-rose-400">${valueBurned.toLocaleString()}</p>
                </div>
              </div>

              {/* Visual Tokens */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Revision Currency</h3>
                  <span className="text-[10px] font-bold text-slate-600 uppercase">REMAINING: {totalTokens - usedTokens} / {totalTokens}</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {Array.from({ length: totalTokens }).map((_, i) => {
                    const isClaimed = i < usedTokens;
                    return (
                      <motion.div 
                        key={i}
                        initial={false}
                        animate={{ 
                          opacity: isClaimed ? 0.4 : 1,
                          scale: isClaimed ? 0.95 : 1,
                          filter: isClaimed ? 'grayscale(100%) shadow(0 0 0px transparent)' : 'grayscale(0%) shadow(0 10px 20px rgba(0,0,0,0.2))'
                        }}
                        className={`aspect-[4/5] rounded-3xl flex flex-col items-center justify-center gap-3 border-2 transition-all relative overflow-hidden group ${
                          isClaimed 
                            ? 'bg-slate-800/50 border-slate-700/50' 
                            : 'bg-gradient-to-br from-blue-600/20 to-blue-900/40 border-blue-500/50 shadow-blue-500/10'
                        }`}
                      >
                         <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isClaimed ? 'bg-slate-700 text-slate-500' : 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] contrast-125'}`}>
                           {isClaimed ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <Ticket size={18} strokeWidth={2.5} />}
                         </div>
                         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-center px-1">
                           {isClaimed ? 'REDEEMED' : `TICKET ${i + 1}`}
                         </span>
                         
                         {!isClaimed && (
                           <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Revision Log */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <History size={16} className="text-blue-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Service History</h3>
                </div>
                
                <div className="space-y-0 relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                  
                  <AnimatePresence initial={false}>
                    {revisionLog.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center opacity-30">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No revision logic detected yet</p>
                      </div>
                    ) : (
                      revisionLog.map((rev, idx) => (
                        <motion.div 
                          key={rev.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-6 group mb-8 last:mb-0 relative"
                        >
                           <div className="flex flex-col items-center pt-1.5 z-10">
                              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              </div>
                           </div>
                           <div className="flex-1 bg-white/[0.03] border border-white/5 p-6 rounded-3xl group-hover:bg-white/[0.05] transition-all relative">
                              <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-3">
                                   <Clock size={12} className="text-blue-400" />
                                   <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{rev.date} @ {rev.time}</span>
                                 </div>
                                 <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-2">
                                   <Ticket size={10} className="text-rose-400" />
                                   <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">-1 TOKEN</span>
                                 </div>
                              </div>
                              <p className="text-sm text-white/80 font-medium leading-relaxed">{rev.description}</p>
                           </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 4. LOCKOUT STATE & PIPELINE */}
            <AnimatePresence>
              {isExhausted && (
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="p-10 bg-slate-900 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-20"
                >
                   <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-5">
                         <div className="w-16 h-16 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-inner">
                           <ShieldAlert size={32} />
                         </div>
                         <div className="text-center md:text-left">
                           <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                              <h4 className="text-white text-xl font-black uppercase tracking-tight leading-tight">Scope Exhausted</h4>
                              <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-full animate-pulse">LOCKED</span>
                           </div>
                           <p className="text-slate-400 text-xs font-medium">Additional changes fall outside the initial engagement scope.</p>
                         </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          window.location.href = `/tools/invoice-generator?item=Additional+Design+Sprint&client=${encodeURIComponent(clientName)}`;
                        }}
                        className="w-full md:w-auto px-10 py-5 bg-[#0f4c75] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#07314d] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/20 border border-blue-400/30 group"
                      >
                        <Receipt size={18} />
                        Generate Sprint Invoice
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 5. METHODOLOGY SECTION */}
      <div className="max-w-5xl mx-auto pt-16 border-t border-slate-200">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-12 text-center" id="methodology">The Scope Governance Methodology</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="space-y-6 group">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-900 leading-tight">Anchor the Value</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Introduce Revision Tokens during your project kickoff. State clearly in your contract: <span className="text-slate-900 font-bold">'This project includes 3 Revision Tokens. Each token covers one consolidated round of feedback.'</span> This prevents endless, drip-fed email requests.
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6 group">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <Target size={32} />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-900 leading-tight">Gamify the Feedback</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                When a client requests a change, log it here and deduct a token. Send them a screenshot of their <span className="text-slate-900 font-bold">'Client Resource Status'</span>. When clients see a visual currency depleting, they are forced to be concise, decisive, and respectful of your time.
              </p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6 group">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
              <TrendingUp size={32} />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-900 leading-tight">Protect the Margin</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                When tokens hit zero, the boundary is absolute. The dashboard turns red. If the client wants more changes, you generate a new invoice for a <span className="text-slate-900 font-bold">'Revision Pack' (e.g., $500 for 2 more tokens)</span>. You never work for free again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
