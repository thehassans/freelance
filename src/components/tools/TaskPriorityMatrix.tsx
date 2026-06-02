import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Target, 
  Zap, 
  AlertCircle, 
  Clock, 
  Save, 
  Download,
  Info
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  quadrant: 'do' | 'schedule' | 'delegate' | 'delete';
}

export default function TaskPriorityMatrix() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [exportCredits, setExportCredits] = useState(5);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('matrix_tasks');
    const savedCredits = localStorage.getItem('matrix_credits');
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse saved tasks');
      }
    }
    
    if (savedCredits) {
      setExportCredits(parseInt(savedCredits));
    } else {
      // Default initial data if empty
      setTasks([
        { id: '1', name: 'Finish client invoice', quadrant: 'do' },
        { id: '2', name: 'Update portfolio', quadrant: 'schedule' },
        { id: '3', name: 'Refactor old code', quadrant: 'delete' },
      ]);
    }
  }, []);

  // Sync credits to localStorage
  useEffect(() => {
    localStorage.setItem('matrix_credits', exportCredits.toString());
  }, [exportCredits]);

  const addTask = (quadrant: Task['quadrant'] = 'do') => {
    if (!newTaskName) return;
    const newTask: Task = { id: Date.now().toString(), name: newTaskName, quadrant };
    setTasks([...tasks, newTask]);
    setNewTaskName('');
    toast.success('Task added to matrix');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.error('Task removed');
  };

  const moveTask = (id: string, quadrant: Task['quadrant']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, quadrant } : t));
  };

  const clearCompleted = () => {
    setTasks([]);
    toast.info('Matrix cleared');
  };

  const handleSaveMatrix = () => {
    localStorage.setItem('matrix_tasks', JSON.stringify(tasks));
    toast.success('Matrix saved successfully!');
  };

  const handleExportPDF = () => {
    if (exportCredits > 0) {
      setExportCredits(prev => prev - 1);
      toast.success('PDF Exported Successfully');
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      toast.error('Monthly export limit reached! Upgrade to Pro.');
    }
  };

  const quadrants = {
    do: { 
      title: 'Important & Urgent', 
      label: 'Do It Now', 
      color: 'bg-rose-50 border-rose-100', 
      icon: <Zap size={18} className="text-rose-500" />,
      tagColor: '#f43f5e'
    },
    schedule: { 
      title: 'Important but Not Urgent', 
      label: 'Schedule It', 
      color: 'bg-indigo-50 border-indigo-100', 
      icon: <Target size={18} className="text-indigo-500" />,
      tagColor: '#6366f1'
    },
    delegate: { 
      title: 'Urgent but Not Important', 
      label: 'Delegate It', 
      color: 'bg-emerald-50 border-emerald-100', 
      icon: <Clock size={18} className="text-emerald-500" />,
      tagColor: '#10b981'
    },
    delete: { 
      title: 'Neither Urgent nor Important', 
      label: 'Eliminate It', 
      color: 'bg-slate-50 border-slate-200', 
      icon: <AlertCircle size={18} className="text-slate-400" />,
      tagColor: '#64748b'
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Branding and Actions */}
      <div className="flex flex-col md:flex-row items-center justify-end gap-6 print:hidden">
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveMatrix}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm shadow-sm"
          >
            <Save size={18} className="text-indigo-500" /> Save Matrix
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-md relative group"
          >
            <Download size={18} /> Export PDF
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full border border-white animate-pulse">
              ⚡ {exportCredits} Left
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Plus className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter a new task to prioritize..."
              value={newTaskName || ''}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:border-indigo-500 text-lg font-medium transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => addTask()}
              className="flex-1 sm:flex-none px-8 py-5 bg-indigo-600 text-white rounded-3xl font-bold hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-lg shadow-indigo-200"
            >
              Add Task
            </button>
            <button 
              onClick={clearCompleted}
              className="px-5 py-5 bg-slate-100 text-slate-400 rounded-3xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-transparent"
              title="Clear Matrix"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:w-full">
        {(Object.keys(quadrants) as Array<keyof typeof quadrants>).map((q) => (
          <div 
            key={q} 
            className={`${quadrants[q].color} p-8 rounded-[3rem] border min-h-[350px] flex flex-col transition-all hover:shadow-xl hover:shadow-slate-200/50 print:shadow-none print:bg-white print:border-slate-300 print:rounded-2xl`}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-white flex items-center justify-center shadow-sm">
                  {quadrants[q].icon}
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{quadrants[q].title}</h4>
                  <p className="text-lg font-black text-slate-800">{quadrants[q].label}</p>
                </div>
              </div>
              <span className="flex items-center justify-center w-10 h-10 text-xs font-black bg-white rounded-xl border border-white text-slate-400 shadow-sm">
                {tasks.filter(t => t.quadrant === q).length}
              </span>
            </div>

            <div className="flex-grow space-y-3">
              <AnimatePresence initial={false} mode="popLayout">
                {tasks.filter(t => t.quadrant === q).map((task) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={task.id}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group transition-all hover:border-indigo-200 hover:shadow-md print:shadow-none print:border-slate-200"
                  >
                    <span className="text-sm text-slate-700 font-bold">{task.name}</span>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                      {(Object.keys(quadrants) as Array<keyof typeof quadrants>).filter(target => target !== q).map(target => (
                        <button 
                          key={target}
                          onClick={() => moveTask(task.id, target)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white hover:scale-110 active:scale-95 transition-all shadow-sm"
                          style={{ backgroundColor: quadrants[target].tagColor }}
                          title={`Move to ${quadrants[target].label}`}
                        >
                          {target[0].toUpperCase()}
                        </button>
                      ))}
                      <button 
                        onClick={() => removeTask(task.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all ml-1 border border-transparent hover:border-rose-100"
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks.filter(t => t.quadrant === q).length === 0 && (
                <div className="h-full flex items-center justify-center opacity-40 border-2 border-dashed border-slate-200 rounded-3xl min-h-[120px] print:hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Empty Quadrant</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl print:hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
         <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-6">
                <Info size={14} /> Pro Productivity Tip
              </div>
              <h4 className="text-3xl font-black mb-6 tracking-tight">The Eisenhower Decision Engine</h4>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 font-medium">
                Distinguish between tasks that are <span className="text-rose-400 font-bold italic">Urgent</span> (demand immediate attention) and those that are <span className="text-indigo-400 font-bold italic">Important</span> (contribute to long-term goals). Growth happens when you carve out time for the "Schedule" quadrant.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                   <span className="text-xs font-black uppercase tracking-widest text-slate-500">Immediate Action</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-indigo-500" />
                   <span className="text-xs font-black uppercase tracking-widest text-slate-500">Long-term Growth</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex w-32 h-32 bg-white/5 rounded-[2.5rem] border border-white/10 items-center justify-center text-indigo-500 rotate-12 shadow-2xl backdrop-blur-sm">
               <Target size={64} />
            </div>
         </div>
      </div>

      {/* SEO Section */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
        <h2>What is a Task Priority Matrix?</h2>
        <p>
          A Task Priority Matrix is a productivity and project management tool used to organize tasks based on their urgency and importance. It helps individuals, teams, and businesses prioritize work more effectively by identifying which tasks should be completed immediately, scheduled for later, delegated, or removed entirely.
        </p>
        <p>
          The matrix provides a structured approach to decision-making, helping teams focus on high-impact activities while reducing distractions and unnecessary workload.
        </p>

        <h3>Why a Task Priority Matrix Matters</h3>
        <p>
          In fast-paced work environments, managing multiple tasks at once can become overwhelming. Without clear prioritization, teams may spend time on low-value activities while critical tasks remain unfinished.
        </p>
        <p>A Task Priority Matrix helps businesses and professionals:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Improve productivity</li>
          <li>Manage workloads efficiently</li>
          <li>Reduce stress and confusion</li>
          <li>Focus on high-impact tasks</li>
          <li>Meet deadlines more consistently</li>
          <li>Improve team coordination</li>
        </ul>
        <p>By clearly organizing priorities, teams can make faster and more strategic decisions.</p>

        <h3>How a Task Priority Matrix Works</h3>
        <p>
          A typical Task Priority Matrix divides tasks into four categories based on Importance and Urgency. The four sections commonly include:
        </p>

        <h4>Important & Urgent</h4>
        <p>These tasks require immediate attention and directly impact business goals, deadlines, or critical operations.</p>
        <p>Examples:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Production issues</li>
          <li>Critical bug fixes</li>
          <li>Client emergencies</li>
          <li>Deadline-sensitive projects</li>
        </ul>
        <p>These tasks should be completed first.</p>

        <h4>Important but Not Urgent</h4>
        <p>These tasks contribute to long-term growth and success but do not require immediate action.</p>
        <p>Examples:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Strategic planning</li>
          <li>Skill development</li>
          <li>Process improvements</li>
          <li>Product research</li>
        </ul>
        <p>These tasks should be scheduled and planned carefully.</p>

        <h4>Urgent but Not Important</h4>
        <p>These tasks may demand quick attention but provide lower long-term value.</p>
        <p>Examples:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Routine emails</li>
          <li>Minor support requests</li>
          <li>Administrative work</li>
          <li>Interruptions and meetings</li>
        </ul>
        <p>These tasks are often delegated when possible.</p>

        <h4>Neither Urgent nor Important</h4>
        <p>These tasks usually provide little value and may reduce productivity.</p>
        <p>Examples:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Unnecessary meetings</li>
          <li>Repetitive low-value tasks</li>
          <li>Time-wasting activities</li>
        </ul>
        <p>These tasks should be minimized or eliminated.</p>

        <h3>Benefits of Using a Task Priority Matrix</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Better Time Management:</strong> The matrix helps users focus on meaningful work instead of reacting to every task equally.</li>
          <li><strong>Increased Productivity:</strong> Teams can prioritize high-impact activities and reduce wasted effort on low-priority work.</li>
          <li><strong>Improved Decision-Making:</strong> A clear prioritization framework makes it easier to determine what should be handled first.</li>
          <li><strong>Reduced Stress:</strong> Organized task management helps reduce overwhelm by creating clarity and structure.</li>
          <li><strong>Stronger Team Collaboration:</strong> Team members gain better visibility into priorities, responsibilities, and deadlines.</li>
        </ul>

        <h3>Features Commonly Included</h3>
        <p>A Task Priority Matrix tool may include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Drag-and-drop task organization</li>
          <li>Priority scoring</li>
          <li>Deadline tracking</li>
          <li>Team assignments</li>
          <li>Progress monitoring</li>
          <li>Workflow automation</li>
          <li>Color-coded categories</li>
          <li>Task filtering and sorting</li>
          <li>Collaboration tools</li>
          <li>Productivity analytics</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>A Task Priority Matrix is commonly used for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Project management</li>
          <li>Software development</li>
          <li>Business operations</li>
          <li>Marketing campaigns</li>
          <li>Team productivity</li>
          <li>Personal task management</li>
          <li>Agile workflows</li>
          <li>Strategic planning</li>
        </ul>

        <h3>Why Businesses Use Task Priority Matrices</h3>
        <p>Businesses use priority matrices to maintain focus and improve operational efficiency. Benefits include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Faster project execution</li>
          <li>Better resource allocation</li>
          <li>Improved deadline management</li>
          <li>Reduced workflow bottlenecks</li>
          <li>More organized team structures</li>
          <li>Increased accountability</li>
        </ul>

        <h3>Final Thoughts</h3>
        <p>
          A Task Priority Matrix is a valuable productivity and project management tool that helps individuals and teams organize work based on urgency and importance. By creating a clear system for prioritization, businesses can improve efficiency, reduce distractions, and focus on tasks that drive the greatest impact.
        </p>
        <p>
          Whether managing daily responsibilities or large-scale projects, a Task Priority Matrix provides the structure needed for better planning, collaboration, and long-term success.
        </p>
      </section>
    </div>
  );
}
