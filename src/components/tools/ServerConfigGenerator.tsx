import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Globe, 
  Settings,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { getServerConfigStr } from '../../data/serverConfigsCombined';
import { SERVER_METADATA } from '../../data/serverMetadata';

const SERVER_SOFTWARE = SERVER_METADATA.map(s => s.name);

type Profile = 'Modern' | 'Intermediate' | 'Old';

interface ConfigState {
  serverSoftware: string;
  profile: Profile;
  serverVersion: string;
  opensslVersion: string;
  hsts: boolean;
  ocsp: boolean;
}

function generateCryptoConfig(state: ConfigState) {
  const date = new Date().toISOString().split('T')[0];
  const { serverSoftware, serverVersion, opensslVersion, profile, hsts, ocsp } = state;

  const header = `# generated ${date}, FreelancerKit Guideline, ${serverSoftware} ${serverVersion || 'Unknown'}, OpenSSL ${opensslVersion || 'Unknown'}, ${profile} configuration`;

  if (serverSoftware === 'Redis') {
    let protocols = '';
    let ciphers = '';
    let ciphersuites = '';

    if (profile === 'Modern') {
      protocols = '"TLSv1.3"';
      ciphers = ''; 
      ciphersuites = 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
    } else if (profile === 'Intermediate') {
      protocols = '"TLSv1.2 TLSv1.3"';
      ciphers = 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305';
      ciphersuites = 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
    } else { // Old
      protocols = '"TLSv1 TLSv1.1 TLSv1.2 TLSv1.3"';
      ciphers = 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305'; 
      ciphersuites = 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
    }

    return `${header}
port 0
tls-port 6379
tls-cluster yes
tls-replication yes
tls-cert-file /path/to/signed_cert_plus_intermediates
tls-key-file /path/to/private_key
tls-ca-cert-file /path/to/ca_certificates.crt
tls-ca-cert-dir /path/to/ca_certificates
tls-dh-params-file /path/to/dhparam
# ${profile} configuration
tls-protocols ${protocols}
${ciphers ? `tls-ciphers ${ciphers}\n` : ''}tls-ciphersuites ${ciphersuites}
tls-prefer-server-ciphers no`;
  }
  
  if (serverSoftware === 'nginx') {
    let sslProtocols = '';
    let sslCiphers = '';
    if (profile === 'Modern') {
       sslProtocols = 'TLSv1.3';
       sslCiphers = '';
    } else if (profile === 'Intermediate') {
       sslProtocols = 'TLSv1.2 TLSv1.3';
       sslCiphers = 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    } else {
       sslProtocols = 'TLSv1 TLSv1.1 TLSv1.2 TLSv1.3';
       sslCiphers = 'HIGH:!aNULL:!MD5';
    }
  
    return `${header}
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /path/to/signed_cert_plus_intermediates;
    ssl_certificate_key /path/to/private_key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;  # about 40000 sessions
    ssl_session_tickets off;

    ssl_protocols ${sslProtocols};
    ${sslCiphers ? `ssl_ciphers ${sslCiphers};` : '# No ciphers specified for modern'}
    ssl_prefer_server_ciphers off;
${hsts ? `
    # HSTS (ngx_http_headers_module is required) (63072000 seconds)
    add_header Strict-Transport-Security "max-age=63072000" always;` : ''}${ocsp ? `

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # verify chain of trust of OCSP response using Root CA and Intermediate certs
    ssl_trusted_certificate /path/to/root_CA_cert_plus_intermediates;` : ''}
}`;
  }

  if (serverSoftware === 'Apache') {
    let sslProtocols = '';
    let sslCiphers = '';
    if (profile === 'Modern') {
       sslProtocols = '-all +TLSv1.3';
       sslCiphers = '';
    } else if (profile === 'Intermediate') {
       sslProtocols = 'all -SSLv3 -TLSv1 -TLSv1.1';
       sslCiphers = 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    } else {
       sslProtocols = 'all -SSLv3';
       sslCiphers = 'HIGH:!aNULL:!MD5';
    }
    
    return `${header}
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile      /path/to/signed_cert_plus_intermediates
    SSLCertificateKeyFile   /path/to/private_key

    # ${profile} configuration
    SSLProtocol             ${sslProtocols}
    ${sslCiphers ? `SSLCipherSuite          ${sslCiphers}` : ''}
    SSLHonorCipherOrder     off
    SSLSessionTickets       off
${hsts ? `
    # HSTS (mod_headers is required) (15768000 seconds)
    Header always set Strict-Transport-Security "max-age=15768000"` : ''}${ocsp ? `

    # OCSP Stapling, only in httpd 2.3.3 and later
    SSLUseStapling          on
    SSLStaplingResponderTimeout 5
    SSLStaplingReturnResponderErrors off` : ''}
</VirtualHost>`;
  }

  // Fallback Mock
  return `${header}\n\n# Configuration generation for ${serverSoftware} is not fully detailed in this specific mock.\n# Please select Redis, nginx, or Apache for complete templates.\n\n# Example directives:\nssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers HIGH:!aNULL:!MD5;`;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden mb-4 bg-white">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-bold text-slate-900 pr-8">{question}</span>
        {isOpen ? <ChevronUp className="text-slate-400 flex-shrink-0" /> : <ChevronDown className="text-slate-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ServerConfigGenerator() {
  const { executeAction, isProcessing } = usePremiumAction();

  const [state, setState] = useState<ConfigState>({
    serverSoftware: 'nginx',
    profile: 'Intermediate',
    serverVersion: '1.17.7',
    opensslVersion: '1.1.1k',
    hsts: true,
    ocsp: true,
  });

  const [code, setCode] = useState('');

  useEffect(() => {
    setCode(getServerConfigStr(state.serverSoftware, state.profile));
  }, [state]);

  const handleCopy = async () => {
    await executeAction(async () => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          navigator.clipboard.writeText(code);
          toast.success('Enterprise configuration copied to clipboard!');
          resolve(true);
        }, 500); // Slight delay for realistic feel
      });
    });
  };

  const PROFILES: { type: Profile; desc: string }[] = [
    { type: 'Modern', desc: 'Services with clients that support TLS 1.3. No backward compatibility.' },
    { type: 'Intermediate', desc: 'General-purpose servers, recommended for almost all systems.' },
    { type: 'Old', desc: 'Compatible with legacy clients, use only as a last resort.' }
  ];

  const FAQS = [
    { q: "What is the difference between Modern and Intermediate configurations?", a: "Modern configurations drop support for older protocols like TLS 1.2 and only support TLS 1.3. Intermediate provides a balance, securing modern browsers while allowing slightly older devices to connect." },
    { q: "Why do I need to specify my OpenSSL version?", a: "Different versions of OpenSSL support different cipher suites and cryptographic curves. Specifying your exact version ensures the generated code will compile without syntax errors on your server." },
    { q: "What is HTTP Strict Transport Security (HSTS)?", a: "HSTS is a web security policy mechanism that forces web browsers to interact with your server using only secure HTTPS connections, preventing man-in-the-middle attacks." },
    { q: "What is OCSP Stapling?", a: "OCSP Stapling improves SSL negotiation speed and privacy by allowing the web server to query the Certificate Authority directly and 'staple' the validity response to the initial connection handshake." },
    { q: "How often should I update my server configurations?", a: "Cryptographic standards evolve rapidly. It is recommended to regenerate and apply new server configurations every 6 to 12 months, or whenever a major OpenSSL vulnerability is announced." },
    { q: "Does generating a configuration consume a credit?", a: "Yes. Copying the hardened, production-ready configuration block to your clipboard utilizes one freemium credit." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
          <Server size={14} /> Server Configuration Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-4">
          Enterprise SSL/TLS Hardening
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Generate secure, cryptographic configurations across dozens of server environments to ensure strict PCI and HIPAA compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Input Form */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-8">
            
            {/* Server Software */}
            <div>
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Globe size={16} className="text-slate-400" /> Server Software
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVER_SOFTWARE.map((sw) => (
                  <button
                    key={sw}
                    onClick={() => setState({ ...state, serverSoftware: sw })}
                    className={`p-3 text-sm font-bold rounded-xl border-2 transition-all flex items-center justify-center text-center ${
                      state.serverSoftware === sw 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' 
                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sw}
                  </button>
                ))}
              </div>
            </div>

            {/* Config Profile */}
            <div>
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-slate-400" /> Configuration Profile
              </label>
              <div className="space-y-3">
                {PROFILES.map((p) => (
                  <label key={p.type} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${state.profile === p.type ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="profile" 
                      value={p.type} 
                      checked={state.profile === p.type}
                      onChange={(e) => setState({ ...state, profile: e.target.value as Profile })}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{p.type}</div>
                      <div className="text-sm text-slate-500 leading-relaxed mt-1">{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Environment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">
                  Server Version
                </label>
                <input 
                  type="text" 
                  value={state.serverVersion}
                  onChange={(e) => setState({ ...state, serverVersion: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 1.17.7"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 block">
                  OpenSSL Version
                </label>
                <input 
                  type="text" 
                  value={state.opensslVersion}
                  onChange={(e) => setState({ ...state, opensslVersion: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 1.1.1k"
                />
              </div>
            </div>

            {/* Misc */}
            <div>
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Settings size={16} className="text-slate-400" /> Miscellaneous
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={state.hsts}
                    onChange={(e) => setState({ ...state, hsts: e.target.checked })}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-700">HTTP Strict Transport Security (HSTS)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={state.ocsp}
                    onChange={(e) => setState({ ...state, ocsp: e.target.checked })}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-700">OCSP Stapling</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Output Dashboard */}
        <div className="lg:col-span-12 xl:col-span-7 h-full">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/40 flex flex-col h-full border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="text-xs font-black text-slate-400 tracking-widest uppercase">
                {state.serverSoftware.toLowerCase()} {state.serverVersion}, {state.profile.toLowerCase()} config, OpenSSL {state.opensslVersion}
              </div>
              <button
                onClick={handleCopy}
                disabled={isProcessing}
                className="flex items-center gap-2 py-2 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
              >
                {isProcessing ? <Settings className="animate-spin" size={14} /> : <Copy size={14} />}
                Copy Config
              </button>
            </div>

            <div className="flex-grow bg-slate-950/50 rounded-2xl p-8 border border-white/5 font-mono text-xs md:text-sm overflow-auto whitespace-pre min-h-[500px] text-slate-300 scrollbar-thin scrollbar-thumb-slate-800">
              <div dangerouslySetInnerHTML={{ __html: code.replace(/^(#.*)$/gm, '<span class="text-slate-500 italic">$1</span>') }} />
            </div>
            
            <div className="mt-8 text-center text-xs text-slate-500 font-medium">
              Copying configuration uses 1 Premium Credit
            </div>
          </div>
        </div>
      </div>

      {/* SEO Optimized Section */}
      <div className="max-w-5xl mx-auto py-16 border-t border-slate-200 mt-16">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Enterprise-Grade Server Hardening</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600 leading-relaxed">
            <p>
              Misconfigured TLS/SSL protocols are currently the #1 vulnerability for modern web applications. Defaults set by common operating systems often prioritize backward compatibility over strict cryptographic integrity. 
            </p>
            <p>
              By generating and hard-coding strict cipher suites into your server configuration (whether Nginx, Apache, or Redis), you actively prevent downgrade attacks, mitigate protocol vulnerabilities like POODLE and Heartbleed, and secure transit data against man-in-the-middle interception.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight border-b border-slate-100 pb-4">Supported Server Environments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {SERVER_METADATA.map((meta) => (
              <div key={meta.name} className="flex flex-col">
                <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {meta.name}
                </h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {meta.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-6 border-t border-slate-100 pt-16">Frequently Asked Questions</h3>
        <div className="space-y-0">
          {FAQS.map((faq, idx) => (
            <FAQItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
