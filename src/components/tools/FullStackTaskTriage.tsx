import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  Layout, 
  Database, 
  Server, 
  Shield, 
  Box,
  ChevronRight,
  Filter,
  SortDesc,
  Info,
  Save,
  Download,
  Zap,
  Check
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Infrastructure' | 'QA';
  urgency: number;
  impact: number;
  assignee: string;
  hours: number;
  status: 'Open' | 'Done';
  score: number;
  createdAt: number;
}

const CATEGORIES: ('Frontend' | 'Backend' | 'Database' | 'Infrastructure' | 'QA')[] = [
  'Frontend', 'Backend', 'Database', 'Infrastructure', 'QA'
];

export default function FullStackTaskTriage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Task['category']>('Frontend');
  const [urgency, setUrgency] = useState(3);
  const [impact, setImpact] = useState(3);
  const [assignee, setAssignee] = useState('');
  const [hours, setHours] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'Done'>('All');
  const [exportCredits, setExportCredits] = useState(5);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('triage_tasks');
    const credits = localStorage.getItem('triage_credits');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    }
    if (credits) {
      setExportCredits(parseInt(credits));
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('triage_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('triage_credits', exportCredits.toString());
  }, [exportCredits]);

  const stats = useMemo(() => {
    const openTasks = tasks.filter(t => t.status === 'Open');
    const pendingHours = openTasks.reduce((acc, curr) => acc + (curr.hours || 0), 0);
    return { pendingHours };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (activeTab === 'Open') result = tasks.filter(t => t.status === 'Open');
    if (activeTab === 'Done') result = tasks.filter(t => t.status === 'Done');
    return result.sort((a, b) => b.score - a.score);
  }, [tasks, activeTab]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      urgency,
      impact,
      assignee: assignee || 'Unassigned',
      hours: hours || 0,
      status: 'Open',
      score: urgency * impact,
      createdAt: Date.now()
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setCategory('Frontend');
    setUrgency(3);
    setImpact(3);
    setAssignee('');
    setHours(1);
    toast.success('Task added to queue');
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'Open' ? 'Done' : 'Open';
        return { ...t, status: newStatus };
      }
      return t;
    }));
    toast.info('Task status updated');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.error('Task removed');
  };

  const handleSaveBoard = () => {
    localStorage.setItem('triage_tasks', JSON.stringify(tasks));
    toast.success('Task board saved successfully!');
  };

  const handleExport = () => {
    if (exportCredits > 0) {
      setExportCredits(prev => prev - 1);
      window.print();
      toast.success('PDF Exported Successfully');
    } else {
      toast.error('Monthly export limit reached! Upgrade to Pro.');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'bg-rose-500 text-white';
    if (score >= 10) return 'bg-amber-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const getCategoryIcon = (cat: Task['category']) => {
    switch (cat) {
      case 'Frontend': return <Layout size={14} />;
      case 'Backend': return <Server size={14} />;
      case 'Database': return <Database size={14} />;
      case 'Infrastructure': return <Box size={14} />;
      case 'QA': return <Shield size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto mb-16">
        {/* Left Panel: The Triage Input Form */}
        <div className="w-full lg:w-5/12 print:hidden">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                 <Plus size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Create New Task</h3>
            </div>

            <form onSubmit={addTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Task Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement OAuth2 Login"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical details, dependencies..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Stack Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Task['category'])}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer text-sm"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Assignee</label>
                  <input 
                    type="text" 
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Enter team member..."
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all text-sm font-sans"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Time Estimate (Hours)</label>
                <input 
                  type="number" 
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
              </div>

              <div className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Urgency (1-5)</label>
                    <span className="text-indigo-600 font-black text-sm">{urgency}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={urgency}
                    onChange={(e) => setUrgency(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Business Impact (1-5)</label>
                    <span className="text-emerald-600 font-black text-sm">{impact}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={impact}
                    onChange={(e) => setImpact(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 mt-4"
              >
                Add to Queue <Plus size={20} />
              </button>
            </form>
          </section>
        </div>

        {/* Right Panel: The Save System & Task Queue */}
        <div className="w-full lg:w-7/12 print:w-full">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl min-h-full border border-slate-800 relative overflow-hidden print:bg-white print:text-slate-900 print:shadow-none print:border-none">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none print:hidden" />
             
             <div className="relative z-10">
                <div className="flex flex-col gap-6 mb-8 print:mb-12">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5 print:bg-slate-100 print:border-slate-200">
                        <SortDesc size={20} className="text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white print:text-slate-900">Task Queue</h3>
                    </div>
                    <div className="flex items-center gap-3 print:hidden">
                      <button 
                        onClick={handleSaveBoard}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        <Save size={14} /> Save
                      </button>
                      <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-all relative group"
                      >
                        <Download size={14} /> Export
                        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-emerald-500 text-[8px] font-black rounded-full border border-slate-900 animate-pulse">
                          ⚡ {exportCredits} Left
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl print:bg-slate-50 print:border-slate-100">
                    <div className="flex gap-1 print:hidden">
                      {(['All', 'Open', 'Done'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab 
                              ? 'bg-indigo-600 text-white shadow-lg' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending:</span>
                        <span className="text-sm font-black text-indigo-400">{stats.pendingHours} HRS</span>
                      </div>
                      <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-widest print:border-slate-200">
                        {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl text-slate-500 print:bg-slate-50 print:border-slate-200"
                      >
                        <Clock size={40} className="mb-4 opacity-20" />
                        <p className="font-bold">No tasks found</p>
                        <p className="text-xs">Update filters or add a new task.</p>
                      </motion.div>
                    ) : (
                      filteredTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: task.status === 'Done' ? 0.6 : 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`group relative overflow-hidden rounded-3xl p-6 border transition-all ${
                            task.status === 'Done'
                              ? 'bg-slate-800/30 border-white/5'
                              : 'bg-slate-800/50 hover:bg-slate-800 border-white/10 shadow-lg'
                          } print:bg-white print:border-slate-200 print:shadow-none print:opacity-100 print:break-inside-avoid`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="p-1 px-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 print:bg-slate-100 print:text-slate-600 print:border-slate-200">
                                  {getCategoryIcon(task.category)} {task.category}
                                </span>
                                <span className={`p-1 px-2 rounded-md text-[9px] font-black uppercase tracking-widest ${getScoreColor(task.score)} shadow-[0_4px_12px_rgba(0,0,0,0.1)] print:text-slate-900 print:shadow-none`}>
                                  Score: {task.score}
                                </span>
                                <span className={`p-1 px-2 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                  task.status === 'Done' ? 'bg-slate-600 text-slate-300' : 'bg-indigo-600 text-white'
                                } print:bg-slate-100 print:text-slate-600`}>
                                  {task.status}
                                </span>
                                {task.hours > 0 && (
                                  <span className="p-1 px-2 bg-white/5 border border-white/5 rounded-md text-[9px] font-bold text-slate-400 print:border-slate-200">
                                    {task.hours}h EST
                                  </span>
                                )}
                              </div>
                              <h4 className={`text-lg font-black text-white group-hover:text-indigo-300 transition-colors print:text-slate-900 ${
                                task.status === 'Done' ? 'line-through' : ''
                              }`}>
                                {task.title}
                              </h4>
                              <p className="text-sm text-slate-400 line-clamp-2 print:text-slate-500">{task.description}</p>
                              
                              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/5 print:border-slate-100">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center border border-white/10 print:bg-slate-100">
                                    <User size={12} className="text-slate-400" />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:text-slate-600">{task.assignee}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                   <Clock size={12} />
                                   <span className="text-[10px] font-bold uppercase tracking-widest">
                                     {new Date(task.createdAt).toLocaleDateString()}
                                   </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 print:hidden">
                              <button 
                                onClick={() => toggleStatus(task.id)}
                                className={`p-3 rounded-xl transition-all ${
                                  task.status === 'Done' 
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                }`}
                                title={task.status === 'Done' ? 'Completed' : 'Mark as Done'}
                                disabled={task.status === 'Done'}
                              >
                                {task.status === 'Done' ? <CheckCircle2 size={18} /> : <Check size={18} />}
                              </button>
                              <button 
                                onClick={() => deleteTask(task.id)}
                                className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all rounded-xl"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4 print:hidden">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                    <Info size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Triage Engine Active</p>
                    <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                      Sorting strategy: <span className="text-indigo-400 font-bold">Urgency (1-5) × Impact (1-5)</span>. <br/>
                      Total pending hours based on open task estimations.
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Authority SEO & Educational Guide */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
        <h2>What is Full-Stack Task Triage?</h2>
        <p>
          Full-Stack Task Triage is a workflow management and prioritization tool designed to help development teams organize, evaluate, and assign technical tasks across the entire software stack — including frontend, backend, databases, APIs, infrastructure, and deployment systems.
        </p>
        <p>
          The tool helps teams quickly identify task priority, complexity, urgency, dependencies, and ownership so projects can move forward more efficiently.
        </p>
        <p>
          Whether managing bugs, feature requests, technical debt, or deployment issues, Full-Stack Task Triage streamlines the decision-making process for development teams.
        </p>

        <h2>Why Full-Stack Task Triage Matters</h2>
        <p>
          Modern software projects involve multiple technologies and teams working together simultaneously. Without proper task organization, projects can become delayed, inefficient, and difficult to manage.
        </p>
        <p>A Full-Stack Task Triage system helps businesses and development teams:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Prioritize critical issues faster</li>
          <li>Improve team collaboration</li>
          <li>Reduce project bottlenecks</li>
          <li>Organize frontend and backend workloads</li>
          <li>Track technical dependencies</li>
          <li>Improve development efficiency</li>
        </ul>
        <p>By categorizing and prioritizing tasks effectively, teams can focus on the most impactful work first.</p>

        <h2>Benefits of Full-Stack Task Triage</h2>
        
        <h3>Better Task Prioritization</h3>
        <p>The tool helps identify which tasks require immediate attention based on urgency, business impact, technical complexity, or production risk.</p>
        
        <h3>Improved Team Coordination</h3>
        <p>Frontend developers, backend engineers, DevOps teams, and project managers can collaborate more effectively with clear task ownership and status tracking.</p>
        
        <h3>Faster Issue Resolution</h3>
        <p>Critical bugs and system failures can be identified and escalated quickly, helping reduce downtime and improve system reliability.</p>
        
        <h3>Enhanced Project Visibility</h3>
        <p>Teams gain a centralized overview of development progress, pending tasks, blockers, and upcoming priorities.</p>
        
        <h3>Reduced Development Bottlenecks</h3>
        <p>By identifying task dependencies early, the tool helps prevent workflow interruptions and delays.</p>

        <h2>Key Features of a Full-Stack Task Triage Tool</h2>
        <p>A Full-Stack Task Triage system may include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Task prioritization</li>
          <li>Bug tracking</li>
          <li>Sprint planning</li>
          <li>Dependency management</li>
          <li>Team assignment</li>
          <li>Progress tracking</li>
          <li>Severity classification</li>
          <li>Deadline management</li>
          <li>Workflow automation</li>
          <li>Performance analytics</li>
          <li>Issue categorization</li>
          <li>Technical documentation support</li>
        </ul>
        <p>These features help teams manage projects more efficiently across the entire development lifecycle.</p>

        <h2>How Full-Stack Task Triage Works</h2>
        <p>The tool collects and organizes incoming development tasks from different sources such as:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Bug reports</li>
          <li>Client requests</li>
          <li>Feature suggestions</li>
          <li>Support tickets</li>
          <li>QA testing feedback</li>
          <li>System monitoring alerts</li>
        </ul>
        <p>Tasks are then analyzed and categorized based on factors such as:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Priority level</li>
          <li>Technical complexity</li>
          <li>Estimated development time</li>
          <li>Affected systems</li>
          <li>Business impact</li>
          <li>Required team or developer</li>
        </ul>
        <p>This helps teams determine what should be addressed first and how resources should be allocated.</p>

        <h2>Common Use Cases</h2>
        <p>Full-Stack Task Triage is useful for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Software development agencies</li>
          <li>SaaS platforms</li>
          <li>Startup engineering teams</li>
          <li>Enterprise applications</li>
          <li>DevOps operations</li>
          <li>Product management workflows</li>
          <li>Agile development environments</li>
        </ul>
        <p>It can be used to manage everything from daily bug fixes to large-scale product releases.</p>

        <h2>Why Development Teams Use Full-Stack Task Triage</h2>
        <p>Development teams use task triage systems to maintain organization and productivity in fast-moving technical environments.</p>
        <p>Benefits include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Faster development cycles</li>
          <li>Better communication</li>
          <li>Improved release management</li>
          <li>Higher product quality</li>
          <li>Reduced technical debt</li>
          <li>More predictable project timelines</li>
        </ul>
        <p>Efficient task triage helps teams deliver features and fixes more consistently.</p>

        <h2>Final Thoughts</h2>
        <p>
          Full-Stack Task Triage is an essential tool for managing complex software development workflows. By organizing, prioritizing, and tracking tasks across frontend, backend, and infrastructure systems, teams can improve efficiency, reduce delays, and build more reliable products.
        </p>
      </section>
    </div>
  );
}
