import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Terminal, 
  Clock, 
  Hash, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  FileCode,
  Zap,
  BookOpen,
  Info
} from 'lucide-react';

export default function HtmlWordCounter() {
  const [inputText, setInputText] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    // Strip HTML tags for accurate word counting
    const cleanText = inputText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const charsWithSpaces = inputText.length;
    const charsWithoutSpaces = inputText.replace(/\s/g, '').length;
    
    // Average reading time (225 words per minute)
    const readingTime = Math.ceil(words / 225);

    return {
      wordCount: words.toLocaleString(),
      charTotal: charsWithSpaces.toLocaleString(),
      charPure: charsWithoutSpaces.toLocaleString(),
      time: readingTime,
      htmlTags: (inputText.match(/<[^>]*>?/gm) || []).length
    };
  }, [inputText]);

  const faqs = [
    {
      question: "Why strip HTML tags for word count?",
      answer: "Standard word counters count code tags like <div>, <p>, and <a> as words. For SEO and content auditing, you only care about the text the end-user actually reads. Stripping HTML ensures your metrics reflect the content's real value, not its technical structure."
    },
    {
      question: "What is the optimal word count for SEO?",
      answer: "There is no 'magic number' that works for every query. However, long-form content (1,500+ words) often ranks better because it provides more comprehensive answers. The key is matching the 'search intent' of the user rather than hitting a specific quota."
    },
    {
      question: "How is reading time calculated?",
      answer: "Reading time is calculated using an industry-standard average of 225 words per minute (WPM). This accounts for adult reading speeds on digital screens, providing a realistic estimate for blog posts and articles."
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
          <Terminal size={12} /> Content Strategy Audit
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          HTML <span className="text-slate-600">Word Count</span> & Timer
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Strip the code. Audit the content. Get accurate word counts and reading time estimates by ignoring HTML tags.
        </p>
      </div>

      <div className="space-y-8">
        {/* Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">True Word Count</p>
              <p className="text-4xl font-black tracking-tight relative z-10">{stats.wordCount}</p>
              <Type className="absolute right-6 bottom-6 text-white/5 group-hover:scale-110 transition-transform" size={40} />
           </div>
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Reading Time</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-slate-900">{stats.time}</span>
                 <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Mins</span>
              </div>
              <Clock className="absolute right-6 bottom-6 text-slate-50" size={40} />
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">HTML Tags Stripped</p>
              <p className="text-4xl font-black text-slate-900">{stats.htmlTags}</p>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Characters</p>
              <p className="text-4xl font-black text-slate-900">{stats.charTotal}</p>
           </div>
        </div>

        {/* Input Area */}
        <section className="bg-white p-4 rounded-[3.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
           <div className="absolute top-8 right-12 z-20 flex gap-2">
              <button 
                onClick={() => setInputText('')}
                className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs"
              >
                <Trash2 size={14} /> Clear
              </button>
           </div>
           <textarea 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Paste your blog content or raw HTML source code here..."
             className="w-full h-[500px] p-12 bg-slate-50 rounded-[2.5rem] border-none focus:ring-0 font-mono text-slate-600 text-lg leading-relaxed placeholder:text-slate-300 resize-none"
           />
           <div className="absolute bottom-12 right-12 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100">
             Character Count: {stats.charTotal}
           </div>
        </section>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Stop counting HTML tags as words.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <FileCode size={40} className="text-slate-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Technical SEOs and Content Managers often struggle with 'Word Count Saturation' because standard word counters fail to distinguish between code and copy. This tool provides a deterministic clean-up of your input, ensuring your long-form benchmarks are actually based on text.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 font-sans">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={14} className="text-indigo-600" /> Accuracy First
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Automatically identifies and ignores all elements within angle brackets to provide a 'pure' text measurement.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <BookOpen size={14} className="text-emerald-600" /> UX Auditing
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Set user expectations by accurately predicting reading time, helping you reduce bounce rates on long-form articles.
                       </p>
                    </div>
                 </div>
                 <p>
                    In the era of information density, the quality of your words matters as much as the quantity. By stripping out the technical overhead of your CMS or HTML editor, you can focus on the core messaging that drives your conversion performance.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Content Analytics FAQ</h2>
              <p className="text-slate-500 font-medium">Insights into measuring and optimizing your written assets.</p>
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
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Verify Your <br/>Content Value.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of content strategists who use our tools to audit their technical SEO and optimize read times.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-slate-900 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your Copy <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
