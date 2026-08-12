import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';
import { DEFAULT_FLAGS, DEFAULT_PLANS } from '../../../lib/adminSeedData';

export function FlagsView({ showToast }: { showToast: (msg: string) => void }) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState('');
  
  useEffect(() => {
    setFlags(storage.get('fk_flags') || DEFAULT_FLAGS);
  }, []);

  const toggle = (key: string) => {
    const val = { ...flags, [key]: !flags[key] };
    setFlags(val);
    storage.set('fk_flags', val);
    showToast('Flag updated — live immediately');
  };

  const add = () => {
    if (!newKey) return;
    const val = { ...flags, [newKey]: false };
    setFlags(val);
    storage.set('fk_flags', val);
    setNewKey('');
    showToast('Flag added');
  };

  const sections = {
    'AI Tools': Object.keys(flags).filter(k => k.startsWith('ai_')),
    'Site Features': ['maintenance_mode', 'announcement_bar', 'referral_program', 'pro_gate_strict', 'show_launch_counts', 'new_user_onboarding', 'blog_comments', 'newsletter_signup'],
    'Content Sections': ['resources_sops', 'resources_guides', 'resources_templates', 'resources_glossary', 'resources_blog'],
    'Monetization': ['annual_plan_discount', 'lifetime_plan_visible', 'coupon_codes_enabled']
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Feature Flags</h1>
      
      {Object.entries(sections).map(([sectionTitle, keys]) => {
        const sectionKeys = keys.filter(k => k in flags);
        if (sectionKeys.length === 0) return null;
        return (
          <div key={sectionTitle} className="bg-slate-100 border border-slate-200 rounded-xl overflow-hidden mb-6">
            <div className="p-4 bg-white border-b border-slate-200 text-sm font-bold text-slate-900 uppercase tracking-widest">{sectionTitle}</div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">FLAG NAME</th>
                  <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">STATUS</th>
                  <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {sectionKeys.map(key => (
                  <tr key={key} className="border-b border-slate-200">
                    <td className="p-4 text-slate-900 font-mono text-sm">{key}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded tracking-widest ${flags[key] ? 'bg-primary/10 text-primary' : 'bg-[#252E4A] text-slate-500'}`}>
                        {flags[key] ? '● ON' : '● OFF'}
                      </span>
                    </td>
                    <td className="p-4">
                       <button onClick={() => toggle(key)} className="px-4 py-1.5 bg-[#252E4A] text-white text-xs font-medium rounded hover:bg-[#252E4A]/80 transition-colors">Toggle</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      <div className="flex gap-4">
        <input placeholder="New flag key..." value={newKey} onChange={e => setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm" />
        <button onClick={add} className="px-4 py-2 bg-[#252E4A] text-white text-sm font-medium rounded-lg hover:bg-[#252E4A]/80">Add Flag</button>
      </div>
    </div>
  );
}

export function AnnouncementsView({ showToast }: { showToast: (msg: string) => void }) {
  const [data, setData] = useState<any>({
    enabled: true, emoji: '🚀', text: 'JUST LAUNCHED: THE NEW AGENCY CAPACITY PLANNER.',
    linkText: 'Explore the tool →', linkUrl: '/tools/capacity-planner',
    bgColor: '#1e3a5f', textColor: '#ffffff'
  });

  useEffect(() => {
    const stored = storage.get('fk_announcement');
    if (stored) setData(stored);
  }, []);

  const save = () => {
    storage.set('fk_announcement', data);
    showToast('Announcement saved — live immediately');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Announcement Bar</h1>
      
      {/* Live Preview */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Live Preview</h2>
      {data.enabled ? (
         <div style={{ backgroundColor: data.bgColor, color: data.textColor }} className="text-xs sm:text-sm py-3 px-4 text-center font-bold tracking-wide uppercase rounded-lg">
           {data.emoji} {data.text} <span className="underline opacity-90 cursor-pointer pl-1">{data.linkText}</span>
         </div>
      ) : (
        <div className="p-4 border border-slate-200 border-dashed rounded-lg text-slate-500 text-center text-sm">Bar is disabled</div>
      )}

      <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl space-y-4">
        <label className="flex items-center gap-2 text-slate-700"><input type="checkbox" checked={data.enabled} onChange={e => setData({...data, enabled: e.target.checked})} /> Show Announcement Bar on website</label>
        
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div className="col-span-1 space-y-1"><label className="text-slate-500 text-xs">Emoji</label><input value={data.emoji} onChange={e => setData({...data, emoji: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
          <div className="col-span-4 space-y-1"><label className="text-slate-500 text-xs">Message Text</label><input value={data.text} onChange={e => setData({...data, text: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-slate-500 text-xs">Link URL</label><input value={data.linkUrl} onChange={e => setData({...data, linkUrl: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
          <div className="space-y-1"><label className="text-slate-500 text-xs">Link Text</label><input value={data.linkText} onChange={e => setData({...data, linkText: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-slate-500 text-xs">Background Color</label><input type="color" value={data.bgColor} onChange={e => setData({...data, bgColor: e.target.value})} className="w-full h-10 bg-white border border-slate-200 rounded cursor-pointer" /></div>
          <div className="space-y-1"><label className="text-slate-500 text-xs">Text Color</label><input type="color" value={data.textColor} onChange={e => setData({...data, textColor: e.target.value})} className="w-full h-10 bg-white border border-slate-200 rounded cursor-pointer" /></div>
        </div>

        <button onClick={save} className="w-full mt-4 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity">Save Announcement</button>
      </div>
    </div>
  );
}

export function SeoOverridesView({ showToast }: { showToast: (msg: string) => void }) {
  const [tools, setTools] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string|null>(null);
  const [draft, setDraft] = useState<any>(null);

  useEffect(() => setTools(storage.get('fk_tools') || []), []);

  const startEdit = (t: any) => { setEditing(t.id); setDraft(t); };
  
  const save = () => {
    const fresh = tools.map((t: any) => t.id === draft.id ? draft : t);
    setTools(fresh);
    storage.set('fk_tools', fresh);
    setEditing(null);
    showToast('SEO settings saved');
  };

  const filtered = tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">SEO Overrides</h1>
      <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-900" />

      <div className="space-y-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white" onClick={() => editing === t.id ? setEditing(null) : startEdit(t)}>
              <div>
                <div className="font-bold text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">/tools/{t.slug} • {t.metaTitle || 'No title override'}</div>
              </div>
              <button className="text-primary text-sm">{editing === t.id ? 'Close' : 'Edit'}</button>
            </div>
            {editing === t.id && draft && (
              <div className="p-4 border-t border-slate-200 bg-white space-y-4">
                <div className="space-y-1"><label className="text-slate-500 text-xs">Meta Title</label><input value={draft.metaTitle || ''} onChange={e => setDraft({...draft, metaTitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900" /></div>
                <div className="space-y-1"><label className="text-slate-500 text-xs">Meta Description</label><textarea value={draft.metaDesc || ''} onChange={e => setDraft({...draft, metaDesc: e.target.value})} className="w-full h-20 bg-slate-50 border border-slate-200 rounded p-2 text-slate-900" /></div>
                <button onClick={save} className="px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:opacity-90">Save SEO Data</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanConfigView({ showToast }: { showToast: (msg: string) => void }) {
  const [plans, setPlans] = useState<any>(DEFAULT_PLANS);

  useEffect(() => {
    const p = storage.get('fk_plans');
    if (p) {
       // Merge to ensure we have lifetime plan if upgrading from older state
       setPlans({...DEFAULT_PLANS, ...p});
    }
  }, []);

  const save = () => {
    storage.set('fk_plans', plans);
    showToast('Plan limitations updated');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Plan Configuration</h1>
      <div className="grid grid-cols-2 gap-6">
        {['free', 'pro'].map(tier => (
          <div key={tier} className="bg-slate-100 border border-slate-200 p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 capitalize">{tier} Plan</h2>
            <div className="space-y-1"><label className="text-slate-500 text-xs">AI Credits (Monthly)</label><input type="number" value={plans[tier].aiCredits || ''} onChange={e => setPlans({...plans, [tier]: {...plans[tier], aiCredits: parseInt(e.target.value)}})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
            <div className="space-y-1"><label className="text-slate-500 text-xs">Invoice Limit</label><input type="number" value={plans[tier].invoiceLimit || ''} placeholder="Unlimited" onChange={e => setPlans({...plans, [tier]: {...plans[tier], invoiceLimit: parseInt(e.target.value) || null}})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
            {tier === 'pro' && (
              <div className="space-y-1"><label className="text-slate-500 text-xs">Monthly Price ($)</label><input type="number" value={plans[tier].priceMonthly || ''} onChange={e => setPlans({...plans, [tier]: {...plans[tier], priceMonthly: parseInt(e.target.value)}})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
            )}
          </div>
        ))}
      </div>
      <button onClick={save} className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90">Save Plan Limits</button>
    </div>
  );
}

// SettingsView moved to its own file
