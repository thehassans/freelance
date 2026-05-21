import React, { useState, useEffect } from 'react';
import { TOOLS, CATEGORIES, getCategorySlug, getCategoryIdFromSlug } from './lib/tools-registry';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToolGrid from './components/ToolGrid';
import { Tool } from './types';
import RateLandingPage from './components/tools/RateLandingPage';
import ProposalGenerator from './components/tools/ProposalGenerator';
import InvoiceLandingPage from './components/tools/InvoiceLandingPage';
import CostEstimator from './components/tools/CostEstimator';
import LatePaymentCalculator from './components/tools/LatePaymentCalculator';
import BillableTracker from './components/tools/BillableTracker';
import ExpenseTool from './components/tools/ExpenseTool';
import SEOKit from './components/tools/SEOKit';
import ContractBuilder from './components/tools/ContractBuilder';
import TimezoneConverter from './components/tools/TimezoneConverter';
import TaskPrioritizer from './components/tools/TaskPrioritizer';
import ProfitMarginCalculator from './components/tools/ProfitMarginCalculator';
import PortfolioBuilder from './components/tools/PortfolioBuilder';
import ProjectDashboard from './components/tools/ProjectDashboard';
import RunwayCalculator from './components/tools/RunwayCalculator';
import ScopeCreepMessenger from './components/tools/ScopeCreepMessenger';
import FollowUpEmailGenerator from './components/tools/FollowUpEmailGenerator';
import TestimonialRequestGenerator from './components/tools/TestimonialRequestGenerator';
import TaxEstimator from './components/tools/TaxEstimator';
import IncomeGoalPlanner from './components/tools/IncomeGoalPlanner';
import ProjectNumberGenerator from './components/tools/ProjectNumberGenerator';
import CurrencyConverter from './components/tools/CurrencyConverter';
import TimelineGenerator from './components/tools/TimelineGenerator';
import OnboardingChecklist from './components/tools/OnboardingChecklist';
import PrivacyPolicyGenerator from './components/tools/PrivacyPolicyGenerator';
import RetainerBuilder from './components/tools/RetainerBuilder';
import CapacityPlanner from './components/tools/CapacityPlanner';
import CannibalizationDetector from './components/tools/CannibalizationDetector';
import AssetVault from './components/tools/AssetVault';
import TaskTriage from './components/tools/TaskTriage';
import HandoffGenerator from './components/tools/HandoffGenerator';
import RevisionTracker from './components/tools/RevisionTracker';
import ContentBriefGen from './components/tools/ContentBriefGen';
import ColdPitchGenerator from './components/tools/ColdPitchGenerator';
import IntegrationScoper from './components/tools/IntegrationScoper';
import MigrationMapper from './components/tools/MigrationMapper';
import PxToRemConverter from './components/tools/PxToRemConverter';
import JsonFormatter from './components/tools/JsonFormatter';
import RoasCalculator from './components/tools/RoasCalculator';
import WordCounter from './components/tools/WordCounter';
import AdvancedCssEngine from './components/tools/AdvancedCssEngine';
import ColorContrastChecker from './components/tools/ColorContrastChecker';
import BusinessValuationCalculator from './components/tools/BusinessValuationCalculator';
import InvestmentCalculator from './components/tools/InvestmentCalculator';
import WholesalePricingEngine from './components/tools/WholesalePricingEngine';
import FbAdsCalculator from './components/tools/FbAdsCalculator';
import EmailRoiCalculator from './components/tools/EmailRoiCalculator';
import SocialRoiCalculator from './components/tools/SocialRoiCalculator';
import CpmCalculator from './components/tools/CpmCalculator';
import EngagementCalculator from './components/tools/EngagementCalculator';
import ConversionCalculator from './components/tools/ConversionCalculator';
import RobotsGenerator from './components/tools/RobotsGenerator';
import HtmlWordCounter from './components/tools/HtmlWordCounter';
import IdeaGenerator from './components/tools/IdeaGenerator';
import TextDiffTool from './components/tools/TextDiffTool';
import HtmlTextConverter from './components/tools/HtmlTextConverter';
import CaseConverter from './components/tools/CaseConverter';
import SecurityHeaderAuditor from './components/tools/SecurityHeaderAuditor';
import SSLChecker from './components/tools/SSLChecker';
import CSRGenerator from './components/tools/CSRGenerator';
import CSRDecoder from './components/tools/CSRDecoder';
import BreachCalculator from './components/tools/BreachCalculator';
import ServerConfigGenerator from './components/tools/ServerConfigGenerator';
import DmarcGenerator from './components/tools/DmarcGenerator';
import WpSecurityAuditor from './components/tools/WpSecurityAuditor';
import ZeroTrustScoper from './components/tools/ZeroTrustScoper';
import CookieConsent from './components/tools/CookieConsent';
import RansomwareCalculator from './components/tools/RansomwareCalculator';
import BacklinkAuditor from './components/tools/BacklinkAuditor';
import AlgorithmicRecovery from './components/tools/AlgorithmicRecovery';
import ArbitrageCalculator from './components/tools/ArbitrageCalculator';
import AccessGate from './components/common/AccessGate';
import CaseStudyView from './components/public/CaseStudyView';
import ContractPortal from './components/public/ContractPortal';
import ContactPage from './components/pages/ContactPage';
import SEO from './components/SEO';
import Contact from './components/Contact';
import AuthPage from './components/auth/AuthPage';
import ToolLayoutWrapper from './components/tools/ToolLayoutWrapper';
import PricingPage from './components/pages/PricingPage';
import ResourcesPage from './components/pages/ResourcesPage';
import ResourcePostPage from './components/pages/ResourcePostPage';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Sparkles, Share2, Check, Zap, Target, ShieldCheck, History, FileText, ChevronRight } from 'lucide-react';
import AdminPINScreen from './components/admin/AdminPINScreen';
import AdminPanel from './components/admin/AdminPanel';
import { storage, trackToolLaunch } from './lib/adminStorage';

