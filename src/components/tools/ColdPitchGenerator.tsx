import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Copy, Check, MousePointer2, Target, 
  Trophy, MessageSquare, Briefcase, Mail, 
  Zap, ArrowRight, Layers, Sparkles, RefreshCcw,
  User
} from 'lucide-react';

type Tone = 'Direct & Confident' | 'Polite & Inquiring' | 'Value-First';

export default function ColdPitchGenerator() {
  // 1. STATE MANAGEMENT
  const [recipient, setRecipient] = useState('Sarah');
  const [company, setCompany] = useState('Lumina Tech');
  const [hook, setHook] = useState('');
  const [value, setValue] = useState('');
  const [proof, setProof] = useState('');
  const [cta, setCta] = useState('');
  const [tone, setTone] = useState<Tone>('Value-First');
  
  const [copied, setCopied] = useState(false);

  // 2. COMPILER LOGIC
  const emailContent = useMemo(() => {
    if (!hook.trim()) return null;

    const salutation = tone === 'Direct & Confident' ? `Hi ${recipient},` : 
                       tone === 'Polite & Inquiring' ? `Dear ${recipient},` :
                       `Hi ${recipient},`;
    
    return {
      salutation,
      hook: hook.trim(),
      value: value.trim(),
      proof: proof.trim(),
      cta: cta.trim(),
      signOff: "Best,\n[Your Name]"
    };
  }, [recipient, hook, value, proof, cta, tone]);

  const subjectLines = useMemo(() => {
    if (!company.trim()) return ['Question for your team', 'Idea for your growth', 'Regarding your site'];
    return [
      `Quick question for ${company}`,
      `Thought on ${company}'s current performance`,
      `Problem I spotted at ${company}`
    ];
  }, [company]);

  const handleCopy = () => {
    if (!emailContent) return;
    const fullText = `Subject: ${subjectLines[0]}\n\n${emailContent.salutation}\n\n${emailContent.hook}\n\n${emailContent.value}\n\n${emailContent.proof}\n\n${emailContent.cta}\n\n${emailContent.signOff}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 min-h-[800px]">
      {/* 1. THE FRAMEWORK INPUT ENGINE (Left Panel) */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 overflow-y-auto max-h-[850px] custom-scrollbar">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 leading-tight">Sales Framework</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Psychological Outreach Engine</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recipient Context */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={recipient || ''}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all pl-10"
                  />
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Company</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={company || ''}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all pl-10"
                  />
                  <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* The Hook */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Target size={12} className="text-red-500" />
                The Hook (Pain Point)
              </label>
              <textarea 
                value={hook || ''}
                onChange={(e) => setHook(e.target.value)}
                placeholder="e.g., I noticed your WooCommerce site takes 6 seconds to load on mobile, which usually kills conversions."
                className="w-full h-24 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
              />
            </div>

            {/* The Value */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Sparkles size={12} className="text-blue-500" />
                The Value (Solution)
              </label>
              <textarea 
                value={value || ''}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., I specialize in headless Shopify migrations that cut load times under 1 second."
                className="w-full h-24 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>

            {/* The Proof */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Trophy size={12} className="text-emerald-500" />
                The Proof (Authority)
              </label>
              <input 
                type="text" 
                value={proof || ''}
                onChange={(e) => setProof(e.target.value)}
                placeholder="e.g., I just did this for [Competitor] and boosted sales 20%."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* CTA & Tone */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <MousePointer2 size={12} />
                  Call to Action
                </label>
                <input 
                  type="text" 
                  value={cta || ''}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g., Open to a 10-minute chat?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <MessageSquare size={12} />
                  Tone
                </label>
                <select 
                  value={tone || 'Value-First'}
                  onChange={(e) => setTone(e.target.value as Tone)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none appearance-none cursor-pointer"
                >
                  <option>Value-First</option>
                  <option>Direct & Confident</option>
                  <option>Polite & Inquiring</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE EMAIL COMPILER (Right Panel) */}
      <div className="flex flex-col gap-6">
        <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-full relative">
          {/* Email Header */}
          <div className="bg-white p-8 border-b border-slate-100 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                      <Mail size={14} />
                   </div>
                   <span className="text-xs font-bold text-slate-400 uppercase">New Message</span>
                </div>
                <div className="flex gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
             </div>
             
             <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 py-1 border-b border-slate-50">
                   <span className="text-[10px] font-black text-slate-400 uppercase w-12">To:</span>
                   <span className="text-[10px] font-bold text-slate-700">{recipient} &lt;{company.toLowerCase().replace(/\s/g, '')}@company.ini&gt;</span>
                </div>
                <div className="flex items-start gap-3 py-1">
                   <span className="text-[10px] font-black text-slate-400 uppercase w-12 shrink-0 pt-0.5">Subject:</span>
                   <div className="flex flex-col gap-1.5 flex-1">
                      {subjectLines.map((line, i) => (
                        <div key={i} className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center justify-between group ${i === 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                           {line}
                           {i === 0 && <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Winning Subject</span>}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Email Body */}
          <div className="flex-1 bg-white p-10 font-sans relative overflow-y-auto custom-scrollbar">
            {!emailContent ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 filter grayscale">
                 <Mail size={48} className="mb-4 text-slate-300" />
                 <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Awaiting Pitch Inputs...</p>
                 <p className="text-xs font-medium text-slate-500 mt-2">Start with a pain point to see the transformation</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-slate-700 space-y-4 max-w-xl mx-auto leading-relaxed"
              >
                <div className="text-sm font-medium">{emailContent.salutation}</div>
                
                <div className="group relative">
                  <span className="text-sm font-medium border-b-2 border-red-100 bg-red-50/30 px-1 py-0.5 rounded cursor-help transition-all hover:bg-red-50">
                    {emailContent.hook}
                  </span>
                  <div className="absolute -left-20 top-0 opacity-0 group-hover:opacity-100 transition-opacity hidden xl:block">
                     <span className="text-[9px] font-black text-red-500 uppercase tracking-widest rotate-[-90deg] block">THE HOOK</span>
                  </div>
                </div>

                <div className="group relative">
                  <span className="text-sm font-medium border-b-2 border-blue-100 bg-blue-50/30 px-1 py-0.5 rounded cursor-help transition-all hover:bg-blue-50">
                    {emailContent.value}
                  </span>
                  <div className="absolute -left-20 top-0 opacity-0 group-hover:opacity-100 transition-opacity hidden xl:block">
                     <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest rotate-[-90deg] block">THE VALUE</span>
                  </div>
                </div>

                <div className="group relative">
                  <span className="text-sm font-medium border-b-2 border-emerald-100 bg-emerald-50/30 px-1 py-0.5 rounded cursor-help transition-all hover:bg-emerald-50">
                    {emailContent.proof}
                  </span>
                  <div className="absolute -left-20 top-0 opacity-0 group-hover:opacity-100 transition-opacity hidden xl:block">
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest rotate-[-90deg] block">THE PROOF</span>
                  </div>
                </div>

                <div className="group relative">
                  <span className="text-sm font-bold border-b-2 border-slate-100 bg-slate-50/50 px-1 py-0.5 rounded cursor-help transition-all hover:bg-slate-100 italic">
                    {emailContent.cta}
                  </span>
                  <div className="absolute -left-20 top-0 opacity-0 group-hover:opacity-100 transition-opacity hidden xl:block">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest rotate-[-90deg] block">THE ASK</span>
                  </div>
                </div>

                <div className="pt-6 text-sm font-medium text-slate-400 whitespace-pre-wrap">
                  {emailContent.signOff}
                </div>
              </motion.div>
            )}
          </div>

          {/* SaaS Actions */}
          <div className="p-8 bg-slate-100 border-t border-slate-200 space-y-6">
             <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={handleCopy}
                  disabled={!emailContent}
                  className="flex-1 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/10 disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy to Clipboard
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    const params = new URLSearchParams({
                      client: company,
                      painpoint: hook
                    });
                    window.location.href = `/tools/ai-proposal-generator?${params.toString()}`;
                  }}
                  className="px-8 py-5 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:border-indigo-600 hover:text-indigo-600 active:scale-95 transition-all group shadow-sm shadow-slate-200/50"
                >
                   Draft Full Proposal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             
             <div className="flex items-center justify-center gap-6 py-2 border-t border-slate-200/50">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compiler Ready</span>
                </div>
                <div className="flex items-center gap-2">
                   <Layers size={10} className="text-indigo-400" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Framework Valid</span>
                </div>
                <div className="flex items-center gap-2">
                   <RefreshCcw size={10} className="text-indigo-400" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Auto-Formatting</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
