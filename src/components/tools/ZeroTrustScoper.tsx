import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  Network, 
  Key, 
  History, 
  Download, 
  Zap, 
  Copy, 
  Check, 
  Clock, 
  DollarSign, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

export default function ZeroTrustScoper() {
  const [hourlyRate, setHourlyRate] = useState(150);
  const [roles, setRoles] = useState(5);
  const [endpoints, setEndpoints] = useState(10);
  const [useSSO, setUseSSO] = useState(false);
  const [legacySystems, setLegacySystems] = useState(0);
  const [copied, setCopied] = useState(false);

  // Hours breakdown state for UI
  const [breakdown, setBreakdown] = useState({
    base: 20,
    roles: 12.5,
    endpoints: 30,
    sso: 0,
    legacy: 0,
    total: 62.5
  });

  useEffect(() => {
    const roleHours = roles * 2.5;
    const endpointHours = endpoints * 3;
    const ssoHours = useSSO ? 15 : 0;
    const legacyHours = legacySystems * 8;
    const totalHours = 20 + roleHours + endpointHours + ssoHours + legacyHours;

    setBreakdown({
      base: 20,
      roles: roleHours,
      endpoints: endpointHours,
      sso: ssoHours,
      legacy: legacyHours,
      total: totalHours
    });
  }, [roles, endpoints, useSSO, legacySystems]);

  const totalEstimate = breakdown.total * hourlyRate;
  const timelineWeeks = (breakdown.total / 20).toFixed(1);

  const handleCopyProposal = () => {
    const text = `Hi [Name], based on your infrastructure size (${endpoints} services and ${roles} distinct roles), migrating to a Zero Trust architecture will require approximately ${breakdown.total} hours of engineering. We estimate a timeline of ${timelineWeeks} weeks. Attached is the preliminary scope breakdown. Let me know when you have 15 minutes to review.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-6">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Zero Trust Implementation Scope</h1>
        <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          <span>Target Infrastructure Audit</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Security Perimeter Design
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Zero Trust Architecture Scoper</h2>
          <p className="text-slate-500 text-sm max-w-xl">
            Map out security perimeters and calculate implementation complexity for high-security Zero Trust frameworks.
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
        >
          <Download size={16} /> Generate Scoping Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Control Panel */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-display">
              {/* Hourly Rate */}
              <div className="space-y-4">
                <label className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><DollarSign size={14} /> Hourly Rate</span>
                  <span className="text-emerald-600">${hourlyRate}/hr</span>
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono text-sm group-hover:border-slate-200"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={14} className="text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Legacy Systems */}
              <div className="space-y-4">
                <label className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Layers size={14} /> Legacy Systems</span>
                  <span className="text-emerald-600">{legacySystems} Nodes</span>
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={legacySystems}
                    onChange={(e) => setLegacySystems(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono text-sm group-hover:border-slate-200"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={14} className="text-slate-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Role Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Users size={16} className="text-slate-400" /> Employee Roles / Groups
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide">Granular access requires mapping every user role.</p>
                </div>
                <span className="text-2xl font-black text-emerald-600 italic leading-none">{roles}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={roles}
                onChange={(e) => setRoles(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Endpoints Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Network size={16} className="text-slate-400" /> API Endpoints / Services
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide">Number of internal apps or APIs to secure.</p>
                </div>
                <span className="text-2xl font-black text-emerald-600 italic leading-none">{endpoints}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={endpoints}
                onChange={(e) => setEndpoints(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* SSO Toggle */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100/50 group">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Key size={16} className="text-slate-400" /> SSO Integration
                </label>
                <p className="text-[10px] text-slate-400 font-medium">SAML/OIDC centralization for identity management.</p>
              </div>
              <button
                onClick={() => setUseSSO(!useSSO)}
                className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${useSSO ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${useSSO ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard / Output */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-300/50 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 print:hidden">
              <ShieldCheck size={120} className="text-slate-900 rotate-12" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Estimated Project Value</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tight italic">
                    ${totalEstimate.toLocaleString()}
                  </span>
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">USD</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Timeline</p>
                  <p className="text-2xl font-black text-emerald-600 italic">{timelineWeeks} <span className="text-[10px] not-italic text-slate-400 uppercase tracking-widest">Weeks</span></p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Effort</p>
                  <p className="text-2xl font-black text-slate-900 italic">{breakdown.total.toFixed(1)} <span className="text-[10px] not-italic text-slate-400 uppercase tracking-widest">Hours</span></p>
                </div>
              </div>

              {/* Hours Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Resource Distribution</span>
                  <span>100% Billable</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-inner border border-slate-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(breakdown.base / breakdown.total) * 100}%` }}
                    className="h-full bg-slate-900"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(breakdown.roles / breakdown.total) * 100}%` }}
                    className="h-full bg-emerald-500/80"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(breakdown.endpoints / breakdown.total) * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(breakdown.sso / breakdown.total) * 100}%` }}
                    className="h-full bg-emerald-400"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(breakdown.legacy / breakdown.total) * 100}%` }}
                    className="h-full bg-rose-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {[
                    { label: 'Architecture & Audit', hours: breakdown.base, color: 'bg-slate-900' },
                    { label: 'Identity & Role Mapping', hours: breakdown.roles, color: 'bg-emerald-500/80' },
                    { label: 'Endpoint Security', hours: breakdown.endpoints, color: 'bg-emerald-500' },
                    { label: 'SSO Implementation', hours: breakdown.sso, color: 'bg-emerald-400' },
                    { label: 'Legacy Integration', hours: breakdown.legacy, color: 'bg-rose-500' }
                  ].filter(item => item.hours > 0).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-900">{item.hours.toFixed(1)}h</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 hidden print:block">
                <p className="text-[10px] text-slate-400 italic">This is a preliminary scope estimate. Actual project costs may vary based on discovery phase results and system complexity.</p>
              </div>
            </div>
          </div>

          {/* Sales Hook */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/30 print:hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20 translate-x-4 -translate-y-4">
              <Zap size={100} className="text-emerald-400" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  <Zap size={14} /> High-Ticket Proposal Script
                </div>
                <h4 className="text-xl font-black italic uppercase tracking-tight italic">Secure the $20k+ Contract</h4>
                <p className="text-slate-400 text-xs italic">Position yourself as a strategic infrastructure partner, not a commodity coder.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Hi [Name], based on your infrastructure size ({endpoints} services and {roles} distinct roles), migrating to a Zero Trust architecture will require approximately {breakdown.total.toFixed(0)} hours of engineering..."
                </p>
                <div className="absolute -top-2 left-6 px-2 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded">The Script</div>
              </div>

              <button 
                onClick={handleCopyProposal}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  copied 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-white text-slate-900 hover:bg-emerald-50 shadow-lg shadow-black/20'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Proposal Copied!' : 'Copy Proposal Script'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
