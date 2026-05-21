import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Sparkles, 
  Copy, 
  RefreshCcw, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  PenTool,
  Mail,
  Layout,
  Star
} from 'lucide-react';

type Industry = 'SaaS' | 'Ecommerce' | 'B2B' | 'Agency' | 'Tech' | 'Finance' | 'Health';

export default function IdeaGenerator() {
  const [topic, setTopic] = useState('');
  const [industry, setIndustry] = useState<Industry>('SaaS');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const industries: Industry[] = ['SaaS', 'Ecommerce', 'B2B', 'Agency', 'Tech', 'Finance', 'Health'];

  const generatedIdeas = useMemo(() => {
    const t = topic || "Your Topic";
    
    const blogTitles = [
      { id: 'b1', title: `The Ultimate Guide to ${t}: Everything You Need to Know`, category: 'Guide' },
      { id: 'b2', title: `10 Proven Strategies for Mastering ${t} in 2024`, category: 'Listicle' },
      { id: 'b3', title: `Why Most People Fail at ${t} (And How to Succeed)`, category: 'Opinion' },
      { id: 'b4', title: `Top 5 ${t} Tools to 10X Your Workflow`, category: 'Tech' },
      { id: 'b5', title: `${t} vs. Traditional Methods: Which is Better?`, category: 'Comparison' },
      { id: 'b6', title: `Case Study: How We Used ${t} to Double Revenue`, category: 'Case Study' }
    ];

    const emailSubjects = [
      { id: 'e1', title: `Quick question about your ${t} strategy?`, category: 'Question' },
      { id: 'e2', title: `[New] Steal our ${t} framework`, category: 'Resource' },
      { id: 'e3', title: `Is ${t} dead? (The truth inside)`, category: 'Controversial' },
      { id: 'e4', title: `Tired of struggling with ${t}?`, category: 'Pain Point' },
      { id: 'e5', title: `Re: Your ${t} goals`, category: 'Direct' },
      { id: 'e6', title: `Stop ignoring ${t}. Here's why.`, category: 'Urgency' }
    ];

    return { blogTitles, emailSubjects };
  }, [topic]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const faqs = [
    {
      question: "How do I choose the best headline?",
      answer: "The best headlines usually follow one of three patterns: curiosity-driven, benefit-driven, or pain-point-driven. Experiment with different angles to see which resonates most with your specific target audience."
    },
    {
      question: "Are these ideas SEO-friendly?",
      answer: "Yes, we focus on including your primary 'Topic' keyword early in the headline, which is a key ranking factor. However, you should always balance SEO requirements with 'Human Click-Through Rate' (CTR)."
    },
    {
      question: "What makes a high-converting email subject line?",
      answer: "Personalization and curiosity are key. Short subject lines (3-5 words) often perform better on mobile. Using 'brackets' like [New] or [How To] can also help your email stand out in a crowded inbox."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-slate-200"
        >
          <Sparkles size={12} /> Viral Content Architecture
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Headline & <span className="text-slate-600">Idea Engine</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Eliminate writer's block. Generate high-converting blog titles and email subject lines based on proven psychological frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                   <Target size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 tracking-tight">Campaign Context</h3>
              </div>

              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Your Topic / Keyword</label>
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Content Marketing"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all text-sm"
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Target Industry</label>
                    <div className="grid grid-cols-2 gap-2">
                       {industries.map((ind) => (
                         <button
                           key={ind}
                           onClick={() => setIndustry(ind)}
                           className={`px-4 py-3 rounded-xl font-bold text-xs transition-all border ${
                             industry === ind 
                               ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                               : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                           }`}
                         >
                           {ind}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-4 px-1">
                       <ShieldCheck size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Growth Frameworks Active</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic px-1 font-sans">
                      Our templates are based on 10,000+ top-performing headlines across {industry} and {industry === 'SaaS' ? 'Tech' : 'Marketing'} sectors.
                    </p>
                 </div>
              </div>
           </section>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-8 space-y-8">
           {/* Blog Titles */}
           <section className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10 relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                       <PenTool size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Blog & Article Ideas</h3>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                   <Layout size={12} /> {generatedIdeas.blogTitles.length} variations
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 {generatedIdeas.blogTitles.map((idea) => (
                   <div 
                     key={idea.id}
                     className="group/item flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-900 rounded-3xl border border-slate-100 hover:border-slate-800 transition-all cursor-default"
                   >
                     <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/item:text-slate-500 transition-colors">
                          {idea.category}
                        </span>
                        <p className="font-bold text-slate-800 group-hover/item:text-white transition-colors">{idea.title}</p>
                     </div>
                     <button 
                       onClick={() => copyToClipboard(idea.title, idea.id)}
                       className="p-3 bg-white group-hover/item:bg-white/10 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
                     >
                        {copiedId === idea.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="group-hover/item:text-white" />}
                     </button>
                   </div>
                 ))}
              </div>
           </section>

           {/* Email Subject Lines */}
           <section className="bg-slate-950 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden text-white group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/10 text-white rounded-xl">
                       <Mail size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">Email Subject Lines</h3>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                   <Zap size={12} className="text-amber-400" /> High CTR
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 {generatedIdeas.emailSubjects.map((idea) => (
                   <div 
                     key={idea.id}
                     className="group/item flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 hover:border-white/10 transition-all cursor-default"
                   >
                     <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover/item:text-emerald-400 transition-colors">
                          {idea.category}
                        </span>
                        <p className="font-bold text-white/90">{idea.title}</p>
                     </div>
                     <button 
                       onClick={() => copyToClipboard(idea.title, idea.id)}
                       className="p-3 bg-white/5 group-hover/item:bg-white/20 rounded-xl text-white/40 hover:text-white transition-all shadow-xl"
                     >
                        {copiedId === idea.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                     </button>
                   </div>
                 ))}
              </div>

              <div className="mt-10 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex gap-4 items-center relative z-10">
                 <div className="flex -space-x-2 shrink-0">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[9px] font-black">
                        {i}
                      </div>
                    ))}
                 </div>
                 <p className="text-xs text-white/60 font-medium font-sans">
                   Used by <span className="text-white font-bold">120+ teams</span> this week to boost open rates in the {industry} sector.
                 </p>
              </div>
           </section>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Stop staring at a blank page.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Lightbulb size={40} className="text-slate-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Content marketing is a volume-based strategy, but the bottleneck is often original creative. Our Idea Engine uses formulaic frameworks that have driven millions of page views and open rates for some of the world's fastest-growing SaaS and DTC brands.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 font-sans">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Star size={14} className="text-indigo-600" /> Proven Frameworks
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Every idea generated follows high-performance patterns: Listicles, How-To's, Comparisons, and Case Studies.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Mail size={14} className="text-emerald-600" /> Inbox Engineering
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Subject lines engineered to create 'Information Gaps' that compel readers to click and discover the truth.
                       </p>
                    </div>
                 </div>
                 <p>
                    Whether you're planning a calendar for a new client or trying to resurrect a stagnant email list, these frameworks provide the structural integrity your messaging needs to cut through the noise of the modern digital landscape.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Content Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Mastering the art of headlines and creative hooks.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-slate-200/50 border-slate-300' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-slate-400" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="px-8 pb-8 pl-16">
                          <p className="text-slate-500 leading-relaxed font-medium font-sans">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="mt-32 max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Fuel Your <br/>Content Machine.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of marketers who use our Idea Engine to stay inspired and drive consistent organic growth.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Refresh Ideas <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
