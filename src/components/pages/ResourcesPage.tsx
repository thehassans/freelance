import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Download, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  Search, 
  Mail, 
  Zap,
  Layout,
  Terminal,
  FileCode,
  Globe,
  Settings,
  ChevronRight,
  Printer,
  Calendar,
  CheckCircle2,
  Shield,
  X
} from 'lucide-react';
import { TemplatePreviewModal } from '../ui/TemplatePreviewModal';
import { GUIDES, BLOGS, TEMPLATES, GLOSSARY, Article, ContentType, Template, GlossaryTerm } from '../../lib/contentData';
import ArticleViewer from '../public/ArticleViewer';
import TemplateExportWrapper, { TemplateFormatType } from '../common/TemplateExportWrapper';

interface ResourcesPageProps {
  onToolSelect?: (toolId: string) => void;
  initialTab?: TabType;
}

type TabType = 'guides' | 'blog' | 'templates' | 'glossary';

export default function ResourcesPage({ onToolSelect, initialTab }: ResourcesPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'guides');
  const [activeArticle, setActiveArticle] = useState<ContentType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [glossaryLetter, setGlossaryLetter] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [exportingTemplate, setExportingTemplate] = useState<Template | null>(null);
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<Template | null>(null);

  // Sync with initialTab from props if it changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const popularTopics = ['#Valuation', '#SEO', '#Pricing', '#ROAS', '#Compliance'];

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('hub-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const counts = useMemo(() => ({
    guides: GUIDES.length,
    blog: BLOGS.length,
    templates: TEMPLATES.length,
    glossary: GLOSSARY.length
  }), []);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleDownload = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (template: Template) => {
    if ((template.format === 'Excel' || template.format === 'Google Sheets') && template.contentData?.headers) {
      // Generate CSV for spreadsheets with FreelancerKit branding in A1
      const branding = "FreelancerKit";
      const headers = template.contentData.headers.join(',');
      const rows = template.contentData.rows.map((row: any[]) => 
        row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      const csvContent = `${branding}\n\n${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${template.id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    if (template.format === 'Notion' || template.format === 'Markdown') {
      const content = typeof template.contentData === 'string' ? template.contentData : template.content;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${template.id}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    setExportingTemplate(template);
    // Short delay to ensure state update has rendered the export wrapper
    setTimeout(() => {
      window.print();
      // Reset after a short delay so the print dialog can open
      setTimeout(() => setExportingTemplate(null), 500);
    }, 100);
  };

  const filteredContent = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    if (query.length > 1) {
      const allContent: ContentType[] = [...GUIDES, ...BLOGS, ...TEMPLATES, ...GLOSSARY];
      return allContent.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    if (activeTab === 'glossary') {
      return GLOSSARY.filter(item => {
        const matchesLetter = glossaryLetter ? item.title.toUpperCase().startsWith(glossaryLetter) : true;
        return matchesLetter;
      });
    }

    const dataMap: Record<string, ContentType[]> = {
      guides: GUIDES,
      blog: BLOGS,
      templates: TEMPLATES
    };

    return dataMap[activeTab] || [];
  }, [activeTab, searchQuery, glossaryLetter]);

  if (activeArticle) {
    return (
      <ArticleViewer 
        article={activeArticle as Article} 
        onBack={() => setActiveArticle(null)}
        onToolClick={(toolId) => {
          setActiveArticle(null);
          onToolSelect?.(toolId);
        }}
      />
    );
  }

  return (
    <div className="py-12 md:py-24 font-sans bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hub Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-slate-200"
          >
            <Sparkles size={12} /> The Knowledge Infrastructure
          </motion.div>
          
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
            The Content <span className="text-[#0f4c75] italic">Hub</span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-10">
            Premium SOPs, data-driven analysis, and professional boilerplate assets to accelerate your business growth.
          </p>

          {/* Global Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 start-0 ps-6 flex items-center pointer-events-none text-slate-400">
              <Search size={22} className={searchQuery ? 'text-[#0f4c75]' : ''} />
            </div>
            <input 
              id="hub-search"
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, templates, and frameworks..."
              className="w-full h-18 ps-16 pe-24 bg-slate-50 border border-slate-100 rounded-3xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#0f4c75]/5 focus:bg-white transition-all shadow-sm placeholder:text-slate-300"
            />
            <div className="absolute inset-y-0 end-0 pe-6 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-flex h-8 items-center gap-1 rounded bg-slate-100 px-2 font-mono text-[10px] font-bold text-slate-400 border border-slate-200 shadow-sm">
                <span className="text-xs">⌘</span> K
              </kbd>
            </div>
          </div>

          {/* Popular Topics Chips - Subtle */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mr-2">Popular:</span>
            {popularTopics.map(topic => (
              <button
                key={topic}
                onClick={() => setSearchQuery(topic.replace('#', ''))}
                className="px-3 py-1.5 bg-slate-50/50 hover:bg-slate-100 text-slate-400 hover:text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100/50 transition-all active:scale-95"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Pill Navigation - Immediate gateway */}
        <div className="py-8">
          <div className="flex flex-wrap justify-center gap-2 bg-slate-100 p-1.5 rounded-[2.5rem] max-w-2xl mx-auto shadow-inner relative z-10">
            {(['guides', 'blog', 'templates', 'glossary'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (!searchQuery) {
                    setGlossaryLetter(null);
                  }
                }}
                className={`flex-1 min-w-[120px] py-3.5 px-3 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 group flex items-center justify-center gap-2 ${
                  activeTab === tab && !searchQuery ? 'bg-white text-[#0f4c75] shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'
                } ${searchQuery ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                disabled={!!searchQuery}
              >
                {tab === 'guides' ? 'Guides & SOPs' : tab}
                <span className={`px-2 py-0.5 rounded-full text-[8px] border transition-colors ${
                  activeTab === tab && !searchQuery ? 'bg-[#0f4c75]/5 border-[#0f4c75]/20 text-[#0f4c75]' : 'bg-slate-200/50 border-transparent text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500'
                }`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Mode indicator */}
        {searchQuery && (
          <div className="text-center mb-12">
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
              Showing {filteredContent.length} results for <span className="text-[#0f4c75]">"{searchQuery}"</span>
              <button 
                onClick={() => setSearchQuery('')}
                className="ml-4 text-slate-300 hover:text-slate-600 underline font-black"
              >
                Clear Search
              </button>
            </p>
          </div>
        )}

        {/* Dynamic Grid View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {searchQuery ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredContent.map((item, index) => {
                  const itemsWithNewsletter = [];
                  
                  // Component to render the newsleter break
                  const newsletterBreak = (
                    <div key="newsletter-break" className="col-span-full my-8">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#0a192f] border border-white/5 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0f4c75]/20 blur-3xl -mr-32 -mt-32 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 blur-3xl rounded-full" />
                        
                        <div className="flex items-center gap-6 relative z-10 text-left w-full lg:w-auto">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner border border-white/5 shrink-0">
                            <Zap size={28} />
                          </div>
                          <div>
                            <p className="text-xl font-black text-white tracking-tight">The Growth Letter</p>
                            <p className="text-sm text-white/40 font-medium">Join 5,000+ elite founders getting tactical SOPs weekly.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto relative z-10">
                          <input 
                            type="email" 
                            placeholder="operator@company.com" 
                            className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#0f4c75] flex-grow lg:w-72 shadow-inner transition-all focus:bg-white/10"
                          />
                          <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-black/40">
                            Subscribe
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  );

                  if (item.type === 'guide' || item.type === 'blog') {
                    const art = item as Article;
                    const card = (
                      <div key={art.id} className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#0f4c75]/10 transition-all duration-500 flex flex-col h-full">
                        {/* ... card content ... */}
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={art.imageUrl} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                            onError={(e) => { 
                              const target = e.currentTarget;
                              if (target.src !== `https://picsum.photos/seed/${art.id}/800/600`) {
                                target.src = `https://picsum.photos/seed/${art.id}/800/600`;
                              }
                            }}
                          />
                          <div className="absolute top-6 left-6">
                            <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-[#0f4c75] border border-slate-100 shadow-sm">
                              {art.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-8 md:p-10 flex flex-col flex-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">
                            <BookOpen size={14} className="text-[#0f4c75]" /> {art.readTime || 'Analysis'}
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#0f4c75] transition-colors leading-tight tracking-tight">
                            {art.title}
                          </h3>
                          <p className="text-slate-500 font-medium mb-8 flex-1 leading-relaxed line-clamp-3">
                            {art.description}
                          </p>
                          <button 
                            onClick={() => setActiveArticle(art)}
                            className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#0f4c75] group-hover:text-white transition-all shadow-sm"
                          >
                            Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );

                    if (index === 3) return [newsletterBreak, card];
                    return card;
                  }
                  
                  if (item.type === 'template') {
                    const t = item as Template;
                    const card = (
                      <button 
                        key={t.id} 
                        onClick={() => setActivePreviewTemplate(t)}
                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl hover:border-[#0f4c75]/10 hover:-translate-y-1 transition-all duration-500 relative group overflow-hidden h-full text-left w-full"
                      >
                        <div className="flex items-center gap-3 text-[#0f4c75] mb-6 bg-[#0f4c75]/5 w-fit px-4 py-1.5 rounded-full border border-[#0f4c75]/10">
                          <Terminal size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t.format}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{t.title}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-grow">{t.description}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 w-full">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Template Preview</span>
                          <span className="text-[9px] font-black text-[#0f4c75] uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Template <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </button>
                    );
                    if (index === 3) return [newsletterBreak, card];
                    return card;
                  }

                  if (item.type === 'glossary') {
                    const g = item as GlossaryTerm;
                    const card = (
                      <div key={g.id} className="bg-white border border-slate-100 p-8 rounded-[3rem] group hover:border-[#0f4c75]/20 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center mb-6 group-hover:bg-[#0f4c75]/10 group-hover:text-[#0f4c75] transition-all">
                          <Globe size={16} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3 group-hover:text-[#0f4c75] transition-colors">{g.title}</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-grow">{g.description}</p>
                        <button 
                          onClick={() => setActiveArticle(g)}
                          className="text-[9px] font-black uppercase tracking-widest text-[#0f4c75] flex items-center gap-2 group/btn py-2 border-t border-slate-50 pt-6"
                        >
                          Reference Definition <ArrowRight size={12} className="group-hover/btn:translate-x-1.5 transition-transform" />
                        </button>
                      </div>
                    );
                    if (index === 3) return [newsletterBreak, card];
                    return card;
                  }

                  return null;
                })}
              </div>
            ) : (
              <>
                {activeTab === 'guides' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredContent.map((guide, index) => {
                      const g = guide as Article;
                      const card = (
                        <div key={g.id} className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#0f4c75]/10 transition-all duration-500 flex flex-col h-full">
                          <div className="h-48 overflow-hidden relative">
                            <img 
                              src={g.imageUrl} 
                              alt="" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                              onError={(e) => { 
                                const target = e.currentTarget;
                                if (target.src !== `https://picsum.photos/seed/${g.id}/800/600`) {
                                  target.src = `https://picsum.photos/seed/${g.id}/800/600`;
                                }
                              }}
                            />
                            <div className="absolute top-6 left-6">
                              <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-[#0f4c75] border border-slate-100 shadow-sm">
                                {g.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-8 md:p-10 flex flex-col flex-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0f4c75]/50 mb-4">
                              <Settings size={14} /> Operations SOP
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#0f4c75] transition-colors leading-tight tracking-tight">
                              {g.title}
                            </h3>
                            <p className="text-slate-500 font-medium mb-8 flex-1 leading-relaxed">
                              {g.description}
                            </p>
                            <button 
                              onClick={() => setActiveArticle(g)}
                              className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#0f4c75] group-hover:text-white transition-all shadow-sm"
                            >
                              Read SOP <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      );

                      if (index === 3) {
                        return (
                          <React.Fragment key="break-area">
                            <div className="col-span-full my-8">
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-[#0a192f] border border-white/5 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0f4c75]/20 blur-3xl -mr-32 -mt-32 rounded-full" />
                                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 blur-3xl rounded-full" />
                                
                                <div className="flex items-center gap-6 relative z-10 text-left w-full lg:w-auto">
                                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner border border-white/5 shrink-0">
                                    <Zap size={28} />
                                  </div>
                                  <div>
                                    <p className="text-xl font-black text-white tracking-tight">The Growth Letter</p>
                                    <p className="text-sm text-white/40 font-medium">Join 5,000+ elite founders getting tactical SOPs weekly.</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 w-full lg:w-auto relative z-10">
                                  <input 
                                    type="email" 
                                    placeholder="operator@company.com" 
                                    className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#0f4c75] flex-grow lg:w-72 shadow-inner transition-all focus:bg-white/10"
                                  />
                                  <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-black/40">
                                    Subscribe
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                            {card}
                          </React.Fragment>
                        );
                      }
                      return card;
                    })}
                  </div>
                )}

                {activeTab === 'blog' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredContent.map((article, i) => {
                      const art = article as Article;
                      const isFeatured = i === 0 && searchQuery === '';
                      const card = (
                        <div 
                          key={art.id} 
                          className={`group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 ${isFeatured ? 'md:col-span-2 md:flex' : ''}`}
                        >
                          <div className={`overflow-hidden relative ${isFeatured ? 'md:w-1/2' : 'h-64'}`}>
                            <img 
                              src={art.imageUrl} 
                              alt="" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                              onError={(e) => { 
                                const target = e.currentTarget;
                                if (target.src !== `https://picsum.photos/seed/${art.id}/800/600`) {
                                  target.src = `https://picsum.photos/seed/${art.id}/800/600`;
                                }
                              }}
                            />
                            <div className="absolute top-8 left-8">
                              <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#0f4c75] border border-slate-100 shadow-xl">
                                {art.category}
                              </span>
                            </div>
                          </div>
                          <div className={`p-8 md:p-12 flex flex-col justify-center ${isFeatured ? 'md:w-1/2' : ''}`}>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">
                              <BookOpen size={14} className="text-[#0f4c75]" /> {art.readTime} Analysis
                            </div>
                            <h3 className={`${isFeatured ? 'text-3xl md:text-4xl' : 'text-2xl'} font-black text-slate-900 mb-6 group-hover:text-[#0f4c75] transition-colors tracking-tight leading-[1.2]`}>
                              {art.title}
                            </h3>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed line-clamp-3">
                              {art.description}
                            </p>
                            <button 
                              onClick={() => setActiveArticle(art)}
                              className="flex items-center gap-2 text-xs font-black text-[#0f4c75] uppercase tracking-widest group/link mt-auto w-fit"
                            >
                              Explore Research <ChevronRight size={18} className="group-hover/link:translate-x-1.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      );

                      if (i === 3) {
                        return (
                          <React.Fragment key="break-area">
                            <div className="col-span-full my-8">
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-[#0a192f] border border-white/5 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0f4c75]/20 blur-3xl -mr-32 -mt-32 rounded-full" />
                                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 blur-3xl rounded-full" />
                                
                                <div className="flex items-center gap-6 relative z-10 text-left w-full lg:w-auto">
                                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner border border-white/5 shrink-0">
                                    <Zap size={28} />
                                  </div>
                                  <div>
                                    <p className="text-xl font-black text-white tracking-tight">The Growth Letter</p>
                                    <p className="text-sm text-white/40 font-medium">Join 5,000+ elite founders getting tactical SOPs weekly.</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 w-full lg:w-auto relative z-10">
                                  <input 
                                    type="email" 
                                    placeholder="operator@company.com" 
                                    className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#0f4c75] flex-grow lg:w-72 shadow-inner transition-all focus:bg-white/10"
                                  />
                                  <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-black/40">
                                    Subscribe
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                            {card}
                          </React.Fragment>
                        );
                      }
                      return card;
                    })}
                  </div>
                )}

                {activeTab === 'templates' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {filteredContent.map((template) => {
                      const t = template as Template;
                      return (
                        <button 
                          key={t.id} 
                          onClick={() => setActivePreviewTemplate(t)}
                          className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-3xl hover:-translate-y-2 hover:border-[#0f4c75]/20 transition-all duration-500 relative group overflow-hidden text-left"
                        >
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                            {t.format === 'Excel' || t.format === 'Google Sheets' ? <Layout size={80} /> : <FileCode size={80} />}
                          </div>
                          
                          <div className="flex items-center gap-3 text-[#0f4c75] mb-8 bg-[#0f4c75]/5 w-fit px-5 py-2 rounded-full border border-[#0f4c75]/10">
                            <Terminal size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Format: {t.format}</span>
                          </div>
                          
                          <div className="mb-10 flex-grow">
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{t.title}</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">{t.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  Expert Resource
                                </span>
                            </div>
                            <span className="flex items-center gap-2 text-[10px] font-black text-[#0f4c75] uppercase tracking-widest">
                              View Template <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'glossary' && (
                  <div className="space-y-12">
                    {/* A-Z Filter */}
                    <div className="flex flex-wrap justify-center gap-2 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                      <button 
                        onClick={() => setGlossaryLetter(null)}
                        className={`w-12 h-12 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center shadow-sm ${!glossaryLetter ? 'bg-[#0f4c75] text-white ring-4 ring-[#0f4c75]/10' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                      >
                        All
                      </button>
                      {alphabet.map(char => (
                        <button 
                          key={char}
                          onClick={() => setGlossaryLetter(glossaryLetter === char ? null : char)}
                          className={`w-12 h-12 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center shadow-sm ${glossaryLetter === char ? 'bg-[#0f4c75] text-white ring-4 ring-[#0f4c75]/10' : 'bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                          {char}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredContent.length > 0 ? (
                        filteredContent.map((item) => {
                          const g = item as GlossaryTerm;
                          return (
                            <div key={g.id} className="bg-white border border-slate-100 p-10 rounded-[3rem] group hover:border-[#0f4c75]/20 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center mb-6 group-hover:bg-[#0f4c75]/10 group-hover:text-[#0f4c75] transition-all">
                                <Globe size={18} />
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-[#0f4c75] transition-colors">{g.title}</h3>
                              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-grow">
                                {g.description}
                              </p>
                              <button 
                                onClick={() => setActiveArticle(g)}
                                className="text-[10px] font-black uppercase tracking-widest text-[#0f4c75] flex items-center gap-2 group/btn py-2 border-t border-slate-50 pt-6"
                              >
                                Reference Full Definition <ArrowRight size={12} className="group-hover/btn:translate-x-1.5 transition-transform" />
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-8 shadow-sm">
                            <HelpCircle size={40} />
                          </div>
                          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Zero definitions found for "{searchQuery || glossaryLetter}"</p>
                          <button onClick={() => {setSearchQuery(''); setGlossaryLetter(null);}} className="mt-8 text-[#0f4c75] font-black uppercase text-[10px] tracking-widest px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                            Reset Filter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Template Preview Modal */}
      <AnimatePresence>
        {activePreviewTemplate && (
          <TemplatePreviewModal
            template={activePreviewTemplate}
            onClose={() => setActivePreviewTemplate(null)}
            onExport={handleExport}
            onCopy={handleCopy}
            copyStatus={copyStatus}
          />
        )}
      </AnimatePresence>

      {/* Footer Support CTA */}
      <section className="mt-32 max-w-7xl mx-auto px-4">
        <div className="bg-[#0f4c75] rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden text-white shadow-3xl">
          <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-white/5 blur-3xl -ml-64 -mt-64 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tight text-balance leading-tight">Master the <br />Unit Economics.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
              Our hub is designed for developers, founders, and agency owners who prioritize precision over noise. Access everything you need to scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-12 py-6 bg-white text-[#0f4c75] rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                Back to the Top
              </button>
              <a 
                href="mailto:support@stack.com" 
                className="text-white/80 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
              >
                Request a Custom SOP →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden Export Component - Only visible during print */}
      {exportingTemplate && (
        <TemplateExportWrapper 
          title={exportingTemplate.title}
          formatType={exportingTemplate.formatType || 'document'}
          contentData={exportingTemplate.contentData || { sections: [{ title: 'Overview', paragraphs: [exportingTemplate.description, exportingTemplate.content] }] }}
        />
      )}
    </div>
  );
}
