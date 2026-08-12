import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';
import { DEFAULT_SUBSCRIPTIONS } from '../../../lib/adminSeedData';
import { CreditCard, ExternalLink, ShieldCheck, Mail, ArrowUpRight, Award, Trash2, Plus } from 'lucide-react';

export default function SubscriptionsView({ showToast }: { showToast: (msg: string) => void }) {
  const [subs, setSubs] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSub, setNewSub] = useState({
    userName: '',
    email: '',
    plan: 'Pro Monthly',
    amount: 9,
    status: 'active',
  });

  useEffect(() => {
    // If not found in localStorage, fetch and save default subscription seed data
    const stored = storage.get('fk_subscriptions');
    if (!stored) {
      storage.set('fk_subscriptions', DEFAULT_SUBSCRIPTIONS);
      setSubs(DEFAULT_SUBSCRIPTIONS);
    } else {
      setSubs(stored);
    }
  }, []);

  const saveSubs = (updated: any[]) => {
    storage.set('fk_subscriptions', updated);
    setSubs(updated);
  };

  const calcMRR = () => {
    let total = 0;
    subs.filter(s => s.status === 'active' && s.plan !== 'Lifetime').forEach(s => {
      const amt = Number(s.amount) || 0;
      if (s.plan.includes('Monthly')) total += amt;
      if (s.plan.includes('Annual')) total += (amt / 12);
    });
    return Math.round(total);
  };

  const activeCount = subs.filter(s => s.status === 'active').length;
  const canceledCount = subs.filter(s => s.status === 'cancelled' || s.status === 'canceled').length;
  const totalCount = activeCount + canceledCount;
  const churnRatePct = totalCount > 0 ? ((canceledCount / totalCount) * 100).toFixed(1) : '0.0';
  const mrr = calcMRR();

  const getPlanTier = (planName: string, amount: number) => {
    if (!planName) return 'FREE';
    const name = planName.toLowerCase();
    if (name.includes('lifetime') || amount >= 199) return 'AGENCY ELITE';
    if (name.includes('pro') || amount > 0) return 'FREEMIUM PRO';
    return 'FREE';
  };

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.userName || !newSub.email) {
      showToast('Please fulfill all required attributes');
      return;
    }
    const created: any = {
      id: 'sub_' + Date.now(),
      userId: 'user_' + Math.floor(Math.random() * 1000),
      userName: newSub.userName,
      email: newSub.email,
      plan: newSub.plan,
      amount: Number(newSub.amount),
      currency: 'USD',
      status: newSub.status,
      startDate: new Date().toISOString().split('T')[0],
      nextBilling: newSub.status === 'active' && newSub.plan !== 'Lifetime' ? 
        new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0] : null,
      cancelAtEnd: newSub.status === 'canceled'
    };
    const updated = [...subs, created];
    saveSubs(updated);
    setShowAddModal(false);
    setNewSub({ userName: '', email: '', plan: 'Pro Monthly', amount: 9, status: 'active' });
    showToast(`Subscription added successfully for ${created.userName}!`);
  };

  const handleDeleteSub = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete subscription for ${name}?`)) {
      const updated = subs.filter(s => s.id !== id);
      saveSubs(updated);
      showToast(`Subscription for ${name} has been deleted.`);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = subs.map(s => {
      if (s.id === id) {
        let nextStatus = 'active';
        if (s.status === 'active') nextStatus = 'past_due';
        else if (s.status === 'past_due') nextStatus = 'canceled';
        return {
          ...s,
          status: nextStatus,
          nextBilling: nextStatus === 'active' ? new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0] : null
        };
      }
      return s;
    });
    saveSubs(updated);
    showToast(`Status toggled for chosen subscriber.`);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-center bg-white border border-slate-200/60 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Subscriptions Panel</h1>
          <p className="text-xs text-slate-500">Manage user payment profiles, plan tiers, and Stripe customer linking.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add Subscriber
        </button>
      </div>

      {/* Metrics Row (Total MRR, Active Subscribers, Churn Rate %) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-md">
          <span className="absolute -right-3 -bottom-3 text-indigo-500/10"><CreditCard size={100} /></span>
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-extrabold">Total Monthly Recurring Revenue (MRR)</div>
          <div className="text-4xl font-black text-white mt-3 tracking-tight">${mrr.toLocaleString()}</div>
          <div className="text-xs text-primary mt-1.5 flex items-center gap-1 font-semibold">
            <ShieldCheck size={14} />
            Live recurring revenue run-rate
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-md">
          <span className="absolute -right-3 -bottom-3 text-emerald-500/10"><Award size={100} /></span>
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-extrabold">Active Subscribers</div>
          <div className="text-4xl font-black text-white mt-3 tracking-tight">{activeCount}</div>
          <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 font-semibold">
            Premium seats online
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl relative overflow-hidden shadow-md">
          <span className="absolute -right-3 -bottom-3 text-rose-500/10"><ArrowUpRight size={100} className="rotate-45" /></span>
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-extrabold">Churn Rate %</div>
          <div className="text-4xl font-black text-white mt-3 tracking-tight">{churnRatePct}%</div>
          <div className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-semibold">
            Monthly cancellations ratio
          </div>
        </div>
      </div>

      {/* Main Administrative Table */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white/80 font-bold">
                <th className="p-4 border-b border-slate-200 text-slate-500 text-[10px] font-mono tracking-wider">USER DETAILS</th>
                <th className="p-4 border-b border-slate-200 text-slate-500 text-[10px] font-mono tracking-wider">PLAN DETAILS</th>
                <th className="p-4 border-b border-slate-200 text-slate-500 text-[10px] font-mono tracking-wider">STATUS BADGE</th>
                <th className="p-4 border-b border-slate-200 text-slate-500 text-[10px] font-mono tracking-wider">NEXT BILLING</th>
                <th className="p-4 border-b border-slate-200 text-slate-500 text-[10px] font-mono tracking-wider text-right">STRIPE CUSTOMER LINK & ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {subs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    No subscribers found. Click "Add Subscriber" to populate profiles.
                  </td>
                </tr>
              ) : (
                subs.map(sub => {
                  const tier = getPlanTier(sub.plan, sub.amount);
                  return (
                    <tr key={sub.id} className="border-b border-slate-200 hover:bg-[#252E4A]/30 transition-all">
                      <td className="p-4">
                        <div className="text-white text-sm font-bold flex items-center gap-1.5">
                          {sub.userName}
                        </div>
                        <div className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="opacity-60" />
                          {sub.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                            tier === 'AGENCY ELITE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            tier === 'FREEMIUM PRO' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                            'bg-slate-400/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {tier}
                          </span>
                          <span className="text-xs text-slate-500 font-mono mt-0.5">
                            {sub.plan} (${sub.amount}/{sub.plan.includes('Annual') ? 'yr' : sub.plan.includes('Monthly') ? 'mo' : 'one-time'})
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span 
                          onClick={() => handleToggleStatus(sub.id)}
                          title="Click to toggle status cycle"
                          className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border tracking-widest cursor-pointer select-none transition-all active:scale-95 ${
                            sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            sub.status === 'past_due' || sub.status === 'past-due' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          ● {sub.status === 'active' ? 'Active' : sub.status === 'past_due' || sub.status === 'past-due' ? 'Past Due' : 'Canceled'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs font-mono">
                        {sub.nextBilling ? new Date(sub.nextBilling).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <a 
                            href={`https://dashboard.stripe.com/customers/${sub.customerId || 'cus_Fk_' + sub.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/20 hover:border-indigo-500/40 px-2.5 py-1.5 rounded-lg bg-indigo-500/5 cursor-pointer shadow-sm"
                          >
                            <CreditCard size={13} />
                            Stripe Portal
                            <ExternalLink size={11} className="opacity-70" />
                          </a>

                          <button 
                            onClick={() => handleDeleteSub(sub.id, sub.userName)}
                            title="Delete Subscriber profile"
                            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-all cursor-pointer border border-slate-200 hover:border-rose-500/20"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-100 border border-slate-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 relative">
            <h3 className="text-lg font-black text-white mb-4">Add Subscriber Profile</h3>
            <form onSubmit={handleCreateSub} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-bold">User Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rachel Adams"
                  value={newSub.userName}
                  onChange={e => setNewSub({...newSub, userName: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-bold">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. rachel@domain.com"
                  value={newSub.email}
                  onChange={e => setNewSub({...newSub, email: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold">Plan Type</label>
                  <select 
                    value={newSub.plan}
                    onChange={e => {
                      const amount = e.target.value === 'Lifetime' ? 199 : e.target.value.includes('Annual') ? 79 : 9;
                      setNewSub({...newSub, plan: e.target.value, amount});
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-white text-sm outline-none"
                  >
                    <option value="Pro Monthly">Pro Monthly</option>
                    <option value="Pro Annual">Pro Annual</option>
                    <option value="Lifetime">Lifetime Elite</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold">Billing Amount ($)</label>
                  <input 
                    type="number"
                    required
                    value={newSub.amount}
                    onChange={e => setNewSub({...newSub, amount: parseInt(e.target.value) || 0})}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-white text-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-bold">Status</label>
                <select 
                  value={newSub.status}
                  onChange={e => setNewSub({...newSub, status: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-white text-sm outline-none"
                >
                  <option value="active">Active</option>
                  <option value="past_due">Past Due</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-transparent hover:bg-white/5 border border-slate-200 text-slate-500 hover:text-white font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
                >
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
