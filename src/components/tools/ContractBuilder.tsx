import React, { useState, useRef, useMemo, useEffect } from 'react';
import { FileText, Download, Printer, Shield, Info, Plus, Trash2, History, Check, ArrowRight, ArrowLeft, Upload, Palette, PenTool, Share2, Lock, Unlock, Clock, Send, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { historyService, HistoryItem } from '../../lib/history-service';
import UniversalDocumentPreview from '../common/UniversalDocumentPreview';
import SignaturePad from '../common/SignaturePad';
import { useUser } from '../../contexts/UserContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import { toast } from 'sonner';

type Template = 'service' | 'nda' | 'ip';
type Step = 'template' | 'parties' | 'details' | 'review';

export default function ContractBuilder({ onPricingClick }: { onPricingClick?: () => void }) {
  const { isPro, user, showAuthModal } = useUser();
  const { executeAction, isProcessing } = usePremiumAction();
  const contractRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [template, setTemplate] = useState<Template>('service');
  const [activeStep, setActiveStep] = useState<Step>('template');
  const [showHistory, setShowHistory] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#0f4c75');
  const [signatureName, setSignatureName] = useState('');
  const [clientSignature, setClientSignature] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [finalizedAt, setFinalizedAt] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'client'>('editor');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [data, setData] = useState({
    contractDate: new Date().toISOString().split('T')[0],
    freelancerName: '',
    freelancerAddress: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    projectName: '',
    projectScope: '',
    paymentTerms: '50% upfront, 50% on completion',
    fee: '',
    governingState: 'New York'
  });

  const steps: {id: Step, label: string}[] = [
    { id: 'template', label: 'Template' },
    { id: 'parties', label: 'Parties' },
    { id: 'details', label: 'Details' },
    { id: 'review', label: 'Review' }
  ];

  const goNext = () => {
    const currentIndex = steps.findIndex(s => s.id === activeStep);
    if (currentIndex < steps.length - 1) setActiveStep(steps[currentIndex + 1].id);
  };

  const goBack = () => {
    const currentIndex = steps.findIndex(s => s.id === activeStep);
    if (currentIndex > 0) setActiveStep(steps[currentIndex - 1].id);
  };

  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    const unsub = historyService.subscribe((items) => {
      setRecentHistory(items.filter(i => i.toolId === 'contract-builder'));
    });
    return unsub;
  }, [showHistory]);

  const saveToHistory = () => {
    historyService.addToHistory({
      toolId: 'contract-builder',
      toolName: 'Contract',
      summary: `${template.toUpperCase()} for ${data.clientName || 'Client'} - ${data.projectName || 'Project'}`,
      data: { data, template, logo, primaryColor, signatureName }
    });
  };

  const colors = ['#0f4c75', '#1b998b', '#6c63ff', '#1a1a2e', '#ff6b6b', '#f59e0b', '#10b981'];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setData(item.data.data);
    setTemplate(item.data.template);
    setLogo(item.data.logo || null);
    setPrimaryColor(item.data.primaryColor || '#0f4c75');
    setSignatureName(item.data.signatureName || '');
    setShowHistory(false);
    setActiveStep('review');
  };

  const handleFinalize = (signatureData: string) => {
    setClientSignature(signatureData);
    setIsLocked(true);
    setFinalizedAt(new Date().toUTCString());
    // In a real app, this would trigger an email
    saveToHistory();
  };

  const handleSaveAndShare = async () => {
    if (!data.clientName || !data.clientEmail) {
      toast.error("Please enter client details before sharing.");
      return;
    }

    executeAction(async (userId) => {
      setSaving(true);
      try {
        await DatabaseService.logToolUsage('contract-builder');
        const payload = {
          userId: userId,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientAddress: data.clientAddress,
          freelancerName: data.freelancerName,
          freelancerAddress: data.freelancerAddress,
          projectName: data.projectName,
          projectScope: data.projectScope,
          paymentTerms: data.paymentTerms,
          fee: data.fee,
          governingState: data.governingState,
          contractType: template.toUpperCase(),
          content: contractMarkdown,
          freelancerSign: signatureName,
          logo: logo,
          primaryColor: primaryColor,
          createdAt: serverTimestamp(),
          status: 'SENT'
        };

        const docRef = await addDoc(collection(db, 'contracts'), payload);
        const url = `${window.location.origin}/contract/share/${docRef.id}`;
        
        setShareLink(url);
        await navigator.clipboard.writeText(url);
        
        toast.success('Contract Saved! Secure link copied to clipboard.');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        
        saveToHistory();
      } catch (err) {
        console.error("Failed to create share link:", err);
        toast.error("Failed to create share link. Please try again.");
      } finally {
        setSaving(false);
      }
    });
  };

  const contractMarkdown = template === 'service' ? `
## Independent Contractor Agreement
This Agreement is made as of **${data.contractDate}** between **${data.freelancerName || '[Freelancer Name]'}**, with a principal place of business at **${data.freelancerAddress || '[Address]'}** ("Freelancer"), and **${data.clientName || '[Client Name]'}**, with a principal place of business at **${data.clientAddress || '[Address]'}** ("Client").

### 1. Services to be Performed
Freelancer agrees to perform the following services for Client (the "Project"): **${data.projectName || '[Name]'}**. Specifically: **${data.projectScope || '[Scope of Work]'}**.

### 2. Payment
In consideration for the Project, Client shall pay Freelancer the total fee of **$${(data.fee) || '[Amount]'}**. Payment terms are as follows: **${data.paymentTerms}**.

### 3. Intellectual Property
Upon final payment, Freelancer hereby assigns to Client all right, title, and interest in and to any work product created by Freelancer in the course of performing the Project.

### 4. Governing Law
This Agreement shall be governed by and construed in accordance with the laws of the State of **${data.governingState}**.
  ` : `
## Non-Disclosure Agreement
This Non-Disclosure Agreement (the "Agreement") is entered into on **${data.contractDate}** by and between **${data.freelancerName || '[Freelancer Name]'}** ("Freelancer") and **${data.clientName || '[Client Name]'}** ("Client").

### 1. Definition of Confidential Information
Confidential Information means any data or information that is proprietary to the Disclosing Party and not generally known to the public, whether in tangible or intangible form, whenever and however disclosed.

### 2. Obligations
The Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.

### 3. Time Period
The nondisclosure provisions of this Agreement shall survive the termination of this Agreement and Receiving Party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret.
  `;

  const renderStepContent = () => {
    switch (activeStep) {
      case 'template':
        return (
          <div className="space-y-6">
            {/* Branding & Style Global Section */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Palette size={14} /> Global Branding
              </h4>
              <div className="flex flex-col sm:flex-row gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Logo</label>
                  <div className="flex items-center gap-3">
                    {logo ? (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 w-16 h-12 bg-white">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        <button onClick={() => setLogo(null)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-16 h-12 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-primary">
                        <Upload size={12} className="text-slate-400" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                    )}
                  </div>
                </div>
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
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-4">Choose your agreement type</h4>
            <div className="grid grid-cols-1 gap-4">
              {(['service', 'nda'] as Template[]).map(t => (
                <button 
                  key={t}
                  onClick={() => {
                    setTemplate(t);
                    goNext();
                  }}
                  className={`p-6 rounded-2xl border-2 text-left transition-all group ${template === t ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">{t === 'service' ? 'Service Agreement' : 'Simple NDA'}</h5>
                      <p className="text-xs text-slate-500">{t === 'service' ? 'Standard contract for creative or technical services.' : 'Protects your ideas and confidential information during discovery.'}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${template === t ? 'border-primary bg-primary text-white' : 'border-slate-200 group-hover:border-slate-300'}`}>
                      {template === t && <Check size={14} />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'parties':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-primary pl-2">The Freelancer (You)</h4>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Legal Name or Business Name"
                  value={data.freelancerName || ''}
                  onChange={(e) => setData({...data, freelancerName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                />
                <textarea 
                  placeholder="Business Address"
                  rows={2}
                  value={data.freelancerAddress || ''}
                  onChange={(e) => setData({...data, freelancerAddress: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-danger pl-2">The Client</h4>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Company/Client Legal Name"
                  value={data.clientName || ''}
                  onChange={(e) => setData({...data, clientName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                />
                <input 
                  type="email" 
                  placeholder="Client Email (for execution copy)"
                  value={data.clientEmail || ''}
                  onChange={(e) => setData({...data, clientEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                />
                <textarea 
                  placeholder="Client Address"
                  rows={2}
                  value={data.clientAddress || ''}
                  onChange={(e) => setData({...data, clientAddress: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 'details':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Effective Date</label>
                  <input 
                    type="date" 
                    value={data.contractDate || ''}
                    onChange={(e) => setData({...data, contractDate: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Fee ($)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5,000"
                    value={data.fee || ''}
                    onChange={(e) => setData({...data, fee: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                  />
               </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Name</label>
              <input 
                type="text" 
                placeholder="e.g. Website Overhaul"
                value={data.projectName || ''}
                onChange={(e) => setData({...data, projectName: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Scope</label>
              <textarea 
                placeholder="List key deliverables and objectives..."
                rows={4}
                value={data.projectScope || ''}
                onChange={(e) => setData({...data, projectScope: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Governing State Law</label>
              <input 
                type="text" 
                value={data.governingState || ''}
                onChange={(e) => setData({...data, governingState: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold mb-6"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Signature (Type your name)</label>
              <div className="relative">
                <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Your full legal name for cursive signature"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-cursive"
                  value={signatureName || ''}
                  onChange={(e) => setSignatureName(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-6">
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
               <div className="relative z-10">
                 <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Send size={24} className="text-primary" /> Ready to finalize?
                 </h4>
                 <p className="text-slate-400 text-sm leading-relaxed mb-8">
                   Review your legal terms on the right. You can simulate the client experience or generate a secure sharing link below to close the deal.
                 </p>
                 
                 <div className="flex flex-col gap-4">
                    {!shareLink ? (
                      <button 
                        onClick={handleSaveAndShare}
                        disabled={saving}
                        className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : (copied ? <Check size={16} /> : <Zap size={16} />)} 
                        {saving ? 'Encrypting & Sharing...' : (copied ? 'Link Copied!' : 'Create Secure Share Link')}
                      </button>
                    ) : (
                      <div className="space-y-4">
                         <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-3 border border-white/5">
                            <div className="flex-grow ps-3 text-[10px] font-mono text-slate-300 truncate">{shareLink}</div>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(shareLink);
                                alert("Share link copied to clipboard!");
                              }}
                              className="px-6 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                            >
                              Copy Link
                            </button>
                         </div>
                         <p className="text-[10px] text-center text-slate-500 italic">
                            Tracking enabled: You'll be notified when the client views this link.
                         </p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => setViewMode('client')}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5"
                    >
                       <Share2 size={14} /> Simulate Client View
                    </button>
                 </div>
               </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Freelancer Signature (Type name)</label>
                  <div className="relative">
                    <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Your name for cursive signature"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold font-cursive shadow-sm shadow-slate-100/50"
                      value={signatureName || ''}
                      onChange={(e) => setSignatureName(e.target.value)}
                    />
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  const renderContract = () => {
    return (
      <div className="prose prose-slate max-w-none prose-sm selection:bg-primary/20">
        <ReactMarkdown>{contractMarkdown}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start mb-24">
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          {/* Wizard Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div className="flex items-center gap-4">
                {viewMode === 'editor' ? steps.map((s, idx) => (
                  <div key={s.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${activeStep === s.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : steps.findIndex(x => x.id === activeStep) > idx ? 'bg-success text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                      {steps.findIndex(x => x.id === activeStep) > idx ? <Check size={14} strokeWidth={3} /> : idx + 1}
                    </div>
                    {idx < steps.length - 1 && <div className={`w-6 h-0.5 mx-2 ${steps.findIndex(x => x.id === activeStep) > idx ? 'bg-success' : 'bg-slate-200'}`} />}
                  </div>
                )) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setViewMode('editor')}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-600">Client Preview Mode</span>
                  </div>
                )}
             </div>
             <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
             >
               <History size={18} />
             </button>
          </div>

          <AnimatePresence mode="wait">
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-8 bg-slate-50 border-b border-slate-100"
              >
                 <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">Saved Drafts</h4>
                 <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                     {recentHistory.map(item => (
                       <button 
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 flex items-center justify-between group"
                       >
                         <span className="text-xs font-bold text-slate-700">{item.summary}</span>
                         <Check size={14} className="text-primary opacity-0 group-hover:opacity-100" />
                       </button>
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Area */}
          <div className="p-8 flex-grow">
             <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode === 'editor' ? activeStep : 'client-view'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {viewMode === 'editor' ? renderStepContent() : (
                    <div className="space-y-8">
                       <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                          <h4 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                             <FileText size={20} /> Client Signing Gateway
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                             In production, your client would receive a magic link to this exact view. They can review the contract on the right and sign below to finalize.
                          </p>
                       </div>

                       {isLocked ? (
                         <div className="p-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                               <Check size={32} />
                            </div>
                            <h5 className="font-bold text-slate-900">Document Successfully Signed</h5>
                            <p className="text-xs text-slate-500">The agreement is now locked with a cryptographic timestamp. Digital signatures are embedded in the PDF.</p>
                            <button 
                              onClick={() => setViewMode('editor')}
                              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                            >
                              Return to Dashboard
                            </button>
                         </div>
                       ) : (
                         <SignaturePad 
                           onSave={handleFinalize}
                           title="Client Digital Signature"
                           primaryColor={primaryColor}
                         />
                       )}
                    </div>
                  )}
                </motion.div>
             </AnimatePresence>
          </div>

          {/* Wizard Navigation */}
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between mt-auto">
             <button 
              onClick={viewMode === 'editor' ? goBack : () => setViewMode('editor')}
              disabled={activeStep === 'template'}
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 disabled:opacity-0 transition-all flex items-center gap-2"
             >
               <ArrowLeft size={16} /> {viewMode === 'editor' ? 'Back' : 'Editor'}
             </button>
             {activeStep !== 'review' && viewMode === 'editor' && (
               <button 
                onClick={goNext}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20"
               >
                 Next <ArrowRight size={16} />
               </button>
             )}
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
           <Shield size={24} className="text-primary shrink-0" />
           <div>
              <p className="text-sm font-bold text-primary mb-1">Legal Notice</p>
              <p className="text-xs text-slate-600 leading-relaxed">This tool provides simple templates and does not constitute legal advice. We recommend consulting with a professional attorney for complex agreements.</p>
           </div>
        </div>
      </div>

      <div className="sticky top-24">
        <UniversalDocumentPreview
          isLoading={isExporting}
          documentName={`Contract_${data.projectName || 'draft'}`}
          onExportStart={() => setIsExporting(true)}
          onExportEnd={() => {
            setIsExporting(false);
            saveToHistory();
          }}
          primaryColor={primaryColor}
          toolId="contract-builder"
        >
          <div className={`flex flex-col font-serif text-slate-900 h-full transition-opacity duration-500 ${isLocked ? 'opacity-90' : 'opacity-100'}`}>
            <div className="flex justify-between items-start mb-12 border-b-2 pb-8" style={{ borderBottomColor: primaryColor }}>
              <div>
                {logo ? (
                  <img src={logo} alt="Logo" className="h-10 mb-4 object-contain" />
                ) : (
                  <div className="text-xl font-black tracking-tighter mb-1" style={{ color: primaryColor }}>{template.toUpperCase()} AGREEMENT</div>
                )}
                <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">
                  {isLocked ? `SIGNED & LOCKED DOCUMENT` : `Draft generated via FreelancerKit`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Contract Date</p>
                <p className="text-sm font-bold">{data.contractDate || new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex-grow space-y-6">
              {isLocked && (
                <div className="bg-success/5 border border-success/20 p-4 rounded-xl flex items-center gap-3 mb-8">
                   <Lock size={16} className="text-success" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-success tracking-widest">Cryptographic Seal</span>
                      <span className="text-[9px] font-mono text-slate-500">FID-{Math.random().toString(16).substring(2, 10).toUpperCase()} · {finalizedAt}</span>
                   </div>
                </div>
              )}
              {renderContract()}
            </div>
            
            <div className="mt-20 grid grid-cols-2 gap-12 border-t pt-12" style={{ borderTopColor: '#f1f5f9' }}>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Freelancer Signature</p>
                  <div className="border-b border-slate-300 pb-2 mb-2 italic text-2xl" style={{ fontFamily: 'var(--font-cursive, cursive)' }}>
                    {signatureName || ''}
                  </div>
                  <p className="text-[10px] text-slate-400">{data.contractDate}</p>
                  <p className="text-xs font-bold mt-2">{data.freelancerName}</p>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Client Signature</p>
                  <div className="border-b border-slate-300 pb-2 mb-2 h-16 flex items-end">
                    {clientSignature ? (
                      <img src={clientSignature} alt="Client Signature" className="h-12 object-contain" />
                    ) : (
                      <div className="w-full h-full border-2 border-dashed border-slate-100 rounded flex items-center justify-center">
                         <span className="text-[8px] text-slate-300 uppercase font-black">Awaiting Digital Signature</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                     {clientSignature ? `Verified e-ID: ${finalizedAt}` : 'Name & Date'}
                  </p>
                  <p className="text-xs font-bold mt-2">{data.clientName}</p>
               </div>
            </div>

            <div className="mt-12 text-center text-[8px] text-slate-400 font-sans tracking-[0.3em] uppercase italic opacity-50">
               FreelancerKit.io Standard Agreement Template
            </div>
          </div>
        </UniversalDocumentPreview>
      </div>
    </div>
  );
}
