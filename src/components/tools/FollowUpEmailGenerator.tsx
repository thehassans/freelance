import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, Copy, Check, Loader2, MessageSquare, Coffee, ShieldAlert, Sparkles, Clock, Lock, RotateCcw, ExternalLink, X, ArrowRight, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useUser } from '../../contexts/UserContext';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import FreemiumExportWrapper from '../common/FreemiumExportWrapper';
import { toast } from 'sonner';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Situation = 'proposal_followup' | 'overdue_invoice' | 'project_checkin' | 'feedback_request';

export default function FollowUpEmailGenerator() {
  const { isPro, aiUsageCount, consumeCredit, showProModal: showUserProModal, user } = useUser();
  const { executeAction, isProcessing } = usePremiumAction();
  const [situation, setSituation] = useState<Situation>('proposal_followup');
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  
  // Dynamic fields
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [daysOverdue, setDaysOverdue] = useState('');
  const [dateSent, setDateSent] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  
  const [tone, setTone] = useState<'friendly' | 'firm' | 'final_notice'>('friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLocalProModal, setShowLocalProModal] = useState(false);

  const generateDraft = async () => {
    if (!clientName) return;

    executeAction(async (userId) => {
      setIsGenerating(true);
      
      const contextMap = {
        proposal_followup: `Follow up on a proposal sent${dateSent ? ` on ${dateSent}` : ' recently'} that hasn't received a response yet.`,
        overdue_invoice: `Remind the client about an invoice${invoiceAmount ? ` for $${invoiceAmount}` : ''} that is${daysOverdue ? ` ${daysOverdue} days` : ''} past its due date.`,
        project_checkin: "Check in on project progress or ask for required assets/feedback to move forward.",
        feedback_request: "Request feedback or a testimonial after project completion."
      };

      try {
        await DatabaseService.logToolUsage('follow-up-email');
        
        const prompt = `
          Draft a professional follow-up email for a freelance business.
          
          Situation: ${contextMap[situation]}
          Client Name: ${clientName}
          Project: ${projectName}
          Sender Name: ${user?.displayName || 'a freelancer'}
          Tone: ${tone.replace('_', ' ')}
          ${isPro && additionalContext ? `Additional Context to include: ${additionalContext}` : ''}
          
          Requirements:
          - Professional and concise.
          - Clearly state the purpose of the email.
          - Maintain a positive relationship (unless it's a final notice).
          - Include a clear call to action.
          - Sign off as ${user?.displayName || '[Your Name]'}.
          
          Return the result in EXACTLY this format:
          Subject: [Optimal Subject Line]
          Body: [The Email Body]
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        const text = response.text || '';
        const subjectMatch = text.match(/Subject: (.*)/i);
        const bodyMatch = text.match(/Body:([\s\S]*)/i);

        if (subjectMatch && bodyMatch) {
          setSubject(subjectMatch[1].trim());
          setBody(bodyMatch[1].trim());
        } else {
          // Fallback
          setSubject(`Follow up: ${projectName || 'Our Project'}`);
          setBody(text.replace(/Subject: .*/i, '').replace(/Body: /i, '').trim());
        }
      } catch (error) {
        console.error('Draft generation failed:', error);
      } finally {
        setIsGenerating(false);
      }
    });
  };

  const copyDraft = () => {
    const fullContent = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInEmailClient = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-ai/10 text-ai flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Follow-Up Engine</h3>
              <p className="text-xs text-slate-400">Never let a lead go cold or an invoice go unpaid.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">The Situation</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'proposal_followup', label: 'Proposal Follow-up', icon: Send },
                  { id: 'overdue_invoice', label: 'Overdue Invoice', icon: ShieldAlert },
                  { id: 'project_checkin', label: 'Project Check-in', icon: Clock },
                  { id: 'feedback_request', label: 'Feedback Request', icon: MessageSquare },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSituation(s.id as Situation)}
                    disabled={isGenerating}
                    className={`p-3 rounded-xl border text-[10px] font-bold transition-all flex flex-col items-center gap-2 ${
                      situation === s.id 
                      ? 'bg-ai/5 border-ai text-ai shadow-sm shadow-ai/10' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                    } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <s.icon size={16} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Client Name</label>
                <input 
                  type="text" 
                  value={clientName || ''}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={isGenerating}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-ai text-sm font-medium transition-all disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Project Name</label>
                <input 
                  type="text" 
                  value={projectName || ''}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={isGenerating}
                  placeholder="e.g. Q3 Brand Audit"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-ai text-sm font-medium transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {situation === 'overdue_invoice' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Invoice Amount ($)</label>
                    <input 
                      type="number" 
                      value={invoiceAmount || ''}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      disabled={isGenerating}
                      placeholder="0.00"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-ai text-sm font-medium disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Days Overdue</label>
                    <input 
                      type="number" 
                      value={daysOverdue || ''}
                      onChange={(e) => setDaysOverdue(e.target.value)}
                      disabled={isGenerating}
                      placeholder="e.g. 15"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-ai text-sm font-medium disabled:opacity-50"
                    />
                  </div>
                </motion.div>
              )}

              {situation === 'proposal_followup' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Date Proposal Sent</label>
                  <input 
                    type="date" 
                    value={dateSent || ''}
                    onChange={(e) => setDateSent(e.target.value)}
                    disabled={isGenerating}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-ai text-sm font-medium disabled:opacity-50"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Context (Optional)</label>
                {!isPro && (
                  <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md">
                    <Lock size={10} /> Pro Only
                  </span>
                )}
              </div>
              <div className="relative group" onClick={() => !isPro && setShowLocalProModal(true)}>
                <textarea 
                  value={additionalContext || ''}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  disabled={!isPro || isGenerating}
                  placeholder={isPro ? "e.g. Mention we met at the coffee shop and I enjoyed our chat about brand strategy..." : "Unlock custom context with Pro..."}
                  className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none text-sm font-medium transition-all min-h-[100px] resize-none ${!isPro ? 'cursor-not-allowed opacity-50' : 'focus:border-ai'} ${isGenerating ? 'opacity-50' : ''}`}
                />
                {!isPro && (
                  <div className="absolute inset-0 z-10 cursor-pointer" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Desired Tone</label>
              <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                {(['friendly', 'firm', 'final_notice'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    disabled={isGenerating}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black transition-all capitalize ${
                      tone === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    } ${isGenerating ? 'opacity-50' : ''}`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button 
                onClick={generateDraft}
                disabled={isGenerating || !clientName}
                className="w-full py-5 bg-ai text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-ai/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> GENERATING AI SCRIPT...
                  </>
                ) : (
                  <>
                    Generate Draft {!isPro && <Zap size={14} className="text-amber-300" fill="currentColor" />} <Sparkles size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-ai/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
           <div className="flex gap-4 relative z-10">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-ai h-fit">
                <Coffee size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">Freelance Etiquette</h4>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "The fortune is in the follow-up. Most deals aren't closed on the first email, but on the third or fourth."
                </p>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8">
        <AnimatePresence mode="wait">
          {!subject && !body ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Send size={40} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Awaiting Parameters</p>
              <p className="text-slate-300 text-sm max-w-[250px] mx-auto leading-relaxed">
                Provide client details and select a situation to generate a high-conversion follow-up email.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[500px]"
            >
              <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-ai animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Optimized Follow-up Draft</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <Check size={14} className="text-emerald-500" /> Draft Ready
                 </div>
              </div>
              
              <div className="p-8 sm:p-10 flex-grow font-sans space-y-6">
                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-ai mb-2">Subject Line</label>
                   <p className="text-slate-900 text-lg font-bold">
                      {subject}
                   </p>
                 </div>
                 <div className="pt-6 border-t border-slate-50">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Body</label>
                   <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {body}
                   </p>
                 </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                 <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={copyDraft}
                      className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-700 hover:border-ai hover:text-ai'
                      }`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />} 
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button 
                      onClick={generateDraft}
                      disabled={isGenerating}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-ai hover:border-ai transition-all"
                      title="Regenerate"
                    >
                      <RotateCcw size={18} className={isGenerating ? 'animate-spin' : ''} />
                    </button>
                 </div>
                 
                 <button 
                  onClick={openInEmailClient}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg"
                 >
                   Open in Email Client <ExternalLink size={16} />
                 </button>

                 <div className="flex items-center justify-between pt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Vibe: {tone === 'friendly' ? '🟢 Protected' : tone === 'firm' ? '🟡 Professional' : '🔴 Escalated'}
                    </span>
                    <Mail className="text-slate-200" size={16} />
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pro Modal */}
      <AnimatePresence>
        {showLocalProModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocalProModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center"
            >
              <button 
                onClick={() => setShowLocalProModal(false)}
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-ai/10 text-ai rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">PRO FEATURE</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                Unlock custom context, tone fine-tuning, and personalized templates with a Pro account.
              </p>
              <button 
                onClick={() => {
                  setShowLocalProModal(false);
                  showUserProModal('Custom Filter Context');
                }}
                className="w-full py-4 bg-ai text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-ai/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Upgrade to Pro <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
