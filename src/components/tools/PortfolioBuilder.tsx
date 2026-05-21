import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Copy, FileText, Check, Loader2, Target, Trophy, Lightbulb, Globe, Palette, Trash2, Maximize2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from '../../contexts/UserContext';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import FreemiumExportWrapper from '../common/FreemiumExportWrapper';
import { historyService } from '../../lib/history-service';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default function PortfolioBuilder() {
  const { user, isPro, aiUsageCount, consumeCredit, showProModal } = useUser();
  const { executeAction, isProcessing } = usePremiumAction();
  const [projectNotes, setProjectNotes] = useState('');
  const [clientGoals, setClientGoals] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#6c63ff');
  const [caseStudy, setCaseStudy] = useState<{
    title: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const colors = ['#6c63ff', '#0f4c75', '#1b998b', '#ea580c', '#1a1a2e', '#ff6b6b', '#f59e0b'];

  const canGenerate = isPro || aiUsageCount < 5;

  const generateCaseStudy = async () => {
    if (!projectNotes || !clientGoals) return;
    
    executeAction(async (userId) => {
      setIsGenerating(true);
      setPublishUrl(null);
      
      try {
        await DatabaseService.logToolUsage('portfolio-builder');
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
          Convert these project notes into a professional STAR format case study.
          
          Client Goals: ${clientGoals}
          Project Notes: ${projectNotes}
          
          Return the result as a JSON object with strictly these keys:
          "title" (A catchy, professional project title),
          "situation" (The context and conflict),
          "task" (What was required and the challenges),
          "action" (Specific steps taken and technical details),
          "result" (The outcome, metrics, and success).
          
          Style: Professional, data-driven, and persuasive.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean up JSON if necessary
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const cleanJson = text.substring(jsonStart, jsonEnd);
        
        const data = JSON.parse(cleanJson || '{}');
        setCaseStudy(data);
        toast.success('Case study generated via AI.');
      } catch (error) {
        console.error('Generation failed:', error);
        toast.error('Failed to generate Case Study.');
      } finally {
        setIsGenerating(false);
      }
    });
  };

  const handlePublish = async () => {
    if (!caseStudy) return;

    executeAction(async (userId) => {
      setIsPublishing(true);
      
      try {
        await DatabaseService.logToolUsage('portfolio-publish');
        
        const payload = {
          ...caseStudy,
          primaryColor,
          userId: userId,
          createdAt: new Date().toISOString()
        };
        
        const docRef = await DatabaseService.saveUserDocument(userId, 'case_study', payload);
        
        // This is a mock URL for now
        const url = `${window.location.origin}/p/` + Math.random().toString(36).substring(7);
        setPublishUrl(url);

        // Save to history
        historyService.addToHistory({
          toolId: 'portfolio-builder',
          toolName: 'Portfolio Builder',
          summary: `Case Study: ${caseStudy.title}`,
          data: { caseStudy, publishUrl: url, primaryColor }
        });
        
        toast.success('Live Portfolio Published.');

      } catch (error) {
        console.error('Publish failed:', error);
        toast.error('Publish failed.');
      } finally {
        setIsPublishing(false);
      }
    });
  };

  const copyToClipboard = () => {
    if (!caseStudy) return;
    const text = `
${caseStudy.title}

Situation:
${caseStudy.situation}

Task:
${caseStudy.task}

Action:
${caseStudy.action}

Result:
${caseStudy.result}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-ai/10 text-ai flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Case Study Draft</h3>
              <p className="text-xs text-slate-400">Turn messy notes into a winning portfolio entry.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Branding Section */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Palette size={14} /> Global Style
              </h4>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Accent Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setPrimaryColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${primaryColor === c ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Client Goals</label>
              <textarea 
                value={clientGoals || ''}
                onChange={(e) => setClientGoals(e.target.value)}
                placeholder="What was the client trying to achieve? (e.g. increase sales by 20%, rebrand for a younger audience)"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-ai min-h-[100px] text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Project Execution Notes</label>
              <textarea 
                value={projectNotes || ''}
                onChange={(e) => setProjectNotes(e.target.value)}
                placeholder="What did you actually do? Mention tech stacks, specific problems solved, and creative decisions."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-ai min-h-[150px] text-sm resize-none"
              />
            </div>
            <FreemiumExportWrapper toolId="portfolio-builder" className="mt-4">
              <button 
                onClick={generateCaseStudy}
                disabled={isGenerating || !projectNotes}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Analyzing Proof of Work...
                  </>
                ) : (
                  <>
                    Generate Case Study <Send size={18} />
                  </>
                )}
              </button>
            </FreemiumExportWrapper>
          </div>
        </div>

        <div className="p-6 bg-ai/5 rounded-3xl border border-ai/10">
          <div className="flex gap-4">
             <div className="p-3 bg-white rounded-2xl text-ai shadow-sm h-fit">
                <Lightbulb size={20} />
             </div>
             <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Portfolio Pro Tip</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The **STAR** method is preferred by recruiters at Google and Amazon. It focuses on measurable outcomes rather than just a list of tasks.
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!caseStudy ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center"
            >
              <FileText size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Preview Area</p>
              <p className="text-slate-300 text-sm mt-2">Your generated case study will appear here.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-10 text-white relative" style={{ backgroundColor: primaryColor }}>
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <FileText size={120} />
                </div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Case Study</span>
                  <h3 className="text-3xl font-black font-display tracking-tight leading-tight">{caseStudy.title}</h3>
                </div>
              </div>

              <div className="p-8 sm:p-10 space-y-10">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                      <Target size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Situation</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{caseStudy.situation}</p>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                      <FileText size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Task</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{caseStudy.task}</p>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                      <Sparkles size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Action</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{caseStudy.action}</p>
                </section>

                <section className="p-6 rounded-2xl border" style={{ backgroundColor: `${primaryColor}05`, borderColor: `${primaryColor}20` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                      <Trophy size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: `${primaryColor}99` }}>Result</h4>
                  </div>
                  <p className="text-slate-700 text-sm font-medium leading-relaxed">{caseStudy.result}</p>
                </section>

                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button 
                      onClick={copyToClipboard}
                      className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border border-slate-200"
                    >
                      {copied ? <><Check size={18} className="text-success" /> Copied!</> : <><Copy size={18} /> Copy to Clipboard</>}
                    </button>
                    {!publishUrl && (
                      <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex-1 py-4 bg-ai text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-ai/20"
                      >
                        {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
                        {isPublishing ? 'Publishing...' : 'Publish to Web'}
                      </button>
                    )}
                  </div>

                  {publishUrl && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-success/10 border border-success/20 rounded-2xl"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-success/60 mb-2">Public URL Generated</p>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={publishUrl}
                          className="flex-grow bg-white border border-success/20 rounded-xl px-4 py-2 text-xs font-bold text-success select-all"
                        />
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(publishUrl);
                            setPublishUrl(null);
                          }}
                          className="p-2 bg-success text-white rounded-xl hover:bg-success/90 transition-all"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
