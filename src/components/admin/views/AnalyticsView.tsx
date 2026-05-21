import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';
import { DEFAULT_AI_USAGE } from '../../../lib/adminSeedData';

export default function AnalyticsView() {
  const [events, setEvents] = useState<any[]>([]);
  const [aiUsage, setAiUsage] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    setEvents(storage.get('fk_events') || []);
    
    let storedAiUsage = storage.get('fk_ai_usage');
    if (!storedAiUsage || storedAiUsage.length === 0) {
      storedAiUsage = DEFAULT_AI_USAGE;
      storage.set('fk_ai_usage', storedAiUsage);
    }
    setAiUsage(storedAiUsage);
    setTools(storage.get('fk_tools') || []);
  }, []);

  const now = Date.now();
  const isWithin30Days = (timestamp: string) => (now - new Date(timestamp).getTime()) < 30 * 24 * 60 * 60 * 1000;
  
  const events30d = events.filter(e => isWithin30Days(e.timestamp));
  const aiCalls30d = events30d.filter(e => e.type === 'ai_call').length;

  const toolLaunches = events.filter(e => e.type === 'tool_launch');
  
  // Top Tool
  const toolCounts: Record<string, number> = {};
  toolLaunches.forEach(e => {
    toolCounts[e.toolName] = (toolCounts[e.toolName] || 0) + 1;
  });
  const topTool = Object.entries(toolCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const avgPerDay = Math.round(events30d.length / 30);

  // Daily Launches Chart (last 30 days)
  const dailyCounts: Record<string, number> = {};
  for(let i=29; i>=0; i--) {
    const d = new Date(now - i * 86400000).toISOString().split('T')[0];
    dailyCounts[d] = 0;
  }
  events30d.forEach(e => {
    if (dailyCounts[e.date] !== undefined) {
      dailyCounts[e.date]++;
    }
  });

  const dailyValues = Object.values(dailyCounts);
  const maxDaily = Math.max(...dailyValues, 1);

  // Top 10 Tools
  const top10Tools = Object.entries(toolCounts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 10);
  const maxTopTool = top10Tools[0]?.[1] || 1;

  // Launches by category
  const launchByCategory: Record<string, number> = {};
  toolLaunches.forEach((e: any) => {
    const t = tools.find(t => t.id === e.toolId);
    if (t) {
      launchByCategory[t.category] = (launchByCategory[t.category] || 0) + 1;
    }
  });

  const categoryColors: Record<string, string> = {
    'Finance & Billing': '#6EE7B7',
    'Sales & Proposals': '#F472B6',
    'Legal & Scoping': '#818CF8',
    'Marketing & Growth': '#FBBF24',
    'SEO & Dev': '#9CA3AF',
    'Security & Compliance': '#F87171',
    'Operations & PM': '#60A5FA'
  };

  // SVG Donut calculation
  const totalCatLaunches = Object.values(launchByCategory).reduce((a,b) => a+b, 0) || 1;
  let cumulativePercent = 0;
  const pieSegments = Object.entries(launchByCategory).map(([cat, count]) => {
    const percent = count / totalCatLaunches;
    const dasharray = `${percent * 100} 100`;
    const offset = -cumulativePercent * 100;
    cumulativePercent += percent;
    return { cat, count, percent, color: categoryColors[cat] || '#E8EAF0', dasharray, offset };
  });

  // Tier breakdown
  const tierCounts = { free: 0, freemium: 0, pro: 0 };
  toolLaunches.forEach((e: any) => {
    const t = tools.find(t => t.id === e.toolId);
    if (t) {
      if (t.tier === 'free') tierCounts.free++;
      else if (t.tier === 'freemium') tierCounts.freemium++;
      else if (t.tier === 'pro') tierCounts.pro++;
    }
  });
  const totalTierLaunches = (tierCounts.free + tierCounts.freemium + tierCounts.pro) || 1;

  // AI Cost
  const totalAiCost = aiUsage.reduce((sum, item) => sum + (item.costUSD || 0), 0);

  return (
    <div className="max-w-6xl space-y-8">
      <h1 className="text-2xl font-bold text-[#E8EAF0]">Analytics Overview</h1>

      {/* Panel 1: Key Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-widest">Launches (30d)</div>
          <div className="text-3xl font-bold text-[#E8EAF0] mt-2">{events30d.length}</div>
        </div>
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-widest">Top Tool</div>
          <div className="text-lg font-bold text-[#6EE7B7] mt-2 truncate">{topTool}</div>
        </div>
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-widest">AI Calls (30d)</div>
          <div className="text-3xl font-bold text-[#E8EAF0] mt-2">{aiCalls30d}</div>
        </div>
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-widest">Avg. per day</div>
          <div className="text-3xl font-bold text-[#E8EAF0] mt-2">{avgPerDay}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 2: Daily Launches Chart */}
        <div className="lg:col-span-2 bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <h2 className="text-sm font-bold text-[#E8EAF0] mb-6">Daily Launches (Last 30 Days)</h2>
          <div className="h-48 flex items-end gap-1">
            {Object.entries(dailyCounts).map(([date, count]) => (
              <div key={date} className="flex-1 bg-[#6EE7B7] rounded-sm hover:bg-[#A7F3D0] relative group" style={{ height: `${(count / maxDaily) * 100}%`, minHeight: '4px' }}>
                <div className="absolute opacity-0 group-hover:opacity-100 -top-8 left-1/2 -translate-x-1/2 bg-[#0B0C14] text-[#E8EAF0] text-xs py-1 px-2 rounded tracking-widest pointer-events-none whitespace-nowrap z-10 transition-opacity">
                  {date}: {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: Launches by Category */}
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl flex flex-col items-center">
          <h2 className="text-sm font-bold text-[#E8EAF0] mb-6 self-start">Launches by Category</h2>
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
              {pieSegments.map((seg, i) => (
                <circle key={i} r="16" cx="16" cy="16" fill="transparent" stroke={seg.color} strokeWidth="32" strokeDasharray={`${seg.percent * 100} 100`} strokeDashoffset={seg.offset} />
              ))}
            </svg>
            <div className="absolute inset-4 bg-[#1C2340] rounded-full"></div>
          </div>
          <div className="mt-6 w-full space-y-2">
            {pieSegments.map((seg, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }}></div>
                  <span className="text-[#6B7280]">{seg.cat}</span>
                </div>
                <span className="text-[#E8EAF0] font-mono">{Math.round(seg.percent * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 3: Top 10 Tools */}
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl">
          <h2 className="text-sm font-bold text-[#E8EAF0] mb-6">Top 10 Tools</h2>
          <div className="space-y-4">
            {top10Tools.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-4">
                <div className="text-[#6B7280] text-xs font-mono w-4">{i + 1}.</div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#E8EAF0] truncate max-w-[200px]">{name}</span>
                    <span className="text-[#6EE7B7] font-mono">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#252E4A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#6EE7B7]" style={{ width: `${(count / maxTopTool) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 5: Tier Breakdown */}
        <div className="bg-[#1C2340] border border-[#252E4A] p-6 rounded-xl flex flex-col justify-center">
          <h2 className="text-sm font-bold text-[#E8EAF0] mb-8">Tier Breakdown (Launches)</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-[#252E4A] pb-4">
              <div>
                <div className="text-3xl font-bold text-[#E8EAF0]">{tierCounts.free}</div>
                <div className="text-[#6B7280] text-sm uppercase tracking-widest mt-1">Free Tools</div>
              </div>
              <div className="text-xl font-mono text-[#6EE7B7]">{Math.round(tierCounts.free/totalTierLaunches*100)}%</div>
            </div>
            <div className="flex justify-between items-end border-b border-[#252E4A] pb-4">
              <div>
                <div className="text-3xl font-bold text-[#E8EAF0]">{tierCounts.freemium}</div>
                <div className="text-[#6B7280] text-sm uppercase tracking-widest mt-1">Freemium Tools</div>
              </div>
              <div className="text-xl font-mono text-[#818CF8]">{Math.round(tierCounts.freemium/totalTierLaunches*100)}%</div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold text-[#E8EAF0]">{tierCounts.pro}</div>
                <div className="text-[#6B7280] text-sm uppercase tracking-widest mt-1">Pro Tools</div>
              </div>
              <div className="text-xl font-mono text-[#F472B6]">{Math.round(tierCounts.pro/totalTierLaunches*100)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 6: AI Usage Log Table */}
      <div className="bg-[#1C2340] border border-[#252E4A] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#252E4A] flex justify-between items-center bg-[#13192B]">
          <h2 className="text-sm font-bold text-[#E8EAF0]">Recent AI Usage</h2>
          <div className="text-xs font-mono px-3 py-1 bg-[#252E4A] text-[#6EE7B7] rounded">
            Est. API cost (30d): ${totalAiCost.toFixed(4)}
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">TIMESTAMP</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">USER</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">TOOL</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">TOKENS</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">EST. COST</th>
              <th className="p-4 border-b border-[#252E4A] text-[#6B7280] text-xs font-mono tracking-wider">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {aiUsage.map((log: any) => (
              <tr key={log.id} className="border-b border-[#252E4A] hover:bg-[#252E4A]/30">
                <td className="p-4 text-[#6B7280] text-sm tabular-nums">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4 text-[#E8EAF0] text-sm">{log.userName}</td>
                <td className="p-4 text-[#E8EAF0] text-sm max-w-[200px] truncate">{log.toolName}</td>
                <td className="p-4 text-[#6B7280] text-sm font-mono">
                  <span className="text-[#E8EAF0]">{log.tokensIn}</span>in / {log.tokensOut}out
                </td>
                <td className="p-4 text-[#6EE7B7] text-sm font-mono">${log.costUSD?.toFixed(4)}</td>
                <td className="p-4">
                   <span className={`text-xs font-bold px-2 py-1 rounded tracking-widest ${log.status === 'success' ? 'bg-[#6EE7B7]/10 text-[#6EE7B7]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                    {log.status === 'success' ? '● Success' : '○ Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
