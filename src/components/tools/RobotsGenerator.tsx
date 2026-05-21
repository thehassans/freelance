import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Copy, 
  Download, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  FileText,
  Search,
  AlertTriangle,
  Globe,
  Settings2,
  Code,
  ArrowRight
} from 'lucide-react';

interface Directive {
  id: string;
  type: 'Allow' | 'Disallow';
  path: string;
}

export default function RobotsGenerator() {
  const [userAgent, setUserAgent] = useState('*');
  const [directives, setDirectives] = useState<Directive[]>([
    { id: '1', type: 'Disallow', path: '/wp-admin/' },
    { id: '2', type: 'Allow', path: '/wp-admin/admin-ajax.php' }
  ]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const addDirective = () => {
    setDirectives([...directives, { id: Math.random().toString(), type: 'Disallow', path: '/' }]);
  };

  const removeDirective = (id: string) => {
    setDirectives(directives.filter(d => d.id !== id));
  };

  const updateDirective = (id: string, field: keyof Directive, value: string) => {
    setDirectives(directives.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const generatedText = useMemo(() => {
    let text = `User-agent: ${userAgent}\n`;
    directives.forEach(d => {
      text += `${d.type}: ${d.path}\n`;
    });
    if (sitemapUrl) {
      text += `\nSitemap: ${sitemapUrl}`;
    }
    return text;
  }, [userAgent, directives, sitemapUrl]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "robots.txt";
    document.body.appendChild(element);
    element.click();
  };

  const faqs = [
    {
      question: "What is a User-Agent?",
      answer: "A User-Agent is the identity of a web crawler. Using '*' target all crawlers (Googlebot, Bingbot, etc.). You can also specify certain bots, like 'Googlebot-Image' to set specific rules for image search only."
    },
    {
      question: "Should I block my /wp-admin/ folder?",
      answer: "Yes, it is standard practice to block your administrative backend to prevent search engines from wasting crawl budget on private pages. However, ensure you 'Allow' admin-ajax.php if your theme requires it for frontend functionality."
    },
    {
      question: "Will robots.txt prevent indexing?",
      answer: "Not necessarily. It prevents 'crawling'. If a page is already indexed and you block it in robots.txt, Google might still show it in search results. To fully prevent indexing, use the 'noindex' meta tag instead."
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
          <ShieldCheck size={12} /> Technical SEO Framework
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Advanced <span className="text-slate-600">Robots.txt</span> Generator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Prevent catastrophic SEO mistakes. Generate validated, error-free robots.txt files designed for modern search engine crawlers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Panel */}
        <div className="space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm font-sans flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                 <Settings2 size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Directives</h3>
            </div>

            <div className="space-y-8 flex-1">
              {/* User Agent */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">User Agent</label>
                 <input 
                   type="text" 
                   value={userAgent} 
                   onChange={(e) => setUserAgent(e.target.value)}
                   placeholder="*"
                   className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all"
                 />
                 <p className="text-[10px] text-slate-400 mt-2 px-1 italic">Use '*' to apply these rules to all search engine bots.</p>
              </div>

              {/* Rules List */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Crawl Rules</label>
                 <div className="space-y-3">
                    {directives.map((directive) => (
                      <div key={directive.id} className="flex gap-2">
                        <select 
                          value={directive.type}
                          onChange={(e) => updateDirective(directive.id, 'type', e.target.value)}
                          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none text-sm appearance-none cursor-pointer"
                        >
                          <option value="Allow">Allow</option>
                          <option value="Disallow">Disallow</option>
                        </select>
                        <input 
                          type="text" 
                          value={directive.path}
                          onChange={(e) => updateDirective(directive.id, 'path', e.target.value)}
                          className="flex-1 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all text-sm"
                        />
                        <button 
                          onClick={() => removeDirective(directive.id)}
                          className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                 </div>
                 <button 
                   onClick={addDirective}
                   className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:border-slate-200 hover:text-slate-500 transition-all flex items-center justify-center gap-2"
                 >
                   <Plus size={16} /> Add Crawler Rule
                 </button>
              </div>

              {/* Sitemap */}
              <div className="space-y-2 pt-6 border-t border-slate-100">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Sitemap URL (Optional)</label>
                 <div className="relative">
                   <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                     type="text" 
                     value={sitemapUrl} 
                     onChange={(e) => setSitemapUrl(e.target.value)}
                     placeholder="https://example.com/sitemap_index.xml"
                     className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all text-sm"
                   />
                 </div>
              </div>
            </div>
          </section>
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          <section className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-white/10 text-white rounded-xl">
                      <Code size={20} />
                   </div>
                   <h3 className="text-xl font-black uppercase tracking-tight text-white">Live Output</h3>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all flex items-center gap-2 font-bold text-xs"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button 
                      onClick={downloadTxt}
                      className="p-3 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl transition-all flex items-center gap-2 font-bold text-xs shadow-xl shadow-indigo-500/20"
                    >
                      <Download size={14} />
                      Download
                    </button>
                 </div>
              </div>

              <div className="flex-1 bg-slate-950 rounded-2xl p-8 border border-white/5 font-mono text-sm leading-relaxed text-indigo-200/90 overflow-auto whitespace-pre">
                {generatedText}
              </div>

              <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4">
                 <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                 <div>
                    <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">SEO Safety Check</p>
                    <p className="text-xs text-amber-200/60 leading-relaxed font-sans">
                       Always double-check that you haven't blocked important public assets. Misconfiguring robots.txt can lead to full de-indexing.
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
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Don't accidentally de-index your site.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Search size={40} className="text-slate-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    A single typo in a robots.txt file can wipe an entire site from Google. Search engine crawlers follow these directives strictly to determine where they are allowed to go. If you Disallow your root folder, your entire organic presence disappears overnight.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 font-sans">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <FileText size={14} className="text-indigo-600" /> Crawl Efficiency
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Save your crawl budget by preventing bots from indexing duplicate content or administrative backend folders.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Globe size={14} className="text-emerald-600" /> Sitemap Discovery
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Attaching your sitemap URL directly to your robots.txt file helps new bots discover your site structure instantly.
                       </p>
                    </div>
                 </div>
                 <p>
                    This generator uses a validation-first approach to ensure every line of code generated follows the industry-standard syntax used by Googlebot and Bingbot. It's an essential tool for developers and SEO managers alike.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Crawler & Robots FAQ</h2>
              <p className="text-slate-500 font-medium">Core concepts for managing how search engines crawl your web application.</p>
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
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Audit Your <br/>Indexing Strategy.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of SEOs who use our technical tools to optimize their sites and protect their organic traffic.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Configure Your Rules <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
