import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Zap, History, FileText, ChevronDown, HelpCircle, Inbox, Sparkles, Flame, Check, Star, LayoutDashboard } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { TOOLS, CATEGORIES, getCategorySlug, getCategoryIdFromSlug } from '../lib/tools-registry';
import ToolGrid from '../components/ToolGrid';
import SEO from '../components/SEO';
import { historyService, HistoryItem } from '../lib/history-service';
import { toast } from 'sonner';
import ToolCard from '../components/ToolCard';

interface ToolsPageProps {
  onToolClick: (slug: string) => void;
  recentToolSlugs: string[];
  recentActivity: HistoryItem[];
}

const FAQS = [
  {
    q: 'Do I need to create an account to use the free tools?',
    a: 'No, our core calculators are available instantly with no login required. Accounts are only needed to save client data or export white-labeled PDFs.'
  },
  {
    q: 'What does the Freemium tag mean?',
    a: 'Freemium tools utilize advanced AI or generate exportable assets. Free accounts receive 5 credits per month to use these specific modules.'
  },
  {
    q: 'Can I integrate these tools with my existing CRM?',
    a: 'Currently, FreelancerKit operates as a standalone operating system, but API webhooks and Zapier integrations are on our immediate roadmap.'
  },
  {
    q: 'Are the Legal Templates localized for my country?',
    a: 'Our legal drafting templates are categorized by region and generally follow US/UK common law. However, we always recommend having a local attorney review any generated contracts before signing.'
  },
  {
    q: 'Do the Calculators factor in historical data?',
    a: 'Yes, if you have a Pro account, your past project scopes and invoices refine the Machine Learning models used in tools like the Profit Margin Estimator and Scope Creep Messenger.'
  },
  {
    q: 'Can I white-label the reports and PDFs?',
    a: 'Absolutely. All Pro modules allow you to strip FreelancerKit branding and insert your own custom agency logo on all exported PDFs.'
  },
  {
    q: 'How do the SEO and Website Auditing tools work?',
    a: 'Our SEO modules perform live HTTP requests and DOM analysis to score your or your clients websites against 40+ ranking factors. They are excellent for generating technical audit PDFs to close new retainers.'
  },
  {
    q: 'Are the cold pitch and proposal generators proven to convert?',
    a: 'Yes. The AI prompts powering our generators are trained on thousands of successful B2B pitches. You simply input your target client details, and we output high-conversion copy.'
  },
  {
    q: 'Can I use the Pricing & Retainer tools for any industry?',
    a: 'While originally built for creative agencies and developers, our margin and retainer calculators are fully agnostic. Consultants, marketers, and independent contractors use them daily to ensure profitability.'
  },
  {
    q: 'How often are new tools added to the directory?',
    a: 'We ship new modules weekly based on community feedback. Pro members get early access to beta tools and can vote on the product roadmap.'
  }
];

const METHODOLOGY = [
  {
    title: 'Zero Spreadsheets',
    desc: 'Replace cluttered Excel templates with hardened, purpose-built utilities that scale with your business.'
  },
  {
    title: 'Bank-Grade Security',
    desc: 'Your client data and financial metrics are secured by Google Cloud firewalls and state-of-the-art encryption.'
  },
  {
    title: 'Client-Facing Professionalism',
    desc: 'Generate white-labeled proposals and statements that position you as a premium service provider.'
  }
];

