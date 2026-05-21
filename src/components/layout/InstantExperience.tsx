import React from 'react';
import { motion } from 'motion/react';
import { Zap, Clock, Shield, Sparkles, Layout, Globe, MousePointer2, Rocket } from 'lucide-react';

export default function InstantExperience({ onProClick }: { onProClick: () => void }) {
  const features = [
    {
      title: "TEAM CAPACITY PLANNING",
      description: "Visualize bandwidth, track assigned hours, and prevent team burnout before it happens.",
      icon: <MousePointer2 size={24} className="text-[#0f4c75]" />,
    },
    {
      title: "CLIENT PORTALS & CRM",
      description: "Manage relationships with dedicated, secure client dashboards and automated contract portals.",
      icon: <Layout size={24} className="text-amber-500" />,
    },
    {
      title: "UNLIMITED AI WORKFLOWS",
      description: "Bypass standard usage limits. Generate unlimited high-ticket proposals and technical architectures.",
      icon: <Sparkles size={24} className="text-[#0f4c75]" />,
    },
    {
      title: "CUSTOM AGENCY BRANDING",
      description: "Remove all watermarks and automatically apply your custom brand identity to every exported PDF and spreadsheet.",
      icon: <Shield size={24} className="text-emerald-500" />,
    }
  ];

  return (
    <section className="py-24 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-[#0f4c75] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6"
              >
                <Zap size={14} /> Professional Infrastructure
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8 font-display"
              >
                Scale Your Operations. <br />
                <span className="text-[#0f4c75]">Protect Your Time.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-lg"
              >
                Transition from solo freelancer to full-scale agency. Unlock the advanced capacity planners, client portals, and automated workflows used by elite professionals.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
               {features.map((feature, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   whileHover={{ y: -6 }}
                   whileTap={{ scale: 0.97 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{ 
                     delay: 0.3 + (idx * 0.1),
                     type: "spring",
                     stiffness: 400,
                     damping: 30
                   }}
                   className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#0f4c75]/20 transition-all hover:shadow-md cursor-default"
                 >
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">{feature.title}</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{feature.description}</p>
                 </motion.div>
               ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="pt-4"
            >
               <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={onProClick}
                className="flex items-center gap-4 group"
               >
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-[#0f4c75] transition-colors shadow-xl">
                     <Rocket size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">UNLOCK ADVANCED TOOLS</p>
                     <p className="text-sm font-bold text-slate-900 group-hover:text-[#0f4c75] transition-colors">View Pro Features &rarr;</p>
                  </div>
               </motion.button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative lg:h-full lg:flex lg:items-center"
          >
             {/* Visual Representation of "Instant" */}
             <div className="w-full aspect-square sm:aspect-[4/3] lg:aspect-square bg-slate-100 rounded-[3rem] sm:rounded-[4rem] relative overflow-hidden p-6 sm:p-12">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#0f4c75]/10 to-amber-500/5" />
                
                <div className="relative h-full border-2 border-white/50 rounded-[2rem] sm:rounded-[3rem] shadow-2xl flex flex-col p-6 sm:p-8 overflow-hidden bg-white/40 backdrop-blur-md">
                   <div className="flex items-center justify-between mb-8 sm:mb-12">
                      <div className="flex items-center gap-2">
                         <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-400" />
                         <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-amber-400" />
                         <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-emerald-400" />
                      </div>
                      <div className="px-3 py-1 bg-[#0f4c75] text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                         Processing
                      </div>
                   </div>

                   <div className="space-y-4 sm:space-y-6 flex-grow">
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-8 sm:h-10 w-3/4 bg-slate-200 rounded-xl sm:rounded-2xl origin-left" 
                      />
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-8 sm:h-10 w-full bg-[#0f4c75]/10 rounded-xl sm:rounded-2xl origin-left" 
                      />
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-24 sm:h-32 w-full bg-slate-100 rounded-xl sm:rounded-2xl origin-left" 
                      />
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-8 sm:h-10 w-2/3 bg-slate-200 rounded-xl sm:rounded-2xl origin-left" 
                      />
                   </div>

                   <div className="mt-8 sm:mt-auto flex items-center gap-4 text-slate-400">
                      <Clock size={16} />
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#0f4c75] animate-pulse">0.4s to Generation</span>
                   </div>
                </div>

                {/* Floaties - Hidden on smallest mobile screens for cleaner look */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-1/4 -right-2 sm:-right-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 hidden sm:block"
                >
                   <Sparkles className="text-amber-500" size={20} />
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-1/4 -left-2 sm:-left-4 bg-[#0f4c75] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl hidden sm:block"
                >
                   <Globe className="text-white" size={20} />
                </motion.div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
