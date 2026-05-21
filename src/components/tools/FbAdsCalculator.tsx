import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  MousePointer2, 
  Target, 
  Calculator, 
  HelpCircle, 
  ChevronDown, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import { toast } from 'sonner';

export default function FbAdsCalculator() {
  const { executeAction, isProcessing } = usePremiumAction();

  const [budget, setBudget] = useState<number>(1000);
  const [cpc, setCpc] = useState<number>(0.85);
  const [targetConvRate, setTargetConvRate] = useState<number>(2.5);
  const [aov, setAov] = useState<number>(120);
  const [margin, setMargin] = useState<number>(40);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    const clicks = cpc > 0 ? budget / cpc : 0;
    const conversions = clicks * (targetConvRate / 100);
    const targetCpa = conversions > 0 ? budget / conversions : 0;

    const breakEvenCpa = aov * (margin / 100);
    const isProfitable = targetCpa <= breakEvenCpa;
    const marginPerUnit = breakEvenCpa - targetCpa;

    const totalRevenue = conversions * aov;
    const totalCogsCalc = conversions * (aov * ((100 - margin) / 100));
    const netProfit = totalRevenue - totalCogsCalc - budget;
    const estRoas = budget > 0 ? totalRevenue / budget : 0;

    const formatFn = (val: number) => Math.round(val).toLocaleString();
    const formatCur = (val: number) => val.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

    return {
      clicks: formatFn(clicks),
      conversions: formatFn(conversions),
      targetCpa: formatCur(targetCpa),
      targetCpaNum: targetCpa,
      breakEvenCpa: formatCur(breakEvenCpa),
      breakEvenCpaNum: breakEvenCpa,
      isProfitable,
      marginPerUnit: formatCur(marginPerUnit),
      totalRevenue: formatCur(totalRevenue),
      netProfit: formatCur(netProfit),
      estRoas: estRoas.toFixed(2) + 'x',
      impressions: formatFn(clicks / 0.015), // Assuming 1.5% CTR
      atc: formatFn(clicks * (targetConvRate / 100) * 2.5), // Assuming ATC is 2.5x conversions
    };
  }, [budget, cpc, targetConvRate, aov, margin]);

  const handleExport = () => {
    executeAction(async (userId) => {
      await DatabaseService.logToolUsage('fb-ads-calculator');
      window.print();
      toast.success('Campaign Projection Exported.');
      return true;
    });
  };

  const faqs = [
    {
      question: "What is a good Facebook Ads CPA?",
      answer: "A 'good' CPA varies wildly by industry. For low-ticket e-commerce, $10-$20 might be target. For high-ticket B2B services, a CPA of $200+ could still be highly profitable. The key is ensuring your CPA is significantly lower than your Customer Lifetime Value (LTV)."
    },
    {
      question: "How do I lower my CPA?",
      answer: "There are two primary levers: CPC and Conversion Rate. Lowering CPC requires better ad creative (higher CTR) and audience targeting. Increasing landing page conversion requires better UX, faster load times, and a more compelling offer."
    },
    {
      question: "Why does my CPA increase over time?",
      answer: "This is often due to 'Ad Fatigue' or 'Audience Saturation'. As the same group of people sees your ad multiple times without converting, your CTR drops, which increases your CPC, and ultimately your CPA."
    }
  ];

  const SliderInput = ({ label, value, setter, min, max, step, prefix = '', suffix = '' }: any) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        <div className="relative group w-24">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{prefix}</span>}
          <input 
            type="number" 
            value={value} 
            onChange={(e) => setter(parseFloat(e.target.value) || 0)}
            className={`w-full py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm ${prefix ? 'pl-7' : 'pl-3'} pr-1`}
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{suffix}</span>}
        </div>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setter(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-blue-100"
        >
          <Target size={12} /> Media Buying Optimization
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Facebook Ads <span className="text-blue-600">CPA</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Stop guessing your campaign performance. Calculate your acquisition costs and conversion targets with pinpoint precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                   <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Campaign Inputs</h3>
             </div>

             <div className="space-y-6">
                <SliderInput 
                  label="Total Monthly Budget" 
                  value={budget} 
                  setter={setBudget} 
                  min={100} max={100000} step={100} 
                  prefix="$" 
                />
                
                <SliderInput 
                  label="Average CPC" 
                  value={cpc} 
                  setter={setCpc} 
                  min={0.10} max={10} step={0.05} 
                  prefix="$" 
                />

                <SliderInput 
                  label="Target Conversion Rate" 
                  value={targetConvRate} 
                  setter={setTargetConvRate} 
                  min={0.1} max={20} step={0.1} 
                  suffix="%" 
                />
             </div>

             <div className="pt-8 mt-8 border-t border-slate-100 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">Unit Economics</h4>
                
                <SliderInput 
                  label="Average Order Value (AOV)" 
                  value={aov} 
                  setter={setAov} 
                  min={10} max={1000} step={5} 
                  prefix="$" 
                />

                <SliderInput 
                  label="Product Margin" 
                  value={margin} 
                  setter={setMargin} 
                  min={5} max={100} step={1} 
                  suffix="%" 
                />
             </div>
          </section>
        </div>

        {/* Dashboard Column */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
          <section className="bg-slate-900 text-white rounded-[3.5rem] p-4 md:p-6 shadow-2xl overflow-hidden group flex-1 flex flex-col">
             <div className="relative flex-1 bg-slate-950/50 rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-12 flex-1">
                   {/* Target CPA Hero */}
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Estimated Target CPA</p>
                      <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
                         <span className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-br from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            {stats.targetCpa}
                         </span>
                      </div>
                      
                      {/* Progress bar to break even */}
                      <div className="w-full bg-slate-800 h-2 rounded-full mt-6 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 \${stats.isProfitable ? 'bg-emerald-500' : 'bg-red-500'}`} 
                          style={{ width: `\${Math.min((stats.targetCpaNum / (stats.breakEvenCpaNum || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                         <span>$0</span>
                         <span>Break-Even: {stats.breakEvenCpa}</span>
                      </div>
                   </div>

                   {/* Badges */}
                   <div>
                     {stats.isProfitable ? (
                       <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm">
                         ✅ PROFITABLE: {stats.marginPerUnit} Margin per Unit
                       </div>
                     ) : (
                       <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 font-bold text-sm animate-pulse">
                         🚨 UNPROFITABLE CAMPAIGN
                       </div>
                     )}
                   </div>

                   {/* Grid Expansion */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Est. Revenue</p>
                         <p className="text-2xl font-black text-white">{stats.totalRevenue}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Target ROAS</p>
                         <p className="text-2xl font-black text-blue-400">{stats.estRoas}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Net Profit</p>
                         <p className={`text-2xl font-black \${stats.isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                           {stats.netProfit}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                   <button 
                     onClick={handleExport}
                     className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-colors shadow-lg shadow-blue-900/20"
                   >
                     Download Campaign Projection (PDF)
                   </button>
                </div>
             </div>
          </section>

          {/* Visual Funnel */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl mt-8 w-full shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 px-2">Traffic Funnel Overview</h3>
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center bg-slate-50 py-5 px-2 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impressions (Est.)</span>
                   <span className="text-2xl font-black text-slate-900">{stats.impressions}</span>
                </div>
                <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={24} />
                <div className="text-center md:hidden"><ChevronDown size={16} className="text-slate-300"/></div>
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center bg-slate-50 py-5 px-2 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clicks</span>
                   <span className="text-2xl font-black text-blue-600">{stats.clicks}</span>
                </div>
                <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={24} />
                <div className="text-center md:hidden"><ChevronDown size={16} className="text-slate-300"/></div>
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center bg-slate-50 py-5 px-2 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Add to Carts</span>
                   <span className="text-2xl font-black text-slate-900">{stats.atc}</span>
                </div>
                <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={24} />
                <div className="text-center md:hidden"><ChevronDown size={16} className="text-slate-300"/></div>
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center bg-emerald-50 py-5 px-2 rounded-2xl border border-emerald-100">
                   <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Purchases</span>
                   <span className="text-2xl font-black text-emerald-600">{stats.conversions}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Stop guessing your CPA.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <MousePointer2 size={40} className="text-blue-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Reducing your CPC by just $0.20 or increasing your landing page conversion by 1% drastically lowers your Cost Per Acquisition. Most media buyers focus on the wrong metrics; the real profit is hidden in micro-optimizations of your conversion funnel.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={14} className="text-blue-600" /> Funnel Efficiency
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Visualise how small changes at the top of the funnel result in massive savings on your final CPA.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Info size={14} className="text-emerald-600" /> ROI Forecasting
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Use our estimates to set realistic benchmarks for your creative team and landing page designers.
                       </p>
                    </div>
                 </div>
                 <p>
                    Whether you are scaling to $10k/day or just starting with your first $500 testing budget, understanding the math of CPA is non-negotiable. This tool provides the foundational numbers needed to defend your marketing spend to any CFO.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Media Buying FAQ</h2>
              <p className="text-slate-500 font-medium">Expert insights into Facebook Ads math and optimization strategy.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden \${openFaq === idx ? 'shadow-xl shadow-blue-200/50 border-blue-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-blue-400" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`text-slate-400 transition-transform \${openFaq === idx ? 'rotate-180' : ''}`} />
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
        <div className="bg-blue-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Maximize Your <br/>Ad Returns.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of media buyers who use our calculators to optimize their performance and scale their spend.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-blue-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your Funnel <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
