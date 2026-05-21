import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  Calculator, Download, Copy, RefreshCw, History, FileText, 
  Check, Target, Globe, Info, Lock, ArrowRight, Share2, 
  ShieldCheck, Zap, TrendingUp, AlertCircle, Sparkles, Search,
  Plus, X
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import { RateCalculatorPDF } from './RateCalculatorPDF';
import { historyService, HistoryItem } from '../../lib/history-service';

const PREDEFINED_INDUSTRIES = [
  "Web Development", "Mobile App Development", "Software Development", 
  "DevOps & System Administration", "QA Testing", "Data Analysis", 
  "Graphic Design", "UI/UX Design", "Video Editing", "Animation/Motion Graphics", 
  "Illustration", "Photography/Videography", "3D Modeling & CAD", 
  "Content Writing", "Copywriting", "Technical Writing", "Translation", 
  "Digital Marketing", "SEO Specialist", "Social Media Management", 
  "Advertising (PPC)", "Public Relations", "Virtual Assistance", 
  "Data Entry", "Project Management", "Business Consulting", 
  "Accounting/Bookkeeping", "Customer Support", "Legal Services"
];

const DEFAULT_NICHE_SKILLS = [
  { name: 'AI/ML Implementation', premium: 20, category: 'Tech' },
  { name: 'Cloud Infrastructure', premium: 15, category: 'Tech' },
  { name: 'Cybersecurity', premium: 25, category: 'Tech' },
  { name: 'Smart Contracts', premium: 30, category: 'Tech' },
  { name: 'Growth Hacking', premium: 15, category: 'Marketing' },
  { name: 'Conversion Design', premium: 12, category: 'Design' },
  { name: 'Fractional CTO', premium: 35, category: 'Strategy' },
  { name: 'Market Positioning', premium: 10, category: 'Strategy' },
  { name: 'System Architecture', premium: 20, category: 'Tech' },
  { name: 'Data Visualization', premium: 15, category: 'Tech' },
  { name: 'Brand Strategy', premium: 18, category: 'Strategy' },
  { name: 'Performance Marketing', premium: 12, category: 'Marketing' }
];

