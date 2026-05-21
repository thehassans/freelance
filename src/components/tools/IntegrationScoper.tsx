import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, ShieldAlert, Calculator, Copy, Check, 
  ArrowRight, Info, AlertTriangle, FileText, 
  Terminal, Zap, HardDrive, Cpu
} from 'lucide-react';

interface RiskFactor {
  id: string;
  label: string;
  multiplier: number;
  reason: string;
}

const AUTH_METHODS: RiskFactor[] = [
  { id: 'oauth', label: 'OAuth 2.0 / API Key', multiplier: 1.0, reason: 'Standard modern auth' },
  { id: 'legacy', label: 'Legacy / SOAP / Custom', multiplier: 1.3, reason: 'Legacy protocol overhead' }
];

const DOCS_QUALITY: RiskFactor[] = [
  { id: 'pro', label: 'Excellent Documentation', multiplier: 1.0, reason: 'No guesswork required' },
  { id: 'spotty', label: 'Spotty / Outdated', multiplier: 1.25, reason: 'Potential trial-and-error' },
  { id: 'none', label: 'Non-existent / Reverse Eng.', multiplier: 1.5, reason: 'High risk of hidden roadblocks' }
];

const SYNC_FREQ: RiskFactor[] = [
  { id: 'batch', label: 'Daily / Batch', multiplier: 1.0, reason: 'Standard cron processing' },
  { id: 'hourly', label: 'Hourly Sync', multiplier: 1.1, reason: 'Concurrency management' },
  { id: 'realtime', label: 'Real-Time / Webhooks', multiplier: 1.3, reason: 'Event queue complexity' }
];

const DATA_LOGIC: RiskFactor[] = [
  { id: 'direct', label: 'Direct 1:1 Mapping', multiplier: 1.0, reason: 'Simple schema alignment' },
  { id: 'heavy', label: 'Heavy Transformation', multiplier: 1.4, reason: 'Complex business logic mapping' }
];

