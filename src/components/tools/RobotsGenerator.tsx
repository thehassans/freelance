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
  ArrowRight,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

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
  const [crawlDelay, setCrawlDelay] = useState<string>('');
  const [blockAi, setBlockAi] = useState(false);
  const [preset, setPreset] = useState<string>('wordpress');
  const [copied, setCopied] = useState(false);

  const addDirective = () => {
    setDirectives(prev => [...prev, { id: Math.random().toString(), type: 'Disallow', path: '/' }]);
    setPreset('custom');
  };

  const removeDirective = (id: string) => {
    setDirectives(prev => prev.filter(d => d.id !== id));
    setPreset('custom');
  };

  const updateDirective = (id: string, field: keyof Directive, value: string) => {
    setDirectives(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
    setPreset('custom');
  };

  const handlePresetChange = (selectedPreset: string) => {
    setPreset(selectedPreset);
    if (selectedPreset === 'wordpress') {
      setDirectives([
        { id: '1', type: 'Disallow', path: '/wp-admin/' },
        { id: '2', type: 'Allow', path: '/wp-admin/admin-ajax.php' }
      ]);
      toast.success('WordPress rules loaded successfully!');
    } else if (selectedPreset === 'shopify') {
      setDirectives([
        { id: '1', type: 'Disallow', path: '/checkout/' },
        { id: '2', type: 'Disallow', path: '/cart/' },
        { id: '3', type: 'Disallow', path: '/orders/' }
      ]);
      toast.success('Shopify rules loaded successfully!');
    } else {
      toast.info('Custom presets selected. Feel free to modify crawler rules.');
    }
  };

  const generatedText = useMemo(() => {
    let text = `User-agent: ${userAgent}\n`;
    directives.forEach(d => {
      text += `${d.type}: ${d.path}\n`;
    });
    if (crawlDelay && crawlDelay.trim()) {
      text += `Crawl-delay: ${crawlDelay.trim()}\n`;
    }
    
    if (blockAi) {
      text += `\nUser-agent: GPTBot\nDisallow: /\n`;
      text += `\nUser-agent: CCBot\nDisallow: /\n`;
      text += `\nUser-agent: Anthropic-ai\nDisallow: /\n`;
    }

    if (sitemapUrl && sitemapUrl.trim()) {
      text += `\nSitemap: ${sitemapUrl.trim()}\n`;
    }
    return text;
  }, [userAgent, directives, sitemapUrl, crawlDelay, blockAi]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast.success('Robots.txt content copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "robots.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Robots.txt downloaded successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-amber-100"
        >
          <ShieldCheck size={12} /> Technical SEO Framework
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Advanced <span className="text-amber-600">Robots.txt</span> Generator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Prevent catastrophic SEO mistakes. Generate validated, error-free robots.txt files designed for modern search engine crawlers and e-commerce setups.
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

            <div className="space-y-6 flex-1">
              {/* CMS Preset */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Load Preset</label>
                 <select 
                   value={preset} 
                   onChange={(e) => handlePresetChange(e.target.value)}
                   className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all text-sm cursor-pointer"
                 >
                   <option value="custom">Custom (Default)</option>
                   <option value="wordpress">WordPress</option>
                   <option value="shopify">Shopify</option>
                 </select>
              </div>

              {/* User Agent */}
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">User Agent</label>
                 <input 
                   type="text" 
                   value={userAgent} 
                   onChange={(e) => {
                     setUserAgent(e.target.value);
                     setPreset('custom');
                   }}
                   placeholder="*"
                   className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all text-sm"
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
                          onChange={(e) => updateDirective(directive.id, 'type', e.target.value as any)}
                          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none text-sm cursor-pointer"
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
                          className="p-3 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                          aria-label="Remove Crawl Rule"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                 </div>
                 <button 
                   onClick={addDirective}
                   className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:border-slate-200 hover:text-slate-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                 >
                   <Plus size={16} /> Add Crawler Rule
                 </button>
              </div>

              {/* Block AI Scrapers Toggle */}
              <div className="flex items-center justify-between p-5 bg-amber-50/40 border border-amber-100 rounded-2xl">
                <div className="space-y-1 pr-4">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Bot size={14} className="text-amber-600" /> Block AI Scrapers & Crawlers
                  </span>
                  <span className="text-[10.5px] text-slate-500 block leading-relaxed font-sans">
                    Instantly restrict GPTBot, CCBot, and Anthropic-ai to preserve brand content and save hosting bandwidth.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setBlockAi(!blockAi)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    blockAi ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                  aria-label="Toggle Block AI Scrapers & Crawlers"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      blockAi ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Extra Directives Grid (Sitemap & Crawl Delay) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="space-y-2">
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

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Crawl-Delay (Optional)</label>
                   <div className="relative">
                     <input 
                       type="number" 
                       value={crawlDelay} 
                       onChange={(e) => setCrawlDelay(e.target.value)}
                       placeholder="e.g. 10"
                       min="1"
                       className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all text-sm"
                     />
                   </div>
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
                      className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all flex items-center gap-2 font-bold text-xs cursor-pointer"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button 
                      onClick={downloadTxt}
                      className="p-3 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl transition-all flex items-center gap-2 font-bold text-xs shadow-xl shadow-indigo-500/20 cursor-pointer"
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

      {/* Strict Layout Isolation for SEO Content (Bottom Area) */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">What is a Robots.txt File?</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-4">
          A robots.txt file is a simple text file placed in the root directory of your website. It acts as the instruction manual for search engine crawlers (like Googlebot or Bingbot), telling them which pages or files they are allowed to request and which ones they should ignore.
        </p>
        <p className="text-slate-600 leading-relaxed font-medium mb-8">
          It is the foundation of the Robots Exclusion Protocol (REP) and is usually the first file a search engine checks when accessing your domain.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Why is Robots.txt Crucial for Technical SEO?</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-6">
          A misconfigured robots.txt file can completely de-index your website, wiping out your organic traffic overnight. Conversely, a highly optimized file improves your SEO performance in several ways:
        </p>

        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">1. Optimizing Crawl Budget</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Search engines allocate a specific "crawl budget" to your site. If bots waste time crawling low-value pages (like admin dashboards, cart pages, or infinite parameter URLs), they might miss your high-value content. Blocking these areas ensures bots focus on what matters.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">2. Preventing Duplicate Content</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              E-commerce stores often generate dynamic URLs for sorting and filtering (e.g., price=low-to-high). Using robots.txt to disallow these parameter strings prevents search engines from indexing hundreds of duplicate pages.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">3. Protecting Server Resources</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Aggressive crawlers can spike server load, slowing down your website for actual human users. Applying specific directives (or crawl delays for non-Google bots) helps manage server bandwidth.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Key Robots.txt Directives Explained</h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium mb-8">
          <li><strong>User-agent:</strong> Specifies which bot the rules apply to. Using an asterisk (*) applies the rules to all crawlers.</li>
          <li><strong>Disallow:</strong> Tells the crawler exactly which URL paths or directories it is forbidden from accessing.</li>
          <li><strong>Allow:</strong> Used to override a broader Disallow rule. For example, you might disallow a whole folder but Allow a specific script inside it.</li>
          <li><strong>Sitemap:</strong> Points search engines to your XML sitemap, making it easier for them to discover your approved pages.</li>
        </ul>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Best Practices for Deployment</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-8">
          Always validate your generated file before deploying it to your live server. Once uploaded to your root directory, use Google Search Console to test the file and ensure you aren't accidentally blocking critical assets like CSS or JavaScript files, which Google needs to properly render your site.
        </p>
      </section>
    </div>
  );
}
