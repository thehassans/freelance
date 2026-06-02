import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Clock, 
  Trash2, 
  FileText, 
  Zap, 
  Search, 
  Copy, 
  CheckCircle2,
  BarChart3,
  Target,
  Smile,
  BookOpen,
  Layout,
  Gauge
} from 'lucide-react';

export default function RealTimeContentAnalyzer() {
  const [text, setText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return {
        wordCount: 0,
        charCount: 0,
        readingTime: 0,
        keywordCount: 0,
        keywordDensity: 0,
        readability: 'N/A',
        sentiment: 'Neutral'
      };
    }

    const words = trimmedText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    
    // Reading Time: Words / 200 minutes
    const readingTime = wordCount / 200;

    // Keyword Density
    let keywordCount = 0;
    if (targetKeyword.trim()) {
      const escapedKeyword = targetKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
      const matches = trimmedText.match(regex);
      keywordCount = matches ? matches.length : 0;
    }
    const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

    // Readability (Mocked logic for demo purposes)
    const avgWordLength = wordCount > 0 ? charCount / wordCount : 0;
    let readability = 'Grade 8 - Easy';
    if (avgWordLength > 6) readability = 'Grade 12 - Academic';
    else if (avgWordLength > 5) readability = 'Grade 10 - Standard';

    // Sentiment (Mocked logic)
    const positiveWords = ['excellent', 'great', 'good', 'awesome', 'best', 'success', 'happy', 'positive', 'quality', 'effective', 'optimized'];
    const lowerText = trimmedText.toLowerCase();
    const posCount = positiveWords.filter(pw => lowerText.includes(pw)).length;
    const sentiment = posCount > 2 ? 'Positive & Professional' : posCount > 0 ? 'Professional' : 'Neutral';

    return {
      wordCount,
      charCount,
      readingTime,
      keywordCount,
      keywordDensity,
      readability,
      sentiment
    };
  }, [text, targetKeyword]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-indigo-100"
        >
          <Zap size={12} /> Optimization Engine v3.0
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Real-Time <span className="text-indigo-600">Content</span> Analyzer
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Audit your content's SEO strength, readability, and performance metrics instantly as you type.
        </p>
      </div>

      {/* Grid Layout: Split Screen */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto mb-16">
        
        {/* Left Panel: The Editor Sandbox */}
        <div className="w-full lg:w-7/12 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
            <div className="flex flex-col gap-6">
              {/* Target Keyword Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Target Keyword for SEO</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="e.g. Digital Marketing"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    <Target size={18} />
                  </div>
                </div>
              </div>

              {/* Main Editor Textarea */}
              <div className="space-y-2 relative">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button 
                    onClick={() => setText('')}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                    title="Clear All"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-slate-900 transition-all shadow-lg flex items-center gap-2 px-4"
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your content here to begin analysis..."
                  className="w-full min-h-[500px] p-8 pt-16 bg-slate-50/50 border border-slate-200 rounded-[2rem] font-medium text-slate-800 text-lg focus:outline-none focus:border-indigo-500 transition-all resize-none placeholder:text-slate-300 font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: The Analytics Dashboard */}
        <div className="w-full lg:w-5/12">
          <div className="sticky top-8 space-y-6">
            {/* Basic Metrics Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">Basic Metrics</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Words</p>
                  <p className="text-3xl font-black text-slate-900 tabular-nums">{stats.wordCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Characters</p>
                  <p className="text-3xl font-black text-slate-900 tabular-nums">{stats.charCount.toLocaleString()}</p>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-50">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-indigo-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Est. Reading Time</span>
                      </div>
                      <span className="text-lg font-black text-slate-900">{stats.readingTime.toFixed(1)} <span className="text-[10px] text-slate-400 uppercase ml-1">Min</span></span>
                   </div>
                </div>
              </div>
            </div>

            {/* SEO & Keyword Density Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/10 text-indigo-400 rounded-xl">
                      <Target size={20} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">SEO Density</h3>
                  </div>
                  {targetKeyword && (
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/20">
                      Targeted
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                   <div className="flex items-end justify-between">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Keyword Frequency</p>
                         <p className="text-4xl font-black text-white tabular-nums">{stats.keywordCount}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Density %</p>
                         <p className={`text-2xl font-black tabular-nums ${
                           stats.keywordDensity > 3 ? 'text-rose-500' : stats.keywordDensity >= 1 ? 'text-emerald-400' : 'text-slate-400'
                         }`}>
                           {stats.keywordDensity.toFixed(2)}%
                         </p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(stats.keywordDensity * 10, 100)}%` }}
                          className={`h-full rounded-full ${
                            stats.keywordDensity > 3 ? 'bg-rose-500' : 'bg-indigo-400'
                          }`}
                        />
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {stats.keywordDensity > 3 ? '⚠️ Keyword stuffing detected' : stats.keywordDensity >= 1 ? '✅ Optimized for search' : 'Optimal range is 1-3%'}
                      </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Readability & Tone Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm font-sans">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Gauge size={20} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">Voice & Clarity</h3>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                       <BookOpen size={18} className="text-slate-400" />
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Readability</span>
                    </div>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-tight text-slate-900">
                       {stats.readability}
                    </span>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                       <Smile size={18} className="text-slate-400" />
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Tone / Sentiment</span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-tight">
                       {stats.sentiment}
                    </span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO & Educational Content */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none">
        <h2>What is a Real-Time Content Analyzer?</h2>
        <p>
          A Real-Time Content Analyzer is a smart digital tool that evaluates written content instantly and provides immediate feedback to improve quality, readability, SEO performance, engagement, and overall effectiveness.
        </p>
        <p>
          It helps writers, marketers, businesses, and content creators optimize their content while they write by analyzing factors such as keywords, grammar, structure, tone, readability, and audience engagement in real time.
          Instead of reviewing content after publishing, a Real-Time Content Analyzer allows users to make improvements instantly for better results.
        </p>

        <h2>Why Real-Time Content Analysis Matters</h2>
        <p>
          High-quality content is essential for digital marketing success. Whether you are writing blog posts, landing pages, social media captions, email campaigns, or advertisements, optimized content performs better across search engines and online platforms.
        </p>
        <p>A Real-Time Content Analyzer helps businesses:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Improve content quality</li>
          <li>Increase SEO rankings</li>
          <li>Enhance readability</li>
          <li>Boost audience engagement</li>
          <li>Reduce grammar and spelling errors</li>
          <li>Optimize marketing performance</li>
        </ul>
        <p>By receiving immediate feedback, users can create more effective and professional content faster.</p>

        <h2>Benefits of a Real-Time Content Analyzer</h2>
        
        <h3>Instant Feedback</h3>
        <p>The analyzer reviews content as you type, helping you quickly identify mistakes, weak sentences, missing keywords, or readability issues without waiting for manual editing.</p>
        
        <h3>Improved SEO Performance</h3>
        <p>The tool can analyze keyword usage, content structure, headings, and optimization opportunities to help improve visibility in search engine results.</p>
        
        <h3>Better Readability</h3>
        <p>A Real-Time Content Analyzer helps make content clearer and easier to understand by identifying long sentences, complex wording, and formatting issues.</p>
        
        <h3>Enhanced Engagement</h3>
        <p>By improving tone, structure, and clarity, businesses can create content that keeps readers interested and encourages higher interaction rates.</p>
        
        <h3>Faster Content Optimization</h3>
        <p>Writers and marketers can save time by making improvements instantly instead of repeatedly editing content after publishing.</p>

        <h2>Features Commonly Included</h2>
        <p>A Real-Time Content Analyzer may include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Grammar and spelling checks</li>
          <li>SEO keyword analysis</li>
          <li>Readability scoring</li>
          <li>Tone and sentiment analysis</li>
          <li>Heading structure evaluation</li>
          <li>Word count tracking</li>
          <li>Plagiarism detection</li>
          <li>Content engagement suggestions</li>
          <li>Meta description optimization</li>
          <li>Keyword density analysis</li>
        </ul>
        <p>These features help users create content that is both user-friendly and search-engine optimized.</p>

        <h2>How a Real-Time Content Analyzer Works</h2>
        <p>The tool scans written content continuously and compares it against optimization standards and best practices.</p>
        <p>It may analyze factors such as:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Sentence structure</li>
          <li>Keyword placement</li>
          <li>Content clarity</li>
          <li>Search engine optimization</li>
          <li>User engagement signals</li>
          <li>Formatting consistency</li>
          <li>Content relevance</li>
        </ul>
        <p>Based on this analysis, the tool provides suggestions and improvement recommendations instantly.</p>

        <h2>When Should You Use a Real-Time Content Analyzer?</h2>
        <p>This tool is useful when creating:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Blog articles</li>
          <li>Website content</li>
          <li>Landing pages</li>
          <li>Product descriptions</li>
          <li>Email marketing campaigns</li>
          <li>Social media content</li>
          <li>Advertisements</li>
          <li>SEO-focused content</li>
          <li>Marketing copy</li>
        </ul>
        <p>Businesses, agencies, bloggers, and content creators can all benefit from real-time optimization and feedback.</p>

        <h2>Why Businesses Use Real-Time Content Analysis</h2>
        <p>Modern digital marketing depends heavily on high-performing content. Businesses use Real-Time Content Analyzers to ensure their content is:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Professional</li>
          <li>Optimized for SEO</li>
          <li>Easy to read</li>
          <li>Engaging for audiences</li>
          <li>Aligned with marketing goals</li>
        </ul>
        <p>This helps improve online visibility, increase conversions, and strengthen brand communication.</p>
      </section>
    </div>
  );
}
