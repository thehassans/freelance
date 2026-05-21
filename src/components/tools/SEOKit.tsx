import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ExternalLink, Globe, Search, Share2, History, FileText } from 'lucide-react';
import { historyService, HistoryItem } from '../../lib/history-service';

export default function SEOKit() {
  const [copied, setCopied] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [data, setData] = useState({
    title: '',
    description: '',
    url: '',
    image: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: ''
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const fullUrl = () => {
    const base = data.url || 'https://yourportfolio.com';
    const params = new URLSearchParams();
    if (data.utmSource) params.append('utm_source', data.utmSource);
    if (data.utmMedium) params.append('utm_medium', data.utmMedium);
    if (data.utmCampaign) params.append('utm_campaign', data.utmCampaign);
    
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const history = useMemo(() => historyService.getHistory().filter(i => i.toolId === 'seo-kit'), [showHistory]);

  const saveToHistory = () => {
    historyService.addToHistory({
      toolId: 'seo-kit',
      toolName: 'SEO Meta',
      summary: `SEO for ${data.title || 'Untitled Page'}`,
      data: { data }
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    setData(item.data.data);
    setShowHistory(false);
  };

  const metaHtml = `<!-- Primary Meta Tags -->
<title>${data.title || 'Page Title'}</title>
<meta name="title" content="${data.title || 'Page Title'}">
<meta name="description" content="${data.description || 'Page Description'}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${data.url || 'https://yourwebsite.com/'}">
<meta property="og:title" content="${data.title || 'Page Title'}">
<meta property="og:description" content="${data.description || 'Page Description'}">
<meta property="og:image" content="${data.image || 'https://yourwebsite.com/image.jpg'}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${data.url || 'https://yourwebsite.com/'}">
<meta property="twitter:title" content="${data.title || 'Page Title'}">
<meta property="twitter:description" content="${data.description || 'Page Description'}">
<meta property="twitter:image" content="${data.image || 'https://yourwebsite.com/image.jpg'}">`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              < Globe size={20} className="text-primary" /> Meta Tag Generator
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <History size={14} /> {showHistory ? 'Close History' : 'History'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 max-h-60 overflow-y-auto">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Previous SEO Projects</h4>
                  {history.length > 0 ? (
                    history.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-primary border border-slate-100">
                             <Search size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">{item.summary}</p>
                            <p className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <Check size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No history yet.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Page Title</label>
              <input 
                type="text" 
                value={data.title || ''}
                onChange={(e) => setData({...data, title: e.target.value})}
                placeholder="e.g. Freelance Web Designer in New York"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
              <div className="flex justify-between mt-1 px-1">
                <span className={`text-[10px] font-bold ${data.title.length > 60 ? 'text-danger' : 'text-slate-400'}`}>
                  {data.title.length} characters (Optimal: 50-60)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea 
                rows={3}
                value={data.description || ''}
                onChange={(e) => setData({...data, description: e.target.value})}
                placeholder="Briefly describe what your portfolio or project is about..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
              />
              <div className="flex justify-between mt-1 px-1">
                <span className={`text-[10px] font-bold ${data.description.length > 160 ? 'text-danger' : 'text-slate-400'}`}>
                  {data.description.length} characters (Optimal: 120-160)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Page URL</label>
              <input 
                type="url" 
                value={data.url || ''}
                onChange={(e) => setData({...data, url: e.target.value})}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Social Preview Image URL</label>
              <input 
                type="url" 
                value={data.image || ''}
                onChange={(e) => setData({...data, image: e.target.value})}
                placeholder="https://yourportfolio.com/preview.jpg"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Share2 size={20} className="text-primary" /> UTM Builder
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Source</label>
              <input 
                type="text" 
                value={data.utmSource || ''}
                onChange={(e) => setData({...data, utmSource: e.target.value})}
                placeholder="e.g. twitter, linkedin"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medium</label>
              <input 
                type="text" 
                value={data.utmMedium || ''}
                onChange={(e) => setData({...data, utmMedium: e.target.value})}
                placeholder="e.g. social, bio"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Name</label>
              <input 
                type="text" 
                value={data.utmCampaign || ''}
                onChange={(e) => setData({...data, utmCampaign: e.target.value})}
                placeholder="e.g. winter_sale, launch"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-900 rounded-2xl overflow-hidden relative group">
             <p className="text-xs text-slate-400 font-mono break-all pr-12">
               {fullUrl()}
             </p>
             <button 
              onClick={() => handleCopy(fullUrl(), 'utm')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
             >
                {copied === 'utm' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Search size={20} className="text-primary" /> Google Preview
            </h3>
          </div>

          <div className="max-w-md mx-auto space-y-2 group">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-400">G</div>
                <div>
                   <p className="text-xs text-slate-700 leading-none">{data.url || 'yourportfolio.com'}</p>
                   <p className="text-[10px] text-slate-400">https://{data.url || 'yourportfolio.com'} › ...</p>
                </div>
             </div>
             <p className="text-[#1a0dab] text-xl hover:underline cursor-pointer font-medium leading-tight mb-1">
               {data.title || 'Your Page Title Goes Here'}
             </p>
             <p className="text-[#4d5156] text-sm leading-relaxed overflow-hidden line-clamp-2">
               {data.description || 'Enter a meta description to see how your page will look in search results. A good description increases click-through rates.'}
             </p>
          </div>
          
          <div className="mt-12">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Export Tags</h4>
             <div className="relative">
                <pre className="bg-slate-50 p-6 rounded-2xl text-[11px] text-slate-700 font-mono overflow-x-auto border border-slate-100 whitespace-pre">
                  {metaHtml}
                </pre>
                <button 
                  onClick={() => {
                    handleCopy(metaHtml, 'meta');
                    saveToHistory();
                  }}
                  className="absolute top-4 right-4 p-2 bg-white border border-slate-200 shadow-sm rounded-lg hover:border-primary transition-all text-slate-400 hover:text-primary"
                >
                {copied === 'meta' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
             </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
           <h4 className="font-bold flex items-center gap-2 mb-2 text-primary">
              <ExternalLink size={18} /> SEO Pro Tips
           </h4>
           <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li>• Keep titles under 60 characters to avoid being cut off.</li>
              <li>• Use primary keywords at the beginning of your title.</li>
              <li>• Write descriptions that entice users to click (CTAs).</li>
              <li>• Alt text for images is crucial for accessibility and SEO.</li>
           </ul>
        </div>
      </div>
    </div>
  );
}
