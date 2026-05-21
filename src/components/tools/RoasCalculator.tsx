import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Target, 
  ArrowRight, 
  ShieldCheck, 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  AlertCircle,
  BarChart3,
  Flame,
  Info
} from 'lucide-react';

export default function RoasCalculator() {
  const [adSpend, setAdSpend] = useState<number | string>('');
  const [revenue, setRevenue] = useState<number | string>('');
  const [profitMargin, setProfitMargin] = useState<number | string>(50);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    const spend = typeof adSpend === 'string' ? parseFloat(adSpend) : adSpend;
    const rev = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
    const margin = typeof profitMargin === 'string' ? parseFloat(profitMargin) : profitMargin;

    if (isNaN(spend) || isNaN(rev) || spend === 0) {
      return {
        roasMultiplier: 0,
        breakEvenRoas: margin > 0 ? 100 / margin : 0,
        netProfit: 0,
        requiredRevenue: 0,
        roi: 0,
        isProfitable: false,
        ready: false
      };
    }

    const roasMultiplier = rev / spend;
    const breakEvenRoas = margin > 0 ? 100 / margin : 0;
    const netProfit = (rev * (margin / 100)) - spend;
    const requiredRevenue = spend * breakEvenRoas;
    const roi = spend > 0 ? (netProfit / spend) * 100 : 0;
    const isProfitable = roasMultiplier > breakEvenRoas;

    return {
      roasMultiplier: parseFloat(roasMultiplier.toFixed(2)),
      breakEvenRoas: parseFloat(breakEvenRoas.toFixed(2)),
      netProfit: Math.round(netProfit),
      requiredRevenue: Math.round(requiredRevenue),
      roi: parseFloat(roi.toFixed(1)),
      isProfitable,
      ready: true
    };
  }, [adSpend, revenue, profitMargin]);

  const faqs = [
    {
      question: "What is a good ROAS?",
      answer: "A 'good' ROAS depends entirely on your industry and profit margins. Generally, a 400% (4:1) ratio is the benchmark for e-commerce. However, if you have high margins, a 2:1 might be great; if you have low margins, even a 6:1 could be losing you money."
    },
    {
      question: "What is the difference between ROI and ROAS?",
      answer: "ROAS (Return on Ad Spend) measures gross revenue generated for every dollar spent on advertising. ROI (Return on Investment) is a broader metric that accounts for all costs including team salaries, software, and overhead, measuring the total net profit of the business or initiative."
    },
    {
      question: "How do I lower my Break-Even ROAS?",
      answer: "To lower your break-even point, you must increase your profit margins. This can be achieved by decreasing the Cost of Goods Sold (COGS), increasing your product prices, or improving operational efficiency."
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
          <BarChart3 size={12} /> Performance Marketing Engine
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          ROAS & <span className="text-indigo-600">Break-Even</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Analyze campaign health, calculate net profit, and discover your absolute break-even point based on real business margins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                   <Target size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Campaign Inputs</h3>
             </div>

             <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1 flex items-center gap-2">
                    <DollarSign size={12} /> Monthly Ad Spend
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={adSpend}
                      onChange={(e) => setAdSpend(e.target.value)}
                      placeholder="0"
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold text-slate-900 transition-all"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs uppercase tracking-widest">USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1 flex items-center gap-2">
                    <TrendingUp size={12} /> Attributed Revenue
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      placeholder="0"
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold text-slate-900 transition-all font-display"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs uppercase tracking-widest">USD</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Percent size={12} /> Profit Margin (Gross)
                    </label>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number"
                         value={profitMargin}
                         onChange={(e) => setProfitMargin(e.target.value)}
                         className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-right font-black text-sm text-indigo-600 focus:outline-none focus:border-indigo-500 transition-all"
                         step="0.1"
                         placeholder="50"
                       />
                       <span className="text-slate-400 font-black text-xs tracking-tighter">%</span>
                    </div>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="100"
                    step="0.1"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-3 text-[9px] font-black uppercase tracking-widest text-slate-400/60 italic">
                    <span>Performance / Low Margin</span>
                    <span>High Ticket / High Margin</span>
                  </div>
                </div>
             </div>
          </section>
        </div>

        {/* Dashboard Column */}
        <div className="lg:col-span-12 xl:col-span-7">
          <section className="bg-slate-900 text-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl -mr-48 -mt-48 rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-12 relative z-10">
                 <div>
                   <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                     <BarChart3 className="text-indigo-400" /> Yield Analysis
                   </h3>
                   <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-1">Campaign Integrity Audit</p>
                 </div>
                 <AnimatePresence mode="wait">
                   {!stats.ready ? (
                     <motion.div 
                       key="neutral"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="px-4 py-1.5 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-white/5"
                     >
                       Ready to Analyze
                     </motion.div>
                   ) : stats.isProfitable ? (
                     <motion.div 
                       key="profitable"
                       initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                       className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-emerald-500/20"
                     >
                       <Zap size={12} className="animate-pulse" /> Campaign is Profitable
                     </motion.div>
                   ) : (
                     <motion.div 
                       key="losing"
                       initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                       className="px-4 py-1.5 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-red-500/20"
                     >
                       <AlertCircle size={12} /> Campaign is Losing Money
                     </motion.div>
                   )}
                 </AnimatePresence>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-2">
                 <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] block translate-y-2">Current ROAS</label>
                 <div className="flex items-baseline gap-3">
                    <span className="text-7xl md:text-9xl font-black font-display tracking-tighter tabular-nums text-white">
                      {stats.roasMultiplier}<span className="text-2xl md:text-4xl text-indigo-500 ml-2">x</span>
                    </span>
                 </div>

                 {/* ROAS Progress Bar */}
                 <div className="relative pt-4 pb-8 group/progress">
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden relative">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min((stats.roasMultiplier / (stats.breakEvenRoas * 2 + 0.1)) * 100, 100)}%` }}
                         className={`h-full rounded-full transition-all duration-1000 ${stats.isProfitable ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'}`}
                       />
                       {/* Break-even Tick */}
                       <div 
                         className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_8px_rgba(255,255,255,1)]"
                         style={{ left: `${(stats.breakEvenRoas / (stats.breakEvenRoas * 2 + 0.1)) * 100}%` }}
                       />
                    </div>
                    <div 
                      className="absolute top-8 text-[8px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap transition-all group-hover/progress:text-white/60"
                      style={{ left: `${(stats.breakEvenRoas / (stats.breakEvenRoas * 2 + 0.1)) * 100}%`, transform: 'translateX(-50%)' }}
                    >
                       Break-Even Point ({stats.breakEvenRoas}x)
                    </div>
                 </div>

                 <div className="flex items-center gap-2 text-slate-400 uppercase font-black text-[10px] tracking-widest px-1 mt-4">
                    <div className="w-1 h-1 rounded-full bg-indigo-500" />
                    Target Break-Even: {stats.breakEvenRoas}x
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 group-hover:bg-white/[0.07] transition-all">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Estimated Net Profit</p>
                    <p className={`text-4xl font-black font-display tabular-nums tracking-tighter ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stats.netProfit < 0 ? '-' : ''}${Math.abs(stats.netProfit).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">After Cost of Goods Sold & Ad Spend</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 border-dashed">
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Required Revenue</p>
                       <p className="text-lg font-black text-white">${stats.requiredRevenue.toLocaleString()}</p>
                       <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">To break even</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 border-dashed">
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">ROI (%)</p>
                       <p className={`text-lg font-black ${stats.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{stats.roi}%</p>
                       <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">Yield efficiency</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
               <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-indigo-500" /> Secure Financial Modeling
               </div>
               <button 
                 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                 className="flex items-center gap-2 group/btn text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
               >
                 Review Settings <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </div>
          </section>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Math Explanation */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">The ROAS Formula</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Info size={40} className="text-indigo-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Return on Ad Spend (ROAS) is a simple metric with complex implications. The basic formula is:
                 </p>
                 <div className="my-10 p-8 bg-slate-900 text-white rounded-[2rem] font-mono text-xl md:text-2xl text-center shadow-xl border border-white/5">
                    Revenue ÷ Ad Spend = ROAS
                 </div>
                 <p>
                    However, knowing your ROAS is only half the battle. To understand if you are actually making money, you must calculate your <strong>Break-Even ROAS</strong>:
                 </p>
                 <div className="my-10 p-8 bg-indigo-600 text-white rounded-[2rem] font-mono text-xl md:text-2xl text-center shadow-xl">
                    1 ÷ Profit Margin = Break-Even ROAS
                 </div>
                 <p>
                    If your product margin is 50%, your Break-Even ROAS is 2x. If your ROAS is 1.5x, you are losing money on every sale even though you are generating revenue.
                 </p>
              </div>
           </div>
        </div>

        {/* Why Break-Even Matters Section */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 blur-3xl -ml-48 -mt-48 rounded-full" />
              <div className="w-full md:w-1/2 space-y-8 relative z-10">
                 <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl w-fit">
                    <Flame size={32} />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                    Why a 3x ROAS Might <br/>Still Be Losing Money.
                 </h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed">
                    Most basic calculators ignore the cost of goods sold (COGS). If your profit margin is only 20%, your Break-Even ROAS is 5x.
                 </p>
                 <p className="text-xl text-indigo-400 font-black">
                    That means a campaign hitting a 3x ROAS is actually burning cash. Our calculator factors in your margins so you can scale ad spend safely.
                 </p>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                 {[
                   { label: 'Revenue', val: '$3,000' },
                   { label: 'Ad Spend', val: '$1,000' },
                   { label: 'COGS (80%)', val: '$2,400' },
                   { label: 'Net Result', val: '-$400', toxic: true },
                 ].map((item, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{item.label}</p>
                      <p className={`text-2xl font-black italic tracking-tight ${item.toxic ? 'text-red-500' : 'text-white'}`}>{item.val}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Ad Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Data-driven answers for digital marketers.</p>
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
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight">Scale Your Paid <br/>Efficiency.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join elite marketers who use financial-first modeling to protect their profits and grow their brands.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Audity My Campaigns <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
