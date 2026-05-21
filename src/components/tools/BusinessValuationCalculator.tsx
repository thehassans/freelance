import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  Info,
  ArrowRight,
  ShieldCheck,
  Building2,
  PieChart,
  Calculator,
  CheckCircle2
} from 'lucide-react';

const MULTIPLES = {
  agency: { name: 'Service Agency', range: [2.0, 3.5], icon: Briefcase },
  saas: { name: 'Software (SaaS)', range: [4.0, 7.0], icon: Zap },
  ecom: { name: 'E-commerce', range: [2.5, 4.0], icon: Building2 },
  consulting: { name: 'Consulting', range: [1.0, 2.0], icon: Landmark }
};

type IndustryKey = keyof typeof MULTIPLES;

export default function BusinessValuationCalculator() {
  const [revenue, setRevenue] = useState<string>('500000');
  const [profit, setProfit] = useState<string>('80000');
  const [ownerSalary, setOwnerSalary] = useState<string>('100000');
  const [otherAddBacks, setOtherAddBacks] = useState<string>('20000');
  const [industry, setIndustry] = useState<IndustryKey>('saas');
  const [targetMultiple, setTargetMultiple] = useState<number>(MULTIPLES['saas'].range[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sync target multiple when industry changes
  const handleIndustryChange = (val: IndustryKey) => {
    setIndustry(val);
    setTargetMultiple(MULTIPLES[val].range[0]);
  };

  const valuation = useMemo(() => {
    const p = parseFloat(profit) || 0;
    const os = parseFloat(ownerSalary) || 0;
    const oa = parseFloat(otherAddBacks) || 0;
    const r = parseFloat(revenue) || 0;

    const trueSDE = p + os + oa;
    const lowValuation = trueSDE * MULTIPLES[industry].range[0];
    const highValuation = trueSDE * MULTIPLES[industry].range[1];
    const targetValuation = trueSDE * targetMultiple;
    const netMargin = r > 0 ? (p / r) * 100 : 0;

    const formatCurrency = (val: number) => {
      if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
      if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
      return `$${val.toFixed(0)}`;
    };

    return {
      trueSDE,
      low: lowValuation,
      high: highValuation,
      target: targetValuation,
      netMargin: netMargin.toFixed(1),
      lowFormatted: formatCurrency(lowValuation),
      highFormatted: formatCurrency(highValuation),
      targetFormatted: formatCurrency(targetValuation),
      sdeFormatted: formatCurrency(trueSDE),
      isReady: p > 0 || (os + oa) > 0
    };
  }, [profit, ownerSalary, otherAddBacks, industry, revenue, targetMultiple]);

  const faqs = [
    {
      question: "What are Owner Add-backs?",
      answer: "Add-backs are legitimate business expenses that a new owner would not strictly need to pay to run the company. Common examples include the current owner's salary (above market rate), personal travel run through the business, club memberships, one-time legal fees, or non-recurring equipment purchases."
    },
    {
      question: "What is SDE vs EBITDA?",
      answer: "SDE (Seller's Discretionary Earnings) is typically used for small-to-mid-market businesses doing under $5M in revenue. It represents the total pulse of the business including the owner's compensation. EBITDA is used for larger enterprise acquisitions where the owner is expected to be replaced by a hired manager, thus the salary is removed from the profit calculation."
    },
    {
      question: "Why are SaaS multiples higher than Agency multiples?",
      answer: "Software (SaaS) typically commands higher multiples because of its scalability, high gross margins (80%+), and predictable recurring revenue. Agencies are service-heavy, reliant on human capital, and often suffer from higher client churn, making them riskier investments compared to normalized software revenue."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-amber-100"
        >
          <TrendingUp size={12} /> Elite M&A Growth Framework
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Business <span className="text-amber-600">Valuation</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Discover your true market exit price based on Seller's Discretionary Earnings (SDE) and industry-validated multiples.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                   <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Financial Data</h3>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Annual Revenue</label>
                   <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                      <input 
                        type="number" 
                        value={revenue} 
                        onChange={(e) => setRevenue(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Net Annual Profit</label>
                   <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                      <input 
                        type="number" 
                        value={profit} 
                        onChange={(e) => setProfit(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Owner Salary ($)</label>
                      <div className="relative group">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                         <input 
                           type="number" 
                           value={ownerSalary} 
                           onChange={(e) => setOwnerSalary(e.target.value)}
                           placeholder="0.00"
                           className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all font-sans"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Other Perks & One-Time Expenses ($)</label>
                      <div className="relative group">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                         <input 
                           type="number" 
                           value={otherAddBacks} 
                           onChange={(e) => setOtherAddBacks(e.target.value)}
                           placeholder="0.00"
                           className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all font-sans"
                         />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 px-1 italic">Vehicle leases, personal travel, and one-time legal fees.</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Industry Category</label>
                   <div className="relative">
                      <select 
                        value={industry}
                        onChange={(e) => handleIndustryChange(e.target.value as IndustryKey)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 appearance-none focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                      >
                         {Object.entries(MULTIPLES).map(([key, data]) => (
                           <option key={key} value={key}>{data.name}</option>
                         ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Dashboard Column */}
        <div className="lg:col-span-12 xl:col-span-7">
          <section className="bg-slate-900 text-white rounded-[3.5rem] p-4 md:p-6 shadow-2xl overflow-hidden group h-full flex flex-col">
             <div className="relative flex-1 bg-slate-950/50 rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-10 h-full flex flex-col justify-center">
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Seller's Discretionary Earnings (SDE)</p>
                         <p className="text-5xl md:text-6xl font-black font-display tracking-tighter text-white">
                            {valuation.sdeFormatted}
                         </p>
                         <div className="mt-4 inline-flex items-center gap-2 text-slate-400 text-xs font-medium">
                            <Info size={14} className="text-amber-500" /> True profit after add-backs.
                         </div>
                      </div>
                      <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                         <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Net Margin</p>
                         <p className="text-sm font-black text-emerald-300">{valuation.netMargin}%</p>
                      </div>
                   </div>

                   <div className="pt-10 border-t border-white/5 space-y-8">
                      <div>
                         <div className="flex justify-between items-end mb-4">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Business Quality / Growth Rate</p>
                            <span className="px-3 py-1 bg-amber-500/10 rounded-lg text-amber-400 text-xs font-black">{targetMultiple.toFixed(1)}x Multiple</span>
                         </div>
                         <input 
                           type="range" 
                           min={MULTIPLES[industry].range[0]} 
                           max={MULTIPLES[industry].range[1]} 
                           step="0.1" 
                           value={targetMultiple} 
                           onChange={(e) => setTargetMultiple(parseFloat(e.target.value))}
                           className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                         />
                         <div className="flex justify-between mt-2 text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">
                            <span>Laggard ({MULTIPLES[industry].range[0]}x)</span>
                            <span>Rocket Ship ({MULTIPLES[industry].range[1]}x)</span>
                         </div>
                      </div>

                      <div className="bg-amber-500/5 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group/target">
                         <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover/target:opacity-100 transition-opacity" />
                         <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.4em] mb-4">Target Exact Valuation</p>
                         <p className="text-6xl md:text-7xl font-black tracking-tighter bg-gradient-to-br from-white via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            {valuation.targetFormatted}
                         </p>
                      </div>

                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Market Valuation Range</p>
                         <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-2">
                            <span className="text-3xl font-black tracking-tight text-slate-300">
                               {valuation.lowFormatted} – {valuation.highFormatted}
                            </span>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                            Industry benchmark for {MULTIPLES[industry].name}.
                         </p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                         <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <ShieldCheck size={12} /> Confidence Score
                         </p>
                         <p className="text-xl font-bold text-white">94% <span className="text-[10px] text-slate-500 font-black">HIGH</span></p>
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <TrendingUp size={12} /> Market Heat
                         </p>
                         <p className="text-xl font-bold text-white">Bullish <span className="text-[10px] text-slate-500 font-black">TRENDING</span></p>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Discover what your business is actually worth.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Landmark size={40} className="text-amber-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Basic profit multipliers drastically undervalue your business. Buyers calculate your Seller's Discretionary Earnings (SDE), which adds your salary, personal vehicle leases, and one-time expenses back into your profit pool.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <DollarSign size={14} className="text-amber-600" /> True SDE Audit
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Don't leave money on the table. We help you identify "phantom expenses" that should be added back to your valuation.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <PieChart size={14} className="text-blue-600" /> Industry Benchmarks
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Our multiples are calibrated against real-world acquisitions in the SaaS, Agency, and E-commerce sectors.
                       </p>
                    </div>
                 </div>
                 <p>
                   Whether you are preparing for a strategic exit or looking for a growth equity partner, understanding your valuation range is the first step in any successful negotiation. Our framework is designed to provide the most accurate assessment of small and mid-market companies.
                 </p>
              </div>
           </div>
        </div>

        {/* Big Info Section */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 blur-3xl -ml-48 -mt-48 rounded-full" />
              <div className="w-full md:w-1/2 space-y-8 relative z-10">
                 <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl w-fit">
                    <ShieldCheck size={32} />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-balance">
                    Valuation Built for <br/>Strategic Exits.
                 </h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed">
                    Most calculators ignore the nuance of owner's discretionary spending. We treat your business like a private equity group would.
                 </p>
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-amber-400 font-black text-xs uppercase tracking-widest">
                       <CheckCircle2 size={18} /> Asset-Light Service Multiples
                    </div>
                    <div className="flex items-center gap-3 text-amber-400 font-black text-xs uppercase tracking-widest">
                       <CheckCircle2 size={18} /> High-Growth SaaS Scalability Curves
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                 {[
                   { label: 'Standard', val: 'SDE-Based' },
                   { label: 'Accuracy', val: 'Proprietary' },
                   { label: 'Market', val: 'US/EU 2024' },
                   { label: 'Logic', val: 'Arithmetic' },
                 ].map((item, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 font-sans">{item.label}</p>
                      <p className="text-2xl font-black italic tracking-tight text-white">{item.val}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Capital Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Expert insights into business valuation and acquisition logic.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-amber-200/50 border-amber-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-amber-400" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="px-8 pb-8 pl-16">
                          <p className="text-slate-500 leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="mt-32 max-w-7xl mx-auto px-4">
        <div className="bg-amber-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Maximize Your <br/>Market Value.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of founders who use our data-driven insights to prepare their companies for life-changing exits.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-amber-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your Worth <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
