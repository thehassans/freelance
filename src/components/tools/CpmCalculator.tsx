import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hash, 
  DollarSign, 
  Eye, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Info,
  Calculator,
  TrendingUp,
  MousePointer2
} from 'lucide-react';

export default function CpmCalculator() {
  const [spend, setSpend] = useState<string>('');
  const [impressions, setImpressions] = useState<string>('');
  const [cpm, setCpm] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'spend' | 'impressions' | 'cpm' | null>(null);
  const [solved, setSolved] = useState<'spend' | 'impressions' | 'cpm' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const s = parseFloat(spend);
    const i = parseFloat(impressions);
    const c = parseFloat(cpm);

    // Logic: Solve for the third if two are present
    if (!isNaN(s) && !isNaN(i) && lastChanged !== 'cpm') {
      const result = (s / i) * 1000;
      setCpm(result.toFixed(2));
      setSolved('cpm');
    } else if (!isNaN(c) && !isNaN(i) && lastChanged !== 'spend') {
      const result = (c * i) / 1000;
      setSpend(result.toFixed(2));
      setSolved('spend');
    } else if (!isNaN(s) && !isNaN(c) && lastChanged !== 'impressions') {
      const result = (s / c) * 1000;
      setImpressions(result.toFixed(0));
      setSolved('impressions');
    }
  }, [spend, impressions, cpm, lastChanged]);

  const handleInputChange = (field: 'spend' | 'impressions' | 'cpm', value: string) => {
    setLastChanged(field);
    setSolved(null);
    if (field === 'spend') setSpend(value);
    if (field === 'impressions') setImpressions(value);
    if (field === 'cpm') setCpm(value);
  };

  const faqs = [
    {
      question: "What is CPM and why does it matter?",
      answer: "CPM (Cost Per Mille) represents the cost of 1,000 impressions. It is the foundational metric of media buying because it allows you to compare the cost efficiency of different platforms (e.g., Facebook vs TV) regardless of total budget or scale."
    },
    {
      question: "Why is my Facebook CPM so high?",
      answer: "Higher CPMs are usually caused by three factors: 1. Intense competition (e.g., Q4 holiday season), 2. Narrow audience targeting (niche audiences cost more), or 3. Low ad relevance (FB charges more if people hide your ads or if engagement is low)."
    },
    {
      question: "How do I lower my CPM?",
      answer: "Broaden your targeting, improve your ad creative to increase engagement (Lowering the frequency), and test different placements. Higher engagement signals to the platform that your ad is valuable, which often rewards you with a lower entry price into the auction."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-slate-200"
        >
          <Hash size={12} /> Unit Cost Optimization
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Ultimate <span className="text-slate-600">CPM</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          The foundational metric of media buying. Solve for Spend, Impressions, or CPM automatically as you type.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-4">Total Ad Spend ($)</label>
             <div className={`relative transition-all duration-500 rounded-[2.5rem] border ${solved === 'spend' ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-200/50 scale-105' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                <input 
                  type="number" 
                  value={spend} 
                  onChange={(e) => handleInputChange('spend', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-14 pr-10 py-10 bg-transparent rounded-[2.5rem] font-black text-3xl md:text-4xl text-slate-900 focus:outline-none placeholder:text-slate-200 transition-all font-display"
                />
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-4">Total Impressions</label>
             <div className={`relative transition-all duration-500 rounded-[2.5rem] border ${solved === 'impressions' ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-200/50 scale-105' : 'bg-white border-slate-200 shadow-sm'}`}>
                <input 
                  type="number" 
                  value={impressions} 
                  onChange={(e) => handleInputChange('impressions', e.target.value)}
                  placeholder="1,000,000"
                  className="w-full px-10 py-10 bg-transparent rounded-[2.5rem] font-black text-3xl md:text-4xl text-slate-900 focus:outline-none placeholder:text-slate-200 transition-all font-display"
                />
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-4">CPM (Cost Per Mille)</label>
             <div className={`relative transition-all duration-500 rounded-[2.5rem] border ${solved === 'cpm' ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-200/50 scale-105' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                <input 
                  type="number" 
                  value={cpm} 
                  onChange={(e) => handleInputChange('cpm', e.target.value)}
                  placeholder="10.00"
                  className="w-full pl-14 pr-10 py-10 bg-transparent rounded-[2.5rem] font-black text-3xl md:text-4xl text-slate-900 focus:outline-none placeholder:text-slate-200 transition-all font-display"
                />
             </div>
          </div>
        </div>

        {/* Dashboard/Helper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32 items-center">
           <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32 rounded-full" />
              <div className="relative z-10 space-y-6">
                 <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                    <Zap size={24} />
                 </div>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Bi-Directional Logic</p>
                 <h2 className="text-3xl font-black tracking-tight leading-tight">Enter any two values to solve for the target metric.</h2>
                 <p className="text-slate-400 font-medium">Unlike basic calculators, ours allows you to work backwards from your target CPM to find your required budget or reach.</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex items-start gap-6 group hover:border-emerald-200 transition-colors">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <TrendingUp size={20} />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900">Market Benchmarking</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">Compare your current CPM against industry averages to see if you are overpaying for your attention.</p>
                 </div>
              </div>

              <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex items-start gap-6 group hover:border-emerald-200 transition-colors">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <MousePointer2 size={20} />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900">Scalability Testing</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">Calculate the required budget to achieve the impressions needed for your next major campaign launch.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">The foundational metric of media buying.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Eye size={40} className="text-slate-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    The CPM formula is simple: (Total Spend / Impressions) * 1,000. However, the strategy behind it is complex. Your CPM dictates your Cost Per Conversion; if your CPM doubles, your CPA doubles, assuming your funnel efficiency remains the same.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Calculator size={14} className="text-slate-600" /> Bi-Directional Logic
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Work forward or backwards. Solve for spend, impressions, or CPM as your campaign variables shift.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Info size={14} className="text-blue-600" /> Platform Insights
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Understand why your CPM fluctuates based on audience saturation, ad fatigue, and keyword competition.
                       </p>
                    </div>
                 </div>
                 <p>
                    Professional media buyers use CPM to monitor the 'ad auction heat'. If a CPM spikes without a corresponding increase in conversion, it's a signal to refresh your creatives or pivot your targeting strategy immediately.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">CPM Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Essential media buying math for modern digital marketers.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-slate-200/50 border-slate-300' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-slate-400" />
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
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Master Your <br/>Media Buy.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of advertising professionals who use our data to defend their spend and scale their campaigns.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-slate-900 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your CPM <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
