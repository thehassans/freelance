import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, Copy, RotateCcw, Check, Loader2, History, 
  FileText, Crown, Upload, Trash2, Palette, PenTool, 
  ArrowLeft, Layout, FileDown, Eye, CheckCircle2
} from 'lucide-react';
import { getGenAI } from '../../lib/gemini';
import { toast } from 'sonner';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import FreemiumExportWrapper from '../common/FreemiumExportWrapper';
import { historyService, HistoryItem } from '../../lib/history-service';
import { useUser } from '../../contexts/UserContext';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import ProposalEditor from './ProposalEditor';
import ProposalPDF from './ProposalPDF';
import { DatabaseService } from '../../services/DatabaseService';
import { usePremiumAction } from '../../hooks/usePremiumAction';

import { useFeatureGate } from '../../hooks/useFeatureGate';

type Phase = 'form' | 'loading' | 'edit' | 'preview';

export default function ProposalGenerator({ onPricingClick }: { onPricingClick?: () => void }) {
  const { isPro, aiUsageCount, consumeCredit, user, showProModal } = useUser();
  const { executeAction, isProcessing } = usePremiumAction('proposal-gen');
  const { requirePro } = useFeatureGate();
  const [phase, setPhase] = useState<Phase>('form');
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#0f4c75');
  const [signatureName, setSignatureName] = useState('');

  const AI_LIMIT = 5;
  const hasReachedLimit = !isPro && aiUsageCount >= AI_LIMIT;
  
  const [formData, setFormData] = useState({
    projectType: '',
    clientName: '',
    budget: '',
    timeline: '',
    deliverables: '',
    painPoints: '',
    solutionApproach: '',
    tone: 'Executive'
  });

  const { proposalPayload, clearAllPayloads } = useEcosystemStore();

  useEffect(() => {
    if (proposalPayload) {
      setFormData(prev => ({
        ...prev,
        projectType: proposalPayload.projectType || prev.projectType,
        clientName: proposalPayload.clientName || prev.clientName,
        budget: proposalPayload.estimatedPrice ? `$${proposalPayload.estimatedPrice}` : prev.budget,
        solutionApproach: proposalPayload.contextString || prev.solutionApproach,
        deliverables: proposalPayload.keyRequirements ? proposalPayload.keyRequirements.join(', ') : prev.deliverables
      }));
      
      clearAllPayloads();
    }
  }, [proposalPayload, clearAllPayloads]);

  const history = useMemo(() => 
    historyService.getHistory().filter(i => i.toolId === 'proposal-generator'), 
    [showHistory]
  );

  const saveToHistory = (generatedContent: string) => {
    historyService.addToHistory({
      toolId: 'proposal-generator',
      toolName: 'AI Proposal',
      summary: `Proposal for ${formData.clientName || 'Client'} - ${formData.projectType || 'Project'}`,
      data: { formData, proposal: generatedContent, logo, primaryColor, signatureName }
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    setFormData(item.data.formData);
    setEditorContent(item.data.proposal);
    setLogo(item.data.logo);
    setPrimaryColor(item.data.primaryColor || '#0f4c75');
    setSignatureName(item.data.signatureName || '');
    setPhase('edit');
    setShowHistory(false);
  };

  const handleGenerate = async () => {
    if (!formData.projectType || !formData.clientName) return;
    
    const genAI = getGenAI();
    if (!genAI) {
      toast.error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env or .env.local file.');
      return;
    }

    executeAction(async (userId) => {
      setPhase('loading');
      
      try {
        await DatabaseService.logToolUsage('proposal-gen');
        
        const response = await genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Write a high-ticket agency proposal.
          
          Project: ${formData.projectType}
          Client: ${formData.clientName}
          Budget: ${formData.budget}
          Timeline: ${formData.timeline}
          Deliverables: ${formData.deliverables}
          Client Pain Points: ${formData.painPoints}
          Proposed Approach: ${formData.solutionApproach}
          Tone of Voice: ${formData.tone}

          Structure the proposal with these sections:
          1. Executive Summary: Empathize with the client's pain points and set the vision.
          2. Scope of Work: Detail the solution approach and deliverables.
          3. Timeline & Investment: Break down milestones and budget.
          4. Next Steps: A clear path to getting started.

          Format directly in HTML tags (h2, h3, p, ul, li) suitable for a rich text editor. Do not use Markdown symbols like #. Use professional, persuasive language.`,
          config: { temperature: 0.7 }
        });

        const generated = response.text || 'Failed to generate proposal.';
        setEditorContent(generated);
        saveToHistory(generated);
        setPhase('edit');
      } catch (error: any) {
        console.error('Error generating proposal:', error);
        toast.error(error?.message || 'Error generating proposal. Please check your Gemini API key.');
        setEditorContent('<p>Error generating proposal. Please check your configuration.</p>');
        setPhase('form');
      }
    });
  };

  const exportToPDF = async () => {
    executeAction(async (userId) => {
      setLoading(true);
      try {
        await DatabaseService.logToolUsage('proposal-pdf-export');
        
        const blob = await pdf(
          <ProposalPDF 
            formData={formData}
            proposalContent={editorContent}
            logo={logo}
            primaryColor={primaryColor}
            signatureName={signatureName}
            isPro={isPro}
          />
        ).toBlob();
        
        await DatabaseService.saveUserDocument(userId, 'proposal_pdf', formData);
        
        const fileName = `Proposal_${formData.clientName || 'Client'}.pdf`;
        saveAs(blob, fileName);
      } catch (error) {
        console.error('PDF Generation failed:', error);
      } finally {
        setLoading(false);
      }
    });
  };

  const tones = ['Executive', 'Creative', 'Direct'];
  const colors = ['#0f4c75', '#1b998b', '#6c63ff', '#1a1a2e', '#ff6b6b', '#f59e0b', '#10b981'];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === 'form' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Sparkles className="text-ai w-8 h-8" /> Proposal Strategy
                  </h3>
                  <p className="text-slate-500 mt-2 font-medium">Draft a high-ticket agency proposal in seconds with AI.</p>
                </div>
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full md:w-auto px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
                >
                  <History size={16} /> View History
                </button>
              </div>

              <AnimatePresence>
                {showHistory && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-12 overflow-hidden"
                  >
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3 max-h-[400px] overflow-y-auto">
                      <h4 className="text-xs uppercase font-black tracking-widest text-slate-400 mb-4 px-2">Saved Proposals</h4>
                      {history.length > 0 ? (
                        history.map((item) => (
                          <button 
                            key={item.id}
                            onClick={() => loadFromHistory(item)}
                            className="w-full text-start p-4 bg-white rounded-2xl transition-all border border-slate-100 hover:border-primary/30 flex items-center justify-between group shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary border border-slate-100 transition-colors">
                                 <FileText size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{item.summary}</p>
                                <p className="text-xs text-slate-400 font-medium">{new Date(item.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <CheckCircle2 size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 py-12 text-center italic">Your proposal history is empty.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-10">
                {/* Branding Section */}
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Palette size={18} className="text-slate-400" /> Agency Identity
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accent Color</label>
                      <div className="flex flex-wrap gap-3">
                        {colors.map(c => (
                          <button 
                            key={c} 
                            onClick={() => setPrimaryColor(c)}
                            className={`w-10 h-10 rounded-2xl border-4 transition-all hover:scale-110 active:scale-95 ${primaryColor === c ? 'border-white ring-4 ring-primary/20 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Logo</label>
                      <div className="flex items-center gap-4">
                        {logo ? (
                          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 w-32 h-20 bg-white shadow-sm transition-all hover:shadow-md">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain p-3" />
                            <button onClick={() => setLogo(null)} className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white backdrop-blur-sm">
                              <Trash2 size={24} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-32 h-20 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-white hover:border-primary transition-all group">
                            <Upload size={24} className="text-slate-300 group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-bold text-slate-400 mt-1">Upload</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </label>
                        )}
                        <p className="text-[10px] text-slate-400 leading-relaxed max-w-[120px]">Recommended: PNG with transparent background.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-start">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ps-1">Project Objective</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Enterprise SEO Strategy"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-ai/10 focus:border-ai transition-all text-sm font-semibold"
                      value={formData.projectType || ''}
                      onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 text-start">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ps-1">Client Organization</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Global Tech Solutions"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-ai/10 focus:border-ai transition-all text-sm font-semibold"
                      value={formData.clientName || ''}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-start">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ps-1">Core Pain Point</label>
                    <textarea 
                      rows={3}
                      placeholder="What is the client's biggest obstacle?"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-ai/10 focus:border-ai transition-all text-sm font-semibold resize-none"
                      value={formData.painPoints || ''}
                      onChange={(e) => setFormData({...formData, painPoints: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 text-start">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ps-1">Proposed Solution</label>
                    <textarea 
                      rows={3}
                      placeholder="Describe your unique approach..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-ai/10 focus:border-ai transition-all text-sm font-semibold resize-none"
                      value={formData.solutionApproach || ''}
                      onChange={(e) => setFormData({...formData, solutionApproach: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="space-y-2 text-start">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ps-1">Budget</label>
                    <input 
                      type="text" 
                      placeholder="$10k+"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-semibold"
                      value={formData.budget || ''}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 text-start">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ps-1">Timeline</label>
                    <input 
                      type="text" 
                      placeholder="3 Months"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-semibold"
                      value={formData.timeline || ''}
                      onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 text-start lg:col-span-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ps-1">Direct Stakeholder</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe, CEO"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-semibold"
                      value={signatureName || ''}
                      onChange={(e) => setSignatureName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ps-1">Proposal Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {tones.map(t => (
                      <button
                        key={t}
                        onClick={() => setFormData({...formData, tone: t})}
                        className={`px-8 py-4 rounded-2xl text-sm font-extrabold border transition-all ${
                          formData.tone === t 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 text-center">
                  <FreemiumExportWrapper toolId="proposal-gen">
                    <button 
                      onClick={handleGenerate}
                      disabled={!formData.clientName || !formData.projectType}
                      className="w-full py-6 bg-ai text-white rounded-[2rem] font-black shadow-2xl shadow-ai/30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed text-xl uppercase tracking-tighter"
                    >
                      <Sparkles size={24} /> Generate Professional Proposal
                    </button>
                  </FreemiumExportWrapper>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center min-h-[600px] text-center p-12"
          >
            <div className="relative mb-12">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="w-24 h-24 rounded-full border-t-4 border-r-4 border-ai border-opacity-30"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Sparkles className="text-ai w-10 h-10 animate-pulse" />
               </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Drafting Your Proposal...</h3>
            <p className="text-slate-500 font-medium max-w-sm">Gemini is synthesizing your project details into a persuasive strategy.</p>
            <div className="mt-12 flex gap-2">
              <div className="w-2 h-2 bg-ai rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-ai rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-ai rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}

        {phase === 'edit' && (
          <motion.div 
            key="edit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 pb-12"
          >
            <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <button 
                onClick={() => setPhase('form')}
                className="px-6 py-3 text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors rounded-2xl hover:bg-slate-50"
              >
                <ArrowLeft size={20} /> Edit Base Inputs
              </button>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-xs font-black uppercase tracking-widest border border-success/10 ps-3">
                  <Check size={14} /> AI Draft Ready
                </div>
                 <button 
                  onClick={() => setPhase('preview')}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                >
                  <Eye size={18} /> Lock & Preview PDF
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden text-start">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ms-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Workspace</span>
              </div>
              <ProposalEditor 
                content={editorContent} 
                onChange={setEditorContent} 
              />
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h4 className="font-black text-2xl mb-2 text-start">Final Step: Client Review</h4>
                <p className="text-slate-400 text-sm font-medium text-start">Verify your deliverables and lock the content to generate the branded PDF.</p>
              </div>
              <button 
                onClick={() => setPhase('preview')}
                className="w-full md:w-auto px-10 py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                Lock & Generate PDF <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'preview' && (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-8 h-full min-h-screen pb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setPhase('edit')}
                  className="px-6 py-3 text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-2 transition-colors rounded-2xl hover:bg-slate-50"
                >
                  <ArrowLeft size={20} /> Back to Editor
                </button>
                <div className="h-6 w-px bg-slate-200 hidden md:block" />
                <h3 className="font-black text-slate-900 hidden md:block">Final Document Preview</h3>
              </div>
              <FreemiumExportWrapper toolId="proposal-gen" className="w-full md:w-auto">
                <button 
                  onClick={exportToPDF}
                  disabled={loading}
                  className="w-full px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-2xl shadow-primary/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
                  Download Branded PDF
                </button>
              </FreemiumExportWrapper>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-6 md:p-12 h-[800px] border border-slate-800 shadow-2xl overflow-hidden relative group">
               <PDFViewer width="100%" height="100%" style={{ border: 'none', borderRadius: '1.5rem' }}>
                <ProposalPDF 
                  formData={formData}
                  proposalContent={editorContent}
                  logo={logo}
                  primaryColor={primaryColor}
                  signatureName={signatureName}
                  isPro={isPro}
                />
              </PDFViewer>
            </div>

            <div className="flex items-center justify-center gap-8 py-12 border-t border-slate-100 mt-12">
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                 <p className="font-bold text-success flex items-center gap-2"><CheckCircle2 size={16} /> Ready to Send</p>
               </div>
               <div className="h-8 w-px bg-slate-200" />
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Branding</p>
                 <p className="font-bold text-slate-900">Premium Template</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
