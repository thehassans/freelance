import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ChevronDown, 
  Target,
  BarChart3,
  Award,
  Clock,
  ArrowRight,
  Calculator,
  Briefcase,
  Users
} from 'lucide-react';
import RateCalculator from './RateCalculator';

export default function RateLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const advantages = [
    {
      icon: <Target size={40} className="text-[#0f4c75]" />,
      title: "Cost-Based Strategy",
      description: "Start with your personal lifestyle needs. We calculate exactly what you need to earn to cover taxes, vacations, and retirement."
    },
    {
      icon: <TrendingUp size={40} className="text-[#0f4c75]" />,
      title: "Market Value Multipliers",
      description: "Upgrade your rate based on industry demand, experience levels, and niche skills that clients are willing to pay a premium for."
    },
    {
      icon: <ShieldCheck size={40} className="text-[#0f4c75]" />,
      title: "Privacy First Analytics",
      description: "Your financial data is yours. All calculations happen locally in your browser—no data ever touches our servers."
    }
  ];

  const industryBenchmarks = [
    { role: "Software Architect", range: "$150 - $250", demand: "High" },
    { role: "Full Stack Developer", range: "$80 - $140", demand: "Very High" },
    { role: "UI/UX Designer", range: "$70 - $130", demand: "Steady" },
    { role: "Copywriter", range: "$50 - $100", demand: "Medium" },
    { role: "Digital Marketer", range: "$60 - $110", demand: "Medium" },
  ];

  const faqs = [
    {
      question: "Why should I use a rate calculator instead of guessing?",
      answer: "Guessing leads to underpricing. A calculator mathematically forces you to account for unbilled administrative time, taxes, and software expenses to ensure you are actually hitting your take-home goals."
    },
    {
      question: "What other pricing models should I consider?",
      answer: "Hourly is great for discovery, but you should transition to Value-Based Pricing (charging for the outcome) or Retainers (charging for guaranteed monthly access) to truly scale your income."
    },
    {
      question: "How much should I charge as a beginner?",
      answer: "Start by calculating your 'Survival Floor' using this tool—the absolute minimum you need to live. Then, apply a 20% margin. As you build a portfolio and demand increases, aggressively raise your rates."
    },
    {
      question: "Is it okay to change my rate for different clients?",
      answer: "Absolutely. Enterprise clients with heavy compliance or communication demands should be charged a 'Corporate Multiplier' compared to lean, fast-moving startups."
    },
    {
      question: "Which freelance roles command the highest rates?",
      answer: "Highly specialized, outcome-driven roles. Specialized software engineers, AI integrators, and direct-response copywriters often charge $150-$300+/hr because their work directly generates revenue for the client."
    }
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section & Tool */}
      <section>
        <div className="text-center mb-16 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6"
          >
            The Ultimate <span className="text-[#0f4c75]">Freelance Rate</span> Audit
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Stop guessing your worth. Combine lifestyle-based math with market-value multipliers to find your perfect hourly and daily rates.
          </motion.p>
        </div>

        <RateCalculator />
      </section>

      {/* Value Proposition */}
      <section className="bg-slate-50 py-24 sm:py-32 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Precision Rate Modeling</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Why 2,000+ freelancers trust our engine.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {advantages.map((adv, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-[#0f4c75]/5 transition-all"
              >
                <div className="mb-6">{adv.icon}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{adv.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{adv.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Set Your Rate Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">How to Set Your Rate</h2>
            <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
              <p>
                Setting your rate as a freelancer is a balance of two distinct methodologies: 
                <strong> Cost-Based</strong> and <strong>Market-Based</strong> pricing.
              </p>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                 <h4 className="text-slate-900 font-black mb-2 flex items-center gap-2"><Calculator size={18} className="text-[#0f4c75]" /> Cost-Based Pricing</h4>
                 <p className="text-sm">Calculating the absolute minimum you need to earn to maintain your quality of life, pay taxes, and fund your business operations.</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                 <h4 className="text-slate-900 font-black mb-2 flex items-center gap-2"><BarChart3 size={18} className="text-emerald-500" /> Market-Based Pricing</h4>
                 <p className="text-sm">Adjusting that floor based on what the market currently pays for your specific level of experience and niche technical expertise.</p>
              </div>
              <p>
                Our tool merges these seamlessly. Your "Sustainable Floor" ensures you never go broke, while the "Market Benchmark" helps you capture the full value you provide to your clients.
              </p>
            </div>
          </div>
          <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#0f4c75]/20 blur-3xl -mr-32 -mt-32 rounded-full" />
             <h3 className="text-2xl font-black mb-8 relative z-10 flex items-center gap-3">
                <Briefcase className="text-[#0f4c75]" /> Rate Insights by Role
             </h3>
             <div className="space-y-4 relative z-10">
                {industryBenchmarks.map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-xl">
                    <div>
                      <p className="font-bold text-white">{b.role}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#0f4c75]">{b.demand} Market Demand</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-emerald-400">{b.range}</p>
                      <p className="text-[10px] text-slate-500">Hourly Target</p>
                    </div>
                  </div>
                ))}
             </div>
             <p className="mt-8 text-[10px] text-slate-500 font-medium italic">
               * Benchmarks based on 2024 global agency data. Rates vary significantly by geography and industry niche.
             </p>
          </div>
        </div>
      </section>

      {/* SEO Optimized FAQ */}
      <section className="bg-slate-50 py-24 sm:py-32 border-y border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Pricing Strategy FAQ</h2>
            <p className="text-slate-500 font-medium">Expert guidance on navigating the freelance market.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-slate-200/50' : ''}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-8 text-left"
                >
                  <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">{faq.question}</span>
                  <ChevronDown className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-8 pb-8">
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

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#0f4c75] rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to Capture <br/>Your Full Value?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of professionals who have already audited their rates and unlocked higher-margin projects.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-[#0f4c75] rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3 mx-auto group"
            >
              Recalculate My Rate <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
