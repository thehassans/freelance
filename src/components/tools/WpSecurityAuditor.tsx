import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Lock, 
  AlertTriangle, 
  Globe, 
  ChevronRight, 
  ExternalLink,
  History,
  Info,
  Layers,
  Cpu,
  FileWarning,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

interface ScanResult {
  id: string;
  name: string;
  status: 'Pass' | 'Fail';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  remedy: string;
}

export default function WpSecurityAuditor() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [results, setResults] = useState<{
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    checks: ScanResult[];
    scanTime: string;
    targetUrl: string;
  } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeUrl = (input: string) => {
    try {
      const trimmed = input.trim();
      const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      const urlObj = new URL(withProtocol);
      return urlObj.origin;
    } catch (e) {
      return input;
    }
  };

  const performAudit = async () => {
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    
    setUrl(normalized);
    setIsScanning(true);
    setResults(null);
    setError(null);

    const steps = [
      'Normalizing target origin...',
      'Testing XML-RPC interface...',
      'Deep scanning wp-login.php...',
      'Checking version meta-tags...',
      'Compiling diagnostic report...'
    ];

    try {
      // Rotate steps for UI feedback
      let stepIdx = 0;
      const stepInterval = setInterval(() => {
        setScanStep(steps[stepIdx % steps.length]);
        stepIdx++;
      }, 800);

      const response = await fetch(`/api/audit-wp?url=${encodeURIComponent(normalized)}`);
      
      clearInterval(stepInterval);
      
      if (!response.ok) {
        throw new Error('Failed to reach target server');
      }

      const data = await response.json();
      
      const checks: ScanResult[] = [
        {
          id: 'xmlrpc',
          name: 'XML-RPC Interface Visibility',
          status: data.xmlrpc.vulnerable ? 'Fail' : 'Pass',
          severity: 'Critical',
          description: data.xmlrpc.vulnerable 
            ? `The xmlrpc.php file returned status ${data.xmlrpc.status}. This interface is publicly accessible.` 
            : 'Access to xmlrpc.php is blocked or not found.',
          remedy: 'Disable XML-RPC via .htaccess or a security plugin if not required by mobile apps or Jetpack.'
        },
        {
          id: 'wp-version',
          name: 'WordPress Version Disclosure',
          status: data.version.vulnerable ? 'Fail' : 'Pass',
          severity: 'Medium',
          description: data.version.vulnerable 
            ? 'WordPress version generator meta tag was detected in the HTML source.' 
            : 'No version meta tags found in homepage source.',
          remedy: 'Remove the "generator" meta tag. Exposing version numbers helps automated exploits.'
        },
        {
          id: 'admin-path',
          name: 'Default Login path (wp-login)',
          status: data.login.vulnerable ? 'Fail' : 'Pass',
          severity: 'High',
          description: data.login.vulnerable 
            ? 'The standard /wp-login.php endpoint is active and accepting credentials.' 
            : 'Default login path returned non-standard response or is protected.',
          remedy: 'Use a security plugin (like WPS Hide Login) to rename your entry point to a custom slug.'
        }
      ];

      const failCount = checks.filter(c => c.status === 'Fail').length;
      const riskLevel = failCount >= 2 ? 'HIGH' : failCount === 1 ? 'MEDIUM' : 'LOW';

      setResults({
        riskLevel,
        scanTime: new Date().toLocaleString(),
        checks,
        targetUrl: normalized
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Audit failed. Check URL and try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const copySalesScript = () => {
    if (!results) return;
    
    const domain = results.targetUrl.replace(/^https?:\/\//, '');
    const criticalCount = results.checks.filter(c => c.status === 'Fail' && c.severity === 'Critical' || c.severity === 'High').length;
    const failingNames = results.checks.filter(c => c.status === 'Fail').map(c => c.id === 'xmlrpc' ? 'XML-RPC bridge' : c.name).join(', ');

    const script = `Hi [Name],\n\nI was running a routine security scan and noticed that ${domain} has ${criticalCount} exposed critical vulnerabilities. Specifically, your ${failingNames} is publicly accessible, which bots use for automated brute-force attacks.\n\nI specialize in WordPress hardening. Are you open to a quick chat this week to get this patched for good?\n\nBest,\n[Your Name]`;
    
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Print Only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">WordPress Security Diagnostic Report</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Confidential Professional Audit</p>
      </div>

      {/* Tool Header */}
      <div className="text-center space-y-4 print:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider">
          <Layers size={14} /> WP Hardening
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          WordPress Security Hardening Auditor
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto italic">
          Audit any WordPress site for common misconfigurations and exposures. Turn security gaps into professional service opportunities.
        </p>
      </div>

      {/* Input Module */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden print:hidden">
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="relative flex-grow">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
              <Globe size={20} />
            </div>
            <input
              type="text"
              placeholder="https://client-wordpress-site.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-slate-900 font-medium font-mono text-sm"
            />
          </div>
          <button
            onClick={performAudit}
            disabled={isScanning || !url}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group"
          >
            {isScanning ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} className="group-hover:scale-110 transition-transform" />}
            {isScanning ? 'Analyzing...' : 'Start Audit'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-100">
            <AlertTriangle size={14} /> {error}
          </div>
        )}
        
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-4"
          >
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-rose-500"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              <Cpu size={14} className="text-rose-500" />
              {scanStep}
            </div>
          </motion.div>
        )}

        <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">
          <span>Non-Intrusive Scan</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <span>Real-time Detection</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <span>Care Plan Ready</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {results && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Audit Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 bg-rose-600 rounded-[2rem] p-8 text-white flex flex-col items-center justify-center text-center shadow-xl shadow-rose-600/30">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Risk Level</span>
                <div className="text-4xl font-black mb-2 tracking-tighter">{results.riskLevel}</div>
                <div className="w-12 h-1 bg-white/20 rounded-full mb-4" />
                <ShieldAlert size={48} className="opacity-40" />
              </div>

              <div className="md:col-span-3 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">Vulnerability Summary</h3>
                    <p className="text-sm text-slate-400 mt-1">Target: <span className="text-slate-900 font-mono font-medium">{results.targetUrl}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Time</span>
                      <span className="text-xs font-bold text-slate-600">{results.scanTime}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Critical', count: results.checks.filter(c => c.severity === 'Critical' && c.status === 'Fail').length, color: 'text-rose-500' },
                    { label: 'High', count: results.checks.filter(c => c.severity === 'High' && c.status === 'Fail').length, color: 'text-orange-500' },
                    { label: 'Medium', count: results.checks.filter(c => c.severity === 'Medium' && c.status === 'Fail').length, color: 'text-amber-500' },
                    { label: 'Low/Pass', count: results.checks.filter(c => c.status === 'Pass').length, color: 'text-emerald-500' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className={`text-2xl font-black ${stat.color}`}>{stat.count}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Findings List */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Eye size={14} /> Detailed Findings
                </span>
                <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-3 py-1 rounded-full uppercase">
                  Action Required
                </span>
              </div>

              <div className="divide-y divide-slate-50">
                {results.checks.map((check) => (
                  <div key={check.id} className="p-6 transition-colors hover:bg-slate-50/30 group">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        {check.status === 'Pass' ? (
                          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                            <CheckCircle2 size={24} />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 animate-pulse">
                            <XCircle size={24} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-bold text-slate-900">{check.name}</h4>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            check.status === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {check.status === 'Pass' ? 'Secure' : 'Critical Vulnerability'}
                          </span>
                          {check.status === 'Fail' && (
                            <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {check.severity} Severity
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence</span>
                            <p className="text-sm text-slate-600 leading-relaxed">{check.description}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remediation</span>
                            <p className={`text-sm leading-relaxed ${check.status === 'Pass' ? 'text-emerald-600' : 'text-slate-600 font-medium'}`}>
                              {check.remedy}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Freelancer Pitch Alert */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 print:hidden"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 bg-rose-500 rounded-[1.5rem] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-rose-500/30">
                  <AlertTriangle size={32} />
                </div>
                <div className="space-y-6 flex-grow">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight uppercase">Lead Conversion Opportunity</h3>
                    <p className="text-slate-400 max-w-xl italic">
                      Diagnostic evidence is the most effective way to cross the "Trust Barrier" with a cold prospect.
                    </p>
                  </div>
                  
                  <div className="bg-rose-500 text-white p-6 rounded-2xl border border-rose-400 text-center font-bold text-lg shadow-inner uppercase tracking-tighter">
                    "Offer to fix these vulnerabilities for a $150-$300/month WordPress Care Plan."
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                    >
                      Generate PDF Report <ChevronRight size={16} />
                    </button>
                    <button 
                      onClick={copySalesScript}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border ${
                        copiedScript ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                      }`}
                    >
                      {copiedScript ? <CheckCircle2 size={16} /> : null}
                      {copiedScript ? 'Copied!' : 'Copy Sales Script'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative back-end elements */}
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <FileWarning size={320} />
              </div>
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Support Actions */}
            <div className="flex justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <button className="hover:text-slate-900 transition-colors flex items-center gap-2">
                <History size={14} /> Clear Audit History
              </button>
              <span className="opacity-20">|</span>
              <button className="hover:text-slate-900 transition-colors flex items-center gap-2">
                <ExternalLink size={14} /> Documentation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State / Guidelines */}
      {!results && !isScanning && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Search,
              title: "Enter Target URL",
              desc: "Paste the homepage of any site you suspect is running on WordPress."
            },
            {
              icon: ShieldCheck,
              title: "Passive Audit",
              desc: "We perform a non-invasive header and structure check to find exposures."
            },
            {
              icon: Info,
              title: "Bridge the Gap",
              desc: "Use the critical findings to justify your recurring maintenance services."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-slate-50">
                <item.icon size={24} />
              </div>
              <h5 className="font-bold text-slate-900">{item.title}</h5>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
