import React, { useState, useMemo, useEffect } from 'react';
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
  Users,
  Lock,
  Unlock,
  Building2,
  Globe,
  Sliders
} from 'lucide-react';

export default function EngagementCalculator() {
  // Bi-directional state
  const [engagements, setEngagements] = useState<string>('1483');
  const [reach, setReach] = useState<string>('25000');
  const [rate, setRate] = useState<string>('');

  // Granular interaction state
  const [likes, setLikes] = useState<string>('1200');
  const [comments, setComments] = useState<string>('85');
  const [shares, setShares] = useState<string>('42');
  const [saves, setSaves] = useState<string>('156');
  const [showGranular, setShowGranular] = useState<boolean>(false);

  // Benchmarking fields
  const [channel, setChannel] = useState<string>('Organic Social');
  const [industry, setIndustry] = useState<string>('Technology');
  const [country, setCountry] = useState<string>('United States');

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sum of granular inputs
  const granularSum = useMemo(() => {
    const l = parseFloat(likes) || 0;
    const c = parseFloat(comments) || 0;
    const sh = parseFloat(shares) || 0;
    const sa = parseFloat(saves) || 0;
    return l + c + sh + sa;
  }, [likes, comments, shares, saves]);

  // Synchronize granular interactions with engagements when granular is active
  useEffect(() => {
    if (showGranular) {
      setEngagements(granularSum > 0 ? granularSum.toString() : '');
    }
  }, [granularSum, showGranular]);

  // Main bi-directional parsing
  const mathEngine = useMemo(() => {
    // Determine active values
    const finalEngStr = showGranular ? granularSum.toString() : engagements;
    const eVal = parseFloat(finalEngStr) || 0;
    const rVal = parseFloat(reach) || 0;
    const pVal = parseFloat(rate) || 0;

    const eFilled = finalEngStr.trim() !== '' && !isNaN(parseFloat(finalEngStr));
    const rFilled = reach.trim() !== '' && !isNaN(parseFloat(reach));
    const pFilled = rate.trim() !== '' && !isNaN(parseFloat(rate));

    const filledCount = (eFilled ? 1 : 0) + (rFilled ? 1 : 0) + (pFilled ? 1 : 0);

    let calculatedEngagements: number | null = null;
    let calculatedReach: number | null = null;
    let calculatedRate: number | null = null;
    let solvedField: 'engagements' | 'reach' | 'rate' | null = null;

    if (filledCount === 2) {
      if (!eFilled) {
        solvedField = 'engagements';
        calculatedEngagements = (rVal * pVal) / 100;
      } else if (!rFilled) {
        solvedField = 'reach';
        calculatedReach = pVal > 0 ? (eVal / pVal) * 100 : 0;
      } else if (!pFilled) {
        solvedField = 'rate';
        calculatedRate = rVal > 0 ? (eVal / rVal) * 100 : 0;
      }
    }

    const effectiveRate = solvedField === 'rate'
      ? (calculatedRate ?? 0)
      : (pFilled ? pVal : 0);

    const effectiveReach = solvedField === 'reach'
      ? (calculatedReach ?? 0)
      : (rFilled ? rVal : 0);

    const effectiveEngagements = solvedField === 'engagements'
      ? (calculatedEngagements ?? 0)
      : (eFilled ? eVal : 0);

    return {
      eVal,
      rVal,
      pVal,
      eFilled,
      rFilled,
      pFilled,
      filledCount,
      solvedField,
      calculatedRate,
      calculatedReach,
      calculatedEngagements,
      effectiveRate,
      effectiveReach,
      effectiveEngagements
    };
  }, [engagements, reach, rate, showGranular, granularSum]);

  // Status assessment based on global benchmarks
  const statusAssessment = useMemo(() => {
    const testRate = mathEngine.effectiveRate;
    if (testRate >= 6.0) {
      return {
        label: 'Excellent (Top 25%)',
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        color: 'text-emerald-400'
      };
    } else if (testRate >= 4.0) {
      return {
        label: 'Good',
        bg: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
        color: 'text-teal-400'
      };
    } else if (testRate >= 3.0) {
      return {
        label: 'Average',
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        color: 'text-amber-400'
      };
    } else {
      return {
        label: 'Below Average',
        bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        color: 'text-rose-400'
      };
    }
  }, [mathEngine.effectiveRate]);

  // Determine central display metric in right card
  const mainMetricDisplay = useMemo(() => {
    let title = 'Engagement Rate';
    let value = `${mathEngine.effectiveRate.toFixed(2)}%`;
    let detail = 'Autosolved from input metrics';

    if (mathEngine.solvedField === 'engagements') {
      title = 'Target Engagements';
      value = Math.round(mathEngine.effectiveEngagements).toLocaleString();
      detail = 'Calculated to hit your target rate';
    } else if (mathEngine.solvedField === 'reach') {
      title = 'Target Reach / Impressions';
      value = Math.round(mathEngine.effectiveReach).toLocaleString();
      detail = 'Required reach for entered engagement';
    } else if (mathEngine.solvedField === 'rate') {
      title = 'Calculated Engagement Rate';
      value = `${mathEngine.effectiveRate.toFixed(2)}%`;
      detail = 'Percent interaction of total reach';
    }

    return { title, value, detail };
  }, [mathEngine]);

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
        {/* Left Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm font-sans">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
                  <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Bi-Directional Solver</h3>
              </div>
              <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                Interactive
              </span>
            </div>

            {/* Input helpers & alerts */}
            <div className="mb-6">
              {mathEngine.filledCount === 3 && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl font-semibold flex items-center gap-2">
                  <Info size={16} className="text-amber-500 shrink-0" />
                  <span>Clear one field to calculate</span>
                </div>
              )}
              {mathEngine.filledCount < 2 && (
                <div className="p-4 bg-slate-50 border border-slate-100 text-slate-500 text-xs rounded-2xl font-semibold flex items-center gap-2">
                  <Info size={16} className="text-slate-400 shrink-0" />
                  <span>Enter any two values to calculate the third</span>
                </div>
              )}
              {mathEngine.filledCount === 2 && (
                <div className="p-4 bg-pink-50/50 border border-pink-100 text-pink-700 text-xs rounded-2xl font-semibold flex items-center gap-2">
                  <Zap size={16} className="text-pink-500 shrink-0" />
                  <span>
                    Solving for <strong>{mathEngine.solvedField === 'engagements' ? 'Total Engagements' : mathEngine.solvedField === 'reach' ? 'Impressions/Reach' : 'Engagement Rate'}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Field 1: Total Engagements */}
              <div className="space-y-2 relative">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1 flex items-center gap-1.5">
                    <Heart size={10} /> Total Engagements
                  </label>
                  {mathEngine.solvedField === 'engagements' && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock size={10} /> Solved
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={
                      mathEngine.solvedField === 'engagements' 
                        ? (mathEngine.calculatedEngagements !== null ? Math.round(mathEngine.calculatedEngagements).toString() : '') 
                        : (showGranular ? granularSum.toString() : engagements)
                    } 
                    onChange={(e) => {
                      if (!showGranular) setEngagements(e.target.value);
                    }}
                    placeholder={mathEngine.solvedField === 'engagements' ? 'Processing...' : 'e.g. 1500'}
                    disabled={mathEngine.solvedField === 'engagements' || showGranular}
                    className={`w-full pl-6 pr-12 py-4 border rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 transition-all font-sans text-lg ${
                      mathEngine.solvedField === 'engagements' || showGranular
                        ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-white border-slate-200'
                    }`}
                  />
                  {/* Clear button */}
                  {!showGranular && mathEngine.solvedField !== 'engagements' && engagements && (
                    <button 
                      type="button"
                      onClick={() => setEngagements('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors"
                    >
                      &times;
                    </button>
                  )}
                </div>
                {showGranular && (
                  <p className="text-[10px] text-pink-600 font-semibold px-1">
                    Summed from specific interactions below
                  </p>
                )}
              </div>

              {/* Field 2: Impressions/Reach */}
              <div className="space-y-2 relative">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1 flex items-center gap-1.5">
                    <Eye size={10} /> Impressions / Reach
                  </label>
                  {mathEngine.solvedField === 'reach' && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock size={10} /> Solved
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={
                      mathEngine.solvedField === 'reach' 
                        ? (mathEngine.calculatedReach !== null ? Math.round(mathEngine.calculatedReach).toString() : '') 
                        : reach
                    } 
                    onChange={(e) => setReach(e.target.value)}
                    placeholder="e.g. 50000"
                    disabled={mathEngine.solvedField === 'reach'}
                    className={`w-full pl-6 pr-12 py-4 border rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 transition-all font-sans text-lg ${
                      mathEngine.solvedField === 'reach'
                        ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-white border-slate-200'
                    }`}
                  />
                  {mathEngine.solvedField !== 'reach' && reach && (
                    <button 
                      type="button"
                      onClick={() => setReach('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Field 3: Engagement Rate (%) */}
              <div className="space-y-2 relative">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1 flex items-center gap-1.5">
                    <TrendingUp size={10} /> Engagement Rate (%)
                  </label>
                  {mathEngine.solvedField === 'rate' && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock size={10} /> Solved
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    value={
                      mathEngine.solvedField === 'rate' 
                        ? (mathEngine.calculatedRate !== null ? mathEngine.calculatedRate.toFixed(2) : '') 
                        : rate
                    } 
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g. 3.45"
                    disabled={mathEngine.solvedField === 'rate'}
                    className={`w-full pl-6 pr-12 py-4 border rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 transition-all font-sans text-lg ${
                      mathEngine.solvedField === 'rate'
                        ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-white border-slate-200'
                    }`}
                  />
                  {mathEngine.solvedField !== 'rate' && rate && (
                    <button 
                      type="button"
                      onClick={() => setRate('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-full transition-colors"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Accordion: Calculate from specific interactions */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (mathEngine.solvedField === 'engagements') {
                    // Do not allow while Engagements is solved
                    return;
                  }
                  setShowGranular(!showGranular);
                }}
                disabled={mathEngine.solvedField === 'engagements'}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                  mathEngine.solvedField === 'engagements' 
                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed' 
                    : 'bg-pink-50/40 hover:bg-pink-50 text-pink-700'
                }`}
              >
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={14} /> 
                  {showGranular ? 'Hide granular metrics' : 'Calculate from specific interactions'}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${showGranular ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showGranular && mathEngine.solvedField !== 'engagements' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 pt-4 pb-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Heart size={8} /> Likes
                        </label>
                        <input 
                          type="number" 
                          value={likes} 
                          onChange={(e) => setLikes(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-55 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <MessageCircle size={8} /> Comments
                        </label>
                        <input 
                          type="number" 
                          value={comments} 
                          onChange={(e) => setComments(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-55 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Share2 size={8} /> Shares
                        </label>
                        <input 
                          type="number" 
                          value={shares} 
                          onChange={(e) => setShares(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-55 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Bookmark size={8} /> Saves
                        </label>
                        <input 
                          type="number" 
                          value={saves} 
                          onChange={(e) => setSaves(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-55 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-pink-500 text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Optional Benchmark Context Fields */}
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-150">
                Optional Benchmark Context
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Channel dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Channel</label>
                  <div className="relative">
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer"
                    >
                      <option value="Display">Display</option>
                      <option value="Paid Social">Paid Social</option>
                      <option value="Organic Social">Organic Social</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Industry dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Industry</label>
                  <div className="relative">
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer"
                    >
                      <option value="Arts & Entertainment">Arts & Entertainment</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Beauty & Fashion">Beauty & Fashion</option>
                      <option value="Business & Brand">Business & Brand</option>
                      <option value="eCommerce & Shopping">eCommerce & Shopping</option>
                      <option value="Finance">Finance</option>
                      <option value="Health & Fitness">Health & Fitness</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Technology">Technology</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Country dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Country</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Dashboard Column */}
        <div className="lg:col-span-12 xl:col-span-7">
          <section className="bg-slate-950 text-white rounded-[3.5rem] p-4 md:p-6 shadow-2xl overflow-hidden group h-full flex flex-col border border-white/5">
             <div className="relative flex-1 bg-slate-900/50 rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-pink-500/5 blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 text-center space-y-10 w-full">
                   {/* Main Metric Prominently in center */}
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block">
                        {mainMetricDisplay.title}
                      </p>
                      <div className="relative inline-block w-full">
                         <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full" />
                         <span className="text-6xl md:text-8xl font-black tracking-tight text-white relative block break-words leading-none">
                            {mainMetricDisplay.value}
                         </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {mainMetricDisplay.detail}
                      </p>
                   </div>

                   {/* Dynamic status pill + grid metrics */}
                   <div className="flex flex-col items-center gap-6">
                      <div className={`px-12 py-4 rounded-[2rem] border transition-all ${statusAssessment.bg}`}>
                         <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Status Assessment</p>
                         <p className="text-2xl font-black tracking-tight">{statusAssessment.label}</p>
                      </div>

                      {/* Display unit stats card */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
                         <div className="p-3">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Engagements</p>
                            <p className="text-xl font-black text-white tracking-tight">
                              {Math.round(mathEngine.effectiveEngagements).toLocaleString()}
                            </p>
                         </div>
                         <div className="p-3 border-y md:border-y-0 md:border-x border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Reach</p>
                            <p className="text-xl font-black text-white tracking-tight">
                              {Math.round(mathEngine.effectiveReach).toLocaleString()}
                            </p>
                         </div>
                         <div className="p-3">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Rate</p>
                            <p className="text-xl font-black text-pink-450 tracking-tight">
                              {mathEngine.effectiveRate.toFixed(2)}%
                            </p>
                         </div>
                      </div>

                      {/* Benchmark Context Summary Tag */}
                      <div className="flex flex-wrap gap-2 justify-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Globe size={10} /> {country}
                        </span>
                        <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Building2 size={10} /> {industry}
                        </span>
                        <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">
                          Channel: {channel}
                        </span>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>

      {/* FAQs Section */}
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
                    className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
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

      {/* Isolated SEO Content Section exactly as requested */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
        <h2>What Does Engagement Rate Mean?</h2>
        <p>
          The Engagement Rate of a campaign is the percentage of people who saw a piece of content or ad and engaged with it. This metric can be used for either ads or content. Due to this, the type of impressions used in the equation below just means the view.
        </p>
        <p>
          <strong>Note:</strong> This metric is occasionally used as the percentage of engagements per user, in which case you would just replace impressions with users in the equation.
        </p>

        <h2>Engagement Rate Formula</h2>
        <p>The engagement rate equation is:</p>
        <div className="bg-slate-50 border-l-4 border-pink-500 p-6 rounded-r-2xl font-mono text-lg text-slate-800 my-6 flex items-center justify-center">
          <span>Engagement Rate = (Engagements / Impressions) &times; 100</span>
        </div>

        <h2>What Is A Good Engagement Rate?</h2>
        <p>
          According to data collected and analysed through our Engagement Rate calculator, the average engagement rate globally across platforms is 3%-4%. The best marketers (the top 25%) average between 6% and 7%, while the bottom 25% of advertisers get around 2%. These are very general benchmarks but are useful if you need to add some context to your performance.
        </p>
        <p>If your results are&hellip;</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>above 6%, you should be very pleased</li>
          <li>above 4% figure, you should be slightly pleased</li>
          <li>below 3% figure, you should be slightly disappointed</li>
          <li>below 2% figure, you should be very disappointed</li>
        </ul>
        <p>
          Most results are somewhere in the middle, so between 2-6% you are more or less doing ok.
        </p>
        <p>
          The best benchmark is always your past performance. If you performed better compared to the same time last year then that is important. This benchmark is more useful for context than a direct comparison.
        </p>
      </section>
    </div>
  );
}
