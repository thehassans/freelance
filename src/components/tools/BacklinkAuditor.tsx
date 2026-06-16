import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Link as LinkIcon, 
  Search, 
  Globe, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
  Share2,
  ChevronDown
} from 'lucide-react';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService, LiveBacklinkReport } from '../../services/DatabaseService';
import LockedToolOverlay from '../common/LockedToolOverlay';
import FreemiumExportWrapper from '../common/FreemiumExportWrapper';
import { toast } from 'sonner';

export default function BacklinkAuditor() {
  const { executeAction, isProcessing } = usePremiumAction();
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<LiveBacklinkReport | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!domain) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const liveData = await DatabaseService.fetchLiveBacklinkData(domain);
      setResult(liveData);
    } catch (error) {
      toast.error('Failed to fetch backlink data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!result) return;
    
    executeAction(async (userId) => {
      await DatabaseService.logToolUsage('backlink-auditor');
      
      // Create CSV content
      const headers = ['Domain Rating', 'Referring Page Title', 'Referring Page URL', 'Anchor Text Context', 'Anchor Text', 'Target URL', 'Status'];
      const rows = result.backlinks.map(b => [
        b.domainRating,
        `"${b.referringPageTitle}"`,
        `"${b.referringPageUrl}"`, 
        `"${b.anchorTextContext}"`,
        `"${b.anchorText}"`, 
        `"${b.targetUrl}"`,
        b.type
      ]);
      const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `backlinks-${result.domain}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Backlink audit exported to CSV.');
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Tool link copied to clipboard!');
  };

  const faqs = [
    {
      q: "Where does this backlink data come from?",
      a: "We aggregate data from top-tier SEO web crawlers to provide an estimated backlink profile, Domain Rating (DR), and URL Rating (UR)."
    },
    {
      q: "What is a Domain Rating (DR)?",
      a: "Domain Rating is a metric from 0-100 that predicts how well a website will rank on search engines based on the quality and quantity of inbound links."
    },
    {
      q: "Why are 'Dofollow' links important?",
      a: "Dofollow links pass 'link equity' or authority from the referring site to your site. Nofollow links drive traffic but do not pass direct SEO authority."
    },
    {
      q: "Does running a backlink audit cost a credit?",
      a: "Viewing the top-level domain metrics is free. Exporting the comprehensive row-by-row CSV report utilizes one freemium credit."
    },
    {
      q: "How can agencies use this tool to close clients?",
      a: "Run an audit on a prospective client's domain and compare it to their top competitor. Use the data gap in the CSV to pitch a targeted link-building retainer."
    },
    {
      q: "What is a 'Referring Domain' vs. a 'Backlink'?",
      a: "A backlink is a single link. A referring domain is the website linking to you. If Forbes links to you 10 times, that is 10 backlinks, but only 1 referring domain."
    }
  ];

  return (
    <div className="space-y-12 pb-24">
      {/* Tool Header */}
      <div className="max-w-4xl mx-auto text-center space-y-6 pt-12 pb-8">
        <div className="flex justify-center items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-[#6c63ff]/10 text-[#6c63ff] rounded-full text-[10px] font-black uppercase tracking-widest">
            FREEMIUM TOOL
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            SEO & Dev
          </span>
        </div>
        
        <div className="inline-flex items-center justify-center p-4 bg-slate-50 rounded-3xl mb-4 border border-slate-100">
          <Globe size={32} className="text-[#6c63ff]" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Backlink Discovery Engine
        </h1>
        
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Audit inbound links, referring domains, and domain authority to reverse-engineer competitor SEO strategies.
        </p>

        <div className="flex justify-center items-center gap-4 pt-4">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
          >
            <Share2 size={16} className="text-slate-400" />
            Share Tool
          </button>
        </div>
      </div>

      {/* Hero Search Section (Locked) */}
      <section className="text-center max-w-3xl mx-auto py-4">
        <LockedToolOverlay />
      </section>

      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-slate-100"></div>
                  <div>
                    <div className="w-20 h-3 bg-slate-100 rounded mb-2"></div>
                    <div className="w-16 h-8 bg-slate-100 rounded mb-2"></div>
                    <div className="w-12 h-2 bg-slate-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-12 animate-pulse w-full">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="w-48 h-6 bg-slate-100 rounded mb-2"></div>
                  <div className="w-64 h-4 bg-slate-100 rounded"></div>
                </div>
                <div className="w-32 h-12 bg-slate-100 rounded-2xl"></div>
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-slate-50 rounded-xl"></div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {result && !isAnalyzing && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8 max-w-7xl mx-auto"
          >
            {/* KPI Row (Ahrefs Style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Domain Rating (DR)', value: result.domainRating.toLocaleString(), desc: null, icon: ShieldCheck, color: 'text-[#e56832]', bg: 'bg-[#e56832]/10' },
                { label: 'URL Rating (UR)', value: result.urlRating.toLocaleString(), desc: null, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Total Backlinks', value: result.totalBacklinks.toLocaleString(), desc: `${result.dofollowBacklinksPercentage}% dofollow`, icon: LinkIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Linking Websites', value: result.referringDomains.toLocaleString(), desc: `${result.dofollowReferringDomainsPercentage}% dofollow`, icon: Users, color: 'text-[#6c63ff]', bg: 'bg-[#6c63ff]/10' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{stat.label}</span>
                    <span className="text-3xl font-black text-slate-900 block">{stat.value}</span>
                    {stat.desc && <span className="text-xs font-medium text-slate-500 block mt-1">{stat.desc}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <FreemiumExportWrapper toolId="backlink-auditor">
                <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Inbound Backlinks</h2>
                    <p className="text-slate-500 font-medium text-sm italic">Audit of top performing links for {result.domain}</p>
                  </div>
                  <button 
                    onClick={handleExport}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Export Full CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="text-center px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 w-24">DR</th>
                        <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Referring Page</th>
                        <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Anchor & Target URL</th>
                        <th className="text-center px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.backlinks.map((link, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-8 text-center align-top">
                            <span className="text-sm font-black text-slate-900 bg-slate-100 rounded-lg px-2 py-1">{link.domainRating}</span>
                          </td>
                          <td className="px-6 py-8 align-top w-2/5 max-w-[300px]">
                            <a 
                              href={link.referringPageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-bold text-blue-600 mb-1 hover:text-blue-700 hover:underline transition-all line-clamp-2 leading-tight"
                            >
                              {link.referringPageTitle}
                            </a>
                            <div className="flex items-center gap-1.5 mt-2">
                              <a 
                                href={link.referringPageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-emerald-600/80 hover:text-emerald-700 truncate w-full flex items-center gap-1"
                                title={link.referringPageUrl}
                              >
                                {link.referringPageUrl} <ExternalLink size={10} className="flex-shrink-0" />
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-8 align-top w-2/5 max-w-[300px]">
                            <div className="text-sm text-slate-600 mb-2 truncate w-full" title={link.anchorTextContext + link.anchorText}>
                              {link.anchorTextContext}<span className="font-bold text-slate-900">{link.anchorText}</span>
                            </div>
                            <div className="text-xs font-medium text-emerald-600/80 truncate w-full flex items-center gap-1" title={link.targetUrl}>
                               <ArrowRight size={10} className="inline flex-shrink-0" /> {link.targetUrl}
                            </div>
                          </td>
                          <td className="px-6 py-8 text-center align-top">
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                              link.type.toLowerCase() === 'dofollow' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {link.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FreemiumExportWrapper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !isAnalyzing && (
        <div className="py-20 text-center">
          <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 mx-auto mb-8">
            <LinkIcon size={48} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Ready to discover links?</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto italic text-sm">
            Enter a competitor or your own domain above to see backlink distribution and authority metrics.
          </p>
        </div>
      )}

      {/* SEO Section */}
      <div className="max-w-5xl mx-auto py-16 border-t border-slate-200 mt-12 px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reverse-Engineering Competitor Authority</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left pt-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">The Power of Backlinks</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Backlinks are the currency of the internet. Analyzing competitor link profiles is the fastest way to build a high-ROI SEO roadmap. By understanding who links to your competitors, you can replicate their success and capture their traffic.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Actionable Data</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                We provide an aggregate view of referring domains, Domain Authority estimates, and URL targets. This level of granularity shows you exactly which pages attract the most powerful links.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-12">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="border-b border-slate-200 last:border-0 bg-transparent">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-600 transition-colors pr-8">{faq.q}</h3>
                  <div className={`p-2 rounded-full transition-colors flex-shrink-0 ${isOpen ? 'bg-slate-100' : 'bg-transparent text-slate-400 group-hover:bg-slate-50'}`}>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
