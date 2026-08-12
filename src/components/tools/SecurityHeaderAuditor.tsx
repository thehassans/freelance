import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Globe, 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  Download, 
  ExternalLink, 
  Info, 
  Shield, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Activity, 
  Server, 
  Zap, 
  FileJson,
  ChevronDown,
  Share2,
  RefreshCw
} from 'lucide-react';
import { DatabaseService, AuditReportPayload } from '../../services/DatabaseService';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { toast } from 'sonner';
import LockedToolOverlay from '../common/LockedToolOverlay';

export default function SecurityHeaderAuditor() {
  const [url, setUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState<AuditReportPayload | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const { executeAction, isProcessing } = usePremiumAction('http-security-auditor');
  
  const loadingMessages = [
    'Resolving DNS Configuration...',
    'Analyzing HTTP Response Headers...',
    'Checking GDPR Data Privacy...',
    'Evaluating SEO & Core Web Vitals...',
    'Compiling Boardroom-Ready Report...'
  ];

  useEffect(() => {
    if (isAuditing) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isAuditing]);

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsAuditing(true);
    setAuditData(null);
    setLoadingStep(0);
    try {
      const data = await DatabaseService.fetchLiveSecurityAudit(url);
      setAuditData(data);
    } catch (error) {
      toast.error('Backend connection failed. Please ensure your API is running.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleDownloadReport = async () => {
    await executeAction(async (userId) => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          window.print();
          toast.success("1 Credit Used. Action Plan ready for download.");
          resolve(true);
        }, 500);
      });
    });
  };
  
  const handleExportData = async () => {
    await executeAction(async (userId) => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditData, null, 2));
          const anchor = document.createElement('a');
          anchor.setAttribute("href", dataStr);
          anchor.setAttribute("download", "audit_report.json");
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          toast.success("1 Credit Used. Data exported successfully.");
          resolve(true);
        }, 500);
      });
    });
  };

  const calculateTotalScore = () => {
    if(!auditData) return 0;
    const scores = auditData.scores;
    const total = (scores.security.score / scores.security.max * 100) +
                  (scores.gdpr.score / scores.gdpr.max * 100) +
                  (scores.seo.score / scores.seo.max * 100) +
                  (scores.html.score / scores.html.max * 100) +
                  (scores.performance.score / scores.performance.max * 100);
    return (total / 5).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans overflow-x-hidden">
      
      {/* Page Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">FREEMIUM TOOL</span>
            <span className="bg-rose-100 text-rose-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">Security</span>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"
          >
            <Share2 size={16} /> Share Link
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          HTTP Security Header Auditor
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Uncover critical vulnerabilities in HTTP response headers, GDPR compliance, and server configurations in seconds.
        </p>
      </div>

      {/* Hero Input Area (Locked) */}
      <div className="max-w-3xl mx-auto px-6 mb-24">
        <LockedToolOverlay />
      </div>

      {/* Loading State */}
      {isAuditing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto px-6 py-24 text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 animate-pulse">
            {loadingMessages[loadingStep]}
          </h2>
          <p className="text-slate-500 font-medium">This may take a few moments. We are performing a deep analysis of the target infrastructure.</p>
        </motion.div>
      )}

      {/* Results Dashboard (Success State) */}
      {auditData && !isAuditing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-6 space-y-8"
        >
          <div className="flex justify-end">
            <button
              onClick={() => {
                setAuditData(null);
                setUrl('');
              }}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-colors"
            >
              <RefreshCw size={16} /> Scan Another Domain
            </button>
          </div>
          {/* Top Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-widest text-xs mb-2">
                    <Globe size={14} /> Domain Analysis
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black mb-2 truncate">
                    {auditData.domain}
                  </h2>
                  <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300 font-medium pb-1">
                    <Server size={14} className="text-indigo-400" /> Detected Stack: {auditData.cms}
                  </div>
                </div>
                <div className="mt-8 flex gap-8">
                  <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</div>
                    <div className="text-4xl font-black flex items-baseline gap-1">
                      <span className={Number(calculateTotalScore()) > 80 ? 'text-emerald-400' : 'text-amber-400'}>
                        {calculateTotalScore()}
                      </span>
                      <span className="text-lg text-slate-500">/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Security', score: auditData.scores.security, icon: Lock, color: 'text-rose-500', bg: 'bg-rose-50' },
                { name: 'GDPR Compliance', score: auditData.scores.gdpr, icon: ShieldAlert, color: 'text-sky-500', bg: 'bg-sky-50' },
                { name: 'SEO Vitals', score: auditData.scores.seo, icon: Search, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { name: 'HTML Structure', score: auditData.scores.html, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { name: 'Performance', score: auditData.scores.performance, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' }
              ].map(cat => (
                <div key={cat.name} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>
                      <cat.icon size={18} />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
                  </div>
                  <div className="font-black text-slate-900">
                    {cat.score.score} <span className="text-slate-400 text-xs font-bold">/ {cat.score.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Security Headers Accordion */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <Lock className="text-indigo-600" size={24} />
                <h3 className="text-xl font-black text-slate-900">Security Headers Analysis</h3>
              </div>
              <div className="space-y-3 flex-1">
                {auditData.security.headers.map((header, idx) => (
                  <details key={idx} className="group border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <summary className="p-4 cursor-pointer list-none flex items-center justify-between hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        {header.status === 'secure' ? (
                          <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                        ) : header.status === 'danger' ? (
                          <XCircle size={18} className="text-rose-500 flex-shrink-0" />
                        ) : (
                          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
                        )}
                        <span className="font-bold text-slate-800 text-sm truncate">{header.name}</span>
                      </div>
                      <ChevronDown size={18} className="text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 bg-white border-t border-slate-200 text-sm font-mono text-slate-600 break-all">
                      {header.value}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* GDPR External Resources */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <ShieldAlert className="text-rose-500" size={24} />
                <h3 className="text-xl font-black text-slate-900">GDPR Resource Consent</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                      <th className="pb-3 font-bold">External Resource</th>
                      <th className="pb-3 font-bold text-right">Consent Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditData.gdpr.externalResources.map((res, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-bold text-slate-800 text-sm">{res.name}</td>
                        <td className="py-4 text-right">
                          {res.withoutConsent ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                              <XCircle size={12} /> Without Consent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                              <CheckCircle size={12} /> Compliant
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Server & DNS */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <Server className="text-sky-600" size={24} />
                <h3 className="text-xl font-black text-slate-900">DNS & Server Configuration</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
                      <th className="p-4 rounded-tl-xl font-bold">Type</th>
                      <th className="p-4 font-bold">Domain</th>
                      <th className="p-4 font-bold">TTL</th>
                      <th className="p-4 rounded-tr-xl font-bold">Value / Data</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono align-top text-slate-700">
                    {auditData.dns.entries.map((entry, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0">
                        <td className="p-4 font-bold text-indigo-600">{entry.type}</td>
                        <td className="p-4 text-slate-500 truncate max-w-[150px]">{entry.domain}</td>
                        <td className="p-4">{entry.ttl}</td>
                        <td className="p-4 max-w-sm break-all">
                          {entry.value}
                          {entry.note && (
                            <span className="block mt-1 text-xs font-sans text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-md max-w-fit">
                              {entry.note}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* SEO & HTML Vitals inline flex */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm lg:col-span-2 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">HTML Tag Count</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(auditData.html.tagStatistics).map(([tag, count]) => (
                    <div key={tag} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{tag}</span>
                      <span className="font-black text-indigo-600 text-sm">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Meta Vitals</h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
                  <div className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Title Tag</div>
                  <div className="font-bold text-slate-900 truncate">{auditData.seo.title}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
                  <div className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-[10px]">Meta Description</div>
                  <div className={`font-bold ${auditData.seo.metaDescription === 'Not found' ? 'text-rose-500' : 'text-slate-900'} truncate`}>
                    {auditData.seo.metaDescription}
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Premium Actions / Deliverables */}
          <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center max-w-3xl mx-auto shadow-sm">
            <ShieldCheck className="mx-auto text-indigo-500 mb-4" size={48} />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Export Professional Audit Report</h3>
            <p className="text-indigo-800/80 mb-8 max-w-md mx-auto font-medium">
              Generate a custom PDF action plan or export raw JSON data. Uses 1 Premium Credit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleDownloadReport}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-75"
              >
                <Download size={20} />
                Download PDF Report
              </button>
              <button 
                onClick={handleExportData}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 bg-white text-indigo-700 border-2 border-indigo-100 px-6 py-4 rounded-xl font-bold hover:border-indigo-200 hover:bg-slate-50 transition-colors disabled:opacity-75"
              >
                <FileJson size={20} />
                Export Raw JSON
              </button>
            </div>
          </div>
          
        </motion.div>
      )}

      {/* SEO & Marketing Content Footer */}
      <section className="max-w-6xl mx-auto py-16 border-t border-slate-200 mt-16 px-6">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 mb-6">What is the HTTP Security Header Checker Tool?</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            HTTP Header Checker helps you analyze the security headers of a website. Security headers are HTTP response headers that enhance the security of web applications by helping protect against various types of attacks.
          </p>
          
          <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-4">Analyzes Security Headers</h3>
          <p className="text-slate-600 mb-4">It inspects the HTTP response headers of a website to check for the presence and configuration of security headers. These headers include:</p>
          <ul className="space-y-2 mb-8 list-disc pl-6 text-slate-600">
            <li><strong className="text-slate-800">Content-Security-Policy (CSP):</strong> Helps prevent cross-site scripting (XSS) and other code injection attacks;</li>
            <li><strong className="text-slate-800">Strict-Transport-Security (HSTS):</strong> Enforces secure (HTTPS) connections to the server;</li>
            <li><strong className="text-slate-800">X-Frame-Options:</strong> Prevents clickjacking by controlling if the site can be embedded in iframes;</li>
            <li><strong className="text-slate-800">X-Content-Type-Options:</strong> Stops browsers from interpreting files as a different MIME type;</li>
            <li><strong className="text-slate-800">X-XSS-Protection:</strong> Provides basic XSS protection (though it’s often considered obsolete).</li>
          </ul>

          <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-4">Provides Security Scores</h3>
          <p className="text-slate-600 mb-8">The tool generates a score or grade based on the configuration of these security headers. This helps you quickly understand how well your site is protected against common security vulnerabilities.</p>
          
          <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-4">Offers Recommendations</h3>
          <p className="text-slate-600 mb-8">It provides actionable recommendations on how to improve your website’s security headers. This guidance can help you enhance your site’s protection by configuring headers correctly or adding missing headers.</p>
          
          <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-4">Displays Detailed Reports</h3>
          <p className="text-slate-600 mb-4">You receive a detailed report on each security header’s configuration, including the current settings and potential issues. This report helps you understand specific security aspects of your site and how to address them.</p>
          <p className="text-slate-600 mb-12">By using this tool, you can assess your website’s security posture, identify potential vulnerabilities related to security headers, and implement best practices to safeguard your web applications.</p>
          
          <h2 className="text-3xl font-black text-slate-900 mb-6 border-t border-slate-200 pt-12">Which security headers does the check cover?</h2>
          <ul className="space-y-2 mb-12 list-disc pl-6 text-slate-600 font-medium">
            <li>Content-Security-Policy (CSP) including directive audit</li>
            <li>Strict-Transport-Security (HSTS) & max-age</li>
            <li>X-Frame-Options & clickjacking protection</li>
            <li>X-Content-Type-Options & MIME sniffing</li>
            <li>Referrer-Policy & Permissions-Policy</li>
            <li>Cross-Origin headers (COOP, COEP, CORP)</li>
          </ul>

          <h2 className="text-3xl font-black text-slate-900 mb-4 border-t border-slate-200 pt-12">How the HTTP security header check works</h2>
          <h3 className="text-xl font-bold text-indigo-600 mb-6 uppercase tracking-wider text-sm">4 steps to a complete header analysis</h3>
          <div className="space-y-6 mb-12">
            {[
              { num: '1', title: 'Enter the URL', desc: 'Submit your website URL – we analyse any publicly reachable URL with no setup needed.' },
              { num: '2', title: 'Run the header analysis', desc: 'We send requests to your server and log every HTTP response header that comes back.' },
              { num: '3', title: 'Read the rating', desc: 'You see which security headers are set, which are missing and how they should be configured.' },
              { num: '4', title: 'Set headers correctly', desc: 'Apply the recommended values for CSP, HSTS, X-Frame-Options & co. in your web server or framework.' }
            ].map(step => (
              <div key={step.num} className="flex items-start gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg mb-1">{step.title}</h4>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-4 border-t border-slate-200 pt-12">All security headers at a glance</h2>
          <p className="text-slate-600 mb-6 font-medium">Which header protects against what – and how should it be configured?</p>
          <div className="overflow-x-auto my-8 border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-100 uppercase text-xs tracking-widest text-slate-600 border-b border-slate-200">
                  <th className="p-4 font-bold border-r border-slate-200">Header</th>
                  <th className="p-4 font-bold border-r border-slate-200">Protects against</th>
                  <th className="p-4 font-bold">Recommendation</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-100 font-mono text-indigo-600 font-bold">Content-Security-Policy</td><td className="p-4 border-r border-slate-100 text-slate-600">XSS, code injection</td><td className="p-4 font-mono text-slate-700 bg-slate-50">strict CSP with nonces</td></tr>
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-100 font-mono text-indigo-600 font-bold">Strict-Transport-Security</td><td className="p-4 border-r border-slate-100 text-slate-600">protocol downgrade to HTTP</td><td className="p-4 font-mono text-slate-700 bg-slate-50">max-age=31536000; includeSubDomains; preload</td></tr>
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-100 font-mono text-indigo-600 font-bold">X-Frame-Options</td><td className="p-4 border-r border-slate-100 text-slate-600">clickjacking</td><td className="p-4 font-mono text-slate-700 bg-slate-50">DENY / CSP frame-ancestors</td></tr>
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-100 font-mono text-indigo-600 font-bold">X-Content-Type-Options</td><td className="p-4 border-r border-slate-100 text-slate-600">MIME sniffing</td><td className="p-4 font-mono text-slate-700 bg-slate-50">nosniff</td></tr>
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-100 font-mono text-indigo-600 font-bold">Referrer-Policy</td><td className="p-4 border-r border-slate-100 text-slate-600">data leak via Referer</td><td className="p-4 font-mono text-slate-700 bg-slate-50">strict-origin-when-cross-origin</td></tr>
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-100 font-mono text-indigo-600 font-bold">Permissions-Policy</td><td className="p-4 border-r border-slate-100 text-slate-600">browser feature abuse</td><td className="p-4 font-mono text-slate-700 bg-slate-50">restrictive per feature</td></tr>
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-100 font-mono text-indigo-600 font-bold">Cross-Origin-Opener-Policy</td><td className="p-4 border-r border-slate-100 text-slate-600">Spectre, cross-origin leaks</td><td className="p-4 font-mono text-slate-700 bg-slate-50">same-origin</td></tr>
                <tr><td className="p-4 border-r border-slate-100 font-mono text-indigo-600 font-bold">Cross-Origin-Embedder-Policy</td><td className="p-4 border-r border-slate-100 text-slate-600">cross-origin resource leaks</td><td className="p-4 font-mono text-slate-700 bg-slate-50">require-corp</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-6 border-t border-slate-200 pt-12">Harden your website with the HTTP security header checker</h2>
          <p className="text-slate-600 mb-12 leading-relaxed">With the FreelancerKit header check you can see in seconds which security headers are set and where the gaps are. The audit reviews all relevant HTTP response headers against current best practices: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy and the Cross-Origin headers. You instantly see which headers are missing or insecurely configured.</p>
          
          <h2 className="text-3xl font-black text-slate-900 mb-6 border-t border-slate-200 pt-12">HTTP header check – fast, complete and independent</h2>
          <p className="text-slate-600 mb-12 leading-relaxed">Our tool sends a real request to your website and reads every HTTP response header. Unlike static online header scanners, the audit also accounts for dynamic headers that are only set on certain pages and compares the configuration to OWASP and Mozilla recommendations. The result is a concrete to-do list – including example configurations.</p>
          
          <h2 className="text-3xl font-black text-slate-900 mb-4 border-t border-slate-200 pt-12">Thousands of website owners trust FreelancerKit</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-6">The numbers speak for themselves</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { count: '250,000+', label: 'Websites analyzed' },
              { count: '40,000+', label: 'Plugins detected' },
              { count: '35,000+', label: 'Themes detected' }
            ].map(stat => (
              <div key={stat.label} className="text-center border border-slate-200 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl lg:text-5xl font-black text-indigo-600 mb-2">{stat.count}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-4 border-t border-slate-200 pt-12">Frequently asked security header questions</h2>
          <p className="text-slate-600 mb-8 font-medium">Everything you need to know about the security header audit</p>
          
          <div className="space-y-4 mb-24">
            {[
              { q: "How does the security header check work?", a: "FreelancerKit requests your website and reads every HTTP response header the server returns. These are checked against current best practices from OWASP and Mozilla, giving you a clear overview of which headers are set, missing or weakly configured." },
              { q: "Which headers are audited?", a: "We check all critical security headers including CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Cross-Origin policies." },
              { q: "Why are security headers so important?", a: "Security headers protect your visitors from malicious activities like cross-site scripting (XSS), clickjacking, and packet sniffing by instructing the browser on how to handle your website's content securely." },
              { q: "What does a good CSP configuration look like?", a: "A strong CSP denies execution of inline scripts (unless nonced), restricts script and style sources to trusted domains, and blocks mixed content (HTTP resources on HTTPS pages)." },
              { q: "Does the tool detect header conflicts?", a: "Yes, our analysis engine highlights misconfigurations, such as setting conflicting X-Frame-Options and CSP frame-ancestors simultaneously." },
              { q: "Can I export the header audit as a report?", a: "Yes! Use the premium export feature to download a boardroom-ready PDF action plan." }
            ].map((faq, idx) => (
              <details key={idx} className="group p-6 border border-slate-200 rounded-2xl bg-white cursor-pointer hover:border-indigo-200 transition-colors">
                <summary className="font-bold text-lg select-none list-none flex justify-between items-center text-slate-900">
                  {faq.q} 
                  <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pt-4 mt-4 border-t border-slate-100 text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
