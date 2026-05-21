import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Briefcase, 
  Calculator, 
  HelpCircle, 
  ChevronDown, 
  Zap, 
  ArrowRight,
  Info,
  Building2,
  CheckCircle2,
  Heart
} from 'lucide-react';

export default function SocialRoiCalculator() {
  const [adSpend, setAdSpend] = useState<string>('3000');
  const [agencyFee, setAgencyFee] = useState<string>('2000');
  const [leadsGenerated, setLeadsGenerated] = useState<string>('150');
  const [closeRate, setCloseRate] = useState<number>(20);
  const [ltv, setLtv] = useState<string>('5000');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    const spend = parseFloat(adSpend) || 0;
    const fee = parseFloat(agencyFee) || 0;
    const leads = parseFloat(leadsGenerated) || 0;
    const valLtv = parseFloat(ltv) || 0;

    const totalSpend = spend + fee;
    const newCustomers = leads * (closeRate / 100);
    const totalValue = newCustomers * valLtv;
    const roi = totalSpend > 0 ? ((totalValue - totalSpend) / totalSpend) * 100 : 0;
    const cac = newCustomers > 0 ? totalSpend / newCustomers : 0;

    const formatCur = (val: number) => val.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

    return {
      totalSpend: formatCur(totalSpend),
      totalValue: formatCur(totalValue),
      roi: roi.toFixed(0),
      cac: formatCur(cac),
      customers: Math.floor(newCustomers),
      isPositive: roi > 0
    };
  }, [adSpend, agencyFee, leadsGenerated, closeRate, ltv]);

  const faqs = [
    {
      question: "Why should I use LTV for Social ROI calculations?",
      answer: "Social media marketing often attracts customers with a higher lifetime value through brand trust and education, even if original acquisition costs seem high. Clients often fire managers because they look at immediate profit (ROAS) rather than the long-term equity of the Customer Lifetime Value (LTV)."
    },
    {
      question: "How do I defend my agency retainer?",
      answer: "By plugging your agency fee directly into this calculator alongside ad spend, you show the client the total investment vs total value. If the social ecosystem is generating leads at a $5k LTV, your $2k retainer is a steal, even if the first purchase is only $100."
    },
    {
      question: "What is a healthy Social ROI?",
      answer: "A healthy LTV:CAC ratio is generally 3:1. This means the value your social leads bring in over time should be at least triple the total cost (Ad Spend + Fees) to acquire them."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-rose-100"
        >
          <Building2 size={12} /> Strategic CFO Framework
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Social ROI <span className="text-rose-600">(LTV)</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Defend your social media retainer. Calculate the true Lifetime Value impact of your social leads to prove long-term profitability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm font-sans">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                   <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Total Investment</h3>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Monthly Ad Spend ($)</label>
                      <input 
                        type="number" 
                        value={adSpend} 
                        onChange={(e) => setAdSpend(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-rose-500 transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Agency Fee ($)</label>
                      <input 
                        type="number" 
                        value={agencyFee} 
                        onChange={(e) => setAgencyFee(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-rose-500 transition-all font-sans"
                      />
                   </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-6">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Leads Generated</label>
                   <input 
                     type="number" 
                     value={leadsGenerated} 
                     onChange={(e) => setLeadsGenerated(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-rose-500 transition-all"
                   />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Sales Close Rate (%)</label>
                     <span className="text-rose-600 font-black text-sm">{closeRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={closeRate} 
                    onChange={(e) => setCloseRate(parseInt(e.target.value))}
                    className="w-full accent-rose-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2 p-6 bg-slate-900 rounded-[2rem] text-white">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2 px-1">Customer Lifetime Value (LTV) ($)</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input 
                        type="number" 
                        value={ltv} 
                        onChange={(e) => setLtv(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold text-white focus:outline-none focus:border-rose-500 transition-all"
                      />
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Dashboard Column */}
        <div className="lg:col-span-12 xl:col-span-7">
          <section className="bg-slate-950 text-white rounded-[3.5rem] p-4 md:p-6 shadow-2xl overflow-hidden group h-full flex flex-col border border-white/5">
             <div className="relative flex-1 bg-slate-900/50 rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-12 h-full flex flex-col justify-center">
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Total Marketing Cost</p>
                         <p className="text-4xl md:text-5xl font-black font-display tracking-tighter text-slate-300">
                            {stats.totalSpend}
                         </p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">CAC <span className="text-rose-500 opacity-60">(Per Acquisition)</span></p>
                         <p className="text-4xl md:text-5xl font-black font-display tracking-tighter text-rose-400">
                            {stats.cac}
                         </p>
                      </div>
                   </div>

                   <div className="pt-12 border-t border-white/5 flex flex-col gap-8">
                      <div>
                         <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-4">Total Lifetime Value Created</p>
                         <p className="text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                            {stats.totalValue}
                         </p>
                      </div>

                      <div className="p-10 bg-rose-600 rounded-[2.5rem] shadow-2xl shadow-rose-500/20 relative overflow-hidden group/target">
                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/target:opacity-100 transition-opacity" />
                         <div className="relative z-10">
                            <p className="text-[10px] font-black text-rose-200 uppercase tracking-[0.4em] mb-4">Total Social ROI %</p>
                            <p className="text-6xl md:text-7xl font-black tracking-tighter text-white">
                               {stats.roi}%
                            </p>
                         </div>
                         <TrendingUp className="absolute right-10 bottom-10 text-white/10" size={120} />
                      </div>
                   </div>

                   <div className="flex items-center gap-4 flex-wrap">
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                         <CheckCircle2 size={12} className="text-emerald-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stats.customers} New Customers</span>
                      </div>
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                         <Heart size={12} className="text-pink-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retention Optimized</span>
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
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Defend your social media retainer.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Users size={40} className="text-rose-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Social media managers often get fired because clients only look at immediate sales, not the Lifetime Value (LTV) of the acquired customers. A single social lead might have a small first purchase, but their long-term brand affinity often leads to years of recurring revenue.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={14} className="text-rose-600" /> Brand Equity
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Social leads typically have a higher 2nd-purchase rate due to the brand trust built through content cycles.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-600" /> CAC Rationalization
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Stop stressing over high acquisition costs if your LTV benchmarks prove the long-term math works.
                       </p>
                    </div>
                 </div>
                 <p>
                    By moving the conversation from "How many sales did we get today?" to "How much long-term wealth did we create today?", you position yourself as a strategic CFO-level partner, not just a service provider.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">LTV Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Critical investment frameworks for social media brand builders.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-rose-200/50 border-rose-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-rose-400" />
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
        <div className="bg-rose-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Defend Your <br/>Market Value.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join elite agencies who use LTV math to justify their fees and scale their clients' brand equity.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-rose-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your ROI <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
