import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShieldCheck, Crown, ArrowRight } from 'lucide-react';

interface ProGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature?: string;
}

export default function ProGateModal({ isOpen, onClose, onUpgrade, feature = "This" }: ProGateModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 text-center">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                id="close-pro-gate"
              >
                <X size={20} />
              </button>

              <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Crown size={40} />
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Pro Feature</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                {feature === "Exporting clean PDFs" 
                  ? "Exporting clean, unwatermarked PDFs is a Pro feature." 
                  : `${feature} is reserved for our Pro members.`}
                {" "}Upgrade now to unlock unlimited access and scale your business.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={onUpgrade}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 group"
                  id="upgrade-from-gate"
                >
                  Upgrade Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                >
                  Maybe Later
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-40">
                <ShieldCheck size={20} />
                <Sparkles size={20} />
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted by 10k+ Freelancers</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
