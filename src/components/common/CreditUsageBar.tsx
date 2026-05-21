import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { Sparkles, Zap, ShieldAlert } from 'lucide-react';
import { getAnonymousUses } from '../../lib/storage';

export default function CreditUsageBar() {
  const { user, isPro, aiUsageCount, showProModal, showLeadCapture } = useUser();
  
  if (isPro) return null;

  const anonymousUses = getAnonymousUses();
  
  if (!user) {
    const guestLimit = 1;
    const guestRemaining = Math.max(guestLimit - anonymousUses, 0);
    const guestPercentage = Math.min((anonymousUses / guestLimit) * 100, 100);

    return (
      <div className="mb-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-3xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0f4c75]">
              <ShieldAlert size={16} />
            </div>
            <p className="text-xs font-bold text-slate-700">
              Guest Mode: {guestRemaining} Free Export Remaining
            </p>
          </div>
          <button 
            onClick={() => showLeadCapture('Lead Generation')}
            className="text-[10px] font-black uppercase tracking-widest text-[#0f4c75] hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            Sign Up for 5 <Sparkles size={10} className="fill-amber-400 text-amber-400" />
          </button>
        </div>

        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0f4c75] transition-all duration-1000 ease-out"
            style={{ width: `${guestPercentage}%` }}
          />
        </div>
        
        <p className="text-[10px] text-slate-500 font-medium mt-2">
          Guests get 1 limited export. <button onClick={() => showLeadCapture('Lead Generation')} className="text-[#0f4c75] font-black underline">Sign up free</button> to unlock cloud saves and 4 more exports.
        </p>
      </div>
    );
  }

  const limit = 5;
  const percentage = Math.min((aiUsageCount / limit) * 100, 100);
  const remaining = Math.max(limit - aiUsageCount, 0);

  return (
    <div className="mb-6 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
            <Zap size={16} />
          </div>
          <p className="text-xs font-bold text-slate-700">
            {remaining} free generation{remaining !== 1 ? 's' : ''} remaining
          </p>
        </div>
        <button 
          onClick={() => showProModal('Unlimited AI Usage')}
          className="text-[10px] font-black uppercase tracking-widest text-[#0f4c75] hover:opacity-70 transition-opacity flex items-center gap-1"
        >
          Upgrade for Unlimited <Sparkles size={10} className="fill-amber-400 text-amber-400" />
        </button>
      </div>

      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${
            aiUsageCount >= 5 
              ? 'bg-rose-500' 
              : aiUsageCount === 4 
              ? 'bg-amber-500' 
              : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-[10px] text-slate-400 font-medium mt-2">
        You have used {aiUsageCount} of 5 free monthly generations.
      </p>
    </div>
  );
}
