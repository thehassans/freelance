import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Copy, Check, Send, ShieldAlert, BadgeDollarSign, Info, Loader2 } from 'lucide-react';
import { getGenAI } from '../../lib/gemini';
import { toast } from 'sonner';

export default function ScopeCreepMessenger() {
  const [situation, setSituation] = useState('');
  const [amount, setAmount] = useState('250');
  const [tone, setTone] = useState<'firm' | 'polite' | 'direct'>('firm');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const generateDraft = async () => {
    if (!situation) return;

    const ai = getGenAI();
    if (!ai) {
      toast.error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env or .env.local file.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `
        Draft a professional response to a client regarding "Scope Creep".
        
        Situation: ${situation}
        Additional Cost: $${amount}
        Tone: ${tone}
        
        Requirements:
        1. Acknowledge the value of the new request.
        2. Explain clearly that this is outside the original agreed-upon scope.
        3. State the additional cost ($${amount}) for this work.
        4. Ask for approval before proceeding.
        5. Keep it concise, professional, and firm but maintain the relationship.
        
        Return ONLY the email content. No subject line.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setDraft(response.text || '');
    } catch (error: any) {
      console.error('Draft generation failed:', error);
      toast.error(error?.message || 'Failed to generate response. Please check your Gemini API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Scope Sentinel</h3>
              <p className="text-xs text-slate-400">Professional scripts to charge for extra work.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">What happened? (The Creep)</label>
              <textarea 
                value={situation || ''}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Example: Client asked for a new logo version but we only agreed on two revisions."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-danger min-h-[100px] text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Additional Fee ($)</label>
                <div className="relative">
                  <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="number" 
                    value={amount || ''}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-danger font-bold text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Response Tone</label>
                <select 
                  value={tone || 'firm'}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-danger font-bold text-sm appearance-none"
                >
                  <option value="firm">Firm</option>
                  <option value="polite">Polite</option>
                  <option value="direct">Direct</option>
                </select>
              </div>
            </div>

            <button 
              onClick={generateDraft}
              disabled={isGenerating || !situation}
              className="w-full py-4 bg-danger text-white rounded-2xl font-bold hover:bg-danger/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-danger/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Drafting Professional No...
                </>
              ) : (
                <>
                  Generate Response <Send size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-start gap-4">
           <div className="p-3 bg-white rounded-2xl text-danger shadow-sm h-fit">
              <Info size={20} />
           </div>
           <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Protecting Your Time</h4>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "Clients value your expertise, but they will take whatever you give away for free. Charging for extra work is how you train them to respect your scope."
              </p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!draft ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center"
            >
              <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Script Draft</p>
              <p className="text-slate-300 text-sm mt-2">Your professional response will appear here.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[400px]"
            >
              <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                 </div>
                 <button 
                  onClick={copyDraft}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:border-danger hover:text-danger transition-all flex items-center gap-2 shadow-sm"
                 >
                   {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Draft</>}
                 </button>
              </div>
              
              <div className="p-8 sm:p-10 flex-grow">
                 <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium font-sans">
                    {draft}
                 </p>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ready to send via Gmail or Slack</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
