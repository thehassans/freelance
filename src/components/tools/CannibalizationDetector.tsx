import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, Link as LinkIcon, FileText, Search, 
  Trash2, RefreshCcw, ChevronDown, CheckCircle2, 
  ArrowRight, Layers, Layout, Download, Trophy, Eye, MousePointer2
} from 'lucide-react';

import { useUser } from '../../contexts/UserContext';

interface SEOEntry {
  url: string;
  keyword: string;
  clicks: number;
  impressions: number;
}

interface URLMetric {
  url: string;
  clicks: number;
  impressions: number;
}

interface Collision {
  keyword: string;
  pages: URLMetric[];
}

type MatchType = 'exact' | 'partial';

export default function CannibalizationDetector() {
  const { isPro } = useUser();
  const [rawData, setRawData] = useState('');
  const [matchType, setMatchType] = useState<MatchType>('exact');
  const [actions, setActions] = useState<Record<string, string>>({});
  const [auditResults, setAuditResults] = useState<{
    totalRows: number;
    uniqueKeywords: number;
    collisions: Collision[];
  } | null>(null);

  const parseData = (input: string): SEOEntry[] => {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Support Tab and Comma
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        const url = (parts[0] || '').trim();
        const keyword = (parts[1] || '').trim().toLowerCase();
        const clicks = parseInt((parts[2] || '0').trim()) || 0;
        const impressions = parseInt((parts[3] || '0').trim()) || 0;
        
        return { url, keyword, clicks, impressions };
      })
      .filter(entry => entry.url && entry.keyword);
  };

  const runRiskAudit = () => {
    const parsed = parseData(rawData);
    const keywordMap = new Map<string, URLMetric[]>();

    parsed.forEach(entry => {
      const existing = keywordMap.get(entry.keyword) || [];
      // Avoid duplicate URLs for same keyword in input
      if (!existing.find(p => p.url === entry.url)) {
        keywordMap.set(entry.keyword, [...existing, { 
          url: entry.url, 
          clicks: entry.clicks, 
          impressions: entry.impressions 
        }]);
      }
    });

    const collisions: Collision[] = Array.from(keywordMap.entries())
      .map(([keyword, pages]) => {
        // Sort by clicks to find current winner
        const sortedPages = [...pages].sort((a, b) => b.clicks - a.clicks);
        return { keyword, pages: sortedPages };
      })
      .filter(item => item.pages.length > 1);

    // Reset actions when new audit runs, pre-populating losers with default fix
    const initialActions: Record<string, string> = {};
    collisions.forEach(c => {
      c.pages.forEach((page, idx) => {
        const key = `${c.keyword}-${page.url}`;
        if (idx === 0) {
          initialActions[key] = 'Keep as Winner';
        } else {
          initialActions[key] = '301 Redirect to Winner';
        }
      });
    });

    setActions(initialActions);
    setAuditResults({
      totalRows: parsed.length,
      uniqueKeywords: keywordMap.size,
      collisions
    });
  };

  const updateAction = (keyword: string, url: string, action: string) => {
    setActions(prev => ({
      ...prev,
      [`${keyword}-${url}`]: action
    }));
  };

  const exportToCSV = useCallback(() => {
    if (!auditResults) return;

    const headers = ['Keyword', 'URL', 'Clicks', 'Impressions', 'Status', 'Recommended Action'];
    const rows = auditResults.collisions.flatMap(c => 
      c.pages.map((p, idx) => [
        c.keyword,
        p.url,
        p.clicks.toString(),
        p.impressions.toString(),
        idx === 0 ? 'Suggested Winner' : 'Cannibalizing Page',
        actions[`${c.keyword}-${p.url}`] || 'None'
      ])
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      !isPro ? '\n"---"' : '',
      !isPro ? '"Exported from FreelancerKit. Upgrade to Pro to remove branding."' : ''
    ].filter(Boolean).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `seo-cannibalization-plan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [auditResults, actions]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
      {/* 1. THE INPUT ENGINE */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Search size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">GSC Data Ingestion</h2>
              <p className="text-xs text-slate-500 font-medium tracking-tight">Paste metrics from Search Console</p>
            </div>
          </div>

          <div className="relative group">
            <textarea
              className="w-full h-80 bg-slate-900 text-slate-300 p-4 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all resize-none border-0"
              placeholder={'[URL]\t[Keyword]\t[Clicks]\t[Impressions]\n\nhttps://site.com/p1\tseo tool\t450\t12000\nhttps://site.com/p2\tseo tool\t12\t800'}
              value={rawData || ''}
              onChange={(e) => setRawData(e.target.value)}
            />
            <div className="absolute top-3 right-3 flex gap-2">
               <button 
                onClick={() => setRawData('')}
                className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
               >
                 <Trash2 size={14} />
               </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
               <div>
                 <span className="text-xs font-bold text-slate-700 block">Match Logic</span>
                 <span className="text-[10px] text-slate-400 font-medium tracking-tight">Enterprise deduplication</span>
               </div>
               <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                 <button 
                  onClick={() => setMatchType('exact')}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${matchType === 'exact' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                   EXACT
                 </button>
                 <button 
                  onClick={() => setMatchType('partial')}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${matchType === 'partial' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                   PARTIAL
                 </button>
               </div>
            </div>

            <button 
              onClick={runRiskAudit}
              disabled={!rawData}
              className="w-full py-4 bg-[#0f4c75] text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-[#07314d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#0f4c75]/20 active:scale-95"
            >
              <RefreshCcw size={16} className={`${auditResults ? 'animate-spin-slow' : ''}`} />
              Run Risk Audit
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm">
              <FileText size={18} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">PRO TIP</h4>
              <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                Export your "Performance" report from Google Search Console and paste the top 4 columns (URL, Query, Clicks, Impressions) for the best results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2 & 3. OUTPUT DASHBOARD */}
      <div className="flex-1 flex flex-col gap-6">
        {!auditResults ? (
          <div className="flex-1 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-400 mb-6">
              <Layers size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Awaiting Data Corpus</h3>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-8 font-medium">
              Paste your GSC performance data to identify cannibalizing pages and automatically select your SEO winners.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-bold text-slate-400">URL</div>
              <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-bold text-slate-400">KEYWORD</div>
              <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-bold text-slate-400">CLICKS</div>
              <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-bold text-slate-400">IMPRESSIONS</div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Metrics */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1 w-full">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Pages</span>
                  <div className="text-3xl font-black text-slate-900">{auditResults.totalRows}</div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Unique Keywords</span>
                  <div className="text-3xl font-black text-slate-900">{auditResults.uniqueKeywords}</div>
                </div>
                <div className={`p-5 rounded-3xl border shadow-sm transition-colors md:col-span-1 col-span-2 ${auditResults.collisions.length > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${auditResults.collisions.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    High-Risk clusters
                  </span>
                  <div className={`text-3xl font-black ${auditResults.collisions.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {auditResults.collisions.length}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 px-5 py-3 h-fit border-2 border-slate-200 rounded-2xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:border-[#0f4c75] hover:text-[#0f4c75] transition-all bg-white whitespace-nowrap shadow-sm active:scale-95"
              >
                <Download size={14} />
                Export CSV Plan
              </button>
            </div>

            {/* Risk Clusters */}
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar pb-12">
              {auditResults.collisions.length === 0 ? (
                <div className="bg-emerald-50 p-12 rounded-3xl border border-emerald-100 text-center">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h4 className="text-emerald-900 text-xl font-black uppercase tracking-tight">Zero Collisions Detected</h4>
                  <p className="text-emerald-700/70 text-sm font-medium">Your keyword mapping across the domain is clean and optimized.</p>
                </div>
              ) : (
                auditResults.collisions.map((collision, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shadow-sm shadow-red-100">
                          <AlertTriangle size={16} />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 capitalize tracking-tight">{collision.keyword}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-[0.2em] shadow-sm">
                          {collision.pages.length} Pages Competing
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {collision.pages.map((page, pIdx) => {
                        const isWinner = pIdx === 0;
                        const actionKey = `${collision.keyword}-${page.url}`;
                        
                        return (
                          <div 
                            key={pIdx} 
                            className={`flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                              isWinner 
                                ? 'bg-emerald-50/50 border-emerald-100 group/winner' 
                                : 'bg-slate-50 border-slate-100 group/loser hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex flex-col gap-2 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <LinkIcon size={14} className={isWinner ? 'text-emerald-500' : 'text-slate-400'} />
                                <span className={`text-xs font-bold truncate ${isWinner ? 'text-emerald-900' : 'text-slate-600'}`}>{page.url}</span>
                                {isWinner && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white rounded-md text-[8px] font-black uppercase tracking-widest shadow-sm">
                                    <Trophy size={8} fill="currentColor" /> Suggested Winner
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                  <MousePointer2 size={12} className="text-slate-400" />
                                  <span className="text-[10px] font-black text-slate-900">{page.clicks.toLocaleString()}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Clicks</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Eye size={12} className="text-slate-400" />
                                  <span className="text-[10px] font-black text-slate-900">{page.impressions.toLocaleString()}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Imps</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="relative w-full xl:w-56">
                                <select 
                                  value={actions[actionKey] || 'None'}
                                  onChange={(e) => updateAction(collision.keyword, page.url, e.target.value)}
                                  className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer transition-all ${
                                    isWinner 
                                      ? 'bg-white border-emerald-200 text-emerald-700 hover:border-emerald-400' 
                                      : 'bg-white border-slate-200 text-slate-500 hover:border-[#0f4c75] hover:text-[#0f4c75]'
                                  }`}
                                >
                                  {isWinner ? (
                                    <>
                                      <option>Keep as Winner</option>
                                      <option>Deprioritize</option>
                                    </>
                                  ) : (
                                    <>
                                      <option>301 Redirect to Winner</option>
                                      <option>Rel=Canonical</option>
                                      <option>De-optimize Content</option>
                                      <option>Merge to Power Page</option>
                                      <option>None</option>
                                    </>
                                  )}
                                </select>
                                <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isWinner ? 'text-emerald-400' : 'text-slate-400'}`} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* CTA Ecosystem */}
            {auditResults.collisions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/40 border border-slate-800"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#38bdf8] border border-white/5 shadow-inner">
                    <Layout size={28} />
                  </div>
                  <div>
                    <h4 className="text-white text-lg font-black uppercase tracking-tight leading-tight mb-1">Scale this into a project?</h4>
                    <p className="text-slate-400 text-xs font-medium">Generate a professional consolidation SOW with AI using these results.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const params = new URLSearchParams({
                      context: 'seo-cannibalization',
                      collisions: auditResults.collisions.length.toString()
                    });
                    window.location.href = `/tools/ai-proposal-generator?${params.toString()}`;
                  }}
                  className="px-8 py-5 bg-[#0f4c75] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#07314d] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                >
                  Generate Consolidation SOW <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

