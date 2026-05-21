import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeftRight, 
  Trash2, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  Code2,
  FileText,
  Zap,
  RefreshCw,
  Search,
  BookOpen
} from 'lucide-react';

export default function HtmlTextConverter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'html-to-text' | 'text-to-html'>('html-to-text');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    if (mode === 'html-to-text') {
      // Basic HTML to Text conversion
      let text = input;
      // Replace breaks with newlines
      text = text.replace(/<br\s?\/?>/gi, '\n');
      // Replace paragraphs with double newlines
      text = text.replace(/<\/p>/gi, '\n\n');
      // Strip remaining tags
      text = text.replace(/<[^>]*>?/gm, '');
      // Decode basic entities
      text = text.replace(/&nbsp;/g, ' ')
                 .replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&quot;/g, '"');
      setOutput(text.trim());
    } else {
      // Basic Text to HTML conversion
      let html = input;
      html = html.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;');
      html = html.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('\n');
      setOutput(html);
    }
  }, [input, mode]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: "When should I use HTML to Text?",
      answer: "This is essential when creating plain-text versions of HTML emails (required for anti-spam compliance) or stripping nested formatting when pasting content into a new editor or CMS."
    },
    {
      question: "How does the Text to HTML logic work?",
      answer: "The converter identifies double line breaks as paragraphs (<p>) and single line breaks as line breaks (<br />). It also safely escapes special characters to prevent your text from breaking the HTML structure."
    },
    {
      question: "Does it support deep nested CSS styles?",
      answer: "Currently, the converter focuses on semantic structure. It will strip out <style> tags and inline 'style' attributes to give you the cleanest possible output for migration or plain-text use."
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
          <ArrowLeftRight size={12} /> Format Transformation Hub
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Bi-Directional <span className="text-slate-600">HTML Converter</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Seamlessly switch between structured code and plain text for emails, CMS migration, and clean copy editing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Panel */}
        <div className="space-y-6">
           <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full font-sans">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-colors ${mode === 'html-to-text' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                       {mode === 'html-to-text' ? <Code2 size={20} /> : <FileText size={20} />}
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Source Input</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                         Format: {mode === 'html-to-text' ? 'HTML Source' : 'Plain Text'}
                       </p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setMode(mode === 'html-to-text' ? 'text-to-html' : 'html-to-text')}
                   className="p-3 bg-slate-900 text-white rounded-xl hover:scale-105 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 font-bold text-xs"
                 >
                    <RefreshCw size={14} /> Switch
                 </button>
              </div>

              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'html-to-text' ? "Paste <p>HTML tags here...</p>" : "Type your plain text here..."}
                className="w-full h-[400px] p-8 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-sm text-slate-600 focus:outline-none focus:border-slate-300 resize-none"
              />
              
              <div className="mt-4 flex justify-between items-center px-2">
                 <button onClick={() => setInput('')} className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1.5">
                   <Trash2 size={14} /> Clear Input
                 </button>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                   {input.length.toLocaleString()} characters
                 </span>
              </div>
           </section>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
           <section className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 text-white">
                       <div className="p-2.5 bg-white/10 rounded-xl">
                          <Zap size={20} className="text-amber-400" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black uppercase tracking-tight">Clean Output</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                             Result: {mode === 'html-to-text' ? 'Plain Text' : 'Formatted HTML'}
                          </p>
                       </div>
                    </div>
                    <button 
                      onClick={copyOutput}
                      className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all flex items-center gap-2 font-bold text-xs"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy Output'}
                    </button>
                 </div>

                 <div className="flex-1 bg-slate-950 rounded-2xl p-8 border border-white/5 font-mono text-sm leading-relaxed text-indigo-100/80 overflow-auto whitespace-pre-wrap">
                    {output || 'Output will appear here...'}
                 </div>

                 <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-4">
                    <ShieldCheck size={20} className="text-indigo-400 shrink-0" />
                    <div>
                       <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Sanitization Active</p>
                       <p className="text-xs text-slate-400 leading-relaxed font-sans">
                         Your output is cleaned and escaped to ensure it doesn't execute malicious scripts or break target applications.
                       </p>
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
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight text-balance">Modern content conversion.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Search size={40} className="text-slate-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Transmitting content between different systems—like a CMS, an ESP, or a social scheduler—requires consistent formatting. This converter eliminates the friction of manual cleanup by providing a deterministic way to strip or add HTML structure to your text.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 font-sans">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <BookOpen size={14} className="text-indigo-600" /> Anti-Spam Compliance
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Easily generate the plain-text redundancy required for modern HTML marketing emails to improve deliverability.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={14} className="text-emerald-600" /> Migration Utility
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Migrate legacy blog content by stripping proprietary tags and simplifying the HTML for your new platform.
                       </p>
                    </div>
                 </div>
                 <p>
                    By focusing on clean semantics rather than visual styles, we ensure your text remains portable and accessible across all devices. Whether you're a developer building a parser or an editor preparing a newsletter, this tool provides the utility you need to maintain format integrity.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Conversion FAQ</h2>
              <p className="text-slate-500 font-medium">Core concepts for managing multi-format content pipelines.</p>
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
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Simplify Your <br/>Content Workflow.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of editors and developers who use our formatting tools to clean up their digital assets.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Start Converting <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
