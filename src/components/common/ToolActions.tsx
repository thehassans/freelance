import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Download, Copy, Check, Mail, Lock, Sparkles, X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useFeatureGate } from '../../hooks/useFeatureGate';

interface ToolActionsProps {
  onCopy: () => void;
  onDownload?: () => void;
  onSave?: () => void;
  isGenerating?: boolean;
  canDownloadFree?: boolean;
  id?: string;
}

export default function ToolActions({ onCopy, onDownload, onSave, isGenerating, canDownloadFree = true, id }: ToolActionsProps) {
  const { user, login, tier, isPro } = useUser();
  const { requirePro } = useFeatureGate();
  const [copied, setCopied] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleDownload = () => {
    if (canDownloadFree) {
      onDownload?.();
      return;
    }

    requirePro("PDF Export", () => onDownload?.());
  };

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailAction = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setShowEmailCapture(false);
      setSent(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-0 start-0 end-0 z-40 p-4 md:relative md:p-0 bg-white/80 backdrop-blur-md md:bg-transparent border-t border-slate-100 md:border-0 shadow-2xl md:shadow-none animate-in slide-in-from-bottom duration-500">
      <div className="max-w-xl mx-auto md:max-w-none flex flex-col sm:flex-row gap-3">
        <button 
          onClick={handleCopy}
          className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 group"
        >
          {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} className="group-hover:scale-110 transition-transform" /> Copy</>}
        </button>

        <div className="flex gap-2 flex-1">
          {user ? (
             <button 
              onClick={handleDownload}
              className="flex-grow py-4 px-6 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
             >
               {canDownloadFree ? <Download size={18} /> : <Lock size={18} className="text-amber-500" />}
               {canDownloadFree ? 'Download PDF' : 'Export Pro PDF'}
             </button>
          ) : (
             <button 
              onClick={() => setShowEmailCapture(true)}
              className="flex-grow py-4 px-6 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all active:scale-95 group"
             >
                <Mail size={18} className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" /> Email Result
             </button>
          )}

          {!user && (
            <button 
              onClick={login}
              className="p-4 bg-primary/10 text-primary rounded-2xl flex items-center justify-center hover:bg-primary/20 transition-all shadow-sm ring-1 ring-primary/20"
              title="Save to My History"
            >
              <Save size={18} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showEmailCapture && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 max-w-md w-full shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
               <button 
                onClick={() => setShowEmailCapture(false)}
                className="absolute top-6 end-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
               >
                 <X size={20} />
               </button>

               <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <Mail size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Bypass Account?</h3>
                  <p className="text-slate-500 text-sm mb-8">We'll send this calculation straight to your inbox. No strings attached.</p>

                  <form onSubmit={handleEmailAction} className="space-y-4">
                     <input 
                       type="email" 
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="your-email@example.com"
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-center font-bold"
                     />
                     <button 
                      type="submit"
                      disabled={sent}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                     >
                       {sent ? <><Check size={18} /> Done! Check your inbox</> : 'Send Me My Result'}
                     </button>
                  </form>

                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Sparkles size={14} className="text-ai" /> Join 10k+ Freelancers
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
