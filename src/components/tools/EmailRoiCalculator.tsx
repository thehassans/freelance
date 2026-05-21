import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Users, 
  Eye, 
  MousePointer2, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';

export default function EmailRoiCalculator() {
  const [listSize, setListSize] = useState<string>('50000');
  const [openRate, setOpenRate] = useState<number>(22);
  const [ctr, setCtr] = useState<number>(2.5);
  const [convRate, setConvRate] = useState<number>(1.5);
  const [aov, setAov] = useState<string>('85');
  const [campaignCost, setCampaignCost] = useState<string>('500');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    const size = parseFloat(listSize) || 0;
    const aovVal = parseFloat(aov) || 0;
    const cost = parseFloat(campaignCost) || 0;

    const opens = size * (openRate / 100);
    const clicks = opens * (ctr / 100);
    const conversions = clicks * (convRate / 100);
    const revenue = conversions * aovVal;
    const profit = revenue - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;

    const formatCur = (val: number) => val.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
    const formatNum = (val: number) => val.toLocaleString(undefined, { maximumFractionDigits: 0 });

    return {
      opens: formatNum(opens),
      clicks: formatNum(clicks),
      conversions: formatNum(conversions),
      revenue: formatCur(revenue),
      roi: roi.toFixed(0),
      isProfitable: roi > 0
    };
  }, [listSize, openRate, ctr, convRate, aov, campaignCost]);

  const faqs = [
    {
      question: "What are industry average open rates?",
      answer: "While it varies by sector, a healthy open rate is typically between 18% and 22%. E-commerce brands often see lower (15%), while niche B2B newsletters can see 40%+."
    },
    {
      question: "How can I improve my Email ROI?",
      answer: "Focus on three key areas: 1. Subject lines to improve Open Rate. 2. CTA clarity to improve CTR. 3. Personalization and Segmentation to improve Conversion Rate. Most ROI gains come from sending more relevant content to smaller, engaged list segments."
    },
    {
      question: "Is Email Marketing still effective?",
      answer: "Absolutely. Email still holds the highest ROI of any digital channel, often generating $36-$40 for every $1 spent. This is because you 'own' the audience, unlike being at the mercy of social media algorithm changes."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-indigo-100"
        >
          <Send size={12} /> Inbox Performance Framework
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Email Marketing <span className="text-indigo-600">ROI</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Prove the value of the inbox. Visualize your campaign funnel from initial send to final purchase and ROI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                   <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Funnel Sliders</h3>
             </div>

             <div className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Total List Size</label>
                   <input 
                     type="number" 
                     value={listSize} 
                     onChange={(e) => setListSize(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                   />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Average Open Rate (%)</label>
                     <span className="text-indigo-600 font-black text-sm">{openRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    value={openRate} 
                    onChange={(e) => setOpenRate(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Click-Through Rate (%)</label>
                     <span className="text-indigo-600 font-black text-sm">{ctr}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="20" 
                    step="0.1"
                    value={ctr} 
                    onChange={(e) => setCtr(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Conv. Rate (%)</label>
                      <input 
                        type="number" 
                        value={convRate} 
                        onChange={(e) => setConvRate(parseFloat(e.target.value))}
                        step="0.1"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Avg Order ($)</label>
                      <input 
                        type="number" 
                        value={aov} 
                        onChange={(e) => setAov(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                      />
                   </div>
                </div>

                <div className="space-y-2 p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2 px-1">Campaign Softare/Labor Cost ($)</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input 
                        type="number" 
                        value={campaignCost} 
                        onChange={(e) => setCampaignCost(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                      />
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Dashboard Column */}
        <div className="lg:col-span-12 xl:col-span-7">
          <section className="bg-slate-900 text-white rounded-[3.5rem] p-4 md:p-6 shadow-2xl overflow-hidden group h-full flex flex-col">
             <div className="relative flex-1 bg-slate-950/50 rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-10 h-full flex flex-col justify-center">
                   {/* Funnel Viz */}
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Opens</p>
                         <p className="text-2xl font-black text-white">{stats.opens}</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Clicks</p>
                         <p className="text-2xl font-black text-indigo-400">{stats.clicks}</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Conversions</p>
                         <p className="text-2xl font-black text-emerald-400">{stats.conversions}</p>
                      </div>
                   </div>

                   <div className="pt-10 border-t border-white/5 flex flex-col gap-8">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Total Campaign Revenue</p>
                         <p className="text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {stats.revenue}
                         </p>
                      </div>

                      <div className="p-10 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 relative overflow-hidden group/target">
                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/target:opacity-100 transition-opacity" />
                         <div className="relative z-10">
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.4em] mb-4">Final Estimated ROI</p>
                            <p className="text-6xl md:text-7xl font-black tracking-tighter text-white">
                               {stats.roi}%
                            </p>
                         </div>
                         <TrendingUp className="absolute right-10 bottom-10 text-white/10" size={120} />
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                         <CheckCircle2 size={12} className="text-emerald-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">High Profitability</span>
                      </div>
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                         <ShieldCheck size={12} className="text-blue-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deliverability Safe</span>
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
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Prove the value of the inbox.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Send size={40} className="text-indigo-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Break down why email marketing still holds the highest ROI of any digital channel. Unlike rented audiences on social platforms, your email list is a first-party asset that you control entirely.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Eye size={14} className="text-indigo-600" /> Visibility Audit
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Understand how subject line performance (Open Rate) directly impacts the bottom line of your business.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <DollarSign size={14} className="text-emerald-600" /> Revenue Mapping
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Map your list segmentation strategy to specific AOV (Average Order Value) targets for maximum efficiency.
                       </p>
                    </div>
                 </div>
                 <p>
                    The real magic of email is compounding. As your list grows and your automation improves, your 'Cost Per Send' remains nearly zero while your potential revenue scales linearly. Use this calculator to simulate your next big launch.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Email Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Core metrics and optimization benchmarks for inbox marketing.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-indigo-200/50 border-indigo-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-indigo-400" />
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
        <div className="bg-indigo-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Own Your <br/>Audience Assets.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of marketers who use data to defend their email spend and scale their list ROI.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Calculate Your ROI <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
