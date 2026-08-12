import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  MousePointer2, 
  Target, 
  Calculator, 
  HelpCircle, 
  ChevronDown, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers
} from 'lucide-react';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import { toast } from 'sonner';
import FbAdsSEOContent from './FbAdsSEOContent';

export default function FbAdsCalculator() {
  const { executeAction, isProcessing } = usePremiumAction('fb-ads-calc');

  // Primary Inputs
  const [budget, setBudget] = useState<number>(5000);
  const [cpc, setCpc] = useState<number>(0.85);
  const [targetConvRate, setTargetConvRate] = useState<number>(2.5);
  const [aov, setAov] = useState<number>(120);
  const [margin, setMargin] = useState<number>(40);
  
  // Advanced Features State
  const [useFunnelBreakdown, setUseFunnelBreakdown] = useState<boolean>(false);
  const [atcRate, setAtcRate] = useState<number>(8.0); // Add to Cart % of Clicks
  const [icRate, setIcRate] = useState<number>(35.0);  // Initiate Checkout % of ATC
  const [purchaseRate, setPurchaseRate] = useState<number>(50.0); // Purchase % of IC

  // LTV (Customer Lifetime Value) metric
  const [ltv, setLtv] = useState<number>(350);

  // Benchmarks
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>('');

  // What-If Sensitivity Settings
  const [showSensitivity, setShowSensitivity] = useState<boolean>(false);
  const [scenarioCpcChange, setScenarioCpcChange] = useState<number>(15); // e.g. 15% competition spike in Q4

  // Freemium Credits Engine
  const [exportCredits, setExportCredits] = useState<number>(5);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Industry baselines helper
  const loadBenchmark = (benchmarkKey: string) => {
    setSelectedBenchmark(benchmarkKey);
    if (benchmarkKey === 'saas') {
      setCpc(2.50);
      setAov(250);
      setMargin(85);
      setLtv(950);
      if (useFunnelBreakdown) {
        setAtcRate(5.0);
        setIcRate(40.0);
        setPurchaseRate(45.0);
      } else {
        setTargetConvRate(1.8);
      }
      toast.success('Loaded SaaS / Enterprise Tech baselines');
    } else if (benchmarkKey === 'ecommerce') {
      setCpc(0.75);
      setAov(85);
      setMargin(45);
      setLtv(140);
      if (useFunnelBreakdown) {
        setAtcRate(8.0);
        setIcRate(35.0);
        setPurchaseRate(50.0);
      } else {
        setTargetConvRate(2.2);
      }
      toast.success('Loaded E-Commerce / Retail baselines');
    } else if (benchmarkKey === 'infoproducts') {
      setCpc(1.10);
      setAov(99);
      setMargin(90);
      setLtv(190);
      if (useFunnelBreakdown) {
        setAtcRate(10.0);
        setIcRate(50.0);
        setPurchaseRate(60.0);
      } else {
        setTargetConvRate(3.5);
      }
      toast.success('Loaded Info Products / Courses baselines');
    } else if (benchmarkKey === 'agency') {
      setCpc(4.50);
      setAov(1500);
      setMargin(70);
      setLtv(4500);
      if (useFunnelBreakdown) {
        setAtcRate(8.0);
        setIcRate(45.0);
        setPurchaseRate(55.0);
      } else {
        setTargetConvRate(4.0);
      }
      toast.success('Loaded Agency / B2B Services baselines');
    } else if (benchmarkKey === 'highticket') {
      setCpc(1.80);
      setAov(450);
      setMargin(55);
      setLtv(800);
      if (useFunnelBreakdown) {
        setAtcRate(6.0);
        setIcRate(30.0);
        setPurchaseRate(40.0);
      } else {
        setTargetConvRate(1.2);
      }
      toast.success('Loaded High-Ticket E-com baselines');
    }
  };

  // Compute calculated conversion rate from multi-tiered funnel
  const effectiveConvRate = useMemo(() => {
    if (useFunnelBreakdown) {
      return (atcRate * icRate * purchaseRate) / 10000;
    }
    return targetConvRate;
  }, [useFunnelBreakdown, targetConvRate, atcRate, icRate, purchaseRate]);

  // Main Calculation Engine
  const stats = useMemo(() => {
    const clicks = cpc > 0 ? budget / cpc : 0;
    const conversions = clicks * (effectiveConvRate / 100);
    const targetCpa = conversions > 0 ? budget / conversions : 0;

    const breakEvenCpa = aov * (margin / 100);
    const isProfitable = targetCpa <= breakEvenCpa;
    const marginPerUnit = breakEvenCpa - targetCpa;

    const totalRevenue = conversions * aov;
    const totalCogsCalc = conversions * (aov * ((100 - margin) / 100));
    const netProfit = totalRevenue - totalCogsCalc - budget;
    const estRoas = budget > 0 ? totalRevenue / budget : 0;
    const breakEvenRoas = 100 / (margin || 1);

    // LTV:CAC logic
    const cac = targetCpa;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    // Traffic Funnel Steps Counts
    const clicksNum = clicks;
    const atcCount = useFunnelBreakdown ? clicksNum * (atcRate / 100) : clicksNum * (effectiveConvRate / 100) * 2.5;
    const icCount = useFunnelBreakdown ? atcCount * (icRate / 100) : clicksNum * (effectiveConvRate / 100) * 1.6;

    const formatFn = (val: number) => Math.round(val).toLocaleString();
    const formatCur = (val: number) => val.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

    return {
      clicks: formatFn(clicks),
      clicksNum,
      conversions: formatFn(conversions),
      conversionsNum: conversions,
      targetCpa: formatCur(targetCpa),
      targetCpaNum: targetCpa,
      breakEvenCpa: formatCur(breakEvenCpa),
      breakEvenCpaNum: breakEvenCpa,
      isProfitable,
      marginPerUnit: formatCur(marginPerUnit),
      totalRevenue: formatCur(totalRevenue),
      netProfit: formatCur(netProfit),
      netProfitNum: netProfit,
      estRoas: estRoas.toFixed(2) + 'x',
      estRoasNum: estRoas,
      breakEvenRoas,
      impressions: formatFn(clicks / 0.015), // Assuming 1.5% CTR baseline
      atc: formatFn(atcCount),
      ic: formatFn(icCount),
      ltvCacRatio,
    };
  }, [budget, cpc, effectiveConvRate, aov, margin, ltv, useFunnelBreakdown, atcRate, icRate]);

  // Solver Scenario Engine
  const sensitivityStats = useMemo(() => {
    const scenarioCpc = cpc * (1 + scenarioCpcChange / 100);
    const requiredConvRate = effectiveConvRate * (scenarioCpc / (cpc || 1));
    return {
      scenarioCpc,
      requiredConvRate,
    };
  }, [cpc, scenarioCpcChange, effectiveConvRate]);

  // Freemium Export Trigger
  const handleExport = () => {
    if (exportCredits > 0) {
      setExportCredits(prev => prev - 1);
      try {
        DatabaseService.logToolUsage('fb-ads-calculator');
      } catch (e) {
        console.warn('Logging usage failed', e);
      }
      window.print();
      toast.success('Campaign Projection PDF Exported');
    } else {
      toast.error('Monthly export limit reached! Upgrade to Pro.');
    }
  };

  const faqs = [
    {
      question: "What is a good Facebook Ads CPA?",
      answer: "A 'good' CPA varies wildly by industry. For low-ticket e-commerce, $10-$20 might be target. For high-ticket B2B services, a CPA of $200+ could still be highly profitable. The key is ensuring your CPA is significantly lower than your Customer Lifetime Value (LTV)."
    },
    {
      question: "How do I lower my CPA?",
      answer: "There are two primary levers: CPC and Conversion Rate. Lowering CPC requires better ad creative (higher CTR) and audience targeting. Increasing landing page conversion requires better UX, faster load times, and a more compelling offer."
    },
    {
      question: "Why does my CPA increase over time?",
      answer: "This is often due to 'Ad Fatigue' or 'Audience Saturation'. As the same group of people sees your ad multiple times without converting, your CTR drops, which increases your CPC, and ultimately your CPA."
    }
  ];

  const SliderInput = ({ label, value, setter, min, max, step, prefix = '', suffix = '' }: any) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        <div className="relative group w-24">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{prefix}</span>}
          <input 
            type="number" 
            value={value} 
            onChange={(e) => setter(parseFloat(e.target.value) || 0)}
            className={`w-full py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm ${prefix ? 'pl-7' : 'pl-3'} pr-1`}
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{suffix}</span>}
        </div>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setter(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4 print:hidden">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100 shadow-sm animate-pulse">
            ⚡ FREEMIUM TOOL
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 shadow-sm">
            <Target size={12} /> Media Buying Optimization
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Facebook Ads <span className="text-blue-600">CPA</span> Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Stop guessing your campaign performance. Calculate your acquisition costs and conversion targets with pinpoint precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Column - Hidden when printing */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6 print:hidden">
          
          {/* Feature 3: Quick Industry Benchmarks Select */}
          <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                <Layers size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-800">Industry Benchmarks</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Instantly load current global averages</p>
              </div>
            </div>
            
            <div className="relative">
              <select
                value={selectedBenchmark}
                onChange={(e) => loadBenchmark(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Choose Industry Baseline --</option>
                <option value="saas">SaaS / Enterprise Tech (LTV: $950)</option>
                <option value="ecommerce">E-Commerce / Retail (LTV: $140)</option>
                <option value="infoproducts">Info Products / Courses (LTV: $190)</option>
                <option value="agency">Agency / B2B Services (LTV: $4,500)</option>
                <option value="highticket">High-Ticket E-commerce (LTV: $800)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
          </section>

          {/* Campaign Inputs Card */}
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                   <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Campaign Inputs</h3>
             </div>

             {/* Conversions Toggle model */}
             <div className="mb-6 flex bg-slate-100 p-1 rounded-xl">
               <button
                 type="button"
                 onClick={() => setUseFunnelBreakdown(false)}
                 className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${!useFunnelBreakdown ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 Static Rate
               </button>
               <button
                 type="button"
                 onClick={() => setUseFunnelBreakdown(true)}
                 className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${useFunnelBreakdown ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 Funnel Drop-offs
               </button>
             </div>

             <div className="space-y-6">
                <SliderInput 
                  label="Total Monthly Budget" 
                  value={budget} 
                  setter={setBudget} 
                  min={100} max={100000} step={100} 
                  prefix="$" 
                />
                
                <SliderInput 
                  label="Average CPC" 
                  value={cpc} 
                  setter={setCpc} 
                  min={0.10} max={15} step={0.05} 
                  prefix="$" 
                />

                {!useFunnelBreakdown ? (
                  <SliderInput 
                    label="Target Conversion Rate" 
                    value={targetConvRate} 
                    setter={setTargetConvRate} 
                    min={0.1} max={25} step={0.1} 
                    suffix="%" 
                  />
                ) : (
                  /* Feature 5: Funnel Drop off Sliders */
                  <div className="space-y-6 p-5 bg-slate-50 border border-slate-200/50 rounded-2xl">
                    <h5 className="text-[10px] font-black tracking-widest text-[#0f4c75] uppercase mb-2">E-Commerce Funnel Math</h5>
                    
                    <SliderInput 
                      label="Link Clicks → ATC Rate" 
                      value={atcRate} 
                      setter={setAtcRate} 
                      min={1} max={30} step={0.5} 
                      suffix="%" 
                    />
                    <SliderInput 
                      label="ATC → Initiate Checkout Rate" 
                      value={icRate} 
                      setter={setIcRate} 
                      min={5} max={80} step={1} 
                      suffix="%" 
                    />
                    <SliderInput 
                      label="Checkout → Purchase Rate" 
                      value={purchaseRate} 
                      setter={setPurchaseRate} 
                      min={5} max={90} step={1} 
                      suffix="%" 
                    />
                    
                    <div className="text-center pt-2 border-t border-slate-200 border-dashed">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Calculated Conversion Rate</p>
                      <span className="text-lg font-black text-[#0f4c75]">{effectiveConvRate.toFixed(2)}%</span>
                    </div>
                  </div>
                )}
             </div>

             <div className="pt-8 mt-8 border-t border-slate-100 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">Unit Economics</h4>
                
                <SliderInput 
                  label="Average Order Value (AOV)" 
                  value={aov} 
                  setter={setAov} 
                  min={10} max={1500} step={5} 
                  prefix="$" 
                />

                <SliderInput 
                  label="Product Margin" 
                  value={margin} 
                  setter={setMargin} 
                  min={5} max={100} step={1} 
                  suffix="%" 
                />

                {/* Feature 2: LTV Input metric */}
                <SliderInput 
                  label="Customer Lifetime Value (LTV)" 
                  value={ltv} 
                  setter={setLtv} 
                  min={10} max={5000} step={10} 
                  prefix="$" 
                />
             </div>
          </section>

          {/* Feature 1: What-If Sensitivity Engine */}
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                      <TrendingUp size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">What-If Sensitivity Engine</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Forecast market & competitor CPC shifts</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                   <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={showSensitivity}
                      onChange={() => setShowSensitivity(!showSensitivity)}
                   />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
             </div>
             
             <AnimatePresence>
                {showSensitivity && (
                   <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden pt-4 border-t border-slate-100"
                   >
                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-bold">
                               Q4 Traffic Competition Shift
                            </label>
                            <span className="text-sm font-black text-amber-600">+{scenarioCpcChange}% Shift</span>
                         </div>
                         <input 
                            type="range"
                            min={0}
                            max={150}
                            step={5}
                            value={scenarioCpcChange}
                            onChange={(e) => setScenarioCpcChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                         />
                      </div>
                      
                      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl space-y-3 font-sans">
                         <h5 className="text-amber-800 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Zap size={14} /> Solved Scenario Calculator
                         </h5>
                         <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                            If competition drives your CPC up to <span className="text-slate-900 font-bold">${sensitivityStats.scenarioCpc.toFixed(2)}</span> (a <span className="text-slate-900 font-bold">{scenarioCpcChange}%</span> increase), your landing page Conversion Rate must rise from <span className="text-slate-900 font-bold">{effectiveConvRate.toFixed(2)}%</span> to <span className="text-blue-600 font-black">{sensitivityStats.requiredConvRate.toFixed(2)}%</span> to maintain your current Net Profit of <span className="text-slate-900 font-bold">{stats.netProfit}</span>.
                         </p>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </section>
        </div>

        {/* Dashboard Column (Print-Safe Expansion) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col print:w-full print:max-w-none print:shadow-none print:p-0">
          <section className="bg-slate-900 text-white rounded-[3.5rem] p-4 md:p-6 shadow-2xl overflow-hidden group flex-1 flex flex-col print:w-full print:max-w-none print:shadow-none print:border-none print:rounded-none">
             <div className="relative flex-1 bg-slate-950/50 rounded-[2.5rem] p-10 md:p-14 border border-white/5 overflow-hidden flex flex-col print:p-0 print:border-none print:bg-transparent">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none print:hidden" />
                
                <div className="relative z-10 space-y-12 flex-1 print:space-y-8">
                   {/* Target CPA Hero */}
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Estimated Target CPA</p>
                      <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
                         <span className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-br from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.2)] print:text-slate-950">
                            {stats.targetCpa}
                         </span>
                      </div>
                      
                      {/* Progress bar to break even */}
                      <div className="w-full bg-slate-800 h-2 rounded-full mt-6 overflow-hidden print:border print:border-slate-200">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${stats.isProfitable ? 'bg-emerald-500' : 'bg-red-500'}`} 
                          style={{ width: `${Math.min((stats.targetCpaNum / (stats.breakEvenCpaNum || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                         <span>$0</span>
                         <span>Break-Even: {stats.breakEvenCpa}</span>
                      </div>
                   </div>

                   {/* Profitability State Badges */}
                   <div>
                     {stats.isProfitable ? (
                       <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm">
                         ✅ PROFITABLE: {stats.marginPerUnit} Margin per Unit
                       </div>
                     ) : (
                       <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 font-bold text-sm animate-pulse print:animate-none">
                         🚨 UNPROFITABLE CAMPAIGN
                       </div>
                     )}
                   </div>

                   {/* Custom Dashboards Layout */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5 print:grid-cols-2">
                       
                       {/* Feature 4: ROAS Gauge Visualizer */}
                       <div className="flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden print:border-slate-200">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Target ROAS Gauge</p>
                          <div className="relative w-full max-w-[200px] h-[110px] flex justify-center overflow-hidden">
                             <svg viewBox="0 0 200 110" className="w-full h-full select-none overflow-visible">
                                <defs>
                                   <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="#ef4444" />
                                      <stop offset="35%" stopColor="#f59e0b" />
                                      <stop offset="70%" stopColor="#10b981" />
                                      <stop offset="100%" stopColor="#3b82f6" />
                                   </linearGradient>
                                </defs>
                                <path 
                                   d="M 20 100 A 80 80 0 0 1 180 100" 
                                   fill="none" 
                                   stroke="rgba(255,255,255,0.05)" 
                                   strokeWidth="16" 
                                   strokeLinecap="round" 
                                />
                                <path 
                                   d="M 20 100 A 80 80 0 0 1 180 100" 
                                   fill="none" 
                                   stroke="url(#gaugeGradient)" 
                                   strokeWidth="16" 
                                   strokeLinecap="round"
                                   opacity="0.9"
                                />
                                {stats.breakEvenRoas > 0 && stats.breakEvenRoas <= 10 && (
                                   <g transform={`rotate(${-90 + (stats.breakEvenRoas / 10 * 180)}, 100, 100)`}>
                                      <line x1="100" y1="12" x2="100" y2="24" stroke="#fff" strokeWidth="2" />
                                      <text x="100" y="8" fill="#fff" fontSize="7" fontWeight="black" textAnchor="middle">BE</text>
                                   </g>
                                )}
                                <circle cx="100" cy="100" r="8" fill="#fff" />
                                <circle cx="100" cy="100" r="4" fill="#3b82f6" />
                                <line 
                                   x1="100" 
                                   y1="100" 
                                   x2="100" 
                                   y2="30" 
                                   stroke="#eff6ff" 
                                   strokeWidth="4" 
                                   strokeLinecap="round"
                                   style={{
                                      transform: `rotate(${-90 + (Math.min(stats.estRoasNum / 10, 1) * 180)}deg)`,
                                      transformOrigin: '100px 100px',
                                      transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                   }}
                                />
                             </svg>
                             <div className="absolute bottom-1 text-center">
                                <span className="text-3xl font-black text-white">{stats.estRoas}</span>
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
                                   BE ROAS: {stats.breakEvenRoas.toFixed(2)}x
                                </p>
                             </div>
                          </div>
                       </div>

                       {/* Feature 2: LTV : CAC Customer Acquisition Metric */}
                       <div className="p-6 bg-slate-950/40 rounded-[2.5rem] border border-white/5 flex flex-col justify-between print:border-slate-200">
                          <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">LTV : CAC Analysis</p>
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl font-black text-white">
                                   {stats.ltvCacRatio.toFixed(1)}:1
                                </span>
                                <div className="text-right">
                                   {stats.ltvCacRatio >= 3 ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                         🏆 WIN: Scale
                                      </span>
                                   ) : stats.ltvCacRatio >= 1.5 ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                         👍 Healthy Base
                                      </span>
                                   ) : (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                         ⚠️ Optimize
                                      </span>
                                   )}
                                </div>
                             </div>
                             <span className="text-[10px] text-slate-400 font-bold block mb-3">Customer Lifetime Value vs Acquisition Cost</span>
                          </div>
                          <p className="text-xs text-slate-455 font-medium leading-relaxed">
                             {stats.ltvCacRatio >= 3 ? (
                                "Excellent Unit Economics! Your LTV is more than triple your media cost. This campaign has highly viable scaling potential."
                             ) : stats.ltvCacRatio >= 1.5 ? (
                                "Viable Front-end baseline. You are claiming back your acquisition expenses safely. Prioritize LTV optimizations next."
                             ) : (
                                "Risky acquirement. Customer Acquisition Cost (CAC) exceeds long-term value. Refine conversion funnel diagnostics."
                             )}
                          </p>
                       </div>
                   </div>

                   {/* Grid Expansion metrics */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5 print:grid-cols-3">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Est. Revenue</p>
                         <p className="text-2xl font-black text-white">{stats.totalRevenue}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Target ROAS</p>
                         <p className="text-2xl font-black text-blue-400">{stats.estRoas}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Net Profit</p>
                         <p className={`text-2xl font-black ${stats.isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                           {stats.netProfit}
                         </p>
                      </div>
                   </div>
                </div>

                {/* Freemium PDF Export Trigger Panel */}
                <div className="mt-12 pt-8 border-t border-white/5 relative z-10 print:hidden">
                   <button 
                     onClick={handleExport}
                     className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-colors shadow-lg shadow-blue-900/20"
                   >
                     Download Campaign Projection (PDF) (⚡ {exportCredits} Left)
                   </button>
                </div>
             </div>
          </section>

          {/* Feature 5: Multi-Tiered Funnel Drop-off Diagnostic Visualization */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl mt-8 w-full shadow-sm print:hidden">
             <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Traffic Funnel Diagnostics</h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                   {useFunnelBreakdown ? "Funnel Drop-Offs Active" : "Simplified Baseline Model"}
                </span>
             </div>
             
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center bg-slate-50 py-5 px-2 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clicks</span>
                   <span className="text-2xl font-black text-slate-900">{stats.clicks}</span>
                </div>
                <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={18} />
                <div className="text-center md:hidden"><ChevronDown size={14} className="text-slate-300"/></div>
                
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center bg-slate-50 py-5 px-2 rounded-2xl border border-slate-100 relative">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Add to Carts (ATC)
                   </span>
                   <span className="text-2xl font-black text-blue-600">{stats.atc}</span>
                   {useFunnelBreakdown && (
                      <span className="text-[10px] text-blue-500 font-bold mt-1">
                         {atcRate}% of Clicks
                      </span>
                   )}
                </div>
                <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={18} />
                <div className="text-center md:hidden"><ChevronDown size={14} className="text-slate-300"/></div>

                <div className="flex-1 w-full flex flex-col items-center justify-center text-center bg-slate-50 py-5 px-2 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Initiate Checkouts (IC)
                   </span>
                   <span className="text-2xl font-black text-slate-950">{stats.ic}</span>
                   {useFunnelBreakdown && (
                      <span className="text-[10px] text-blue-500 font-bold mt-1">
                         {icRate}% of ATC
                      </span>
                   )}
                </div>
                <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={18} />
                <div className="text-center md:hidden"><ChevronDown size={14} className="text-slate-300"/></div>
                
                <div className="flex-1 w-full flex flex-col items-center justify-center text-center bg-emerald-50 py-5 px-2 rounded-2xl border border-emerald-100">
                   <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Purchases</span>
                   <span className="text-2xl font-black text-emerald-600">{stats.conversions}</span>
                   <span className="text-[10px] text-emerald-500 font-bold mt-1">
                      {effectiveConvRate.toFixed(2)}% Overall
                   </span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* FAQs Section (Hidden when printing) */}
      <section className="mt-32 space-y-24 print:hidden">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Stop guessing your CPA.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <MousePointer2 size={40} className="text-blue-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Reducing your CPC by just $0.20 or increasing your landing page conversion by 1% drastically lowers your Cost Per Acquisition. Most media buyers focus on the wrong metrics; the real profit is hidden in micro-optimizations of your conversion funnel.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Zap size={14} className="text-blue-600" /> Funnel Efficiency
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                          Visualise how small changes at the top of the funnel result in massive savings on your final CPA.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Info size={14} className="text-emerald-600" /> ROI Forecasting
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                          Use our estimates to set realistic benchmarks for your creative team and landing page designers.
                       </p>
                    </div>
                 </div>
                 <p>
                    Whether you are scaling to $10k/day or just starting with your first $500 testing budget, understanding the math of CPA is non-negotiable. This tool provides the foundational numbers needed to defend your marketing spend to any CFO.
                 </p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Media Buying FAQ</h2>
              <p className="text-slate-500 font-medium">Expert insights into Facebook Ads math and optimization strategy.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                   key={idx}
                   className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-blue-200/50 border-blue-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-blue-400" />
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

      {/* CTA Footer (Hidden when printing) */}
      <section className="mt-32 max-w-7xl mx-auto px-4 print:hidden">
        <div className="bg-blue-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Maximize Your <br/>Ad Returns.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of media buyers who use our calculators to optimize their performance and scale their spend.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-blue-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Analyze Your Funnel <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Modular SEO Content Component at bottom (Hidden when printing) */}
      <FbAdsSEOContent />
    </div>
  );
}
