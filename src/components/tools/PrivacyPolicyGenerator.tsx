import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, Download, Copy, Check, Info, Briefcase, Globe, AlertCircle, Eye, EyeOff, Upload, Trash2, Palette, CreditCard, Lock } from 'lucide-react';
import UniversalDocumentPreview from '../common/UniversalDocumentPreview';
import { useUser } from '../../contexts/UserContext';
import ReactMarkdown from 'react-markdown';

export default function PrivacyPolicyGenerator({ onPricingClick }: { onPricingClick?: () => void }) {
  const { isPro } = useUser();
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  const [isExporting, setIsExporting] = useState(false);
  
  const [data, setData] = useState({
    businessName: '',
    websiteUrl: '',
    email: '',
    country: 'United States',
    collectsEmail: true,
    collectsNames: true,
    collectsIP: true,
    usesCookies: true,
    thirdPartyAnalytics: true,
    paymentProcessors: false,
    marketingEmails: false,
    socialMediaPixels: false,
    enforceCCPA: false,
    strictGDPR: false,
  });

  const [copiedHTML, setCopiedHTML] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const colors = ['#0f172a', '#0f4c75', '#1b998b', '#6c63ff', '#ff6b6b', '#ea580c', '#10b981'];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const date = new Date().toLocaleDateString();
  const policyMarkdown = `
# PRIVACY POLICY
**Last Updated:** ${date}

---

### 1. INTRODUCTION
Welcome to **${data.businessName || '[Business Name]'}**. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at **${data.email || '[Email]'}**.

### 2. INFORMATION WE COLLECT
We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services.
${data.collectsNames ? '- Names and contact data.' : ''}
${data.collectsEmail ? '- Email addresses.' : ''}
${data.collectsIP ? '- IP addresses and log data.' : ''}
${data.paymentProcessors ? '- Payment information (processed via third-party processors like Stripe/PayPal).' : ''}
${data.marketingEmails ? '- Marketing and communication preferences.' : ''}

### 3. HOW WE USE YOUR INFORMATION
We use personal information collected via our website for a variety of business purposes:
- To facilitate the user experience.
- To send administrative information.
- To fulfill and manage service requests.
${data.thirdPartyAnalytics ? '- To monitor and analyze usage patterns (via Google Analytics/Hotjar).' : ''}
${data.socialMediaPixels ? '- To serve targeted advertisements via Social Media Pixels (Meta/TikTok).' : ''}
${data.marketingEmails ? '- To send marketing and promotional communications.' : ''}

### 4. DO WE USE COOKIES?
${data.usesCookies || data.socialMediaPixels ? 'We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.' : 'We do not use cookies to track user behavior.'}

${data.paymentProcessors ? `
### 5. PAYMENT PROCESSING
We use third-party payment processors (Stripe/PayPal) to handle payment information securely. We do not store your credit card details on our servers.
` : ''}

${data.strictGDPR ? `
### 6. GDPR COMPLIANCE (EU USERS)
The "Data Controller" for your information is **${data.businessName || '[Business Name]'}**, located at our office in **${data.country}**. You have the right to request access, rectification, or erasure of your personal data.
` : ''}

${data.enforceCCPA ? `
### 7. CCPA COMPLIANCE (CALIFORNIA USERS)
Under the California Consumer Privacy Act, users have the right to request disclosure of data categories collected, and the right to "Opt-Out" of the sale of personal information. We do not sell your personal data.
` : ''}

### 8. CONTACT US
Questions? Email us at **${data.email || '[Email]'}** or by post to our office in **${data.country}**.
  `.trim();

  const copyAsHTML = () => {
    const semanticHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Privacy Policy - ${data.businessName || 'Business'}</title>
</head>
<body>
    <article>
        <h1>PRIVACY POLICY</h1>
        <p><strong>Last Updated:</strong> ${date}</p>
        <hr>
        <h2>1. INTRODUCTION</h2>
        <p>Welcome to <strong>${data.businessName || '[Business Name]'}</strong>. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at <a href="mailto:${data.email}">${data.email || '[Email]'}</a>.</p>
        
        <h2>2. INFORMATION WE COLLECT</h2>
        <p>We collect personal information that you voluntarily provide to us:</p>
        <ul>
            ${data.collectsNames ? '<li>Names and contact data.</li>' : ''}
            ${data.collectsEmail ? '<li>Email addresses.</li>' : ''}
            ${data.collectsIP ? '<li>IP addresses and log data.</li>' : ''}
            ${data.paymentProcessors ? '<li>Payment information (via Stripe/PayPal).</li>' : ''}
        </ul>

        <h2>3. HOW WE USE YOUR INFORMATION</h2>
        <ul>
            <li>To facilitate the user experience.</li>
            <li>To fulfill and manage service requests.</li>
            ${data.socialMediaPixels ? '<li>To serve targeted advertisements.</li>' : ''}
        </ul>

        ${data.strictGDPR ? `<h2>4. GDPR RIGHTS</h2><p>As an EU resident, you have rights regarding data access and control.</p>` : ''}
        
        <h2>CONTACT US</h2>
        <p>Email: <a href="mailto:${data.email}">${data.email || '[Email]'}</a></p>
    </article>
</body>
</html>`.trim();
    navigator.clipboard.writeText(semanticHTML);
    setCopiedHTML(true);
    setTimeout(() => setCopiedHTML(false), 2000);
  };

  const copyAsText = () => {
    navigator.clipboard.writeText(policyMarkdown);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rotate-45 translate-x-16 -translate-y-16" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Privacy Architect</h3>
              <p className="text-xs text-slate-400">Generate GDPR-ready policies in seconds.</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Branding Section */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Palette size={14} /> Global Style
              </h4>
              <div className="flex flex-col sm:flex-row gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Logo</label>
                  <div className="flex items-center gap-3">
                    {logo ? (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 w-16 h-12 bg-white">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        <button onClick={() => setLogo(null)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-16 h-12 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-slate-900 transition-colors">
                        <Upload size={12} className="text-slate-400" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Accent Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(c => (
                      <button 
                        key={c} 
                        onClick={() => setPrimaryColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${primaryColor === c ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Business Name</label>
                  <input 
                    type="text" 
                    value={data.businessName || ''}
                    onChange={(e) => setData({...data, businessName: e.target.value})}
                    placeholder="e.g. Acme Creative"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-900 text-sm font-bold"
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Support Email</label>
                  <input 
                    type="email" 
                    value={data.email || ''}
                    onChange={(e) => setData({...data, email: e.target.value})}
                    placeholder="hello@acme.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-900 text-sm font-bold"
                  />
               </div>
               <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Website URL</label>
                  <input 
                    type="text" 
                    value={data.websiteUrl || ''}
                    onChange={(e) => setData({...data, websiteUrl: e.target.value})}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-900 text-sm font-bold"
                  />
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Compliance Checklist</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {[
                       { key: 'collectsEmail', label: 'Email Capture', icon: FileText },
                       { key: 'usesCookies', label: 'Tracking Cookies', icon: Globe },
                       { key: 'thirdPartyAnalytics', label: 'Web Analytics', icon: Briefcase },
                       { key: 'paymentProcessors', label: 'Payment (Stripe/PP)', icon: CreditCard },
                       { key: 'marketingEmails', label: 'Marketing Emails', icon: Shield },
                       { key: 'socialMediaPixels', label: 'Ad Pixels (Meta)', icon: Eye },
                     ].map((item) => (
                       <button 
                        key={item.key}
                        onClick={() => setData({...data, [item.key]: !data[item.key as keyof typeof data]})}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                          data[item.key as keyof typeof data] ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                       >
                          <div className="flex items-center gap-2">
                             <item.icon size={14} className={data[item.key as keyof typeof data] ? 'text-slate-400' : 'text-slate-300'} />
                             <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                          </div>
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Regional Compliance</h4>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-slate-300 transition-all">
                       <span className="text-xs font-bold text-slate-700">Enforce CCPA (California)</span>
                       <input 
                        type="checkbox" 
                        checked={data.enforceCCPA}
                        onChange={(e) => setData({...data, enforceCCPA: e.target.checked})}
                        className="w-4 h-4 rounded accent-slate-900" 
                       />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-slate-300 transition-all">
                       <span className="text-xs font-bold text-slate-700">Strict GDPR (EU Info)</span>
                       <input 
                        type="checkbox" 
                        checked={data.strictGDPR}
                        onChange={(e) => setData({...data, strictGDPR: e.target.checked})}
                        className="w-4 h-4 rounded accent-slate-900" 
                       />
                    </label>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
           <div className="flex gap-4">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-1" />
              <div>
                <h5 className="text-sm font-bold text-amber-900 mb-1">Legal Notice</h5>
                <p className="text-[10px] text-amber-700 leading-relaxed italic">
                  This tool provides a starting template. It is not legal advice. Laws like GDPR, CCPA, and COPPA require specific disclosures tailored to your exact tech stack and location. Have your final document reviewed by a legal professional.
                </p>
              </div>
           </div>
        </div>
      </div>

      <div className="sticky top-24 space-y-6">
        <UniversalDocumentPreview
          isLoading={isExporting}
          documentName={`PrivacyPolicy_${data.businessName || 'Business'}`}
          onExportStart={() => setIsExporting(true)}
          onExportEnd={() => setIsExporting(false)}
          primaryColor={primaryColor}
          hideControls={true}
          extraActions={
            <div className="flex items-center gap-2">
              <button 
                onClick={copyAsHTML}
                className="flex items-center gap-2 py-2 px-4 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                {copiedHTML ? <Check size={14} className="text-success" /> : <Palette size={14} />}
                {copiedHTML ? 'Copied' : 'Copy HTML'}
              </button>
              <button 
                onClick={copyAsText}
                className="flex items-center gap-2 py-2 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                {copiedText ? <Check size={14} className="text-success" /> : <FileText size={14} />}
                {copiedText ? 'Copied' : 'Copy Text'}
              </button>
            </div>
          }
        >
          <div className="flex flex-col font-sans text-slate-800 h-full">
            <div className="flex justify-between items-start mb-12 border-b-2 pb-8" style={{ borderBottomColor: primaryColor }}>
              <div>
                {logo ? (
                  <img src={logo} alt="Logo" className="h-10 mb-4 object-contain" />
                ) : (
                  <div className="text-xl font-black tracking-tighter mb-2" style={{ color: primaryColor }}>PRIVACY POLICY</div>
                )}
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{data.businessName || 'Business Entity'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Effective Date</p>
                <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none flex-grow">
              <ReactMarkdown>{policyMarkdown}</ReactMarkdown>
            </div>

            <div className="mt-12 text-center text-[8px] text-slate-400 font-sans tracking-widest uppercase italic opacity-50">
               FreelancerKit.io Standard Compliance Template
            </div>
          </div>
        </UniversalDocumentPreview>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Globe size={16} />
                 </div>
                 <div>
                    <h5 className="text-xs font-bold">Live Hosted Policy</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Your legal URL is ready.</p>
                 </div>
              </div>
              {!isPro && (
                <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-widest">
                  <Lock size={10} /> Pro
                </span>
              )}
           </div>

           <div className="group relative">
              <div className={`flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl ${!isPro ? 'opacity-50 blur-[2px]' : ''}`}>
                 <span className="text-[10px] font-mono text-slate-400">freelancerkit.io/legal/${data.businessName?.toLowerCase().replace(/\s+/g, '-') || 'your-company'}</span>
              </div>
              {!isPro && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => onPricingClick?.()}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Lock size={12} /> Unlock Hosting
                    </button>
                 </div>
              )}
           </div>

           <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <p className="text-[9px] text-slate-400 font-medium italic">Hosted policies update automatically as you edit.</p>
              <button 
                disabled={!isPro}
                className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest"
              >
                Publish to Web
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
