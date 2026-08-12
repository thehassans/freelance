import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';
import { DEFAULT_USERS } from '../../../lib/adminSeedData';
import { MoreVertical } from 'lucide-react';

export default function UsersView({ showToast }: { showToast: (msg: string) => void }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    setUsers(storage.get('fk_users') || DEFAULT_USERS);
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">All Users</h1>
      </div>

      <div className="bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">USER</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">PLAN</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">JOINED</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">AI CREDITS</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">TOOL USES</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">STATUS</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-slate-200 hover:bg-[#252E4A]/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#252E4A] flex items-center justify-center text-slate-900 text-xs font-bold">
                      {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <div className="text-slate-900 text-sm font-bold">{user.name}</div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-900 text-sm capitalize">{user.tier}</td>
                <td className="p-4 text-slate-500 text-sm">{new Date(user.joinedAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#252E4A] rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, (user.aiCreditsUsed / user.aiCreditsLimit) * 100)}%` }} />
                    </div>
                    <span className="text-slate-500 text-xs font-mono">{user.aiCreditsUsed}/{user.aiCreditsLimit}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-500 text-sm font-mono">{user.toolLaunches}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded tracking-widest ${user.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                    {user.status === 'active' ? '● Active' : '○ Suspended'}
                  </span>
                </td>
                <td className="p-4">
                  <button className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
