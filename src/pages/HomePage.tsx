import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, FileText, Zap, Globe, Rocket, Clock, MousePointer2, Shield } from 'lucide-react';
import FeaturedTools from '../components/layout/FeaturedTools';
import ProfessionalSolutions from '../components/layout/ProfessionalSolutions';
import InstantExperience from '../components/layout/InstantExperience';
import FAQ from '../components/FAQ';
import TrustLogos from '../components/layout/TrustLogos';
import BottomCTA from '../components/layout/BottomCTA';

interface HomePageProps {
  onToolClick: (slug: string) => void;
  onExploreTools: () => void;
  onProClick: () => void;
  onWorkflowClick: (persona: 'engineer' | 'designer' | 'agency') => void;
  user: any;
}

export default function HomePage({ onToolClick, onExploreTools, onProClick, onWorkflowClick, user }: HomePageProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>('finance');

  const categories = {
    finance: {
      label: 'Finance & Billing',
      title: 'Protect your margins and get paid faster.',
      text: 'Stop guessing your rates. Use deterministic calculators to establish baseline profitability and enforce late fees.',
      features: [
        'Rate Calculators',
        'Invoice Generators',
        'Late Fee Enforcers'
      ],
      cta: 'Explore Finance Tools',
      slug: 'finance'
    },
    sales: {
      label: 'Sales & Proposals',
      title: 'Shorten your sales cycle.',
      text: 'Generate high-converting proposals, cold pitches, and follow-ups powered by AI.',
      features: [
        'Proposal Generators',
        'Cold Pitchers',
        'Lead Follow-ups'
      ],
      cta: 'Explore Sales Tools',
      slug: 'sales'
    },
    legal: {
      label: 'Legal & Scoping',
      title: 'Contracts that actually protect you.',
      text: 'Scope projects properly to avoid creep and generate air-tight contracts and NDAs.',
      features: [
        'Contract Builders',
        'Scope Scopers',
        'Retainer Agreements'
      ],
      cta: 'Explore Legal Tools',
      slug: 'legal'
    },
    marketing: {
      label: 'Marketing & Growth',
      title: 'Performance data for professionals.',
      text: 'Calculate ROAS, CPM, and engagement rates for your client campaigns with zero spreadsheets.',
      features: [
        'ROAS Calculators',
        'Growth Planners',
        'Ad Spend Analyzers'
      ],
      cta: 'Explore Marketing Tools',
      slug: 'marketing'
    },
    development: {
      label: 'SEO & Dev',
      title: 'Technical utility for modern builders.',
      text: 'Audit site SEO, manage robots.txt, and calculate technical migration impacts.',
      features: [
        'SEO Auditors',
        'Migration Mappers',
        'Code Converters'
      ],
      cta: 'Explore Dev Tools',
      slug: 'development'
    },
    security: {
      label: 'Security & Compliance',
      title: 'Enterprise-Grade Security Utilities.',
      text: 'Audit vulnerabilities, generate compliant policies, and calculate risk exposure to close high-ticket retainers.',
      features: [
        'Header Auditing',
        'GDPR Boilerplates',
        'Ransomware ROI'
      ],
      cta: 'Explore Security Tools',
      slug: 'security'
    },
    operations: {
      label: 'Operations & PM',
      title: 'Run your business like a machine.',
      text: 'Plan capacity, track timelines, and triage tasks effortlessly.',
      features: [
        'Capacity Planners',
        'Timeline Visualizers',
        'Task Triages'
      ],
      cta: 'Explore Ops Tools',
      slug: 'operations'
    }
  };

  return (
    <div className="space-y-24 md:space-y-32 pb-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0f4c75]/5 via-transparent to-transparent -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] -z-20 pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-sm text-blue-600 tracking-wider font-bold uppercase"
            >
              TRUSTED BY 5,000+ INDEPENDENT AGENCIES
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight"
            >
              Automate your agency. <br />
              <span className="text-[#0f4c75]">Protect your margins.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="text-lg text-slate-600 max-w-xl leading-relaxed"
            >
              Replace $300/mo of scattered SaaS subscriptions with one unified toolkit. Scope projects, track capacity, and get paid faster.
            </motion.p>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.4,
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  onClick={onExploreTools}
                  className="w-full sm:w-auto px-8 py-4 bg-[#0f4c75] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#0f4c75]/20 flex items-center justify-center gap-2"
                >
                  Explore the Toolkit <ArrowRight size={14} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.6,
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  onClick={onProClick}
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#0f4c75] text-[#0f4c75] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#0f4c75]/5 transition-all shadow-sm"
                >
                  View Pro Features
                </motion.button>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left pl-1">
                No credit card required. <span className="text-blue-600">5 Free Credits.</span>
              </p>
            </div>

            {/* Minor Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 pt-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 tracking-tight">
                Used by <span className="text-slate-900">5,000+</span> professionals
              </span>
            </motion.div>
          </div>

          {/* Right Column: Product Showcase Animation */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(15,76,117,0.15)] p-10 max-w-lg mx-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/20" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-50" />
                </div>
                
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-slate-50 rounded-full" />
                  <div className="h-10 w-full bg-slate-50 rounded-2xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-slate-50 rounded-2xl" />
                    <div className="h-24 bg-slate-50 rounded-2xl" />
                  </div>
                  <div className="h-32 w-full bg-slate-50 rounded-2xl" />
                </div>
              </div>

              {/* Floating Notification Pills */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-slate-50 p-4 flex items-center gap-3 z-20 whitespace-nowrap"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Proposal Approved</p>
                  <p className="text-[8px] text-slate-400 font-bold">Just now by client</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-slate-50 p-4 flex items-center gap-3 z-20 whitespace-nowrap"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Rocket size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Invoice Paid - $4,200</p>
                  <p className="text-[8px] text-slate-400 font-bold">Successfully processed</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 right-12 bg-white rounded-2xl shadow-xl border border-slate-50 p-4 flex items-center gap-3 z-20 whitespace-nowrap"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Capacity: Healthy</p>
                  <p className="text-[8px] text-slate-400 font-bold">Next slot available June 1st</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Decorative blurs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0f4c75]/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* Featured Tools (The Top 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-slate-50/50 -z-10 rounded-[4rem]" />
        <FeaturedTools onToolClick={onToolClick} />
        
        {/* Navigation CTA */}
        <div className="mt-12 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={onExploreTools}
            className="group px-8 py-4 bg-[#0f4c75] hover:bg-[#0b395a] text-white rounded-xl font-bold shadow-lg shadow-[#0f4c75]/20 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
          >
            Explore All 20+ Pro Tools 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </section>

      <InstantExperience onProClick={onProClick} />
      
      <ProfessionalSolutions 
        onToolClick={onToolClick} 
        onAllToolsClick={onExploreTools} 
      />

      <TrustLogos />

      {/* Category Workflows Split Pane Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-display uppercase mb-4">Master Your Workflow</h2>
          <p className="text-slate-500 font-medium">Select a category to access specialized business tools for your specific needs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Vertical Tabs */}
          <div className="lg:col-span-4 space-y-4">
            {(Object.keys(categories) as Array<keyof typeof categories>).map((key) => (
              <motion.button
                key={key}
                whileHover={{ x: 8, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={() => setActiveCategory(key)}
                className={`w-full text-start p-6 rounded-2xl transition-all border-l-4 flex flex-col gap-1 ${
                  activeCategory === key 
                  ? 'bg-[#0f4c75]/5 text-[#0f4c75] border-[#0f4c75] shadow-sm shadow-[#0f4c75]/5' 
                  : 'bg-white text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Category</span>
                <span className="text-xl font-black">{categories[key].label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Column: Dynamic Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#0f4c75]/5 rounded-full blur-3xl" />
                
                <div className="relative z-10 space-y-8">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">
                    {categories[activeCategory as keyof typeof categories].title}
                  </h3>
                  
                  <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl text-start">
                    {categories[activeCategory as keyof typeof categories].text}
                  </p>

                  <div className="space-y-4 text-start">
                    <p className="text-xs font-black uppercase tracking-widest text-[#0f4c75]/40 mb-2">Key Highlights</p>
                    <ul className="space-y-3">
                      {categories[activeCategory as keyof typeof categories].features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-600 font-bold">
                          <div className="w-5 h-5 rounded-full bg-[#0f4c75]/10 flex items-center justify-center text-[#0f4c75]">
                            <Zap size={10} className="fill-current" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex justify-start">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      onClick={() => onWorkflowClick(categories[activeCategory as keyof typeof categories].slug as any)}
                      className="group flex items-center gap-3 px-10 py-5 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#0f4c75]/20"
                    >
                      {categories[activeCategory as keyof typeof categories].cta}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <FAQ />

      {/* Origin Story Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-slate-50 rounded-[3rem] p-12 md:p-20 border border-slate-100 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Left Column: Authority Badge */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-6">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#0f4c75] border border-slate-100">
                <Shield size={32} />
              </div>
              <div className="text-center md:text-left space-y-1">
                <div className="text-2xl font-black text-slate-900 tracking-tight">Ahtisham ul Hassan</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f4c75]">Founder & Lead Engineer</div>
              </div>
            </div>

            {/* Right Column: The Manifesto */}
            <div className="md:col-span-8 text-left space-y-6">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                WHY WE BUILT FREELANCERKIT
              </div>
              <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed">
                I was tired of juggling 10 different spreadsheets to run my agency. These are the exact tools my team uses to price projects, close leads, and get paid faster. No fluff, just utility.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <BottomCTA />
    </div>
  );
}