import { Toaster } from 'sonner';
import LeadCaptureModal from './components/modals/LeadCaptureModal';
import { historyService, HistoryItem } from './lib/history-service';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import ProGateModal from './components/common/ProGateModal';
import TrustLogos from './components/layout/TrustLogos';
import BottomCTA from './components/layout/BottomCTA';
import FAQ from './components/FAQ';
import FeaturedTools from './components/layout/FeaturedTools';
import InstantExperience from './components/layout/InstantExperience';
import ProfessionalSolutions from './components/layout/ProfessionalSolutions';

import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import WorkflowPage from './pages/WorkflowPage';
import CategoryPage from './pages/CategoryPage';
import ProPage from './pages/ProPage';
import SettingsPage from './pages/SettingsPage';
import BillingPage from './pages/BillingPage';

import { SystemConfigProvider } from './contexts/SystemConfigContext';
import ScrollToTop from './components/common/ScrollToTop';

// Site integration: read admin configs on App load
function __loadAdminConfig() {
  try {
    const flags = JSON.parse(localStorage.getItem('fk_flags') || 'null') || { maintenance_mode: false };
    if (flags.maintenance_mode) {
      document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0B0C14;color:#E8EAF0;text-align:center">
          <div>
            <h1 style="font-size:32px;margin-bottom:16px">🔧 Maintenance Mode</h1>
            <p style="color:#6B7280">We'll be back shortly. Follow us for updates.</p>
          </div>
        </div>
      `;
      return;
    }
  } catch(e){}
}
if (typeof window !== 'undefined') {
  __loadAdminConfig();
}

export default function App() {
  const [adminMode, setAdminMode] = useState(false);
  const [adminView, setAdminView] = useState('dashboard');
  const [pinVerified, setPinVerified] = useState(
    sessionStorage.getItem('fk_admin_session') === 'true'
  );

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('admin') === 'true') {
      setAdminMode(true);
    }
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        setAdminMode(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (adminMode) {
    if (!pinVerified) return <AdminPINScreen onSuccess={() => setPinVerified(true)} />;
    return <AdminPanel view={adminView} setView={setAdminView} onExit={() => {
      setAdminMode(false);
      setPinVerified(false);
      sessionStorage.removeItem('fk_admin_session');
      window.history.replaceState({}, '', window.location.pathname);
    }} />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SystemConfigProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </SystemConfigProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { 
    user, 
    loading: userLoading, 
    isProModalOpen, 
    closeProModal, 
    proModalFeature,
    isAuthModalOpen,
    authInitialMode,
    closeAuthModal,
    showAuthModal
  } = useUser();
  const location = useLocation();
  const [activeToolSlug, setActiveToolSlug] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'pricing' | 'resources' | 'resource-detail' | 'contact' | 'public' | 'contract-portal' | 'tools' | 'workflow' | 'pro' | 'category' | 'settings' | 'billing'>('home');
  const [activePersona, setActivePersona] = useState<'engineer' | 'designer' | 'agency' | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const [contentFolder, setContentFolder] = useState<'blog' | 'glossary' | 'templates'>('blog');
  const [resourceTab, setResourceTab] = useState<'guides' | 'blog' | 'templates' | 'glossary'>('guides');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [recentActivity, setRecentActivity] = useState<HistoryItem[]>([]);
  const [recentToolSlugs, setRecentToolSlugs] = useState<string[]>([]);
  
  // Admin dynamic bindings
  const flags = storage.get('fk_flags') || { maintenance_mode: false, announcement_bar: true };
  const announcement = storage.get('fk_announcement') || {
    enabled: true, emoji: '🚀', text: 'JUST LAUNCHED: THE NEW AGENCY CAPACITY PLANNER.', linkText: 'Explore the tool →', linkUrl: '/tools/capacity-planner', bgColor: '#1e3a5f', textColor: '#ffffff'
  };

  const tapCount = React.useRef(0);
  const tapTimer = React.useRef<any>(null);
  const handleLogoTap = () => {
    tapCount.current++;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0 }, 3000);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      window.location.search = '?admin=true'; // Trigger admin reload
    }
  };

  // Simple Router logic
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/p/')) {
      const id = path.split('/p/')[1];
      if (id) {
        setPublicId(id);
        setView('public');
      }
    } else if (path.startsWith('/c/')) {
      const id = path.split('/c/')[1];
      if (id) {
        setShareId(id);
        setView('contract-portal');
      }
    } else if (path.startsWith('/tools/')) {
      const slug = path.split('/tools/')[1];
      if (slug) {
        setActiveToolSlug(slug);
        setView('home');
      }
    } else if (path === '/pro') {
      setView('pro');
    } else if (path === '/tools') {
      setView('tools');
    } else if (path === '/pricing') {
      setView('pricing');
    } else if (path === '/resources') {
      setView('resources');
    } else if (path === '/contact') {
      setView('contact');
    } else if (path === '/settings') {
      setView('settings');
    } else if (path === '/billing') {
      setView('billing');
    } else if (path.startsWith('/resources/blog/')) {
      const slug = path.split('/resources/blog/')[1];
      if (slug) {
        setBlogSlug(slug);
        setContentFolder('blog');
        setView('resource-detail');
      }
    } else if (path.startsWith('/resources/glossary/')) {
      const slug = path.split('/resources/glossary/')[1];
      if (slug) {
        setBlogSlug(slug);
        setContentFolder('glossary');
        setView('resource-detail');
      }
    } else if (path.startsWith('/workflows/')) {
      const persona = path.split('/workflows/')[1] as 'engineer' | 'designer' | 'agency';
      if (['engineer', 'designer', 'agency'].includes(persona)) {
        setActivePersona(persona);
        setView('workflow');
      }
    } else if (path.startsWith('/categories/')) {
      const catId = path.split('/categories/')[1];
      if (catId) {
        setActiveCategoryId(catId);
        setView('category');
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const unsub = historyService.subscribe((items) => {
      setRecentActivity(items);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    const stored = localStorage.getItem('freelancerkit_recent_tools');
    if (stored) {
      try {
        setRecentToolSlugs(JSON.parse(stored));
      } catch (e) {
        console.error('Recent tools parse error', e);
      }
    }
  }, []);

  const trackVisit = (slug: string) => {
    setRecentToolSlugs(prev => {
      const filtered = prev.filter(s => s !== slug);
      const newRecent = [slug, ...filtered].slice(0, 4);
      localStorage.setItem('freelancerkit_recent_tools', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  useEffect(() => {
    if (activeToolSlug) {
      trackVisit(activeToolSlug);
      
      const tool = TOOLS.find(t => t.slug === activeToolSlug);
      if (tool) {
        trackToolLaunch(tool.id, tool.name, tool.tier);
      }
    }
  }, [activeToolSlug]);

  const activeTool = TOOLS.find(t => t.slug === activeToolSlug);
  const ActiveToolIcon = activeTool?.icon;

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? (Array.isArray(tool.category) ? tool.category.includes(selectedCategory) : tool.category === selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  const handleToolClick = (slug: string) => {
    setActiveToolSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTool = () => {
    const handlePricing = () => {
      setActiveToolSlug(null);
      setView('pricing');
    };

    return (
      <AccessGate requiredTier={activeTool?.tier || 'FREE'} toolName={activeTool?.name || ''}>
        {(() => {
          switch (activeTool?.id) {
            case 'rate-calc': return <RateLandingPage />;
            case 'proposal-gen': return <ProposalGenerator />;
            case 'invoice-gen': return <InvoiceLandingPage onPricingClick={handlePricing} />;
            case 'cost-estimator': return <CostEstimator />;
            case 'late-payment': return <LatePaymentCalculator />;
            case 'billable-tracker': return <BillableTracker />;
            case 'expense-tool': return <ExpenseTool />;
            case 'seo-kit': return <SEOKit />;
            case 'contract-builder': return <ContractBuilder />;
            case 'timezone-converter': return <TimezoneConverter />;
            case 'task-prioritizer': return <TaskPrioritizer />;
            case 'markup-calc': return <ProfitMarginCalculator />;
            case 'portfolio-builder': return <PortfolioBuilder />;
            case 'project-dashboard': return <ProjectDashboard onPricingClick={handlePricing} />;
            case 'financial-runway': return <RunwayCalculator />;
            case 'scope-creep-messenger': return <ScopeCreepMessenger />;
            case 'follow-up-gen': return <FollowUpEmailGenerator />;
            case 'testimonial-gen': return <TestimonialRequestGenerator />;
            case 'tax-estimator': return <TaxEstimator />;
            case 'income-goal-planner': return <IncomeGoalPlanner />;
            case 'project-number-gen': return <ProjectNumberGenerator />;
            case 'currency-converter': return <CurrencyConverter />;
            case 'timeline-generator': return <TimelineGenerator />;
            case 'onboarding-checklist': return <OnboardingChecklist />;
            case 'privacy-policy-gen': return <PrivacyPolicyGenerator />;
            case 'retainer-builder': return <RetainerBuilder />;
            case 'capacity-planner': return <CapacityPlanner />;
            case 'cannibalization-risk': return <CannibalizationDetector />;
            case 'asset-vault': return <AssetVault />;
            case 'task-triage': return <TaskTriage />;
            case 'handoff-gen': return <HandoffGenerator />;
            case 'revision-tracker': return <RevisionTracker />;
            case 'content-brief': return <ContentBriefGen />;
            case 'cold-pitch': return <ColdPitchGenerator />;
            case 'erp-scoper': return <IntegrationScoper />;
            case 'data-migration': return <MigrationMapper />;
            case 'px-rem-calc': return <PxToRemConverter />;
            case 'json-formatter': return <JsonFormatter />;
            case 'roas-calc': return <RoasCalculator />;
            case 'word-counter': return <WordCounter />;
            case 'css-gen': return <AdvancedCssEngine />;
            case 'contrast-checker': return <ColorContrastChecker />;
            case 'business-valuation': return <BusinessValuationCalculator />;
            case 'investment-calc': return <InvestmentCalculator />;
            case 'wholesale-pricing': return <WholesalePricingEngine />;
            case 'fb-ads-calc': return <FbAdsCalculator />;
            case 'email-roi-calc': return <EmailRoiCalculator />;
            case 'social-roi-calc': return <SocialRoiCalculator />;
            case 'cpm-calc': return <CpmCalculator />;
            case 'engagement-calc': return <EngagementCalculator />;
            case 'conversion-calc': return <ConversionCalculator />;
            case 'robots-gen': return <RobotsGenerator />;
            case 'html-word-count': return <HtmlWordCounter />;
            case 'idea-gen': return <IdeaGenerator />;
            case 'text-diff': return <TextDiffTool />;
            case 'html-text-conv': return <HtmlTextConverter />;
            case 'case-conv': return <CaseConverter />;
            case 'http-security-auditor': return <SecurityHeaderAuditor />;
            case 'breach-calculator': return <BreachCalculator />;
            case 'server-config': return <ServerConfigGenerator />;
            case 'dmarc-gen': return <DmarcGenerator />;
            case 'wp-security-auditor': return <WpSecurityAuditor />;
            case 'zero-trust-scoper': return <ZeroTrustScoper />;
            case 'cookie-consent': return <CookieConsent />;
            case 'ransomware-calculator': return <RansomwareCalculator />;
            case 'backlink-auditor': return <BacklinkAuditor />;
            case 'seo-recovery': return <AlgorithmicRecovery />;
            case 'platform-arbitrage': return <ArbitrageCalculator />;
            case 'ssl-checker': return <SSLChecker />;
            case 'csr-generator': return <CSRGenerator />;
            case 'csr-decoder': return <CSRDecoder />;
            default: return (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <h2 className="text-2xl mb-4 font-bold">Under Development</h2>
                <p className="text-slate-500">The tool is currently being built. Check back soon!</p>
                <button 
                  onClick={() => setActiveToolSlug(null)}
                  className="mt-6 px-6 py-2 bg-[#6c63ff] text-white rounded-xl hover:opacity-90 transition-opacity font-bold"
                >
                  Back to discovery
                </button>
              </div>
            );
          }
        })()}
      </AccessGate>
    );
  };

  const handleExploreTools = () => {
    setView('tools');
    window.history.pushState({}, '', '/tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProClick = () => {
    setView('pro');
    window.history.pushState({}, '', '/pro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWorkflowClick = (catId: string) => {
    setActiveCategoryId(catId);
    setView('category');
    window.history.pushState({}, '', `/categories/${catId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (activeToolSlug) {
      return (
        <motion.div 
          key="tool"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
        >
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
            <Link 
              to="/tools" 
              onClick={(e) => {
                e.preventDefault();
                setActiveToolSlug(null);
                setView('tools');
                window.history.pushState({}, '', '/tools');
              }}
              className="hover:text-[#0f4c75] transition-colors"
            >
              Tools
            </Link>
            <ChevronRight size={14} className="text-slate-300 shrink-0" />
            <Link 
              to={`/tools?category=${getCategorySlug(Array.isArray(activeTool?.category) ? activeTool?.category[0] : (activeTool?.category || ''))}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveToolSlug(null);
                setView('tools');
                window.history.pushState({}, '', `/tools?category=${getCategorySlug(Array.isArray(activeTool?.category) ? activeTool?.category[0] : (activeTool?.category || ''))}`);
              }}
              className="hover:text-[#0f4c75] transition-colors"
            >
              {CATEGORIES.find(c => c.id === (Array.isArray(activeTool?.category) ? activeTool?.category[0] : activeTool?.category))?.name || (Array.isArray(activeTool?.category) ? activeTool?.category[0] : activeTool?.category)}
            </Link>
            <ChevronRight size={14} className="text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold">{activeTool?.name}</span>
          </nav>

          {activeTool?.id !== 'invoice-gen' && activeTool?.id !== 'rate-calc' && activeTool?.id !== 'px-rem-calc' && activeTool?.id !== 'json-formatter' && activeTool?.id !== 'roas-calc' && activeTool?.id !== 'word-counter' && activeTool?.id !== 'css-gen' && activeTool?.id !== 'contrast-checker' && activeTool?.id !== 'business-valuation' && activeTool?.id !== 'investment-calc' && activeTool?.id !== 'wholesale-pricing' && activeTool?.id !== 'fb-ads-calc' && activeTool?.id !== 'email-roi-calc' && activeTool?.id !== 'social-roi-calc' && activeTool?.id !== 'cpm-calc' && activeTool?.id !== 'engagement-calc' && activeTool?.id !== 'conversion-calc' && activeTool?.id !== 'robots-gen' && activeTool?.id !== 'html-word-count' && activeTool?.id !== 'idea-gen' && activeTool?.id !== 'text-diff' && activeTool?.id !== 'html-text-conv' && activeTool?.id !== 'case-conv' && activeTool?.id !== 'http-security-auditor' && activeTool?.id !== 'breach-calculator' && activeTool?.id !== 'server-config' && activeTool?.id !== 'dmarc-gen' && activeTool?.id !== 'wp-security-auditor' && activeTool?.id !== 'zero-trust-scoper' && activeTool?.id !== 'cookie-consent' && activeTool?.id !== 'ransomware-calc' && activeTool?.id !== 'backlink-auditor' && activeTool?.id !== 'seo-recovery' && activeTool?.id !== 'platform-arbitrage' && activeTool?.id !== 'ssl-checker' && activeTool?.id !== 'csr-generator' && activeTool?.id !== 'csr-decoder' && (
            <div className="mb-6 md:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#0f4c75] shadow-sm">
                  {ActiveToolIcon && <ActiveToolIcon size={40} strokeWidth={1.5} />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-4xl font-extrabold font-display mb-1">{activeTool?.name}</h1>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className={`p-2 rounded-xl transition-all ${copied ? 'bg-success/10 text-success' : 'bg-slate-50 text-slate-400 hover:text-[#6c63ff] hover:bg-[#6c63ff]/5'}`}
                      title="Copy Tool Link"
                    >
                      {copied ? <Check size={18} /> : <Share2 size={18} />}
                    </button>
                  </div>
                  <p className="text-sm sm:text-lg text-slate-500">{activeTool?.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  activeTool?.tier.toUpperCase() === 'FREE' ? 'bg-green-100 text-green-700' : 
                  'bg-[#6c63ff]/10 text-[#6c63ff]'
                }`}>
                  {activeTool?.tier} tool
                </span>
                {activeTool?.hasAI && (
                  <span className="px-3 py-1 bg-indigo-100 text-[#6c63ff] rounded-full text-xs font-bold uppercase tracking-wider">
                    AI Powered
                  </span>
                )}
              </div>
            </div>
          )}

          <ToolLayoutWrapper activeToolSlug={activeToolSlug}>
            {renderTool()}
          </ToolLayoutWrapper>

          <BottomCTA />
        </motion.div>
      );
    }

    switch (view) {
      case 'pro':
        return <ProPage />;
      case 'tools':
        return (
          <ToolsPage 
            onToolClick={handleToolClick}
            recentToolSlugs={recentToolSlugs}
            recentActivity={recentActivity}
          />
        );
      case 'pricing':
        return <div className="px-4 py-12"><PricingPage /></div>;
      case 'resources':
        return (
          <ResourcesPage 
            initialTab={resourceTab}
            onToolSelect={(slug) => {
              setActiveToolSlug(slug);
              setView('home');
              window.history.pushState({}, '', `/tools/${slug}`);
            }} 
          />
        );
      case 'resource-detail':
        return <ResourcePostPage slug={blogSlug} folder={contentFolder} onBack={() => {
          setBlogSlug(null);
          setView('resources');
          window.history.pushState({}, '', '/resources');
        }} />;
      case 'contact':
        return <div className="px-4 py-12"><ContactPage /></div>;
      case 'workflow':
        return activePersona ? (
          <WorkflowPage 
            persona={activePersona} 
            onToolClick={handleToolClick} 
          />
        ) : null;
      case 'category':
        return activeCategoryId ? (
          <CategoryPage 
            categoryId={activeCategoryId} 
            onToolClick={handleToolClick} 
          />
        ) : null;
      case 'settings':
        return <div className="py-12"><SettingsPage /></div>;
      case 'billing':
        return <div className="py-12"><BillingPage /></div>;
      case 'home':
      default:
        return (
          <HomePage 
            onToolClick={handleToolClick}
            onExploreTools={handleExploreTools}
            onProClick={handleProClick}
            onWorkflowClick={handleWorkflowClick}
            user={user}
          />
        );
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#6c63ff]/20 border-t-[#6c63ff] rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f8]">
      <Toaster position="bottom-right" richColors />
      <LeadCaptureModal />
      {/* Announcement Bar */}
      {view !== 'public' && view !== 'contract-portal' && announcement.enabled && (
        <div style={{ backgroundColor: announcement.bgColor, color: announcement.textColor }} className="text-[10px] sm:text-sm py-2.5 text-center font-bold tracking-wide uppercase relative z-[60]">
          {announcement.emoji} {announcement.text} 
          <button 
            onClick={() => {
              const slug = announcement.linkUrl.split('/tools/')[1];
              if(slug) {
                setActiveToolSlug(slug);
                setView('home');
                window.history.pushState({}, '', '/');
              } else {
                window.location.href = announcement.linkUrl;
              }
            }} 
            className="underline hover:opacity-80 transition-opacity ps-2 cursor-pointer outline-none"
          >
            {announcement.linkText}
          </button>
        </div>
      )}

      <SEO 
        title={activeTool ? activeTool.name : undefined}
        description={activeTool ? activeTool.description : undefined}
      />
      
      <AnimatePresence mode="wait">
        {isAuthModalOpen ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuthPage 
              onBack={closeAuthModal} 
              initialMode={authInitialMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {view === 'public' ? (
              <CaseStudyView id={publicId} />
            ) : view === 'contract-portal' ? (
              <ContractPortal shareId={shareId || ''} />
            ) : (
              <>
                  <Navbar 
                  onHomeClick={() => {
                    handleLogoTap();
                    setActiveToolSlug(null);
                    setView('home');
                    window.history.pushState({}, '', '/');
                  }} 
                  onPricingClick={() => {
                    setActiveToolSlug(null);
                    setView('pricing');
                    window.history.pushState({}, '', '/pricing');
                  }}
                  onResourcesClick={(tab?: 'guides' | 'blog' | 'templates' | 'glossary') => {
                    if (tab) setResourceTab(tab);
                    setActiveToolSlug(null);
                    setView('resources');
                    window.history.pushState({}, '', '/resources');
                  }}
                  onContactClick={() => {
                    setActiveToolSlug(null);
                    setView('contact');
                    window.history.pushState({}, '', '/contact');
                  }}
                  onAllToolsClick={() => {
                    setActiveToolSlug(null);
                    setView('tools');
                    window.history.pushState({}, '', '/tools');
                  }}
                  onToolClick={(slug) => {
                    setActiveToolSlug(slug);
                    setView('home');
                  }}
                  onAuthClick={(mode) => {
                    showAuthModal(mode);
                  }}
                />
                
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    {renderContent()}
                  </AnimatePresence>
                </main>

                <Footer 
                  onHomeClick={() => { setView('home'); window.history.pushState({}, '', '/'); }}
                  onPricingClick={() => { setView('pricing'); window.history.pushState({}, '', '/pricing'); }}
                  onResourcesClick={(tab) => { 
                    if (tab) setResourceTab(tab);
                    setView('resources'); 
                    window.history.pushState({}, '', '/resources'); 
                  }}
                  onContactClick={() => { setView('contact'); window.history.pushState({}, '', '/contact'); }}
                  onToolClick={handleToolClick}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ProGateModal 
        isOpen={isProModalOpen}
        onClose={closeProModal}
        feature={proModalFeature}
        onUpgrade={() => {
          closeProModal();
          setView('pricing');
          window.history.pushState({}, '', '/pricing');
        }}
      />
    </div>
  );
}
