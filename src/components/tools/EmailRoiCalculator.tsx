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
  const [emailsSent, setEmailsSent] = useState<string>('10000');
  const [campaignCost, setCampaignCost] = useState<string>('500');
  const [openRate, setOpenRate] = useState<number>(20);
  const [ctr, setCtr] = useState<number>(2.5);
  const [convRate, setConvRate] = useState<number>(1.5);
  const [aov, setAov] = useState<string>('85');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    const sent = parseFloat(emailsSent) || 0;
    const cost = parseFloat(campaignCost) || 0;
    const aovVal = parseFloat(aov) || 0;

    const opens = sent * (openRate / 100);
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
      revenueVal: revenue,
      profit: formatCur(profit),
      roi: roi.toFixed(1),
      isProfitable: roi > 0
    };
  }, [emailsSent, openRate, ctr, convRate, aov, campaignCost]);

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

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto mb-16">
        {/* Left Panel: The Sandbox (Inputs) */}
        <div className="w-full lg:w-5/12 space-y-6">
          {/* Campaign Costs Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <DollarSign size={20} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">Campaign Basics</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Emails Sent</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={emailsSent} 
                    onChange={(e) => setEmailsSent(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    <Send size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Campaign Cost ($)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={campaignCost} 
                    onChange={(e) => setCampaignCost(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">Engagement Metrics</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Open Rate (%)</label>
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
                <div className="flex justify-between items-end mb-1">
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
            </div>
          </div>

          {/* Sales Metrics Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <ShoppingCart size={20} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">Sales Metrics</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Conversion Rate (%)</label>
                <input 
                  type="number" 
                  value={convRate} 
                  onChange={(e) => setConvRate(parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Avg Order Value ($)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={aov} 
                    onChange={(e) => setAov(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: The Funnel Dashboard (Results) */}
        <div className="w-full lg:w-7/12">
          <section className="bg-slate-900 text-white rounded-[3rem] p-8 md:p-12 shadow-2xl h-full flex flex-col relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Forecasting Output</h3>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400">v5.0 FUNNEL ENGINE</div>
              </div>

              {/* Major Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Projected Revenue</p>
                  <p className="text-5xl font-black tracking-tight text-white">{stats.revenue}</p>
                </div>
                <div className={`p-8 rounded-[2rem] border ${stats.isProfitable ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${stats.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>Estimated ROI %</p>
                  <p className={`text-5xl font-black tracking-tighter ${stats.isProfitable ? 'text-white' : 'text-rose-200'}`}>
                    {stats.roi}%
                  </p>
                </div>
              </div>

              {/* Conversion Breakdown Tooltip-style cards */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Zap size={16} className="text-white" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-300">Funnel Breakdown</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye size={12} className="text-slate-500" />
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Opens</p>
                    </div>
                    <p className="text-2xl font-black text-white">{stats.opens}</p>
                    <p className="text-[10px] text-slate-600 mt-1 font-medium">{openRate}% of sent</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <MousePointer2 size={12} className="text-indigo-400" />
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Clicks</p>
                    </div>
                    <p className="text-2xl font-black text-indigo-400">{stats.clicks}</p>
                    <p className="text-[10px] text-slate-600 mt-1 font-medium">{ctr}% of opens</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingCart size={12} className="text-emerald-400" />
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Conversions</p>
                    </div>
                    <p className="text-2xl font-black text-emerald-400">{stats.conversions}</p>
                    <p className="text-[10px] text-slate-600 mt-1 font-medium">{convRate}% of clicks</p>
                  </div>
                </div>

                <div className="mt-10 p-8 bg-white/5 border border-white/5 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Profit Margin</p>
                    <span className={`text-xs font-bold ${stats.isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stats.profit}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: stats.isProfitable ? '100%' : '20%' }}
                      className={`h-full ${stats.isProfitable ? 'bg-indigo-500' : 'bg-rose-500'}`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-t border-white/5 pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-emerald-500" /> Audit Verified
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-blue-500" /> ISO Compliance
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

      {/* Authority SEO & Educational Guide */}
      <section id="email-marketing-roi-guide" className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none">
        <h2>What is an Email Marketing ROI Calculator?</h2>
        <p>
          An Email Marketing ROI Calculator is a tool used to measure the profitability and effectiveness of an email marketing campaign. It helps businesses understand how much revenue they generate compared to the amount they spend on email marketing activities.
        </p>
        <p>
          ROI, or Return on Investment, is one of the most important marketing metrics because it shows whether your campaigns are producing positive financial results.
        </p>

        <h2>Why Email Marketing ROI Matters</h2>
        <p>Email marketing remains one of the highest-performing digital marketing channels. An ROI calculator helps businesses:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Measure campaign profitability</li>
          <li>Track marketing performance</li>
          <li>Optimize email marketing budgets</li>
          <li>Improve conversion strategies</li>
          <li>Understand customer engagement</li>
          <li>Make data-driven marketing decisions</li>
        </ul>
        <p>By analyzing ROI, businesses can identify which campaigns generate the best results and refine future email strategies.</p>

        <h2>Benefits of Using an Email Marketing ROI Calculator</h2>
        <h3>Performance Measurement</h3>
        <p>An ROI calculator helps you determine whether your email campaigns are successful by comparing total revenue with marketing expenses.</p>
        
        <h3>Better Budget Allocation</h3>
        <p>Understanding ROI allows businesses to invest more confidently in campaigns that deliver strong results while reducing spending on underperforming strategies.</p>
        
        <h3>Improved Campaign Optimization</h3>
        <p>By analyzing metrics such as open rates, click-through rates, and conversions, businesses can improve subject lines, email design, targeting, and content quality.</p>
        
        <h3>Smarter Decision-Making</h3>
        <p>An ROI calculator provides valuable insights that help marketers make informed business decisions based on real campaign data rather than assumptions.</p>

        <h2>How to Calculate Email Marketing ROI</h2>
        <p>The formula for calculating email marketing ROI is:</p>
        <blockquote className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg font-mono text-lg text-slate-800 my-6">
          ROI = ((Revenue Generated - Marketing Cost) / Marketing Cost) × 100
        </blockquote>
        <p>To calculate ROI, you need:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Total revenue generated from the email campaign</li>
          <li>Total campaign cost</li>
        </ul>
        <p>Subtract the marketing cost from the revenue generated, divide the result by the marketing cost, and multiply by 100 to get the ROI percentage.</p>

        <h2>Email Marketing ROI Example</h2>
        <p>Suppose a company spends $1,000 on an email marketing campaign and generates $5,000 in sales. The calculation would be:</p>
        <blockquote className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg font-mono text-lg text-slate-800 my-6">
          ROI = ((5000 - 1000) / 1000) × 100 = 400%
        </blockquote>
        <p>This means the campaign achieved a 400% ROI, indicating that the business earned four times its investment.</p>

        <h2>Important Metrics in Email Marketing</h2>
        <p>An Email Marketing ROI Calculator often works alongside other key performance indicators, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Open Rate</li>
          <li>Click-Through Rate (CTR)</li>
          <li>Conversion Rate</li>
          <li>Bounce Rate</li>
          <li>Unsubscribe Rate</li>
          <li>Revenue Per Email</li>
          <li>Customer Lifetime Value</li>
        </ul>
        <p>Tracking these metrics helps businesses gain a complete understanding of campaign performance.</p>

        <h2>When Should You Use an Email Marketing ROI Calculator?</h2>
        <p>You should use an ROI calculator when:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Running promotional email campaigns</li>
          <li>Launching new products or services</li>
          <li>Measuring newsletter performance</li>
          <li>Evaluating seasonal marketing campaigns</li>
          <li>Comparing different email strategies</li>
          <li>Tracking ecommerce sales performance</li>
        </ul>
        <p>Regular ROI analysis helps businesses continuously improve their email marketing effectiveness.</p>

        <h2>Final Thoughts</h2>
        <p>
          An Email Marketing ROI Calculator is an essential tool for businesses looking to maximize the value of their marketing efforts. By accurately measuring campaign profitability, businesses can improve targeting, optimize budgets, and create more effective email campaigns that generate long-term growth and customer engagement.
        </p>
      </section>
    </div>
  );
}