export default function RateCalculator() {
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  const industryWrapperRef = useRef<HTMLDivElement>(null);

  const [income, setIncome] = useState<number | string>(80000);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'SAR'>('USD');
  const [unbillablePercent, setUnbillablePercent] = useState<number | string>(20);
  const [weeksOff, setWeeksOff] = useState<number | string>(4);
  const [hoursPerDay, setHoursPerDay] = useState<number | string>(6);
  const [expenses, setExpenses] = useState<number | string>(500);
  const [taxRate, setTaxRate] = useState<number | string>(25);
  const [profitBuffer, setProfitBuffer] = useState<number | string>(15);
  
  // Market Variables
  const [industry, setIndustry] = useState('Web Development');
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [industrySearchTerm, setIndustrySearchTerm] = useState('Web Development');
  
  const [experienceLevel, setExperienceLevel] = useState<string>('Senior / Specialized');
  const [workload, setWorkload] = useState(60);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<{ name: string, premium: number }[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillPremium, setNewSkillPremium] = useState(10);

  const [showHistory, setShowHistory] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const EXPERIENCE_MULTIPLIERS: Record<string, number> = { 
    'Junior / Standard': 1.0, 
    'Mid-Level / High Demand': 1.5, 
    'Senior / Specialized': 2.0, 
    'Industry Expert / Niche': 3.0 
  };
  
  const ALL_NICHE_SKILLS = useMemo(() => [
    ...DEFAULT_NICHE_SKILLS,
    ...customSkills.map(s => ({ ...s, category: 'Custom' }))
  ], [customSkills]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (industryWrapperRef.current && !industryWrapperRef.current.contains(event.target as Node)) {
        setIsIndustryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredIndustries = useMemo(() => {
    const term = industrySearchTerm.toLowerCase();
    return PREDEFINED_INDUSTRIES.filter(ind => ind.toLowerCase().includes(term));
  }, [industrySearchTerm]);

  const exactMatch = PREDEFINED_INDUSTRIES.some(ind => ind.toLowerCase() === industrySearchTerm.toLowerCase());

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    SAR: '﷼'
  };

  const results = useMemo(() => {
    // Validation: Prevent division by zero or negative logic
    const safeIncome = Math.max(0, Number(income));
    const safeTaxRate = Math.min(99, Math.max(0, Number(taxRate)));
    const safeWeeksOff = Math.min(51, Math.max(0, Number(weeksOff)));
    const safeHoursPerDay = Math.min(24, Math.max(1, Number(hoursPerDay)));
    const safeExpenses = Math.max(0, Number(expenses));
    const safeUnbillable = Math.min(90, Math.max(0, Number(unbillablePercent)));

    const totalExpenses = safeExpenses * 12;
    const preTaxTarget = safeIncome / (1 - safeTaxRate/100);
    const taxAmount = preTaxTarget - safeIncome;
    const totalRequired = preTaxTarget + totalExpenses;
    const bufferAmount = totalRequired * (Number(profitBuffer)/100);
    const cushionedRequired = totalRequired + bufferAmount;
    
    const workingWeeks = 52 - safeWeeksOff;
    const billableHoursPerDay = safeHoursPerDay * (1 - safeUnbillable/100);
    const totalHours = Math.max(1, workingWeeks * 5 * billableHoursPerDay);
    
    const hourlyRaw = cushionedRequired / totalHours;
    const dailyRaw = hourlyRaw * 8; 

    // Market Adjustments
    const expMultiplier = EXPERIENCE_MULTIPLIERS[experienceLevel];
    const skillPremiumSum = activeSkills.reduce((sum, skillName) => {
      const skill = ALL_NICHE_SKILLS.find(s => s.name === skillName);
      return sum + (skill ? skill.premium : 0);
    }, 0);
    
    const scarcityPremium = workload > 80 ? 0.15 : 0; // 15% bump if workload is high
    
    const baseMarketRate = hourlyRaw * expMultiplier;
    const skillsAdjustment = hourlyRaw * (skillPremiumSum / 100);
    const scarcityAdjustment = baseMarketRate * scarcityPremium;
    
    const marketHourlyRate = Math.ceil(baseMarketRate + skillsAdjustment + scarcityAdjustment);
    const marketDailyRate = marketHourlyRate * 8;
    
    return {
      totalRequired: cushionedRequired,
      taxAmount,
      bufferAmount,
      totalExpenses,
      takeHome: safeIncome,
      totalHours,
      floorHourlyRate: Math.ceil(hourlyRaw),
      marketHourlyRate,
      marketDailyRate,
      monthlyTarget: Math.ceil((marketHourlyRate * totalHours) / 12),
      impact: {
        experience: Math.ceil(baseMarketRate - hourlyRaw),
        skills: Math.ceil(skillsAdjustment),
        scarcity: Math.ceil(scarcityAdjustment)
      }
    };
  }, [income, weeksOff, hoursPerDay, unbillablePercent, expenses, taxRate, profitBuffer, experienceLevel, activeSkills, workload, ALL_NICHE_SKILLS]);

  const symbol = currencySymbols[currency];

  const handleCopy = () => {
    setIsCopying(true);
    const summary = `My Market-Adjusted Target Rate is ${symbol}${results.marketHourlyRate}/hr, generated via FreelancerKit Pro.`;
    navigator.clipboard.writeText(summary);
    toast.success('Audit summary copied to clipboard!');
    setTimeout(() => setIsCopying(false), 2000);
  };

  const toggleSkill = (skillName: string) => {
    setActiveSkills(prev => 
      prev.includes(skillName) 
        ? prev.filter(s => s !== skillName) 
        : [...prev, skillName]
    );
  };

  const selectIndustry = (val: string) => {
    setIndustry(val);
    setIndustrySearchTerm(val);
    setIsIndustryDropdownOpen(false);
  };

  const addCustomSkill = () => {
    if (newSkillName.trim() && !ALL_NICHE_SKILLS.some(s => s.name === newSkillName)) {
      setCustomSkills([...customSkills, { name: newSkillName, premium: newSkillPremium }]);
      setActiveSkills([...activeSkills, newSkillName]);
      setNewSkillName('');
      setNewSkillPremium(10);
    }
  };

  const saveToHistory = () => {
    historyService.addToHistory({
      toolId: 'rate-calculator',
      toolName: 'Rate Calculation',
      summary: `Market: ${symbol}${results.marketHourlyRate}/hr (Floor: ${results.floorHourlyRate})`,
      data: { 
        income: Number(income), 
        currency, 
        unbillablePercent: Number(unbillablePercent), 
        weeksOff: Number(weeksOff), 
        hoursPerDay: Number(hoursPerDay), 
        expenses: Number(expenses), 
        taxRate: Number(taxRate), 
        profitBuffer: Number(profitBuffer),
        industry,
        experienceLevel,
        activeSkills,
        workload,
        customSkills
      }
    });
  };

  const loadFromHistory = (item: HistoryItem) => {
    const { income, currency: savedCurrency, unbillablePercent: savedUnbillable, weeksOff, hoursPerDay, expenses, taxRate, profitBuffer, industry: savedIndustry, experienceLevel: savedExp, activeSkills: savedSkills, workload: savedWorkload, customSkills: savedCustomSkills } = item.data;
    setIncome(income);
    setCurrency(savedCurrency || 'USD');
    setUnbillablePercent(savedUnbillable || 20);
    setWeeksOff(weeksOff);
    setHoursPerDay(hoursPerDay);
    setExpenses(expenses);
    setTaxRate(taxRate);
    setProfitBuffer(profitBuffer);
    if(savedIndustry) {
      setIndustry(savedIndustry);
      setIndustrySearchTerm(savedIndustry);
    }
    if(savedExp) setExperienceLevel(savedExp);
    if(savedSkills) setActiveSkills(savedSkills);
    if(savedWorkload) setWorkload(savedWorkload);
    if(savedCustomSkills) setCustomSkills(savedCustomSkills);
    setShowHistory(false);
  };

  const history = useMemo(() => historyService.getHistory().filter(i => i.toolId === 'rate-calculator'), [showHistory]);

  const startPipeline = () => {
    const params = new URLSearchParams({
      rate: results.marketHourlyRate.toString(),
      currency,
      income: income.toString()
    }).toString();
    navigate(`/tools/invoice-generator?${params}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Subtle Utility Header */}
      <div className="flex justify-end gap-3 mb-8">
        <button 
          onClick={handleCopy}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          {isCopying ? <Check size={14} className="text-success" /> : <Share2 size={14} />}
          {isCopying ? 'Copied' : 'Share Audit'}
        </button>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <History size={14} /> History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-start">
        {/* 2. THE INPUT ENGINE */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 shadow-inner"
              >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Previous Simulations</h4>
                    <button onClick={() => setShowHistory(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Close</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {history.length > 0 ? history.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="text-left p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary transition-all group flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.summary}</p>
                          <p className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                        <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    )) : (
                      <div className="col-span-2 py-8 text-center text-slate-400 text-sm">No recent simulations found.</div>
                    )}
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* lifestyle Bucket */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Target size={80} />
            </div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
               <div className="p-2.5 bg-primary/10 text-primary rounded-xl shadow-inner shadow-primary/5">
                  <Target size={20} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">1. Lifestyle Requirements</h3>
            </div>

            <div className="space-y-8 relative z-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Desired Annual Income (Post-Tax)</label>
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as any)}
                        className="text-[10px] font-black bg-slate-50 border border-slate-100 rounded-md px-2 py-1 outline-none text-slate-500 cursor-pointer"
                      >
                        {Object.keys(currencySymbols).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-black text-xl">{symbol}</span>
                      <input 
                        type="number" 
                        value={income}
                        onChange={(e) => {
                          const val = e.target.value;
                          setIncome(val === "" ? "" : Number(val));
                        }}
                        className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-mono text-2xl font-black text-slate-900"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                      <div className="flex items-center justify-between mb-3 px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vacation / Sick Leave (Weeks)</label>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          max="51"
                          placeholder="0"
                          value={weeksOff}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWeeksOff(val === "" ? "" : Number(val));
                          }}
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary font-mono text-2xl font-black text-slate-900"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs uppercase tracking-widest">Weeks</span>
                      </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Operations Bucket */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8 relative z-10">
               <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Zap size={20} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">2. Operational Intensity</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Daily Billable Hours</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.5"
                      max="24"
                      placeholder="0"
                      value={hoursPerDay}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHoursPerDay(val === "" ? "" : Number(val));
                      }}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-mono text-2xl font-black text-slate-900"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs uppercase tracking-widest">Hrs / Day</span>
                  </div>
               </div>
               <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Overhead (%)</label>
                  </div>
                  <div className="pt-2">
                    <input 
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={unbillablePercent || 0}
                      onChange={(e) => setUnbillablePercent(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span>Deep Work</span>
                       <span className="text-indigo-600">{unbillablePercent}% Lost</span>
                    </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Market Positioning Bucket */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8 relative z-10">
               <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                  <Globe size={20} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">3. Market Positioning</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10 mb-8">
               <div className="relative" ref={industryWrapperRef}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Industry Sector</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={industrySearchTerm}
                      onFocus={() => setIsIndustryDropdownOpen(true)}
                      onChange={(e) => {
                        setIndustrySearchTerm(e.target.value);
                        setIsIndustryDropdownOpen(true);
                        setIndustry(e.target.value); // Update industry as they type if it's custom
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && industrySearchTerm) {
                          selectIndustry(industrySearchTerm);
                        }
                      }}
                      placeholder="Search or enter industry..."
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-sky-500 font-bold text-slate-900 pr-12 transition-all"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                      <Search size={18} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isIndustryDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-slate-200 shadow-2xl max-h-60 overflow-y-auto rounded-2xl p-2"
                      >
                        {filteredIndustries.map((ind) => (
                          <button 
                            key={ind}
                            onClick={() => selectIndustry(ind)}
                            className="w-full text-left px-4 py-3 hover:bg-sky-50 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                          >
                            {ind}
                          </button>
                        ))}
                        {industrySearchTerm && !exactMatch && (
                          <button 
                            onClick={() => selectIndustry(industrySearchTerm)}
                            className="w-full text-left px-4 py-3 bg-sky-50/50 hover:bg-sky-100 rounded-xl text-sm font-bold text-sky-600 transition-colors border border-dashed border-sky-200 mt-1"
                          >
                            Use custom: "{industrySearchTerm}"
                          </button>
                        )}
                        {filteredIndustries.length === 0 && !industrySearchTerm && (
                          <div className="px-4 py-3 text-sm text-slate-400 italic">Start typing to see industries...</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Experience Level & Demand</label>
                  <select 
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-sky-500 font-bold text-slate-900 appearance-none cursor-pointer"
                  >
                    {Object.keys(EXPERIENCE_MULTIPLIERS).map(level => (
                      <option key={level} value={level}>{level} ({EXPERIENCE_MULTIPLIERS[level]}x)</option>
                    ))}
                  </select>
               </div>
            </div>

            <div>
               <div className="flex items-center justify-between mb-3 px-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Workload / Scarcity (%)</label>
                 <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${workload > 80 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    {workload > 80 ? 'Premium Applied' : 'Normal Capacity'}
                 </span>
               </div>
               <div className="pt-2">
                 <input 
                   type="range"
                   min="0"
                   max="100"
                   step="10"
                   value={workload}
                   onChange={(e) => setWorkload(Number(e.target.value))}
                   className="w-full accent-sky-600 cursor-pointer"
                 />
                 <div className="flex justify-between mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Available</span>
                    <span className="text-sky-600">{workload}% Booked</span>
                 </div>
               </div>
            </div>
          </section>

          {/* Niche Skill Premium Bucket */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8 relative z-10">
               <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Sparkles size={20} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">4. Niche Skill Premiums</h3>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10 mb-8">
               {ALL_NICHE_SKILLS.map((skill) => (
                 <button 
                  key={skill.name}
                  onClick={() => toggleSkill(skill.name)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all rounded-full flex items-center gap-2 group/skill ${
                    activeSkills.includes(skill.name) 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-amber-200 hover:bg-amber-50/50'
                  }`}
                 >
                   {skill.name} <span className={activeSkills.includes(skill.name) ? 'text-white' : 'text-amber-500'}>+{skill.premium}%</span>
                   {skill.category === 'Custom' && (
                     <X 
                        size={12} 
                        className="ml-1 opacity-50 hover:opacity-100 transition-opacity" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomSkills(customSkills.filter(s => s.name !== skill.name));
                          setActiveSkills(activeSkills.filter(s => s !== skill.name));
                        }}
                     />
                   )}
                 </button>
               ))}
            </div>

            <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-end">
               <div className="flex-1 w-full">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Add Your Own Premium Niche</label>
                  <input 
                    type="text"
                    placeholder="e.g. LLM Fine Tuning"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-bold text-sm"
                  />
               </div>
               <div className="w-full md:w-32">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Premium %</label>
                  <input 
                    type="number"
                    value={newSkillPremium}
                    onChange={(e) => setNewSkillPremium(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-bold text-sm text-center"
                  />
               </div>
               <button 
                 onClick={addCustomSkill}
                 className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 min-w-max"
               >
                 <Plus size={14} /> Add Skill
               </button>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <TrendingUp size={20} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">5. Fixed Overhead</h3>
            </div>

            <div className="space-y-8">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Monthly Business Expenses</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-black text-xl">{symbol}</span>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={expenses}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExpenses(val === "" ? "" : Number(val));
                      }}
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 font-mono text-2xl font-black text-slate-900"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Tax Rate (%)</label>
                     <input 
                       type="number" 
                       placeholder="0"
                       value={taxRate}
                       onChange={(e) => {
                         const val = e.target.value;
                         setTaxRate(val === "" ? "" : Number(val));
                       }}
                       className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 font-mono text-2xl font-black text-slate-900 text-center"
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Profit/Risk Buffer (%)</label>
                     <input 
                       type="number" 
                       placeholder="0"
                       value={profitBuffer}
                       onChange={(e) => {
                         const val = e.target.value;
                         setProfitBuffer(val === "" ? "" : Number(val));
                       }}
                       className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 font-mono text-2xl font-black text-slate-900 text-center"
                     />
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* 3. THE OUTPUT & VISUALIZATION */}
        <div className="lg:col-span-5 lg:sticky lg:top-12 space-y-8">
          <div className="bg-[#0B1120] text-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] -mr-40 -mt-40 rounded-full group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[120px] -ml-40 -mb-40 rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                    <Target size={24} className="text-primary" /> Adjusted Yield
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Market Benchmark Engine</p>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                   <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 block text-start">Market-Adjusted Target Rate</label>
                   <div className="flex items-baseline gap-3 text-start">
                      <span className="text-8xl font-black font-display tracking-tighter tabular-nums text-white">
                        {symbol}{results.marketHourlyRate.toLocaleString()}
                      </span>
                      <span className="text-2xl font-black text-slate-500 uppercase tracking-tighter italic">/ hr</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-start">
                   <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Absolute Minimum (Floor)</p>
                      <p className="text-3xl font-black text-slate-400 font-display tabular-nums tracking-tighter">
                        {symbol}{results.floorHourlyRate.toLocaleString()}
                      </p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Daily Market Benchmark</p>
                      <p className="text-3xl font-black text-primary font-display tabular-nums tracking-tighter">
                        {symbol}{results.marketDailyRate.toLocaleString()}
                      </p>
                   </div>
                </div>

                {/* Impact Breakdown */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-start space-y-4">
                   <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 border-b border-white/10 pb-4">Rate Impact Breakdown</h4>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-400">Experience Premium ({experienceLevel})</span>
                      <span className="text-xs font-black text-emerald-400">+{symbol}{results.impact.experience}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-400">Niche Technical Skills</span>
                      <span className="text-xs font-black text-emerald-400">+{symbol}{results.impact.skills}</span>
                   </div>
                   {results.impact.scarcity > 0 && (
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-400">Scarcity/Capacity Premium</span>
                        <span className="text-xs font-black text-emerald-400">+{symbol}{results.impact.scarcity}</span>
                     </div>
                   )}
                </div>

                {/* 4. THE ECOSYSTEM & CTAs */}
                <div className="pt-8 border-t border-white/5 space-y-4">
                  <PDFDownloadLink
                    document={
                      <RateCalculatorPDF 
                        income={Number(income)}
                        symbol={symbol}
                        results={{
                          ...results,
                          hourlyRate: results.marketHourlyRate,
                          dailyRate: results.marketDailyRate
                        } as any}
                        weeksOff={Number(weeksOff)}
                        hoursPerDay={Number(hoursPerDay)}
                        unbillablePercent={Number(unbillablePercent)}
                        expenses={Number(expenses)}
                        taxRate={Number(taxRate)}
                        profitBuffer={Number(profitBuffer)}
                      />
                    }
                    fileName={`Market_Rate_Audit_${Date.now()}.pdf`}
                    className="w-full"
                    onClick={saveToHistory}
                  >
                    {({ loading }) => (
                      <button 
                        disabled={loading}
                        className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                      >
                         {loading ? <RefreshCw className="animate-spin text-primary" size={16} /> : <Download size={18} />}
                         {loading ? 'Finalizing Document...' : 'Export High-Fidelity Audit PDF'}
                      </button>
                    )}
                  </PDFDownloadLink>

                  <button 
                    onClick={startPipeline}
                    className="w-full py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/40 group"
                  >
                    Initialize Billable Pipeline <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-[2.5rem] flex items-start gap-4 text-start">
             <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm border border-amber-100 shrink-0">
                <AlertCircle size={24} />
             </div>
             <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1 tracking-tight">The Self-Employment Reality</h4>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "If your hourly rate doesn't include the cost of your equipment, health insurance, and retirement, you aren't a business—you're an employee who pays for their own office."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

