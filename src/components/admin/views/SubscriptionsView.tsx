import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';
import { DEFAULT_SUBSCRIPTIONS } from '../../../lib/adminSeedData';
import { MoreVertical } from 'lucide-react';

export default function SubscriptionsView({ showToast }: { showToast: (msg: string) => void }) {
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    setSubs(storage.get('fk_subscriptions') || DEFAULT_SUBSCRIPTIONS);
  }, []);

  const calcMRR = () => {
    let total = 0;
    subs.filter(s => s.status === 'active' && s.plan !== 'Lifetime').forEach(s => {
      if (s.plan.includes('Monthly')) total += s.amount;
      if (s.plan.includes('Annual')) total += (s.amount / 12);
    });
    return Math.round(total);
  };

  const mrr = calcMRR();
  const arr = mrr * 12;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#E8EAF0]">Subscriptions</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-widest">MRR</div>
          <div className="text-3xl font-bold text-[#E8EAF0] mt-2">${mrr.toLocaleString()}</div>
          <div className="text-sm text-[#6EE7B7] mt-1">Monthly Recurring</div>
        </div>
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-widest">ARR</div>
          <div className="text-3xl font-bold text-[#E8EAF0] mt-2">${arr.toLocaleString()}</div>
          <div className="text-sm text-[#6EE7B7] mt-1">Annual Recurring</div>
        </div>
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-widest">Active Pro</div>
          <div className="text-3xl font-bold text-[#E8EAF0] mt-2">{subs.filter(s => s.status === 'active' && s.plan.includes('Pro')).length}</div>
          <div className="text-sm text-[#6B7280] mt-1">Subscribers</div>
        </div>
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-widest">Lifetime</div>
          <div className="text-3xl font-bold text-[#E8EAF0] mt-2">{subs.filter(s => s.plan === 'Lifetime').length}</div>
          <div className="text-sm text-[#6B7280] mt-1">Members</div>
        </div>
      </div>

      <div className="bg-[#1C2340] border border-[#252E4A] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">USER</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">PLAN</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">AMOUNT</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">STATUS</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">NEXT BILLING</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(sub => (
              <tr key={sub.id} className="border-b border-[#252E4A] hover:bg-[#252E4A]/30">
                <td className="p-4">
                  <div className="text-[#E8EAF0] text-sm font-bold">{sub.userName}</div>
                  <div className="text-[#6B7280] text-xs">{sub.email}</div>
                </td>
                <td className="p-4 text-[#E8EAF0] text-sm">{sub.plan}</td>
                <td className="p-4 text-[#6B7280] text-sm font-mono">${sub.amount}/{sub.plan.includes('Annual') ? 'yr' : sub.plan.includes('Monthly') ? 'mo' : 'one-time'}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded tracking-widest ${sub.status === 'active' ? 'bg-[#6EE7B7]/10 text-[#6EE7B7]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                    {sub.status === 'active' ? '● Active' : '✕ Cancelled'}
                  </span>
                </td>
                <td className="p-4 text-[#6B7280] text-sm">{sub.nextBilling ? new Date(sub.nextBilling).toLocaleDateString() : '—'}</td>
                <td className="p-4">
                  <button className="text-xs font-bold text-[#6B7280] hover:text-[#E8EAF0] transition-colors border border-[#252E4A] px-3 py-1.5 rounded bg-[#13192B]">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
