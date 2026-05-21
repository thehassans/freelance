import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Play, AlertCircle, Calendar, 
  Users, Ghost, GripVertical, CheckCircle2,
  Clock, ArrowRight
} from 'lucide-react';

interface Task {
  id: string;
  text: string;
  quadrant: 'q1' | 'q2' | 'q3' | 'q4';
}

type QuadrantType = 'q1' | 'q2' | 'q3' | 'q4';

interface QuadrantConfig {
  id: QuadrantType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}

const QUADRANTS: QuadrantConfig[] = [
  {
    id: 'q1',
    title: 'DO NOW',
    subtitle: 'Urgent & Important',
    icon: <AlertCircle size={18} />,
    color: 'text-red-600',
    bg: 'bg-red-50/30',
    border: 'border-red-100'
  },
  {
    id: 'q2',
    title: 'SCHEDULE',
    subtitle: 'Not Urgent, Important',
    icon: <Calendar size={18} />,
    color: 'text-[#0f4c75]',
    bg: 'bg-blue-50/30',
    border: 'border-blue-100'
  },
  {
    id: 'q3',
    title: 'DELEGATE',
    subtitle: 'Urgent, Not Important',
    icon: <Users size={18} />,
    color: 'text-amber-600',
    bg: 'bg-amber-50/30',
    border: 'border-amber-100'
  },
  {
    id: 'q4',
    title: 'ELIMINATE',
    subtitle: 'Not Urgent, Not Important',
    icon: <Ghost size={18} />,
    color: 'text-slate-400',
    bg: 'bg-slate-50/30',
    border: 'border-slate-100'
  }
];

export default function TaskTriage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Fix critical database deadlock in staging', quadrant: 'q1' },
    { id: '2', text: 'Plan quarterly roadmap for Agency X', quadrant: 'q2' },
    { id: '3', text: 'Respond to generic networking requests on LinkedIn', quadrant: 'q3' },
    { id: '4', text: 'Browse infinite scroll design inspiration', quadrant: 'q4' }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // 1. DATA LOGIC & STATE
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTaskText,
      quadrant: 'q1' // Default to Q1
    };
    
    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // 2. DRAG & DROP ENGINE
  const onDragStart = (e: any, id: string) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('taskId', id);
    }
  };

  const onDrop = (e: any, targetQuadrant: QuadrantType) => {
    if (e.dataTransfer) {
      const taskId = e.dataTransfer.getData('taskId');
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, quadrant: targetQuadrant } : t));
    }
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8 min-h-[700px]">
      {/* Header & Inbox */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">Task Triage</h2>
            <p className="text-xs text-slate-500 font-medium italic">"What is important is seldom urgent and what is urgent is seldom important."</p>
          </div>
        </div>

        <form onSubmit={addTask} className="w-full md:w-fit flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Capture a new task..."
            value={newTaskText || ''}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="w-full md:w-80 px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="p-3.5 bg-[#0f4c75] text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </form>
      </div>

      {/* 2. THE 2x2 MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {QUADRANTS.map((q) => (
          <div 
            key={q.id}
            onDrop={(e) => onDrop(e, q.id)}
            onDragOver={onDragOver}
            className={`flex flex-col min-h-[400px] rounded-[2.5rem] border-2 border-dashed ${q.border} ${q.bg} p-6 transition-colors duration-300`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-white shadow-sm font-black ${q.color}`}>
                  {q.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-widest ${q.color}`}>{q.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{q.subtitle}</p>
                </div>
              </div>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-100 text-[10px] font-black text-slate-400">
                {tasks.filter(t => t.quadrant === q.id).length} ITEMS
              </span>
            </div>

            <div className="flex-1 space-y-3">
              <AnimatePresence initial={false}>
                {tasks.filter(t => t.quadrant === q.id).length === 0 ? (
                  <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200/50 rounded-3xl opacity-50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Drop tasks here</p>
                  </div>
                ) : (
                  tasks.filter(t => t.quadrant === q.id).map((task) => (
                    <motion.div
                      key={task.id}
                      layoutId={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={(e) => onDragStart(e, task.id)}
                      className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all flex items-start gap-3"
                    >
                      <div className="flex flex-col gap-1 items-center pt-1 text-slate-300 group-hover:text-slate-400 transition-colors">
                        <GripVertical size={14} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 leading-relaxed mb-3">{task.text}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {q.id === 'q1' && (
                              <button 
                                onClick={() => {
                                  window.location.href = `/tools/billable-hours-tracker?task=${encodeURIComponent(task.text)}`;
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors border border-emerald-100"
                              >
                                <Play size={10} fill="currentColor" /> Start Timer
                              </button>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Instructions */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 border border-white/5 shadow-inner">
             <Clock size={28} />
           </div>
           <div>
             <h4 className="text-white text-lg font-black uppercase tracking-tight leading-tight mb-1">Execution Mode</h4>
             <p className="text-slate-400 text-xs font-medium">Focus on Q1. Avoid Q4. Delegate Q3. Schedule Q2.</p>
           </div>
        </div>
        
        <button 
          onClick={() => {
            const q1Tasks = tasks.filter(t => t.quadrant === 'q1');
            if (q1Tasks.length > 0) {
               window.location.href = `/tools/billable-hours-tracker?task=${encodeURIComponent(q1Tasks[0].text)}`;
            } else {
               window.location.href = `/tools/billable-hours-tracker`;
            }
          }}
          className="px-8 py-5 bg-[#0f4c75] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#07314d] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
        >
          Open Focus Timer <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
