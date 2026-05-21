import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS, CATEGORIES } from '../lib/tools-registry';
import ToolGrid from '../components/ToolGrid';
import { 
  Sparkles, 
  Wallet, 
  Target, 
  Scale, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  Layers,
  ChevronDown, 
  CheckCircle2, 
  Zap, 
  Star,
  ShieldAlert,
  Code,
  Briefcase
} from 'lucide-react';

interface CategoryPageProps {
  categoryId: string;
  onToolClick: (slug: string) => void;
}

const CATEGORY_CONFIG: Record<string, any> = {
  finance: {
    heroTitle: 'The Professional Suite for Finance & Billing.',
    heroSub: 'Automated rate calculators, invoice generation, and tax estimators. Built to protect your bottom line and ensure you get paid on time.',
    cta: 'Master Your Revenue',
    icon: <Wallet className="text-[#0f4c75]" />,
    valueProps: [
      { title: 'Deterministic Pricing', desc: 'Calculate exact hourly rates and project flat fees based on your real overhead and goals.', icon: <TrendingUp className="text-[#0f4c75]" /> },
      { title: 'Invoicing Automation', desc: 'Generate professional, client-ready invoices in seconds with line-item detail.', icon: <Layers className="text-[#0f4c75]" /> },
      { title: 'Tax Preparedness', desc: 'Stay ahead of quarterly estimated taxes with precision growth planning tools.', icon: <Zap className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'How do I accurately calculate my hourly rate?', a: 'Use our Freelance Rate Calculator to account for all business expenses, non-billable hours, and profit targets.' },
      { q: 'What should I do about late payments?', a: 'Our Late Payment Tool helps calculates specific interest and penalties to include when following up on overdue invoices.' },
      { q: 'How do I track my business profitability?', a: 'Use the Income Goal Planner to visualize exactly how many billable hours you need each month to reach your net targets.' }
    ]
  },
  sales: {
    heroTitle: 'The Professional Suite for Sales & Proposals.',
    heroSub: 'Shorten your sales cycle with AI-powered proposal generation, high-converting cold pitches, and automated follow-up sequences.',
    cta: 'Close More Leads',
    icon: <Target className="text-[#0f4c75]" />,
    valueProps: [
      { title: 'AI Copywriting', desc: 'Draft persuasive proposals tailored to your technical or creative service offering.', icon: <Sparkles className="text-[#0f4c75]" /> },
      { title: 'Lead Response', desc: 'Never let a lead go cold with specialized follow-up templates and strategy tools.', icon: <CheckCircle2 className="text-[#0f4c75]" /> },
      { title: 'Cold Outreach', desc: 'Generate pitch scripts that bypass the noise and speak directly to decision-makers.', icon: <Target className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'How do I write a high-converting proposal?', a: 'Focus on outcomes rather than features. Use our AI Proposal Generator to structure your pitch around client pain points.' },
      { q: 'What is the best way to follow up?', a: 'Standardized persistence is key. Use our Follow-Up Generator to send a professional nudge every 3-4 business days.' },
      { q: 'How do I price a value-based project?', a: 'Use our Sales toolkit to estimate the client\'s ROI, then price based on a percentage of the value generated.' }
    ]
  },
  legal: {
    heroTitle: 'The Professional Suite for Legal & Scoping.',
    heroSub: 'Professional contracts, air-tight NDAs, and project scoping tools to prevent creep and protect your intellectual property.',
    cta: 'Secure Your Business',
    icon: <Scale className="text-[#0f4c75]" />,
    valueProps: [
      { title: 'Contract Security', desc: 'Standardize your service agreements with clauses that protect against non-payment and creep.', icon: <ShieldCheck className="text-[#0f4c75]" /> },
      { title: 'Scope Precision', desc: 'Define project boundaries clearly before work starts to ensure every task is billable.', icon: <Layers className="text-[#0f4c75]" /> },
      { title: 'IP Protection', desc: 'Clearly delineate when ownership transfer happens—never hand over source files without final pay.', icon: <Star className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'How do I prevent scope creep?', a: 'It starts with a detailed scope of work. Use our Scoping tools to map every deliverable and define a change-order process.' },
      { q: 'When should I use an NDA?', a: 'Always before discussing high-level strategy or proprietary business data. Our site provides quick legal templates for these needs.' },
      { q: 'How do I charge for revisions?', a: 'Our contract builder includes specific language for revision cycles, making it clear when additional fees apply.' }
    ]
  },
  marketing: {
    heroTitle: 'The Professional Suite for Marketing & Growth.',
    heroSub: 'Real-time performance calculators for ROAS, CPM, and engagement to run your agency and client campaigns with conviction.',
    cta: 'Optimize Campaign ROI',
    icon: <TrendingUp className="text-[#0f4c75]" />,
    valueProps: [
      { title: 'Determinative ROAS', desc: 'Calculate return on ad spend at a glance to pivot your budget to high-performing channels.', icon: <TrendingUp className="text-[#0f4c75]" /> },
      { title: 'Growth Planning', desc: 'Model exactly how much traffic you need to reach your conversion and revenue goals.', icon: <Globe className="text-[#0f4c75]" /> },
      { title: 'Social Metrics', desc: 'Audit social engagement and campaign efficacy without logging into complex analytics suites.', icon: <Zap className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'What is a good target ROAS?', a: 'This varies by industry, but typically a 4:1 (400%) ROAS is a solid benchmark for sustainable growth.' },
      { q: 'How do I calculate customer acquisition cost?', a: 'Divide your total spend by the number of new leads or customers gained within that specific time period.' },
      { q: 'Can I track multi-channel ROI?', a: 'Use our Attribution Planning tools to see how different marketing activities contribute to the final sale.' }
    ]
  },
  development: {
    heroTitle: 'The Professional Suite for SEO & Dev.',
    heroSub: 'Technical utility for modern builders. Site audits, robots.txt management, and technical migration mapping to ship with confidence.',
    cta: 'Master the Technical Stack',
    icon: <Code className="text-[#0f4c75]" />,
    valueProps: [
      { title: 'SEO Auditing', desc: 'Identify critical technical debts and ranking inhibitors across any client domain.', icon: <Globe className="text-[#0f4c75]" /> },
      { title: 'Technical Scoping', desc: 'Map complex site migrations and database structural changes before you write a line of code.', icon: <Layers className="text-[#0f4c75]" /> },
      { title: 'Developer Workflows', desc: 'Unit conversion, JSON formatting, and code cleanup tools for the day-to-day grind.', icon: <Code className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'How do I fix a drop in organic traffic?', a: 'Start with our SEO Audit tool to check for indexing errors, crawl blocks, or sudden algorithm impact signals.' },
      { q: 'What is the best way to handle a site migration?', a: 'Use our Migration Mapper to track 301 redirects and ensure zero link equity is lost during the move.' },
      { q: 'How do I optimize site speed?', a: 'Check our technical dev tools for light-weight header optimization and asset compression strategies.' }
    ]
  },
  security: {
    heroTitle: 'The Professional Suite for Security & Compliance.',
    heroSub: 'Enterprise-grade security utilities. Audit vulnerabilities, generate compliant policies, and calculate risk exposure to close high-ticket retainers.',
    cta: 'Secure Enterprise Contracts',
    icon: <ShieldAlert className="text-[#0f4c75]" />,
    valueProps: [
      { title: 'Vulnerability Audits', desc: 'Scan HTTP headers and server configurations for common security misconfigurations.', icon: <ShieldCheck className="text-[#0f4c75]" /> },
      { title: 'Policy Generation', desc: 'Draft GDPR, CCPA, and general privacy policies that meet modern regulatory requirements.', icon: <Scale className="text-[#0f4c75]" /> },
      { title: 'Risk Modeling', desc: 'Calculate the total financial impact of data breaches and ransomware to justify security spending.', icon: <Zap className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'Is my client\'s site GDPR compliant?', a: 'Use our GDPR Cookie Consent Builder and Privacy Policy Generator to audit and implement required legal frameworks.' },
      { q: 'How do I sell a security retainer?', a: 'Use the Ransomware Cost Calculator to show clients the literal dollar-value risk they face without proper hardening.' },
      { q: 'What headers are most important for security?', a: 'X-Frame-Options, Content-Security-Policy, and HSTS are critical first steps for any production application.' }
    ]
  },
  operations: {
    heroTitle: 'The Professional Suite for Operations & PM.',
    heroSub: 'Run your business like a machine. Plan bandwidth, track project timelines, and triage tasks for maximum operational efficiency.',
    cta: 'Optimize Operations',
    icon: <Layers className="text-[#0f4c75]" />,
    valueProps: [
      { title: 'Capacity Planning', desc: 'Visualize your billable vs non-billable bandwidth to prevent burnout and over-scheduling.', icon: <Briefcase className="text-[#0f4c75]" /> },
      { title: 'Timeline Design', desc: 'Generate visual project roadmaps that keep clients informed and developers on track.', icon: <Globe className="text-[#0f4c75]" /> },
      { title: 'Task Prioritization', desc: 'Use deterministic triage frameworks to handle high-volume task lists without losing focus.', icon: <Zap className="text-[#0f4c75]" /> },
    ],
    faqs: [
      { q: 'How do I know when to hire?', a: 'Our Capacity Planner shows your historical bandwidth utilization. Once you cross 85% consistently, it\'s time to scale.' },
      { q: 'What is a "Critical Path" in project management?', a: 'It\'s the sequence of tasks that determines the shortest possible project duration. Use our Timeline Generator to visualize it.' },
      { q: 'How do I handle task triage?', a: 'Use the Task Triage tool to categorize work by Impact and Urgency (Eisenhower Matrix) for maximum focus.' }
    ]
  }
};

