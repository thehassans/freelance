import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Search, 
  Share2, 
  History, 
  FileText, 
  Settings, 
  Code, 
  Languages, 
  Layers, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Info, 
  HelpCircle, 
  Eye, 
  AlertCircle, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { historyService, HistoryItem } from '../../lib/history-service';

export default function SEOKit() {
  const [copied, setCopied] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'robots' | 'jsonld' | 'international'>('basic');
  const [socialPreivewTab, setSocialPreviewTab] = useState<'facebook' | 'twitter'>('facebook');

  // Unified State for advanced tools
  const [data, setData] = useState({
    // Basic Meta
    title: '',
    description: '',
    keywords: '',
    author: '',
    canonicalUrl: '',
    image: '',
    siteName: '',
    twitterHandle: '',
    
    // Robots
    robotsIndex: true,
    robotsFollow: true,
    robotsNoArchive: false,
    robotsNoSnippet: false,
    robotsNoImageIndex: false,
    maxSnippet: -1,
    maxImagePreview: 'large', // 'none' | 'standard' | 'large'
    maxVideoPreview: -1,
    
    // JSON-LD Structured Data
    schemaType: 'Article', // 'Article' | 'Product' | 'Organization' | 'LocalBusiness' | 'FAQ'
    headline: '',
    articleAuthor: '',
    datePublished: '',
    schemaUrl: '',
    logoUrl: '',
    productName: '',
    productBrand: '',
    productSku: '',
    productPrice: '',
    productCurrency: 'USD',
    businessName: '',
    businessPhone: '',
    businessStreet: '',
    businessCity: '',
    businessPostal: '',
    faqQuestion1: '',
    faqAnswer1: '',
    faqQuestion2: '',
    faqAnswer2: '',
  });

  // Hreflang languages state
  const [languages, setLanguages] = useState<{ language: string; url: string }[]>([
    { language: 'en', url: '' }
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAddLanguage = () => {
    setLanguages([...languages, { language: '', url: '' }]);
  };

  const handleUpdateLanguage = (index: number, field: 'language' | 'url', value: string) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  // History integration
  const history = useMemo(() => historyService.getHistory().filter(i => i.toolId === 'seo-kit'), [showHistory]);

  const saveToHistory = () => {
    historyService.addToHistory({
      toolId: 'seo-kit',
      toolName: 'SEO Meta',
      summary: `SEO project for ${data.title || 'Untitled Page'}`,
      data: { data, languages }
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    if (item.data.data) {
      setData(prev => ({ ...prev, ...item.data.data }));
    }
    if (item.data.languages) {
      setLanguages(item.data.languages);
    }
    setShowHistory(false);
  };

  // Dynamic Unified HTML Live Code Generator
  const fullHtml = useMemo(() => {
    const parts: string[] = [];
    
    // Basic Meta
    parts.push(`<!-- Primary Meta Tags -->`);
    parts.push(`<meta charset="utf-8">`);
    parts.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    if (data.title) {
      parts.push(`<title>${data.title}</title>`);
      parts.push(`<meta name="title" content="${data.title}">`);
    } else {
      parts.push(`<title>Page Title</title>`);
    }
    if (data.description) parts.push(`<meta name="description" content="${data.description}">`);
    if (data.keywords) parts.push(`<meta name="keywords" content="${data.keywords}">`);
    if (data.author) parts.push(`<meta name="author" content="${data.author}">`);
    if (data.canonicalUrl) parts.push(`<link rel="canonical" href="${data.canonicalUrl}">`);
    
    // Open Graph / Facebook
    parts.push(`\n<!-- Open Graph / Facebook (OG Graph) -->`);
    parts.push(`<meta property="og:type" content="website">`);
    if (data.canonicalUrl) parts.push(`<meta property="og:url" content="${data.canonicalUrl}">`);
    if (data.title) parts.push(`<meta property="og:title" content="${data.title}">`);
    if (data.description) parts.push(`<meta property="og:description" content="${data.description}">`);
    if (data.image) parts.push(`<meta property="og:image" content="${data.image}">`);
    if (data.siteName) parts.push(`<meta property="og:site_name" content="${data.siteName}">`);
    
    // Twitter Card
    parts.push(`\n<!-- Twitter Graph -->`);
    parts.push(`<meta property="twitter:card" content="summary_large_image">`);
    if (data.canonicalUrl) parts.push(`<meta property="twitter:url" content="${data.canonicalUrl}">`);
    if (data.title) parts.push(`<meta property="twitter:title" content="${data.title}">`);
    if (data.description) parts.push(`<meta property="twitter:description" content="${data.description}">`);
    if (data.image) parts.push(`<meta property="twitter:image" content="${data.image}">`);
    if (data.twitterHandle) {
      const formattedTwitter = data.twitterHandle.startsWith('@') ? data.twitterHandle : `@${data.twitterHandle}`;
      parts.push(`<meta property="twitter:creator" content="${formattedTwitter}">`);
    }
    
    // Robots Directives
    parts.push(`\n<!-- Robots Directives -->`);
    const robotsParts: string[] = [];
    robotsParts.push(data.robotsIndex ? 'index' : 'noindex');
    robotsParts.push(data.robotsFollow ? 'follow' : 'nofollow');
    if (data.robotsNoArchive) robotsParts.push('noarchive');
    if (data.robotsNoSnippet) robotsParts.push('nosnippet');
    if (data.robotsNoImageIndex) robotsParts.push('noimageindex');
    
    // Snippet Controls
    if (data.maxSnippet !== undefined && data.maxSnippet !== null && Number(data.maxSnippet) >= 0) {
      robotsParts.push(`max-snippet:${data.maxSnippet}`);
    }
    if (data.maxImagePreview && data.maxImagePreview !== 'standard') {
      robotsParts.push(`max-image-preview:${data.maxImagePreview}`);
    }
    if (data.maxVideoPreview !== undefined && data.maxVideoPreview !== null && Number(data.maxVideoPreview) >= 0) {
      robotsParts.push(`max-video-preview:${data.maxVideoPreview}`);
    }
    parts.push(`<meta name="robots" content="${robotsParts.join(', ')}">`);
    
    // Internationalization (Hreflang)
    const validLanguages = languages.filter(l => l.language.trim() && l.url.trim());
    if (validLanguages.length > 0) {
      parts.push(`\n<!-- Internationalization (Hreflang) -->`);
      validLanguages.forEach(lang => {
        parts.push(`<link rel="alternate" hreflang="${lang.language.trim()}" href="${lang.url.trim()}">`);
      });
    }
    
    // JSON-LD Structured Data
    parts.push(`\n<!-- JSON-LD Structured Data -->`);
    let schemaObj: any = null;
    
    if (data.schemaType === 'Article') {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.headline || data.title || "Article Headline",
        "author": {
          "@type": "Person",
          "name": data.articleAuthor || data.author || "Author Name"
        },
        "datePublished": data.datePublished || new Date().toISOString().split('T')[0],
        "image": data.image || data.logoUrl || "https://yourwebsite.com/image.jpg"
      };
    } else if (data.schemaType === 'Product') {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": data.productName || data.title || "Product Name",
        "image": data.image || "https://yourwebsite.com/image.jpg",
        "description": data.description || "Product Description",
        "brand": {
          "@type": "Brand",
          "name": data.productBrand || "Brand Name"
        },
        "sku": data.productSku || "SKU-9999",
        "offers": {
          "@type": "Offer",
          "price": data.productPrice || "0.00",
          "priceCurrency": data.productCurrency || "USD"
        }
      };
    } else if (data.schemaType === 'Organization') {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": data.businessName || data.siteName || "Organization Name",
        "url": data.canonicalUrl || "https://yourportfolio.com",
        "logo": data.logoUrl || data.image || "https://yourportfolio.com/logo.png"
      };
    } else if (data.schemaType === 'LocalBusiness') {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": data.businessName || data.title || "Local Business Name",
        "url": data.canonicalUrl || "https://yourportfolio.com",
        "telephone": data.businessPhone || "555-555-5555",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": data.businessStreet || "123 Main St",
          "addressLocality": data.businessCity || "City Name",
          "postalCode": data.businessPostal || "12345",
          "addressCountry": "US"
        }
      };
    } else if (data.schemaType === 'FAQ') {
      const mainEntity: any[] = [];
      if (data.faqQuestion1 && data.faqAnswer1) {
        mainEntity.push({
          "@type": "Question",
          "name": data.faqQuestion1,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": data.faqAnswer1
          }
        });
      }
      if (data.faqQuestion2 && data.faqAnswer2) {
        mainEntity.push({
          "@type": "Question",
          "name": data.faqQuestion2,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": data.faqAnswer2
          }
        });
      }
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": mainEntity.length > 0 ? mainEntity : [
          {
            "@type": "Question",
            "name": "Sample FAQ Question?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sample FAQ Answer details."
            }
          }
        ]
      };
    }
    
    if (schemaObj) {
      parts.push(`<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`);
    }
    
    return parts.join('\n');
  }, [data, languages]);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Title & History Header Box */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase font-black px-2.5 py-1 rounded-lg tracking-widest flex items-center gap-1">
              <Sparkles size={11} className="text-indigo-400" />
              Pro Feature Upgraded
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            <Globe className="text-indigo-400 animate-spin-slow" size={28} /> SEO & Meta Tag Kit
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Enterprise-grade tags generator, Google & Social visualizers, custom Robots rules, JSON-LD schemas, and hreflang translations.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button 
            type="button"
            onClick={() => {
              saveToHistory();
              handleCopy("Saved current setup", 'state-save');
            }}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white/90 rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            {copied === 'state-save' ? <Check size={14} className="text-emerald-400" /> : <FileText size={14} />}
            {copied === 'state-save' ? 'Saved Setup' : 'Save Setup'}
          </button>
          
          <button 
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="px-3.5 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-indigo-500/25 cursor-pointer"
          >
            <History size={14} /> {showHistory ? 'Close History' : 'History List'}
          </button>
        </div>
      </div>

      {/* History panel render */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0, y: -15, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -15, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-inner grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="col-span-full flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="text-[11px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-2">
                  <History size={13} /> Saved Projects & Revision History
                </h4>
                <p className="text-[10px] text-slate-400">Loads inputs immediately</p>
              </div>
              {history.length > 0 ? (
                history.map((item) => (
                  <button 
                    type="button"
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-3.5 bg-white hover:bg-indigo-50/50 rounded-xl transition-all border border-slate-200 hover:border-indigo-200 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0 group-hover:bg-indigo-100 transition-all">
                        <Search size={14} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-extrabold text-slate-800 truncate leading-snug">{item.summary}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full py-6 text-center text-xs text-slate-400">
                  No saved setups found. Click "Save Setup" above to store custom parameters.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE TAB INPUT FORM (5/12 widths) */}
        <div id="seo-input-panel" className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* TAB ARCHITECTURE BAR */}
          <div className="flex flex-wrap border-b border-slate-100 bg-slate-50 p-2 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'basic' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <FileText size={15} />
              Basic Meta
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('robots')}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'robots' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Settings size={15} />
              Robots
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('jsonld')}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'jsonld' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Code size={15} />
              JSON-LD
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('international')}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'international' 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Languages size={15} />
              International
            </button>
          </div>

          {/* ACTIVE TAB COMPONENT WRAPPER */}
          <div className="p-6 sm:p-8 space-y-5">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText size={18} className="text-[#6c63ff]" /> Basic Meta & Social Graph
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Define core identifiers for engines and previews.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex justify-between items-center">
                      <span>Page Title</span>
                      <span className={`text-[10px] font-black tracking-normal ${data.title.length > 60 ? 'text-rose-500' : 'text-indigo-600'}`}>
                        {data.title.length} / 60 char
                      </span>
                    </label>
                    <input 
                      type="text" 
                      value={data.title}
                      onChange={(e) => setData({ ...data, title: e.target.value })}
                      placeholder="e.g. Premium UI Assets & High-Quality Design Templates"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex justify-between items-center">
                      <span>Meta Description</span>
                      <span className={`text-[10px] font-black tracking-normal ${data.description.length > 160 ? 'text-rose-500' : 'text-indigo-600'}`}>
                        {data.description.length} / 160 char
                      </span>
                    </label>
                    <textarea 
                      rows={3}
                      value={data.description}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                      placeholder="e.g. Elevate your portfolio setup with beautiful, lightweight resources configured natively for Tailwind and React. High-converting modules, responsive cards."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Keywords</label>
                      <input 
                        type="text" 
                        value={data.keywords}
                        onChange={(e) => setData({ ...data, keywords: e.target.value })}
                        placeholder="e.g. seo design, React tips"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Author</label>
                      <input 
                        type="text" 
                        value={data.author}
                        onChange={(e) => setData({ ...data, author: e.target.value })}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Canonical URL</label>
                      <input 
                        type="url" 
                        value={data.canonicalUrl}
                        onChange={(e) => setData({ ...data, canonicalUrl: e.target.value })}
                        placeholder="e.g. https://yourportfolio.com/templates"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">OG Image URL</label>
                      <input 
                        type="url" 
                        value={data.image}
                        onChange={(e) => setData({ ...data, image: e.target.value })}
                        placeholder="e.g. https://yourportfolio.com/cover.png"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Site Name</label>
                      <input 
                        type="text" 
                        value={data.siteName}
                        onChange={(e) => setData({ ...data, siteName: e.target.value })}
                        placeholder="e.g. FreelanceKit"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Twitter Handle</label>
                      <input 
                        type="text" 
                        value={data.twitterHandle}
                        onChange={(e) => setData({ ...data, twitterHandle: e.target.value })}
                        placeholder="e.g. @sarah_design"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'robots' && (
                <motion.div
                  key="robots-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <Settings size={18} className="text-[#6c63ff]" /> Robots Directives
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Control how search engines crawl, index, and cache your page contents.</p>
                  </div>

                  {/* Standard Directives Toggles Grid */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/60 space-y-3.5">
                    <h4 className="text-[11px] uppercase font-black tracking-widest text-slate-400">Core Directives</h4>
                    
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-xs font-black text-slate-700">INDEX (index / noindex)</p>
                        <p className="text-[10px] text-slate-400">Instruct engines whether to index the page on general searches</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, robotsIndex: !data.robotsIndex })}
                        className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 focus:outline-none ${
                          data.robotsIndex ? 'bg-indigo-600 flex justify-end' : 'bg-slate-300 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 border-t border-slate-200/50 pt-2.5">
                      <div>
                        <p className="text-xs font-black text-slate-700">FOLLOW (follow / nofollow)</p>
                        <p className="text-[10px] text-slate-400">Instruct search spiders to trust and crawl outgoing page hyperlinks</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, robotsFollow: !data.robotsFollow })}
                        className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 focus:outline-none ${
                          data.robotsFollow ? 'bg-indigo-600 flex justify-end' : 'bg-slate-300 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 border-t border-slate-200/50 pt-2.5">
                      <div>
                        <p className="text-xs font-black text-slate-700">NOARCHIVE (prevent cache)</p>
                        <p className="text-[10px] text-slate-400">Do not display standard "Cached" backlinks on SERPs</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, robotsNoArchive: !data.robotsNoArchive })}
                        className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 focus:outline-none ${
                          data.robotsNoArchive ? 'bg-indigo-600 flex justify-end' : 'bg-slate-300 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 border-t border-slate-200/50 pt-2.5">
                      <div>
                        <p className="text-xs font-black text-slate-700">NOSNIPPET (hide page snippets)</p>
                        <p className="text-[10px] text-slate-400">Do not generate normal description snippet extracts for this link</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, robotsNoSnippet: !data.robotsNoSnippet })}
                        className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 focus:outline-none ${
                          data.robotsNoSnippet ? 'bg-indigo-600 flex justify-end' : 'bg-slate-300 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 border-t border-slate-200/50 pt-2.5">
                      <div>
                        <p className="text-xs font-black text-slate-700">NOIMAGEINDEX</p>
                        <p className="text-[10px] text-slate-400">Do not index assets or gallery images hosted inside this document</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, robotsNoImageIndex: !data.robotsNoImageIndex })}
                        className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 focus:outline-none ${
                          data.robotsNoImageIndex ? 'bg-indigo-600 flex justify-end' : 'bg-slate-300 flex justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Snippet Controls */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] uppercase font-black tracking-widest text-slate-400">Snippet Controls</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Snippet</label>
                        <input 
                          type="number" 
                          value={data.maxSnippet === -1 ? '' : data.maxSnippet}
                          onChange={(e) => setData({ ...data, maxSnippet: e.target.value === '' ? -1 : Number(e.target.value) })}
                          placeholder="No Limit"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Image Preview</label>
                        <select 
                          value={data.maxImagePreview}
                          onChange={(e) => setData({ ...data, maxImagePreview: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-xs"
                        >
                          <option value="none">none</option>
                          <option value="standard">standard</option>
                          <option value="large">large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Video Preview</label>
                        <input 
                          type="number" 
                          value={data.maxVideoPreview === -1 ? '' : data.maxVideoPreview}
                          onChange={(e) => setData({ ...data, maxVideoPreview: e.target.value === '' ? -1 : Number(e.target.value) })}
                          placeholder="No Limit"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Reference */}
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] text-indigo-950 flex items-start gap-2">
                    <Info size={14} className="text-[#6c63ff] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#6c63ff]">Quick Reference:</span> Directives are guidelines embedded within standard header parameters to filter malicious scrapers or designate optimal snippet limits on global layout crawlers.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'jsonld' && (
                <motion.div
                  key="jsonld-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <Layers size={18} className="text-[#6c63ff]" /> JSON-LD Structured Data
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Inject dynamic schemas for smart knowledge panels and Google Rich Snippets.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Schema Category/Type</label>
                    <select
                      value={data.schemaType}
                      onChange={(e) => setData({ ...data, schemaType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="Article">Article (Blog, Essay, News)</option>
                      <option value="Product">Product Details (SaaS, eCommerce)</option>
                      <option value="Organization">Organization (Brand, Business Entity)</option>
                      <option value="LocalBusiness">Local Business (Shop, Clinic, Agency)</option>
                      <option value="FAQ">FAQ Page Configuration</option>
                    </select>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-[#6c63ff]">
                      {data.schemaType} Details & Fields
                    </h4>

                    {data.schemaType === 'Article' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Headline</label>
                          <input 
                            type="text" 
                            value={data.headline}
                            onChange={(e) => setData({ ...data, headline: e.target.value })}
                            placeholder={data.title || "How to Design Accessible Components"}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Author Name</label>
                            <input 
                              type="text" 
                              value={data.articleAuthor}
                              onChange={(e) => setData({ ...data, articleAuthor: e.target.value })}
                              placeholder={data.author || "Jane Doe"}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Date Published</label>
                            <input 
                              type="date" 
                              value={data.datePublished}
                              onChange={(e) => setData({ ...data, datePublished: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {data.schemaType === 'Product' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Product Name</label>
                          <input 
                            type="text" 
                            value={data.productName}
                            onChange={(e) => setData({ ...data, productName: e.target.value })}
                            placeholder="Awesome SaaS Kit"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Brand Name</label>
                            <input 
                              type="text" 
                              value={data.productBrand}
                              onChange={(e) => setData({ ...data, productBrand: e.target.value })}
                              placeholder="FreelanceKit"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SKU / ID</label>
                            <input 
                              type="text" 
                              value={data.productSku}
                              onChange={(e) => setData({ ...data, productSku: e.target.value })}
                              placeholder="FK-90210"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Price</label>
                            <input 
                              type="text" 
                              value={data.productPrice}
                              onChange={(e) => setData({ ...data, productPrice: e.target.value })}
                              placeholder="49.00"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Currency</label>
                            <select 
                              value={data.productCurrency}
                              onChange={(e) => setData({ ...data, productCurrency: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            >
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="CAD">CAD ($)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {data.schemaType === 'Organization' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Organization / Brand Name</label>
                          <input 
                            type="text" 
                            value={data.businessName}
                            onChange={(e) => setData({ ...data, businessName: e.target.value })}
                            placeholder="SpaceX Consulting"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Logo URL</label>
                          <input 
                            type="url" 
                            value={data.logoUrl}
                            onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
                            placeholder="https://yourportfolio.com/logo.png"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {data.schemaType === 'LocalBusiness' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Business Name</label>
                            <input 
                              type="text" 
                              value={data.businessName}
                              onChange={(e) => setData({ ...data, businessName: e.target.value })}
                              placeholder="HQ Design Studio"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Telephone</label>
                            <input 
                              type="text" 
                              value={data.businessPhone}
                              onChange={(e) => setData({ ...data, businessPhone: e.target.value })}
                              placeholder="+1 (555) 900-342"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Street Address</label>
                          <input 
                            type="text" 
                            value={data.businessStreet}
                            onChange={(e) => setData({ ...data, businessStreet: e.target.value })}
                            placeholder="456 Sunset Boulevard"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">City</label>
                            <input 
                              type="text" 
                              value={data.businessCity}
                              onChange={(e) => setData({ ...data, businessCity: e.target.value })}
                              placeholder="Los Angeles"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Postal Code</label>
                            <input 
                              type="text" 
                              value={data.businessPostal}
                              onChange={(e) => setData({ ...data, businessPostal: e.target.value })}
                              placeholder="90210"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {data.schemaType === 'FAQ' && (
                      <div className="space-y-3">
                        <div className="border-b border-slate-200/50 pb-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FAQ Entry 1</p>
                          <input 
                            type="text" 
                            value={data.faqQuestion1}
                            onChange={(e) => setData({ ...data, faqQuestion1: e.target.value })}
                            placeholder="Question 1: What is your return policy?"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs mb-1.5"
                          />
                          <input 
                            type="text" 
                            value={data.faqAnswer1}
                            onChange={(e) => setData({ ...data, faqAnswer1: e.target.value })}
                            placeholder="Answer 1: We accept refunds within 14 business days of delivery."
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FAQ Entry 2</p>
                          <input 
                            type="text" 
                            value={data.faqQuestion2}
                            onChange={(e) => setData({ ...data, faqQuestion2: e.target.value })}
                            placeholder="Question 2: Do you support international shipping?"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs mb-1.5"
                          />
                          <input 
                            type="text" 
                            value={data.faqAnswer2}
                            onChange={(e) => setData({ ...data, faqAnswer2: e.target.value })}
                            placeholder="Answer 2: Yes, we ship worldwide with customized logistics integrations."
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'international' && (
                <motion.div
                  key="international-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <Languages size={18} className="text-[#6c63ff]" /> Internationalization & Hreflang
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Map alternative language pages so Google indexes correct regional URLs.</p>
                  </div>

                  <div className="space-y-2.5">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex gap-2 items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="w-1/3">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lang Code</label>
                          <select
                            value={lang.language}
                            onChange={(e) => handleUpdateLanguage(index, 'language', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs font-semibold"
                          >
                            <option value="">-- select --</option>
                            <option value="en">English (en)</option>
                            <option value="es">Spanish (es)</option>
                            <option value="fr">French (fr)</option>
                            <option value="de">German (de)</option>
                            <option value="it">Italian (it)</option>
                            <option value="pt">Portuguese (pt)</option>
                            <option value="ja">Japanese (ja)</option>
                            <option value="zh">Chinese (zh)</option>
                            <option value="x-default">Default fallback (x-default)</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target URL</label>
                          <input 
                            type="url"
                            value={lang.url}
                            onChange={(e) => handleUpdateLanguage(index, 'url', e.target.value)}
                            placeholder="e.g. https://es.domain.com/hola"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(index)}
                          className="p-2 border border-rose-100 hover:border-rose-200 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer self-end mt-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="w-full py-2.5 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl bg-slate-50/50 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      <Plus size={14} /> Add Hreflang Row
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: PERMANENT PREVIEWS & UNIFIED OUTPUTS (7/12 widths) */}
        <div id="seo-preview-panel" className="lg:col-span-6 space-y-6">
          
          {/* VISUAL PREVIEWS PANEL */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            {/* GOOGLE PREVIEW */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h4 className="text-xs uppercase font-extrabold text-slate-700 tracking-wider flex items-center gap-2">
                  <Search size={14} className="text-blue-600" /> Google search result preview
                </h4>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">desktop serp</span>
              </div>

              <div className="max-w-md bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm space-y-1 hover:border-blue-200 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200">G</div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-slate-700 leading-none font-semibold truncate">
                      {data.canonicalUrl || 'yourportfolio.com'}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-normal truncate">
                      https://{data.canonicalUrl.replace(/(^\w+:|^)\/\//, '') || 'yourportfolio.com'}
                    </p>
                  </div>
                </div>
                <h3 className="text-[#1a0dab] text-lg sm:text-xl font-medium leading-tight hover:underline cursor-pointer">
                  {data.title || 'Please enter a Page Title...'}
                </h3>
                <p className="text-[#4d5156] text-xs leading-relaxed overflow-hidden line-clamp-2">
                  {data.description || 'Enter a meta description to see how your page will look in search results. A good description entices users to click and increases click-through rates (CTR).'}
                </p>
              </div>
            </div>

            {/* SOCIAL PREVIEW WITH FACEBOOK/TWITTER TOGGLE */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h4 className="text-xs uppercase font-extrabold text-slate-700 tracking-wider flex items-center gap-2">
                  <Share2 size={14} className="text-[#6c63ff]" /> Social Media Card Preview
                </h4>
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setSocialPreviewTab('facebook')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      socialPreivewTab === 'facebook' ? 'bg-white text-[#3b5998] shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    Facebook
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialPreviewTab('twitter')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      socialPreivewTab === 'twitter' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    Twitter
                  </button>
                </div>
              </div>

              {socialPreivewTab === 'facebook' ? (
                <div className="max-w-md bg-[#f0f2f5] border border-[#e5e6e9] rounded-2xl overflow-hidden hover:shadow-xs transition-all">
                  <div className="bg-white p-3 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-xs text-slate-500">
                      {data.siteName ? data.siteName.charAt(0).toUpperCase() : 'F'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">{data.siteName || 'FreelanceKit'}</h4>
                      <p className="text-[9px] text-slate-400">Sponsored · Public</p>
                    </div>
                  </div>
                  
                  {data.image ? (
                    <img 
                      src={data.image} 
                      alt="Facebook Graphic" 
                      className="w-full h-44 object-cover border-b border-[#e5e6e9]" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-44 bg-slate-100 border-b border-[#e5e6e9] flex flex-col items-center justify-center text-slate-400 text-xs">
                      <Share2 size={24} className="opacity-40 mb-1" />
                      Placeholder Card Link Graphics
                    </div>
                  )}

                  <div className="bg-white p-3 space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-wider text-[#606770] truncate">
                      {data.canonicalUrl ? data.canonicalUrl.replace(/(^\w+:|^)\/\//, '').toUpperCase() : 'YOURPORTFOLIO.COM'}
                    </p>
                    <h5 className="text-xs font-bold text-[#1c1e21] truncate">
                      {data.title || 'Page Title Placeholder'}
                    </h5>
                    <p className="text-[11px] text-[#606770] leading-snug line-clamp-1">
                      {data.description || 'Description details reflect here.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-w-md bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xs transition-all">
                  {data.image ? (
                    <img 
                      src={data.image} 
                      alt="Twitter Link Image" 
                      className="w-full h-44 object-cover border-b border-slate-200" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-44 bg-slate-50 border-b border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
                      <Share2 size={24} className="opacity-40 mb-1" />
                      Placeholder Link Graphics
                    </div>
                  )}

                  <div className="p-3 space-y-1 bg-white">
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="font-extrabold text-slate-500 uppercase">{data.siteName || 'Twitter Card'}</span>
                      • {data.twitterHandle ? `${data.twitterHandle.startsWith('@') ? data.twitterHandle : '@' + data.twitterHandle}` : '@yourhandle'}
                    </p>
                    <h5 className="text-xs font-extrabold text-slate-900 truncate">
                      {data.title || 'Your Title Here'}
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                      {data.description || 'Enter secondary descriptions to match with layout styles.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* UNIFIED LIVE CODE GENERATOR & EXPORT BLOCK */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between bg-slate-950 px-5 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest ml-1.5 flex items-center gap-1.5">
                  <Code size={13} className="text-slate-400" /> Web HTML Meta Tags Code Output
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleCopy(fullHtml, 'html-copied');
                  saveToHistory();
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all hover:scale-101 active:scale-97 cursor-pointer flex items-center gap-1.5"
              >
                {copied === 'html-copied' ? <Check size={11} className="text-emerald-300" /> : <Copy size={11} />}
                {copied === 'html-copied' ? 'Copied Full HTML' : 'Copy Full HTML'}
              </button>
            </div>

            <div className="p-5.5 relative">
              <pre className="text-slate-300 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre h-72 custom-scrollbar select-all">
                <code>{fullHtml}</code>
              </pre>
            </div>
          </div>

          {/* SEO PRO-TIPS AND ENTERPRISE GUIDE */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100 p-6 rounded-3xl space-y-3">
            <h4 className="font-extrabold text-indigo-950 flex items-center gap-2 text-xs uppercase tracking-wider">
              <ExternalLink size={16} className="text-[#6c63ff]" /> Professional SEO Practices
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600">
              <div className="bg-white p-3 rounded-2xl border border-slate-200/50">
                <span className="font-black text-indigo-700 text-[10px] uppercase block mb-0.5">Rule of 60 Characters</span>
                Title meta attributes are often cropped on search spiders if they exceed 60 characters. Place core target key phrases early.
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200/50">
                <span className="font-black text-indigo-700 text-[10px] uppercase block mb-0.5">Relational Indexing</span>
                Set default "Index" directive to False for internal checkout screens, legal terms archives, or private search grids.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
