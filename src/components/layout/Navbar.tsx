import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Globe, User, LogOut, Menu, X, ChevronDown, 
  Sparkles, DollarSign, FileText, Receipt, Calendar, 
  ShieldCheck, CreditCard, TrendingUp, Zap, Target, 
  BarChart3, Clock, Milestone, ArrowRight, Calculator,
  Landmark, Send, Hash, Coins, Scale, FileSignature,
  UserPlus, Repeat, MessageSquareQuote, Users, 
  LayoutDashboard, Flame, Percent, ListTodo, Search,
  BookOpen, Library, Star, Newspaper, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { CATEGORIES, TOOLS } from '../../lib/tools-registry';
import AccountDropdown from './AccountDropdown';

// Simple helper to render the tool icon with consistent sizing
const ToolIcon = ({ icon: Icon, className }: { icon: any, className?: string }) => {
  return <Icon size={18} className={className} />;
};

export default function Navbar({ 
  onHomeClick, 
  onPricingClick,
  onResourcesClick,
  onContactClick,
  onToolClick,
  onAuthClick,
  onAllToolsClick
}: { 
  onHomeClick: () => void;
  onPricingClick: () => void;
  onResourcesClick: (tab?: 'guides' | 'blog' | 'templates' | 'glossary') => void;
  onContactClick: () => void;
  onToolClick: (slug: string) => void;
  onAuthClick: (mode: 'login' | 'signup') => void;
  onAllToolsClick: () => void;
}) {
  const { user, logout, tier, isPro, aiUsageCount, showProModal, isHydrated } = useUser();
  const navigate = useNavigate();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Account';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleToolSelection = (slug: string) => {
    onToolClick(slug);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 w-full font-sans">
        {/* Superior Glassmorphism Base - Removed absolute redundant div as it's now applied to header */}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Brand Identity */}
          <button 
            onClick={() => {
              onHomeClick();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 group transition-all shrink-0 hover:opacity-90"
            id="nav-logo"
          >
            <img src="/freelancerkitlogo.png" alt="Freelancer Kit Logo" className="h-32 md:h-36 object-contain" />
          </button>
          
          {/* Desktop Navigation Engine */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" ref={dropdownRef}>
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveDropdown('tools')}
                onClick={() => setActiveDropdown(activeDropdown === 'tools' ? null : 'tools')}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all rounded-full outline-none ${activeDropdown === 'tools' ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-slate-50'}`}
                aria-expanded={activeDropdown === 'tools'}
                aria-haspopup="true"
              >
                Tools 
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'tools' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.99 }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute top-full start-0 mt-3 pt-0 z-[60]"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 w-[640px] overflow-hidden">
                      <div className="grid grid-cols-2 gap-x-2 p-3 bg-white">
                        {CATEGORIES.slice(0, 6).map(cat => (
                          <div key={cat.id} className="p-4 rounded-2xl transition-colors">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">{cat.name}</h4>
                            <div className="space-y-1">
                              {TOOLS.filter(t => t.category === cat.id).slice(0, 3).map(tool => (
                                <button 
                                  key={tool.id}
                                  onClick={() => handleToolSelection(tool.slug)}
                                  className="w-full flex items-center gap-3 p-2 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all group/item text-start"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-primary group-hover/item:bg-white border border-transparent group-hover/item:border-primary/10 transition-all shadow-sm group-hover/item:shadow-md">
                                    <ToolIcon icon={tool.icon} className="transition-colors group-hover/item:text-primary" />
                                  </div>
                                  <span className="truncate">{tool.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Mega Menu Dropdown Footer */}
                      <div className="bg-slate-50/50 p-6 flex items-center justify-between border-t border-slate-100">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                           <p className="text-xs text-slate-500 font-bold italic tracking-tight">30+ Premium business tools active</p>
                        </div>
                        <button 
                          onClick={onAllToolsClick} 
                          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:border-primary hover:text-primary transition-all flex items-center gap-2 group/all shadow-sm"
                        >
                          Explore Directory <ArrowRight size={14} className="group-hover/all:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveDropdown('resources')}
                onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all rounded-full outline-none ${activeDropdown === 'resources' ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-slate-50'}`}
                aria-expanded={activeDropdown === 'resources'}
                aria-haspopup="true"
              >
                Resources 
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.99 }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute top-full start-0 mt-3 pt-0 z-[60]"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 w-[800px] overflow-hidden">
                      <div className="grid grid-cols-12 p-2 bg-white">
                        {/* Column 1: Core Hubs */}
                        <div className="col-span-3 p-6 border-r border-slate-50">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Resource Centers</h4>
                          <div className="space-y-2">
                              {[
                                { name: 'Guides & SOPs', icon: FileText, desc: 'Step-by-step business playbooks.', tab: 'guides' },
                                { name: 'The Blog', icon: Newspaper, desc: 'Insights from the field.', tab: 'blog' },
                                { name: 'Freelance Templates', icon: Library, desc: 'Reusable assets & briefs.', tab: 'templates' },
                                { name: 'Business Glossary', icon: BookOpen, desc: 'Master the industry lingo.', tab: 'glossary' }
                              ].map((item, idx) => (
                                <button 
                                  key={idx}
                                  onClick={() => {
                                    onResourcesClick(item.tab as any);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group/res text-start"
                                >
                                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/res:text-primary group-hover/res:bg-white transition-all shadow-sm group-hover/res:shadow-md border border-transparent group-hover/res:border-primary/10">
                                   <item.icon size={18} />
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="text-sm font-bold text-slate-700 group-hover/res:text-primary transition-colors">{item.name}</span>
                                   <span className="text-[10px] text-slate-400 font-medium group-hover/res:text-slate-500">{item.desc}</span>
                                 </div>
                               </button>
                             ))}
                          </div>
                        </div>

                        {/* Column 2: Trending Templates */}
                        <div className="col-span-4 p-6 border-r border-slate-50">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Trending Templates</h4>
                          <div className="space-y-6">
                            {[
                              { name: 'Agency Capacity Planner', desc: 'Standardize your bandwidth tracking.', slug: 'agency-capacity-planner' },
                              { name: 'Client Onboarding SOP', desc: 'A seamless new client intake flow.', slug: 'client-onboarding-checklist' },
                              { name: 'Cold Email Proposal Script', desc: 'High-converting outbound framework.', slug: 'cold-pitch-framework-gen' },
                              { name: 'Retainer Model Calculator', desc: 'Protect your monthly recurring revenue.', slug: 'retainer-agreement-builder' }
                            ].map((item, idx) => (
                              <button 
                                key={idx} 
                                className="group/link flex flex-col gap-1 w-full text-start px-2"
                                onClick={() => {
                                  onToolClick(item.slug);
                                  setActiveDropdown(null);
                                }}
                              >
                                <span className="text-sm font-bold text-slate-700 group-hover/link:text-primary flex items-center gap-2">
                                  {item.name} <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{item.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Column 3: Featured Read */}
                        <div className="col-span-5 p-6 bg-slate-50/50">
                           <Link 
                              to="/resources/blog/value-based-pricing-guide"
                              onClick={() => setActiveDropdown(null)}
                              className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group/featured cursor-pointer h-full flex flex-col"
                           >
                              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover/featured:opacity-100 transition-opacity" />
                                 <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover/featured:scale-110 transition-transform duration-700 font-black uppercase tracking-tighter text-4xl italic">
                                    Insights
                                 </div>
                                 <div className="absolute top-4 left-4 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
                                    <Star size={10} className="text-amber-400 fill-amber-400" /> Featured Guide
                                 </div>
                              </div>
                              <div className="p-6 space-y-3 flex-grow flex flex-col">
                                 <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight group-hover/featured:text-primary transition-colors">
                                    The Comprehensive Guide to Value-Based Pricing
                                 </h3>
                                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Stop trading time for money. Learn the deterministic framework for pricing based on client ROI.
                                 </p>
                                 <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/btn">
                                    Read Article <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                 </div>
                              </div>
                           </Link>
                        </div>
                      </div>
                      
                      {/* Mega Menu Dropdown Footer */}
                      <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
                        <div className="flex items-center gap-2">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <Sparkles size={18} />
                           </div>
                           <p className="text-xs text-slate-600 font-bold tracking-tight">Unlock all 60+ premium business resources.</p>
                        </div>
                        <button 
                          onClick={() => onResourcesClick()} 
                          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 group/library shadow-lg shadow-slate-900/10"
                        >
                          Go to Resource Library <ExternalLink size={14} className="group-hover/library:translate-x-1 group-hover/library:-translate-y-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={onPricingClick} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-all">Pricing</button>
            <button onClick={onContactClick} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-all">Contact</button>
          </nav>
          
          {/* Desktop Call to Actions */}
          <div className="hidden lg:flex items-center gap-6 ms-4 ps-6 border-s border-slate-100/80 min-w-[200px] justify-end">
            {!isHydrated ? (
              <div className="flex items-center gap-3">
                <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-full" />
                <div className="w-10 h-10 bg-slate-100 animate-pulse rounded-2xl" />
              </div>
            ) : (
              <>
                {user && !isPro && (
                  <button 
                    onClick={() => showProModal('Unlimited AI Usage')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm border ${
                      aiUsageCount >= 5 
                        ? 'bg-rose-50 text-rose-600 border-rose-100' 
                        : aiUsageCount === 4 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Zap size={12} className={aiUsageCount >= 4 ? 'animate-pulse' : ''} />
                    {aiUsageCount >= 5 ? '0 Credits' : `${5 - aiUsageCount} Free Credits`}
                  </button>
                )}

                {user ? (
                  <div className="relative" ref={accountRef}>
                    <button 
                      onClick={() => setShowAccountMenu(!showAccountMenu)}
                      className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors active:scale-95 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm transition-colors overflow-hidden font-black text-sm">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{(user.name || 'A').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-slate-900 leading-none">{firstName}</span>
                          <ChevronDown size={16} className={`text-slate-400 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    <AnimatePresence>
                      {showAccountMenu && (
                        <AccountDropdown onClose={() => setShowAccountMenu(false)} />
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button 
                    onClick={() => onAuthClick('login')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Login
                  </button>
                )}
              </>
            )}
  
            {!isPro && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onPricingClick();
                  navigate('/pricing');
                }}
                className="relative overflow-hidden px-8 py-3 rounded-full text-sm font-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all group active:scale-95 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 border border-amber-300/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[infinite-scroll_2s_linear_infinite]" />
                <span className="relative flex items-center gap-2 text-white drop-shadow-md">
                  <Sparkles size={18} className="text-amber-100 animate-pulse" /> Upgrade to Pro
                </span>
              </button>
            )}
          </div>
          
          {/* Mobile Navigation Trigger */}
          <div className="lg:hidden flex items-center gap-3">
             {isHydrated && user && !isPro && (
               <button 
                 onClick={() => showProModal('Unlimited AI Usage')}
                 className={`p-2.5 rounded-xl active:scale-90 transition-all border shadow-sm ${
                   aiUsageCount >= 5 
                    ? 'bg-rose-50 text-rose-600 border-rose-100' 
                    : aiUsageCount === 4 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                 }`}
               >
                  <div className="flex items-center gap-1">
                    <Zap size={16} />
                    <span className="text-[10px] font-black">{5 - aiUsageCount}</span>
                  </div>
               </button>
             )}
             <button 
               onClick={onPricingClick}
               className="p-2.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all active:scale-90 bg-gradient-to-r from-amber-400 to-orange-500 text-white border border-amber-300/50"
             >
                <Sparkles size={20} className="animate-pulse" />
             </button>
             <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 active:scale-90 transition-all z-[80] relative border border-slate-200 shadow-sm"
              aria-label="Toggle mobile menu"
             >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Interaction System */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-md lg:hidden pointer-events-auto"
              onClick={() => setIsMobileMenuOpen(false)}
            />
        
            <motion.div 
              id="mobile-drawer"
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[100] bg-white lg:hidden flex flex-col h-[100dvh] w-full sm:w-[400px] shadow-[-20px_0_60px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="bg-primary text-white p-2 rounded-xl">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black tracking-tight">FreelancerKit</span>
                 </div>
                 <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                 >
                    <X size={24} />
                 </button>
              </div>
        
              <div className="flex-grow overflow-y-auto px-6 py-8 space-y-2 custom-scrollbar">
                <div className="border-b border-slate-50 pb-4">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === 'tools' ? null : 'tools')}
                    className="w-full flex items-center justify-between text-xl font-black text-slate-900 py-4 text-start outline-none"
                  >
                    Product Suite <ChevronDown size={22} className={`transition-transform duration-300 text-slate-400 ${activeAccordion === 'tools' ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {activeAccordion === 'tools' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-slate-50 rounded-3xl p-6 mt-4 grid gap-8">
                          {CATEGORIES.slice(0, 6).map(cat => (
                            <div key={cat.id} className="space-y-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-1">{cat.name}</p>
                              <div className="grid gap-2">
                                {TOOLS.filter(t => t.category === cat.id).slice(0, 4).map(tool => (
                                  <button 
                                    key={tool.id}
                                    onClick={() => handleToolSelection(tool.slug)}
                                    className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl group transition-all active:scale-[0.98]"
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                    <ToolIcon icon={tool.icon} className="transition-colors group-hover:text-primary" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{tool.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              onAllToolsClick();
                              setIsMobileMenuOpen(false);
                            }} 
                            className="w-full py-5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
                          >
                            Explore 30+ Enterprise Tools
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
        
                <nav className="space-y-1 py-4">
                  <button onClick={() => { onResourcesClick(); setIsMobileMenuOpen(false); }} className="w-full text-start text-xl font-bold text-slate-900 py-5 transition-colors hover:text-primary">
                    Success Resources
                  </button>
                  <button onClick={() => { onPricingClick(); setIsMobileMenuOpen(false); }} className="w-full text-start text-xl font-bold text-slate-900 py-5 transition-colors hover:text-primary">
                    Enterprise Pricing
                  </button>
                  <button onClick={() => { onContactClick(); setIsMobileMenuOpen(false); }} className="w-full text-start text-xl font-bold text-slate-900 py-5 transition-colors hover:text-primary">
                    Get in Touch
                  </button>
                </nav>
                
                <div className="pt-12 space-y-6 pb-20 border-t border-slate-50">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Membership Management</h4>
                  {user ? (
                    <div className="flex items-center justify-between bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">{tier} Access</span>
                          <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{user.email}</span>
                       </div>
                       <button onClick={logout} className="p-4 text-danger bg-white rounded-2xl border border-slate-200 shadow-sm active:scale-95 transition-all">
                          <LogOut size={20} />
                       </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onAuthClick('login');
                      }}
                      className="flex items-center justify-center gap-3 w-full py-6 bg-slate-100 text-slate-900 rounded-[2rem] text-sm font-black transition-all hover:bg-slate-200 active:scale-95 shadow-inner"
                    >
                      <User size={20} /> Login to Account
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onPricingClick();
                    }}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-sm font-black shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-95 transition-all"
                  >
                    <Sparkles size={20} className="text-amber-400" /> Start Pro Journey
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
