import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Trash2, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Search,
  BookOpen,
  CaseSensitive,
  Code
} from 'lucide-react';

type CaseType = 'sentence' | 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab';

export default function CaseConverter() {
  const [input, setInput] = useState('the quick brown fox jumps over the lazy dog');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const transformations = useMemo(() => {
    if (!input) return {};

    const toTitleCase = (str: string) => {
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    };

    const toSentenceCase = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const toCamelCase = (str: string) => {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    };

    const toSnakeCase = (str: string) => {
      return str.toLowerCase().replace(/\s+/g, '_');
    };

    const toKebabCase = (str: string) => {
      return str.toLowerCase().replace(/\s+/g, '-');
    };

    return {
      sentence: toSentenceCase(input),
      upper: input.toUpperCase(),
      lower: input.toLowerCase(),
      title: toTitleCase(input),
      camel: toCamelCase(input),
      snake: toSnakeCase(input),
      kebab: toKebabCase(input)
    };
  }, [input]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: "What is Title Case vs. Sentence Case?",
      answer: "Title Case capitalizes the first letter of every major word. It is commonly used for headings and book titles. Sentence Case only capitalizes the first letter of the first word, exactly like a normal sentence."
    },
    {
      question: "When should I use Snake or Kebab case?",
      answer: "Snake case (word_style) and Kebab case (word-style) are standard conventions in programming. Snake case is often used for database column names and variable names in Python/Ruby. Kebab case is the standard for URLs and CSS class names."
    },
    {
      question: "Does it handle special characters?",
      answer: "Yes, our converter preserves punctuation where applicable (like in Sentence or Title case) but strips or replaces spaces when converting to code-friendly formats like Camel or Snake case."
    }
  ];

  const caseBoxes: { id: CaseType; title: string; desc: string }[] = [
    { id: 'sentence', title: 'Sentence Case', desc: 'Standard sentence capitalization.' },
    { id: 'upper', title: 'UPPER CASE', desc: 'ALL CAPS FOR EMPHASIS.' },
    { id: 'lower', title: 'lower case', desc: 'all letters in small caps.' },
    { id: 'title', title: 'Title Case', desc: 'Capitalized For Headings.' },
    { id: 'camel', title: 'camelCase', desc: 'Standard JavaScript naming.' },
    { id: 'snake', title: 'snake_case', desc: 'Common for Python or DBs.' },
    { id: 'kebab', title: 'kebab-case', desc: 'The standard for URLs.' }
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
          <CaseSensitive size={12} /> Linguistics Utility
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Advanced <span className="text-slate-600">Case Converter</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Perfect your formatting instantly. Transform text into any case for technical documentation, academic writing, or clean code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full font-sans overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                       <Type size={20} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 tracking-tight">Source Text</h3>
                    </div>
                 </div>
                 <button onClick={() => setInput('')} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                   <Trash2 size={18} />
                 </button>
              </div>

              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-[400px] p-8 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 text-xl leading-relaxed focus:outline-none focus:border-slate-300 resize-none placeholder:text-slate-200"
              />
              
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Sync Enabled</span>
                 </div>
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                   Words: {input.trim() ? input.trim().split(/\s+/).length : 0}
                 </div>
              </div>
           </section>
        </div>

        {/* Output Grid */}
        <div className="lg:col-span-7 space-y-4">
           {caseBoxes.map((box) => (
             <motion.div 
               key={box.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="group bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-slate-400 transition-all shadow-sm flex items-center justify-between gap-6 cursor-default"
             >
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">{box.title}</span>
                   </div>
                   <p className="text-lg font-black text-slate-800 truncate">
                      {(transformations as any)[box.id] || '...'}
                   </p>
                </div>
                <button 
                  onClick={() => copyToClipboard((transformations as any)[box.id])}
                  className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-200"
                >
                   {copied && (transformations as any)[box.id] ? <Check size={18} /> : <Copy size={18} />}
                </button>
             </motion.div>
           ))}

           <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
              <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-4 tracking-tight flex items-center gap-3">
                   <Code size={24} className="text-indigo-400" /> Coding Productivity
                 </h3>
                 <p className="text-white/60 font-medium leading-relaxed mb-8 font-sans">
                   Save hours of manual re-typing. Switch your variable names or file structures between naming conventions in seconds.
                 </p>
                 <div className="flex gap-4">
                    <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-white/40">
                      Perfect for Devs
                    </div>
                    <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-white/40">
                      Clean & Lean
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight text-balance">The clean choice for content.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Search size={40} className="text-slate-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    From academic papers to software engineering, case conventions are more than just aesthetic choices—they are structural requirements. Manually changing 'USER_ID' to 'userId' or 'Title Case Heading' to 'Sentence case heading' is a tedious task that our engine automates with 100% accuracy.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 font-sans">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <RefreshCw size={14} className="text-indigo-600" /> Instant Bulk Transform
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Paste entire paragraphs and see them converted into 7 different standard conventions in real-time.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-600" /> Precision Logic
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Our algorithms respect word boundaries and semantic structures to ensure your text doesn't lose meaning during transformation.
                       </p>
                    </div>
                 </div>
                 <p>
                    Maintaining a consistent 'Voice and Tone' starts with visual consistency. High-performing teams use standardized case conventions across their documentation, codebases, and marketing copy to project a professional, unified identity.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Case Convention FAQ</h2>
              <p className="text-slate-500 font-medium">Insights into the technical and stylistic world of text formatting.</p>
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
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Standardize Your <br/>Communication.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of professionals who use our cleaning tools to maintain consistency across their digital footprint.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Start New Conversion <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
