import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Layout, 
  Palette, 
  Building2, 
  Link as LinkIcon, 
  Chrome, 
  Facebook, 
  Code2, 
  Copy, 
  Check, 
  Zap,
  Globe,
  Monitor,
  Moon,
  Sun,
  ChevronRight,
  Eye
} from 'lucide-react';

type ComplianceType = 'GDPR' | 'CCPA' | 'GLOBAL';
type LayoutType = 'BANNER' | 'MODAL';
type ThemeType = 'LIGHT' | 'DARK';

export default function CookieConsent() {
  const [compliance, setCompliance] = useState<ComplianceType>('GDPR');
  const [layout, setLayout] = useState<LayoutType>('BANNER');
  const [theme, setTheme] = useState<ThemeType>('LIGHT');
  const [companyName, setCompanyName] = useState('Acme Corp');
  const [privacyUrl, setPrivacyUrl] = useState('https://example.com/privacy');
  const [useGA, setUseGA] = useState(true);
  const [gaId, setGaId] = useState('G-XXXXXXXXXX');
  const [usePixel, setUsePixel] = useState(false);
  const [pixelId, setPixelId] = useState('123456789');
  
  const [activeTab, setActiveTab] = useState<'HTML' | 'CSS' | 'JS'>('HTML');
  const [copied, setCopied] = useState<string | null>(null);

  const [generatedCode, setGeneratedCode] = useState({
    html: '',
    css: '',
    js: ''
  });

  useEffect(() => {
    // HTML Generation
    const html = `
<!-- Cookie Consent Banner -->
<div id="cookie-consent-container" class="cc-hidden">
  <div id="cookie-consent-banner" class="cc-${layout.toLowerCase()} cc-${theme.toLowerCase()}">
    <div class="cc-content">
      <h3>Cookie Consent</h3>
      <p>
        We use cookies to improve your experience on <strong>${companyName}</strong>. 
        ${compliance === 'GDPR' ? 'By clicking "Accept All", you consent to our use of all cookies.' : 'You can opt-out of data sale at any time.'} 
        View our <a href="${privacyUrl}" target="_blank">Privacy Policy</a> for details.
      </p>
    </div>
    <div class="cc-actions">
      ${compliance === 'CCPA' ? '<button id="cc-opt-out" class="cc-btn-secondary">Do Not Sell</button>' : ''}
      <button id="cc-reject" class="cc-btn-secondary">Reject All</button>
      <button id="cc-accept" class="cc-btn-primary">Accept All</button>
    </div>
  </div>
</div>`.trim();

    // CSS Generation
    const css = `
/* Cookie Consent Styles */
#cookie-consent-container.cc-hidden { display: none; }
#cookie-consent-container {
  position: fixed;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
#cookie-consent-banner {
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  transition: all 0.3s ease;
}
.cc-banner { bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 800px !important; flex-direction: row !important; align-items: center; justify-content: space-between; border-radius: 12px; }
.cc-modal { bottom: 24px; left: 24px; border-radius: 20px; }

.cc-light { background: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; }
.cc-dark { background: #0f172a; color: #f1f5f9; border: 1px solid #334155; }

.cc-content h3 { margin: 0 0 4px 0; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.cc-content p { margin: 0; font-size: 13px; line-height: 1.5; opacity: 0.8; }
.cc-content a { color: inherit; text-decoration: underline; }

.cc-actions { display: flex; gap: 8px; flex-shrink: 0; }
.cc-btn-primary, .cc-btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.cc-btn-primary { background: #10b981; color: white; }
.cc-btn-primary:hover { background: #059669; }
.cc-btn-secondary { background: rgba(148, 163, 184, 0.1); color: inherit; }
.cc-btn-secondary:hover { background: rgba(148, 163, 184, 0.2); }

@media (max-width: 768px) {
  .cc-banner { flex-direction: column !important; align-items: flex-start; bottom: 0; left: 0; width: 100%; transform: none; border-radius: 0; }
}`.trim();

    // JS Generation
    const js = `
(function() {
  const CONSENT_KEY = 'user-cookie-consent';
  const TYPE = '${compliance}'; // GDPR, CCPA, GLOBAL
  const GA_ID = '${useGA ? gaId : ''}';
  const PIXEL_ID = '${usePixel ? pixelId : ''}';

  const container = document.getElementById('cookie-consent-container');
  const btnAccept = document.getElementById('cc-accept');
  const btnReject = document.getElementById('cc-reject');
  const btnOptOut = document.getElementById('cc-opt-out');

  function initTracking() {
    console.log('Consent granted: Initializing tracking tags...');
    
    if (GA_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA_ID);
    }
    
    if (PIXEL_ID) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', PIXEL_ID);
      fbq('track', 'PageView');
    }
  }

  function handleConsent(choice) {
    localStorage.setItem(CONSENT_KEY, choice);
    container.classList.add('cc-hidden');
    if (choice === 'accept') initTracking();
  }

  // Initial Logic
  const savedConsent = localStorage.getItem(CONSENT_KEY);

  if (savedConsent === 'accept') {
    initTracking();
  } else if (!savedConsent) {
    if (TYPE === 'CCPA' || TYPE === 'GLOBAL') {
      // CCPA optimization: Fire immediately, but allow opt-out
      initTracking();
    }
    container.classList.remove('cc-hidden');
  }

  btnAccept.addEventListener('click', () => handleConsent('accept'));
  btnReject.addEventListener('click', () => handleConsent('reject'));
  if (btnOptOut) {
    btnOptOut.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'opt-out');
      location.reload(); // Hard opt-out for simplicity
    });
  }
})();`.trim();

    setGeneratedCode({ html, css, js });
  }, [compliance, layout, theme, companyName, privacyUrl, useGA, gaId, usePixel, pixelId]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyProposal = () => {
    const text = `Hi [Name], I was running an audit and noticed your website fires tracking cookies before securing user consent—this is currently a violation of ${compliance} guidelines and carries heavy fines. Instead of installing a bloated monthly plugin that slows down your SEO, I can hard-code a custom, lightweight compliance manager for a flat fee of $350. Let me know if you want me to deploy this today.`;
    navigator.clipboard.writeText(text);
    setCopied('proposal');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
            <ShieldAlert size={14} /> Legal Compliance
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Cookie Consent Manager</h2>
          <p className="text-slate-500 text-sm max-w-xl">
            Generate lightweight, high-performance cookie consent banners that respect GDPR/CCPA regulations without slowing down your site.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
            
            {/* Region Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe size={14} /> Compliance Region
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(['GDPR', 'CCPA', 'GLOBAL'] as ComplianceType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCompliance(type)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                      compliance === type 
                        ? 'bg-white text-emerald-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout & Theme */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layout size={14} /> UI Layout
                </label>
                <div className="flex flex-col gap-2">
                  {(['BANNER', 'MODAL'] as LayoutType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setLayout(t)}
                      className={`py-3 px-4 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        layout === t 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={14} /> Theme
                </label>
                <div className="flex flex-col gap-2">
                   {(['LIGHT', 'DARK'] as ThemeType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`py-3 px-4 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        theme === t 
                          ? 'border-slate-900 bg-slate-900 text-white' 
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {t === 'LIGHT' ? <Sun size={12} /> : <Moon size={12} />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={12} /> Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xs font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon size={12} /> Privacy Policy URL
                </label>
                <input
                  type="text"
                  value={privacyUrl}
                  onChange={(e) => setPrivacyUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xs font-mono"
                />
              </div>
            </div>

            {/* Third-party Scripts */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Managers</label>
               
               <div className="space-y-3">
                 <div className="space-y-2">
                   <button 
                    onClick={() => setUseGA(!useGA)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${useGA ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50'}`}
                   >
                     <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight">
                       <Chrome size={14} className={useGA ? 'text-emerald-500' : 'text-slate-300'} /> Google Analytics
                     </span>
                     <div className={`w-8 h-4 rounded-full relative ${useGA ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                       <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${useGA ? 'right-0.5' : 'left-0.5'}`} />
                     </div>
                   </button>
                   {useGA && (
                     <motion.input
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       type="text"
                       placeholder="G-XXXXXXX"
                       value={gaId}
                       onChange={(e) => setGaId(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono outline-none focus:border-emerald-500"
                     />
                   )}
                 </div>

                 <div className="space-y-2">
                   <button 
                    onClick={() => setUsePixel(!usePixel)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${usePixel ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50'}`}
                   >
                     <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight">
                       <Facebook size={14} className={usePixel ? 'text-emerald-500' : 'text-slate-300'} /> Meta Pixel
                     </span>
                     <div className={`w-8 h-4 rounded-full relative ${usePixel ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                       <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${usePixel ? 'right-0.5' : 'left-0.5'}`} />
                     </div>
                   </button>
                   {usePixel && (
                     <motion.input
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       type="text"
                       placeholder="Pixel ID"
                       value={pixelId}
                       onChange={(e) => setPixelId(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono outline-none focus:border-emerald-500"
                     />
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Preview & Code */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Preview Wrapper */}
          <div className="bg-slate-50 rounded-[2.5rem] p-12 border-2 border-dashed border-slate-200 relative min-h-[400px] flex items-center justify-center overflow-hidden">
            <div className="absolute top-6 left-6 text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Eye size={12} /> Live Render Preview
            </div>

            <div className="text-center space-y-4 opacity-10">
              <Monitor size={120} className="mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Website Content</p>
            </div>

            {/* The Actual Preview Element */}
            <div className={`absolute transition-all duration-500 ${
              layout === 'BANNER' 
                ? 'bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl' 
                : 'bottom-8 left-8 w-80'
            }`}>
              <div className={`p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border transition-colors duration-500 ${
                theme === 'LIGHT' ? 'bg-white text-slate-900 border-slate-100' : 'bg-slate-900 text-white border-slate-800'
              } ${layout === 'BANNER' ? 'md:flex-row md:items-center md:justify-between' : ''}`}>
                <div className="space-y-2 max-w-lg">
                  <h4 className="text-xs font-black uppercase tracking-widest">Privacy Consent</h4>
                  <p className="text-[10px] leading-relaxed opacity-70">
                    We use cookies on <strong>{companyName}</strong> to optimize performance. 
                    {compliance === 'GDPR' ? 'By clicking "Accept All", you consent to our use of all cookies.' : 'You can opt-out of data sale below.'}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                   <div className="px-4 py-2 rounded-lg bg-slate-500/10 text-[10px] font-bold uppercase cursor-not-allowed">Reject</div>
                   <div className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-[10px] font-bold uppercase cursor-not-allowed">Accept All</div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Tabs Section */}
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-8 py-4 bg-slate-800">
              <div className="flex gap-4">
                {(['HTML', 'CSS', 'JS'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handleCopy(generatedCode[activeTab.toLowerCase() as keyof typeof generatedCode], activeTab)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied === activeTab ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied === activeTab ? 'Copied!' : `Copy ${activeTab}`}
              </button>
            </div>

            <div className="p-8 font-mono text-xs overflow-x-auto">
              <pre className="text-slate-300 leading-relaxed">
                {activeTab === 'HTML' && (
                  <code dangerouslySetInnerHTML={{ __html: generatedCode.html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '<span class="text-emerald-400">"</span>').replace(/(cc-[a-z-]+)/g, '<span class="text-blue-400">$1</span>') }} />
                )}
                {activeTab === 'CSS' && (
                  <code dangerouslySetInnerHTML={{ __html: generatedCode.css.replace(/([a-z-]+):/g, '<span class="text-emerald-400">$1</span>:').replace(/(\.[a-z-]+)/g, '<span class="text-orange-400">$1</span>') }} />
                )}
                {activeTab === 'JS' && (
                  <code dangerouslySetInnerHTML={{ __html: generatedCode.js.replace(/(const|let|function|if|else|return|document|window)/g, '<span class="text-blue-400">$1</span>').replace(/'(.*?)'/g, '<span class="text-emerald-300">\'$1\'</span>') }} />
                )}
              </pre>
            </div>
          </div>

          {/* Sales Piece */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
              <ShieldAlert size={80} className="text-emerald-400" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  <Zap size={14} /> Compliance Sales Kit
                </div>
                <h4 className="text-xl font-black italic uppercase tracking-tight">Protect Clients from $20M+ Fines</h4>
                <p className="text-slate-400 text-xs italic">Position custom compliance as a lightweight, performance-first alternative to heavy monthly plugins.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Hi [Name], I was running an audit and noticed your website fires tracking cookies before securing user consent—this is currently a violation of {compliance} guidelines..."
                </p>
                <div className="absolute -top-2 left-6 px-2 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded">The Script</div>
              </div>

              <button 
                onClick={handleCopyProposal}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  copied === 'proposal' 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-white text-slate-900 hover:bg-emerald-50 shadow-lg'
                }`}
              >
                {copied === 'proposal' ? <Check size={16} /> : <Copy size={16} />}
                {copied === 'proposal' ? 'Proposal Copied!' : 'Copy Proposal Script'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
