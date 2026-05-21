import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS } from '../lib/tools-registry';
import ToolGrid from '../components/ToolGrid';
import { Sparkles, Terminal, Palette, Briefcase, ChevronDown, CheckCircle2, ShieldCheck, Zap, Star } from 'lucide-react';

interface WorkflowPageProps {
  persona: 'engineer' | 'designer' | 'agency';
  onToolClick: (slug: string) => void;
}

const PERSONA_CONFIG = {
  engineer: {
    heroTitle: 'The Ultimate Toolkit for Freelance Developers.',
    heroSub: 'Automate your proposals, track billable hours, and prevent scope creep. Built for engineers, by engineers.',
    cta: 'Get Started for Free',
    personaName: 'Developer',
    valueProps: [
      { title: 'Technical Precision', desc: 'Generate complex technical proposals with accurate line-item estimations.', icon: <Terminal className="text-[#0f4c75]" /> },
      { title: 'Scope Protection', desc: 'Standardize your service agreements to prevent unpaid feature requests.', icon: <ShieldCheck className="text-[#0f4c75]" /> },
      { title: 'Tax Optimization', desc: 'Real-time estimates for self-employment tax and business deductions.', icon: <Zap className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'How do I charge for unexpected work?', a: 'Use our Technical Proposal Generator to define a clear "Out of Scope" hourly rate for any work not in the original brief.' },
      { q: 'What is the best way to track billable hours?', a: 'Our Billable Hours Tracker allows you to categorize work by project and task, ensuring nothing goes unbilled.' },
      { q: 'Can I use these tools for full-time work?', a: 'Yes, but they are specifically optimized for the business needs of independent contractors and freelancers.' }
    ]
  },
  designer: {
    heroTitle: 'The Professional Studio for Freelance Designers.',
    heroSub: 'Protect your IP, standardize client feedback, and price your creative work on value, not just pixels.',
    cta: 'Launch Your Studio',
    personaName: 'Designer',
    valueProps: [
      { title: 'Protect Your IP', desc: 'Professional contracts that clearly define ownership and revision limits.', icon: <Palette className="text-[#0f4c75]" /> },
      { title: 'Value-Based Pricing', desc: 'Calculate rates based on project impact rather than soul-crushing hourly increments.', icon: <Star className="text-[#0f4c75]" /> },
      { title: 'Standardize Feedback', desc: 'Tools to structure client reviews so you stay in control of the creative process.', icon: <Zap className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'How do I prevent too many revisions?', a: 'Our Contract Builder includes specific clauses for revision cycles (e.g., 2 per project phase) to set boundaries early.' },
      { q: 'How do I calculate a flat project fee?', a: 'Use our Project Cost Estimator to total your expected hours, then add a "Risk Buffer" of 15% for a safe flat fee.' },
      { q: 'Do these tools work for agencies too?', a: 'While great for solo designers, larger firms should check out our Agency Workspace for team-wide tools.' }
    ]
  },
  agency: {
    heroTitle: 'The Growth Hub for Scalable Freelance Agencies.',
    heroSub: 'Scale your operations, manage team bandwidth, and protect your margins with high-level planning tools.',
    cta: 'Command Your Agency',
    personaName: 'Agency Owner',
    valueProps: [
      { title: 'Team Capacity', desc: 'Visualize bandwidth across multiple contractors to prevent burnout and delays.', icon: <Briefcase className="text-[#0f4c75]" /> },
      { title: 'Financial Runway', desc: 'Predict exactly how many months of "survival cash" your agency has at current burn.', icon: <ShieldCheck className="text-[#0f4c75]" /> },
      { title: 'Standardized Ops', desc: 'Automated onboarding and retainer builders for high-ticket client management.', icon: <Zap className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'How should I price retainer agreements?', a: 'Use our Retainer Builder to calculate a "Volume Discount" for guaranteed hours over 6+ months.' },
      { q: 'What is a healthy agency profit margin?', a: 'Aim for 30-50% margins. Use our Markup Calculator to ensure you aren\'t losing money on pass-through costs.' },
      { q: 'How do I track contractor profitability?', a: 'Assign project numbers and track specific hours against billed revenue using our Project Dashboard.' }
    ]
  },
};

export default function WorkflowPage({ persona, onToolClick }: WorkflowPageProps) {
  const config = PERSONA_CONFIG[persona];
  const filteredTools = TOOLS.filter(tool => tool.personas?.includes(persona));
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#0f4c75]/5 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-3/5 text-start"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f4c75]/10 rounded-full text-[#0f4c75] text-xs font-black uppercase tracking-widest mb-6">
                <CheckCircle2 size={14} /> Built for {config.personaName}s
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                {config.heroTitle}
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8 max-w-2xl">
                {config.heroSub}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <button 
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  className="px-8 py-4 bg-[#0f4c75] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#0b395a] transition-all shadow-xl shadow-[#0f4c75]/20 active:scale-95"
                >
                  {config.cta}
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                       <div className={`w-full h-full bg-[#0f4c75] opacity-${i*2}0`} />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold text-slate-400">
                  Trusted by top <span className="text-slate-900">{config.personaName}s</span> worldwide
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:w-2/5 relative"
            >
              <div className="relative z-10 bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl shadow-slate-200">
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-[#0f4c75] rounded-xl flex items-center justify-center text-white">
                        <Zap size={24} />
                     </div>
                     <span className="font-black text-xl text-slate-900 tracking-tight">Active Suite</span>
                   </div>
                   <div className="space-y-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
                     ))}
                   </div>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#0f4c75]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-ai/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {config.valueProps.map((prop, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50">
                   {prop.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{prop.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Tool Grid */}
      <section id="curated-tools" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-start">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                Your Curated {config.personaName} Workspace
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Everything you need to run your independent {config.personaName.toLowerCase()} business.
              </p>
            </div>
            <div className="px-6 py-3 bg-[#0f4c75] text-white rounded-full">
              <span className="text-xs font-black uppercase tracking-widest">
                {filteredTools.length} Specialized Tools
              </span>
            </div>
          </div>

          <ToolGrid 
            tools={filteredTools} 
            onToolClick={onToolClick} 
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-xs uppercase tracking-[0.3em] text-[#0f4c75] mb-4">Common Questions</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">Expert advice for {config.personaName.toLowerCase()}s.</p>
          </div>

          <div className="space-y-4">
            {config.faqs.map((faq, i) => (
              <div 
                key={i}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-[#0f4c75] shadow-xl shadow-[#0f4c75]/5' : 'border-slate-200'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-6 flex items-center justify-between gap-4 text-start"
                >
                  <span className="text-lg font-black text-slate-900 tracking-tight">{faq.q}</span>
                  <ChevronDown className={`text-slate-400 transition-transform ${openFaq === i ? 'rotate-180 text-[#0f4c75]' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-slate-500 font-medium leading-relaxed pt-2 border-t border-slate-50">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
