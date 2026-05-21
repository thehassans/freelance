import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Eye, 
  Calculator, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Info,
  Users
} from 'lucide-react';

export default function EngagementCalculator() {
  const [likes, setLikes] = useState<string>('1200');
  const [comments, setComments] = useState<string>('85');
  const [shares, setShares] = useState<string>('42');
  const [saves, setSaves] = useState<string>('156');
  const [reach, setReach] = useState<string>('25000');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = useMemo(() => {
    const l = parseFloat(likes) || 0;
    const c = parseFloat(comments) || 0;
    const sh = parseFloat(shares) || 0;
    const sa = parseFloat(saves) || 0;
    const r = parseFloat(reach) || 0;

    const totalInteractions = l + c + sh + sa;
    const engagementRate = r > 0 ? (totalInteractions / r) * 100 : 0;

    let status = 'Healthy';
    let statusColor = 'text-emerald-500';
    if (engagementRate < 1) {
      status = 'Needs Improvement';
      statusColor = 'text-rose-500';
    } else if (engagementRate < 3) {
      status = 'Average';
      statusColor = 'text-blue-500';
    }

    return {
      total: totalInteractions.toLocaleString(),
      rate: engagementRate.toFixed(2),
      status,
      statusColor
    };
  }, [likes, comments, shares, saves, reach]);

  const faqs = [
    {
      question: "What is a good Engagement Rate?",
      answer: "A healthy engagement rate by reach is typically between 3% and 6%. For influencer accounts with large followings, 1-2% is often considered standard. Anything above 10% is exceptional and usually indicates viral content."
    },
    {
      question: "Engagement by Reach vs by Followers?",
      answer: "Engagement by Reach is more accurate for auditing your content's quality because it measures how many people who actually saw the post interacted with it. Engagement by Followers is easier for competitive analysis since you can't see a competitor's reach."
    },
    {
      question: "How do I increase my engagement rate?",
      answer: "Focus on 'Saves' and 'Shares'. Instagram and Facebook's algorithms prioritize these over simple likes because they signal high-value, evergreen content. Ask questions in your captions to drive comments, and create shareable 'save-for-later' educational graphics."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-pink-100"
        >
          <Heart size={12} /> Audience Health Framework
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Engagement Rate <span className="text-pink-600">Calculator</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Audit any social profile. Calculate true engagement based on reach or followers to understand algorithm performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm font-sans">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
                   <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Post Metrics</h3>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1 flex items-center gap-2">
                     <Heart size={10} /> Likes
                   </label>
                   <input 
                     type="number" 
                     value={likes} 
                     onChange={(e) => setLikes(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 transition-all font-sans"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1 flex items-center gap-2">
                     <MessageCircle size={10} /> Comments
                   </label>
                   <input 
                     type="number" 
                     value={comments} 
                     onChange={(e) => setComments(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 transition-all font-sans"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1 flex items-center gap-2">
                     <Share2 size={10} /> Shares
                   </label>
                   <input 
                     type="number" 
                     value={shares} 
                     onChange={(e) => setShares(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 transition-all font-sans"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1 flex items-center gap-2">
                     <Bookmark size={10} /> Saves
                   </label>
                   <input 
                     type="number" 
                     value={saves} 
                     onChange={(e) => setSaves(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 transition-all font-sans"
                   />
                </div>
             </div>

             <div className="space-y-2 p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2 px-1 flex items-center gap-2">
                  <Users size={12} /> Reach (or Followers)
                </label>
                <input 
                  type="number" 
                  value={reach} 
                  onChange={(e) => setReach(e.target.value)}
                  className="w-full px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 transition-all font-sans"
                />
                <p className="text-[10px] text-slate-400 mt-2 px-1">Use reach for audit, followers for competition check.</p>
             </div>
          </section>
        </div>

        {/* Dashboard Column */}
        <div className="lg:col-span-12 xl:col-span-7">
          <section className="bg-slate-950 text-white rounded-[3.5rem] p-4 md:p-6 shadow-2xl overflow-hidden group h-full flex flex-col border border-white/5">
             <div className="relative flex-1 bg-slate-900/50 rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-pink-500/5 blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 text-center space-y-10">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Calculated Engagement Rate</p>
                      <div className="relative inline-block">
                         <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full" />
                         <span className="text-8xl md:text-9xl font-black tracking-tight text-white relative">
                            {stats.rate}%
                         </span>
                      </div>
                   </div>

                   <div className="flex flex-col items-center gap-6">
                      <div className={`px-12 py-4 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl ${stats.statusColor}`}>
                         <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Status Assessment</p>
                         <p className="text-2xl font-black tracking-tight">{stats.status}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 w-full max-w-md bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Interactions</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{stats.total}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                               <CheckCircle2 size={12} className="text-pink-400" /> Confidence
                            </p>
                            <p className="text-3xl font-black text-white tracking-tighter">High</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Audit your competitor's health.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Heart size={40} className="text-pink-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Understanding the difference between calculating Engagement by Reach versus Engagement by Followers is critical for accurate auditing. Reach-based metrics tell you how the algorithm feels about your content; follower-based metrics tell you how your community feels about your brand.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={14} className="text-pink-600" /> Growth Hack
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Posts with higher engagement rates are prioritized by social algorithms, leading to a 'flywheel effect' of even more reach.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <TrendingUp size={14} className="text-emerald-600" /> Content Quality
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Use engagement rate to identify your 'winning' content formats and double down on what your audience actually saves.
                       </p>
                    </div>
                 </div>
                 <p>
                   A high engagement rate is the best predictor of future sales. By focusing on interactions that signal intent (Saves and Comments), you build an audience that is primed to convert when you finally make an offer.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Engagement Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Critical metrics for understanding social media algorithms.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-pink-200/50 border-pink-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-pink-400" />
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
                          <p className="text-slate-500 leading-relaxed font-medium">
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
        <div className="bg-pink-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Verify Your <br/>Social Health.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of influencers and social managers who use data to audit their competitors and optimize their content.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-pink-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your Post <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