export default function IntegrationScoper() {
  // 1. STATE MANAGEMENT
  const [naiveHours, setNaiveHours] = useState(40);
  const [rate, setRate] = useState(150);
  const [systemA, setSystemA] = useState('Shopify');
  const [systemB, setSystemB] = useState('Odoo ERP');

  const [auth, setAuth] = useState(AUTH_METHODS[0]);
  const [docs, setDocs] = useState(DOCS_QUALITY[0]);
  const [sync, setSync] = useState(SYNC_FREQ[0]);
  const [logic, setLogic] = useState(DATA_LOGIC[0]);

  const [copied, setCopied] = useState(false);

  // 2. THE BUSINESS LOGIC
  const stats = useMemo(() => {
    const totalMultiplier = auth.multiplier * docs.multiplier * sync.multiplier * logic.multiplier;
    const adjustedHours = Math.round(naiveHours * totalMultiplier);
    const finalPrice = adjustedHours * rate;
    const riskPadding = adjustedHours - naiveHours;

    return {
      totalMultiplier,
      adjustedHours,
      finalPrice,
      riskPadding
    };
  }, [naiveHours, rate, auth, docs, sync, logic]);

  // SOW Logic
  const sowSnippet = useMemo(() => {
    let clauses = `### ⚖️ Technical Constraints & SOW Clauses\n\n`;
    clauses += `**Project scope**: Integration between ${systemA} and ${systemB}.\n\n`;

    if (auth.id === 'legacy') {
      clauses += `- **Authentication**: Client acknowledges that ${systemA}/${systemB} utilizes legacy protocols. Any unidentified middleware requirements will be billed as out-of-scope.\n`;
    }
    if (docs.id === 'none') {
      clauses += `- **Undocumented APIs**: Due to non-existent documentation, timelines are strictly estimates. Any requirement to reverse-engineer endpoints will be billed at an hourly rate of $${rate}/hr.\n`;
    }
    if (sync.id === 'realtime') {
      clauses += `- **Event Reliability**: Real-time sync requires third-party webhook reliability. We are not responsible for upstream provider downtime.\n`;
    }
    if (logic.id === 'heavy') {
      clauses += `- **Data Integrity**: Complex transformations require strict UAT. Client is responsible for final data validation mapping.\n`;
    }

    return clauses;
  }, [systemA, systemB, auth, docs, sync, logic, rate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sowSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[2fr_3fr] gap-8 min-h-[800px]">
      {/* 1. THE RISK ASSESSMENT ENGINE (Left Panel) */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 overflow-y-auto max-h-[850px] custom-scrollbar">
          {/* Base Metrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-900">Base Parameters</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">The "Happy Path" Estimate</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Naive Hours</label>
                <input 
                  type="number" 
                  value={naiveHours || 0}
                  onChange={(e) => setNaiveHours(parseInt(e.target.value) || 0)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Hourly Rate ($)</label>
                <input 
                  type="number" 
                  value={rate || 0}
                  onChange={(e) => setRate(parseInt(e.target.value) || 0)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">System A (Source)</label>
                <input 
                  type="text" 
                  value={systemA || ''}
                  onChange={(e) => setSystemA(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">System B (Target)</label>
                <input 
                  type="text" 
                  value={systemB || ''}
                  onChange={(e) => setSystemB(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Complexity Multipliers */}
          <div className="space-y-8">
             <div className="flex items-center gap-2 mb-2">
                <Network size={16} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Complexity Multipliers</h3>
             </div>

             {/* Auth */}
             <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Authentication Method</label>
               <div className="grid grid-cols-1 gap-2">
                 {AUTH_METHODS.map(m => (
                   <button 
                    key={m.id}
                    onClick={() => setAuth(m)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${auth.id === m.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                   >
                     <div className="flex flex-col">
                       <span className="text-xs font-bold">{m.label}</span>
                       <span className={`text-[9px] font-medium opacity-80 ${auth.id === m.id ? 'text-white' : 'text-slate-400'}`}>{m.reason}</span>
                     </div>
                     <span className={`text-xs font-black ${auth.id === m.id ? 'text-white' : 'text-indigo-600'}`}>{m.multiplier}x</span>
                   </button>
                 ))}
               </div>
             </div>

             {/* Documentation */}
             <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Documentation Quality</label>
               <div className="grid grid-cols-1 gap-2">
                 {DOCS_QUALITY.map(m => (
                   <button 
                    key={m.id}
                    onClick={() => setDocs(m)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${docs.id === m.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                   >
                     <div className="flex flex-col">
                       <span className="text-xs font-bold">{m.label}</span>
                       <span className={`text-[9px] font-medium opacity-80 ${docs.id === m.id ? 'text-white' : 'text-slate-400'}`}>{m.reason}</span>
                     </div>
                     <span className={`text-xs font-black ${docs.id === m.id ? 'text-white' : 'text-indigo-600'}`}>{m.multiplier}x</span>
                   </button>
                 ))}
               </div>
             </div>

             {/* Sync */}
             <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Sync Frequency</label>
               <div className="flex gap-2">
                  {SYNC_FREQ.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setSync(m)}
                      className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${sync.id === m.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                    >
                      <span className="text-[10px] font-black whitespace-nowrap">{m.label.split(' ')[0]}</span>
                      <span className={`text-[9px] font-bold ${sync.id === m.id ? 'text-indigo-200' : 'text-slate-400'}`}>{m.multiplier}x</span>
                    </button>
                  ))}
               </div>
             </div>

             {/* Logic */}
             <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Data Transformation Logic</label>
               <div className="grid grid-cols-2 gap-2">
                 {DATA_LOGIC.map(m => (
                   <button 
                    key={m.id}
                    onClick={() => setLogic(m)}
                    className={`p-4 rounded-2xl border transition-all text-center ${logic.id === m.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                   >
                     <span className="text-xs font-bold block mb-1">{m.label}</span>
                     <span className={`text-[10px] font-black ${logic.id === m.id ? 'text-indigo-200' : 'text-indigo-600'}`}>{m.multiplier}x</span>
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. THE RISK DASHBOARD (Right Panel) */}
      <div className="flex flex-col gap-6">
        <div className="bg-[#0B1120] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-full relative">
          {/* Header */}
          <div className="p-10 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Terminal size={20} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Diagnostic Terminal</h2>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Risk Multiplier Analysis v4.2</span>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Naive Est.</span>
                <div className="text-2xl font-black text-white">{naiveHours}h</div>
                <div className="text-[9px] font-bold text-slate-600 italic">No margin included</div>
              </div>
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl space-y-1 relative overflow-hidden group">
                <AlertTriangle size={40} className="absolute -right-4 -bottom-4 text-amber-500/20 group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Risk-Adjusted</span>
                <div className="text-2xl font-black text-amber-400">{stats.adjustedHours}h</div>
                <div className="text-[9px] font-bold text-amber-500/60 uppercase">Multiplier: {stats.totalMultiplier.toFixed(2)}x</div>
              </div>
              <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl space-y-1">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Final Scoped Price</span>
                <div className="text-2xl font-black text-white">${stats.finalPrice.toLocaleString()}</div>
                <div className="text-[9px] font-bold text-indigo-400/60 uppercase">Margin: +${(stats.riskPadding * rate).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Breakdown & SOW */}
          <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
             {/* The Why */}
             <div className="space-y-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <ShieldAlert size={14} className="text-indigo-400" />
                 Complexity Breakdown
               </h3>
               <div className="space-y-2">
                  {[auth, docs, sync, logic].filter(f => f.multiplier > 1).map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                         <span className="text-xs font-bold text-white/80">{f.label} Risk</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{f.reason}</span>
                          <span className="text-xs font-black text-amber-400">+{Math.round((naiveHours * f.multiplier) - naiveHours)}h</span>
                       </div>
                    </div>
                  ))}
                  {[auth, docs, sync, logic].every(f => f.multiplier === 1) && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                       <Zap size={14} className="text-emerald-400" />
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Minimal Friction Profile Detected</span>
                    </div>
                  )}
               </div>
             </div>

             {/* SOW Snippet */}
             <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText size={14} className="text-indigo-400" />
                  Protective SOW Clauses
                </h3>
                <div className="p-6 bg-slate-900 border border-white/10 rounded-[2rem] font-mono text-xs text-slate-400 leading-relaxed group relative">
                   <div className="max-h-48 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                      {sowSnippet}
                   </div>
                   <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-[2rem]" />
                </div>
             </div>
          </div>

          {/* SaaS Hook */}
          <div className="p-8 bg-white/[0.02] border-t border-white/5">
             <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={handleCopy}
                  className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 active:scale-95 transition-all group"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  {copied ? 'Clauses Copied!' : 'Copy SOW Constraints'}
                </button>
                <button 
                  onClick={() => {
                    const params = new URLSearchParams({
                      price: stats.finalPrice.toString(),
                      hours: stats.adjustedHours.toString(),
                      item: `API Integration (${systemA} ↔ ${systemB})`
                    });
                    window.location.href = `/tools/ai-proposal-generator?${params.toString()}`;
                  }}
                  className="flex-1 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 group"
                >
                  Push to Proposal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             
             <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                   <HardDrive size={10} className="text-slate-600" />
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Latency Compensation On</span>
                </div>
                <div className="flex items-center gap-2">
                   <Cpu size={10} className="text-slate-600" />
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">API Limits Tracked</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
