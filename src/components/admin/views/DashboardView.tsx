import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';

export default function DashboardView() {
  const [tools, setTools] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    setTools(storage.get('fk_tools') || []);
    setEvents(storage.get('fk_events') || []);
    setUsers(storage.get('fk_users') || []);
    setFlags(storage.get('fk_flags') || {});
    setBlogs(storage.get('fk_blogs') || []);
  }, []);

  const stats = {
    totalTools: tools.length,
    publishedTools: tools.filter(t => t.status === 'published').length,
    aiTools: tools.filter(t => t.isAI).length,
    launches30d: events.filter(e => {
      const d = new Date(e.timestamp);
      return (Date.now() - d.getTime()) < 30 * 24 * 60 * 60 * 1000;
    }).length,
    totalUsers: users.length,
    proUsers: users.filter(u => u.tier === 'pro').length,
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter(b => b.status === 'published').length,
  };

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.timestamp?.startsWith(today));
  const topTools = Object.entries(
    todayEvents.reduce((acc: any, e: any) => {
      acc[e.toolName] = (acc[e.toolName] || 0) + 1;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);

  const toggleFlag = (key: string) => {
    const newFlags = { ...flags, [key]: !flags[key] };
    setFlags(newFlags);
    storage.set('fk_flags', newFlags);
  };

  // Group launches by day for past 14 days
  const last14Days = Array.from({length: 14}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });
  
  const chartData = last14Days.map(date => ({
    date,
    count: events.filter(e => e.type === 'tool_launch' && e.timestamp?.startsWith(date)).length
  }));

  const maxChart = Math.max(...chartData.map(d => d.count), 1);
  const W = 600, H = 120, barW = W / chartData.length - 4;

  const recentActivity = [...events, ...(storage.get('fk_ai_usage') || [])]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tools', value: stats.totalTools, sub: `${stats.publishedTools} published` },
          { label: 'Launches (30d)', value: stats.launches30d, sub: 'Total tool usage' },
          { label: 'Total Users', value: stats.totalUsers, sub: `${stats.proUsers} Pro accounts` },
          { label: 'Content Items', value: stats.totalBlogs, sub: `${stats.publishedBlogs} published` }
        ].map(stat => (
          <div key={stat.label} className="bg-slate-100 border border-slate-200 p-6 rounded-xl">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</div>
            <div className="text-4xl font-bold text-white mt-2 font-display">{stat.value}</div>
            <div className="text-xs text-primary mt-2">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Chart */}
          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl">
            <h2 className="text-sm font-bold text-slate-900 mb-6">Tool Launches (Last 14 Days)</h2>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
              {chartData.map((d, i) => {
                const barH = (d.count / maxChart) * 90;
                const x = i * (W / chartData.length) + 2;
                const y = H - barH - 20;
                return (
                  <g key={d.date}>
                    <rect x={x} y={y} width={barW} height={barH} fill={d.count > 0 ? '#6EE7B7' : '#252E4A'} rx="3" opacity="0.8"/>
                    <text x={x + barW/2} y={H - 4} textAnchor="middle" fill="#6B7280" fontSize="9">{d.date.slice(5)}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Top Tools Today</h2>
            <div className="space-y-4">
              {topTools.map((t: any, i) => (
                <div key={t[0]} className="flex justify-between text-sm">
                  <span className="text-slate-900">#{i + 1} · {t[0]}</span>
                  <span className="text-primary font-mono">{t[1]} launches</span>
                </div>
              ))}
              {topTools.length === 0 && <div className="text-sm text-slate-500">No launches today</div>}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Live Feature Flags</h2>
            <div className="space-y-3">
              {Object.entries(flags).slice(0, 8).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-xs text-slate-900 truncate w-2/3">{key}</span>
                  <button 
                    onClick={() => toggleFlag(key)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${value ? 'bg-primary' : 'bg-[#252E4A]'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${value ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 p-6 rounded-xl">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentActivity.map((r: any, i) => (
                <div key={i} className="text-xs flex gap-3">
                  <span className="text-slate-500 font-mono shrink-0 whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="text-slate-900 line-clamp-2">
                    {r.type === 'tool_launch' ? `🔧 ${r.toolName} launched` : 
                     r.type === 'ai_call' ? `🤖 ${r.toolName} AI (${r.tokens} tokens)` :
                     `📌 ${JSON.stringify(r)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
