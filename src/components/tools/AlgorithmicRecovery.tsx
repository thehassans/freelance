import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, TrendingDown, TrendingUp, AlertCircle, 
  Download, Sparkles, ExternalLink, ShieldCheck, 
  CheckCircle2, ArrowRight, Activity, Info, Users
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { pdf } from '@react-pdf/renderer';
import AlgorithmicRecoveryPDF from './AlgorithmicRecoveryPDF';
import LockedToolOverlay from '../common/LockedToolOverlay';

// Mock algorithm updates metadata
const ALGO_UPDATES = [
  { date: '2025-12-11', name: 'Dec 2025 Core Update', impact: 'Content Quality & Authority' },
  { date: '2026-03-27', name: 'March 2026 Core Update', impact: 'E-E-A-T & Helpful Content' },
];

export default function AlgorithmicRecovery() {
  const [domain, setDomain] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  const diagnosticRef = React.useRef<HTMLDivElement>(null);

  // Procedural data generation based on domain hash
  const generateAuditReport = (domainStr: string) => {
    setAnalyzing(true);
    
    // Simple hashing for consistent results per domain
    let hash = 0;
    for (let i = 0; i < domainStr.length; i++) {
        hash = ((hash << 5) - hash) + domainStr.charCodeAt(i);
        hash |= 0;
    }
    const absHash = Math.abs(hash);
    
    // Determine which update hit this domain
    const hitIndex = absHash % ALGO_UPDATES.length;
    const updateHit = ALGO_UPDATES[hitIndex];
    
    // Generate 12 months of traffic data
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const data: any[] = [];
    let currentTraffic = 40000 + (absHash % 20000);
    const dropMonthIndex = updateHit.date.includes('Dec') ? 8 : 11; // Dec is 9th month (index 8), Mar is 12th month (index 11)

    months.forEach((month, i) => {
      let traffic = currentTraffic + (Math.sin(i) * 2000);
      
      // Apply the "Algorithmic Hit"
      if (i === dropMonthIndex) {
        traffic = traffic * 0.45; // 55% drop
        currentTraffic = traffic;
      } else if (i > dropMonthIndex) {
        // Slow recovery or stagnation after hit
        traffic = currentTraffic + (Math.random() * 500);
      } else {
        // Stable growth before hit
        currentTraffic += 1000;
      }

      data.push({
        month: `${month} 20${i < 9 ? '25' : '26'}`,
        traffic: Math.round(traffic),
        isHitMonth: i === dropMonthIndex
      });
    });

    setTimeout(() => {
      setReport({
        domain: domainStr,
        chartData: data,
        updateHit,
        dropSeverity: 'Critical (-55.4%)',
        recoveryScore: Math.round(40 + (absHash % 30)),
        actions: getRecoveryActions(updateHit.impact)
      });
      setAnalyzing(false);
    }, 1500);
  };

  const getRecoveryActions = (impactType: string) => {
    if (impactType.includes('E-E-A-T')) {
      return [
        { title: 'Author Identity Audit', desc: 'Verify all contributors have linked social profiles and expertise-based bios.', icon: <Users className="text-blue-600" /> },
        { title: 'Information Gain Review', desc: 'Identify pages with "thin" content and add unique datasets or personal experience.', icon: <Sparkles className="text-emerald-600" /> },
        { title: 'Prune AI Drafts', desc: 'Flag and rewrite content that fails to meet the Helpful Content System guidelines.', icon: <Activity className="text-rose-600" /> }
      ];
    }
    return [
      { title: 'Technical Quality Audit', desc: 'Scan for LCP and CLS issues that may be degrading the RankBrain signal.', icon: <ShieldCheck className="text-blue-600" /> },
      { title: 'Niche Relevancy Check', desc: 'Remove off-topic content that dilutes your site core topical authority.', icon: <TrendingDown className="text-emerald-600" /> },
      { title: 'Toxic Link Disavow', desc: 'Cleanse your backlink profile of automated comment spam and PBN links.', icon: <ExternalLink className="text-rose-600" /> }
    ];
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    setExporting(true);
    try {
      const blob = await pdf(<AlgorithmicRecoveryPDF report={report} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Algorithmic_Recovery_Audit_${report.domain.replace(/\./g, '_')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const scrollToActions = () => {
    diagnosticRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header & Pro Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 flex items-center gap-1.5">
               FREEMIUM TOOL
             </span>
             <span className="text-slate-400 text-sm font-medium">Diagnostic Engine v4.2</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Algorithmic Recovery <span className="text-blue-600">Auditor</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-xl">
            Diagnose traffic drops, identify exact Google updates, and generate a procedural recovery roadmap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            disabled={!report || exporting}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {exporting ? 'Generating PDF...' : 'Export Full Audit PDF'}
          </button>
        </div>
      </div>

      {/* Search Bar (Locked) */}
      <LockedToolOverlay />

      <AnimatePresence mode="wait">
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Chart Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">12-Month Organic Traffic Trend</h3>
                  <p className="text-sm text-slate-500 font-medium">Domain: {report.domain}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Impact Event</p>
                    <p className="text-sm font-black text-rose-600">{report.dropSeverity}</p>
                  </div>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={report.chartData}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="traffic" 
                      stroke="#2563eb" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorTraffic)" 
                      animationDuration={2000}
                    />
                    <ReferenceLine 
                      x={report.chartData.find((d: any) => d.isHitMonth)?.month} 
                      stroke="#ef4444" 
                      strokeDasharray="5 5"
                      label={{ 
                        value: report.updateHit.name, 
                        position: 'top', 
                        fill: '#ef4444', 
                        fontSize: 10, 
                        fontWeight: 900,
                        offset: 20
                      }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Diagnostic Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div 
                  ref={diagnosticRef}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <AlertCircle size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Diagnostic Summary</h3>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                    <p className="text-slate-700 font-medium leading-relaxed">
                      Our engines identified a core correlation between your traffic drop and the <span className="font-bold text-slate-900">{report.updateHit.name}</span>. 
                      This update targeted <span className="font-bold text-blue-600">{report.updateHit.impact}</span> signals. Your site is currently underperforming in topical authority metrics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {report.actions.map((action: any, i: number) => (
                      <div key={i} className="flex flex-col gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group">
                        <div className="w-10 h-10 rounded-full border border-slate-50 bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {action.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 mb-1">{action.title}</h4>
                          <p className="text-[11px] text-slate-500 font-bold leading-tight">{action.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Activity size={80} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Recovery Score</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-black">{report.recoveryScore}</span>
                    <span className="text-lg font-bold text-slate-400">/100</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-8">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${report.recoveryScore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                  <button 
                    onClick={scrollToActions}
                    className="w-full py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-slate-100 active:scale-95 flex items-center justify-center gap-2"
                  >
                    Action Plan <ArrowRight size={14} />
                  </button>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Authority Health</h4>
                    <p className="text-lg font-black text-emerald-600">Stable</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-800 mb-3">
                    <Info size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Expert Tip</span>
                  </div>
                  <p className="text-xs text-blue-700/80 font-medium leading-relaxed">
                    Recovery from core updates typically takes 3-6 months. Focus on "Originality" signals and avoid massive AI bulk-edits during the verification phase.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!report && !analyzing && (
        <div className="text-center py-24 opacity-50">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingDown size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Awaiting Data Input</p>
        </div>
      )}
    </div>
  );
}
