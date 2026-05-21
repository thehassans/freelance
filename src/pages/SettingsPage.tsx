import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Globe, 
  Bell, 
  ShieldAlert, 
  Save,
  Trash2,
  Loader2
} from 'lucide-react';
import DeleteAccountModal from '../components/modals/DeleteAccountModal';

export default function SettingsPage() {
  const { user, currency, updateCurrency, updateProfile } = useUser();
  const [localNotifications, setLocalNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: currency || 'USD'
  });

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
        <User size={32} />
      </div>
      <h3 className="text-lg font-black text-slate-900 mb-2">Login Required</h3>
      <p className="text-sm text-slate-500 font-medium max-w-xs">Please login to manage your account settings and preferences.</p>
    </div>
  );

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // Apply profile changes
      updateProfile({
        name: formData.name
      }).then(() => {
        setIsSaving(false);
        toast.success('Settings saved successfully');
      }).catch(() => {
        setIsSaving(false);
        toast.error('Failed to save settings');
      });
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
      />

      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium italic">Manage your profile and workspace preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Details */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0f4c75]">
              <User size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Profile Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0f4c75] transition-all"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  readOnly 
                  value={formData.email} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-300 cursor-not-allowed focus:outline-none"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
              <p className="text-[9px] text-slate-400 font-medium ml-1">Email cannot be changed for security reasons.</p>
            </div>
          </div>
        </section>

        {/* Workspace Preferences */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0f4c75]">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Workspace</h2>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                  <span className="font-black text-lg">$</span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Default Currency</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">For all financial calculators</p>
                </div>
              </div>
              <select 
                value={currency}
                onChange={(e) => updateCurrency(e.target.value)}
                className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0f4c75] cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="SAR">SAR (﷼)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Email Notifications</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">New feature updates & reports</p>
                </div>
              </div>
              <button 
                onClick={() => setLocalNotifications(!localNotifications)}
                className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${localNotifications ? 'bg-[#0f4c75]' : 'bg-slate-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${localNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-rose-50/30 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-rose-100/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <ShieldAlert size={20} />
            </div>
            <h2 className="text-xl font-black text-rose-900 uppercase tracking-tight">Danger Zone</h2>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-black text-rose-900">Delete Account</p>
              <p className="text-[10px] font-medium text-rose-400 uppercase tracking-widest leading-relaxed max-w-sm">
                Once you delete your account, there is no going back. All your saved documents and history will be permanently erased.
              </p>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-rose-500/20"
            >
              <Trash2 size={16} /> Delete My Account
            </button>
          </div>
        </section>
      </div>

      <div className="mt-12 flex justify-end pb-24">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 active:scale-95 min-w-[200px] justify-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
