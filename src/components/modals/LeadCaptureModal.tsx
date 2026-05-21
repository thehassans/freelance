import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../../contexts/UserContext';
import { ShieldCheck, X, FileText, Zap, Sparkles, UserPlus } from 'lucide-react';

export default function LeadCaptureModal() {
  const { isLeadCaptureOpen, closeLeadCapture, showAuthModal, proModalFeature } = useUser();

  if (!isLeadCaptureOpen) return null;

  return (
    <AnimatePresence>
      {isLeadCaptureOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLeadCapture}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            <button 
              onClick={closeLeadCapture}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#0f4c75] mb-8 shadow-sm">
                <FileText size={32} />
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
                Unlock Your Remaining 4 Exports
              </h2>
              
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                You have used your free guest export of <span className="text-slate-900 font-bold">{proModalFeature}</span>! 
                Create a free account to instantly unlock 4 more professional PDF exports this month, 
                plus cloud saving and history tracking.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={14} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">4 More Free Exports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={14} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">Secure Cloud Storage</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={14} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">Document History Tracking</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    showAuthModal('signup');
                    closeLeadCapture();
                  }}
                  className="w-full py-5 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0b395a] transition-all shadow-xl shadow-[#0f4c75]/20 flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} /> Create Free Account
                </button>
                <button 
                  onClick={() => {
                    showAuthModal('login');
                    closeLeadCapture();
                  }}
                  className="w-full py-5 bg-white text-[#0f4c75] border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-indigo-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Login to Existing Account
                </button>
              </div>
            </div>

            <div className="px-12 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-amber-400 fill-amber-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Join 10,000+ Freelancers</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
