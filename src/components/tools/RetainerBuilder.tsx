import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Anchor, ShieldCheck, Download, Copy, Check, Info, Clock, CreditCard, RotateCw, FileSignature, Briefcase, Upload, Trash2, Palette, PenTool, Share2, ArrowLeft, Lock, Zap, Loader2, ChevronDown, ChevronUp, HelpCircle, Scale } from 'lucide-react';
import UniversalDocumentPreview from '../common/UniversalDocumentPreview';
import SignaturePad from '../common/SignaturePad';
import { useUser } from '../../contexts/UserContext';
import ReactMarkdown from 'react-markdown';

const retainerFaqItems = [
  {
    question: "What exactly is a freelancer retainer?",
    answer: "A retainer is an agreement where a client pays a freelancer an upfront fee at the start of a recurring cycle to guarantee a set amount of availability or deliverables. It moves freelancers away from the feast-or-famine cycle by locking in predictable, recurring cash flow."
  },
  {
    question: "Why does this template prohibit Rollover Hours?",
    answer: "Allowing unused hours to roll over overburdens a freelancer's future schedule. For example, accumulating unused hours over several months could lead to unmanageable demand in a single week. The tool locks in a standard clause enforcing that unused hours expire at the end of each cycle."
  },
  {
    question: "How does the tool calculate hourly overages?",
    answer: "Your baseline hourly rate is dynamically carried down into the Compensation section as the strict penalty fee for any hour requested past your set limit. This ensures you never work for free if a client requests unexpected support."
  },
  {
    question: "Is the generated contract legally binding?",
    answer: "While our tool builds an industry-standard service agreement covering common boundaries (such as termination policies, payment terms, and scopes), it should be reviewed by your local legal counsel to fit specific jurisdictional regulations before onboarding massive enterprises."
  }
];

