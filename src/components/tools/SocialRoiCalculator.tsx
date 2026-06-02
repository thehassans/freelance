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
import { toast } from 'sonner';

export default function SocialRoiCalculator() {
  const [adSpend, setAdSpend] = useState<string>('3000');
  const [agencyFee, setAgencyFee] = useState<string>('2000');
  const [leadsGenerated, setLeadsGenerated] = useState<string>('150');
  const [closeRate, setCloseRate] = useState<number>(20);
  const [ltv, setLtv] = useState<string>('5000');
  const [exportCredits, setExportCredits] = useState(5);

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
      isPositive: roi > 0,
      rawCac: cac,
      rawLtv: valLtv
    };
  }, [adSpend, agencyFee, leadsGenerated, closeRate, ltv]);

  const ratioVal = useMemo(() => {
    return stats.rawCac > 0 ? stats.rawLtv / stats.rawCac : 0;
  }, [stats]);

  const ratioRefFormatted = useMemo(() => {
    if (ratioVal === 0) return '0:1';
    const formatted = ratioVal.toFixed(1).replace(/\.0$/, '');
    return `${formatted}:1`;
  }, [ratioVal]);

  const handleExportPDF = () => {
    if (exportCredits > 0) {
      setExportCredits(prev => prev - 1);
      toast.success('ROI Report Exported');
      window.print();
    } else {
      toast.error('Monthly export limit reached! Upgrade to Pro.');
    }
  };

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
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100"
          >
            <Building2 size={12} /> Strategic CFO Framework
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100"
          >
            ⚡ FREEMIUM TOOL
          </motion.div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Social ROI <span className="text-rose-600">(LTV)</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Defend your social media retainer. Calculate the true Lifetime Value impact of your social leads to prove long-term profitability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6 print:hidden">
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
        <div className="lg:col-span-12 xl:col-span-7 print:w-full print:col-span-12">
          <section className="bg-slate-950 text-white rounded-[3.5rem] p-4 md:p-6 shadow-2xl overflow-hidden group h-full flex flex-col border border-white/5 print:w-full print:p-0 print:border-none print:bg-slate-950">
             <div className="relative flex-1 bg-slate-900/50 rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden print:w-full print:border-none print:shadow-none print:bg-slate-950">
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
                      <div className="overflow-hidden min-w-0">
                         <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-4">Total Lifetime Value Created</p>
                         <p className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight break-words min-w-0 text-white drop-shadow-[0_0_20px_rgba(244,63,94,0.1)]">
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

                   <div className="flex items-center gap-4 flex-wrap font-sans">
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                         <CheckCircle2 size={12} className="text-emerald-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stats.customers} New Customers</span>
                      </div>
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                         <Heart size={12} className="text-pink-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retention Optimized</span>
                      </div>
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                         <TrendingUp size={12} className={ratioVal >= 3 ? "text-emerald-400" : "text-rose-500"} />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${ratioVal >= 3 ? "text-emerald-400" : "text-rose-405"}`}>
                            LTV:CAC Ratio: {ratioRefFormatted}
                         </span>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/5 print:hidden">
                      <button 
                        onClick={handleExportPDF}
                        className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2"
                      >
                         Export ROI Report (PDF) (⚡ {exportCredits} Left)
                      </button>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>

      {/* Strictly Isolated SEO Content Section */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6 font-sans">What is a Social ROI & LTV Calculator?</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-8">
          The Social ROI (Lifetime Value) Calculator is a strategic financial tool designed for marketing agencies, freelancers, and brand owners. It moves beyond front-end vanity metrics (like likes and clicks) to calculate the true, long-term financial impact of a social media marketing campaign.
        </p>
        <p className="text-slate-600 leading-relaxed font-medium mb-8 font-sans">
          By factoring in Customer Lifetime Value (LTV) rather than just the initial purchase value, this tool helps marketers prove the actual profitability of their lead generation efforts and defend their monthly retainers.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6 font-sans">The Problem with Traditional ROI</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-4">
          Traditional Return on Ad Spend (ROAS) only looks at the immediate revenue generated from an ad click. If you spend $100 to acquire a customer who buys a $50 product, traditional math says you lost money.
        </p>
        <p className="text-slate-600 leading-relaxed font-medium mb-8 font-sans">
          However, if that customer stays loyal for three years and spends $5,000 over their lifetime, that $100 acquisition cost is actually a highly profitable investment. This calculator reveals that hidden profit.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6 font-sans">Key Metrics Explained</h2>
        
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">Total Marketing Cost</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              This is your fully-loaded investment. It combines your raw Monthly Ad Spend paid to networks (like Facebook or LinkedIn) with the Agency Fee or retainer paid to the team managing the campaigns.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">CAC (Customer Acquisition Cost)</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              The total marketing cost divided by the actual number of new customers acquired. This represents exactly how much it costs to buy a single paying customer.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">Sales Close Rate</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Not every lead becomes a customer. By inputting your sales team's close rate, the calculator bridges the gap between marketing (leads generated) and sales (deals closed), ensuring your ROI is based on actual revenue, not just email captures.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans">LTV : CAC Ratio</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              This is the golden metric of SaaS and service businesses. It compares the lifetime value of a customer to the cost of acquiring them. A ratio of 3:1 (making three times what you spent to acquire them) is the industry benchmark for a healthy, scalable business model.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6 font-sans">How Agencies Use This Tool to Defend Retainers</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-8 font-sans">
          Clients often experience "sticker shock" when looking at their monthly marketing bills. When an agency uses this tool to generate a PDF projection report, they shift the conversation from "How much are we spending?" to "Look at the long-term wealth we are creating." It transforms social media marketing from an expense into an undeniable asset.
        </p>
      </section>
    </div>
  );
}
