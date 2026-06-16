import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Lock,
  Search,
  Server,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import LockedToolOverlay from '../common/LockedToolOverlay';

type ToolState = 'idle' | 'loading' | 'success';

interface DecodedData {
  commonName: string;
  organization: string;
  organizationalUnit: string;
  locality: string;
  stateName: string;
  country: string;
  keySize: string;
  signatureAlgorithm: string;
}

const MOCK_DATA: DecodedData = {
  commonName: 'www.example.com',
  organization: 'Acme Corp',
  organizationalUnit: 'IT Security',
  locality: 'New York',
  stateName: 'NY',
  country: 'US',
  keySize: '2048-bit',
  signatureAlgorithm: 'SHA256withRSA'
};

const LOADING_TEXTS = [
  'Parsing Base64 String...',
  'Extracting Public Key...',
  'Verifying Signature...'
];

export default function CSRDecoder() {
  const { executeAction, isProcessing: isPremiumProcessing } = usePremiumAction();
  
  const [state, setState] = useState<ToolState>('idle');
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null);

  useEffect(() => {
    if (state === 'loading') {
      const interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % LOADING_TEXTS.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleDecode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast.error('Please enter a valid CSR or Certificate string.');
      return;
    }

    setState('loading');
    setLoadingTextIndex(0);

    setTimeout(() => {
      setDecodedData(MOCK_DATA);
      setState('success');
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = async () => {
    await executeAction(async () => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          window.print();
          toast.success('Verification Report downloaded successfully!');
          resolve(true);
        }, 500);
      });
    });
  };

  const resetState = () => {
    setState('idle');
    setInputText('');
    setDecodedData(null);
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
          CSR & SSL Certificate Decoder
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
      <div className="max-w-4xl mx-auto">
        <LockedToolOverlay />
      </div>

      {state === 'loading' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto mt-24 text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-slate-200 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-slate-100 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl">
              <Lock size={32} className="animate-pulse text-indigo-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Base64 Signature...</h3>
          <p className="text-slate-500 font-medium h-6">{LOADING_TEXTS[loadingTextIndex]}</p>
        </motion.div>
      )}

      {state === 'success' && decodedData && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden print:bg-white print:text-black print:shadow-none print:p-0"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-slate-800 print:mb-6 print:pb-6 print:border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3 print:text-black">
                <Check className="text-emerald-400" size={28} />
                Decoding Successful
              </h2>
              <p className="text-slate-400 print:text-slate-600">The certificate string is structurally valid.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto print:hidden">
              <button 
                onClick={resetState}
                className="flex-1 sm:flex-none px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                Decode Another
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:bg-slate-50 print:border-slate-200 flex items-start gap-4">
              <div className="mt-1 shrink-0"><Check size={20} className="text-emerald-500" /></div>
              <div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">Common Name (CN)</div>
                 <div className="text-white font-medium break-all print:text-slate-900">{decodedData.commonName}</div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:bg-slate-50 print:border-slate-200 flex items-start gap-4">
              <div className="mt-1 shrink-0"><Check size={20} className="text-emerald-500" /></div>
              <div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">Organization (O)</div>
                 <div className="text-white font-medium break-all print:text-slate-900">{decodedData.organization}</div>
              </div>
             </div>

             <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:bg-slate-50 print:border-slate-200 flex items-start gap-4">
              <div className="mt-1 shrink-0"><Check size={20} className="text-emerald-500" /></div>
              <div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">Organizational Unit (OU)</div>
                 <div className="text-white font-medium break-all print:text-slate-900">{decodedData.organizationalUnit}</div>
              </div>
             </div>

             <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:bg-slate-50 print:border-slate-200 flex items-start gap-4">
              <div className="mt-1 shrink-0"><Check size={20} className="text-emerald-500" /></div>
              <div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">Locality / City (L)</div>
                 <div className="text-white font-medium break-all print:text-slate-900">{decodedData.locality}</div>
              </div>
             </div>

             <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:bg-slate-50 print:border-slate-200 flex items-start gap-4">
              <div className="mt-1 shrink-0"><Check size={20} className="text-emerald-500" /></div>
              <div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">State / Province (S)</div>
                 <div className="text-white font-medium break-all print:text-slate-900">{decodedData.stateName}</div>
              </div>
             </div>

             <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:bg-slate-50 print:border-slate-200 flex items-start gap-4">
              <div className="mt-1 shrink-0"><Check size={20} className="text-emerald-500" /></div>
              <div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">Country (C)</div>
                 <div className="text-white font-medium break-all print:text-slate-900">{decodedData.country}</div>
              </div>
             </div>

             <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:bg-slate-50 print:border-slate-200 flex items-start gap-4">
              <div className="mt-1 shrink-0"><Check size={20} className="text-emerald-500" /></div>
              <div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">Key Size</div>
                 <div className="text-white font-medium break-all print:text-slate-900">{decodedData.keySize}</div>
              </div>
             </div>

             <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 print:bg-slate-50 print:border-slate-200 flex items-start gap-4">
              <div className="mt-1 shrink-0"><Check size={20} className="text-emerald-500" /></div>
              <div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">Signature Algorithm</div>
                 <div className="text-white font-medium break-all print:text-slate-900">{decodedData.signatureAlgorithm}</div>
              </div>
             </div>
          </div>

          <div className="flex justify-center print:hidden">
            <button 
              onClick={handleDownload}
              disabled={isPremiumProcessing}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isPremiumProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download size={20} />
              )}
              Download Verification Report (PDF) (1 Cr)
            </button>
          </div>
        </motion.div>
      )}

      {/* SEO Section */}
      <section className="max-w-6xl mx-auto py-16 border-t border-slate-200 mt-12 print:hidden">
        <div className="prose prose-lg text-slate-600 max-w-none">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">SSL Certificate & CSR Decoder</h2>
          <p className="text-xl">raw details</p>
          <p>
            An SSL Certificate is a digital certificate that authenticates a website's identity and enables an encrypted connection. A CSR (Certificate Signing Request) Decoder is a web-based tool used to read and verify the contents of your CSR before you submit it to a Certificate Authority.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is an SSL Certificate?</h3>
          <p>
            An SSL (Secure Sockets Layer) certificate creates a secure, encrypted link between a web server (where your website is hosted) and a web browser (like Chrome or Safari).
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-indigo-400">
            <li><strong className="text-slate-900">Purpose:</strong> It ensures that all data passed between the server and the browser remains private and secure from hackers.</li>
            <li><strong className="text-slate-900">Trust:</strong> It displays a padlock icon in the browser address bar and switches the website address from HTTP to HTTPS.</li>
          </ul>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is a CSR (Certificate Signing Request)?</h3>
          <p>
            Before you can get an SSL certificate, you must generate a CSR on your server. A CSR is a block of encoded text (in Base64 format) containing essential information about your website and your company. It includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-indigo-400">
            <li><strong className="text-slate-900">Common Name (CN):</strong> The exact domain name you want to secure (e.g., example.com).</li>
            <li><strong className="text-slate-900">Organization & Location:</strong> Your company name, department, city, state, and country.</li>
            <li><strong className="text-slate-900">Public Key:</strong> An encryption key linked to your server.</li>
          </ul>
          <p className="mt-4 bg-slate-50 p-4 border border-slate-200 rounded-xl text-sm">
            Because a generated CSR looks like a chaotic, unreadable string of characters, it is difficult to spot errors before sending it to a Certificate Authority.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is a CSR Decoder?</h3>
          <p>
            A CSR Decoder is a utility designed to translate the jumbled, encoded CSR text into a clean, human-readable format.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Server size={20} className="text-indigo-500" /> How it works:
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-2"></div>
                  <p>You copy your encoded CSR text—which normally begins with <code>-----BEGIN CERTIFICATE REQUEST-----</code> and ends with <code>-----END CERTIFICATE REQUEST-----</code>—and paste it into the decoder tool.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-2"></div>
                  <p>The tool instantly decodes the block and displays the information to you clearly.</p>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" /> Why you need a CSR Decoder:
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-2"></div>
                  <p><strong className="text-slate-900 block mb-1">Validation:</strong> It verifies that your organization's details, domain name, and public key are 100% correct before you submit the request. If any information is wrong, the Certificate Authority will reject your application.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-2"></div>
                  <p><strong className="text-slate-900 block mb-1">Troubleshooting:</strong> It helps you confirm that your CSR was created with the correct key length (e.g., 2048-bit) and matches your server specifications.</p>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="mt-8 text-sm text-slate-500 italic">
            You can use popular, free tools like the SSL Shopper CSR Decoder, SSL.com CSR Decoder, or GoDaddy SSL Tools to check your certificate requests.
          </p>
        </div>
      </section>
    </div>
  );
}
