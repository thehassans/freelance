import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, DollarSign, PieChart, ShieldCheck, Info, Briefcase, 
  MinusCircle, PlusCircle, Landmark, ExternalLink, ArrowRight, 
  AlertTriangle, ChevronDown, ChevronUp, CheckCircle, TrendingUp,
  CreditCard, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Deduction {
  id: string;
  category: string;
  amount: number;
}

const DEDUCTION_CATEGORIES = [
  'Home Office',
  'Software/Tools',
  'Marketing',
  'Legal/Professional',
  'Travel',
  'Internet/Phone',
  'Other'
];

import { useSystemConfigs } from '../../contexts/SystemConfigContext';

export default function TaxEstimator() {
  const { config, loading } = useSystemConfigs();
  const [income, setIncome] = useState(80000);
  const [retirementContributions, setRetirementContributions] = useState(0);
  const [stateTaxRate, setStateTaxRate] = useState(5);
  const [region, setRegion] = useState<'US' | 'UK' | 'Generic'>('US');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: '1', category: 'Home Office', amount: 1500 },
    { id: '2', category: 'Software/Tools', amount: 800 },
  ]);

  const addDeduction = () => {
    setDeductions([...deductions, { id: Date.now().toString(), category: 'Other', amount: 0 }]);
  };

  const updateDeduction = (id: string, field: keyof Deduction, value: string | number) => {
    setDeductions(deductions.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const totalDeductions = useMemo(() => deductions.reduce((sum, d) => sum + d.amount, 0), [deductions]);
  const taxableRevenue = Math.max(0, income - totalDeductions);
  const taxableIncomeAfterRetirement = Math.max(0, taxableRevenue - retirementContributions);

  // Simplified tax logic for estimation
  const estimation = useMemo(() => {
    let taxAmount = 0;
    let selfEmploymentTax = 0;

    const incomeForCalculation = taxableIncomeAfterRetirement;
    
    // Fallbacks just in case loading hasn't finished
    const usRate = config?.taxBaselinePercentages?.US || 15.3;
    const ukRate = config?.taxBaselinePercentages?.UK || 6.0;
    const genericRate = config?.taxBaselinePercentages?.Generic || 25.0;

    if (region === 'US') {
      // Simplified US Federal Brackets 2024 (Single)
      if (incomeForCalculation > 191950) taxAmount = (incomeForCalculation - 191950) * 0.32 + 37105;
      else if (incomeForCalculation > 100525) taxAmount = (incomeForCalculation - 100525) * 0.24 + 16290;
      else if (incomeForCalculation > 47150) taxAmount = (incomeForCalculation - 47150) * 0.22 + 5147;
      else if (incomeForCalculation > 11600) taxAmount = (incomeForCalculation - 11600) * 0.12 + 1160;
      else taxAmount = incomeForCalculation * 0.10;

      // Self-employment tax computation using baseline from config
      selfEmploymentTax = taxableRevenue * 0.9235 * (usRate / 100);
    } else if (region === 'UK') {
       // Simplified UK Income Tax 24/25
       const personalAllowance = 12570;
       const remaining = Math.max(0, incomeForCalculation - personalAllowance);
       
       if (remaining > 125140) taxAmount = (remaining - 125140) * 0.45 + (125140 - 37700) * 0.40 + 37700 * 0.20;
       else if (remaining > 37700) taxAmount = (remaining - 37700) * 0.40 + 37700 * 0.20;
       else taxAmount = remaining * 0.20;

       // Simplified NI Class 4 using baseline from config
       if (taxableRevenue > 12570) selfEmploymentTax = (taxableRevenue - 12570) * (ukRate / 100);
    } else {
      // Generic flat estimate using baseline from config
      taxAmount = incomeForCalculation * (genericRate / 100);
      selfEmploymentTax = taxableRevenue * 0.05;
    }

    const stateTaxAmount = taxableRevenue * (stateTaxRate / 100);
    const totalTax = taxAmount + selfEmploymentTax + stateTaxAmount;
    const netIncome = income - totalTax - retirementContributions; // Retirement is out of pocket but stay with us as an asset
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
    const quarterlyPayment = totalTax / 4;

    return { 
      taxAmount: Number(taxAmount.toFixed(2)), 
      selfEmploymentTax: Number(selfEmploymentTax.toFixed(2)), 
      stateTaxAmount: Number(stateTaxAmount.toFixed(2)),
      totalTax: Number(totalTax.toFixed(2)), 
      netIncome: Number(netIncome.toFixed(2)), 
      effectiveRate: Number(effectiveRate.toFixed(1)),
      quarterlyPayment: Number(quarterlyPayment.toFixed(2))
    };
  }, [taxableRevenue, taxableIncomeAfterRetirement, income, region, stateTaxRate, retirementContributions]);

  return (
    <div className="space-y-24">
      {/* 1. Main Calculator Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Calculator size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Tax Estimator</h3>
                <p className="text-xs text-slate-400">Estimate your self-employment tax burden.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Gross Income</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="number" 
                      value={income || 0}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Retirement Contributions ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="number" 
                      value={retirementContributions || 0}
                      onChange={(e) => setRetirementContributions(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">State/Local Tax Buffer (%)</label>
                  <div className="relative">
                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="number" 
                      value={stateTaxRate || 0}
                      onChange={(e) => setStateTaxRate(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Residency/Tax Rules</label>
                  <div className="relative">
                    <select 
                      value={region || 'US'}
                      onChange={(e) => setRegion(e.target.value as any)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-bold appearance-none cursor-pointer"
                    >
                      <option value="US">🇺🇸 United States</option>
                      <option value="UK">🇬🇧 United Kingdom</option>
                      <option value="Generic">🌐 Global / Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Landmark size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {region === 'US' && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 font-medium leading-relaxed uppercase tracking-wider">
                    Note: Calculates Federal Tax and Self-Employment Tax only. State/Local taxes not included.
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Deductible Expenses</label>
                  <button 
                    onClick={addDeduction}
                    className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-80 px-2 py-1 bg-primary/5 rounded-lg transition-all"
                  >
                    <PlusCircle size={12} /> Add Category
                  </button>
                </div>
                
                <div className="space-y-3">
                  {deductions.map((d) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={d.id} 
                      className="flex gap-2"
                    >
                      <div className="relative flex-grow">
                        <select
                          value={d.category || 'Other'}
                          onChange={(e) => updateDeduction(d.id, 'category', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold appearance-none cursor-pointer focus:border-primary focus:outline-none"
                        >
                          {DEDUCTION_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="relative w-36">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                          type="number" 
                          value={d.amount || 0}
                          onChange={(e) => updateDeduction(d.id, 'amount', Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-right font-mono font-bold focus:border-primary focus:outline-none"
                          placeholder="0.00"
                        />
                      </div>
                      <button 
                        onClick={() => removeDeduction(d.id)}
                        className="p-3 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                      >
                        <MinusCircle size={18} />
                      </button>
                    </motion.div>
                  ))}
                  {deductions.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
                      No deductions listed
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-start gap-4">
                  <Info size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                     <h4 className="text-xs font-bold text-slate-900 mb-1">Tax Disclaimer</h4>
                     <p className="text-[10px] text-slate-500 leading-relaxed italic">
                       This is an estimate for planning purposes only. It is not professional tax advice. Rules, brackets, and allowances vary significantly based on individual circumstances and local laws. Always consult a qualified tax professional.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-10 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                   <PieChart size={14} className="text-primary" /> Tax Liability Breakdown
                </h4>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#0f4c75] bg-[#0f4c75]/20 px-2 py-1 rounded-md">Pro Estimation</span>
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8 pb-10 border-b border-slate-800">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Effective Rate</p>
                     <p className="text-4xl font-black font-display">{estimation.effectiveRate}%</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Quartely Payment</p>
                     <p className="text-4xl font-black font-mono text-primary">${estimation.quarterlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                   </div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 font-medium">Gross Income</span>
                     <span className="font-mono font-bold">${income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 font-medium">Total Deductions</span>
                     <span className="font-mono font-bold text-danger">-${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-5 border-t border-slate-800">
                     <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Taxable Revenue</span>
                     <span className="font-mono font-bold text-lg">${taxableRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                     {retirementContributions > 0 && (
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 italic">Retirement Contribution (Pre-Tax)</span>
                          <span className="font-mono text-success">-${retirementContributions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                       </div>
                     )}
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 italic">Estimated Federal/Income Tax</span>
                        <span className="font-mono text-slate-300">${estimation.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 italic">Estimated Social Security / NI</span>
                        <span className="font-mono text-slate-300">${estimation.selfEmploymentTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     {stateTaxRate > 0 && (
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 italic">State/Local Buffer ({stateTaxRate}%)</span>
                          <span className="font-mono text-slate-300">${estimation.stateTaxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                       </div>
                     )}
                  </div>

                  <div className="pt-10">
                     <div className="flex justify-between items-end mb-6">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-1">TOTAL TAX LIABILITY</span>
                          <span className="text-4xl font-black text-warning font-mono">${estimation.totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-1">NET PROFIT (EST.)</span>
                          <span className="text-2xl font-black text-success font-mono">${estimation.netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                     </div>
                     
                     <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden mb-12">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(100, estimation.effectiveRate)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute h-full bg-warning shadow-[0_0_15px_rgba(255,193,7,0.3)]" 
                        />
                     </div>

                     <Link 
                      to="/tools/business-expense-tool"
                      className="w-full py-5 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                     >
                       Start Tracking Expenses <ArrowRight size={18} />
                     </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={120} />
             </div>
             <div className="relative z-10 flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center shrink-0">
                   <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Automated Tax Resilience</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    Avoid financial surprises by maintaining a digital trail of receipts and making regular quarterly contributions. This tool helps you define how much to set aside before you spend it.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Methodology & FAQ Section - Outside the Main Grid to prevent sticky overlap */}
      <div className="max-w-7xl mx-auto pt-12 border-t border-slate-100 w-full text-start px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">How to Manage Your Tax Burden</h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
                Strategic tax planning is the difference between keeping your profits and facing a devastating year-end bill.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">The 30% Rule</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      The moment an invoice is paid, instantly route 25-30% of it into a high-yield, untouchable savings account dedicated strictly to the government.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Quarterly Compliance</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Don't wait until April. Filing estimated quarterly taxes prevents massive year-end bills and protects you from aggressive underpayment penalties and audit triggers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden h-full"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                <BookOpen size={24} className="text-primary" /> Common Freelance Deductions
              </h3>
              
              <div className="space-y-8">
                {[
                  { name: 'Home Office', sub: 'Percentage of rent/utilities' },
                  { name: 'Software & Tools', sub: 'SaaS subscriptions & domains' },
                  { name: 'Hardware', sub: 'Laptops, cameras, and gear' },
                  { name: 'Professional Services', sub: 'Legal, CPA, and contract work' }
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <span className="text-xs text-slate-500 font-medium">{item.sub}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  "Every legitimate business expense is a discount on your taxes. If you don't track it, you aren't being paid for it."
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Tax Strategy FAQ</h2>
            <p className="text-slate-500 font-medium">Expert guidance on navigating freelance taxes.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How much should I set aside for taxes as a freelancer?",
                a: "A safe benchmark is 25% to 30% of your gross income. This covers both your standard income tax and the 15.3% self-employment tax. If you live in a state or country with high local taxes, lean closer to 35%."
              },
              {
                q: "What exactly is the 'Self-Employment Tax'?",
                a: "In the US, W-2 employees split Medicare and Social Security taxes with their employer. As a freelancer, you are both the employee and the employer, meaning you are legally responsible for the full 15.3% burden."
              },
              {
                q: "Do I really need to pay taxes quarterly?",
                a: "Yes. If you expect to owe more than $1,000 in taxes for the year, the IRS (and many global tax agencies) require you to make estimated quarterly payments. Failing to do so results in underpayment penalties."
              },
              {
                q: "Is this calculator providing official financial advice?",
                a: "No. FreelancerKit provides mathematical estimations for planning and runway purposes only. Tax codes are highly specific to your local jurisdiction. Always hand your final numbers off to a certified CPA."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900">{faq.q}</span>
                  {activeFaq === i ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

