import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Copy, Check, Loader2, Star, Sparkles, ChevronDown } from 'lucide-react';
import { getGenAI } from '../../lib/gemini';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import { toast } from 'sonner';

export default function TestimonialRequestGenerator() {
  const [clientName, setClientName] = useState('');
  const [coreProblem, setCoreProblem] = useState('');
  const [keyMetric, setKeyMetric] = useState('');
  const [strategicBenefit, setStrategicBenefit] = useState('');

  const [drafts, setDrafts] = useState<{ emailScript: string, option1: string, option2: string, option3: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { executeAction, isProcessing } = usePremiumAction();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const generateSocialProofKit = async () => {
    if (!clientName || !coreProblem || !keyMetric || !strategicBenefit) {
        toast.error('Please fill in all fields to generate the kit.');
        return;
    }

    const ai = getGenAI();
    if (!ai) {
      toast.error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env or .env.local file.');
      return;
    }
    
    executeAction(async (userId) => {
      await DatabaseService.logToolUsage('social-proof-engine');
        
      try {
        const prompt = `
          You are an expert B2B copywriter and conversion strategist.
          I need to ghostwrite a testimonial for my client so they just have to approve it.
          
          Client/Brand Name: ${clientName}
          Core Problem Solved: ${coreProblem}
          Key Quantitative Metric: ${keyMetric}
          Strategic Benefit: ${strategicBenefit}
          
          Generate the following in JSON format:
          {
            "emailScript": "A highly strategic 'Approval Email Script' that says basically: 'To save you time, I went ahead and drafted a few short quotes highlighting the metrics of our recent project. If you are comfortable with it, you can just reply with \\"Option 1 looks great!\\" or feel free to tweak them.'",
            "option1": "Testimonial Option 1: ROI & Metric Focus (Heavy on the numbers). Written from the perspective of the client.",
            "option2": "Testimonial Option 2: Relief & Workflow Focus (Heavy on how easy the agency made the process). Written from the perspective of the client.",
            "option3": "Testimonial Option 3: Short & Punchy Quote (For website banners). Written from the perspective of the client."
          }
          
          Make the quotes sound natural, professional, and results-driven. Do NOT wrap the JSON in markdown code blocks, return ONLY valid JSON.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const text = response.text || '{}';
        // Cleanup markdown if AI ignores instructions
        const cleanJson = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const parsed = JSON.parse(cleanJson);
        
        await DatabaseService.saveUserDocument(userId, 'social_proof_kit', parsed);
        setDrafts(parsed);
        toast.success('Social Proof Kit generated successfully.');
      } catch (error) {
        console.error('Generation failed:', error);
        toast.error('Failed to generate Social Proof Kit. Please try again.');
        throw error; // Rethrow to let executeAction handle error state if needed
      }
    });
  };

  const copyText = (text: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const faqs = [
    {
      q: "Why should I ghostwrite the testimonial?",
      a: "Busy executives and founders rarely have time to write case studies. By providing options, you reduce their cognitive load to a simple 'Yes, approve'."
    },
    {
      q: "What kind of metrics work best?",
      a: "Focus on tangible outcomes. Instead of 'great design', use 'increased conversion rates by 12%' or 'migrated 1,200 SKUs seamlessly'."
    },
    {
      q: "Will clients feel weird about me writing it?",
      a: "Not if framed correctly. The provided email script positions this as a courtesy to save them time, which clients highly appreciate."
    },
    {
      q: "Can I edit the AI-generated quotes?",
      a: "Absolutely. The generated quotes are your baseline. You should review and tweak them to perfectly match your client's specific tone before sending."
    },
    {
      q: "Where should I display these testimonials?",
      a: "Metric-driven testimonials are best utilized on high-friction touchpoints: pricing pages, checkout flows, and direct sales proposals."
    },
    {
      q: "Does generating these quotes consume credits?",
      a: "Yes. Generating the customized 3-quote Social Proof Kit utilizes one freemium credit."
    }
  ];

  return (
    <div className="pb-24">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column - Inputs */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16 rounded-full" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 shadow-sm shadow-indigo-100/50">
                <Star size={24} className="fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">The Strategy</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Provide hard data, not just vibes.</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2 ml-1">Client / Brand Name</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2 ml-1">Core Problem Solved</label>
                <textarea 
                  value={coreProblem}
                  onChange={(e) => setCoreProblem(e.target.value)}
                  placeholder="e.g. Messy inventory sync"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2 ml-1">Key Quantitative Metric</label>
                <input 
                  type="text" 
                  value={keyMetric}
                  onChange={(e) => setKeyMetric(e.target.value)}
                  placeholder="e.g. Migrated 5,000 variants without downtime"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2 ml-1">Strategic Benefit</label>
                <input 
                  type="text" 
                  value={strategicBenefit}
                  onChange={(e) => setStrategicBenefit(e.target.value)}
                  placeholder="e.g. Reduced manual data entry by 15 hours a week"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <button 
                onClick={generateSocialProofKit}
                disabled={isProcessing || !clientName || !coreProblem || !keyMetric || !strategicBenefit}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.25rem] font-bold tracking-wide hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Processing Core Metrics...
                  </>
                ) : (
                  <>
                    Generate Social Proof Kit <Sparkles size={18} className="text-indigo-400" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Results Dashboard */}
        <div className="xl:col-span-8">
          <AnimatePresence mode="wait">
            {!drafts ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[600px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center flex flex-col items-center justify-center"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 text-indigo-300 flex items-center justify-center mb-6">
                   <Quote size={40} className="fill-current opacity-50" />
                </div>
                <h4 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">Zero-Friction Testimonials</h4>
                <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
                  Provide hard data metrics on the left, and we will ghostwrite the perfect 3-option social proof kit for your client to effortlessly approve.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden"
              >
                {/* Approval Email Script */}
                <div className="bg-slate-50 p-8 sm:p-10 border-b border-slate-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                    <div>
                      <h4 className="text-xl font-bold tracking-tight text-slate-900">Section A: The Approval Email</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Send this short intro to frame the request.</p>
                    </div>
                    <button 
                      onClick={() => copyText(drafts.emailScript, setCopiedEmail)}
                      className="shrink-0 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 shadow-sm transition-all flex items-center gap-2"
                    >
                      {copiedEmail ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Script</>}
                    </button>
                  </div>
                  <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 border border-slate-200 shadow-sm relative">
                    <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {drafts.emailScript}
                    </p>
                  </div>
                </div>

                {/* The 3 Options */}
                <div className="p-8 sm:p-10 space-y-8">
                  <div>
                    <h4 className="text-xl font-bold tracking-tight text-slate-900">Section B: Ghostwritten Options</h4>
                    <p className="text-sm font-medium text-slate-500 mt-1">Include these directly in your email for the client to choose from.</p>
                  </div>

                  <div className="grid gap-6">
                    {/* Option 1 */}
                    <div className="border-l-4 border-indigo-500 bg-slate-50 p-6 sm:p-8 rounded-r-[1.5rem]">
                      <div className="font-bold text-[10px] uppercase tracking-widest text-indigo-500 mb-3">Option 1: ROI & Metric Focus</div>
                      <p className="text-slate-800 text-lg leading-relaxed font-medium italic">
                        "{drafts.option1}"
                      </p>
                    </div>

                    {/* Option 2 */}
                    <div className="border-l-4 border-indigo-500 bg-slate-50 p-6 sm:p-8 rounded-r-[1.5rem]">
                      <div className="font-bold text-[10px] uppercase tracking-widest text-indigo-500 mb-3">Option 2: Relief & Workflow Focus</div>
                      <p className="text-slate-800 text-lg leading-relaxed font-medium italic">
                        "{drafts.option2}"
                      </p>
                    </div>

                    {/* Option 3 */}
                    <div className="border-l-4 border-indigo-500 bg-slate-50 p-6 sm:p-8 rounded-r-[1.5rem]">
                      <div className="font-bold text-[10px] uppercase tracking-widest text-indigo-500 mb-3">Option 3: Short & Punchy Quote</div>
                      <p className="text-slate-800 text-lg leading-relaxed font-medium italic">
                        "{drafts.option3}"
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SEO & Educational Section */}
      <div className="max-w-5xl mx-auto py-16 border-t border-slate-200 mt-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            The Zero-Friction Social Proof Framework
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 text-left bg-slate-50 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100">
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 font-black text-xl mb-6 shadow-sm border border-slate-100">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Clients are Busy</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Asking a client to write a testimonial from scratch feels like homework. They will procrastinate or tell you they will do it later. 
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 font-black text-xl mb-6 shadow-sm border border-slate-100">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Eliminate Cognitive Load</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                By providing 3 pre-written, perfectly structured quotes focused on hard metrics, your testimonial acquisition rate increases by over 80%.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center text-balance">Frequently Asked Questions</h3>
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="border border-slate-200 rounded-[1.5rem] overflow-hidden bg-white hover:border-slate-300 transition-colors">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-lg pr-8">{faq.q}</span>
                  <div className={`p-2 rounded-full transition-colors flex-shrink-0 ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-slate-600 leading-relaxed font-medium">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
