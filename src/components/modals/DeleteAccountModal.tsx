import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText !== 'DELETE') return;
    
    toast.error('Account deletion is disabled in this demo environment.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-rose-100 overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-8 md:p-10 text-center">
            <div className="w-20 h-20 rounded-[2.5rem] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-sm">
              <AlertTriangle size={40} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
              Are you absolutely sure?
            </h2>
            
            <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">
              This action is permanent and <span className="text-rose-600 font-bold underline">cannot be undone</span>. 
              All your generated PDFs, invoice history, and tool preferences will be permanently wiped from our secure servers.
            </p>

            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-start">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Type <span className="text-rose-600">DELETE</span> to confirm
              </label>
              <input 
                type="text"
                placeholder="DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 text-center font-black tracking-widest text-rose-600 placeholder:text-slate-200"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE'}
                className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-30 disabled:shadow-none"
              >
                <Trash2 size={16} /> Permanently Delete Account
              </button>
              <button 
                onClick={onClose}
                className="w-full py-5 bg-white text-slate-500 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Nevermind, Keep My Data
              </button>
            </div>
          </div>

          <div className="px-10 py-6 bg-rose-50/50 border-t border-rose-100 flex items-center justify-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Security Check: Level 3</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
