import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';
import { DEFAULT_USERS } from '../../../lib/adminSeedData';
import { MoreVertical } from 'lucide-react';

export default function UsersView({ showToast }: { showToast: (msg: string) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [editUserModal, setEditUserModal] = useState<any | null>(null);

  useEffect(() => {
    setUsers(storage.get('fk_users') || DEFAULT_USERS);
  }, []);

  const saveUsers = (newUsers: any[]) => {
    setUsers(newUsers);
    storage.set('fk_users', newUsers);
  };

  const toggleStatus = (userId: string) => {
    const updated = users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    );
    saveUsers(updated);
    showToast('User status updated');
    setActionMenuOpen(null);
  };

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter(u => u.id !== userId);
      saveUsers(updated);
      showToast('User deleted');
      setActionMenuOpen(null);
    }
  };

  const saveEdit = () => {
    if (editUserModal) {
      const updated = users.map(u => u.id === editUserModal.id ? editUserModal : u);
      saveUsers(updated);
      showToast('User updated successfully');
      setEditUserModal(null);
    }
  };

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
                <td className="p-4 relative">
                  <button 
                    onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {actionMenuOpen === user.id && (
                    <div className="absolute right-8 top-10 w-48 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50 py-1">
                      <button onClick={() => { setEditUserModal(user); setActionMenuOpen(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Edit User</button>
                      <button onClick={() => toggleStatus(user.id)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100">Delete User</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editUserModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[99999] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Edit User Profile</h2>
              <button onClick={() => setEditUserModal(null)} className="text-slate-500 hover:text-slate-900">✕</button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-slate-500 text-xs font-bold block mb-1">Name</label>
                <input value={editUserModal.name} onChange={e => setEditUserModal({...editUserModal, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 text-xs font-bold block mb-1">Email</label>
                <input value={editUserModal.email} onChange={e => setEditUserModal({...editUserModal, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 text-xs font-bold block mb-1">Plan Tier</label>
                <select value={editUserModal.tier} onChange={e => setEditUserModal({...editUserModal, tier: e.target.value})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900">
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Lifetime">Lifetime</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 text-xs font-bold block mb-1">AI Credits Used</label>
                  <input type="number" value={editUserModal.aiCreditsUsed} onChange={e => setEditUserModal({...editUserModal, aiCreditsUsed: parseInt(e.target.value) || 0})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 text-xs font-bold block mb-1">AI Credit Limit</label>
                  <input type="number" value={editUserModal.aiCreditsLimit} onChange={e => setEditUserModal({...editUserModal, aiCreditsLimit: parseInt(e.target.value) || 0})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 text-xs font-bold block mb-1">Tool Uses Total</label>
                <input type="number" value={editUserModal.toolLaunches} onChange={e => setEditUserModal({...editUserModal, toolLaunches: parseInt(e.target.value) || 0})} className="w-full bg-white border border-slate-200 rounded p-2 text-slate-900 font-mono" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setEditUserModal(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded transition-colors">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-primary text-white font-bold rounded hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