export default function CategoryPage({ categoryId, onToolClick }: CategoryPageProps) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const config = CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG['finance'];
  
  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => Array.isArray(tool.category) ? tool.category.includes(categoryId) : tool.category === categoryId);
  }, [categoryId]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
                <CheckCircle2 size={14} /> Professional {category?.name} Suite
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                {config.heroTitle}
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8 max-w-2xl">
                {config.heroSub}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <button 
                  onClick={() => {
                    const el = document.getElementById('category-tools');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
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
                  Used by <span className="text-slate-900">10,000+</span> specialists monthly
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
                        {config.icon}
                     </div>
                     <span className="font-black text-xl text-slate-900 tracking-tight">Active Suite</span>
                   </div>
                   <div className="space-y-3">
                     {filteredTools.slice(0, 3).map((tool, i) => (
                       <div key={i} className="h-12 bg-slate-50 rounded-lg flex items-center px-4 gap-3">
                          <tool.icon size={16} className="text-[#0f4c75]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tool.name}</span>
                       </div>
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
            {config.valueProps.map((prop: any, i: number) => (
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
      <section id="category-tools" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-start">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4 uppercase">
                {category?.name} Toolkit
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Professional tools purpose-built for {category?.name.toLowerCase()} workflows.
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
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#0f4c75] mb-4">Common Questions</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">Category Expertise.</p>
          </div>

          <div className="space-y-4">
            {config.faqs.map((faq: any, i: number) => (
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
