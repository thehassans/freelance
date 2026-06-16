import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { trackWaitlistClick } from '../../lib/adminStorage';

interface LockedToolOverlayProps {
  compact?: boolean;
  toolId?: string;
}

export default function LockedToolOverlay({ compact = false, toolId }: LockedToolOverlayProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  const handleTrackClick = () => {
    if (toolId && !hasTracked) {
      trackWaitlistClick(toolId);
      setHasTracked(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    handleTrackClick();
    setSubmitted(true);
    toast.success(`You've been added to the waitlist! We'll notify ${email} as soon as Pro access is live.`);
    setEmail('');
  };

  return (
    <div 
      onClick={handleTrackClick}
      className="relative w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 md:p-10 text-center shadow-xl backdrop-blur-md"
    >
      {/* Decorative background gradients */}
      <span className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
      <span className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />

      <div className="relative flex flex-col items-center max-w-lg mx-auto">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm animate-pulse">
          <Lock size={24} className="stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-4 border border-indigo-100/50">
          Pro Access Required
        </span>

        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
          Coming Soon to Freemium
        </h3>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
          This advanced utility is currently being wired up to our premium API network. It will be available soon as part of our professional operations suite.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-6 py-3.5 text-emerald-800 text-sm font-semibold w-full">
            <Check size={18} className="stroke-[2.5]" />
            Waitlist Joined! We'll stay in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-850 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-3 text-sm font-bold text-white shadow-md active:bg-indigo-800 transition-all cursor-pointer whitespace-nowrap"
            >
              Join the Waitlist
              <ChevronRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
