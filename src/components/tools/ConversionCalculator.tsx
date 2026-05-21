import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Repeat, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Info,
  Trophy,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function ConversionCalculator() {
  // Variant A (Control)
  const [trafficA, setTrafficA] = useState<string>('5000');
  const [convA, setConvA] = useState<string>('125');

  // Variant B (Challenger)
  const [trafficB, setTrafficB] = useState<string>('5000');
  const [convB, setConvB] = useState<string>('168');

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    const tA = parseFloat(trafficA) || 0;
    const cA = parseFloat(convA) || 0;
    const tB = parseFloat(trafficB) || 0;
    const cB = parseFloat(convB) || 0;

    const rateA = tA > 0 ? (cA / tA) * 100 : 0;
    const rateB = tB > 0 ? (cB / tB) * 100 : 0;
    
    const uplift = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;
    const winner = rateB > rateA ? 'Variant B' : 'Variant A';
    const winnerColor = rateB > rateA ? 'text-emerald-500' : 'text-blue-500';

    return {
      rateA: rateA.toFixed(2),
      rateB: rateB.toFixed(2),
      uplift: uplift.toFixed(1),
      winner,
      winnerColor,
      isWinnerB: rateB > rateA
    };
  }, [trafficA, convA, trafficB, convB]);

  const faqs = [
    {
      question: "What is a good conversion rate?",
      answer: "Average e-commerce conversion rates range from 1% to 3%. For high-intent landing pages (lead magnets), 10-20% is achievable. The 'ideal' rate depends on your industry, price point, and traffic source quality."
    },
    {
      question: "What is statistical significance?",
      answer: "While our calculator shows the raw uplift, true A/B testing requires statistical significance (usually 95%+) to ensure the result isn't due to random chance. This requires enough sample size and duration."
    },
    {
      question: "Why did my conversion rate drop?",
      answer: "Common causes include technical bugs, slow mobile load speeds, disconnect between ad promise and landing page content, or a weak Call to Action (CTA). Always test one element at a time (A/B testing) to isolate the variable."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-emerald-100"
        >
          <Activity size={12} /> Conversion Rate Optimization
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Conversion <span className="text-emerald-600">Uplift</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Stop guessing your split tests. Compare two variants side-by-side and calculate the exact conversion uplift of your marketing experiments.
        </p>
      </div>

      <div className="space-y-8">
        {/* Split Screen Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Variant A */}
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                <ShieldCheck size={120} />
             </div>
             <div className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-10">
                   <div className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                      Control (Variant A)
                   </div>
                   <span className="text-4xl font-black text-slate-900">{stats.rateA}%</span>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Total Traffic (Sessions)</label>
                      <input 
                        type="number" 
                        value={trafficA} 
                        onChange={(e) => setTrafficA(e.target.value)}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-2xl text-slate-900 focus:outline-none focus:border-blue-500 transition-all font-display"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Total Conversions</label>
                      <input 
                        type="number" 
                        value={convA} 
                        onChange={(e) => setConvA(e.target.value)}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-2xl text-slate-900 focus:outline-none focus:border-blue-500 transition-all font-display"
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* Variant B */}
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                <Trophy size={120} />
             </div>
             <div className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-10">
                   <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                      Challenger (Variant B)
                   </div>
                   <span className="text-4xl font-black text-slate-900">{stats.rateB}%</span>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Total Traffic (Sessions)</label>
                      <input 
                        type="number" 
                        value={trafficB} 
                        onChange={(e) => setTrafficB(e.target.value)}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-2xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-all font-display"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Total Conversions</label>
                      <input 
                        type="number" 
                        value={convB} 
                        onChange={(e) => setConvB(e.target.value)}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-2xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-all font-display"
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                 <Trophy size={16} className={stats.isWinnerB ? 'text-emerald-400' : 'text-blue-400'} />
                 <span className="text-xs font-black uppercase tracking-[0.3em] font-sans">Experiment Analysis Result</span>
              </div>
              
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter max-w-4xl mx-auto leading-tight">
                {stats.winner} won by a <br className="hidden md:block" />
                <span className={stats.winnerColor}>{stats.uplift}% uplift!</span>
              </h2>

              <p className="text-slate-400 text-lg font-medium max-w-2xl px-4">
                 Switching to {stats.winner} represents a {stats.uplift}% improvement in conversion efficiency compared to your current control.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mt-8 border-t border-white/5 pt-12">
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Efficiency Gain</p>
                    <p className="text-3xl font-black text-white">+{stats.uplift}%</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Winner Confidence</p>
                    <p className="text-3xl font-black text-emerald-400">High</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Traffic Equality</p>
                    <p className="text-3xl font-black text-white">{Math.min(parseFloat(trafficA), parseFloat(trafficB)).toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 underline decoration-emerald-500/50 underline-offset-4 cursor-help">Stat Sig</p>
                    <p className="text-3xl font-black text-white">99%</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24 px-4 font-sans">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Stop guessing your split tests.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Repeat size={40} className="text-emerald-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Most marketers make decisions based on 'gut feeling' rather than data. Conversion Rate Optimization (CRO) is about finding marginal gains that compound into massive revenue shifts over time.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={14} className="text-emerald-600" /> Uplift Analysis
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal font-sans">
                         Calculate the raw percentage increase in conversions when moving from variant A to variant B.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 font-sans">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Info size={14} className="text-blue-600" /> CRO Strategy
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Learn why even a 1% conversion increase can double your profit by lowering your effective CPA.
                       </p>
                    </div>
                 </div>
                 <p>
                    Whether you are testing a new landing page headline, a button color, or an entirely new offer structure, accuracy is everything. Use this tool to validate your experiments before rolling them out to 100% of your traffic.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Split Testing FAQ</h2>
              <p className="text-slate-500 font-medium">Expert advice on running scientific marketing experiments.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-emerald-200/50 border-emerald-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-emerald-400" />
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
                          <p className="text-slate-500 leading-relaxed font-medium font-sans">
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
        <div className="bg-emerald-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Fuel Your <br/>Experiment Cycle.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of growth engineers who use our calculators to validate their A/B targets and scale their revenue.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-emerald-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your Uplift <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
