import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function BottomCTA() {
  return (
    <section className="mt-24 md:mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center shadow-2xl border border-white/5">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 blur-[100px] -ml-48 -mb-48 rounded-full" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
                <Sparkles size={14} /> Global Independence
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight font-display">
                Ready to upgrade your freelance business?
              </h2>
              
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                Join thousands of elite professionals saving hours every week. Get access to AI tools, 
                secure contracts, and cloud storage for your business data.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                >
                  Create Free Account
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="w-full sm:w-auto px-10 py-5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  View Pro Plans <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
