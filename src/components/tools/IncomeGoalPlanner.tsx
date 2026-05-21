import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, BarChart3, ArrowRight, DollarSign, Briefcase, Smile, Rocket, Zap, Percent, Calendar, Users, Info, ShieldCheck, Download, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'sonner';

export default function IncomeGoalPlanner() {
  const { isPro, aiUsageCount, consumeCredit, showProModal } = useUser();
  const creditsRemaining = 5 - aiUsageCount;
  
  const [targetIncome, setTargetIncome] = useState(100000);
  const [expenses, setExpenses] = useState(25000);
  const [subcontractorCosts, setSubcontractorCosts] = useState(15000);
  const [taxRate, setTaxRate] = useState(25);
  const [workingWeeks, setWorkingWeeks] = useState(48);
  const [utilization, setUtilization] = useState(65);
  const [revenueMix, setRevenueMix] = useState(70);
  const [avgProjectFee, setAvgProjectFee] = useState(5000);
  const [avgMonthlyRetainer, setAvgMonthlyRetainer] = useState(3000);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(40);
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    // Total Revenue = (Take Home + Expenses + Subcontractors) / (1 - (Tax Rate / 100))
    const totalNeeded = (targetIncome + expenses + subcontractorCosts) / (1 - (taxRate / 100));
    const monthlyNeeded = totalNeeded / 12;
    const weeklyNeeded = totalNeeded / workingWeeks;
    
    // Utilization logic
    const billableHoursTotal = workingWeeks * billableHoursPerWeek * (utilization / 100);
    const hourlyRateNeeded = billableHoursTotal > 0 ? totalNeeded / billableHoursTotal : 0;
    
    const taxesAmt = totalNeeded - targetIncome - expenses - subcontractorCosts;

    const targetProjectRevenue = totalNeeded * (revenueMix / 100);
    const targetRetainerRevenue = totalNeeded * ((100 - revenueMix) / 100);

    const projectCountNeeded = avgProjectFee > 0 ? targetProjectRevenue / avgProjectFee : 0;
    const projectsPerMonth = projectCountNeeded / (workingWeeks / 4); // Adjusted to working weeks logic, roughly / 12

    const targetMRR = targetRetainerRevenue / 12;
    const activeClientsNeeded = avgMonthlyRetainer > 0 ? targetMRR / avgMonthlyRetainer : 0;

    return { 
      totalNeeded, 
      monthlyNeeded, 
      weeklyNeeded, 
      hourlyRateNeeded, 
      projectCountNeeded, 
      projectsPerMonth: projectCountNeeded / 12,
      activeClientsNeeded,
      targetMRR,
      taxesAmt,
      targetProjectRevenue,
      targetRetainerRevenue
    };
  }, [targetIncome, expenses, subcontractorCosts, taxRate, workingWeeks, utilization, revenueMix, avgProjectFee, avgMonthlyRetainer, billableHoursPerWeek]);

  const handleExport = async () => {
    if (!isPro) {
      if (creditsRemaining <= 0) {
        showProModal('Unlimited Goal Exports');
        return;
      }
      const success = await consumeCredit();
      if (!success) return;
      toast.success('1 Credit Used: Strategy Roadmap Exported');
    } else {
      toast.success('Strategy Roadmap Exported');
    }
    
    window.print();
  };

  const faqs = [
    { q: "Why is my calculated hourly rate so high?", a: "Because as an agency founder, your hourly rate pays for your non-billable time, taxes, software, and team management overhead, not just your coding time." },
    { q: "Should I charge hourly or a flat rate?", a: "Transition to value-based flat rates for large system implementations, and use your calculated hourly rate internally to ensure the project remains profitable." },
    { q: "What is 'Billable Utilization'?", a: "It is the percentage of your working hours directly billed to clients. A healthy target is 60-70%." },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6 print:hidden">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Goal Planner</h3>
                <p className="text-xs text-slate-400 font-medium">Reverse-engineer your six-figure agency year.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Target TAKE-HOME Income</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                      type="number" 
                      value={targetIncome || 0}
                      onChange={(e) => setTargetIncome(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-black transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Annual Expenses</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={expenses || 0}
                      onChange={(e) => setExpenses(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Subcontractor / Team Costs</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={subcontractorCosts || 0}
                      onChange={(e) => setSubcontractorCosts(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Est. Tax Rate (%)</label>
                  <div className="relative group">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={14} />
                    <input 
                      type="number" 
                      value={taxRate || 0}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Weeks to Work</label>
                      <span className="text-[10px] font-bold text-primary">{workingWeeks} WKS ({52 - workingWeeks} WKS REST)</span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="52"
                      value={workingWeeks || 48}
                      onChange={(e) => setWorkingWeeks(Number(e.target.value))}
                      className="w-full py-2 accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Billable Utilization (%)</label>
                        <div className="group relative">
                          <Info size={12} className="text-slate-300 cursor-help" />
                          <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900 text-[9px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-medium">
                            Accounts for unbilled time spent on admin, sales, and marketing.
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-primary">{utilization}% CAPACITY</span>
                    </div>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={utilization || 65}
                      onChange={(e) => setUtilization(Number(e.target.value))}
                      className="w-full py-2 accent-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                 <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue Mix</h4>
                      <span className="text-[10px] font-bold text-primary">{revenueMix}% Projects / {100 - revenueMix}% Retainer</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={revenueMix}
                      onChange={(e) => setRevenueMix(Number(e.target.value))}
                      className="w-full py-2 accent-primary cursor-pointer"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 px-1">Avg. Project Fee</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                          type="number" 
                          value={avgProjectFee || 0}
                          onChange={(e) => setAvgProjectFee(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 px-1">Avg. Mo. Retainer</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                          type="number" 
                          value={avgMonthlyRetainer || 0}
                          onChange={(e) => setAvgMonthlyRetainer(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 px-1">Billable Hrs/Wk</label>
                      <input 
                        type="number" 
                        value={billableHoursPerWeek || 0}
                        onChange={(e) => setBillableHoursPerWeek(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-bold"
                      />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#0f4c75] p-6 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <TrendingUp size={48} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Gross Revenue Needed</p>
                <p className="text-2xl sm:text-3xl font-black tabular-nums">${Math.round(stats.totalNeeded).toLocaleString()}</p>
                <p className="text-[9px] font-bold opacity-40 mt-1 italic">Pre-tax & expenses</p>
             </div>
             <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <BarChart3 size={48} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Target MRR</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl sm:text-3xl font-black tabular-nums">${Math.round(stats.targetMRR).toLocaleString()}</p>
                  <span className="text-[10px] font-bold text-slate-500">/mo</span>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div ref={roadmapRef} className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
             
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-12 flex items-center gap-2">
                <Rocket size={16} className="text-primary" /> Your Roadmap
             </h4>

             <div className="space-y-10">
                <div className="flex items-center gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors border border-slate-100 italic font-black text-xl">
                      H
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Hourly Rate</p>
                      <p className="text-2xl font-black text-slate-900 tabular-nums">${Math.round(stats.hourlyRateNeeded)}/hr</p>
                      
                      {/* Financial Waterfall Visual */}
                      <div className="mt-4 space-y-2">
                        <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-slate-100">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-1000" 
                            style={{ width: `${(targetIncome / stats.totalNeeded) * 100}%` }}
                          />
                          <div 
                            className="h-full bg-red-400 transition-all duration-1000" 
                            style={{ width: `${(expenses / stats.totalNeeded) * 100}%` }}
                          />
                          <div 
                            className="h-full bg-purple-400 transition-all duration-1000" 
                            style={{ width: `${(subcontractorCosts / stats.totalNeeded) * 100}%` }}
                          />
                          <div 
                            className="h-full bg-amber-400 transition-all duration-1000" 
                            style={{ width: `${(stats.taxesAmt / stats.totalNeeded) * 100}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Profit</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Tools</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Team</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Taxes</span>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors border border-slate-100 italic font-black text-xl">
                      P
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Total Projects / Year
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black text-slate-900 tabular-nums">
                          {Math.ceil(stats.projectCountNeeded)}
                        </p>
                        <span className="text-xs font-bold text-slate-400">
                          @ ${(avgProjectFee || 0).toLocaleString()}
                        </span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors border border-slate-100 italic font-black text-xl">
                      C
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Active Retainer Clients
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black text-slate-900 tabular-nums">
                          {stats.activeClientsNeeded.toFixed(1)}
                        </p>
                        <span className="text-xs font-bold text-slate-400">
                          @ ${(avgMonthlyRetainer || 0).toLocaleString()}/mo
                        </span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6 group px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
                      <Zap size={20} className="fill-current" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Acquisition Velocity
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        Close <span className="text-primary underline decoration-primary/20 underline-offset-4">{stats.projectsPerMonth.toFixed(1)}</span> projects/month and<br />maintain <span className="text-primary underline decoration-primary/20 underline-offset-4">{Math.ceil(stats.activeClientsNeeded)}</span> clients/month.
                      </p>
                   </div>
                </div>
             </div>

             <div className="mt-12 pt-12 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Smile className="text-success" size={20} />
                   <span className="text-xs font-bold text-slate-600">Freedom & Profit</span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  {workingWeeks === 52 ? 'Warning: No vacations set' : `${52 - workingWeeks} weeks for rest`}
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
            <button 
              onClick={handleExport}
              className="bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between group cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-primary group-hover:border-primary transition-all">
                     <Download size={20} />
                  </div>
                  <div className="text-left">
                    <h5 className="font-bold text-sm">Export Strategic Roadmap {!isPro && <span className="ml-1">⚡</span>}</h5>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Professional PDF</p>
                  </div>
               </div>
               <ArrowRight className="text-slate-700 group-hover:text-white transition-colors" size={20} />
            </button>

            <Link 
              to="/tools/freelance-tax-estimator"
              className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between group cursor-pointer transition-all hover:border-primary"
            >
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-all text-slate-400">
                     <Users size={20} />
                  </div>
                  <div className="text-left">
                    <h5 className="font-bold text-sm text-slate-900">Estimate Taxes</h5>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Deep Dive</p>
                  </div>
               </div>
               <ArrowRight className="text-slate-300 group-hover:text-primary transition-colors" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Landing Page Methodology Grid */}
      <div className="pt-20 pb-10 print:hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-4">How to Price for Freedom</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">Strategic capacity planning is the difference between profit and burnout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={24} />
                The 50% Rule
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Only 50-60% of your time is actually billable. The rest is sales, admin, and project management. Price accordingly.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={24} />
                Subcontractor Margins
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Never pass developer or designer costs directly to the client. Always mark up team labor by at least 30% to cover management overhead.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <ShieldCheck className="text-blue-400" size={24} />
              Common Agency Deductions
            </h3>
            <ul className="space-y-4">
              {[
                'SaaS Subscriptions & Design Tools',
                'Server & Cloud Hosting Costs',
                'Legal & CPA Retainers',
                'Marketing & Advertising Spend'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="pt-10 pb-20 print:hidden">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Rate Strategy FAQ</h2>
          <div className="border-t border-slate-200 divide-y divide-slate-200">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full text-left flex items-center justify-between focus:outline-none group"
                >
                  <span className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors py-2">{faq.q}</span>
                  <ChevronDown className={`text-slate-400 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} size={20} />
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 text-slate-600 leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
