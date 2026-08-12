import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';

const CATEGORIES = [
  'Finance & Billing', 'Sales & Proposals', 'Legal & Scoping', 
  'Marketing & Growth', 'SEO & Dev', 'Security & Compliance', 'Operations & PM'
];

interface ToolEditDrawerProps {
  tool: any;
  onSave: (t: any) => void;
  onClose: () => void;
}

function ToolEditDrawer({ tool, onSave, onClose }: ToolEditDrawerProps) {
  const [draft, setDraft] = useState(tool);
  const [tab, setTab] = useState('general');

  const handleSave = () => onSave(draft);

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-slate-100 border-l border-slate-200 shadow-2xl flex flex-col z-50">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
        <h2 className="text-lg font-bold text-slate-900">Edit Tool</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-900">✕</button>
      </div>

      <div className="flex px-6 pt-4 gap-6 border-b border-slate-200 text-sm">
        {['general', 'seo', 'pro'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`pb-3 border-b-2 font-medium capitalize ${tab === t ? 'border-[#6EE7B7] text-primary' : 'border-transparent text-slate-500'}`}>{t}</button>
        ))}
        {draft.isAI && <button onClick={() => setTab('ai')} className={`pb-3 border-b-2 font-medium capitalize ${tab === 'ai' ? 'border-[#818CF8] text-[#818CF8]' : 'border-transparent text-slate-500'}`}>AI Config</button>}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
        {tab === 'general' && (
          <>
            <div className="space-y-1"><label className="text-slate-500">Name</label><input value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
            <div className="space-y-1"><label className="text-slate-500">Slug</label><input value={draft.slug} onChange={e => setDraft({...draft, slug: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono text-xs" /></div>
            <div className="space-y-1"><label className="text-slate-500">Category</label>
              <select value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1"><label className="text-slate-500">Tier</label>
              <div className="flex gap-4">
                {['free', 'freemium', 'pro'].map(t => (
                  <label key={t} className="flex items-center gap-2 text-slate-700 capitalize"><input type="radio" checked={draft.tier === t} onChange={() => setDraft({...draft, tier: t})} /> {t}</label>
                ))}
              </div>
            </div>
            <div className="space-y-1"><label className="text-slate-500">Status</label>
              <div className="flex gap-4 flex-wrap">
                {['published', 'coming_soon', 'draft', 'disabled'].map(t => (
                  <label key={t} className="flex items-center gap-2 text-slate-700 capitalize select-none cursor-pointer">
                    <input type="radio" checked={draft.status === t} onChange={() => setDraft({...draft, status: t})} /> 
                    {t === 'coming_soon' ? 'Coming Soon' : t}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-slate-500">Sort Order</label><input type="number" value={draft.sortOrder || 0} onChange={e => setDraft({...draft, sortOrder: parseInt(e.target.value)})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
              <div className="space-y-1"><label className="text-slate-500">Icon Emoji</label><input maxLength={3} value={draft.icon} onChange={e => setDraft({...draft, icon: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
            </div>
            <div className="space-y-1"><label className="flex items-center gap-2 text-slate-700"><input type="checkbox" checked={draft.isAI} onChange={e => setDraft({...draft, isAI: e.target.checked})} /> Is AI Powered</label></div>
            <div className="space-y-1"><label className="text-slate-500">Description</label><textarea value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 h-20" /></div>
            <div className="space-y-1 pt-1">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                <input type="checkbox" checked={draft.trackNotifyClicks || false} onChange={e => setDraft({...draft, trackNotifyClicks: e.target.checked})} />
                Track 'Notify Me' Clicks
              </label>
            </div>
          </>
        )}
        {tab === 'seo' && (
          <>
            <div className="space-y-1"><label className="text-slate-500">Meta Title</label><input value={draft.metaTitle || ''} onChange={e => setDraft({...draft, metaTitle: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" /></div>
            <div className="space-y-1"><label className="text-slate-500">Meta Description</label><textarea value={draft.metaDesc || ''} onChange={e => setDraft({...draft, metaDesc: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 h-24" /></div>
          </>
        )}
        {tab === 'pro' && (
          <div className="space-y-4">
            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold block mb-1">Free Usage Limit</label>
              <input type="number" value={draft.freeLimit || ''} placeholder="Unlimited" onChange={e => setDraft({...draft, freeLimit: e.target.value ? parseInt(e.target.value) : null})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono" />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold block mb-1">Token/Credit Custom Cost</label>
              <input type="number" min={0} value={draft.creditCost !== undefined ? draft.creditCost : 1} placeholder="e.g., 5" onChange={e => setDraft({...draft, creditCost: e.target.value ? parseInt(e.target.value) : 0})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono" />
              <p className="text-[10px] text-slate-500 mt-0.5">Specify how many credits a single run of this tool costs a user.</p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold block mb-1">Daily Usage Rate Limit Capping</label>
              <input type="number" min={0} value={draft.dailyRateLimit !== undefined ? draft.dailyRateLimit : ''} placeholder="Unlimited" onChange={e => setDraft({...draft, dailyRateLimit: e.target.value ? parseInt(e.target.value) : null})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono" />
              <p className="text-[10px] text-slate-500 mt-0.5">Allow maximum total requests per day across the platform for this tool.</p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold block mb-1">Custom Backend API Endpoint Field</label>
              <input type="text" value={draft.apiEndpoint || ''} placeholder="e.g., /api/audit/wordpress" onChange={e => setDraft({...draft, apiEndpoint: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono text-[11px]" />
              <p className="text-[10px] text-slate-500 mt-0.5">Visually map your frontend tool to your target server route.</p>
            </div>
          </div>
        )}
        {tab === 'ai' && draft.isAI && (
          <>
            <div className="space-y-1"><label className="text-[#818CF8]">AI Model</label>
              <select value={draft.aiModel || 'claude-sonnet-4-20250514'} onChange={e => setDraft({...draft, aiModel: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900">
                <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (Recommended)</option>
                <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (Faster, cheaper)</option>
              </select>
            </div>
            <div className="space-y-1"><label className="text-[#818CF8]">System Prompt</label><textarea value={draft.aiPrompt || ''} onChange={e => setDraft({...draft, aiPrompt: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 h-64 font-mono text-xs" /></div>
              <div className="space-y-1"><label className="text-[#818CF8]">Max Tokens</label><input type="range" min={100} max={4000} step={100} value={draft.aiMaxTokens || 1000} onChange={e => setDraft({...draft, aiMaxTokens: parseInt(e.target.value)})} className="w-full" /><div className="text-xs text-slate-900 mt-1">{draft.aiMaxTokens || 1000}</div></div>
            </div>
            <div className="text-slate-500 text-xs">
              Est. cost per call: ${((draft.aiMaxTokens || 1000) * 0.000003).toFixed(4)}
            </div>
            <button onClick={() => alert('Test Ping: Connected to ' + (draft.aiModel || 'claude-sonnet-4-20250514'))} className="w-full py-2 bg-[#252E4A] text-[#818CF8] font-bold rounded hover:bg-[#252E4A]/80 transition-colors">▶ Test Prompt</button>
          </>
        )}
        
        {/* Pricing Strategy (Available for all tools) */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            Pricing Configuration
          </h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-slate-500 font-bold block mb-1">Pricing Model</label>
              <select 
                value={draft.aiCreditsPerUse > 0 ? 'credits' : 'free'} 
                onChange={e => setDraft({...draft, aiCreditsPerUse: e.target.value === 'free' ? 0 : 1})} 
                className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 text-sm"
              >
                <option value="free">Free for All Users</option>
                <option value="credits">Credit Based (Deducts credits per use)</option>
              </select>
            </div>
            
            {draft.aiCreditsPerUse > 0 && (
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block mb-1">Credits Per Use</label>
                <input 
                  type="number" 
                  min={1} 
                  max={100} 
                  value={draft.aiCreditsPerUse || 1} 
                  onChange={e => setDraft({...draft, aiCreditsPerUse: parseInt(e.target.value) || 1})} 
                  className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-4">
        <button onClick={onClose} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-900 transition-colors">Cancel</button>
        <button onClick={handleSave} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
      </div>
    </div>
  );
}

export default function ToolsView({ showToast }: { showToast: (msg: string, type?: string) => void }) {
  const [tools, setTools] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [editingTool, setEditingTool] = useState<any>(null);

  useEffect(() => {
    const data = storage.get('fk_tools') || [];
    setTools(data);
  }, []);

  const saveTool = (updated: any) => {
    const newTools = tools.some(t => t.id === updated.id) ? tools.map(t => t.id === updated.id ? updated : t) : [...tools, {...updated, id: 'tool_' + Date.now()}];
    setTools(newTools);
    storage.set('fk_tools', newTools);
    setEditingTool(null);
    showToast('Tool saved — changes live on site immediately', 'success');
  };

  const toggleStatus = (tool: any) => {
    const newStatus = tool.status === 'published' ? 'disabled' : 'published';
    saveTool({ ...tool, status: newStatus });
  };

  const filtered = tools.filter(t => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || t.category === catFilter;
    const matchTier = tierFilter === 'All' || t.tier === tierFilter;
    return matchSearch && matchCat && matchTier;
  }).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const EMPTY_TOOL = { id: '', name: '', slug: '', category: CATEGORIES[0], tier: 'free', status: 'draft', isAI: false, description: '' };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">All Tools</h1>
        <button onClick={() => setEditingTool(EMPTY_TOOL)} className="px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:opacity-90">+ Add Tool</button>
      </div>

      <div className="flex gap-4">
        <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm w-64" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm">
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm">
          <option>All</option>
          <option value="free">free</option>
          <option value="freemium">freemium</option>
          <option value="pro">pro</option>
        </select>
      </div>

      <div className="bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {['Icon', 'Name / Slug', 'Category', 'Tier', 'AI', 'Status', 'Launches', 'Actions'].map(h => (
                <th key={h} className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(tool => (
              <tr key={tool.id} className="border-b border-slate-200 hover:bg-white transition-colors">
                <td className="p-4 text-2xl">{tool.icon}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-900 text-sm">{tool.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">/tools/{tool.slug}</div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-[#252E4A] text-slate-900 text-[10px] rounded uppercase font-bold tracking-widest">{Array.isArray(tool.category) ? tool.category.join(', ') : tool.category}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold tracking-widest ${
                    tool.tier === 'pro' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 
                    tool.tier === 'freemium' ? 'bg-[#818CF8]/20 text-[#818CF8]' : 
                    'bg-primary/20 text-primary'
                  }`}>{tool.tier}</span>
                </td>
                <td className="p-4 text-center text-lg">{tool.isAI ? '🤖' : <span className="text-slate-500">—</span>}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold tracking-widest ${
                    tool.status === 'published' ? 'bg-primary/10 text-primary' : 
                    tool.status === 'coming_soon' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' : 
                    tool.status === 'disabled' ? 'bg-[#F87171]/10 text-[#F87171]' : 
                    'bg-slate-800 text-slate-400'
                  }`}>{tool.status?.replace('_', ' ')}</span>
                </td>
                <td className="p-4 font-mono text-xs text-primary">{tool.launchCount || 0}</td>
                <td className="p-4 flex flex-col gap-2">
                  <button onClick={() => setEditingTool(tool)} className="h-7 px-3 bg-[#252E4A] text-white text-xs font-medium rounded hover:bg-[#252E4A]/80 transition-colors">Edit</button>
                  <button onClick={() => toggleStatus(tool)} className={`h-7 px-3 text-xs font-medium rounded transition-colors ${
                    tool.status === 'published' ? 'bg-[#F87171]/10 text-[#F87171] hover:bg-[#F87171]/20' : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}>{tool.status === 'published' ? 'Disable' : 'Enable'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTool && <ToolEditDrawer tool={editingTool} onSave={saveTool} onClose={() => setEditingTool(null)} />}
    </div>
  );
}
