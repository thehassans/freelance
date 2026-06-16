import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, Download, Copy, Check, Info, Briefcase, Globe, AlertCircle, Eye, EyeOff, Upload, Trash2, Palette, CreditCard, Lock, ChevronDown, ChevronUp, HelpCircle, ArrowLeft, Scale, Server, Clock } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import ReactMarkdown from 'react-markdown';

const seoFaqItems = [
  {
    question: "Why does my website need a privacy policy?",
    answer: "Privacy policies are legally required by privacy laws globally if you collect any personal data, including IP addresses, names, or emails. They protect your business from fines and build user trust."
  },
  {
    question: "What is the difference between GDPR and CCPA?",
    answer: "GDPR is a European law focusing on the legal basis for processing data and user consent. CCPA is a California law heavily focused on the consumer's right to know what data is collected and the right to opt-out of its sale."
  },
  {
    question: "Do I need a policy if I only collect email addresses for a newsletter?",
    answer: "Yes. An email address is considered Personally Identifiable Information (PII) under almost all major global privacy frameworks."
  },
  {
    question: "How often should I update my privacy policy?",
    answer: "It should be reviewed annually or whenever you integrate new third-party software, change your data collection methods, or when major international data laws are updated."
  },
  {
    question: "Can I just copy another website's privacy policy?",
    answer: "No. Copying another policy is copyright infringement and, more importantly, it will not accurately reflect your specific business practices, leaving you legally exposed."
  },
  {
    question: "How do I implement the exported HTML?",
    answer: "You can copy the generated HTML directly from our previewer and paste it into any standard CMS (like WordPress, Shopify, or Webflow) using a custom HTML block or source code editor."
  }
];

