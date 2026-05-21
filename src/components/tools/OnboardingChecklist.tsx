import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  ClipboardList, CheckCircle2, Circle, Plus, Share2, 
  Rocket, ShieldCheck, CreditCard, MessageSquare, 
  Trash2, ExternalLink, Link as LinkIcon, User, 
  Briefcase, Lock, Image as ImageIcon, GripVertical,
  X, ArrowRight, Settings, ChevronDown
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { DatabaseService } from '../../services/DatabaseService';

type Category = 'Legal' | 'Admin' | 'Assets' | 'Access';
type Assignee = 'Agency' | 'Client';

interface ChecklistItem {
  id: string;
  task: string;
  category: Category;
  completed: boolean;
  actionUrl: string;
  assignee: Assignee;
}

interface PortalSettings {
  whiteLabel: boolean;
  agencyLogo: string | null;
  kickoffUrl?: string;
}

const TEMPLATES: Record<string, Omit<ChecklistItem, 'id' | 'completed'>[]> = {
  web_design: [
    { task: 'Sign Service Agreement', category: 'Legal', actionUrl: 'https://docusign.com', assignee: 'Client' },
    { task: 'Pay Project Deposit', category: 'Admin', actionUrl: 'https://stripe.com', assignee: 'Client' },
    { task: 'Share Content & Assets', category: 'Assets', actionUrl: '', assignee: 'Client' },
    { task: 'Configure Global Styles', category: 'Admin', actionUrl: '', assignee: 'Agency' },
    { task: 'Provision Staging Server', category: 'Access', actionUrl: '', assignee: 'Agency' },
  ],
  content_strategy: [
    { task: 'Review Brand Tone Guide', category: 'Admin', actionUrl: '', assignee: 'Client' },
    { task: 'Approve Content Pillars', category: 'Admin', actionUrl: '', assignee: 'Client' },
    { task: 'Set Up Editorial Calendar', category: 'Admin', actionUrl: '', assignee: 'Agency' },
  ]
};

