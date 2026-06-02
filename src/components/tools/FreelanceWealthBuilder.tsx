import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  Info,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  PieChart,
  Calculator,
  CheckCircle2,
  BarChart3,
  MousePointer2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';

export default function FreelanceWealthBuilder() {
  const [initialCapital, setInitialCapital] = useState<string>('10000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('1000');
  const [annualRate, setAnnualRate] = useState<number>(8);
  const [years, setYears] = useState<number>(10);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Enterprise features
  const [adjustInflation, setAdjustInflation] = useState<boolean>(false);
  const [exportCredits, setExportCredits] = useState<number>(5);

  const data = useMemo(() => {
    const P = parseFloat(initialCapital) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const r = annualRate / 100 / 12;
    
    const chartData = [];
    
    for (let y = 0; y <= years; y++) {
      const months = y * 12;
      
      // FV of Principal
      const principalFV = P * Math.pow(1 + r, months);
      
      // FV of Monthly Contributions
      const seriesFV = months === 0 ? 0 : PMT * ((Math.pow(1 + r, months) - 1) / r);
      
      const totalValueRaw = principalFV + seriesFV;
      const currentInvestedRaw = P + (PMT * months);
      const interestEarnedRaw = Math.max(0, totalValueRaw - currentInvestedRaw);

      // Discount by 3% compounded annually over the selected Time Horizon
      const discountFactor = adjustInflation ? Math.pow(1 + 0.03, y) : 1;
      const totalValue = totalValueRaw / discountFactor;
      const currentInvested = currentInvestedRaw / discountFactor;
      const interestEarned = interestEarnedRaw / discountFactor;

      chartData.push({
        year: y,
        invested: Math.round(currentInvested),
        interest: Math.round(interestEarned),
        total: Math.round(totalValue)
      });
    }

    const final = chartData[chartData.length - 1];

    // Math Logic: Multiply Final Portfolio Value by 0.04 (4% Safe Withdrawal Rule), then divide by 12.
    const passiveIncome = (final.total * 0.04) / 12;

    return {
      chart: chartData,
      totalValue: final.total,
      totalInvested: final.invested,
      totalInterest: final.interest,
      roi: final.totalInvested > 0 ? ((final.total - final.totalInvested) / final.totalInvested * 100).toFixed(1) : '0',
      passiveIncome
    };
  }, [initialCapital, monthlyContribution, annualRate, years, adjustInflation]);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  const formatFullCurrency = (val: number) => {
    return `$${Math.round(val).toLocaleString()}`;
  };

  const handleExport = () => {
    if (exportCredits > 0) {
      setExportCredits(prev => prev - 1);
      window.print();
      toast.success('Wealth Roadmap Exported');
    } else {
      toast.error('Monthly export limit reached! Upgrade to Pro.');
    }
  };

  const faqs = [
    {
      question: "How does compound interest work?",
      answer: "Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. In simple terms: you earn interest on your initial money, and then you earn interest on that interest, creating an exponential growth curve over time."
    },
    {
      question: "What is a realistic annual return?",
      answer: "Historically, the S&P 500 has averaged an annual return of approximately 7% to 10% before inflation. While market performance fluctuates yearly, this range is widely considered a realistic benchmark for long-term passive index fund investing."
    },
    {
      question: "How often is this interest compounded?",
      answer: "This calculator assumes monthly compounding. This reflects the standard practice of monthly dividend reinvestment and monthly contribution cycles common for freelance profit distributions to investment accounts."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Print-specific style override */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: #0f172a !important; /* Keep slate dark-theme bg visible in print if supported */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .recharts-responsive-container {
            width: 100% !important;
            height: 350px !important;
          }
        }
      `}} />

      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-200">
            FREEMIUM TOOL
          </span>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100"
          >
            <Zap size={12} /> Wealth Strategy Engine
          </motion.div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Freelance <span className="text-emerald-600">Wealth</span> Builder
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Stop relying on your next invoice. Visualize the exponential growth of your agency profits through disciplined compounding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
        {/* Left Input Column (Hidden on print) */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6 print:hidden">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                   <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Parameters</h3>
             </div>

             <div className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Current Cash Reserves ($)</label>
                   <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                      <input 
                        type="number" 
                        value={initialCapital} 
                        onChange={(e) => setInitialCapital(e.target.value)}
                        placeholder="10,000"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Monthly Reinvestment ($)</label>
                   <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                      <input 
                        type="number" 
                        value={monthlyContribution} 
                        onChange={(e) => setMonthlyContribution(e.target.value)}
                        placeholder="1,000"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Expected Annual Return</label>
                     <span className="text-emerald-600 font-black text-sm">{annualRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    step="0.5" 
                    value={annualRate} 
                    onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">
                     <span>Conservative (4%)</span>
                     <span>Bullish (12%)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Time Horizon (Years)</label>
                     <span className="text-emerald-600 font-black text-sm">{years} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="40" 
                    value={years} 
                    onChange={(e) => setYears(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">
                     <span>1 Year</span>
                     <span>40 Years</span>
                  </div>
                </div>

                {/* Inflation Adjust Toggle */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Adjust for Inflation (3% Avg)</span>
                    <button
                      type="button"
                      onClick={() => setAdjustInflation(!adjustInflation)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        adjustInflation ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          adjustInflation ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">Discount total portfolio and interest earned by 3% compounded annually over the selected time horizon.</p>
                </div>
             </div>
          </section>
        </div>

        {/* Right Dashboard & Chart Column (Occupies w-full on print) */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6 print:w-full">
          <section className="bg-slate-900 text-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group print:p-6 print:border-none print:shadow-none print:bg-slate-900">
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none print:hidden" />
             
             <div className="relative z-10">
                {/* 3-Column Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Total Portfolio Value</p>
                      <p className="text-4xl md:text-5xl font-black font-display tracking-tighter text-white">
                         {formatCurrency(data.totalValue)}
                      </p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Total Invested</p>
                      <p className="text-4xl md:text-5xl font-black font-display tracking-tighter text-slate-300">
                         {formatCurrency(data.totalInvested)}
                      </p>
                   </div>
                   <div className="relative group/interest">
                      <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                        <TrendingUp size={12} /> Interest Earned
                      </p>
                      <p className="text-4xl md:text-5xl font-black font-display tracking-tighter text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                         {formatCurrency(data.totalInterest)}
                      </p>
                      <div className="absolute -right-2 top-0 px-2 py-1 bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-[10px] font-black text-emerald-400">
                         +{data.roi}%
                      </div>
                   </div>
                </div>

                {/* passive income card */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 print:bg-emerald-950/20">
                   <div className="space-y-1 text-center md:text-left">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Estimated Monthly Passive Income</p>
                      <p className="text-3xl font-black text-white">
                         {formatFullCurrency(data.passiveIncome)} <span className="text-slate-400 text-sm font-medium">/ month in passive income</span>
                      </p>
                   </div>
                   <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-wider">
                         4% Safe Withdrawal Rule
                      </span>
                   </div>
                </div>

                {/* Stacked Area Chart */}
                <div className="h-[350px] w-full bg-slate-950/40 rounded-[2.5rem] p-6 border border-white/5 relative group/chart">
                   <div className="absolute top-6 left-10 flex items-center gap-6 z-20">
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-slate-700" />
                         <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Invested</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-emerald-400" />
                         <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Interest Growth</span>
                      </div>
                   </div>
                   
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.chart} margin={{ top: 60, right: 20, left: 0, bottom: 0 }}>
                         <defs>
                            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#334155" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#334155" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                               <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                         <XAxis 
                           dataKey="year" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: '#475569', fontSize: 10, fontWeight: 800}}
                           dy={10}
                           label={{ value: 'YEARS', position: 'insideBottomRight', offset: -10, fontSize: 8, fontWeight: 900, fill: '#475569' }}
                         />
                         <YAxis 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: '#475569', fontSize: 10, fontWeight: 800}}
                           tickFormatter={(val) => `$${val > 999 ? (val/1000).toFixed(0) + 'k' : val}`}
                         />
                         <Tooltip 
                           content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                 return (
                                   <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-2xl">
                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Year {payload[0].payload.year}</p>
                                      <div className="space-y-1">
                                         <p className="text-xs font-bold text-white flex items-center justify-between gap-8">
                                            Invested: <span className="font-black tabular-nums">${payload[0].value.toLocaleString()}</span>
                                         </p>
                                         <p className="text-xs font-bold text-emerald-400 flex items-center justify-between gap-8">
                                            Interest: <span className="font-black tabular-nums">+${payload[1].value.toLocaleString()}</span>
                                         </p>
                                         <div className="pt-2 mt-2 border-t border-white/10">
                                            <p className="text-sm font-black text-white flex items-center justify-between gap-8">
                                               Total: <span className="tabular-nums">${payload[0].payload.total.toLocaleString()}</span>
                                            </p>
                                         </div>
                                      </div>
                                   </div>
                                 );
                              }
                              return null;
                           }}
                         />
                         <Area 
                           type="monotone" 
                           dataKey="invested" 
                           stackId="1" 
                           stroke="#475569" 
                           fillOpacity={1} 
                           fill="url(#colorInvested)" 
                           strokeWidth={2}
                         />
                         <Area 
                           type="monotone" 
                           dataKey="interest" 
                           stackId="1" 
                           stroke="#34d399" 
                           fillOpacity={1} 
                           fill="url(#colorInterest)" 
                           strokeWidth={3}
                         />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                {/* Export Button below chart */}
                <button 
                  onClick={handleExport}
                  className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-990/20 print:hidden"
                >
                  Download Wealth Roadmap (PDF) (⚡ {exportCredits} Left)
                </button>
             </div>
          </section>
        </div>
      </div>

      {/* FAQs Section (Hidden on print) */}
      <section className="mt-32 space-y-24 print:hidden">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Your agency isn't your only asset.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Briefcase size={40} className="text-emerald-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Freelancers and agency owners lack corporate 401(k) matching. Your wealth is built on your margins. Use this calculator to see how sweeping just 10% of your monthly retainer profit into an index fund can build a multi-million dollar exit portfolio.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <TrendingUp size={14} className="text-emerald-600" /> Exponential Curves
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Visualise the "Inflection Point" where your interest begins to outpace your monthly contributions.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Clock size={14} className="text-blue-600" /> Time Diversification
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         See the drastic difference and "opportunity cost" of waiting just 5 years to start your reinvestment engine.
                       </p>
                    </div>
                 </div>
                 <p>
                    Successful founders treat their personal balance sheet as a separate entity from their business. By automating your reinvestment, you decouple your financial future from the volatility of client cycles and market demand.
                 </p>
              </div>
           </div>
        </div>

        {/* Big Info Section */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 blur-3xl -ml-48 -mt-48 rounded-full" />
              <div className="w-full md:w-1/2 space-y-8 relative z-10">
                 <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                    <PieChart size={32} />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-balance">
                     The Freedom of <br/>Passive Compounding.
                  </h2>
                  <p className="text-xl text-slate-400 font-medium leading-relaxed">
                     Once your portfolio hits its "Critical Mass," the interest earned will exceed your monthly agency expenses, effectively achieving retirement.
                  </p>
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
                        <CheckCircle2 size={18} /> Monthly Compounding Simulations
                     </div>
                     <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
                        <CheckCircle2 size={18} /> Asset-Class Benchmarking (4-12%)
                     </div>
                  </div>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                 {[
                   { label: 'Compounding', val: 'Monthly' },
                   { label: 'Growth Cap', val: 'Unlimited' },
                   { label: 'Logic', val: 'Compound' },
                   { label: 'Security', val: 'Privacy-First' },
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
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Investment Strategy FAQ</h2>
              <p className="text-slate-500 font-medium font-sans">Critical insights into wealth building for modern founders.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-emerald-200/50 border-emerald-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
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

      {/* CTA Footer (Hidden on print) */}
      <section className="mt-32 max-w-7xl mx-auto px-4 print:hidden">
        <div className="bg-emerald-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Fund Your <br/>Final Freedom.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of founders who use data-driven insights to decouple their wealth from their working hours.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-emerald-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Start Investing <MousePointer2 size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Structured SEO Section (Strictly isolated at bottom and hidden on print) */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
        <h2>What is the Freelance Wealth Builder?</h2>
        <p>
          The Freelance Wealth Builder is an advanced financial projection tool designed specifically for independent contractors, agency owners, and solopreneurs. It calculates how consistent profit reinvestment and compound interest can grow your net worth over time.
        </p>
        <p>
          Unlike traditional retirement calculators, this tool is tailored to the variable income of freelance businesses, helping you model aggressive reinvestment strategies to achieve financial independence faster.
        </p>

        <h2>Why Freelancers Need a Dedicated Wealth Strategy</h2>
        <p>
          Running a freelance business often means dealing with the &ldquo;feast or famine&rdquo; income cycle. Without an employer-sponsored 401(k) or pension, independent professionals are entirely responsible for their own long-term wealth accumulation.
        </p>
        <p>
          A visual wealth strategy helps you:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Transition from active income to passive income</li>
          <li>Understand the mathematical power of compound interest</li>
          <li>Set realistic monthly profit-retention goals</li>
          <li>Plan for early retirement or a business exit</li>
          <li>Protect your purchasing power against long-term inflation</li>
        </ul>

        <h2>Key Features of the Wealth Strategy Engine</h2>

        <h3>Compound Growth Visualization</h3>
        <p>
          See exactly how your money multiplies. The visual graph separates your hard-earned principal investments from the exponential growth of your compound interest over time.
        </p>

        <h3>Inflation-Adjusted Forecasting</h3>
        <p>
          A million dollars today won't have the same purchasing power in 20 years. Our tool allows you to toggle a historical 3% inflation adjustment to reveal the real future value of your portfolio.
        </p>

        <h3>Safe Withdrawal Rate (F.I.R.E. Target)</h3>
        <p>
          Building a large portfolio is great, but what does it mean for your daily life? The engine utilizes the industry-standard 4% Rule to translate your final portfolio value into an estimated monthly passive income stream.
        </p>

        <h2>How to Calculate Your Compound Growth</h2>
        <p>
          To get the most accurate projection, you need to input four key variables:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Current Cash Reserves:</strong> The initial capital you already have invested in the market or set aside for long-term growth.</li>
          <li><strong>Monthly Reinvestment:</strong> The exact dollar amount of your freelance profits that you commit to investing every single month, regardless of market conditions.</li>
          <li><strong>Expected Annual Return:</strong> Your anticipated portfolio growth rate. A conservative estimate is usually 4-6%, while a more aggressive, historically S&P 500-aligned estimate sits around 8-10%.</li>
          <li><strong>Time Horizon:</strong> The number of years you plan to let this money grow untouched.</li>
        </ul>

        <h2>The Power of the 4% Rule</h2>
        <p>
          The goal of freelance wealth building isn't just to accumulate a large number; it is to buy back your time.
        </p>
        <p>
          The 4% Rule is a widely accepted retirement principle suggesting you can safely withdraw 4% of your total invested portfolio every year (adjusted for inflation) without ever running out of money. By visualizing this monthly passive income, you can clearly define your exact &ldquo;Financial Independence&rdquo; number.
        </p>

        <h2>Final Thoughts</h2>
        <p>
          The Freelance Wealth Builder bridges the gap between today's invoices and tomorrow's financial freedom. By committing to disciplined monthly reinvestment and understanding the mechanics of compound growth, you can transform your active freelance grind into a self-sustaining wealth engine.
        </p>
      </section>
    </div>
  );
}
