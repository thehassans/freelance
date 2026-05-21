import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Users, Briefcase, TrendingUp, AlertCircle, Scale, UserX, Globe,
  ChevronRight, Info, DollarSign, Database, ShieldCheck, CheckCircle2, Zap,
  Lock, Eye, Printer, ChevronDown, ChevronUp, Download, Mail, Activity,
  AlertTriangle, Shield, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import BreachSEOContent from './BreachSEOContent';

const INDUSTRIES = [
  'Healthcare', 'Finance', 'Retail', 'Technology', 'Manufacturing', 
  'Education', 'Energy & Utilities', 'Government', 'Telecommunications', 
  'Transportation', 'Defense', 'Critical Infrastructure'
];

const BUSINESS_SIZES = [
  'Small (1-50)', 'Medium (51-500)', 'Large (501-5000)', 'Enterprise (5000+)'
];

const DATA_TYPES = {
  'Personal & Identity': [
    'Personal Identifiable Information (PII)', 'Health Records', 
    'Biometric Data', 'Authentication Credentials'
  ],
  'Business & Financial': [
    'Financial Records', 'Corporate Data', 'Customer Lists', 'Payment Card Data'
  ],
  'Intellectual Property': [
    'Intellectual Property', 'Source Code', 'Trade Secrets', 'Research & Development'
  ],
  'Infrastructure & Operations': [
    'Classified Information', 'Infrastructure Data', 'Operational Data'
  ]
};

const SECURITY_MEASURES = {
  'Access Control': [
    'Multi-Factor Authentication', 'Zero Trust Architecture', 
    'Privileged Access Management', 'Network Segmentation'
  ],
  'Data Protection': [
    'Data Encryption', 'Data Loss Prevention', 'Regular Backups', 'Cloud Security Controls'
  ],
  'Monitoring & Response': [
    'Endpoint Detection & Response', 'SIEM', 'Incident Response Plan'
  ],
  'Assessment & Training': [
    'Security Awareness Training', 'Vulnerability Management', 
    'Third-Party Security Audits', 'Regular Penetration Testing'
  ]
};

const VECTORS = [
  'Phishing Attack', 'Ransomware', 'Malware', 'Insider Threat', 
  'Unknown Vector', 'Advanced Persistent Threat', 'Zero-day Exploit', 'Supply Chain Attack'
];

const GEOGRAPHIC_SCOPES = [
  'Local Impact', 'National Impact', 'International Impact'
];