export default function RetainerBuilder({ onPricingClick }: { onPricingClick?: () => void }) {
  const { isPro } = useUser();
  const [isExporting, setIsExporting] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#ea580c');
  const [signatureName, setSignatureName] = useState('');
  const [clientSignature, setClientSignature] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [finalizedAt, setFinalizedAt] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [signingRole, setSigningRole] = useState<'editor' | 'client'>('editor');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const [data, setData] = useState({
    freelancerName: '',
    clientName: '',
    clientEmail: '',
    hours: 10,
    rate: 100,
    billingCycle: 'Monthly',
    deliverables: '',
    startDate: new Date().toISOString().split('T')[0],
    terminationDays: 30,
    revisionLimit: 2,
  });

  const [copied, setCopied] = useState(false);
  const colors = ['#ea580c', '#0f4c75', '#1b998b', '#6c63ff', '#1a1a2e', '#ff6b6b', '#10b981'];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFinalize = (signatureData: string) => {
    setClientSignature(signatureData);
    setIsLocked(true);
    setFinalizedAt(new Date().toUTCString());
    // Simulate notification
  };

  const handleSaveAndShare = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/contract/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'local-user',
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          contractType: 'RETAINER',
          content: retainerMarkdown,
          freelancerSign: signatureName
        })
      });
      const result = await res.json();
      if (result.success) {
        setShareLink(`${window.location.origin}/c/${result.shareId}`);
      }
    } catch (err) {
      alert("Failed to create share link.");
    } finally {
      setSaving(false);
    }
  };

  const totalFee = data.hours * data.rate;
  const retainerMarkdown = `
## RETAINER SERVICE AGREEMENT

**BETWEEN:** ${data.freelancerName || '[Your Name/Company]'} ("Freelancer")  
**AND:** ${data.clientName || '[Client Name]'} ("Client")

### 1. SCOPE OF SERVICES
Freelancer agrees to provide up to **${data.hours} hours** of professional services per **${data.billingCycle.toLowerCase()}** cycle. 

**Deliverables:** ${data.deliverables || 'As requested by Client and mutually agreed upon.'}

### 2. COMPENSATION
Client shall pay Freelancer a recurring fee of **$${totalFee.toLocaleString()}** per cycle. This fee covers the allocated ${data.hours} hours.
- **Hourly rate overage:** $${data.rate} per hour (with prior approval).
- **Payment due:** At the start of each billing cycle.

### 3. RETAINER TERMS
- **Unused hours:** Hours do not roll over to the next cycle unless explicitly agreed in writing.
- **Revisions:** Limited to **${data.revisionLimit}** per deliverable.

### 4. DURATION & TERMINATION
This agreement commences on **${data.startDate}**. Either party may terminate this agreement with **${data.terminationDays} days** written notice.

### 5. INTELLECTUAL PROPERTY
Upon full payment, all work created within the scope of this retainer will belong exclusively to the Client.
  `.trim();

  return (
    <div className="max-w-4xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {viewMode === 'edit' ? (
          <motion.div
            key="editor-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 w-full"
          >
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200/80 shadow-sm text-start">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/20">
                  <Anchor size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Retainer Architect</h3>
                  <p className="text-xs text-slate-400">Lock in recurring revenue with smart contracts.</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Branding Section */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Palette size={14} /> Global Style
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Logo</label>
                      <div className="flex items-center gap-3">
                        {logo ? (
                          <div className="relative group rounded-lg overflow-hidden border border-slate-200 w-16 h-12 bg-white">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                            <button onClick={() => setLogo(null)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white cursor-pointer">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-16 h-12 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-orange-600 transition-colors">
                            <Upload size={12} className="text-slate-400" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Accent Color</label>
                      <div className="flex flex-wrap gap-2">
                        {colors.map(c => (
                          <button 
                            key={c} 
                            onClick={() => setPrimaryColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 cursor-pointer ${primaryColor === c ? 'border-orange-600 ring-2 ring-orange-600/20' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Freelancer Name / Company</label>
                        <input 
                          type="text" 
                          value={data.freelancerName || ''}
                          onChange={(e) => setData({...data, freelancerName: e.target.value})}
                          placeholder="e.g. Acme Creative"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Client Name</label>
                        <input 
                          type="text" 
                          value={data.clientName || ''}
                          onChange={(e) => setData({...data, clientName: e.target.value})}
                          placeholder="e.g. Skyline Tech Solutions"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Client Email</label>
                        <input 
                          type="email" 
                          value={data.clientEmail || ''}
                          onChange={(e) => setData({...data, clientEmail: e.target.value})}
                          placeholder="client@example.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm font-bold text-slate-800"
                        />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Monthly Hours</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="number" 
                          value={data.hours || 0}
                          onChange={(e) => setData({...data, hours: Number(e.target.value)})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm font-bold text-slate-800"
                        />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Hourly Rate</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="number" 
                          value={data.rate || 0}
                          onChange={(e) => setData({...data, rate: Number(e.target.value)})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm font-bold text-slate-800"
                        />
                      </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Key Deliverables (comma separated)</label>
                  <textarea 
                      rows={2}
                      value={data.deliverables || ''}
                      onChange={(e) => setData({...data, deliverables: e.target.value})}
                      placeholder="e.g. 2 Blog posts, 4 Social assets, Web maintenance"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-slate-800 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Termination Period</label>
                      <select 
                        value={data.terminationDays || 30}
                        onChange={(e) => setData({...data, terminationDays: Number(e.target.value)})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm font-bold text-slate-800 appearance-none cursor-pointer"
                      >
                        <option value={15}>15 Days</option>
                        <option value={30}>30 Days</option>
                        <option value={60}>60 Days</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Revision Limit</label>
                      <input 
                        type="number" 
                        value={data.revisionLimit || 0}
                        onChange={(e) => setData({...data, revisionLimit: Number(e.target.value)})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm font-bold text-slate-800"
                      />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your Signature (Type name)</label>
                  <div className="relative">
                    <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Your name"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-orange-600 text-sm font-bold font-cursive text-slate-800 font-cursive"
                      value={signatureName || ''}
                      onChange={(e) => setSignatureName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Bottom Action Footer Panel */}
                <div className="mt-8 pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-start flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block mb-1">LAYOUT READY</span>
                    <p className="text-sm font-bold text-slate-800">READY TO PREVIEW RETAINER?</p>
                  </div>
                  <button 
                    onClick={() => setViewMode('preview')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-slate-950/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    REVIEW RETAINER AGREEMENT &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-4">
              <RotateCw className="text-orange-600 shrink-0 mt-0.5" size={18} />
              <div className="text-start">
                <h5 className="text-xs font-bold text-orange-900 mb-1">Predictable Cashflow</h5>
                <p className="text-xs text-orange-700 leading-relaxed">
                  Retainers trade slightly lower hourly margins for total peace of mind and recurring monthly revenue.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview-document"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 w-full"
          >
            <UniversalDocumentPreview
              onPdfClick={(e) => {
                e.preventDefault();
                window.print();
              }}
              isLoading={isExporting}
              documentName={`Retainer_${data.clientName || 'Client'}`}
              onExportStart={() => setIsExporting(true)}
              onExportEnd={() => setIsExporting(false)}
              primaryColor={primaryColor}
              extraActions={
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className="flex items-center gap-1.5 px-4.5 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowLeft size={12} /> Back to Edit
                </button>
              }
            >
              <div className="retainer-preview-sheet flex flex-col font-sans text-slate-800 h-full text-start">
                <div className="flex justify-between items-start mb-12 border-b-2 pb-8" style={{ borderBottomColor: primaryColor }}>
                  <div>
                    {logo ? (
                      <img src={logo} alt="Logo" className="h-10 mb-4 object-contain animate-fade-in" />
                    ) : (
                      <div className="text-xl font-black tracking-tighter mb-2" style={{ color: primaryColor }}>RETAINER</div>
                    )}
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">
                      {isLocked ? `SIGNED & LOCKED DOCUMENT` : `Client: ${data.clientName || '[Client]'}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Effective Date</p>
                    <p className="text-sm font-bold">{data.startDate}</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none flex-grow">
                  {isLocked && (
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-3 mb-8 not-prose">
                       <Lock size={16} className="text-orange-600" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Active Agreement Seal</span>
                          <span className="text-[9px] font-mono text-slate-500">RET-{Math.random().toString(16).substring(2, 10).toUpperCase()} · {finalizedAt}</span>
                       </div>
                    </div>
                  )}
                  <ReactMarkdown>{retainerMarkdown}</ReactMarkdown>
                </div>

                <div className="mt-20 pt-12 border-t border-slate-100 grid grid-cols-2 gap-12 text-start">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Freelancer Signature</p>
                      <div className="border-b border-slate-300 pb-2 mb-2 italic text-2xl h-10 flex items-end" style={{ fontFamily: 'var(--font-cursive, cursive)' }}>
                        {signatureName}
                      </div>
                      <p className="text-[10px] text-slate-400">{new Date().toLocaleDateString()}</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Client Acceptance</p>
                      <div className="border-b border-slate-300 pb-2 mb-2 h-10 flex items-end">
                        {clientSignature ? (
                          <img src={clientSignature} alt="Client Signature" className="h-8 object-contain" />
                        ) : (
                          <div className="w-full h-full border border-dashed border-slate-200 rounded flex items-center justify-center">
                             <span className="text-[8px] text-slate-300 uppercase font-black">Awaiting e-Signature</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 italic">
                         {clientSignature ? `Authenticated on ${finalizedAt}` : 'Date'}
                      </p>
                   </div>
                </div>

                <div className="mt-12 text-center text-[8px] text-slate-400 font-sans tracking-widest uppercase italic opacity-50">
                   FreelancerKit.io Standard Retainer Template
                </div>
              </div>
            </UniversalDocumentPreview>

            {/* Simulated signing gateway & control panel */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl text-start">
              {signingRole === 'editor' ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                  <div>
                     <h4 className="text-slate-900 font-bold text-base sm:text-lg">Finalize Retainer</h4>
                     <p className="text-slate-500 text-xs mt-1">Ready to complete the retainer? Simulate client signing or copy a secure sharing link.</p>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
                     {!shareLink ? (
                       <button 
                         onClick={handleSaveAndShare}
                         disabled={saving}
                         className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                       >
                         {saving ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} 
                         {saving ? 'Encrypting...' : 'Save & Create Share Link'}
                       </button>
                     ) : (
                       <div className="p-2.5 bg-slate-900 rounded-xl flex items-center overflow-hidden border border-slate-800 gap-3">
                          <div className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">{shareLink}</div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(shareLink);
                              alert("Copied!");
                            }}
                            className="px-4 py-2 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer"
                          >
                            Copy
                          </button>
                       </div>
                     )}
                     
                     <button
                       onClick={() => setSigningRole('client')}
                       className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                     >
                       Simulate Client Sign
                     </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <span className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <FileSignature size={18} className="text-orange-600" /> Client Signing Gate
                     </span>
                     <button
                       onClick={() => setSigningRole('editor')}
                       className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer"
                     >
                       Document Actions
                     </button>
                  </div>

                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                     <h4 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
                         <FileSignature size={20} /> Agreement Finalization
                     </h4>
                     <p className="text-xs text-orange-700 leading-relaxed">
                         Review your retainer details on the sheet above. If everything is correct, sign below to activate the recurring service.
                     </p>
                  </div>

                  {isLocked ? (
                    <div className="p-12 text-center space-y-4">
                       <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                          <Check size={32} />
                       </div>
                       <h5 className="font-bold text-slate-900">Retainer Finalized!</h5>
                       <p className="text-xs text-slate-500">The digital document has been timestamped and locked.</p>
                       <button 
                         onClick={() => setSigningRole('editor')}
                         className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer"
                       >
                         Return to Document Actions
                       </button>
                    </div>
                  ) : (
                    <SignaturePad 
                      onSave={handleFinalize}
                      title="Client Representative Signature"
                      primaryColor={primaryColor}
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO Explainer Context Block & FAQ Accordion */}
      <div className="seo-faq-section mt-16 pt-12 border-t border-slate-200 pb-12 text-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Retainer Architect: Create Professional Monthly Service Agreements Instantly
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              Learn the mechanics of recurring agreements, live visual style mapping, and operational frameworks to establish standard, client-ready retainer contracts.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            {/* Card 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                  <Scale size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">What is the Retainer Architect?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explain that it is an interactive, web-based contract generator to convert one-time projects into stable monthly recurring revenue. It replaces messy word processor templates, allowing freelancers and agencies to input scope, logistics, and branding to instantly spin up a secure, client-ready contract.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status: Recurring Cashflow</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                  <Check size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">The Dynamic Live Preview</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Highlight the real-time engine: <strong>Real-Time Math Injection</strong> (instantly calculates upfront compensation fees), <strong>Visual Style Matching</strong> (aligns headings and borders to brand identity), and <strong>Accurate Copy-Mapping</strong> (maps user inputs like key deliverables directly to legal text spaces).
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System: Live Calculation</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">How to Build the Agreement</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Summarize the operational workflow: Establish global style (logo/colors), input agreement parties, define logistics and compensation (monthly hours and hourly rate), set boundaries (key deliverables, termination period, and revision limits), and export via PDF or secure share link.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workflow: Production-Ready</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-6 pt-6 border-t border-slate-100 text-start">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="text-orange-600" size={22} /> Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              {retainerFaqItems.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-800 hover:text-orange-600 hover:bg-slate-50/55 transition-all text-sm sm:text-base gap-4 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 bg-slate-50/30 border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .retainer-preview-sheet, .retainer-preview-sheet * { visibility: visible; }
          .retainer-preview-sheet { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; background: white; color: black; }
          header, nav, .preview-action-bar, footer, .form-container, .admin-sidebar, .seo-faq-section { display: none !important; }
        }
      `}</style>
    </div>
  );
}
