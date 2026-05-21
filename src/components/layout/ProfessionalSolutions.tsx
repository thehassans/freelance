import React from 'react';
import { motion } from 'motion/react';
import { Target, Shield, Award, Users, Briefcase, TrendingUp, Cpu, Globe, ArrowRight } from 'lucide-react';

interface ProfessionalSolutionsProps {
  onToolClick: (slug: string) => void;
  onAllToolsClick: () => void;
}

export default function ProfessionalSolutions({ onToolClick, onAllToolsClick }: ProfessionalSolutionsProps) {
  const solutions = [
    {
      title: "Strategic Pricing",
      desc: "Stop guessing your rates. Our algorithm computes market value, overhead, and profit margins to ensure you never undercharge.",
      icon: <TrendingUp size={24} />,
      linkText: "Calculate your true rate",
      slug: "freelance-rate-calculator"
    },
    {
      title: "Legal Protection",
      desc: "Vetted contract templates that protect your intellectual property and ensure you get paid for every hour worked.",
      icon: <Shield size={24} />,
      linkText: "Generate a contract",
      slug: "contract-builder"
    },
    {
      title: "AI Business Edge",
      desc: "Leverage Gemini-powered intelligence to write proposals, detect client scope creep, and optimize your portfolio copy.",
      icon: <Cpu size={24} />,
      linkText: "Draft an AI proposal",
      slug: "proposal-gen"
    },
    {
      title: "Enterprise Scaling",
      desc: "Transition from 'freelancer' to 'agency owner' with tools built for team capacity planning and revenue projection.",
      icon: <Briefcase size={24} />,
      linkText: "Map team capacity",
      slug: "capacity-planner"
    }
  ];

  return (
    <section className="py-24 bg-white" id="professional-solutions">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-[#0f4c75] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
            <Award size={14} className="text-amber-500" /> Elite Standards
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Engineered for <br className="sm:hidden" /> <span className="italic text-[#0f4c75]">Serious</span> Business
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            We don't do 'simple' placeholders. Every tool is designed with real-world freelance constraints and executive-level requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: idx * 0.1,
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToolClick(item.slug)}
              className="group flex flex-col gap-6 p-8 rounded-3xl transition-all hover:bg-slate-50/80 hover:shadow-xl hover:shadow-slate-200/40 cursor-pointer border border-transparent hover:border-slate-100"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner group-hover:bg-white group-hover:text-[#0f4c75] transition-colors text-[#0f4c75]/70">
                 {item.icon}
              </div>
              <div className="space-y-4">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight group-hover:text-[#0f4c75] transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                       {item.desc}
                    </p>
                 </div>
                 <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 group-hover:text-[#0f4c75] transition-colors">
                    {item.linkText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-8 md:p-12 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="hidden sm:flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <img 
                    key={i} 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-white"
                    referrerPolicy="no-referrer"
                   />
                 ))}
              </div>
              <div>
                 <p className="text-slate-900 font-bold text-sm">Trusted by top consultants globally</p>
                 <p className="text-slate-400 text-xs font-medium">Join a network of 5,000+ registered professionals</p>
              </div>
           </div>
           <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={onAllToolsClick}
            className="group px-8 py-4 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center gap-2"
           >
              Explore Enterprise Suite <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </motion.button>
        </div>
      </div>
    </section>
  );
}