export default function OnboardingChecklist() {
  const { isPro: contextIsPro, user, showAuthModal } = useUser();
  const isProUser = false; // Mock as per instructions to ensure gating triggers
  
  const [items, setItems] = useState<ChecklistItem[]>(
    TEMPLATES.web_design.map((t, i) => ({ ...t, id: i.toString(), completed: false })) as ChecklistItem[]
  );
  const [projectName, setProjectName] = useState('Acme App Redesign');
  const [settings, setSettings] = useState<PortalSettings>({
    whiteLabel: false,
    agencyLogo: null
  });
  const [copied, setCopied] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [savedPortals, setSavedPortals] = useState<any[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  
  const [viewMode, setViewMode] = useState<'editor' | 'client'>('editor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const progress = Math.round((items.filter(i => i.completed).length / items.length) * 100) || 0;

  useEffect(() => {
    if (viewMode === 'client' && progress === 100) {
      setIsSubmitted(true);
    }
  }, [viewMode, progress]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleItem = (id: string) => {
    setItems(items.map(it => it.id === id ? { ...it, completed: !it.completed } : it));
  };

  const addItem = () => {
    const newItem: ChecklistItem = { 
      id: Date.now().toString(), 
      task: '', 
      category: 'Admin', 
      completed: false,
      actionUrl: '',
      assignee: 'Client'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    setItems(items.map(it => it.id === id ? { ...it, ...updates } : it));
  };

  const handleTemplate = (type: string) => {
    setItems(TEMPLATES[type].map((t, i) => ({ ...t, id: Date.now().toString() + i, completed: false })) as ChecklistItem[]);
  };

  const handleProAction = (action: () => void) => {
    if (isProUser) {
      action();
    } else {
      setShowProModal(true);
    }
  };

  const faqs = [
    {
      q: "How do I manage multiple clients?",
      a: "Build out a client's specific task list and click 'Save Portal'. You can access all concurrent onboarding flows by clicking 'View Saved Portals' at the top of the tool, allowing you to instantly switch contexts between clients."
    },
    {
      q: "What does the client actually see?",
      a: "When you generate the client link, they see a beautiful, isolated, read-only version of the portal. They do not see your administrative controls, allowing them to focus entirely on checking off their assigned tasks."
    },
    {
      q: "Can I remove the FreelancerKit branding?",
      a: "Yes. Pro-tier users can toggle the White-label feature to remove external branding and upload their own agency logo to the portal header."
    },
    {
      q: "What should be in a client onboarding checklist?",
      a: "A professional checklist should include finalizing the Master Services Agreement (MSA), collecting the initial deposit, securing access to necessary tools (like Shopify, WordPress, or GitHub), and scheduling the official kickoff call."
    },
    {
      q: "Why is a client portal better than email?",
      a: "Emails get buried, and attachments expire. A client portal acts as a single source of truth, providing a real-time progress bar that keeps both your agency and the client accountable for project velocity."
    },
    {
      q: "How do you automate client onboarding?",
      a: "By creating a master template in this tool. Instead of writing a new checklist for every client, you can load your standardized onboarding workflow, tweak it for the specific project, and generate a client link in seconds."
    }
  ];

  return (
    <div className="pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm tracking-wide text-center max-w-sm w-full outline outline-1 outline-white/10"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Saved Portals Button */}
      {savedPortals.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6 flex justify-start px-4 xl:px-0">
          <button
            onClick={() => setShowSavedModal(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
           >
            <span>📂 View Saved Portals</span>
            <span className="bg-[#0f4c75] text-white text-[10px] px-2 py-0.5 rounded-full">{savedPortals.length}</span>
          </button>
        </div>
      )}

      <div className={`grid grid-cols-1 ${viewMode === 'editor' ? 'lg:grid-cols-2' : ''} gap-8 items-start max-w-7xl mx-auto transition-all duration-500`}>
        {/* Left Column: Editor */}
        {viewMode === 'editor' && (
          <div className="space-y-6">
            {progress === 100 && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded-r-xl">
                <p className="text-blue-900 text-sm font-bold">
                  Client has completed onboarding. This portal is locked. You can now transition this client to the active project phase.
                </p>
              </div>
            )}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/50 shadow-sm transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0f4c75]/10 text-[#0f4c75] flex items-center justify-center">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Portal Setup</h3>
                    <p className="text-xs text-slate-500">Configure your client's onboarding experience.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Project Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Project Name</label>
                    <input 
                      type="text" 
                      value={projectName || ''}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0f4c75] text-sm font-bold transition-all"
                      placeholder="e.g. Acme App Redesign"
                    />
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portal Settings</h4>
                       {!isProUser && (
                         <span className="flex items-center gap-1 text-[8px] font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded-md">
                           <Lock size={10} /> Pro Only
                         </span>
                       )}
                    </div>
                    <div className="space-y-3">
                       <button 
                        onClick={() => handleProAction(() => setSettings({ ...settings, whiteLabel: !settings.whiteLabel }))}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${settings.whiteLabel ? 'bg-[#0f4c75]/5 border-[#0f4c75]/20' : 'bg-white border-slate-200 opacity-60'}`}
                       >
                         <span className="text-xs font-bold text-slate-700">White-label Portal</span>
                         <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.whiteLabel ? 'bg-[#0f4c75]' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${settings.whiteLabel ? 'left-5' : 'left-1'}`} />
                         </div>
                       </button>
                       <button 
                        onClick={() => handleProAction(() => {})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-xs font-bold text-slate-400 hover:border-[#0f4c75] transition-all opacity-60"
                       >
                         <ImageIcon size={16} />
                         Upload Agency Logo
                       </button>
                       
                       <div className="pt-2">
                         <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Kickoff Call Link</label>
                         <input 
                           type="text" 
                           value={settings.kickoffUrl || ''}
                           onChange={(e) => setSettings({ ...settings, kickoffUrl: e.target.value })}
                           className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0f4c75] text-xs font-medium transition-all"
                           placeholder="e.g. https://calendly.com/..."
                         />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stage Roadmap</h4>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleTemplate('web_design')}
                          className="text-[9px] font-black uppercase tracking-widest text-[#0f4c75] hover:underline"
                        >
                          Use Template
                        </button>
                        <button 
                          onClick={addItem}
                          className="text-[10px] font-black uppercase tracking-widest text-[#0f4c75] flex items-center gap-1.5 hover:underline"
                        >
                          <Plus size={14} /> Add Task
                        </button>
                      </div>
                   </div>

                   <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4">
                     {items.map((item) => (
                        <Reorder.Item 
                          key={item.id} 
                          value={item}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 group relative cursor-default"
                        >
                           <div className="flex items-center gap-3">
                             <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#0f4c75] transition-colors">
                               <GripVertical size={16} />
                             </div>
                             <input 
                               type="text" 
                               value={item.task || ''}
                               onChange={(e) => updateItem(item.id, { task: e.target.value })}
                               placeholder="Describe the task..."
                               className="flex-grow bg-transparent font-bold text-slate-800 text-sm focus:outline-none"
                             />
                             <button 
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <Trash2 size={16} />
                             </button>
                           </div>

                           <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                <select 
                                  value={item.category || 'Admin'}
                                  onChange={(e) => updateItem(item.id, { category: e.target.value as Category })}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-bold appearance-none cursor-pointer"
                                >
                                  {['Legal', 'Admin', 'Assets', 'Access'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Assignee</label>
                                <button 
                                  onClick={() => updateItem(item.id, { assignee: item.assignee === 'Client' ? 'Agency' : 'Client' })}
                                  className={`w-full px-3 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                    item.assignee === 'Client' ? 'bg-white border-[#0f4c75]/20 text-[#0f4c75]' : 'bg-slate-200 border-transparent text-slate-600'
                                  }`}
                                >
                                  {item.assignee === 'Client' ? <User size={12} /> : <Briefcase size={12} />}
                                  {item.assignee}
                                </button>
                              </div>
                           </div>

                           <div className="space-y-1">
                             <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                                <LinkIcon size={10} /> Action Link (Optional)
                             </label>
                             <input 
                               type="text" 
                               value={item.actionUrl || ''}
                               onChange={(e) => updateItem(item.id, { actionUrl: e.target.value })}
                               placeholder="https://..."
                               className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-[10px] font-mono focus:outline-none focus:border-[#0f4c75]"
                             />
                           </div>
                        </Reorder.Item>
                     ))}
                   </Reorder.Group>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                disabled={isSaving}
                onClick={async () => {
                  if (!user?.uid) {
                    showAuthModal('signup');
                    showToast('Please create a free account to save portals.');
                    return;
                  }

                  setIsSaving(true);
                  try {
                    const payload = {
                      name: projectName || 'Untitled',
                      data: { items, settings, isSubmitted }
                    };
                    const saved = await DatabaseService.saveClientPortal(user.uid, payload);
                    
                    const newSaved = {
                      id: saved.id,
                      projectName: saved.name,
                      items: saved.data.items,
                      settings: saved.data.settings,
                      isSubmitted: saved.data.isSubmitted,
                      lastSaved: saved.createdAt.getTime()
                    };
                    setSavedPortals([...savedPortals, newSaved]);
                    showToast('Project ' + (projectName || 'Untitled') + ' saved to your active client dashboard.');
                  } catch (e) {
                    console.error("Failed to save portal:", e);
                    showToast('Error saving portal. Please try again.');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className={`flex-1 ${isSaving ? 'bg-slate-400' : 'bg-[#0f4c75] hover:scale-[1.02]'} text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#0f4c75]/20 transition-all`}
              >
                {isSaving ? 'Saving...' : 'Save Portal to Dashboard'}
              </button>
              <button 
                onClick={() => {
                  setViewMode('client');
                  showToast('Link copied to clipboard!');
                }}
                className="flex-1 bg-white border border-slate-200 text-[#0f4c75] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:scale-[1.02] transition-all flex justify-center items-center gap-2"
              >
                <Share2 size={16} /> Generate Client Link
              </button>
            </div>
          </div>
        )}

        {/* Right Column: Portal View (Expands in Client Mode) */}
        <div className={`space-y-6 ${viewMode === 'editor' ? 'lg:sticky lg:top-8' : 'max-w-3xl mx-auto w-full transition-all duration-500'}`}>
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
             {/* Header Area */}
             <div className="bg-slate-900 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#0f4c75]/20 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="space-y-2">
                      {!settings.whiteLabel || !isProUser ? (
                        <div className="flex items-center gap-2 text-[#4f9ed4]">
                          <Rocket size={20} />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">FreelancerKit</span>
                        </div>
                      ) : (
                        <div className="h-6" /> // Placeholder for custom logo
                      )}
                      <h4 className="text-3xl font-black tracking-tighter leading-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                        {projectName || 'Build Roadmap'}
                      </h4>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Client Progress Portal</p>
                    </div>
                    {viewMode === 'editor' && (
                      <button 
                        onClick={() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-[#4f9ed4] group hidden sm:block"
                      >
                        {copied ? <CheckCircle2 size={20} /> : <Share2 size={20} className="group-hover:rotate-12 transition-transform" />}
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4f9ed4] animate-pulse" />
                          Onboarding Velocity
                        </span>
                        <span className="text-white font-mono">{progress}% Complete</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ type: 'spring', bounce: 0, duration: 1 }}
                          className="h-full bg-[#4f9ed4] shadow-[0_0_15px_rgba(79,158,212,0.6)]"
                        />
                     </div>
                  </div>
                </div>
             </div>

             {/* Portal Body */}
             <div className="p-8 space-y-4 flex-grow bg-slate-50/20 max-h-[600px] overflow-y-auto no-scrollbar">
                {viewMode === 'client' && isSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 min-h-[300px]">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <h3 className="text-emerald-900 font-bold text-2xl mb-3">Onboarding Complete!</h3>
                    <p className="text-emerald-800/80 text-sm leading-relaxed max-w-sm mb-6">
                      Thank you for providing the necessary assets and details. Our technical team has been notified and is reviewing your environment.
                    </p>
                    {settings.kickoffUrl ? (
                      <a 
                        href={settings.kickoffUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg font-bold text-sm hover:scale-105 transition-transform"
                      >
                        Schedule Kickoff Call &rarr;
                      </a>
                    ) : (
                      <button 
                        className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg font-bold text-sm hover:scale-105 transition-transform"
                        onClick={() => showToast('Connecting to scheduling system...')}
                      >
                        Schedule Kickoff Call &rarr;
                      </button>
                    )}
                  </div>
                ) : (
                items.map((item) => (
                  <div 
                    key={item.id}
                    className={`w-full bg-white rounded-[2rem] border transition-all flex flex-col group ${
                      item.completed 
                      ? 'border-emerald-500/20 opacity-60 bg-emerald-50/10' 
                      : item.assignee === 'Client' ? 'border-[#0f4c75]/20 bg-[#0f4c75]/[0.02]' : 'border-slate-200'
                    }`}
                  >
                    <div className="p-5 flex items-center gap-5">
                      <button 
                        onClick={() => {
                          if (viewMode === 'client' && !isSubmitted) toggleItem(item.id);
                        }}
                        disabled={viewMode !== 'client' || isSubmitted}
                        className={`transition-all flex-shrink-0 focus:outline-none ${viewMode !== 'client' || isSubmitted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${item.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-[#0f4c75]/50'}`}
                        title={viewMode === 'editor' ? 'Switch to Client View to interact' : 'Toggle task status'}
                      >
                        {item.completed ? <CheckCircle2 size={28} strokeWidth={2.5} /> : <Circle size={28} strokeWidth={2} />}
                      </button>
                      
                      <div className="flex-grow flex flex-col gap-1">
                         <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                              item.category === 'Legal' ? 'bg-red-50 text-red-500' : 
                              item.category === 'Admin' ? 'bg-blue-50 text-blue-500' :
                              item.category === 'Assets' ? 'bg-purple-50 text-purple-500' : 'bg-emerald-50 text-emerald-500'
                            }`}>
                              {item.category}
                            </span>
                            {item.assignee === 'Client' && !item.completed && (
                              <span className="text-[8px] font-black uppercase tracking-widest bg-[#0f4c75]/10 text-[#0f4c75] px-2 py-0.5 rounded-md flex items-center gap-1">
                                <User size={8} /> Client Action
                              </span>
                            )}
                         </div>
                         <p className={`text-sm font-bold tracking-tight ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.task || 'Untitled Milestone'}
                         </p>
                      </div>

                      {item.actionUrl && !item.completed && (
                        <a 
                          href={item.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-slate-900 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-slate-900/20"
                          title="Take Action"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                )))}
             </div>

             {/* Portal Footer */}
             <div className="p-8 border-t border-slate-200 bg-white grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2 opacity-30 text-slate-700">
                   <ShieldCheck size={20} />
                   <span className="text-[8px] font-black uppercase tracking-tighter">Encrypted</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-30 text-slate-700">
                   <CreditCard size={20} />
                   <span className="text-[8px] font-black uppercase tracking-tighter">Payments</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-30 text-slate-700">
                   <MessageSquare size={20} />
                   <span className="text-[8px] font-black uppercase tracking-tighter">Chat Ready</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-[#0f4c75]">
                   <Rocket size={20} className="animate-bounce" />
                   <span className="text-[8px] font-black uppercase tracking-tighter">Active</span>
                </div>
             </div>
          </div>

          {viewMode === 'client' && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setViewMode('editor')}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                &larr; Return to Admin Editor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Expanded SEO & Methodology Block */}
      <div className="max-w-4xl mx-auto mt-24 pt-12 border-t border-slate-200 px-4 sm:px-6 prose prose-slate">
        <h2 className="text-3xl md:text-3xl font-black text-slate-900 text-center mb-10">The Psychology of Client Onboarding</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose mb-12">
          {[
            {
              title: "Eliminate Buyer's Remorse",
              desc: "The moment a client pays a large deposit, anxiety sets in. A chaotic email thread asking for assets increases this fear. A unified portal instantly reinforces that they hired an elite agency."
            },
            {
              title: "Velocity to Value",
              desc: "Projects stall because clients take weeks to provide server access, logos, or copy. By assigning strict 'Client Actions' in a visible tracker, you create accountability and eliminate delays."
            },
            {
              title: "Boundary Setting",
              desc: "Onboarding isn't just about getting files; it's about training the client on how you work. Outlining your communication rules here prevents scope creep later."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-3">
              <h3 className="text-lg font-black text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-black text-slate-900">Why Spreadsheets Fail Modern Agencies</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Sending an Excel file or a messy email thread to a high-ticket client damages brand authority. A dedicated, white-labeled client portal signals operational maturity.
        </p>

        <h3 className="text-2xl font-black text-slate-900">The 3 Phases of Perfect Onboarding</h3>
        <ol className="text-slate-600 space-y-3 mb-8">
          <li><strong>1. Legal & Financial</strong> (MSAs and Deposits)</li>
          <li><strong>2. Asset Collection</strong> (Logos, Copy, Server Access)</li>
          <li><strong>3. Project Kickoff</strong> (Timeline alignment)</li>
        </ol>
      </div>

      {/* 5. The SEO & Strategy FAQ Accordion */}
      <div className="mt-24 px-4 sm:px-6">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-10">Client Onboarding FAQ</h2>
        <div className="max-w-3xl mx-auto border-t border-slate-200 divide-y divide-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-2">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="font-bold text-slate-900 text-lg group-hover:text-[#0f4c75] transition-colors pr-8">{faq.q}</span>
                  <div className={`flex-shrink-0 p-2 rounded-full transition-colors ${isOpen ? 'bg-[#0f4c75]/10 text-[#0f4c75]' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 text-slate-600 leading-relaxed pr-12 text-sm">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showSavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSavedModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Saved Portals</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Client Dashboard</p>
                </div>
                <button 
                  onClick={() => setShowSavedModal(false)}
                  className="text-slate-400 hover:text-slate-900 p-2 rounded-full hover:bg-slate-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto pr-2 space-y-3 flex-grow no-scrollbar">
                {savedPortals.length === 0 ? (
                  <div className="text-center py-12">
                     <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                       <Briefcase size={24} />
                     </div>
                     <p className="text-slate-500 text-sm font-bold">No portals saved yet.</p>
                     <p className="text-slate-400 text-xs mt-1">Create your first one below.</p>
                  </div>
                ) : (
                  savedPortals.map(p => (
                    <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-slate-200 rounded-2xl hover:border-[#0f4c75]/30 hover:bg-[#0f4c75]/5 transition-all group">
                       <div>
                         <h4 className="font-bold text-slate-900 text-sm">{p.projectName}</h4>
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{p.items.length} Tasks</p>
                       </div>
                       <button
                         onClick={() => {
                           setProjectName(p.projectName);
                           setItems(p.items);
                           setSettings(p.settings);
                           setIsSubmitted(p.isSubmitted || false);
                           setShowSavedModal(false);
                           showToast(`Loaded ${p.projectName} into editor.`);
                         }}
                         className="px-4 py-3 sm:py-2 bg-white sm:bg-slate-900 sm:text-white border border-slate-200 sm:border-transparent text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                       >
                         Load Portal
                       </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pro Modal */}
      <AnimatePresence>
        {showProModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center"
            >
              <button 
                onClick={() => setShowProModal(false)}
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">CUSTOM BRANDING</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Custom branding is a Pro feature. Upgrade to unlock white-label portals and logo uploads.
              </p>
              <button onClick={() => setShowProModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                Upgrade to Pro <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
