import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  TrendingDown, 
  Clock, 
  Users, 
  DollarSign, 
  FileDown, 
  Zap, 
  Copy, 
  Check, 
  AlertTriangle,
  Info,
  BarChart3,
  ChevronRight
} from 'lucide-react';

export default function RansomwareCalculator() {
  const [revenue, setRevenue] = useState(5000000);
  const [employees, setEmployees] = useState(50);
  const [wage, setWage] = useState(35);
  const [downtimeDays, setDowntimeDays] = useState(5);
  const [copied, setCopied] = useState(false);

  const calculations = useMemo(() => {
    const hourlyRevenue = revenue / 8760;
    const lostRevenue = hourlyRevenue * 24 * downtimeDays;
    const lostProductivity = employees * wage * 8 * downtimeDays;
    const totalCost = lostRevenue + lostProductivity;

    return {
      lostRevenue,
      lostProductivity,
      totalCost,
      revenuePercentage: (lostRevenue / totalCost) * 100,
      productivityPercentage: (lostProductivity / totalCost) * 100
    };
  }, [revenue, employees, wage, downtimeDays]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCopyScript = () => {
    const text = `Hi [Name], I was running a risk analysis on your operational footprint. Based on your team size and revenue, a standard ransomware infection (averaging ${downtimeDays} days of lockout) would cost your business approximately ${formatCurrency(calculations.totalCost)} in lost revenue and wasted payroll. I specialize in deploying automated disaster recovery systems that bring that downtime down to under 4 hours. Let me know when you have 10 minutes to discuss a backup implementation.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Print Header */}
      <div className="hidden print:block mb-8 border-b-4 border-rose-600 pb-6 text-center">
        <h1 className="text-3xl font-black text-rose-600 uppercase tracking-tighter">CRITICAL RISK EXPOSURE</h1>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest mt-2">Ransomware Liability & Operational Downtime Estimate</h2>
        <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Prepared On: {new Date().toLocaleDateString()}</span>
          <span>Confidential Risk Analysis</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest border border-rose-100">
            <ShieldAlert size={14} /> Threat Intelligence
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Ransomware Cost Calculator</h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Quantify the devastating impact of operational paralysis. Calculate real-world downtime costs covering both lost revenue and payroll drain.
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:border-rose-500 hover:text-rose-600 transition-all shadow-sm active:scale-95"
        >
          <FileDown size={16} /> Export Risk Assessment PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-7 space-y-6 print:hidden">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Annual Revenue */}
              <div className="space-y-4">
                <label className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><DollarSign size={14} /> Annual Revenue</span>
                  <span className="text-slate-900">{formatCurrency(revenue)}</span>
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Number of Employees */}
              <div className="space-y-4">
                <label className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Users size={14} /> Headcount</span>
                  <span className="text-slate-900">{employees} Staff</span>
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Average Wage */}
              <div className="space-y-4">
                <label className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Clock size={14} /> Avg. Hourly Wage</span>
                  <span className="text-slate-900">${wage}/hr</span>
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={wage}
                    onChange={(e) => setWage(Number(e.target.value))}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Context Info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                <Info size={16} className="text-slate-400 mt-1 shrink-0" />
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  We calculate lost revenue based on a 24/7 run-rate and payroll drag based on an 8-hour workday.
                </p>
              </div>
            </div>

            {/* Downtime Slider */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <TrendingDown size={16} className="text-rose-500" /> Estimated Days of Downtime
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide italic">"Global average ransomware downtime is 21 days."</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-rose-600 italic leading-none">{downtimeDays}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Days</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="21"
                value={downtimeDays}
                onChange={(e) => setDowntimeDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest px-1">
                <span>1 Day (Best Case)</span>
                <span>21 Days (Industry Average)</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 rounded-[2rem] p-6 border border-rose-100 flex items-start gap-4">
            <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-rose-900 uppercase tracking-tight italic">Financial Poisoning</h4>
              <p className="text-xs text-rose-700/70 leading-relaxed mt-1">
                Beyond these direct costs, ransomware events often lead to permanent <strong>customer churn</strong>, skyrocketing <strong>cyber insurance premiums</strong>, and potential <strong>legal notification liabilities</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="lg:col-span-5 space-y-6 print:w-full">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-300/50 border border-slate-100 relative overflow-hidden print:shadow-none print:border-slate-200">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <DollarSign size={160} className="text-rose-900 rotate-12" />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="space-y-1 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-display">Total Financial Impact</p>
                <div className="flex items-center justify-center gap-1">
                  <motion.span 
                    key={calculations.totalCost}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl md:text-6xl font-black text-rose-600 tracking-tighter italic"
                  >
                    {formatCurrency(calculations.totalCost)}
                  </motion.span>
                </div>
                <div className="bg-rose-50 text-rose-600 py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mt-4 mx-auto border border-rose-100">
                  Critical Risk Exposure
                </div>
              </div>

              {/* Data Breakdown */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    <span>Loss Breakdown</span>
                    <span>Proportional Impact</span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Revenue Loss */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500" /> Lost Sales Revenue
                        </span>
                        <span className="text-xs font-black text-slate-900">{formatCurrency(calculations.lostRevenue)}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${calculations.revenuePercentage}%` }}
                          className="h-full bg-rose-500"
                        />
                      </div>
                    </div>

                    {/* Productivity/Payroll Loss */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-900" /> Wasted Payroll Drain
                        </span>
                        <span className="text-xs font-black text-slate-900">{formatCurrency(calculations.lostProductivity)}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${calculations.productivityPercentage}%` }}
                          className="h-full bg-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-rose-900 rounded-2xl flex items-center justify-between text-white shadow-xl shadow-rose-900/20">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-300">Daily Burn Rate</p>
                    <p className="text-2xl font-black italic">{formatCurrency(calculations.totalCost / downtimeDays)}</p>
                  </div>
                  <TrendingDown size={32} className="text-rose-400 opacity-50" />
                </div>
              </div>
              
              <div className="pt-6 border-t font-mono text-[9px] text-slate-400 leading-tight hidden print:block">
                This estimate represents a baseline financial model. Actual impact may vary depending on data restoration speed, the presence of immutable backups, and forensic audit requirements.
              </div>
            </div>
          </div>

          {/* Sales Hook */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/30 print:hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Zap size={100} className="text-rose-400 rotate-12" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  <BarChart3 size={14} /> Strategic Sales Pitch
                </div>
                <h4 className="text-xl font-black italic uppercase tracking-tight">Convert Fear into Action</h4>
                <p className="text-slate-400 text-xs italic">Don't sell software. Sell the literal salvation of their quarterly revenue.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                  "Hi [Name], I was running a risk analysis... a standard ransomware infection would cost your business approximately <span className="text-rose-400 font-bold">{formatCurrency(calculations.totalCost)}</span> in lost revenue..."
                </p>
                <div className="absolute -top-2 left-6 px-2 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded">The Script</div>
              </div>

              <button 
                onClick={handleCopyScript}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  copied 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-white text-slate-900 hover:bg-rose-50 shadow-lg'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Sales Script Copied!' : 'Copy Sales Script'}
              </button>
            </div>
          </div>
          
          <div className="text-center print:hidden">
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-2 mx-auto transition-colors">
              Read Methodology: How we calculate ROI <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
