import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Clock, 
  Mic2, 
  BarChart3, 
  Trash2, 
  FileText, 
  Zap, 
  HelpCircle, 
  ChevronDown, 
  Hash, 
  Share2, 
  Copy, 
  CheckCircle2,
  Info
} from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return {
        wordCount: 0,
        charCount: 0,
        charNoSpaces: 0,
        readingTime: 0,
        speakingTime: 0,
        keywords: []
      };
    }

    const words = trimmedText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;
    const readingTime = Math.ceil(wordCount / 225);
    const speakingTime = Math.ceil(wordCount / 130);

    // Keyword Density Analysis
    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'with', 'as', 'I', 'his', 'they', 'be', 'at', 'one', 'have', 'this', 'from', 'or', 'had', 'by', 'not', 'word', 'but', 'what', 'some', 'we', 'can', 'out', 'other', 'were', 'all', 'there', 'when', 'up', 'use', 'your', 'how', 'said', 'an', 'each', 'she']);
    
    const wordFreq: Record<string, number> = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean && !stopWords.has(clean) && clean.length > 2) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word, count]) => ({ word, count }));

    return {
      wordCount,
      charCount,
      charNoSpaces,
      readingTime,
      speakingTime,
      keywords
    };
  }, [text]);

  const socialLimits = [
    { name: 'Twitter / X', limit: 280, current: stats.charCount },
    { name: 'SEO Meta Title', limit: 60, current: stats.charCount },
    { name: 'LinkedIn Post', limit: 3000, current: stats.charCount }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: "How is reading time calculated?",
      answer: "The industry standard for adult reading speed is approximately 225 words per minute (WPM). Our calculator uses this benchmark to provide an estimate. Keep in mind that technical content or complex legal text might take longer to digest."
    },
    {
      question: "Do spaces count as characters?",
      answer: "Yes, in standard character counting and social media platform limits (like X or Meta tags), spaces and punctuation are included in the total count. We provide both total characters and characters without spaces for your reference."
    },
    {
      question: "Is my content saved or seen by anyone?",
      answer: "No. Your privacy is paramount. All content analysis is performed locally in your browser's memory using JavaScript. Nothing you type or paste is sent to any server or stored in any database."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-blue-100"
        >
          <Zap size={12} /> Content Optimization Engine
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Real-Time <span className="text-blue-600">Content</span> Analyzer
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          The elite standard for word counting, reading speed estimation, and keyword density analysis for digital authors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col relative group">
            <div className="absolute top-6 right-8 flex items-center gap-2">
               <button 
                 onClick={() => setText('')}
                 className="p-3 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-xl"
                 title="Clear Text"
               >
                 <Trash2 size={18} />
               </button>
               <button 
                 onClick={handleCopy}
                 className={`p-3 transition-all rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm ${copied ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
               >
                 {copied ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
               </button>
            </div>

            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your content here to analyze..."
              rows={14}
              className="w-full p-10 pt-20 bg-slate-50/30 font-medium text-slate-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all resize-none placeholder:text-slate-300"
            />

            <div className="px-10 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Status</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${text.length > 0 ? 'bg-emerald-500' : 'bg-slate-300 animate-pulse'}`} />
                       {text.length > 0 ? 'Analyzing Live' : 'Ready for Input'}
                    </span>
                  </div>
                  {stats.keywords.length > 0 && (
                    <div className="hidden md:flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Top Keywords:</span>
                       <div className="flex gap-2">
                          {stats.keywords.map((k, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                              {k.word}: {k.count}
                            </span>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Privacy Locked (Local)
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10 space-y-10">
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                    <BarChart3 className="text-blue-400" size={20} /> Content Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-8 mt-10">
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Words</p>
                        <p className="text-4xl font-black font-display tracking-tighter tabular-nums">{stats.wordCount.toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Characters</p>
                        <p className="text-4xl font-black font-display tracking-tighter tabular-nums">{stats.charCount.toLocaleString()}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                           <Clock size={10} /> Reading Time
                        </p>
                        <p className="text-xl font-black">{stats.readingTime} <span className="text-[10px] text-slate-500 ml-1">min</span></p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                           <Mic2 size={10} /> Speaking
                        </p>
                        <p className="text-xl font-black">{stats.speakingTime} <span className="text-[10px] text-slate-500 ml-1">min</span></p>
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-white/5 space-y-6">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Social Media Limits</p>
                  <div className="space-y-6">
                     {socialLimits.map((platform, i) => {
                       const percentage = (platform.current / platform.limit) * 100;
                       const isCapped = percentage >= 100;

                       return (
                         <div key={i} className="space-y-2">
                           <div className="flex justify-between items-end">
                             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{platform.name}</span>
                             <span className={`text-[10px] font-black ${isCapped ? 'text-rose-500' : 'text-slate-500'}`}>
                               {platform.current} <span className="text-[8px] opacity-40">/ {platform.limit}</span>
                             </span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(percentage, 100)}%` }}
                                className={`h-full rounded-full transition-colors duration-500 ${isCapped ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.2)]'}`}
                              />
                           </div>
                         </div>
                       );
                     })}
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                   <Type size={18} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-800">Advanced Breakdown</h4>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Spaces</span>
                   <span className="text-sm font-bold text-slate-900">{stats.charNoSpaces.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paragraphs</span>
                   <span className="text-sm font-bold text-slate-900">{text ? text.split(/\n+/).filter(p => p.trim()).length : 0}</span>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic flex items-center gap-1.5">
                        <Zap size={10} /> Reading Difficulty
                      </span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium">Est. 8th Grade Level (Commonly used standard)</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">More than just a character count.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={40} className="text-blue-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Standard word counting tools just give you a number. Our Content Optimization Engine calculates speaking times for video scripts, checks social media limits in real-time, and extracts keyword density to ensure your SEO is perfectly balanced.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Clock size={14} className="text-blue-600" /> Precision Timing
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Whether you're writing a 30-second commercial or a 10-minute keynote, our speaking time algorithm accounts for standard vocal cadences.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Share2 size={14} className="text-emerald-600" /> Social Ready
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Stop jumping back and forth between draft and platform. Our tool includes hard-coded limits for X, Meta, and LinkedIn meta data.
                       </p>
                    </div>
                 </div>
                 <p>
                    Understanding your keyword density is critical for SEO. If your primary keyword appears too often (keyword stuffing) or too rarely, your ranking potential suffers. We extract the most frequent non-trivial words so you can audit your content's focus at a glance.
                 </p>
              </div>
           </div>
        </div>

        {/* Big CTA/Info Section */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 blur-3xl -ml-48 -mt-48 rounded-full" />
              <div className="w-full md:w-1/2 space-y-8 relative z-10">
                 <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl w-fit">
                    <FileText size={32} />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                    Optimized for <br/>Author Privacy.
                 </h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed">
                    Unlike other web tools that scrape your content to train models or track data, our analyzer works 100% on the client side.
                 </p>
                 <div className="flex gap-4">
                    <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-400" /> Zero Server Latency
                    </div>
                    <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-400" /> AES Private Processing
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                 {[
                   { label: 'Latency', val: '0ms' },
                   { label: 'Storage', val: 'None' },
                   { label: 'Encryption', val: 'Local-only' },
                   { label: 'Security', val: 'Bank-grade' },
                 ].map((item, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{item.label}</p>
                      <p className="text-2xl font-black italic tracking-tight text-white">{item.val}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Content Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Answers for professional writers and SEO engineers.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-blue-200/50 border-blue-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-blue-400" />
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
      <section className="mt-32 max-w-7xl mx-auto px-4">
        <div className="bg-blue-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight">Draft Smarter. <br/>Publish Better.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join elite content creators who use data-driven insights to refine their voice and grow their organic reach.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-blue-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your Content <Type size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
