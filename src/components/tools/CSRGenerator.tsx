import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  AlertTriangle,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import LockedToolOverlay from '../common/LockedToolOverlay';

type ToolState = 'idle' | 'loading' | 'success';

const MOCK_CSR = `-----BEGIN CERTIFICATE REQUEST-----
MIICvDCCAaQCAQAwdzELMAkGA1UEBhMCVVMxDTALBgNVBAgMBFV0YWgxDzANBgNV
BAcMBkxpbmRvbjEWMBQGA1UECgwNRGlnaUNlcnQgSW5jMRkwFwYDVQQLDBBEaWdp
Q2VydCBHcm91cDEZMBcGA1UEAwwQd3d3LmV4YW1wbGUuY29tMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8+To7d+2kPWeBv/orU3LVbJwDrSQbeKamCmo
wp5bqDd4fHNa/y4J06KkQzMzY/M3R/lO/d4xT/Q/e6mXzvJmE8c/yO8vWp3g3P3W
5t9o1wZkPZ9rO/fXvX5m/rR9g/G5iM7B3z+Fp8G1/d7wP6g/rN0s9t/hT7g/yNQQ
-----END CERTIFICATE REQUEST-----`;

const MOCK_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDz5Ojt37aQ9Z4G
/+itTctVsnAOtJBt4pqYKajCnluoN3h8c1r/LgnToqRDMzNj8zdH+U793jFP9D97
qZfO8mYTxz/I7y9aneDc/dbm32jXBmQ9n2s799e9fmb+tH2D8bmIzsHfP4WnwbX9
3vA/qD+s3Sz23+FPuD/I1BBN6h/V3b/v7sP3m/rD5g/I7y9aneDc/dbm32jXBmQ9
n2s799e9fmb+tH2D8bmIzsHfP4WnwbX93vA/qD+s3Sz23+FPuD/I1BBN6h/V3b/v
7sP3m/rD5g/I7y9aneDc/dbm32jXBmQ9n2s799e9fmb+tH2D8bmIzsHfP4WnwbX9
3vA/qD+s3Sz23+FPuD/I1BBN6h/V3b/v7sP3m/rD5g/I7y9aneDc/dbm32jXBmQ9
-----END PRIVATE KEY-----`;

const LOADING_TEXTS = [
  'Initializing Crypto Engine...',
  'Generating Private Key...',
  'Encoding CSR...'
];

export default function CSRGenerator() {
  const { executeAction, isProcessing: isPremiumProcessing } = usePremiumAction('csr-generator');
  
  const [state, setState] = useState<ToolState>('idle');
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCsr, setCopiedCsr] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const [formData, setFormData] = useState({
    cn: '',
    o: '',
    ou: '',
    l: '',
    s: '',
    c: '',
    keySize: '2048'
  });

  useEffect(() => {
    if (state === 'loading') {
      const interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % LOADING_TEXTS.length);
      }, 666);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setLoadingTextIndex(0);

    setTimeout(() => {
      setState('success');
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setter(false), 2000);
  };

  const handleDownload = async () => {
    await executeAction(async () => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          toast.success('1 Credit Used. Key pair downloaded to your device.');
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
          CSR & Private Key Generator
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

      {/* Main App Grid (Locked) */}
      <div className="max-w-3xl mx-auto mb-16">
        <LockedToolOverlay />
      </div>

      {/* SEO Section */}
      <section className="max-w-6xl mx-auto py-16 border-t border-slate-200 mt-12 bg-slate-50/50 rounded-3xl px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">CSR generator for SSL</h2>
          <p className="text-slate-600 leading-relaxed text-lg max-w-4xl">
            A CSR (Certificate Signing Request) generator is a tool used to create a block of encoded text (the CSR) and a matching Private Key. You must submit this text to a Certificate Authority (CA) to purchase or issue an SSL/TLS certificate for your website.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Why You Need It</h3>
            <p className="text-slate-600 mb-6 text-sm">
              To secure your website with HTTPS, you must generate a CSR on the same server where you plan to install the SSL certificate. The generator serves three main functions:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Check size={14} /></div>
                <p className="text-sm text-slate-700"><strong className="text-slate-900">Creates a Key Pair:</strong> It produces your Private Key (which must remain secure on your server) and your Public Key (which is embedded in the CSR).</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Check size={14} /></div>
                <p className="text-sm text-slate-700"><strong className="text-slate-900">Identifies Your Site:</strong> It embeds your website's exact domain name, organization details, and location into the request.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Check size={14} /></div>
                <p className="text-sm text-slate-700"><strong className="text-slate-900">Validates Authenticity:</strong> The CA uses the CSR to verify these details and issues your final SSL certificate.</p>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Information Included in a CSR</h3>
            <p className="text-slate-600 mb-6 text-sm">
              When you use a CSR generator, you will be prompted to enter the following details:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                <span><strong className="text-slate-900">Common Name (CN):</strong> The exact Fully Qualified Domain Name (FQDN) you want to secure (e.g., yourdomain.com or *.yourdomain.com for a wildcard).</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                <span><strong className="text-slate-900">Organization (O):</strong> The legally registered name of your company.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                <span><strong className="text-slate-900">Organizational Unit (OU):</strong> Your department (e.g., IT or Web Administration).</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                <span><strong className="text-slate-900">City/Locality (L) & State/Province (S):</strong> Your geographical location.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                <span><strong className="text-slate-900">Country (C):</strong> Your two-letter country code (e.g., SA for Saudi Arabia).</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                <span><strong className="text-slate-900">Key Size:</strong> Typically set to 2048-bit (recommended) or 4096-bit.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Generate a CSR</h2>
          <p className="text-slate-600 mb-6">
            You can generate a CSR using several different methods depending on your hosting setup:
          </p>
          <ul className="space-y-4 mb-8 pl-4 border-l-2 border-slate-100">
            <li className="relative pl-6">
              <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-[#6c63ff]"></div>
              <strong className="text-slate-900 text-lg block mb-1">Your Web Server</strong>
              <span className="text-slate-600 text-sm">You can generate a CSR directly via the terminal using OpenSSL or through a graphical interface like Microsoft IIS.</span>
            </li>
            <li className="relative pl-6">
              <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-[#6c63ff]"></div>
              <strong className="text-slate-900 text-lg block mb-1">Hosting Control Panel</strong>
              <span className="text-slate-600 text-sm">Most hosting providers let you create one easily inside platforms like cPanel (under the SSL/TLS section) or Plesk.</span>
            </li>
            <li className="relative pl-6">
              <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-[#6c63ff]"></div>
              <strong className="text-slate-900 text-lg block mb-1">Online CSR Generators</strong>
              <span className="text-slate-600 text-sm">You can use online web tools to quickly build the text and key pair.</span>
            </li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0"><AlertTriangle size={20} /></div>
            <div>
              <h4 className="font-bold text-amber-900 mb-1">Security Tip</h4>
              <p className="text-amber-800 text-sm leading-relaxed">
                If you use an online tool, ensure it processes the generation client-side (in your browser) so that your Private Key is never sent over the internet or exposed to the tool's server.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
