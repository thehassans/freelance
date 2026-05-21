import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Target, Zap, AlertCircle, Clock, Check } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  quadrant: 'do' | 'schedule' | 'delegate' | 'delete';
}

export default function TaskPrioritizer() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Finish client invoice', quadrant: 'do' },
    { id: '2', name: 'Update portfolio', quadrant: 'schedule' },
    { id: '3', name: 'Refactor old code', quadrant: 'delete' },
  ]);

  const [newTaskName, setNewTaskName] = useState('');

  const addTask = (quadrant: Task['quadrant']) => {
    if (!newTaskName) return;
    setTasks([...tasks, { id: Date.now().toString(), name: newTaskName, quadrant }]);
    setNewTaskName('');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const moveTask = (id: string, quadrant: Task['quadrant']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, quadrant } : t));
  };

  const clearCompleted = () => {
    setTasks([]);
  };

  const quadrants = {
    do: { 
      title: 'Urgent & Important', 
      label: 'Do It Now', 
      color: 'bg-danger/5 shadow-danger/10', 
      icon: <Zap size={18} className="text-danger" />,
      tagColor: 'bg-danger text-white'
    },
    schedule: { 
      title: 'Important, Not Urgent', 
      label: 'Schedule It', 
      color: 'bg-primary/5 shadow-primary/10', 
      icon: <Target size={18} className="text-primary" />,
      tagColor: 'bg-primary text-white'
    },
    delegate: { 
      title: 'Urgent, Not Important', 
      label: 'Delegate It', 
      color: 'bg-accent/5 shadow-accent/10', 
      icon: <Clock size={18} className="text-accent" />,
      tagColor: 'bg-accent text-white'
    },
    delete: { 
      title: 'Neither', 
      label: 'Eliminate It', 
      color: 'bg-slate-50 shadow-slate-200/50', 
      icon: <AlertCircle size={18} className="text-slate-400" />,
      tagColor: 'bg-slate-400 text-white'
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input 
            type="text" 
            placeholder="What needs to be done?"
            value={newTaskName || ''}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask('do')}
            className="flex-grow px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-lg"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => addTask('do')}
              className="flex-1 sm:flex-none px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all text-sm"
            >
              Add Task
            </button>
            <button 
              onClick={clearCompleted}
              className="px-4 py-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-all border border-transparent"
              title="Clear All"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(quadrants) as Array<keyof typeof quadrants>).map((q) => (
          <div 
            key={q} 
            className={`${quadrants[q].color} p-6 rounded-[2rem] border border-white min-h-[300px] flex flex-col`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                  {quadrants[q].icon}
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{quadrants[q].title}</h4>
                  <p className="text-sm font-bold text-slate-700">{quadrants[q].label}</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-white rounded-md border border-slate-100 text-slate-300">
                {tasks.filter(t => t.quadrant === q).length}
              </span>
            </div>

            <div className="flex-grow space-y-3">
              <AnimatePresence initial={false}>
                {tasks.filter(t => t.quadrant === q).map((task) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={task.id}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group"
                  >
                    <span className="text-sm text-slate-700 font-medium">{task.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(Object.keys(quadrants) as Array<keyof typeof quadrants>).filter(target => target !== q).map(target => (
                        <button 
                          key={target}
                          onClick={() => moveTask(task.id, target)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white transition-transform hover:scale-110`}
                          style={{ backgroundColor: quadrants[target].tagColor.split(' ')[0] === 'bg-primary' ? '#0f4c75' : quadrants[target].tagColor.split(' ')[0] === 'bg-danger' ? '#ff6b6b' : quadrants[target].tagColor.split(' ')[0] === 'bg-accent' ? '#1b998b' : '#334155' }}
                        >
                          {target[0].toUpperCase()}
                        </button>
                      ))}
                      <button 
                        onClick={() => removeTask(task.id)}
                        className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-danger/10 hover:text-danger ml-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks.filter(t => t.quadrant === q).length === 0 && (
                <div className="h-full flex items-center justify-center opacity-20 border-2 border-dashed border-slate-200 rounded-2xl min-h-[100px]">
                  <p className="text-xs font-bold uppercase tracking-widest italic">Clear Sky</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl -mr-32 -mt-32 rounded-full" />
         <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h4 className="text-2xl font-bold mb-4 font-display italic">The Eisenhower Method</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Most freelancers spend all their time in the <span className="text-danger font-bold">Urgent</span> quadrants. 
                True growth happens when you clear the Urgent tasks (Do / Delegate) to make space for the <span className="text-primary font-bold">Important, Not Urgent</span> tasks (Schedule) like marketing and portfolio updates.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-danger" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Urgency</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Importance</span>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-primary rotate-12">
               <Target size={40} />
            </div>
         </div>
      </div>
    </div>
  );
}
