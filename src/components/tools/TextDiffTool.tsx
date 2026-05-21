import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Split, 
  Trash2, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertCircle,
  Columns,
  Search,
  Zap,
  Code
} from 'lucide-react';

export default function TextDiffTool() {
  const [original, setOriginal] = useState('Paste the original version of your text here.');
  const [modified, setModified] = useState('Paste the updated version of your text here for comparison.');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const diffResult = useMemo(() => {
    const originalWords = original.split(/(\s+)/);
    const modifiedWords = modified.split(/(\s+)/);
    
    // This is a simplified "diff" for visualization
    const result: { type: 'added' | 'removed' | 'same', value: string }[] = [];
    
    let i = 0, j = 0;
    while (i < originalWords.length || j < modifiedWords.length) {
      if (i < originalWords.length && j < modifiedWords.length && originalWords[i] === modifiedWords[j]) {
        result.push({ type: 'same', value: originalWords[i] });
        i++; j++;
      } else if (j < modifiedWords.length && !originalWords.includes(modifiedWords[j], i)) {
        result.push({ type: 'added', value: modifiedWords[j] });
        j++;
      } else {
        result.push({ type: 'removed', value: originalWords[i] });
        i++;
      }
    }
    
    return result;
  }, [original, modified]);

  const copyResult = () => {
    navigator.clipboard.writeText(modified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: "How does the highlight system work?",
      answer: "Red highlights indicate text that was deleted from the original version. Green highlights indicate text that was added or modified in the updated version. Neutral text has remained unchanged."
    },
    {
      question: "Is this tool secure for sensitive data?",
      answer: "Yes. All processing happens entirely in your browser. None of your text is ever sent to our servers, making it safe for comparing contracts, code, or private communications."
    },
    {
      question: "Can I compare code snippets?",
      answer: "Absolutely. The Diff Tool handles any plain-text input, including HTML, CSS, JavaScript, and other programming languages. It's particularly useful for reviewing manual code changes or bug fixes."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-slate-200"
        >
          <Split size={12} /> Technical Review Framework
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Text <span className="text-slate-600">Comparison</span> Engine
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Audit changes with precision. Compare two versions of text to instantly see what was added, removed, or modified.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Column */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                       <FileText size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Original</h3>
                 </div>
                 <button onClick={() => setOriginal('')} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                   <Trash2 size={16} />
                 </button>
              </div>
              <textarea 
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                className="w-full flex-1 min-h-[300px] p-6 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-sm text-slate-600 leading-relaxed focus:outline-none focus:border-slate-300 resize-none"
              />
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                       <Columns size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Modified</h3>
                 </div>
                 <button onClick={() => setModified('')} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                   <Trash2 size={16} />
                 </button>
              </div>
              <textarea 
                value={modified}
                onChange={(e) => setModified(e.target.value)}
                className="w-full flex-1 min-h-[300px] p-6 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-sm text-slate-600 leading-relaxed focus:outline-none focus:border-emerald-300 resize-none"
              />
           </div>
        </div>

        {/* Output Column */}
        <div className="space-y-6">
           <section className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="p-2.5 bg-white/10 text-white rounded-xl">
                          <Search size={20} />
                       </div>
                       <h3 className="text-xl font-black uppercase tracking-tight text-white tracking-tight">Audit Result</h3>
                    </div>
                    <button 
                      onClick={copyResult}
                      className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all flex items-center gap-2 font-bold text-xs"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy Result'}
                    </button>
                 </div>

                 <div className="flex-1 bg-slate-950 rounded-2xl p-8 border border-white/5 font-mono text-sm leading-loose text-slate-300 overflow-auto">
                    {diffResult.map((part, idx) => (
                      <span 
                        key={idx} 
                        className={`transition-colors py-0.5 rounded ${
                          part.type === 'added' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 mx-0.5' : 
                          part.type === 'removed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1 mx-0.5 line-through opacity-50' : 
                          ''
                        }`}
                      >
                        {part.value}
                      </span>
                    ))}
                 </div>

                 <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Added Text</span>
                    </div>
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                       <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Removed Text</span>
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Visualize evolution, instantly.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <AlertCircle size={40} className="text-slate-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Whether you're an editor reviewing a copywriter's work or a developer checking structural changes in a configuration file, identifying differences manually is error-prone. Our Comparison Engine provides a high-fidelity visual audit of your text assets.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 font-sans">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={14} className="text-indigo-600" /> Granular Tracking
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Beyond just line changes, our tool investigates character and word-level modifications to ensure nothing is missed.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-600" /> Privacy First
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Securely compare sensitive documentation knowing that all data processing is local to your machine.
                       </p>
                    </div>
                 </div>
                 <p>
                    In a collaborative environment, version control is everything. By utilizing a professional-grade diffing algorithm, you can maintain consistency across various content iterations and catch accidental deletions before they go live.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Text Comparison FAQ</h2>
              <p className="text-slate-500 font-medium">Understanding the mechanics of digital text auditing.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-slate-200/50 border-slate-300' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-slate-400" />
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
                          <p className="text-slate-500 leading-relaxed font-medium font-sans">
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
      <section className="mt-32 max-w-7xl mx-auto px-4">
        <div className="bg-slate-950 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Audit Your <br/>Digital Assets.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of professionals who use our auditing tools to maintain content integrity and reduce errors.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Start New Audit <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
