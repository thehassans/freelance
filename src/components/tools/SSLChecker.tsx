import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Globe, 
  Download, 
  Settings, 
  Server, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Lock, 
  AlertTriangle, 
  Info, 
  Calendar,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import LockedToolOverlay from '../common/LockedToolOverlay';

type ToolState = 'idle' | 'loading' | 'success';

interface SSLCertificateData {
  grade: string;
  issuer: string;
  daysRemaining: number;
  status: string;
  protocols: { name: string; enabled: boolean; secure: boolean }[];
  vulnerabilities: { name: string; passed: boolean }[];
  ciphers: string[];
  headers: { key: string; value: string }[];
  sans: string[];
  serialNumber: string;
}

const MOCK_PAYLOAD: SSLCertificateData = {
  grade: 'A+',
  issuer: "Let's Encrypt Authority X3",
  daysRemaining: 45,
  status: 'Valid',
  protocols: [
    { name: 'TLS 1.3', enabled: true, secure: true },
    { name: 'TLS 1.2', enabled: true, secure: true },
    { name: 'TLS 1.1', enabled: false, secure: false },
    { name: 'TLS 1.0', enabled: false, secure: false },
    { name: 'SSLv3', enabled: false, secure: false },
  ],
  vulnerabilities: [
    { name: 'BEAST', passed: true },
    { name: 'POODLE', passed: true },
    { name: 'Heartbleed', passed: true },
    { name: 'Ticketbleed', passed: true },
    { name: 'ROBOT', passed: true },
  ],
  ciphers: [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-CHACHA20-POLY1305'
  ],
  headers: [
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  ],
  sans: ['example.com', 'www.example.com', 'api.example.com'],
  serialNumber: '03:4A:2F:E1:99:B7:C8:D2:E4:F5:1A:3B',
};

const LOADING_TEXTS = [
  'Resolving Host...',
  'Fetching Certificate Chain...',
  'Analyzing Cipher Suites...',
  'Testing Vulnerabilities...'
];

const FAQS = [
  { q: "What is an SSL certificate?", a: "SSL is an abbreviation and stands for Secure Sockets Layer. It is a cryptographic protocol that provides secure communication between a web server and a web browser. SSL encrypts all communication between the server and the browser, so that if anyone intercepts the communication it is unreadable." },
  { q: "What is the difference between SSL and TLS?", a: "SSL is the predecessor to TLS (Transport Layer Security). TLS is a more modern and secure protocol than SSL, and it is the protocol that is currently used by most websites." },
  { q: "How does the handshake process work?", a: "The client requests a secure connection, and the server sends its certificate. The client verifies the certificate, generates a random session key, encrypts it, and sends it to the server to establish encrypted communication." },
  { q: "What is a Vulnerability Scanner checking?", a: "It detects known security risks and exploits such as BEAST, POODLE, Heartbleed, Ticketbleed, and ROBOT to ensure your server is fully patched against outdated attacks." },
  { q: "What are Cipher Algorithms?", a: "Cipher algorithms are the actual encryption methods used to secure data. The scanner retrieves the cipher suites supported by the host for each TLS/SSL protocol and checks for dangerously unsafe ciphers that might be enabled." },
  { q: "Why check Server Headers?", a: "Server headers provide insights into the server's capabilities and security settings (like Strict-Transport-Security to force HTTPS)." }
];

const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-4 shadow-sm hover:border-slate-300 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="font-semibold text-slate-800">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-slate-400 shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-slate-400 shrink-0" size={20} />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
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

