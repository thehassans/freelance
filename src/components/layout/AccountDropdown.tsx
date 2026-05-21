import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { 
  LogOut, 
  Crown, 
  Settings, 
  Zap, 
  ShieldAlert, 
  FileText, 
  Terminal,
  ChevronRight
} from 'lucide-react';

export default function AccountDropdown({ onClose }: { onClose: () => void }) {
  const { user, isPro, aiUsageCount, logout, toggleProMode, showProModal } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  const aiLimit = 5;
  const aiPercentage = Math.min((aiUsageCount / aiLimit) * 100, 100);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100]"
    >
      {/* Header */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <Terminal size={24} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate">{user.name || 'Professional'}</p>
            <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-widest">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Plan Status */}
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Plan</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              isPro ? 'bg-indigo-50 text-[#0f4c75] border border-indigo-100' : 'bg-slate-100 text-slate-600'
            }`}>
              {isPro ? 'Pro Member' : 'Free Tier'}
            </span>
          </div>

          {!isPro && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
                    <Zap size={10} className="text-amber-500" /> AI Credits
                  </span>
                  <span className="text-[10px] font-black text-slate-900">{aiUsageCount} / {aiLimit} Used</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-[#0f4c75] transition-all duration-500" 
                    style={{ width: `${aiPercentage}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-[9px] text-slate-400 font-medium">
                  <ShieldAlert size={10} className="text-rose-400" />
                  PDF Exports: Includes Watermark
                </div>
              </div>

              <button 
                onClick={() => {
                  showProModal('Full Agency Suite');
                  onClose();
                }}
                className="w-full py-4 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0b395a] transition-all shadow-lg shadow-[#0f4c75]/20 flex items-center justify-center gap-2"
              >
                <Crown size={12} className="text-amber-400 fill-amber-400" />
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          <button 
            onClick={() => handleNav('/billing')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3 text-slate-600 group-hover:text-slate-900">
              <FileText size={18} />
              <span className="text-xs font-bold">Billing & Invoices</span>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400" />
          </button>
          <button 
            onClick={() => handleNav('/settings')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3 text-slate-600 group-hover:text-slate-900">
              <Settings size={18} />
              <span className="text-xs font-bold">Account Settings</span>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Footer / Dev Toggle */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2">
        <button 
          onClick={() => {
            toggleProMode();
            onClose();
          }}
          className="w-full py-2 px-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-white transition-all flex items-center justify-center gap-2 border border-transparent hover:border-slate-200"
        >
          <Terminal size={12} />
          Developer: Toggle Plan Status
        </button>
        
        <button 
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </motion.div>
  );
}