export default function BreachCalculator() {
  const { executeAction, isProcessing } = usePremiumAction();
  
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [businessSize, setBusinessSize] = useState(BUSINESS_SIZES[0]);
  const [records, setRecords] = useState<number>(10000);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [selectedSecurityMeasures, setSelectedSecurityMeasures] = useState<string[]>([]);
  const [hasCyberInsurance, setHasCyberInsurance] = useState(false);
  const [attackVector, setAttackVector] = useState(VECTORS[0]);
  const [geoScope, setGeoScope] = useState(GEOGRAPHIC_SCOPES[0]);

  const [expandedRecs, setExpandedRecs] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Helpers
  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const toggleRec = (title: string) => {
    if (expandedRecs.includes(title)) setExpandedRecs(expandedRecs.filter(t => t !== title));
    else setExpandedRecs([...expandedRecs, title]);
  };

  // Complex simulated calculations
  const calculateCosts = useMemo(() => {
    // Baseline numbers
    let baseRecordCost = 150;
    
    if (industry === 'Healthcare') baseRecordCost = 350;
    else if (industry === 'Finance') baseRecordCost = 250;
    else if (industry === 'Technology' || industry === 'Defense') baseRecordCost = 200;

    let total = baseRecordCost * records;

    // Apply data type multipliers
    const dataMultiplier = 1 + (selectedDataTypes.length * 0.05);
    total *= dataMultiplier;

    // Apply security measure discounts
    const securityDiscount = 1 - (selectedSecurityMeasures.length * 0.03); // Up to ~45% discount
    total *= Math.max(0.4, securityDiscount);

    // Apply geo scope multiplier
    if (geoScope === 'National Impact') total *= 1.2;
    if (geoScope === 'International Impact') total *= 1.5;

    // Calculate segments
    return {
      total,
      breakdown: [
        { title: 'Regulatory Fines', desc: 'GDPR, HIPAA, CCPA penalties', amount: total * 0.15, impact: 'High' },
        { title: 'Forensics Investigation', desc: 'Root cause analysis & containment', amount: total * 0.10, impact: 'High' },
        { title: 'Legal Expenses', desc: 'Class-action defense & counsel', amount: total * 0.12, impact: 'Moderate' },
        { title: 'Business Interruption', desc: 'Downtime & lost productivity', amount: total * 0.25, impact: 'High' },
        { title: 'Security Improvements', desc: 'Mandatory post-breach upgrades', amount: total * 0.08, impact: 'Moderate' },
        { title: 'Customer Notification', desc: 'Mailing, call center scaling', amount: total * 0.05, impact: 'Lower' },
        { title: 'Data Recovery', desc: 'Restoring backups & integrity', amount: total * 0.05, impact: 'Lower' },
        { title: 'Reputation Management', desc: 'PR crisis management', amount: total * 0.07, impact: 'Moderate' },
        { title: 'Crisis Communication', desc: 'Internal & external comms', amount: total * 0.03, impact: 'Lower' },
        { title: 'Customer Retention', desc: 'Credit monitoring & discounts', amount: total * 0.07, impact: 'Moderate' },
        { title: 'Insurance Premium Impact', desc: 'Future rate increases', amount: total * 0.03, impact: 'Lower' },
      ],
      metrics: {
        riskScore: Math.max(20, Math.min(99, 85 + (selectedDataTypes.length * 2) - (selectedSecurityMeasures.length * 3))),
        mttr: Math.max(2, 45 - (selectedSecurityMeasures.length * 2)),
        reputationImpact: Math.min(100, 30 + (records / 1000) * 2),
        regulatoryExp: total * 0.15,
        insuranceExp: hasCyberInsurance ? -(total * 0.4) : (total * 0.03)
      }
    };
  }, [industry, records, selectedDataTypes, selectedSecurityMeasures, geoScope, hasCyberInsurance]);

  const handleDownloadActionPlan = async () => {
    const success = await executeAction(async (userId) => {
      // Simulate PDF generation/download
      setTimeout(() => {
        window.print();
        toast.success("1 Credit Used. Action Plan ready for download.");
      }, 500);
      return true;
    });
  };

  const handleEmailRecommendations = async () => {
    const success = await executeAction(async (userId) => {
      const mailtoLink = `mailto:?subject=URGENT: Cyber Liability Assessment&body=Our estimated data breach liability is currently ${formatCurrency(calculateCosts.total)}. Please review the top priority actions.`;
      setTimeout(() => {
        window.open(mailtoLink);
        toast.success("1 Credit Used. Email draft generated.");
      }, 500);
      return true;
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24 font-sans">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto px-4 py-8 md:py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200">
          <ShieldAlert size={14} /> Enterprise CISO Dashboard
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Data Breach Cost Calculator
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Quantify cyber risk in financial terms. Use deterministic modeling to translate technical vulnerabilities into boardroom-ready liability forecasts.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 flex flex-col xl:flex-row gap-8 items-start">
        {/* LEFT COLUMN: INPUTS */}
        <div className="w-full xl:w-[45%] space-y-8 flex-shrink-0">
          
          {/* Industry & Size */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-4 flex items-center gap-2 text-slate-900">
              <Briefcase className="text-indigo-500" /> Organizational Profile
            </h2>
            
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Industry</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                      industry === ind 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Business Size</label>
              <select 
                value={businessSize}
                onChange={e => setBusinessSize(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium appearance-none"
              >
                {BUSINESS_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Number of Records Affected</label>
              <input 
                type="number"
                value={records}
                onChange={e => setRecords(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 font-mono text-xl text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Data Types */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-4 flex items-center gap-2 text-slate-900">
              <Database className="text-indigo-500" /> Data Types Affected
            </h2>
            
            {Object.entries(DATA_TYPES).map(([category, types]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {types.map(t => (
                    <label key={t} className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedDataTypes.includes(t)}
                        onChange={() => toggleSelection(t, selectedDataTypes, setSelectedDataTypes)}
                      />
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedDataTypes.includes(t) 
                          ? 'bg-indigo-600 border-indigo-600 shadow-sm' 
                          : 'bg-white border-slate-300 group-hover:border-indigo-400'
                      }`}>
                        {selectedDataTypes.includes(t) && <Check size={14} className="text-white" />}
                      </div>
                      <span className={`text-sm font-medium ${selectedDataTypes.includes(t) ? 'text-slate-900' : 'text-slate-600'}`}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <Info className="text-sky-600 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-sky-900">
                <span className="font-bold">Dynamic Alert:</span> Common data types for {industry} are missing. <button className="text-sky-700 hover:text-sky-800 underline font-bold" onClick={() => {
                  /* Simulate adding typical data types */
                  const typ = industry === 'Healthcare' ? ['Health Records', 'Personal Identifiable Information (PII)'] : ['Corporate Data', 'Authentication Credentials'];
                  setSelectedDataTypes(Array.from(new Set([...selectedDataTypes, ...typ])));
                }}>Add Typical Data Types</button>
              </p>
            </div>
          </div>

          {/* Security Measures */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-4 flex items-center gap-2 text-slate-900">
              <ShieldCheck className="text-emerald-500" /> Security Measures in Place
            </h2>
            
            {Object.entries(SECURITY_MEASURES).map(([category, measures]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {measures.map(m => (
                    <label key={m} className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedSecurityMeasures.includes(m)}
                        onChange={() => toggleSelection(m, selectedSecurityMeasures, setSelectedSecurityMeasures)}
                      />
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedSecurityMeasures.includes(m) 
                          ? 'bg-emerald-500 border-emerald-500 shadow-sm' 
                          : 'bg-white border-slate-300 group-hover:border-emerald-400'
                      }`}>
                        {selectedSecurityMeasures.includes(m) && <Check size={14} className="text-white" />}
                      </div>
                      <span className={`text-sm font-medium ${selectedSecurityMeasures.includes(m) ? 'text-slate-900' : 'text-slate-600'}`}>{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <Info className="text-sky-600 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-sky-900">
                <span className="font-bold">Dynamic Alert:</span> {industry} organizations typically implement Endpoint Detection & Response and Data Encryption. <button className="text-sky-700 hover:text-sky-800 underline font-bold" onClick={() => {
                  setSelectedSecurityMeasures(Array.from(new Set([...selectedSecurityMeasures, 'Endpoint Detection & Response', 'Data Encryption'])));
                }}>Apply Industry Standards</button>
              </p>
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer group pt-4 border-t border-slate-100">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={hasCyberInsurance}
                onChange={(e) => setHasCyberInsurance(e.target.checked)}
              />
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                hasCyberInsurance 
                  ? 'bg-indigo-600 border-indigo-600 shadow-sm' 
                  : 'bg-white border-slate-300 group-hover:border-indigo-400'
              }`}>
                {hasCyberInsurance && <Check size={16} className="text-white" />}
              </div>
              <span className={`font-bold ${hasCyberInsurance ? 'text-slate-900' : 'text-slate-700'}`}>Organization has Active Cyber Insurance</span>
            </label>
          </div>

          {/* Attack Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-4 flex items-center gap-2 text-slate-900">
              <AlertTriangle className="text-rose-500" /> Attack Vector Details
            </h2>
            
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Vector</label>
              <select 
                value={attackVector}
                onChange={e => setAttackVector(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all font-medium appearance-none"
              >
                {VECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Geographic Scope</label>
              <select 
                value={geoScope}
                onChange={e => setGeoScope(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all font-medium appearance-none"
              >
                {GEOGRAPHIC_SCOPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: OUTPUTS (Sticky container) */}
        <div className="w-full xl:w-[55%] xl:sticky top-8 space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar pb-8">
          
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity size={120} />
            </div>
            
            <h2 className="text-sm font-black text-rose-500 uppercase tracking-[0.2em] mb-2 relative z-10">Total Estimated Liability</h2>
            <div className="text-5xl lg:text-7xl font-black text-rose-500 tracking-tighter mb-8 relative z-10">
              {formatCurrency(calculateCosts.total)}
            </div>

            {/* Risk Assessment Panel */}
            <div className="bg-[#0B0C14]/80 p-6 rounded-2xl border border-rose-500/20 mb-6 relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Risk Score</div>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <div className="text-4xl font-black text-rose-400">{calculateCosts.metrics.riskScore.toFixed(2)}</div>
                  <div className="text-lg text-slate-500 font-black">/ 100</div>
                </div>
                <div className="w-full bg-[#13192B] h-2 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500" style={{ width: `${calculateCosts.metrics.riskScore}%` }} />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Risk Level</div>
                  <div className={`text-sm font-black uppercase ${calculateCosts.metrics.riskScore > 75 ? 'text-rose-500' : calculateCosts.metrics.riskScore > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {calculateCosts.metrics.riskScore > 75 ? 'High' : calculateCosts.metrics.riskScore > 50 ? 'Medium' : 'Low'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Trend</div>
                  <div className="text-sm font-black uppercase text-amber-500 flex items-center gap-1">
                    <TrendingUp size={14} /> Increasing
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Confidence</div>
                  <div className="text-sm font-black uppercase text-indigo-400">High</div>
                </div>
              </div>
            </div>

            {/* Risk Grids */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
              <div className="bg-[#0B0C14]/80 p-4 rounded-2xl border border-rose-500/20">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Risk Score</div>
                <div className="text-xl font-black text-rose-400">{calculateCosts.metrics.riskScore.toFixed(1)}%</div>
              </div>
              <div className="bg-[#0B0C14]/80 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Est. Recovery</div>
                <div className="text-xl font-black text-white">{calculateCosts.metrics.mttr} Days</div>
              </div>
              <div className="bg-[#0B0C14]/80 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Data Exposure</div>
                <div className="text-xl font-black text-white">{records.toLocaleString()} Recs</div>
              </div>
              <div className="bg-[#0B0C14]/80 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Reputation Hit</div>
                <div className="text-xl font-black text-white">-{calculateCosts.metrics.reputationImpact.toFixed(1)}%</div>
              </div>
              <div className="bg-[#0B0C14]/80 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Reg. Exposure</div>
                <div className="text-xl font-black text-rose-300">{formatCurrency(calculateCosts.metrics.regulatoryExp)}</div>
              </div>
              <div className="bg-[#0B0C14]/80 p-4 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Insurance Impact</div>
                <div className="text-xl font-black text-emerald-400">{hasCyberInsurance ? 'Covered' : 'Uninsured'}</div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-[#13192B] border border-[#252E4A] rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <DollarSign className="text-amber-400" /> Granular Cost Breakdown
            </h3>
            
            <div className="space-y-4">
              {calculateCosts.breakdown.map((item, idx) => {
                const pct = (item.amount / calculateCosts.total) * 100;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.impact === 'High' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 
                          item.impact === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <div>
                          <div className="text-sm font-bold text-white">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-slate-300">{formatCurrency(item.amount)}</div>
                        <div className="text-[10px] font-bold text-slate-500">{pct.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-[#0B0C14] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.impact === 'High' ? 'bg-rose-500' : 
                          item.impact === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(2, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-[#13192B] border border-[#252E4A] rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Shield className="text-indigo-400" /> Remediation Engine
            </h3>
            
            <div className="space-y-4">
              {['High Priority Actions', 'Medium Priority'].map((priority) => (
                <div key={priority} className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{priority}</h4>
                  
                  {[1, 2].map(num => {
                    const title = priority === 'High Priority Actions' 
                      ? (num === 1 ? 'Deploy Data Encryption at Rest' : 'Implement Zero Trust Network Access')
                      : (num === 1 ? 'Conduct Security Awareness Training' : 'Establish Incident Response Plan');
                    
                    const desc = "Comprehensive modernization of security architecture to reduce blast radius and dwell time of threat actors.";
                    const reduction = priority === 'High Priority Actions' ? (num === 1 ? '18%' : '22%') : '12%';
                    const time = priority === 'High Priority Actions' ? '4-8 weeks' : '2-4 weeks';
                    const diff = priority === 'High Priority Actions' ? 'Hard' : 'Moderate';
                    
                    const isExp = expandedRecs.includes(title);

                    return (
                      <div key={title} className="bg-[#0B0C14] border border-[#252E4A] rounded-xl overflow-hidden">
                        <div 
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#1C2340] transition-colors"
                          onClick={() => toggleRec(title)}
                        >
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-white text-sm">{title}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">-{reduction} Liability</span>
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-1">{desc}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                              <div className="text-[10px] text-slate-500 uppercase font-bold">{diff}</div>
                              <div className="text-xs text-slate-300 whitespace-nowrap">{time}</div>
                            </div>
                            {isExp ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                          </div>
                        </div>
                        <AnimatePresence>
                          {isExp && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 pt-2 border-t border-[#252E4A] bg-[#1C2340]"
                            >
                              <p className="text-sm text-slate-300 mb-4">{desc}</p>
                              <div className="flex items-center gap-3">
                                <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline">View Action Plan</button>
                                <button className="text-xs font-bold text-slate-400 hover:text-white underline">Find Vendor</button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Deliverable Actions */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 border border-indigo-500/30 text-center relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Export Boardroom-Ready Reports</h3>
                <p className="text-sm text-indigo-200">Generate a custom PDF action plan or email these recommendations to your leadership team. Uses 1 Premium Credit.</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={handleDownloadActionPlan}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 bg-white text-indigo-900 px-6 py-4 rounded-xl font-black hover:bg-slate-100 transition-colors shadow-xl disabled:opacity-50"
                >
                  <Download size={20} />
                  Download Action Plan
                </button>
                <button 
                  onClick={handleEmailRecommendations}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 bg-indigo-600/30 text-white border border-indigo-400 px-6 py-4 rounded-xl font-black hover:bg-indigo-600/50 transition-colors disabled:opacity-50"
                >
                  <Mail size={20} />
                  Email Recommendations
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Structured SEO Section */}
      <BreachSEOContent />
    </div>
  );
}
