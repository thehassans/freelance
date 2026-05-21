import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Plus, Trash2, Download, Printer, LayoutGrid, Clock, ChevronLeft, ChevronRight, Milestone, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight, Check, XCircle } from 'lucide-react';
import { historyService } from '../../lib/history-service';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import { toast } from 'sonner';

type Track = 'Design' | 'Development' | 'Strategy' | 'Client Task';

interface Task {
  id: string;
  name: string;
  startWeek: number;
  duration: number;
  color: string;
  track: Track;
  requiresApproval: boolean;
}

const TRACK_COLORS: Record<Track, string> = {
  'Strategy': '#0f4c75',
  'Design': '#10b981',
  'Development': '#6366f1',
  'Client Task': '#f59e0b'
};

export default function TimelineGenerator() {
  const navigate = useNavigate();
  const setProposalPayload = useEcosystemStore((state) => state.setProposalPayload);
  const { executeAction, isProcessing } = usePremiumAction();
  const [kickoffDate, setKickoffDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Discovery & Research', startWeek: 0, duration: 2, color: TRACK_COLORS.Strategy, track: 'Strategy', requiresApproval: false },
    { id: '2', name: 'UI Design Phase', startWeek: 2, duration: 3, color: TRACK_COLORS.Design, track: 'Design', requiresApproval: true },
    { id: '3', name: 'Frontend Engineering', startWeek: 5, duration: 4, color: TRACK_COLORS.Development, track: 'Development', requiresApproval: false },
    { id: '4', name: 'QA & Testing', startWeek: 9, duration: 2, color: TRACK_COLORS.Development, track: 'Development', requiresApproval: true },
  ]);
  const [isSaved, setIsSaved] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);
  const [showLoadDrafts, setShowLoadDrafts] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('freelancerkit_timeline_drafts');
    if (saved) {
      try {
        const drafts = JSON.parse(saved);
        setSavedDrafts(drafts);
        // Default to the most recent one if needed, or just let users load explicitly
      } catch (e) {
        console.error('Failed to parse timeline drafts', e);
      }
    }
  }, []);

  const maxWeeks = Math.max(12, ...tasks.map(t => t.startWeek + t.duration));
  const weekRange = Array.from({ length: maxWeeks }, (_, i) => i);

  const getStepDates = (startWk: number, duration: number) => {
    const kickoff = new Date(kickoffDate);
    const startDate = new Date(kickoff);
    startDate.setDate(kickoff.getDate() + (startWk * 7));
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (duration * 7));

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const addTask = () => {
    const lastTaskEnd = tasks.length > 0 ? Math.max(...tasks.map(t => t.startWeek + t.duration)) : 0;
    setTasks([...tasks, { 
      id: Date.now().toString(), 
      name: 'New Milestone', 
      startWeek: lastTaskEnd, 
      duration: 1, 
      color: TRACK_COLORS.Strategy,
      track: 'Strategy',
      requiresApproval: false
    }]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, field: keyof Task, value: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSaveDraft = async () => {
    executeAction(async (userId) => {
      const payload = {
        milestones: tasks,
        kickoffDate: kickoffDate
      };
      
      await DatabaseService.saveUserDocument(userId, 'timeline_draft', payload);
      await DatabaseService.logToolUsage('timeline-generator');

      const newDraft = {
        id: crypto.randomUUID(),
        name: `Timeline - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        data: payload,
        createdAt: new Date().toISOString()
      };

      const existingDrafts = JSON.parse(localStorage.getItem('freelancerkit_timeline_drafts') || '[]');
      const updatedDrafts = [newDraft, ...existingDrafts].slice(0, 5); // Keep last 5
      localStorage.setItem('freelancerkit_timeline_drafts', JSON.stringify(updatedDrafts));
      setSavedDrafts(updatedDrafts);

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);

      toast.success('Draft securely saved to Server.');
      
      // Also save to history service
      historyService.addToHistory({
        toolId: 'timeline-generator',
        toolName: 'Timeline Builder',
        summary: `${tasks.length} Milestones · ${maxWeeks} Week Timeline`,
        data: { tasks }
      });
    });
  };

  const handleLoadDraft = (draft: any) => {
    setTasks(draft.data.milestones);
    setKickoffDate(draft.data.kickoffDate);
    setShowLoadDrafts(false);
  };

  const deleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedDrafts.filter(d => d.id !== id);
    localStorage.setItem('freelancerkit_timeline_drafts', JSON.stringify(updated));
    setSavedDrafts(updated);
  };

  const handleAttachToProposal = () => {
    setIsExportModalOpen(true);
  };

  const handleDownloadTimeline = () => {
    executeAction(async () => {
      await DatabaseService.logToolUsage('timeline-generator');
      
      const content = `PROJECT TIMELINE SUMMARY\nGenerated: ${new Date().toLocaleDateString()}\nKickoff: ${kickoffDate}\nTotal Duration: ${maxWeeks} weeks\n\n` +
        tasks.map((t, i) => `${i + 1}. ${t.name}\n   Track: ${t.track}\n   Timing: Week ${t.startWeek + 1} - Week ${t.startWeek + t.duration}\n   Duration: ${t.duration} weeks\n`).join('\n');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-timeline-${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Timeline safely exported.');
      setIsExportModalOpen(false);
    });
  };

  const handlePushToProposal = () => {
    const formattedTimelineString = tasks
      .map((t, i) => `Phase ${i + 1}: ${t.name} (${t.duration} ${t.duration === 1 ? 'week' : 'weeks'})`)
      .join('. ');
    
    setProposalPayload({
      projectType: "Full-Stack Project Timeline",
      contextString: `Please include this strict project roadmap in the proposal: ${formattedTimelineString}. Total Duration: ${maxWeeks} weeks.`
    });

    setIsExportModalOpen(false);
    navigate('/tools/proposal-generator');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-80 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Timeline Builder</h3>
              <p className="text-xs text-slate-400">Map out project phases visually.</p>
            </div>
          </div>

          <div className="space-y-6 print:hidden">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Project Kickoff Date</label>
              <input 
                type="date" 
                value={kickoffDate || ''}
                onChange={(e) => setKickoffDate(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="absolute top-2 right-2 p-1 text-slate-300 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                    
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={task.name || ''}
                        onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                        className="w-full bg-transparent font-bold text-sm focus:outline-none placeholder:text-slate-300"
                        placeholder="Milestone Name"
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Track</label>
                          <select 
                            value={task.track || 'Strategy'}
                            onChange={(e) => {
                              const track = e.target.value as Track;
                              setTasks(tasks.map(t => t.id === task.id ? { ...t, track, color: TRACK_COLORS[track] } : t));
                            }}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            {Object.keys(TRACK_COLORS).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Approval</label>
                          <label className="flex items-center gap-2 px-2 py-1.5 bg-white border border-slate-200 rounded-lg cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={task.requiresApproval}
                              onChange={(e) => updateTask(task.id, 'requiresApproval', e.target.checked)}
                              className="w-3 h-3 rounded accent-primary"
                            />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Required</span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Start (Wk)</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={task.startWeek || 0}
                            onChange={(e) => updateTask(task.id, 'startWeek', Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dur (Wks)</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={task.duration || 0}
                            onChange={(e) => updateTask(task.id, 'duration', Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={addTask}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Project Step
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow w-full overflow-hidden">
           <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 overflow-x-auto shadow-inner min-h-[500px] print:bg-white print:border-0 print:shadow-none print:p-0">
              <div className="min-w-[800px] print:min-w-0">
                <div className="grid grid-cols-[180px_1fr] border-b border-slate-200 pb-4 mb-8">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Milestones</div>
                   <div className="flex">
                      {weekRange.map(w => (
                         <div key={w} className="flex-1 text-center text-[10px] font-black tracking-widest text-slate-300 border-l border-slate-300/10">
                            W{w + 1}
                         </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-6 relative">
                   {/* Vertical Guidelines */}
                   <div className="absolute inset-y-0 left-[180px] right-0 flex pointer-events-none">
                      {weekRange.map(w => (
                         <div key={w} className="flex-1 border-l border-slate-200/50 h-full" />
                      ))}
                      <div className="flex-0 border-l border-slate-200/50 h-full" />
                   </div>

                   {tasks.map((task) => (
                      <div key={task.id} className="grid grid-cols-[180px_1fr] items-center mb-6 last:mb-0 group relative z-10">
                         <div className="flex flex-col truncate pr-4">
                            <span className="text-xs font-bold text-slate-700 truncate">{task.name}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{task.track}</span>
                         </div>
                         <div className="relative h-10 flex">
                            <motion.div 
                              layoutId={task.id}
                              style={{ 
                                marginLeft: `${(task.startWeek / maxWeeks) * 100}%`,
                                width: `${(task.duration / maxWeeks) * 100}%`,
                                backgroundColor: task.color
                              }}
                              className="h-full rounded-xl shadow-lg shadow-black/5 flex flex-col items-center justify-center px-3 group-hover:scale-y-105 transition-transform cursor-pointer relative"
                            >
                               <span className="text-[7px] font-black text-white/50 uppercase tracking-[0.2em] truncate w-full text-center">
                                 {getStepDates(task.startWeek, task.duration)}
                               </span>
                               <span className="text-[8px] font-black text-white uppercase tracking-widest hidden sm:block truncate w-full text-center">
                                 {task.duration} {task.duration === 1 ? 'Week' : 'Weeks'}
                               </span>

                               {task.requiresApproval && (
                                 <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-danger rounded-lg flex items-center justify-center shadow-xl z-20" title="Requires Client Approval">
                                   <div className="w-2 h-2 bg-danger rotate-45" />
                                 </div>
                               )}
                            </motion.div>
                         </div>
                      </div>
                   ))}
                </div>

                 <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap justify-end gap-3 print:hidden">
                   <div className="relative">
                      <button 
                        onClick={() => setShowLoadDrafts(!showLoadDrafts)}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                      >
                         <LayoutGrid size={14} className="text-slate-400" /> 
                         {savedDrafts.length > 0 ? `Load Draft (${savedDrafts.length})` : 'Load Draft'}
                      </button>

                      <AnimatePresence>
                        {showLoadDrafts && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full mb-3 right-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                          >
                             <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saved Timelines</h4>
                             </div>
                             <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {savedDrafts.length === 0 ? (
                                  <div className="p-8 text-center text-slate-400 text-[10px] font-bold italic">
                                    No drafts found.
                                  </div>
                                ) : (
                                  savedDrafts.map((draft) => (
                                    <div 
                                      key={draft.id}
                                      onClick={() => handleLoadDraft(draft)}
                                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group flex items-center justify-between"
                                    >
                                       <div className="flex flex-col gap-0.5">
                                          <span className="text-xs font-bold text-slate-700">{draft.name.split(' - ')[0]}</span>
                                          <span className="text-[9px] font-medium text-slate-400 truncate">{draft.name.split(' - ')[1]}</span>
                                       </div>
                                       <button 
                                        onClick={(e) => deleteDraft(draft.id, e)}
                                        className="p-1.5 text-slate-300 hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
                                       >
                                          <Trash2 size={12} />
                                       </button>
                                    </div>
                                  ))
                                )}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>

                   <button 
                    onClick={handleSaveDraft}
                    className={`px-6 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm active:scale-95 ${isSaved ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                   >
                      {isSaved ? <Check size={14} /> : <Download size={14} className="text-slate-400" />}
                      {isSaved ? 'Saved!' : 'Save Draft'}
                   </button>
                   <button 
                    onClick={handleAttachToProposal}
                    className="px-6 py-3 bg-[#0f4c75] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0f4c75]/90 transition-all shadow-lg shadow-[#0f4c75]/20 active:scale-95"
                   >
                      Export Timeline <ArrowRight size={14} />
                   </button>
                   <button 
                    onClick={handlePrint}
                    className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
                   >
                      <Printer size={14} /> Print Roadmap
                   </button>
                </div>
              </div>
           </div>

           <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">
              <div className="flex items-center gap-2">
                 <Clock size={12} className="text-primary" /> Total Timeline: {maxWeeks} Weeks
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-white border-2 border-danger rounded-sm flex items-center justify-center">
                   <div className="w-1 h-1 bg-danger rotate-45" />
                 </div>
                 Client Approval Reqd
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircle2 size={12} className="text-success" /> Fixed Delivery Points
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-slate-300" /> Track Markers Enabled
              </div>
           </div>
        </div>
      </div>
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <Download size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Export Timeline</h3>
                    <p className="text-sm text-slate-500 font-medium tracking-tight">Your project roadmap is ready. Choose an export path.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={handleDownloadTimeline}
                    className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                      <Download size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-slate-900">Download locally</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Text / CSV Roadmap</span>
                    </div>
                  </button>

                  <button 
                    onClick={handlePushToProposal}
                    className="flex items-center gap-4 p-6 bg-indigo-600 border border-indigo-500 rounded-2xl hover:bg-indigo-700 transition-all text-left group shadow-xl shadow-indigo-500/20"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      <ArrowRight size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-white">Draft AI Proposal</span>
                      <span className="text-[10px] text-indigo-200 font-medium uppercase tracking-tight">Push to Proposal Generator</span>
                    </div>
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center">
                  <button 
                    onClick={() => setIsExportModalOpen(false)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Cancel & Return
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAuthToast && (
          <motion.div 
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-white/10 flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
               </div>
               <div className="flex-1">
                  <h5 className="text-sm font-bold mb-1">Draft saved locally!</h5>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">Create a free account to sync your drafts across all devices and unlock cloud storage.</p>
                  <div className="flex items-center gap-3">
                     <button 
                      onClick={() => navigate('/signup')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                     >
                        Sign Up
                     </button>
                     <button 
                      onClick={() => setShowAuthToast(false)}
                      className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
                     >
                        Maybe Later
                     </button>
                  </div>
               </div>
               <button 
                onClick={() => setShowAuthToast(false)}
                className="text-slate-500 hover:text-white"
               >
                  <XCircle size={16} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