export default function ToolsPage({ onToolClick, recentToolSlugs }: ToolsPageProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilter, setSortFilter] = useState<'A-Z' | 'Most Popular' | 'Recently Added'>('Most Popular');
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'All' | 'Free' | 'Freemium' | 'Trending' | 'Favorites'>('All');
  const activeCategorySlug = searchParams.get('category') || 'All';
  const activeCategory = getCategoryIdFromSlug(activeCategorySlug);

  // 1. Favorites & Recents Engine
  const [favoritedTools, setFavoritedTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fk_favorited_tools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyUsedTools, setRecentlyUsedTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fk_recently_used_tools');
      if (saved) return JSON.parse(saved);
      if (recentToolSlugs && recentToolSlugs.length > 0) {
        return recentToolSlugs
          .map(slug => TOOLS.find(t => t.slug === slug)?.id)
          .filter((id): id is string => !!id)
          .slice(0, 4);
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fk_favorited_tools', JSON.stringify(favoritedTools));
  }, [favoritedTools]);

  useEffect(() => {
    localStorage.setItem('fk_recently_used_tools', JSON.stringify(recentlyUsedTools));
  }, [recentlyUsedTools]);

  const handleToggleFavorite = (toolId: string, e?: React.MouseEvent) => {
    const isFav = favoritedTools.includes(toolId);
    if (isFav) {
      setFavoritedTools(prev => prev.filter(id => id !== toolId));
      toast.error('Tool unpinned');
    } else {
      setFavoritedTools(prev => [...prev, toolId]);
      toast.success('Tool pinned!');
    }
  };

  const handleToolLaunch = (slug: string) => {
    const tool = TOOLS.find(t => t.slug === slug);
    if (tool) {
      setRecentlyUsedTools(prev => {
        const filtered = prev.filter(id => id !== tool.id);
        const next = [tool.id, ...filtered].slice(0, 4);
        return next;
      });
    }
    onToolClick(slug);
  };

  // 4. Command Palette (Cmd+K Modal) & Fuzzy Search
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const modalFilteredTools = useMemo(() => {
    const query = modalSearchQuery.trim().toLowerCase();
    if (!query) return TOOLS.slice(0, 8); // suggestions default

    return TOOLS.filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(query);
      const descMatch = tool.description.toLowerCase().includes(query);
      const catMatch = Array.isArray(tool.category)
        ? tool.category.some(c => c.toLowerCase().includes(query))
        : tool.category.toLowerCase().includes(query);
      const tagsMatch = tool.tags && Array.isArray(tool.tags)
        ? tool.tags.some(t => t.toLowerCase().includes(query))
        : false;
      return nameMatch || descMatch || catMatch || tagsMatch;
    });
  }, [modalSearchQuery]);

  const setActiveCategory = (id: string) => {
    if (id === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', getCategorySlug(id));
    }
    setSearchParams(searchParams);
  };

  const filteredTools = useMemo(() => {
    let result = TOOLS.filter(tool => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = tool.name.toLowerCase().includes(query) || 
                            tool.description.toLowerCase().includes(query) ||
                            (Array.isArray(tool.category) ? tool.category.some(c => c.toLowerCase().includes(query)) : tool.category.toLowerCase().includes(query));
                            
      const matchesCategory = activeCategory === 'All' ? true : (Array.isArray(tool.category) ? tool.category.includes(activeCategory) : tool.category === activeCategory);
      const matchesAudience = audienceFilter === 'All' ? true : (Array.isArray(tool.audience) ? tool.audience.includes(audienceFilter) : tool.audience === audienceFilter);
      
      let matchesTier = true;
      if (filterTab === 'Free') matchesTier = tool.tier.toUpperCase() === 'FREE';
      if (filterTab === 'Freemium') matchesTier = tool.tier.toUpperCase() === 'FREEMIUM';
      if (filterTab === 'Favorites') matchesTier = favoritedTools.includes(tool.id);
      
      return matchesSearch && matchesCategory && matchesTier && matchesAudience;
    });

    if (filterTab === 'Trending') {
      result = [...result].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    } else if (sortFilter === 'A-Z') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortFilter === 'Most Popular') {
      result = [...result].sort((a, b) => b.monthlyViews - a.monthlyViews);
    } else if (sortFilter === 'Recently Added') {
      result = [...result].sort((a, b) => TOOLS.indexOf(b) - TOOLS.indexOf(a));
    }

    return result;
  }, [searchQuery, activeCategory, sortFilter, filterTab, audienceFilter, favoritedTools]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <SEO 
        title="Complete Freelance Toolkit | Command Center"
        description="Search, filter, and launch 70+ professional-grade utilities for your freelance business."
      />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-100 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f4c75]/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#0f4c75] mb-4 shadow-sm"
              >
                <Zap size={12} /> The Command Center
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight font-display uppercase"
              >
                Freelance Utilities
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-lg font-medium leading-relaxed"
              >
                Launch high-precision modules for pricing, sales, scoping, and ops.
              </motion.p>
            </div>
            
            {recentToolSlugs.length > 0 && (
               <div className="flex -space-x-2">
                 {recentToolSlugs.slice(0, 3).map(slug => {
                    const tool = TOOLS.find(t => t.slug === slug);
                    if (!tool) return null;
                    const Icon = tool.icon;
                    return (
                      <div key={slug} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[#0f4c75] shadow-sm" title={tool.name}>
                        <Icon size={16} />
                      </div>
                    )
                 })}
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Command Center Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="md:col-span-3">
            <div className="sticky top-28 space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Inbox size={12} /> Resource Categories
                </h3>
                <nav className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveCategory('All')}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                      activeCategory === 'All' 
                        ? 'bg-[#0f4c75] text-white shadow-xl shadow-[#0f4c75]/20 translate-x-1' 
                        : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    All Tools
                    <span className={`text-[10px] tabular-nums font-black ${activeCategory === 'All' ? 'text-white/50' : 'text-slate-300'}`}>
                      {TOOLS.length}
                    </span>
                  </button>
                  {CATEGORIES.map(cat => {
                    const count = TOOLS.filter(t => t.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                          activeCategory === cat.id 
                            ? 'bg-[#0f4c75] text-white shadow-xl shadow-[#0f4c75]/20 translate-x-1' 
                            : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
                        }`}
                      >
                        {cat.name}
                        <span className={`text-[10px] tabular-nums font-black ${activeCategory === cat.id ? 'text-white/50' : 'text-slate-300'}`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="p-6 bg-[#0f4c75] rounded-[2rem] text-white overflow-hidden relative group">
                 <Sparkles className="absolute -right-4 -top-4 text-white/10 group-hover:scale-125 transition-transform duration-700" size={120} />
                 <h4 className="text-lg font-black tracking-tight mb-2 relative z-10">Go Pro.</h4>
                 <p className="text-white/70 text-xs font-medium mb-4 relative z-10 leading-relaxed">
                   Unlock AI legal drafting, capacity planning, and project history.
                 </p>
                 <button 
                   onClick={() => navigate('/pricing')}
                   className="w-full py-3 bg-white text-[#0f4c75] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors relative z-10 flex items-center justify-center cursor-pointer"
                 >
                    Upgrade to Pro
                 </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-9 space-y-8">
            {/* Premium Search Bar Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="relative group h-12 px-4 py-2 w-full max-w-sm flex items-center justify-between rounded-full border border-slate-200 bg-white hover:shadow-md hover:border-[#0f4c75] transition-all text-sm font-bold cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Search className="text-slate-400 group-hover:text-[#0f4c75] transition-colors flex-shrink-0" size={18} />
                  <span className="text-slate-400 font-bold">Search</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg text-slate-400 text-[10px] font-black select-none uppercase tracking-widest flex-shrink-0">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              </button>
              {/* Tier Filter Segmented Control */}
              <div className="shrink-0 flex bg-white border border-slate-200 p-1.5 rounded-[2rem] gap-1 flex-wrap">
                {['All', 'Free', 'Freemium', 'Trending', 'Favorites'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterTab(t as any)}
                    className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      filterTab === t 
                        ? 'bg-[#0f4c75] text-white shadow-lg' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Advanced Sorting Dropdown */}
              <div className="shrink-0 relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-slate-300 hover:bg-slate-50 h-full min-w-[200px]"
                >
                  <span>Sort By: {sortFilter}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="bg-white shadow-xl border border-slate-100 rounded-xl overflow-hidden py-1 absolute z-50 mt-2 w-48 right-0"
                    >
                       {['Most Popular', 'A-Z', 'Recently Added'].map(opt => (
                         <div
                           key={opt}
                           onClick={() => {
                              setSortFilter(opt as any);
                              setIsDropdownOpen(false);
                           }}
                           className="hover:bg-slate-50 text-slate-700 cursor-pointer px-4 py-2 text-sm transition-colors flex items-center justify-between"
                         >
                           <span className={sortFilter === opt ? 'text-blue-600 font-medium' : ''}>{opt}</span>
                           {sortFilter === opt && <Check size={14} className="text-blue-600" />}
                         </div>
                       ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Target Audience Filter Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Target Audience:</span>
              {['All', 'Solo Freelancer', 'Dev Agency', 'Creative Studio'].map(aud => (
                <button
                  key={aud}
                  onClick={() => setAudienceFilter(aud)}
                  className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                     audienceFilter === aud 
                       ? 'bg-[#0f4c75] text-white border-[#0f4c75]' 
                       : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>

            {/* Interactive Grid & Favorites Section */}
            {filterTab === 'Favorites' ? (
              <div className="space-y-12">
                {/* First Section: Pinned Shortcuts */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200/40">
                    Pinned Shortcuts
                  </h4>
                  {favoritedTools.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-white rounded-[2rem] border border-dashed border-slate-200/80">
                      You haven&apos;t pinned any tools yet.
                    </div>
                  ) : filteredTools.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 bg-white rounded-[2rem] border border-dashed border-slate-200/80">
                      No pinned shortcuts match your selected filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredTools.map(tool => (
                        <div key={tool.id}>
                          <ToolCard
                            tool={tool}
                            onClick={() => handleToolLaunch(tool.slug)}
                            isStarred={true}
                            onStarToggle={handleToggleFavorite}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Second Section: Recently Used */}
                {recentlyUsedTools.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-slate-200/50">
                    <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200/40">
                      Recently Used
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {recentlyUsedTools.map(id => {
                        const tool = TOOLS.find(t => t.id === id);
                        if (!tool) return null;
                        return (
                          <div key={id}>
                            <ToolCard
                              tool={tool}
                              onClick={() => handleToolLaunch(tool.slug)}
                              isStarred={favoritedTools.includes(tool.id)}
                              onStarToggle={handleToggleFavorite}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Non-Favorites Tabs Display standard grid */
              filteredTools.length > 0 ? (
                <ToolGrid 
                  tools={filteredTools} 
                  onToolClick={handleToolLaunch} 
                  showTrendingBadges={filterTab === 'Trending'}
                  favoritedTools={favoritedTools}
                  onStarToggle={handleToggleFavorite}
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Search size={48} strokeWidth={1} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">No tools found</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                    No tools found matching your current filters. Try resetting them.
                  </p>
                  <button 
                    onClick={() => {setSearchQuery(''); setActiveCategory('All'); setFilterTab('All');}}
                    className="px-10 py-4 bg-[#0f4c75] text-[#fff] rounded-2xl font-black uppercase tracking-widest hover:bg-[#0b395a] transition-all shadow-xl shadow-[#0f4c75]/20 hover:-translate-y-1"
                  >
                    Reset Dashboard
                  </button>
                </motion.div>
              )
            )}

          </main>
        </div>
      </div>

      {/* Footer Help (SEO & FAQs) */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto py-24 px-4 sm:px-6">
           <h2 className="text-3xl font-black text-slate-900 mb-10 text-center tracking-tight">Why Top Agencies Use FreelancerKit</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {METHODOLOGY.map((item, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm text-center transition-transform hover:-translate-y-1">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#0f4c75] shadow-sm">
                     <Zap size={24} />
                   </div>
                   <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
           
           <h3 className="text-2xl font-black text-slate-900 mb-8 text-center tracking-tight">Frequently Asked Questions</h3>
           <div className="space-y-4 max-w-3xl mx-auto">
              {FAQS.map((faq, i) => (
                <details key={i} className="group bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                   <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900">
                     {faq.q}
                     <ChevronDown className="transition-transform group-open:rotate-180 text-slate-400" size={20} />
                   </summary>
                   <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-100">
                     {faq.a}
                   </div>
                </details>
              ))}
           </div>
        </div>
      </div>

      {/* Cmd+K Command Palette Modal */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 select-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[70vh] overflow-hidden"
            >
              {/* Modal Input */}
              <div className="flex items-center gap-4 px-6 border-b border-slate-100 py-5">
                <Search size={22} className="text-slate-400" />
                <input 
                  autoFocus 
                  type="text"
                  placeholder="What do you need to do? (type to search...)" 
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full text-lg text-slate-900 border-none outline-none font-bold placeholder:text-slate-400 focus:ring-0 bg-transparent"
                />
                <button 
                  onClick={() => setIsSearchModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black uppercase tracking-wider bg-slate-100 px-2 py-1 rounded text-slate-500">ESC</span>
                </button>
              </div>

              {/* Modal Results */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">
                  {modalSearchQuery ? 'Matching Toolkit Modules' : 'Popular Suggestions'}
                </div>
                {modalFilteredTools.length > 0 ? (
                  modalFilteredTools.map(tool => {
                    const Icon = tool.icon;
                    const catSlug = Array.isArray(tool.category) ? tool.category[0] : tool.category;
                    const catName = CATEGORIES.find(c => c.id === catSlug)?.name || catSlug;

                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          handleToolLaunch(tool.slug);
                        }}
                        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors rounded-xl text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[#0f4c75] group-hover:bg-white group-hover:border-blue-200 transition-colors">
                            <Icon size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{tool.name}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1">{tool.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] bg-slate-100 px-2.5 py-1 rounded">
                            {catName}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-500 font-bold text-sm">No tools found matching "{modalSearchQuery}"</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Try another keyword like "invoice", "contrast" or "seo"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
