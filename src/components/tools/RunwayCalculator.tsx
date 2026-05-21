import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Info, DollarSign, Timer, AlertTriangle, TrendingDown, ArrowUpRight, Zap, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function RunwayCalculator() {
  const [cash, setCash] = useState(15000);
  const [ar, setAr] = useState(0);
  const [expenses, setExpenses] = useState(3000);
  const [revenue, setRevenue] = useState(1200);
  const [isStressTest, setIsStressTest] = useState(false);

  const stats = useMemo(() => {
    const effectiveRevenue = isStressTest ? 0 : revenue;
    const totalLiquidity = cash + ar;
    const netBurn = expenses - effectiveRevenue;
    
    let months = Infinity;
    if (netBurn > 0) {
      months = Number((totalLiquidity / netBurn).toFixed(1));
    }

    // Drop-Dead Date Calculation
    const dropDeadDate = new Date();
    if (months !== Infinity && months > 0) {
      const fullMonths = Math.floor(months);
      const remainingDays = Math.round((months - fullMonths) * 30);
      dropDeadDate.setMonth(dropDeadDate.getMonth() + fullMonths);
      dropDeadDate.setDate(dropDeadDate.getDate() + remainingDays);
    }
    
    const dateStr = months === Infinity 
      ? 'Profitability Achieved' 
      : `Cash depleted by ${dropDeadDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

    // Chart Data Generation
    const chartData = [];
    if (months === Infinity || netBurn <= 0) {
      for (let i = 0; i <= 12; i++) {
        chartData.push({
          month: i === 0 ? 'Now' : `M${i}`,
          balance: totalLiquidity + Math.abs(netBurn) * i
        });
      }
    } else {
      const displayMonths = Math.min(24, Math.ceil(months) + 2);
      for (let i = 0; i <= displayMonths; i++) {
        chartData.push({
          month: i === 0 ? 'Now' : `M${i}`,
          balance: Math.max(0, totalLiquidity - (netBurn * i))
        });
      }
    }

    return { totalLiquidity, netBurn, months, dateStr, chartData, effectiveRevenue };
  }, [cash, ar, expenses, revenue, isStressTest]);

  const { totalLiquidity, netBurn, months, dateStr, chartData } = stats;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet size={120} />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl shadow-inner shadow-primary/5">
                 <Wallet size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Financial Vitals</h3>
            </div>

            <button 
              onClick={() => setIsStressTest(!isStressTest)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isStressTest ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
            >
              <Zap size={12} className={isStressTest ? 'fill-orange-600' : ''} />
              <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Stress Test</span>
              <div className={`w-6 h-3 rounded-full relative transition-colors ${isStressTest ? 'bg-orange-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all ${isStressTest ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Current Bank Balance ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="number" 
                    value={cash || 0}
                    onChange={(e) => setCash(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Outstanding Invoices (A/R) ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="number" 
                    value={ar || 0}
                    onChange={(e) => setAr(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-mono font-bold text-slate-900"
                    placeholder="Pending payments..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Avg Monthly Costs ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="number" 
                      value={expenses || 0}
                      onChange={(e) => setExpenses(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-danger font-mono font-bold text-slate-900"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Avg Freelance Income ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="number" 
                      disabled={isStressTest}
                      value={isStressTest ? 0 : (revenue || 0)}
                      onChange={(e) => setRevenue(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:border-success font-mono font-bold transition-all ${isStressTest ? 'bg-orange-50/50 border-orange-100 text-orange-600 cursor-not-allowed opacity-60' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                    {isStressTest && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded">Fixed at 0</div>}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-[#0f4c75]/5 border border-[#0f4c75]/10 rounded-[2rem] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#0f4c75]/5 blur-3xl rounded-full -mr-16 -mt-16" />
           <div className="flex gap-6 relative z-10">
              <div className="p-3 bg-white rounded-2xl text-[#0f4c75] shadow-sm h-fit border border-slate-100 shrink-0">
                 <AlertTriangle size={20} />
              </div>
              <div className="space-y-4">
                 <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Reality Check</h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      "Assume future income is zero and expenses grow by 10%. If that scares you, your rates are likely too low for sustainable growth."
                    </p>
                 </div>
                 <Link 
                   to="/tools/rate-calculator" 
                   className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f4c75] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0c3a5a] transition-all shadow-lg shadow-[#0f4c75]/20 group"
                 >
                   Need more runway? Calculate new rates <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                 </Link>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-6 lg:sticky lg:top-24">
        <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <Timer className="text-primary animate-pulse" size={24} />
                    <h3 className="text-lg font-black uppercase tracking-tight">Financial Runway</h3>
                 </div>
                 {months < 3 && months !== Infinity && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                       <AlertTriangle size={12} /> Critical Warning
                    </motion.div>
                 )}
              </div>

              <div className="mb-12">
                 <div className="text-8xl font-black font-display text-primary tracking-tighter tabular-nums flex items-baseline">
                    {months === Infinity ? '∞' : months}
                    {months !== Infinity && <span className="text-2xl text-slate-500 font-black ml-4 tracking-normal uppercase bg-slate-800/50 px-3 py-1 rounded-xl">Months</span>}
                 </div>
                 <p className={`mt-4 text-xs font-black uppercase tracking-[0.2em] px-1 ${months === Infinity ? 'text-success' : 'text-slate-400'}`}>
                    {dateStr}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Net Monthly Burn</p>
                    <div className="flex items-center gap-2 italic">
                       <TrendingDown size={14} className={netBurn > 0 ? 'text-red-400' : 'text-success'} />
                       <p className={`text-2xl font-black font-mono ${netBurn > 0 ? 'text-white' : 'text-success'}`}>
                          ${Math.abs(netBurn).toLocaleString()}
                       </p>
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Liquidity</p>
                    <div className="flex items-center gap-2 italic">
                       <DollarSign size={14} className="text-primary" />
                       <p className="text-2xl font-black text-white font-mono">${totalLiquidity.toLocaleString()}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                  <BarChart3 size={14} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cash Depletion Forecast</h4>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Available Capital</span>
              </div>
           </div>
           
           <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6c63ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#6c63ff" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>

           <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex-grow">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Sustainability Score</p>
                 <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-grow bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-1000 ${months > 6 ? 'bg-success' : months > 3 ? 'bg-orange-400' : 'bg-red-500'}`}
                         style={{ width: `${Math.min(100, (months / 12) * 100)}%` }} 
                       />
                    </div>
                    <span className="text-[10px] font-black text-slate-900">{Math.min(100, Math.round((months / 12) * 100))}/100</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
