import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Copy, Check, BarChart3, Calendar, ListChecks, ArrowRight, ExternalLink, MessageSquare, Lock, Plus, Link2, X, Eye, Palette, Globe } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface Milestone {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  dueDate: string;
  deliverableUrl?: string;
}

interface ProjectHealthDashboardProps {
  onPricingClick?: () => void;
}

export default function ProjectHealthDashboard({ onPricingClick }: ProjectHealthDashboardProps) {
  const { isPro } = useUser();
  const [projectId] = useState(`proj-${Math.random().toString(36).substr(2, 9)}`);
  const [projectName, setProjectName] = useState('New Branding Project');
  const [agencyUpdate, setAgencyUpdate] = useState('We finished the research phase and are now moving into concept development. Looking forward to showing you the first batch of ideas next week!');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', name: 'Brand Discovery & Audit', status: 'completed', dueDate: '2026-04-15', deliverableUrl: 'https://example.com/audit' },
    { id: '2', name: 'Concept Sketches', status: 'active', dueDate: '2026-04-20' },
    { id: '3', name: 'Initial Presentation', status: 'pending', dueDate: '2026-04-25' },
    { id: '4', name: 'Refinements & Final Assets', status: 'pending', dueDate: '2026-05-05' },
  ]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'edit' | 'client'>('edit');
  
  // Pro Toggles (Mock)
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [whiteLabel, setWhiteLabel] = useState(false);

  const progress = Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100);

  const copyClientLink = () => {
    const link = `${window.location.origin}/health/${projectId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addMilestone = () => {
    const newId = Date.now().toString();
    setMilestones([...milestones, { 
      id: newId, 
      name: 'New Milestone', 
      status: 'pending', 
      dueDate: new Date().toISOString().split('T')[0] 
    }]);
  };

  const updateMilestoneUrl = (id: string, url: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, deliverableUrl: url } : m));
  };

  return (
    <div className="space-y-8">
      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100"
            >
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Globe size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Share Dashboard</h3>
                <p className="text-sm text-slate-500">Generate a secure link for your client.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Unique Client URL</label>
                  <div className="flex gap-2">
                    <div className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-500 overflow-hidden truncate whitespace-nowrap">
                      freelancerkit.io/health/{projectId}
                    </div>
                    <button 
                      onClick={copyClientLink}
                      className="px-6 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all flex items-center gap-2"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pro Features</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-primary transition-colors">
                          <Lock size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Password Protection</p>
                          <p className="text-[9px] text-slate-500 uppercase font-black">Security</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (isPro) {
                            setPasswordProtect(!passwordProtect);
                          } else {
                            onPricingClick?.();
                          }
                        }}
                        className={`relative w-10 h-6 rounded-full transition-colors ${passwordProtect && isPro ? 'bg-primary' : 'bg-slate-200'} flex items-center px-1`}
                      >
                        {!isPro && <Lock size={8} className="absolute right-2 text-white/50" />}
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${passwordProtect && isPro ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-primary transition-colors">
                          <Palette size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">White-label Branding</p>
                          <p className="text-[9px] text-slate-500 uppercase font-black">Identity</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (isPro) {
                            setWhiteLabel(!whiteLabel);
                          } else {
                            onPricingClick?.();
                          }
                        }}
                        className={`relative w-10 h-6 rounded-full transition-colors ${whiteLabel && isPro ? 'bg-primary' : 'bg-slate-200'} flex items-center px-1`}
                      >
                        {!isPro && <Lock size={8} className="absolute right-2 text-white/50" />}
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${whiteLabel && isPro ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <Eye size={12} /> Read-only Access
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <ShieldCheck size={12} /> Secure Connection
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
             <BarChart3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold uppercase tracking-tight">Client Dashboard</h3>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setView('edit')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${view === 'edit' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                >
                  Editor
                </button>
                <button 
                  onClick={() => setView('client')}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${view === 'client' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
                >
                  Client
                </button>
              </div>
            </div>
             <p className="text-xs text-slate-400">Project: <span className="text-slate-900 font-bold">{projectName}</span></p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            <Link2 size={16} /> Get Client Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Project Progress</h4>
               <span className="text-4xl font-black text-primary font-display tabular-nums">{progress}%</span>
            </div>
            
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-12">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary"
               />
            </div>

            {/* Agency Update Module */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {view === 'edit' ? 'Update Agency Message' : 'Message from the Team'}
                </h4>
              </div>

              {view === 'edit' ? (
                <div className="relative group">
                  <textarea 
                    value={agencyUpdate || ''}
                    onChange={(e) => setAgencyUpdate(e.target.value)}
                    placeholder="Provide a quick status update for your client..."
                    className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none italic"
                  />
                  <div className="absolute bottom-4 right-4 text-[9px] font-black uppercase text-slate-300">Editor Role</div>
                </div>
              ) : (
                <div className="p-8 bg-orange-50/50 border border-orange-100 rounded-[2rem] relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageSquare size={48} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                    "{agencyUpdate}"
                  </p>
                  <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-orange-500">— Project Lead</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Key Milestones</h4>
                 {view === 'edit' && (
                   <button 
                    onClick={addMilestone} 
                    className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-sm"
                   >
                     <Plus size={14} /> Add Milestone
                   </button>
                 )}
              </div>
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div 
                    key={m.id} 
                    className={`p-5 rounded-[1.5rem] border transition-all flex items-center justify-between group ${
                      m.status === 'completed' 
                        ? 'bg-emerald-50/30 border-emerald-100' 
                        : 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-200/20'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <button 
                        disabled={view === 'client'}
                        onClick={() => {
                          const nextStatus = m.status === 'pending' ? 'active' : m.status === 'active' ? 'completed' : 'pending';
                          setMilestones(milestones.map(ms => ms.id === m.id ? { ...ms, status: nextStatus } : ms));
                        }}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          m.status === 'completed' ? 'bg-success border-success text-white' : 
                          m.status === 'active' ? 'border-primary bg-primary/10' : 'border-slate-300 bg-white'
                        } ${view === 'edit' ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                      >
                        {m.status === 'completed' && <Check size={16} />}
                        {m.status === 'active' && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                      </button>
                      <div>
                        {view === 'edit' ? (
                          <input 
                            value={m.name || ''}
                            onChange={(e) => setMilestones(milestones.map(ms => ms.id === m.id ? { ...ms, name: e.target.value } : ms))}
                            className="text-sm font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full"
                          />
                        ) : (
                          <p className="text-sm font-bold text-slate-800">{m.name}</p>
                        )}
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                          <Calendar size={10} /> Due {m.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {m.status === 'completed' && m.deliverableUrl && (
                        <a 
                          href={m.deliverableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 py-1.5 px-3 bg-white border border-emerald-200 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-sm"
                        >
                          View Asset <ExternalLink size={10} />
                        </a>
                      )}
                      {view === 'edit' && m.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            placeholder="Deliverable URL..."
                            value={m.deliverableUrl || ''}
                            onChange={(e) => updateMilestoneUrl(m.id, e.target.value)}
                            className="text-[9px] w-24 bg-slate-50 border border-slate-100 rounded px-1.5 py-1 focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                      )}
                      <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                        m.status === 'completed' ? 'bg-emerald-500 text-white border-emerald-500' :
                        m.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#0B1120] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
              <ShieldCheck className="text-primary mb-6 animate-pulse" size={32} />
              <h4 className="text-xl font-bold mb-4 font-display italic leading-tight">Secure Cloud Tracking</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-8">
                Your client sees a read-only snapshot. Any changes you make in the editor are persisted instantly to their private view.
              </p>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="font-bold uppercase tracking-widest">Real-time persistence</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="font-bold uppercase tracking-widest">Zero-login handoff</span>
                 </div>
                 <div className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(108,99,255,0.5)]" />
                    <span className="font-bold uppercase tracking-widest">Deliverable attachments</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ExternalLink size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">Live Status</p>
                  <p className="text-[10px] font-bold text-slate-900 uppercase">Synchronized</p>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           </div>
        </div>
      </div>
    </div>
  );
}