export default function SSLChecker() {
  const { executeAction, isProcessing: isPremiumProcessing } = usePremiumAction();
  
  const [url, setUrl] = useState('');
  const [state, setState] = useState<ToolState>('idle');
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [data, setData] = useState<SSLCertificateData | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (state === 'loading') {
      const interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % LOADING_TEXTS.length);
      }, 750);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setState('loading');
    setLoadingTextIndex(0);

    setTimeout(() => {
      setData(MOCK_PAYLOAD);
      setState('success');
    }, 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadReport = async () => {
    await executeAction(async () => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          window.print();
          toast.success('SSL Report downloaded successfully!');
          resolve(true);
        }, 500);
      });
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 pt-12">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <div className="flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-[#6c63ff] rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
            FREEMIUM TOOL
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100">
            <ShieldCheck size={14} /> SECURITY
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex flex-col md:flex-row items-center justify-center gap-4">
          Deep-Scanning SSL Checker
        </h1>
        
        <div className="flex justify-center">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            {copiedLink ? <Check size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
            Share Link
          </button>
        </div>
      </div>

      {/* Locked Input Area */}
      <div className="max-w-2xl mx-auto mt-16">
        <LockedToolOverlay />
      </div>

      {state === 'loading' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto mt-24 text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-indigo-100/50 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-[#6c63ff] rounded-full flex items-center justify-center text-white shadow-xl">
              <ShieldCheck size={32} className="animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Auditing Domain...</h3>
          <p className="text-[#6c63ff] font-medium h-6">{LOADING_TEXTS[loadingTextIndex]}</p>
        </motion.div>
      )}

      {state === 'success' && data && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl print:bg-white print:text-black overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-slate-800 print:border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-white print:text-black mb-1 flex items-center gap-3">
                <ShieldCheck className="text-emerald-400" />
                Scan Results for {url || 'example.com'}
              </h2>
              <p className="text-slate-400">Deep audit completed successfully.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={() => { setUrl(''); setState('idle'); setData(null); }}
                className="flex-1 sm:flex-none px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm font-medium transition-colors print:hidden"
              >
                Scan Another Domain
              </button>
              <button 
                onClick={handleDownloadReport}
                disabled={isPremiumProcessing}
                className="flex-1 sm:flex-none px-6 py-2 bg-[#6c63ff] hover:bg-[#5b54d6] text-white rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center justify-center gap-2 print:hidden"
              >
                {isPremiumProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                Download Report (1 Cr)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:border-slate-200 print:bg-slate-50">
              <div className="text-slate-400 text-sm mb-2 font-medium">Overall Grade</div>
              <div className="text-5xl font-black text-emerald-400">{data.grade}</div>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:border-slate-200 print:bg-slate-50">
              <div className="text-slate-400 text-sm mb-2 font-medium">Certificate Status</div>
              <div className="text-3xl font-bold text-white print:text-black flex items-center gap-2 mt-2">
                <Check className="text-emerald-400" /> {data.status}
              </div>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:border-slate-200 print:bg-slate-50">
              <div className="text-slate-400 text-sm mb-2 font-medium">Days to Expiration</div>
              <div className="text-3xl font-bold text-white print:text-black mt-2">
                {data.daysRemaining} days
              </div>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:border-slate-200 print:bg-slate-50">
              <div className="text-slate-400 text-sm mb-2 font-medium">Issuer</div>
              <div className="text-lg font-bold text-white print:text-black mt-2 leading-tight">
                {data.issuer}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Protocol Support */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 print:border-slate-200 print:bg-white">
              <h3 className="text-lg font-bold text-white print:text-black mb-6 flex items-center gap-2">
                <Server size={18} className="text-indigo-400" />
                Protocol Support
              </h3>
              <div className="space-y-3">
                {data.protocols.map((protocol, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl print:bg-slate-50">
                    <span className="text-slate-300 print:text-black font-medium">{protocol.name}</span>
                    {protocol.enabled ? (
                      <span className={`px-2 py-1 text-xs font-bold rounded-lg ${protocol.secure ? 'bg-emerald-500/20 text-emerald-400 print:bg-emerald-100 print:text-emerald-700' : 'bg-red-500/20 text-red-400 print:bg-red-100 print:text-red-700'}`}>
                        Enabled
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-700 text-slate-400 print:bg-slate-200 print:text-slate-600">
                        Disabled
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vulnerability Scan */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 print:border-slate-200 print:bg-white">
              <h3 className="text-lg font-bold text-white print:text-black mb-6 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                Vulnerability Scan
              </h3>
              <div className="space-y-3">
                {data.vulnerabilities.map((vuln, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl print:bg-slate-50">
                    <span className="text-slate-300 print:text-black font-medium">{vuln.name}</span>
                    {vuln.passed ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                        <Check size={16} /> Passed
                      </span>
                    ) : (
                      <span className="text-red-400 text-sm font-bold">Failed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Details */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 print:border-slate-200 print:bg-white">
              <h3 className="text-lg font-bold text-white print:text-black mb-6 flex items-center gap-2">
                <Info size={18} className="text-blue-400" />
                Certificate Details
              </h3>
              
              <div className="mb-4">
                <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Serial Number</div>
                <div className="p-3 bg-slate-900 text-slate-300 font-mono text-xs rounded-xl break-all print:bg-slate-50 print:text-black">
                  {data.serialNumber}
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Subject Alternative Names</div>
                <div className="flex flex-wrap gap-2">
                  {data.sans.map((san, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg print:bg-slate-200 print:text-slate-700">
                      {san}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 print:border-slate-200 print:bg-white">
               <h3 className="text-lg font-bold text-white print:text-black mb-4">Sample Cipher Algorithms</h3>
               <div className="space-y-2">
                 {data.ciphers.map((cipher, i) => (
                   <div key={i} className="p-3 bg-slate-900/50 rounded-xl text-sm font-mono text-slate-300 print:bg-slate-50 print:text-black break-all">
                     {cipher}
                   </div>
                 ))}
               </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 print:border-slate-200 print:bg-white">
               <h3 className="text-lg font-bold text-white print:text-black mb-4">Server Headers</h3>
               <div className="space-y-2">
                 {data.headers.map((header, i) => (
                   <div key={i} className="p-3 bg-slate-900/50 rounded-xl text-sm justify-between flex flex-col sm:flex-row gap-2 print:bg-slate-50 print:text-black">
                     <span className="font-bold text-indigo-300">{header.key}</span>
                     <span className="text-slate-400 font-mono break-all">{header.value}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </motion.div>
      )}

      {/* SEO Section (visible in all states) */}
      <section className="max-w-6xl mx-auto py-16 border-t border-slate-200 mt-24 print:hidden">
        <div className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Free online tool for test SSL security</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">Certificate Details</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Validate certificate installation, issuer identification and Subject Alternative Name (SANs).</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">SSL Expiry Check</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Determines whether the certificate is currently valid or has expired and calculate remaining days to expire.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">TLS Protocols</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Identifying TLS/SSL Protocols compatibility and required versions for the specified host.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">Cipher Algorithms</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Retrieves the cipher suites supported by the host for each TLS/SSL protocol. Check for unsafe ciphers enabled.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">Vulnerability Scanner</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Detecting known risk security issues : BEAST, POODLE, Heartbeat, Ticketbleed, ROBOT and more.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">Server Headers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Response headers, providing insights into the server's capabilities and security settings.</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg text-slate-600 max-w-none mb-16">
          <h2 className="text-2xl font-bold text-slate-900">SSL definition and history</h2>
          <p>
            SSL is an abbreviation and stands for Secure Sockets Layer. It is a cryptographic protocol that provides secure communication between a web server and a web browser. SSL encrypts all communication between the server and the browser, so that if anyone intercepts the communication it is unreadable.
          </p>
          <p>
            SSL is the predecessor to TLS (another abbreviation which standas for Transport Layer Security). TLS is a more modern and secure protocol than SSL, and it is the protocol that is currently used by most websites.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12">Browser and server communication</h2>
          <p>
            When you visit a website that is using SSL, your browser will send a message to the server asking for the website's SSL certificate. The server will then send the certificate back to the browser. The browser will then verify the certificate to make sure that it is valid. If the certificate is valid, the browser will establish a secure connection with the server.
          </p>
          <p>
            A secure HTTPS connection to a domain (website) with a valid SSL certificate from a trusted certificate authority ensures that all communication between your web browser and the website is encrypted and secure. This means that your personal information, such as your credit card number and password, cannot be intercepted and read by third parties.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12">Establish a secure HTTPS connection</h2>
          <p>This process is also called 'handshake' and it involves the following steps:</p>
          
          <ol className="list-decimal pl-6 space-y-4">
            <li className="pl-2">
              <strong className="text-slate-900">Request:</strong> The client (web browser) sends a request to the server (website) for a secure connection. This request includes the client's supported cipher suites and the domain name of the website.
            </li>
            <li className="pl-2">
              <strong className="text-slate-900">Certificate:</strong> The server sends its SSL certificate to the client. The SSL certificate contains information about the website, such as the domain name, the organization name, and the expiration date. It also includes the server's public key.
            </li>
            <li className="pl-2">
              <strong className="text-slate-900">Verification:</strong> The client verifies the SSL certificate. The client checks the validity of the certificate by making sure that it is issued by a trusted certificate authority and that it has not expired. The client also checks the domain name in the certificate to make sure that it matches the domain name of the website.
            </li>
            <li className="pl-2">
              <strong className="text-slate-900">Session Key Generation:</strong> The client generates a random session key and encrypts it with the server's public key. The client then sends the encrypted session key to the server. The server decrypts the session key with its private key. The server then uses the session key to encrypt all communication between the server and the client.
            </li>
          </ol>
          <p className="mt-6 text-sm font-medium bg-indigo-50 p-4 rounded-xl text-indigo-900">
            This handshake between the server and your browser all take palce behind the scenes in hundreds of a second. Once the handshake is complete, the client and the server can communicate securely.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
