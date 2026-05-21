import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code, 
  ShieldCheck, 
  Zap, 
  ChevronDown, 
  Copy, 
  Check, 
  Trash2, 
  AlignLeft, 
  Maximize2, 
  AlertCircle,
  HelpCircle,
  Cpu,
  FileJson
} from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const processJson = (mode: 'beautify' | 'minify') => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (mode === 'beautify') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const faqs = [
    {
      question: "What makes JSON invalid?",
      answer: "Common errors include trailing commas after the last item in an object or array, using single quotes instead of double quotes for strings/keys, unquoted keys, or mismatched brackets/braces."
    },
    {
      question: "Why should I minify JSON?",
      answer: "Minifying removes all unnecessary whitespace and line breaks, significantly reducing the file size. This is crucial for production APIs where smaller payloads lead to lower bandwidth costs and faster parsing times for client applications."
    },
    {
      question: "Can I format large JSON files?",
      answer: "Yes. Since this tool processes everything locally using your browser's JavaScript engine and your machine's memory, it can handle massive datasets (several megabytes) instantly without the latency associated with server-side processing."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-amber-100"
        >
          <Zap size={12} /> Privacy-First Developer Tools
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          JSON <span className="text-amber-600">Formatter</span> & Validator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Beautify, minify, and validate your JSON data with 100% local processing. No data ever leaves your device.
        </p>
      </div>

      <div className="space-y-6">
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 overflow-hidden"
            >
              <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="font-black text-red-900 text-sm uppercase tracking-tight">Syntax Error Detected</p>
                <p className="text-red-700 font-mono text-xs">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Input Side */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Input Raw JSON</label>
               <button 
                 onClick={clearAll}
                 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
               >
                 <Trash2 size={12} /> Clear
               </button>
            </div>
            <div className="relative flex-1 group">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Paste your JSON here (e.g. {"name": "FlowState"})'
                className="w-full h-[500px] p-8 bg-white border border-slate-200 rounded-[2.5rem] focus:outline-none focus:border-amber-500 font-mono text-sm leading-relaxed shadow-sm transition-all resize-none group-hover:border-slate-300"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => processJson('beautify')}
                className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                <AlignLeft size={16} /> Beautify JSON
              </button>
              <button 
                onClick={() => processJson('minify')}
                className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Maximize2 size={16} /> Minify JSON
              </button>
            </div>
          </div>

          {/* Output Side */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Formatted Output</label>
            </div>
            <div className="relative flex-1">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={handleCopy}
                  disabled={!output}
                  className={`p-3 rounded-xl transition-all border ${
                    output 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-white/5 border-white/5 text-slate-700 cursor-not-allowed'
                  }`}
                  title="Copy to Clipboard"
                >
                  {isCopying ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
              <div className="w-full h-[500px] bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-auto group">
                {output ? (
                  <pre className="p-8 font-mono text-sm leading-relaxed text-amber-400">
                    <code>{output}</code>
                  </pre>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center space-y-4">
                    <FileJson size={48} className="opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest opacity-40">Ready for processing</p>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block h-[56px]" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Privacy First Banner */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-emerald-50 rounded-[3rem] p-10 md:p-16 border border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <ShieldCheck size={120} className="text-emerald-600" />
              </div>
              <div className="relative z-10 max-w-3xl">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-600 text-white rounded-xl">
                      <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">100% Secure & Local Processing</h2>
                 </div>
                 <p className="text-xl text-emerald-900/70 font-medium leading-relaxed">
                    Unlike other formatters, this tool processes your JSON entirely within your browser. 
                    Your sensitive API payloads, tokens, and data never leave your device and are never sent to our servers. 
                    We can't see your data, and we don't want to.
                 </p>
              </div>
           </div>
        </div>

        {/* Core Features Grid */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">The Complete Payload Engine</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Essential tools for data engineering.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-200 hover:shadow-2xl transition-all"
              >
                 <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <AlignLeft size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4">Format & Beautify</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">
                    Convert unreadable, single-line JSON strings into perfectly indented, human-readable data structures with standard 2-space indentation.
                 </p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-200 hover:shadow-2xl transition-all"
              >
                 <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <AlertCircle size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4">Validate & Debug</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">
                    Instantly catch syntax errors, missing quotation marks, or illegal trailing commas with precise, browser-native error reporting.
                 </p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-200 hover:shadow-2xl transition-all"
              >
                 <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Maximize2 size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4">Minify & Compress</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">
                    Strip all whitespace and line breaks from your JSON to reduce payload size before sending it to production or via webhook.
                 </p>
              </motion.div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">JSON Syntax Guide</h2>
              <p className="text-slate-500 font-medium">Mastering the standard of web data exchange.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-amber-200/50 border-amber-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-amber-400" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="px-8 pb-8 pl-16">
                          <p className="text-slate-500 leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="mt-32 max-w-7xl mx-auto">
        <div className="bg-[#0f4c75] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <Cpu size={48} className="text-amber-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Process Data Faster <br/>With FlowState</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of engineers who trust our browser-native toolset for their daily data processing tasks.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-[#0f4c75] rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20"
            >
              Back to Formatter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