export default function PrivacyPolicyGenerator({ onPricingClick }: { onPricingClick?: () => void }) {
  const { isPro } = useUser();
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [credits, setCredits] = useState(25);
  const [creditError, setCreditError] = useState<string | null>(null);
  const [creditSuccess, setCreditSuccess] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const handleGeneratePolicy = () => {
    if (credits >= 5) {
      setCredits(prev => prev - 5);
      setCreditSuccess('5 Credits Used');
      setCreditError(null);
      setTimeout(() => setCreditSuccess(null), 3000);
      setViewMode('preview');
    } else {
      setCreditError('Insufficient credits. Please upgrade to Pro to generate more policies.');
    }
  };

  const handleExportPDF = () => {
    if (credits >= 1) {
      setCredits(prev => prev - 1);
      setCreditSuccess('1 Credit Used for PDF Export');
      setCreditError(null);
      setTimeout(() => setCreditSuccess(null), 3000);
      setTimeout(() => {
        window.print();
      }, 150);
    } else {
      setCreditError('Insufficient credits. Cannot export PDF. Please upgrade to Pro.');
    }
  };

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
    enforceGDPR: false,
    enforceCCPA: false,
    enforcePIPEDA: false,
    enforceLGPD: false,
    enableERP: false,
    enableChildrenPrivacy: false,
    minAge: '13',
    dataRetentionPeriod: 'As long as necessary to fulfill the purposes outlined',
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
Welcome to **${data.businessName || '[Business Name]'}** ("we", "our", "us"). We operate the website **${data.websiteUrl || '[Website URL]'}** (the "Service"). We are committed to protecting your personal information and your right to privacy under global compliance frameworks. If you have any questions or concerns about this policy or our practices regarding your personal information, please contact us at **${data.email || '[Email Address]'}**.

### 2. INFORMATION WE COLLECT
We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services, or when participating in activities on our Service.
${data.collectsNames ? '- **Personal Identifiers**: Names and contact data.' : ''}
${data.collectsEmail ? '- **Contact Details**: Email addresses.' : ''}
${data.collectsIP ? '- **Technical Log Data**: IP addresses, browser specifications, and device metadata.' : ''}
${data.paymentProcessors ? '- **Payment Information**: Financial payment fields (transactions are securely processed directly via certified third-party payment gateways like Stripe or PayPal and never stored on our local infrastructure).' : ''}
${data.marketingEmails ? '- **Communication Preferences**: Newsletter enrollments and marketing selections.' : ''}

### 3. HOW WE USE YOUR INFORMATION
We process your personal information for distinct, lawful business purposes, including:
- To facilitate, optimize, and secure your user experience.
- To send administrative alerts, order receipts, and system updates.
- To fulfill and manage service requests and contracts.
${data.thirdPartyAnalytics ? '- To monitor usage patterns and run statistical analysis (via tools like Google Analytics).' : ''}
${data.socialMediaPixels ? '- To deploy marketing campaigns and track conversion performance via Social Media Pixels (e.g., Meta/TikTok).' : ''}
${data.marketingEmails ? '- To dispatch curated newsletters and exclusive promotional updates.' : ''}

### 4. DO WE USE COOKIES AND TRACKING TECHNOLOGIES?
${data.usesCookies || data.socialMediaPixels ? 'We use cookies, web beacons, and advanced tracking pixels to recognize your browser, enhance site navigation, and personalize marketing campaigns.' : 'We do not utilize tracking cookies on our Service.'}

${data.paymentProcessors ? `
### 5. PAYMENT SECURE PROCESSING
We rely on third-party payment processors (such as Stripe or PayPal) to oversee compliance-regulated payments. We do not store or process payment card numbers directly on our servers.
` : ''}

${data.enableERP ? `
### 6. ENTERPRISE & BACKEND COOPERATIVE RECIPIENTS (ERP/INVENTORY)
We disclose that customer personal data, purchase records, and order histories are systematically shared and synchronized between our primary storefront and third-party backend enterprise resource planning (ERP) or integrated inventory management systems for fulfillment, logistics coordination, and operational analytics.
` : ''}

${data.enableChildrenPrivacy ? `
### 7. CHILDREN'S PRIVACY COMPLIANCE (COPPA)
We do not knowingly solicit or collect personal data from minors under the age of **${data.minAge || '13'}**. If we discover that personal information has been collected from a child under this threshold, we will immediately execute data deletion protocols to purge all associated records from our active databases.
` : ''}

### 8. DATA RETENTION POLICY
We retain your personal data only for a period of **${data.dataRetentionPeriod || 'as long as necessary to fulfill the purposes outlined'}** or as required to comply with our statutory legal obligations.

${(data.enforceGDPR || data.enforceCCPA || data.enforcePIPEDA || data.enforceLGPD) ? `
### 9. REGIONAL & INTERNATIONAL COMPLIANCE DISCLOSURES

${data.enforceGDPR ? `
#### GENERAL DATA PROTECTION REGULATION (GDPR) - EUROPE & UNITED KINGDOM
The designated Data Controller is **${data.businessName || '[Business Name]'}** located in **${data.country}**. EEA or UK residents have statutory rights to:
- Access, rectify, or purge your personal data (**Right to be Forgotten**).
- Restrict or object to active profiling.
- Transfer records to alternative providers (**Data Portability**).
` : ''}

${data.enforceCCPA ? `
#### CALIFORNIA CONSUMER PRIVACY ACT (CCPA/CPRA)
Under the CCPA/CPRA, California residents are entitled to distinct protections:
- **Right to Know**: Comprehensive category details of personal data harvested.
- **Right to Opt-Out**: Strict choice to prevent the sale or sharing of user records (**Do Not Sell My Personal Information**). We do not sell user data.
- **Right to Limit**: Restrict use of sensitive personal information.
` : ''}

${data.enforcePIPEDA ? `
#### PERSONAL INFORMATION PROTECTION AND ELECTRONIC DOCUMENTS ACT (PIPEDA) - CANADA
In compliance with PIPEDA, we adhere strictly to the ten fair information principles, ensuring Canadian users possess absolute tracking transparency, limited data harvesting, and the ability to challenge our organizational compliance protocols.
` : ''}

${data.enforceLGPD ? `
#### LEI GERAL DE PROTEÇÃO DE DADOS (LGPD) - BRAZIL
Under the Brazilian General Data Protection Law (LGPD), users hold rights to verify data processing, inspect records, rectify incorrect information, or request the complete anonymity and removal of surplus data.
` : ''}
` : ''}

### 10. CONTACT INFORMATION
For questions, rectifications, or legal audits regarding this policy, please email our security officer at **${data.email || '[Email]'}** or send traditional post to our corporate office located in **${data.country}**.
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
        <p>Welcome to <strong>${data.businessName || '[Business Name]'}</strong>. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this policy or our practices regarding your personal information, please contact us at <a href="mailto:${data.email}">${data.email || '[Email Address]'}</a>.</p>
        
        <h2>2. INFORMATION WE COLLECT</h2>
        <p>We collect personal information that you voluntarily provide to us:</p>
        <ul>
            ${data.collectsNames ? '<li><strong>Names and contact data</strong></li>' : ''}
            ${data.collectsEmail ? '<li><strong>Email addresses</strong></li>' : ''}
            ${data.collectsIP ? '<li><strong>IP addresses and device specifications</strong></li>' : ''}
            ${data.paymentProcessors ? '<li><strong>Payment Information (Stripe/PayPal transactions)</strong></li>' : ''}
        </ul>

        <h2>3. HOW WE USE YOUR INFORMATION</h2>
        <ul>
            <li>To facilitate customer user experience.</li>
            <li>To manage administrative and service requests.</li>
            ${data.thirdPartyAnalytics ? '<li>To run statistical analytics.</li>' : ''}
            ${data.socialMediaPixels ? '<li>To serve promotional ads.</li>' : ''}
        </ul>

        ${data.usesCookies || data.socialMediaPixels ? `
        <h2>4. COOKIES AND COOKIE TRACKING</h2>
        <p>We utilize cookies and tracking technologies to optimize layout navigation and ad targeting.</p>
        ` : ''}

        ${data.enableERP ? `
        <h2>5. ENTERPRISE AND BACKEND DATA RECIPIENTS (ERP/INVENTORY)</h2>
        <p>Customer details are synchronized between our primary storefront and backend enterprise resource planning (ERP) systems for inventory and fulfillment management.</p>
        ` : ''}

        ${data.enableChildrenPrivacy ? `
        <h2>6. CHILDREN'S PRIVACY COMPLIANCE (COPPA)</h2>
        <p>We do not collect personal data from minors under age ${data.minAge || '13'}. Data deletion protocols are executed upon discovery of records.</p>
        ` : ''}

        <h2>7. DATA RETENTION</h2>
        <p>We retain data for ${data.dataRetentionPeriod} in accordance with our operations and safety regulations.</p>

        ${(data.enforceGDPR || data.enforceCCPA || data.enforcePIPEDA || data.enforceLGPD) ? `
        <h2>8. INTERNATIONAL REGULATORY COMPLIANCE</h2>
        ${data.enforceGDPR ? '<p><strong>GDPR / EEA Consent:</strong> EU and UK residents possess statutory access, rectification, and right to be forgotten erasures.</p>' : ''}
        ${data.enforceCCPA ? '<p><strong>CCPA / CPRA California Protected Limits:</strong> California users possess the right to limit profiling or request the absolute restriction of record resale (Do Not Sell My Personal Information).</p>' : ''}
        ${data.enforcePIPEDA ? '<p><strong>PIPEDA Canada Principles:</strong> Canadian users can audit and verify data management practices.</p>' : ''}
        ${data.enforceLGPD ? '<p><strong>LGPD Brazil Principles:</strong> Brazilian users have rights to confirm, access, correct, or anonymize processing parameters.</p>' : ''}
        ` : ''}

        <h2>9. CONTACT US</h2>
        <p>Email: <a href="mailto:${data.email}">${data.email || '[Email Address]'}</a></p>
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
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {viewMode === 'edit' ? (
          <motion.div 
            key="edit-mode-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto space-y-6 text-start"
          >
            {/* Header / Intro Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rotate-45 translate-x-16 -translate-y-16" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Privacy Architect</h3>
                    <p className="text-xs text-slate-400">Configure global stylesheets and advanced enterprise compliance parameters.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-100/50 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
                  <div className="w-2 h-2 rounded-full bg-[#6c63ff] animate-pulse" />
                  <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">Credits:</span>
                  <span className="text-[#6c63ff] text-xs font-black">{credits}</span>
                </div>
              </div>

              {/* Form elements full width */}
              <div className="space-y-6 relative z-10">
                {/* Global Style branding block */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Palette size={14} /> Global Style Settings
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

                {/* Essential Business Information inputs */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Essential Business Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Business Name</label>
                      <input 
                        type="text" 
                        value={data.businessName || ''}
                        onChange={(e) => setData({...data, businessName: e.target.value})}
                        placeholder="e.g. Acme Agency LLC"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded-xl focus:outline-none text-sm font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Support Email</label>
                      <input 
                        type="email" 
                        value={data.email || ''}
                        onChange={(e) => setData({...data, email: e.target.value})}
                        placeholder="hello@acme.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded-xl focus:outline-none text-sm font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Website URL</label>
                      <input 
                        type="text" 
                        value={data.websiteUrl || ''}
                        onChange={(e) => setData({...data, websiteUrl: e.target.value})}
                        placeholder="https://yourportfolio.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded-xl focus:outline-none text-sm font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Jurisdictional Country</label>
                      <input 
                        type="text" 
                        value={data.country || ''}
                        onChange={(e) => setData({...data, country: e.target.value})}
                        placeholder="e.g. United States"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded-xl focus:outline-none text-sm font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Collection Points Checklist */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Essential Data Collection Points</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'collectsEmail', label: 'Email Capture', icon: FileText, desc: 'We capture subscriber newsletters emails' },
                      { key: 'usesCookies', label: 'Tracking Cookies', icon: Globe, desc: 'We utilize state cookies tracker' },
                      { key: 'thirdPartyAnalytics', label: 'Web Analytics', icon: Briefcase, desc: 'Google Analytics or other systems active' },
                      { key: 'paymentProcessors', label: 'Payment Integration', icon: CreditCard, desc: 'Stripe or PayPal transactions processing' },
                      { key: 'marketingEmails', label: 'Marketing Campaigns Emails', icon: Shield, desc: 'We dispatch marketing emails notifications' },
                      { key: 'socialMediaPixels', label: 'Ad Pixels tracking', icon: Eye, desc: 'Meta, TikTok, or LinkedIn active' },
                    ].map((item) => {
                      const isActive = data[item.key as keyof typeof data];
                      return (
                        <button 
                          type="button"
                          key={item.key}
                          onClick={() => setData({...data, [item.key]: !data[item.key as keyof typeof data]})}
                          className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 group ${
                            isActive ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <item.icon size={16} className={`shrink-0 mt-0.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                            <span className={`block text-[9px] mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>{item.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Enterprise & International Compliance categories toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Category A: International Frameworks */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Globe size={13} className="text-indigo-500" /> International Frameworks
                    </h5>
                    <div className="space-y-2">
                      {[
                        { key: 'enforceGDPR', label: 'GDPR / UK Protection', desc: 'Europe/UK standard policies' },
                        { key: 'enforceCCPA', label: 'CCPA / CPRA California', desc: 'Opt-Out & Do Not Sell terms' },
                        { key: 'enforcePIPEDA', label: 'PIPEDA compliance (Canada)', desc: '10 Privacy Principles of consent' },
                        { key: 'enforceLGPD', label: 'LGPD Compliance (Brazil)', desc: 'Brazilian global rights rules' },
                      ].map((item) => (
                        <label 
                          key={item.key} 
                          className="flex items-start justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-all gap-4"
                        >
                          <div className="space-y-0.5 text-left">
                            <span className="block text-xs font-bold text-slate-800">{item.label}</span>
                            <span className="block text-[9px] text-slate-400 font-medium">{item.desc}</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={data[item.key as keyof typeof data] as boolean}
                            onChange={(e) => setData({...data, [item.key]: e.target.checked})}
                            className="w-4.5 h-4.5 rounded accent-slate-900 mt-1" 
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category B: ERP, Children Privacy and Retention */}
                  <div className="space-y-6">
                    {/* ERP systems integrations */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Server size={13} className="text-indigo-500" /> Data Processing & ERP Systems
                      </h5>
                      <label className="flex items-start justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-all gap-4">
                        <div className="space-y-0.5 text-left">
                          <span className="block text-xs font-bold text-slate-800">E-Commerce & Backend Systems</span>
                          <span className="block text-[9px] text-slate-400 leading-relaxed font-medium">
                            Disclose order history & user data sync with ERPs / inventory systems.
                          </span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={data.enableERP}
                          onChange={(e) => setData({...data, enableERP: e.target.checked})}
                          className="w-4.5 h-4.5 rounded accent-slate-900 mt-1" 
                        />
                      </label>
                    </div>

                    {/* Children Privacy */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Info size={13} className="text-indigo-500" /> Age Restrictions
                      </h5>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-xs font-bold text-slate-800">Children's Privacy (COPPA)</span>
                          <input 
                            type="checkbox" 
                            checked={data.enableChildrenPrivacy}
                            onChange={(e) => setData({...data, enableChildrenPrivacy: e.target.checked})}
                            className="w-4 h-4 rounded accent-slate-900" 
                          />
                        </label>
                        {data.enableChildrenPrivacy && (
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Minimum Site User Age</label>
                            <select 
                              value={data.minAge} 
                              onChange={(e) => setData({...data, minAge: e.target.value})}
                              className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                            >
                              <option value="13">Under 13 years old</option>
                              <option value="16">Under 16 years old</option>
                              <option value="18">Under 18 years old</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Retention */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Clock size={13} className="text-indigo-500" /> Data Retention Settings
                  </h5>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-left">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Storage Retention Period</label>
                    <select
                      value={data.dataRetentionPeriod}
                      onChange={(e) => setData({...data, dataRetentionPeriod: e.target.value})}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                    >
                      <option value="30 Days">30 Days</option>
                      <option value="90 Days">90 Days</option>
                      <option value="1 Year">1 Year</option>
                      <option value="2 Years">2 Years</option>
                      <option value="As long as necessary to fulfill the purposes outlined">As long as necessary to fulfill the purposes outlined</option>
                    </select>
                  </div>
                </div>

                {/* Legal Warning Alert */}
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mt-4 text-left">
                  <div className="flex gap-4">
                    <AlertCircle size={18} className="text-amber-600 shrink-0 mt-1" />
                    <div>
                      <h5 className="text-sm font-bold text-amber-900 mb-1">Commercial Legal Warning</h5>
                      <p className="text-[10px] text-amber-700 leading-relaxed italic">
                        This generator templates do not establish legal consultation contracts. Regulations like GDPR (EU 2016/679) and CCPA require verified technical assessments based on precise hosting nodes, server trackers, and processing logs. Validate finalized policies through qualified legal counsel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Prompt bottom bar footer */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 px-6 sm:px-12 flex flex-col z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] -mx-4 sm:-mx-8 rounded-t-3xl sticky-footer-prompt gap-3">
              {creditError && (
                <div className="w-full text-center py-2.5 px-4 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-100 flex items-center justify-center gap-2">
                  <AlertCircle size={14} /> {creditError}
                </div>
              )}
              {creditSuccess && (
                <div className="w-full text-center py-2.5 px-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 flex items-center justify-center gap-2">
                  <Check size={14} className="text-emerald-600" /> {creditSuccess}
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">READY TO PREVIEW POLICY?</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-indigo-50 text-[#6c63ff] border border-indigo-100/50 rounded-lg">Cost: 5 Credits</span>
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePolicy}
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Review Privacy Policy →
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview-mode-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto space-y-6 text-start"
          >
            {/* Sticky Action Toolbar at top */}
            <div className="sticky top-0 z-35 flex flex-col gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg mb-2 sticky-toolbar no-print">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                      LIVE PREVIEW
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider leading-none">Credits:</span>
                    <span className="text-[#6c63ff] text-xs font-black leading-none">{credits}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setViewMode('edit')}
                    className="flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <ArrowLeft size={12} /> Back to Edit
                  </button>
                  <button 
                    onClick={copyAsHTML}
                    className="flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    {copiedHTML ? <Check size={12} className="text-emerald-500" /> : <Palette size={12} />}
                    {copiedHTML ? 'Copied' : 'Copy HTML'}
                  </button>
                  <button 
                    onClick={copyAsText}
                    className="flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    {copiedText ? <Check size={12} className="text-emerald-500" /> : <FileText size={12} />}
                    {copiedText ? 'Copied' : 'Copy Text'}
                  </button>
                  <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:scale-[1.01] cursor-pointer"
                  >
                    <Download size={12} /> Get PDF (1 Credit)
                  </button>
                </div>
              </div>

              {(creditError || creditSuccess) && (
                <div className="w-full border-t border-slate-100 pt-2 flex flex-col gap-2">
                  {creditError && (
                    <div className="w-full text-center py-2 px-4 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-100 flex items-center justify-center gap-2">
                      <AlertCircle size={14} /> {creditError}
                    </div>
                  )}
                  {creditSuccess && (
                    <div className="w-full text-center py-2 px-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 flex items-center justify-center gap-2">
                      <Check size={14} className="text-emerald-600" /> {creditSuccess}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Generated policy physical sheet document */}
            <div className="privacy-preview-sheet bg-white p-8 sm:p-16 rounded-[2rem] border border-slate-200 shadow-xl text-start">
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
                    <p className="text-sm font-bold">{date}</p>
                  </div>
                </div>

                {/* Markdown content container */}
                <div className="prose prose-slate max-w-none flex-grow">
                  <ReactMarkdown>{policyMarkdown}</ReactMarkdown>
                </div>

                <div className="mt-12 text-center text-[8px] text-slate-400 font-sans tracking-widest uppercase italic opacity-50">
                  FreelancerKit.io Standard Compliance Template
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO Explainer Context Block & FAQ Accordion Section (Hidden during print) */}
      <div className="seo-faq-section mt-16 pt-12 border-t border-slate-200 pb-12 text-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Privacy Policy Generator: Build International, Compliant Legal Frameworks
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              Ensure global operational safety with context-driven data mapping clauses generated dynamically to fit your real tech stack.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            {/* Card 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                  <Scale size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Enterprise-Grade Compliance</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Modern websites require more than boilerplate text. This tool generates policies compliant with GDPR, CCPA, and PIPEDA, ensuring global operational safety.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Framework: GDPR & CCPA</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                  <Check size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Dynamic Data Disclosures</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Highlight how the tool maps specific operational workflows—from email marketing to complex backend inventory data syncing—directly into plain-language legal clauses.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mechanic: Context mapping</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Export & Integration</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Detail how users can instantly export their policy as raw text, structured HTML for direct website embedding, or a formatted PDF document.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Output: Text, HTML, PDF</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-6 pt-6 border-t border-slate-100 text-start">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="text-indigo-600" size={22} /> Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              {seoFaqItems.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-800 hover:text-indigo-600 hover:bg-slate-50/55 transition-all text-sm sm:text-base gap-4 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 bg-slate-50/30 border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          html, body {
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            color: #000 !important;
          }
          body * {
            visibility: hidden !important;
          }
          .privacy-preview-sheet,
          .privacy-preview-sheet * {
            visibility: visible !important;
          }
          #root,
          #root *,
          div {
            height: auto !important;
            overflow: visible !important;
            transform: none !important;
            filter: none !important;
          }
          .privacy-preview-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 40px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
            display: block !important;
          }
          header, nav, .preview-action-bar, footer, .form-container, .admin-sidebar, .seo-faq-section, .sticky-toolbar, .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
