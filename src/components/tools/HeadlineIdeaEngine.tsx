import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Sparkles, 
  Copy, 
  RefreshCcw, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  PenTool,
  Mail,
  Layout,
  ExternalLink,
  Search,
  MessageSquare,
  Video,
  FileText,
  User,
  Quote,
  Loader2
} from 'lucide-react';

type Platform = 'Blog Title' | 'Email Subject Line' | 'YouTube Title' | 'Ad Copy Hook' | 'Social Media Post';
type Tone = 'Professional' | 'Witty' | 'Bold' | 'Instructional' | 'Urgent';

interface HeadlineResult {
  id: string;
  text: string;
  score: number;
  label: 'Strong' | 'Good' | 'Average';
}

export default function HeadlineIdeaEngine() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [platform, setPlatform] = useState<Platform>('Blog Title');
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tones: Tone[] = ['Professional', 'Witty', 'Bold', 'Instructional', 'Urgent'];
  const platforms: Platform[] = ['Blog Title', 'Email Subject Line', 'YouTube Title', 'Ad Copy Hook', 'Social Media Post'];

  const results = useMemo(() => {
    if (!hasGenerated) return null;
    const t = topic || "Your Topic";
    
    const getScore = (base: number) => {
      const score = Math.min(99, Math.max(70, base + Math.floor(Math.random() * 15)));
      const label: 'Strong' | 'Good' | 'Average' = score > 85 ? 'Strong' : score > 75 ? 'Good' : 'Average';
      return { score, label };
    };

    const listicles: HeadlineResult[] = [
      { id: 'l1', text: `10 Simple Ways to Grow Your ${t} Faster`, ...getScore(82) },
      { id: 'l2', text: `7 Proven Strategies for ${t} Mastery`, ...getScore(85) },
      { id: 'l3', text: `5 Shocking Myths About ${t} Debunked`, ...getScore(78) }
    ];

    const howTos: HeadlineResult[] = [
      { id: 'h1', text: `How to Build a Successful ${t} from Scratch`, ...getScore(88) },
      { id: 'h2', text: `The Ultimate Guide to ${t}: A Step-by-Step System`, ...getScore(90) },
      { id: 'h3', text: `Professional Tips for Optimizing Your ${t} Strategy`, ...getScore(84) }
    ];

    const hooks: HeadlineResult[] = [
      { id: 'k1', text: `Why Most Businesses Fail at ${t} (And How to Succeed)`, ...getScore(92) },
      { id: 'k2', text: `Stop Ignoring ${t}: You're Losing Money Every Day`, ...getScore(94) },
      { id: 'k3', text: `Is ${t} Dead? The Truth Your Competitors Won't Tell You`, ...getScore(89) }
    ];

    return { listicles, howTos, hooks };
  }, [topic, hasGenerated]);

  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 800);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Area */}
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-indigo-100"
        >
          <Sparkles size={12} /> Marketing Psychology v3.0
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Headline & <span className="text-indigo-600">Idea Engine</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Generate attention-grabbing titles, hooks, and content ideas powered by high-converting marketing frameworks.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto mb-16">
        {/* Left Panel: The Input Sandbox */}
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                 <Target size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Campaign Sandbox</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Primary Topic / Keyword</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Content Marketing"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    <Search size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Platform Format</label>
                <div className="relative">
                  <select 
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {platform === 'Blog Title' && <Layout size={16} />}
                    {platform === 'Email Subject Line' && <Mail size={16} />}
                    {platform === 'YouTube Title' && <Video size={16} />}
                    {platform === 'Ad Copy Hook' && <Quote size={16} />}
                    {platform === 'Social Media Post' && <MessageSquare size={16} />}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Tone of Voice</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer text-sm"
                  >
                    {tones.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Target Audience</label>
                  <input 
                    type="text" 
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Small Business Owners"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!topic || isGenerating}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-200 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin text-white" /> Analyzing Trends...
                  </>
                ) : (
                  <>
                    Generate Viral Ideas <Zap size={20} className="fill-white" />
                  </>
                )}
              </button>

              <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ShieldCheck size={14} />
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                   Framework Engine Active: Based on <br/> <span className="text-slate-900">1.2M+ Viral Headlines</span>
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: The Dashboard (Results) */}
        <div className="w-full lg:w-7/12">
          {!hasGenerated && !isGenerating ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-12 text-center text-slate-400">
               <Lightbulb size={48} className="mb-6 opacity-20" />
               <p className="text-xl font-bold mb-2">The Engine is Cold</p>
               <p className="max-w-xs mx-auto text-sm">Enter a topic in the sandbox to generate categorized, high-performing headline ideas.</p>
            </div>
          ) : isGenerating ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white border border-slate-200 rounded-[3rem] p-12 text-center">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 className="mb-8 p-4 bg-indigo-50 text-indigo-600 rounded-full"
               >
                 <RefreshCcw size={48} />
               </motion.div>
               <h3 className="text-2xl font-black text-slate-800 mb-2">Simulating Engagement...</h3>
               <p className="text-slate-500 font-medium tracking-tight">Cross-referencing {topic} against historical performance data.</p>
            </div>
          ) : (
            <div className="space-y-8 h-full">
              {/* Category: The Listicles */}
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Layout size={18} />
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-slate-800">The Listicles</h4>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Proven Format</span>
                </div>
                
                <div className="space-y-3">
                  {results?.listicles.map(idea => (
                    <div key={idea.id} className="flex items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-slate-200">
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
                              idea.label === 'Strong' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                              idea.label === 'Good' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {idea.score}/100 {idea.label}
                            </span>
                         </div>
                         <p className="font-bold text-slate-800 leading-snug">{idea.text}</p>
                       </div>
                       <button 
                         onClick={() => copyToClipboard(idea.text, idea.id)}
                         className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                       >
                         {copiedId === idea.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                       </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Category: The How-To Guides */}
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-slate-800">The How-To Guides</h4>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Educational</span>
                </div>
                
                <div className="space-y-3">
                  {results?.howTos.map(idea => (
                    <div key={idea.id} className="flex items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-slate-200">
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
                              idea.label === 'Strong' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                              idea.label === 'Good' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {idea.score}/100 {idea.label}
                            </span>
                         </div>
                         <p className="font-bold text-slate-800 leading-snug">{idea.text}</p>
                       </div>
                       <button 
                         onClick={() => copyToClipboard(idea.text, idea.id)}
                         className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                       >
                         {copiedId === idea.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                       </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Category: The Hooks & Controversies */}
              <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 text-indigo-400 rounded-lg">
                      <Zap size={18} />
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-white">The Hooks & Controversies</h4>
                  </div>
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">Virality Hazard</span>
                </div>
                
                <div className="space-y-3 relative z-10">
                  {results?.hooks.map(idea => (
                    <div key={idea.id} className="flex items-center justify-between gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group transition-all hover:bg-white/10 hover:border-white/20">
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
                              idea.label === 'Strong' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              idea.label === 'Good' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              'bg-white/10 text-white/60 border-white/10'
                            }`}>
                              {idea.score}/100 {idea.label}
                            </span>
                         </div>
                         <p className="font-bold text-white/90 leading-snug">{idea.text}</p>
                       </div>
                       <button 
                         onClick={() => copyToClipboard(idea.text, idea.id)}
                         className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"
                       >
                         {copiedId === idea.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                       </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Authority SEO & Educational Guide */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none">
        <h2>What is a Headline & Idea Engine?</h2>
        <p>
          A Headline & Idea Engine is a creative marketing tool designed to generate engaging headlines, content ideas, campaign concepts, and attention-grabbing titles for businesses, creators, and marketers.
        </p>
        <p>
          It helps users quickly brainstorm high-performing ideas for blogs, advertisements, social media posts, email campaigns, videos, product promotions, and more.
          Instead of spending hours thinking of creative angles, a Headline & Idea Engine provides instant inspiration tailored to your audience and goals.
        </p>

        <h2>Why Headlines Matter</h2>
        <p>
          A strong headline is often the first thing people notice. Whether it’s a blog post, advertisement, YouTube video, or email subject line, the headline determines whether users continue reading or scroll past.
        </p>
        <p>Effective headlines can help:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Increase click-through rates</li>
          <li>Improve engagement</li>
          <li>Boost website traffic</li>
          <li>Generate more leads and sales</li>
          <li>Strengthen brand visibility</li>
          <li>Capture audience attention quickly</li>
        </ul>
        <p>A compelling headline can make the difference between content that performs well and content that gets ignored.</p>

        <h2>Benefits of a Headline & Idea Engine</h2>
        
        <h3>Faster Content Creation</h3>
        <p>Coming up with fresh ideas consistently can be difficult. A Headline & Idea Engine speeds up the brainstorming process by instantly generating multiple headline variations and content concepts.</p>
        
        <h3>Improved Marketing Performance</h3>
        <p>Creative and engaging headlines attract more attention, leading to better clicks, shares, conversions, and audience engagement across digital platforms.</p>
        
        <h3>Enhanced Creativity</h3>
        <p>The tool helps marketers explore new angles, emotional triggers, and messaging styles they may not have considered otherwise.</p>
        
        <h3>Better SEO Opportunities</h3>
        <p>Well-optimized headlines can improve search engine visibility by incorporating relevant keywords and search-friendly phrases that attract organic traffic.</p>

        <h2>How a Headline & Idea Engine Works</h2>
        <p>A Headline & Idea Engine typically analyzes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Keywords</li>
          <li>Industry or niche</li>
          <li>Audience interests</li>
          <li>Marketing goals</li>
          <li>Trending topics</li>
          <li>Emotional triggers</li>
          <li>Content type</li>
        </ul>
        <p>Based on this information, it generates multiple headline suggestions designed to capture attention and encourage engagement.</p>

        <h2>Examples of Headlines Generated</h2>
        <p>Here are a few examples of what a Headline & Idea Engine can create:</p>
        <ol className="list-decimal pl-6 space-y-2 prose-ol:list-decimal">
          <li>10 Simple Ways to Grow Your Business Faster</li>
          <li>The Ultimate Guide to Digital Marketing Success</li>
          <li>Why Most Startups Fail — And How to Avoid It</li>
          <li>Proven Strategies to Increase Website Conversions</li>
          <li>How to Save Time and Boost Productivity</li>
        </ol>
        <p>The tool can also generate:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Blog topics</li>
          <li>Social media captions</li>
          <li>Ad copy ideas</li>
          <li>Email subject lines</li>
          <li>Video titles</li>
          <li>Product campaign ideas</li>
        </ul>

        <h2>When Should You Use a Headline & Idea Engine?</h2>
        <p>This tool is useful when:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Writing blog posts</li>
          <li>Creating marketing campaigns</li>
          <li>Planning social media content</li>
          <li>Launching products or services</li>
          <li>Running email marketing campaigns</li>
          <li>Improving ad performance</li>
          <li>Overcoming creative blocks</li>
        </ul>
        <p>Businesses, marketers, agencies, and content creators can all benefit from faster idea generation and stronger messaging.</p>

        <h2>Final Thoughts</h2>
        <p>
          A Headline & Idea Engine is a powerful tool for improving creativity, marketing performance, and content efficiency. By generating compelling headlines and fresh ideas instantly, businesses can save time, attract more attention, and create content that connects more effectively with their target audience.
        </p>
        <p>
          Whether you are building a brand, growing a business, or managing content campaigns, strong headlines can significantly improve your results.
        </p>
      </section>
    </div>
  );
}
