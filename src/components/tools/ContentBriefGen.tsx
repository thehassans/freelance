import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Copy, Check, FileText, Globe, 
  Target, MessageSquare, List, Link as LinkIcon,
  Search, ArrowRight, Zap, Hash, Layout
} from 'lucide-react';
import FreemiumExportWrapper from '../common/FreemiumExportWrapper';

interface Subheading {
  id: string;
  level: 'H2' | 'H3';
  text: string;
}

const SEARCH_INTENTS = ['Informational', 'Transactional', 'Commercial', 'Navigational'];
const TONES = ['Professional', 'Conversational', 'Authoritative', 'Urgent'];

export default function ContentBriefGen() {
  // 1. STRATEGY INPUT STATE
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [wordCount, setWordCount] = useState(1500);
  const [intent, setIntent] = useState('Informational');
  const [tone, setTone] = useState('Professional');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [subheadings, setSubheadings] = useState<Subheading[]>([
    { id: '1', level: 'H2', text: 'Introduction to [Topic]' }
  ]);
  const [copied, setCopied] = useState(false);

  // Actions
  const addSubheading = (level: 'H2' | 'H3' = 'H2') => {
    setSubheadings([...subheadings, { id: Math.random().toString(36).substr(2, 9), level, text: '' }]);
  };

  const removeSubheading = (id: string) => {
    setSubheadings(subheadings.filter(s => s.id !== id));
  };

  const updateSubheading = (id: string, text: string) => {
    setSubheadings(subheadings.map(s => s.id === id ? { ...s, text } : s));
  };

  const toggleLevel = (id: string) => {
    setSubheadings(subheadings.map(s => s.id === id ? { ...s, level: s.level === 'H2' ? 'H3' : 'H2' } : s));
  };

  // 2. THE MARKDOWN COMPILER
  const markdownBrief = useMemo(() => {
    if (!primaryKeyword.trim()) return null;

    const keywordsList = secondaryKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    let md = `# CONTENT BRIEF: ${primaryKeyword.toUpperCase()}\n\n`;
    
    md += `## 📋 Metadata\n`;
    md += `- **Primary Keyword**: ${primaryKeyword}\n`;
    md += `- **Target Word Count**: ~${wordCount} words\n`;
    md += `- **Search Intent**: ${intent}\n`;
    md += `- **Tone of Voice**: ${tone}\n\n`;
    
    md += `## 🔍 Title & Meta Description\n`;
    md += `- **Proposed Title**: [Draft a compelling title including "${primaryKeyword}"]\n`;
    md += `- **Meta Description**: [Brief 150-160 character summary with primary keyword]\n\n`;
    
    md += `## ✅ Required LSI Keywords\n`;
    md += `- [ ] ${primaryKeyword} (Use in H1, first 100 words, and 3-4 times in body)\n`;
    keywordsList.forEach(k => {
      md += `- [ ] ${k}\n`;
    });
    md += `\n`;
    
    md += `## 🏗️ Article Structure\n`;
    subheadings.forEach(s => {
      md += `${s.level === 'H2' ? '###' : '####'} ${s.text || '[Enter Subheading Text]'}\n`;
    });
    md += `\n`;
    
    md += `## 🔗 Linking Strategy\n`;
    md += `- **Internal Links**: [Link to relevant top-level pages or related blog posts]\n`;
    md += `- **External Links**: [Link to authoritative sources, statistics, or non-competing studies]\n\n`;
    
    md += `--- \n`;
    md += `*Generated via Content Brief Automation Tool*`;

    return md;
  }, [primaryKeyword, wordCount, intent, tone, secondaryKeywords, subheadings]);

  const handleCopy = () => {
    if (!markdownBrief) return;
    navigator.clipboard.writeText(markdownBrief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[800px]">
      {/* 1. THE STRATEGY INPUT ENGINE */}
      <div className="w-full lg:w-2/5 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-8 overflow-y-auto max-h-[850px] custom-scrollbar">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 leading-tight">Brief Strategy</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Define parameters for the compiler</p>
            </div>
          </div>

          {/* SEO Setup */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <Search size={16} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Core SEO Setup</h3>
             </div>
             <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Keyword</label>
                  <input 
                    type="text" 
                    value={primaryKeyword || ''}
                    onChange={(e) => setPrimaryKeyword(e.target.value)}
                    placeholder="e.g. Best Agency Management Software"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Word Count</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={wordCount || 0}
                      onChange={(e) => setWordCount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Words</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Intent & Tone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Intent</h3>
              </div>
              <select 
                value={intent || 'Informational'}
                onChange={(e) => setIntent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {SEARCH_INTENTS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Tone</h3>
              </div>
              <select 
                value={tone || 'Professional'}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Secondary Keywords */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={16} className="text-slate-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">LSI Keywords</h3>
            </div>
            <textarea 
              value={secondaryKeywords || ''}
              onChange={(e) => setSecondaryKeywords(e.target.value)}
              placeholder="Enter LSI keywords separated by commas..."
              className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Content Structure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layout size={16} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Structure</h3>
              </div>
              <button 
                onClick={() => addSubheading()}
                className="p-1.5 bg-slate-900 text-white rounded-lg hover:scale-110 transition-all shadow-md"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {subheadings.map((s) => (
                  <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2"
                  >
                    <button 
                      onClick={() => toggleLevel(s.id)}
                      className={`shrink-0 w-10 py-2 rounded-xl text-[10px] font-black transition-all ${s.level === 'H2' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}
                    >
                      {s.level}
                    </button>
                    <input 
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-400 transition-all"
                      placeholder="Enter subheading title..."
                      value={s.text || ''}
                      onChange={(e) => updateSubheading(s.id, e.target.value)}
                    />
                    <button 
                      onClick={() => removeSubheading(s.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE MARKDOWN COMPILER (Right Panel) */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-[#0B1120] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-full relative">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <FileText size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-indigo-500/20 w-fit mb-0.5">MARKDOWN_ENGINE</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Real-Time Brief Generation</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
          </div>

          <div className="flex-1 p-8 font-mono text-sm overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
              {!primaryKeyword ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 filter grayscale">
                   <Zap size={48} className="mb-4 text-indigo-400" />
                   <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Awaiting Brief Parameters...</p>
                   <p className="text-xs font-bold text-slate-500 mt-2">Enter a primary keyword to begin compilation</p>
                </div>
              ) : (
                <pre className="text-slate-300 whitespace-pre-wrap">
                  {markdownBrief && markdownBrief.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <span key={i} className="text-indigo-400 font-black block mt-2 text-xl">{line}</span>;
                    if (line.startsWith('## ')) return <span key={i} className="text-indigo-300 font-bold block mt-6 text-lg">{line}</span>;
                    if (line.startsWith('### ') || line.startsWith('#### ')) return <span key={i} className="text-slate-100 font-bold block mt-4">{line}</span>;
                    
                    // Highlight primary keyword
                    if (line.includes(primaryKeyword)) {
                      const parts = line.split(new RegExp(`(${primaryKeyword})`, 'g'));
                      return <span key={i} className="block leading-relaxed">
                        {parts.map((part, pi) => part === primaryKeyword ? <span key={pi} className="text-indigo-400 font-black bg-indigo-400/10 px-1 rounded">{part}</span> : part)}
                      </span>;
                    }
                    
                    return <span key={i} className="block leading-relaxed">{line}</span>;
                  })}
                </pre>
              )}
            </div>
          </div>

          {/* SaaS Hooks */}
          <div className="p-8 bg-white/[0.02] border-t border-white/5 space-y-6">
             <div className="flex flex-col md:flex-row gap-4">
                <FreemiumExportWrapper toolId="content-brief-gen" className="flex-1">
                  <button 
                    onClick={handleCopy}
                    disabled={!primaryKeyword}
                    className="w-full px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/10 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        Full Brief Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy Full Brief
                      </>
                    )}
                  </button>
                </FreemiumExportWrapper>
                <button 
                  onClick={() => {
                    window.location.href = `/tools/project-cost-estimator?item=Freelance+Writer&quantity=${wordCount}`;
                  }}
                  className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 active:scale-95 transition-all group"
                >
                   Calculate Writer Cost <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             
             <div className="flex items-center justify-center gap-6 py-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compiler Online</span>
                </div>
                <div className="flex items-center gap-2">
                   <LinkIcon size={10} className="text-indigo-400" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SEO Sync Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                   <Hash size={10} className="text-indigo-400" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">LSI Engine v2.0</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
