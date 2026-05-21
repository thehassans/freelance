import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  Copy, 
  Check, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Info,
  Server,
  Settings2,
  ChevronDown,
  X,
  Target
} from 'lucide-react';

type DmarcPolicy = 'none' | 'quarantine' | 'reject';

interface SpfProviders {
  google: boolean;
  microsoft: boolean;
  mailchimp: boolean;
  sendgrid: boolean;
  activecampaign: boolean;
  zendesk: boolean;
}

export default function DmarcGenerator() {
  const [domain, setDomain] = useState('');
  const [policy, setPolicy] = useState<DmarcPolicy>('quarantine');
  const [providers, setProviders] = useState<SpfProviders>({
    google: true,
    microsoft: false,
    mailchimp: false,
    sendgrid: false,
    activecampaign: false,
    zendesk: false
  });
  const [customIps, setCustomIps] = useState('');
  const [isStrictSpf, setIsStrictSpf] = useState(false);
  
  // Advanced DMARC
  const [showAdvancedDmarc, setShowAdvancedDmarc] = useState(false);
  const [rua, setRua] = useState('');
  const [ruf, setRuf] = useState('');
  const [pct, setPct] = useState(100);

  const [spfRecord, setSpfRecord] = useState('');
  const [dmarcRecord, setDmarcRecord] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showSalesModal, setShowSalesModal] = useState(false);

  useEffect(() => {
    // Generate SPF Record
    let spfParts = ['v=spf1'];
    if (providers.google) spfParts.push('include:_spf.google.com');
    if (providers.microsoft) spfParts.push('include:spf.protection.outlook.com');
    if (providers.mailchimp) spfParts.push('include:servers.mcsv.net');
    if (providers.sendgrid) spfParts.push('include:sendgrid.net');
    if (providers.activecampaign) spfParts.push('include:emsend1.com');
    if (providers.zendesk) spfParts.push('include:mail.zendesk.com');
    
    if (customIps.trim()) {
      const ips = customIps.split(',').map(ip => ip.trim()).filter(ip => ip);
      ips.forEach(ip => {
        if (ip.includes(':')) spfParts.push(`ip6:${ip}`);
        else spfParts.push(`ip4:${ip}`);
      });
    }

    spfParts.push(isStrictSpf ? '-all' : '~all');
    setSpfRecord(spfParts.join(' '));

    // Generate DMARC Record
    let dmarc = `v=DMARC1; p=${policy};`;
    if (pct < 100) dmarc += ` pct=${pct};`;
    
    const ruaValue = rua.trim() || `mailto:postmaster@${domain || 'yourdomain.com'}`;
    dmarc += ` rua=${ruaValue};`;
    
    if (ruf.trim()) {
      dmarc += ` ruf=${ruf.trim()};`;
    }
    
    setDmarcRecord(dmarc);
  }, [domain, policy, providers, customIps, isStrictSpf, rua, ruf, pct]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck size={14} /> Deliverability Engine
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          DMARC & SPF Record Generator
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Ensure your client's emails land in the inbox, not the spam folder. Generate compliant DNS security records in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
            {/* Domain Input */}
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Globe size={16} className="text-slate-400" /> Domain Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* DMARC Policy */}
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={16} className="text-slate-400" /> DMARC Policy
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'quarantine', 'reject'] as DmarcPolicy[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPolicy(p)}
                    className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                      policy === p 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' 
                        : 'bg-slate-50 border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-bold px-1 italic">
                {policy === 'none' && "* Monitoring mode. No actions against unauthenticated emails."}
                {policy === 'quarantine' && "* Send suspicious emails to the recipient's spam folder."}
                {policy === 'reject' && "* Block suspicious emails completely. Highest security."}
              </p>
            </div>

            {/* Mail Providers */}
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Mail size={16} className="text-slate-400" /> Authorized Providers
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'google', label: 'Google Workspace', state: providers.google },
                  { id: 'microsoft', label: 'Microsoft 365', state: providers.microsoft },
                ].map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setProviders(p => ({ ...p, [provider.id]: !provider.state }))}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      provider.state 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <span className={`font-bold text-xs ${provider.state ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {provider.label}
                    </span>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${provider.state ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${provider.state ? 'right-1' : 'left-1'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Marketing & CRM Providers */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target size={14} /> Marketing & CRM Providers
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'mailchimp', label: 'Mailchimp', state: providers.mailchimp },
                  { id: 'sendgrid', label: 'SendGrid', state: providers.sendgrid },
                  { id: 'activecampaign', label: 'ActiveCampaign', state: providers.activecampaign },
                  { id: 'zendesk', label: 'Zendesk', state: providers.zendesk }
                ].map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setProviders(p => ({ ...p, [provider.id]: !provider.state }))}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      provider.state 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-50 bg-white hover:border-slate-100'
                    }`}
                  >
                    <span className={`font-bold text-[10px] uppercase tracking-wider ${provider.state ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {provider.label}
                    </span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${provider.state ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${provider.state ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom IPs & Strictness */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom IPv4/IPv6 Addresses</label>
                <input
                  type="text"
                  placeholder="1.2.3.4, 5.6.7.8"
                  value={customIps}
                  onChange={(e) => setCustomIps(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xs font-mono"
                />
              </div>
              
              <button
                onClick={() => setIsStrictSpf(!isStrictSpf)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  isStrictSpf 
                    ? 'border-rose-500 bg-rose-50/50' 
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className="text-left">
                  <div className={`text-[10px] font-black uppercase tracking-wider ${isStrictSpf ? 'text-rose-700' : 'text-slate-600'}`}>
                    Use Strict Enforcement (-all)
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium">Recommended for high-security domains.</div>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${isStrictSpf ? 'bg-rose-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isStrictSpf ? 'right-1' : 'left-1'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Advanced DMARC Settings */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <button 
              onClick={() => setShowAdvancedDmarc(!showAdvancedDmarc)}
              className="w-full flex items-center justify-between group"
            >
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                <Settings2 size={16} className="text-slate-400" /> Advanced DMARC Settings
              </label>
              <ChevronDown size={18} className={`text-slate-400 transition-transform ${showAdvancedDmarc ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showAdvancedDmarc && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Reports (RUA)</label>
                    <input
                      type="text"
                      placeholder={`mailto:postmaster@${domain || 'domain.com'}`}
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Forensic Reports (RUF)</label>
                    <input
                      type="text"
                      placeholder="e.g. mailto:reporting@domain.com"
                      value={ruf}
                      onChange={(e) => setRuf(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Policy Percentage (pct)</label>
                      <span className="text-xs font-black text-emerald-600">{pct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pct}
                      onChange={(e) => setPct(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                <Zap size={14} /> Quick Win
              </div>
              <p className="text-sm font-medium leading-relaxed">
                Implementing SPF and DMARC instantly increases "Sender Reputation." This doesn't just stop spam; it ensures your legitimate marketing emails actually reach the client's inbox.
              </p>
            </div>
            <Server className="absolute -right-8 -bottom-8 text-white/5" size={160} />
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {/* SPF Record Output */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/40 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SPF Record (TXT)</span>
              </div>
              <button
                onClick={() => handleCopy(spfRecord, 'spf')}
                className={`p-2 rounded-xl transition-all ${copiedType === 'spf' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
              >
                {copiedType === 'spf' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Host / Name</label>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 font-mono text-xs text-blue-400">@</div>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">TXT Value</label>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 leading-loose break-all">
                  {spfRecord}
                </div>
              </div>
            </div>
          </div>

          {/* DMARC Record Output */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/40 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">DMARC Record (TXT)</span>
              </div>
              <button
                onClick={() => handleCopy(dmarcRecord, 'dmarc')}
                className={`p-2 rounded-xl transition-all ${copiedType === 'dmarc' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
              >
                {copiedType === 'dmarc' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Host / Name</label>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 font-mono text-xs text-blue-400">_dmarc</div>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">TXT Value</label>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 leading-loose break-all">
                  {dmarcRecord}
                </div>
              </div>
            </div>
          </div>

          {/* Freelancer Pitch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500 rounded-3xl p-8 text-white space-y-4 relative overflow-hidden shadow-xl shadow-emerald-500/20"
          >
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                <Zap size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold">The $300 Deliverability Pitch</h4>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <p className="text-white font-bold text-sm leading-relaxed italic">
                    "Email deliverability is a massive pain point. Charge clients $300 to generate and install these exact records to stop their emails from going to spam."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 relative z-10">
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">Revenue Opportunity</p>
              <button 
                onClick={() => setShowSalesModal(true)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Open Sales Script <ChevronRight size={14} />
              </button>
            </div>

            {/* Decoration */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <Info size={16} className="text-slate-400" />
          <h5 className="font-bold text-slate-900 uppercase text-xs tracking-widest">DNS Management 101</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h6 className="font-bold text-sm text-slate-800">What is SPF?</h6>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              Sender Policy Framework (SPF) is a DNS record that tells mail servers which IP addresses or providers (like Google) are allowed to send emails on behalf of your domain. Missing this is the #1 reason for "Soft Bounces."
            </p>
          </div>
          <div className="space-y-4">
            <h6 className="font-bold text-sm text-slate-800">What is DMARC?</h6>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              Domain-based Message Authentication, Reporting, and Conformance (DMARC) uses SPF and DKIM to determine if an email is legitimate. It gives you the power to tell other servers to reject emails that fail these checks.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <button className="inline-flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px] hover:gap-3 transition-all">
            Learn more about Email Security <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Sales Script Modal */}
      <AnimatePresence>
        {showSalesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSalesModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowSalesModal(false)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">$300 Deliverability Pitch</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Deliverability Audit</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "Hi [Name], I was auditing the infrastructure for <span className="text-emerald-600 font-bold underline decoration-emerald-500/30">{domain || 'your company'}</span> and noticed your domain is currently vulnerable to email spoofing due to <span className="font-bold text-slate-900">missing DMARC enforcement</span>. Your emails are likely landing in spam folders or being bounced by major providers like Gmail and Outlook. I can fix this deliverability leak in 30 minutes to ensure your communication reaches the inbox."
                  </p>
                  <label className="absolute -top-2 left-6 px-2 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded">The Script</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      const text = `Hi [Name], I was auditing the infrastructure for ${domain || 'your company'} and noticed your domain is currently vulnerable to email spoofing due to missing DMARC enforcement. Your emails are likely landing in spam folders or being bounced by major providers like Gmail and Outlook. I can fix this deliverability leak in 30 minutes to ensure your communication reaches the inbox.`;
                      handleCopy(text, 'script');
                    }}
                    className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${copiedType === 'script' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'}`}
                  >
                    {copiedType === 'script' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedType === 'script' ? 'Copied Script!' : 'Copy Script'}
                  </button>
                  <button 
                    onClick={() => setShowSalesModal(false)}
                    className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-slate-300 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
