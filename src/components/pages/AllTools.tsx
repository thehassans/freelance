import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ArrowRight, Zap, Globe, Shield, Sparkles, LayoutGrid } from 'lucide-react';
import { TOOLS } from '../../lib/tools-registry';
import SEO from '../SEO';
import ToolCard from '../ToolCard';

interface AllToolsPageProps {
  onToolClick: (slug: string) => void;
  onHome: () => void;
}

export default function AllToolsPage({ onToolClick, onHome }: AllToolsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(TOOLS.map(t => Array.isArray(t.category) ? t.category[0] : t.category))); // Simplified array handling for top-level category UI

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || (Array.isArray(tool.category) ? tool.category.includes(selectedCategory) : tool.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="All Freelance Tools | FreelancerKit Professional Suite"
        description="Explore our complete directory of professional tools for high-end freelancers and consultants. Invoices, contracts, AI proposals, and more."
      />

      {/* Hero Header */}
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-8"
          >
            <Zap size={14} /> Full Suite Access
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-white tracking-tight leading-none mb-6 font-display"
          >
            The Independent <br />
            <span className="text-indigo-500">Power Tools</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Every resource you need to run, scale, and protect your freelance business like an elite agency.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-6 px-4 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search the toolkit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <button
               onClick={() => setSelectedCategory(null)}
               className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 !selectedCategory ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
               }`}
            >
              All Tools
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-32">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, idx) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                onClick={() => onToolClick(tool.slug)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No matching tools found</h3>
            <p className="text-slate-500 font-medium mb-8">Try adjusting your search filters</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}
              className="text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* SEO Footer Section */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-widest">Why use our toolkit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                 <Shield className="text-emerald-500" size={20} />
              </div>
              <h4 className="font-black text-sm uppercase tracking-tight">Vetted Standards</h4>
              <p className="text-slate-400 text-xs leading-relaxed">All outputs follow industry standard legal and financial formatting.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                 <Globe className="text-indigo-500" size={20} />
              </div>
              <h4 className="font-black text-sm uppercase tracking-tight">Universal Compatibility</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Tools designed for 150+ currencies and global tax jurisdictions.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                 <Sparkles className="text-amber-500" size={20} />
              </div>
              <h4 className="font-black text-sm uppercase tracking-tight">AI Augmented</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Leverage Google Gemini for content intelligence and financial logic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home CTA */}
      <footer className="py-20 bg-slate-900 text-center">
         <button 
          onClick={onHome}
          className="group inline-flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
         >
           Back to Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </footer>
    </div>
  );
}
