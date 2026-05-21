import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2, Briefcase, Users, Receipt, Calculator, FileSignature, Link as LinkIcon } from 'lucide-react';

interface FeaturedToolsProps {
  onToolClick: (slug: string) => void;
}

export default function FeaturedTools({ onToolClick }: FeaturedToolsProps) {
  const featured = [
    {
      id: 'invoice',
      name: 'Invoice Generator',
      slug: 'invoice-generator',
      description: 'Professional billing in seconds. Supports multi-currency and local taxes.',
      icon: <Receipt size={24} />,
      color: 'bg-[#0f4c75]',
      shadow: 'shadow-[#0f4c75]/20',
      tier: 'FREE',
      benefits: ['Instant PDF Export', 'Tax Calculation', 'Brand Customization']
    },
    {
      id: 'proposal',
      name: 'AI Proposal Engine',
      slug: 'ai-proposal-generator',
      description: 'Win high-ticket clients with persuasive, AI-optimized project pitches.',
      icon: <Sparkles size={24} />,
      color: 'bg-[#0b395a]',
      shadow: 'shadow-[#0b395a]/20',
      tier: 'FREEMIUM',
      benefits: ['Dynamic STAR Format', 'Conversion Optimized', 'Industry Specific']
    },
    {
      id: 'contract',
      name: 'Contract Agreement Builder',
      slug: 'contract-builder',
      description: 'Legally vetted agreements with built-in digital signature portals.',
      icon: <FileSignature size={24} />,
      color: 'bg-slate-900',
      shadow: 'shadow-slate-900/10',
      tier: 'FREEMIUM',
      benefits: ['Legally Vetted', 'Digital Signatures', 'Client Portals']
    },
    {
      id: 'backlink',
      name: 'Backlink Discovery Tool',
      slug: 'backlink-discovery-tool',
      description: 'Audit any domain to discover inbound links, referring domains, and anchor text.',
      icon: <LinkIcon size={24} />,
      color: 'bg-blue-600',
      shadow: 'shadow-blue-600/20',
      tier: 'FREEMIUM',
      benefits: ['Procedural Domain Audit', 'CSV Export Protected', 'DR & RD Metrics']
    },
    {
      id: 'capacity',
      name: 'Capacity Planner',
      slug: 'agency-capacity-planner',
      description: 'Visualize your bandwidth and project team revenue with precision.',
      icon: <Users size={24} />,
      color: 'bg-emerald-600',
      shadow: 'shadow-emerald-600/20',
      tier: 'PRO',
      benefits: ['Team Bandwidth', 'Revenue Projection', 'Hiring Alerts']
    },
    {
      id: 'rate',
      name: 'Rate Calculator',
      slug: 'freelance-rate-calculator',
      description: 'Mathematically determine your minimum hourly rate to hit profit goals.',
      icon: <Calculator size={24} />,
      color: 'bg-rose-600',
      shadow: 'shadow-rose-600/20',
      tier: 'FREE',
      benefits: ['Overhead Math', 'Tax Provisioning', 'Profit Margin Tuning']
    }
  ];

  return (
    <section className="mb-24 py-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
        <div className="max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1] mb-6 font-display"
          >
            Powerful tools for <br />
            <span className="text-[#0f4c75] italic">Elite</span> Independence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed"
          >
            Stop juggling spreadsheets. Use our professional-grade suite to automate the boring stuff and focus on your craft.
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="hidden lg:flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[#0f4c75] font-black uppercase tracking-widest text-[10px] shadow-sm"
        >
          <Zap size={16} className="animate-pulse" /> Live System Performance: 99.9%
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {featured.map((tool, idx) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.97 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              delay: idx * 0.1,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            onClick={() => onToolClick(tool.slug)}
            className="group relative bg-white rounded-2xl p-6 border border-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-200 cursor-pointer overflow-hidden h-full flex flex-col"
          >
            {/* Tier Badge */}
            <div className="absolute top-6 right-6 z-10">
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm border border-black/5 flex items-center gap-1.5 ${
                tool.tier === 'PRO' ? 'bg-slate-900 text-amber-400 border-slate-800' : 
                tool.tier === 'FREEMIUM' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {tool.tier === 'PRO' && <Sparkles size={10} className="fill-current" />}
                {tool.tier}
              </span>
            </div>

            <div className={`w-16 h-16 ${tool.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg ${tool.shadow} group-hover:scale-110 transition-transform duration-300`}>
              {tool.icon}
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
              {tool.name}
            </h3>
            
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
              {tool.description}
            </p>

            <ul className="space-y-3 mb-10 flex-grow">
              {tool.benefits.map((benefit, bIdx) => (
                <li key={bIdx} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <CheckCircle2 size={14} className="text-[#0f4c75]" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-blue-600 transition-colors duration-300">
                Launch Module
              </span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:translate-x-1">
                <ArrowRight size={18} />
              </div>
            </div>

            {/* Decorative Background Number */}
            <div className="absolute -bottom-4 right-2 text-9xl font-black text-slate-50/50 pointer-events-none z-0 transition-opacity duration-300 group-hover:opacity-0">
              0{idx + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
