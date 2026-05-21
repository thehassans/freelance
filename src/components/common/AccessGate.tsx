import React from 'react';
import { motion } from 'motion/react';
import { Lock, Zap, ArrowRight } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface AccessGateProps {
  children: React.ReactNode;
  requiredTier: 'FREE' | 'FREEMIUM' | 'PRO';
  toolName: string;
}

export default function AccessGate({ children, requiredTier, toolName }: AccessGateProps) {
  const { tier, loading, login } = useUser();

  if (loading) return null;

  const hasAccess = () => {
    if (requiredTier === 'FREE' || requiredTier === 'FREEMIUM') return true;
    if (requiredTier === 'PRO') return tier === 'PRO';
    return false;
  };

  if (!hasAccess()) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200 p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-[#0f4c75]" />
          
          <div className="w-20 h-20 bg-[#0f4c75]/10 rounded-3xl flex items-center justify-center text-[#0f4c75] mx-auto mb-8">
            <Lock size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">
            Pro Access Required
          </h2>
          
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            The <span className="text-slate-900 font-bold">"{toolName}"</span> is part of our professional operations suite. Upgrade to Pro to unlock advanced tools, team capacity planning, and CRM syncing.
          </p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => window.location.href = '/pro'}
              className="w-full py-4 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#0b395a] transition-all shadow-xl shadow-[#0f4c75]/20 flex items-center justify-center gap-2"
            >
              Learn More About Pro <ArrowRight size={14} />
            </button>
            
            <button 
              onClick={login}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#0f4c75] transition-colors"
            >
              Sign in to Check Account
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
            <Zap size={10} className="text-[#0f4c75]" /> Trusted by 5,000+ Pros
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
