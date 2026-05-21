import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Percent, TrendingUp, DollarSign, ArrowRight, Info, Calculator, PieChart, Tag, AlertCircle, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useEcosystemStore } from '../../store/useEcosystemStore';

export default function ProfitMarginCalculator() {
  const { invoicePayload, clearAllPayloads } = useEcosystemStore();
  const [revenue, setRevenue] = useState<number | string>("");
  const [cogs, setCogs] = useState<number | string>("");
  const [opex, setOpex] = useState<number | string>("");
  const [targetMargin, setTargetMargin] = useState<number>(20);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is a "good" profit margin for a service-based agency?',
      a: 'A standard benchmark for professional services is a 50%+ Gross Margin and a 15-25% Net Margin. Top-tier, highly productized agencies often push Net Margins above 30%.'
    },
    {
      q: 'Should I include my own salary in Fixed Overhead (OPEX)?',
      a: 'Absolutely. You are an employee of your own business. If your business cannot afford to pay your base market salary AND generate a 15%+ net profit margin on top of that, you do not have a profitable business; you just have a stressful job.'
    },
    {
      q: 'How do I calculate COGS if I sell services, not physical products?',
      a: 'In a service business, COGS (Cost of Delivery) includes the direct costs required to fulfill a specific project. This means freelance contractor fees, outsourced design work, project-specific software or API costs, and server hosting dedicated to that client.'
    },
    {
      q: 'What is the difference between Markup and Margin?',
      a: 'Markup is the percentage added to your costs to determine the price. Margin is the percentage of the selling price that is profit. A 50% markup on a $100 cost gives a $150 price. The margin on that $150 price is 33.3%, not 50%.'
    }
  ];

  // Ecosystem Pipeline
  useEffect(() => {
    if (invoicePayload) {
      setRevenue(invoicePayload.rate * invoicePayload.quantity);
      clearAllPayloads();
    }
  }, [invoicePayload, clearAllPayloads]);

  const results = useMemo(() => {
    const rev = Number(revenue);
    const cost = Number(cogs);
    const exp = Number(opex);

    const grossProfit = rev - cost;
    const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
    const netProfit = grossProfit - exp;
    const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;
    
    const totalCosts = cost + exp;
    const calculatedTargetRevenue = targetMargin < 100 ? totalCosts / (1 - targetMargin / 100) : 0;

    return {
      grossProfit,
      grossMargin,
      netProfit,
      netMargin,
      calculatedTargetRevenue
    };
  }, [revenue, cogs, opex, targetMargin]);

  const getHealthBadge = () => {
    const margin = results.netMargin;
    if (margin >= 30) {
      return {
        label: 'Highly Profitable',
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: <ShieldCheck size={14} />
      };
    }
    if (margin >= 10) {
      return {
        label: 'Sustainable',
        color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        icon: <Zap size={14} />
      };
    }
    return {
      label: 'High Risk / Burn Rate',
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      icon: <AlertCircle size={14} />
    };
  };

  const healthBadge = getHealthBadge();

  return (
    <div className="pb-24">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Input Engine - Left Panel */}
      <div className="lg:col-span-5 space-y-6 print:hidden">
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
            <Calculator size={160} />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 flex items-center gap-3">
              <Calculator className="text-[#0f4c75]" size={24} /> Financial Inputs
            </h3>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Revenue Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Total Invoiced Revenue</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-[#0f4c75] group-focus-within:scale-110 transition-transform">
                  <DollarSign size={18} />
                </div>
                <input 
                  type="number" 
                  placeholder="0"
                  value={revenue}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRevenue(val === "" ? "" : Number(val));
                  }}
                  className="w-full pl-16 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0f4c75] font-mono text-2xl font-black text-slate-900 transition-all"
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 mx-1" />

            {/* COGS Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project / Delivery Costs (COGS)</label>
                <Info size={12} className="text-slate-300" />
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:text-rose-500 transition-colors">
                  <span className="text-sm font-bold">-</span>
                </div>
                <input 
                  type="number" 
                  placeholder="0"
                  value={cogs}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCogs(val === "" ? "" : Number(val));
                  }}
                  className="w-full pl-16 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-rose-500 font-mono text-2xl font-black text-slate-900"
                />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-1">Freelancers, server costs, fixed project expenses.</p>
            </div>

            {/* OPEX Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fixed Overhead (OPEX)</label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:text-rose-500 transition-colors">
                  <span className="text-sm font-bold">-</span>
                </div>
                <input 
                  type="number" 
                  placeholder="0"
                  value={opex}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOpex(val === "" ? "" : Number(val));
                  }}
                  className="w-full pl-16 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-rose-500 font-mono text-xl font-black text-slate-900"
                />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-1">Rent, SaaS tools, marketing, base salary.</p>
            </div>

            {/* Growth Simulator */}
            <div className="pt-8 mt-8 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#0f4c75] mb-4">Growth Simulator</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Net Margin (%)</label>
                  <span className="text-sm font-black text-slate-900">{targetMargin}%</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="99"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  className="w-full accent-[#0f4c75]"
                />
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs leading-relaxed border border-emerald-100">
                  To achieve a <span className="font-bold">{targetMargin}%</span> Net Margin with your current costs, you must increase your Total Invoiced Revenue to <span className="font-black text-emerald-600">${results.calculatedTargetRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex items-start gap-4">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Sparkles size={16} className="text-[#0f4c75]" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed italic">
            "Gross Margin tells you if your projects are profitable. Net Margin tells you if your business is profitable."
          </p>
        </div>
      </div>

      {/* Health Dashboard - Right Panel */}
      <div className="lg:col-span-7 space-y-6 print:col-span-12 print:block print:w-full">
        <div className="bg-[#0B1120] print:bg-white text-white print:text-slate-900 print:shadow-none p-8 sm:p-10 print:p-0 rounded-[2.5rem] print:rounded-none shadow-2xl relative overflow-hidden group min-h-[500px]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0f4c75]/20 blur-[100px] -mr-40 -mt-40 rounded-full print:hidden" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -ml-32 -mb-32 rounded-full print:hidden" />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3 print:text-slate-900">
                <Activity className="text-[#0f4c75]" size={24} /> Financial Health Dashboard
              </h3>
              <div className={`px-4 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in zoom-in ${healthBadge.color}`}>
                {healthBadge.icon} {healthBadge.label}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-slate-500 print:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Gross Profit</label>
                  <div className="text-5xl font-black tracking-tighter tabular-nums text-white print:text-slate-900">
                    ${results.grossProfit.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-grow bg-white/10 print:bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, results.grossMargin))}%` }}
                      className="h-full bg-[#0f4c75]"
                    />
                  </div>
                  <span className="text-xs font-black text-[#0f4c75]">{results.grossMargin.toFixed(1)}%</span>
                </div>
                <p className="text-[9px] text-slate-500 print:text-slate-600 font-bold uppercase tracking-widest">Gross Margin (Project efficiency)</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-slate-500 print:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Net Profit (Take-Home)</label>
                  <div className="text-5xl font-black tracking-tighter tabular-nums text-emerald-400 print:text-emerald-600">
                    ${results.netProfit.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-grow bg-white/10 print:bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, results.netMargin))}%` }}
                      className={`h-full ${results.netMargin > 30 ? 'bg-emerald-500 print:bg-emerald-500' : 'bg-amber-400 print:bg-amber-500'}`}
                    />
                  </div>
                  <span className={`text-xs font-black ${results.netMargin > 10 ? 'text-emerald-400 print:text-emerald-600' : 'text-rose-400 print:text-rose-600'}`}>
                    {results.netMargin.toFixed(1)}%
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Net Margin (Company health)</p>
              </div>
            </div>

            {/* Print-only detailed breakdown */}
            <div className="hidden print:block mt-8 space-y-4">
              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Line Item Breakdown</h4>
                <div className="space-y-3 text-slate-800 text-sm">
                  <div className="flex justify-between font-mono"><span>Revenue</span> <span>${Number(revenue).toLocaleString()}</span></div>
                  <div className="flex justify-between font-mono text-rose-600"><span>- COGS</span> <span>${Number(cogs).toLocaleString()}</span></div>
                  <div className="flex justify-between font-mono font-bold border-t border-slate-200 pt-2 text-[#0f4c75]"><span>Gross Profit</span> <span>${results.grossProfit.toLocaleString()} ({results.grossMargin.toFixed(1)}%)</span></div>
                  <div className="flex justify-between font-mono text-rose-600 pt-2"><span>- OPEX</span> <span>${Number(opex).toLocaleString()}</span></div>
                  <div className="flex justify-between font-mono font-black border-t border-slate-300 pt-2 text-emerald-600 text-lg"><span>Net Profit</span> <span>${results.netProfit.toLocaleString()} ({results.netMargin.toFixed(1)}%)</span></div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-10 border-t border-white/5 print:hidden">
              <div className="bg-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Business Viability</p>
                  <p className="text-xs text-white">Your {results.netMargin.toFixed(1)}% margin is considered <span className="font-bold text-emerald-400 underline decoration-emerald-400/30">
                    {results.netMargin > 30 ? 'Elite' : results.netMargin > 15 ? 'Healthy' : 'Challenging'}
                  </span> for a professional services firm.</p>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="whitespace-nowrap px-6 py-3 bg-[#0f4c75] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0c3c5c] transition-all flex items-center gap-2 shadow-xl shadow-[#0f4c75]/20 group"
                >
                  Detailed Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Info size={16} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scale Strategy</p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed italic">
            "To increase Net Margin, you can either increase your project efficiency (COGS) or reduce your overhead (OPEX). Small tweaks in overhead often have the largest impact on your personal take-home."
          </p>
        </div>
      </div>
    </div>

    {/* Anatomy of Agency Profitability */}
    <div className="max-w-6xl mx-auto mt-24 pt-12 border-t border-slate-200 print:hidden">
      <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-10 text-center">
        The Anatomy of Agency Profitability
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Gross vs. Net Margin",
            content: "Gross Margin measures project efficiency (did you price the project right?). Net Margin measures company health (are your operating expenses too high?). You must track both independently."
          },
          {
            title: "The Agency Squeeze",
            content: "Scope creep destroys Gross Margin. If a project takes 40 hours instead of 20, your COGS doubles, and your margin evaporates. Strict scope management is the ultimate margin protector."
          },
          {
            title: "Scaling OPEX",
            content: "Many agencies increase revenue but decrease Net Profit because they scale overhead (expensive offices, unnecessary software, non-billable staff) faster than top-line revenue. Stay lean."
          }
        ].map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-black text-lg text-slate-900">{card.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{card.content}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Profit Margin FAQ */}
    <div className="max-w-4xl mx-auto mt-16 pb-32 print:hidden">
      <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-10 text-center">
        Profit Margin FAQ
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div 
              key={index} 
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#0f4c75] shadow-md shadow-[#0f4c75]/5' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <button
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-slate-900">{faq.q}</span>
                <div className={`flex-shrink-0 ml-4 p-2 rounded-full transition-colors ${isOpen ? 'bg-[#0f4c75]/10 text-[#0f4c75]' : 'bg-slate-50 text-slate-400'}`}>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}


