import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';

export default function SettingsView({ showToast }: { showToast: (msg: string) => void }) {
  const [pin, setPin] = useState('2611');
  const [announcement, setAnnouncement] = useState(() => storage.get('fk_announcement') || {
    enabled: true, emoji: '🚀', text: 'JUST LAUNCHED: THE NEW AGENCY CAPACITY PLANNER.', linkText: 'Explore the tool →', linkUrl: '/tools/capacity-planner', bgColor: '#1e3a5f', textColor: '#ffffff'
  });
  
  const [mailgun, setMailgun] = useState(() => storage.get('fk_mailgun_config') || {
    domain: '', apiKey: '', senderEmail: ''
  });

  useEffect(() => {
    setPin(storage.get('fk_admin_pin') || '2611');
  }, []);

  const savePin = () => {
    storage.set('fk_admin_pin', pin);
    showToast('PIN changed successfully');
  };

  const saveAnnouncement = () => {
    storage.set('fk_announcement', announcement);
    showToast('Announcement saved');
  };

  const saveMailgun = () => {
    storage.set('fk_mailgun_config', mailgun);
    showToast('Mailgun config saved');
  };

  const sendTestEmail = async () => {
    if (!mailgun.domain || !mailgun.apiKey || !mailgun.senderEmail) {
      showToast('Please fill out all Mailgun settings first');
      return;
    }
    showToast('Sending test email...');
    try {
      const { sendAdminEmail } = await import('../../../lib/email');
      const result = await sendAdminEmail('test@example.com', 'Test Email from FreelancerKit Admin', 'This is a test email to verify your Mailgun SMTP settings are working correctly.');
      if (result.success) {
        showToast('Test email sent successfully!');
      } else {
        showToast('Failed to send: ' + (result.error || 'Unknown error'));
      }
    } catch (e: any) {
      showToast('Error: ' + e.message);
    }
  };

  const clearAnalytics = () => {
    if (confirm('Are you sure you want to clear all analytics data?')) {
      storage.set('fk_events', []);
      showToast('Analytics cleared');
    }
  };

  const resetLaunches = () => {
    if (confirm('Are you sure you want to reset all tool launch counts?')) {
      const tools = storage.get('fk_tools') || [];
      const updated = tools.map((t: any) => ({ ...t, launchCount: 0 }));
      storage.set('fk_tools', updated);
      showToast('Launch counts reset');
    }
  };

  const factoryReset = () => {
    const check = prompt('Type RESET to confirm complete factory reset:');
    if (check === 'RESET') {
      localStorage.clear();
      showToast('Factory reset. Reloading...');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const exportData = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelancerkit-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Exported backup');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const obj = JSON.parse(e.target?.result as string);
        for(const k in obj) localStorage.setItem(k, obj[k]);
        showToast('Data imported successfully. Reloading...');
        setTimeout(() => window.location.reload(), 1000);
      } catch(err) {
        showToast('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Admin Security */}
          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Admin Security</h2>
            <div className="flex gap-4 items-end">
              <div className="space-y-1 flex-1">
                <label className="text-slate-500 text-xs">Admin PIN</label>
                <div className="relative">
                   <input value={pin} onChange={e => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} type="password" placeholder="4 digits" className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 placeholder-[#6B7280]" />
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">••••</div>
                </div>
              </div>
              <button onClick={savePin} className="px-4 py-2 bg-[#252E4A] text-white text-sm font-medium rounded hover:bg-[#252E4A]/80 transition-colors">Change PIN</button>
            </div>
            <div className="space-y-1">
               <label className="text-slate-500 text-xs">Session timeout</label>
               <select className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900">
                 <option>24 Hours</option>
                 <option>8 Hours</option>
                 <option>4 Hours</option>
                 <option>Never</option>
               </select>
            </div>
          </div>

          {/* Platform Identity */}
          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Platform Identity</h2>
            <div className="space-y-3">
              <div className="space-y-1"><label className="text-slate-500 text-xs">Site name</label><input defaultValue="FreelancerKit" className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
              <div className="space-y-1"><label className="text-slate-500 text-xs">Tagline</label><input defaultValue="The Command Center for Freelancers" className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
              <div className="space-y-1"><label className="text-slate-500 text-xs">Support email</label><input defaultValue="hello@freelancerkit.io" className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
              <div className="space-y-1"><label className="text-slate-500 text-xs">Site URL</label><input defaultValue="https://freelancerkit.io" className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
            </div>
            <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded mt-2">Save Identity</button>
          </div>

          {/* API Keys */}
          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">API Keys</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-slate-500 text-xs">Anthropic API Key</label>
                  <button className="text-xs text-primary">Test Connection</button>
                </div>
                <div className="flex gap-2">
                  <input type="password" value="sk-ant-••••••••••••••••" readOnly className="flex-1 bg-white border border-slate-200 rounded p-2 text-slate-900" />
                  <button className="px-3 bg-[#252E4A] rounded text-slate-900 text-xs">Reveal</button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 text-xs">Stripe Publishable Key</label>
                <input type="password" value="pk_live_••••••" readOnly className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 text-xs">Monthly AI Budget Cap ($)</label>
                <input type="number" defaultValue={50} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Mailgun SMTP Settings */}
          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Mailgun SMTP Configuration</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-500 text-xs">Mailgun Domain</label>
                <input type="text" value={mailgun.domain} onChange={e => setMailgun({...mailgun, domain: e.target.value})} placeholder="e.g., mg.yourdomain.com" className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 text-xs">Mailgun Private API Key</label>
                <input type="password" value={mailgun.apiKey} onChange={e => setMailgun({...mailgun, apiKey: e.target.value})} placeholder="key-..." className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 text-xs">Default Sender Email</label>
                <input type="email" value={mailgun.senderEmail} onChange={e => setMailgun({...mailgun, senderEmail: e.target.value})} placeholder="noreply@yourdomain.com" className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={saveMailgun} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded">Save Config</button>
              <button onClick={sendTestEmail} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded hover:bg-slate-50">Send Test Email</button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Announcement Bar */}
          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Announcement Bar</h2>
              <button 
                onClick={() => setAnnouncement({...announcement, enabled: !announcement.enabled})} 
                className={`text-xs font-bold px-2 py-1 rounded tracking-widest ${announcement.enabled ? 'bg-primary/10 text-primary' : 'bg-[#252E4A] text-slate-500'}`}
              >
                {announcement.enabled ? '● ON' : '○ OFF'}
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="space-y-1 w-20"><label className="text-slate-500 text-xs">Emoji</label><input value={announcement.emoji} onChange={e => setAnnouncement({...announcement, emoji: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 text-center" /></div>
                <div className="space-y-1 flex-1"><label className="text-slate-500 text-xs">Message</label><input value={announcement.text} onChange={e => setAnnouncement({...announcement, text: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
              </div>
              <div className="flex gap-3">
                 <div className="space-y-1 flex-1"><label className="text-slate-500 text-xs">Link Text</label><input value={announcement.linkText} onChange={e => setAnnouncement({...announcement, linkText: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
                 <div className="space-y-1 flex-1"><label className="text-slate-500 text-xs">Link URL</label><input value={announcement.linkUrl} onChange={e => setAnnouncement({...announcement, linkUrl: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
              </div>
              <div className="flex gap-3">
                 <div className="space-y-1 flex-1"><label className="text-slate-500 text-xs">Bg Color</label><input value={announcement.bgColor} onChange={e => setAnnouncement({...announcement, bgColor: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono" /></div>
                 <div className="space-y-1 flex-1"><label className="text-slate-500 text-xs">Text Color</label><input value={announcement.textColor} onChange={e => setAnnouncement({...announcement, textColor: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono" /></div>
              </div>
            </div>

            <div className="pt-2">
               <label className="text-slate-500 text-xs mb-2 block">Live Preview:</label>
               <div style={{ backgroundColor: announcement.bgColor, color: announcement.textColor }} className="text-[10px] sm:text-xs py-2 text-center font-bold tracking-wide uppercase rounded">
                 {announcement.emoji} {announcement.text} <span className="underline opacity-90 ml-1">{announcement.linkText}</span>
               </div>
            </div>

            <button onClick={saveAnnouncement} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded mt-2">Save Banner</button>
          </div>

          {/* Data Management */}
          <div className="bg-[#2A0F0F] border border-[#F87171]/20 p-6 rounded-xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#F87171]/20 pb-4">
               <div>
                  <h2 className="text-sm font-bold text-[#F87171] uppercase tracking-widest">Data Management</h2>
                  <p className="text-xs text-[#F87171]/80 mt-1">Export/Import full system state</p>
               </div>
               <div className="flex gap-2">
                 <label className="px-3 py-1.5 bg-slate-100 border border-[#F87171]/20 text-[#F87171] text-xs font-bold rounded hover:bg-[#F87171]/10 cursor-pointer">
                   Import JSON
                   <input type="file" accept=".json" onChange={importData} className="hidden" />
                 </label>
                 <button onClick={exportData} className="px-3 py-1.5 bg-slate-100 border border-[#F87171]/20 text-[#F87171] text-xs font-bold rounded hover:bg-[#F87171]/10">Export JSON</button>
               </div>
            </div>

            <div className="space-y-3">
              <button onClick={resetLaunches} className="w-full flex justify-between items-center px-4 py-3 bg-slate-100 border border-[#F87171]/20 rounded hover:bg-[#F87171]/10 transition-colors">
                <span className="text-slate-900 text-sm">Reset Tool Launch Counts</span>
                <span className="text-[#F87171] text-xs font-mono">Zero</span>
              </button>
              <button onClick={clearAnalytics} className="w-full flex justify-between items-center px-4 py-3 bg-slate-100 border border-[#F87171]/20 rounded hover:bg-[#F87171]/10 transition-colors">
                <span className="text-slate-900 text-sm">Clear Analytics Events</span>
                <span className="text-[#F87171] text-xs font-mono">fk_events</span>
              </button>
              <button onClick={factoryReset} className="w-full flex justify-center items-center px-4 py-3 bg-[#F87171] text-[#2A0F0F] font-bold rounded hover:opacity-90 transition-opacity mt-4">
                FACTORY RESET SYSTEM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
