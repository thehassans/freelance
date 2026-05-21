import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Percent, TrendingUp, DollarSign, Calculator, Info, ChevronDown, Check, Globe } from 'lucide-react';
import { useSystemConfigs } from '../../contexts/SystemConfigContext';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';
import { toast } from 'sonner';

export default function ArbitrageCalculator() {
  const { config, loading } = useSystemConfigs();
  const { executeAction, isProcessing } = usePremiumAction();
  const [clientRevenue, setClientRevenue] = useState<number | string>("");
  const [inboundFee, setInboundFee] = useState<number | string>("");
  const [subcontractorCost, setSubcontractorCost] = useState<number | string>("");
  const [outboundFee, setOutboundFee] = useState<number | string>("");
  const [applyFxFee, setApplyFxFee] = useState<boolean>(false);
  const [managementHours, setManagementHours] = useState<number | string>("");
  const [ownerHourlyRate, setOwnerHourlyRate] = useState<number | string>("");
  const [contingencyBuffer, setContingencyBuffer] = useState<number | string>(10);
  const [desiredMargin, setDesiredMargin] = useState<number | string>(30);

  useEffect(() => {
    if (!loading && config && inboundFee === "") {
      setInboundFee(config.arbitragePlatformFees);
      setOutboundFee(config.arbitragePlatformFees); // optional, just to show usage
    }
  }, [config, loading, inboundFee]);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const results = useMemo(() => {
    const rev = Number(clientRevenue) || 0;
    const inFeePct = Number(inboundFee) || 0;
    const subCost = Number(subcontractorCost) || 0;
    const outFeePct = Number(outboundFee) || 0;
    const mgmtHours = Number(managementHours) || 0;
    const hourlyRate = Number(ownerHourlyRate) || 0;

    const inboundFeeTotal = rev * (inFeePct / 100);
    const netRevenue = rev - inboundFeeTotal;
    
    const fxFeeTotal = applyFxFee ? (subCost * 0.03) : 0;
    const outboundFeeTotal = subCost * (outFeePct / 100);
    const subCostTotal = subCost + outboundFeeTotal + fxFeeTotal;
    
    const totalPlatformFees = inboundFeeTotal + outboundFeeTotal + fxFeeTotal;

    const cBuffer = Number(contingencyBuffer) || 0;
    const contingencyAmt = rev * (cBuffer / 100);

    const managementCost = mgmtHours * hourlyRate;
    
    const grossArbitrageProfit = rev - totalPlatformFees - subCost - contingencyAmt;
    const trueNetProfit = grossArbitrageProfit - managementCost;
    const trueMargin = rev > 0 ? (trueNetProfit / rev) * 100 : 0;
    
    const profitBeforeManagement = grossArbitrageProfit;
    const effectiveHourlyRate = mgmtHours > 0 ? (profitBeforeManagement / mgmtHours) : (profitBeforeManagement > 0 ? profitBeforeManagement : 0);

    const platformFeePercent = rev > 0 ? (totalPlatformFees / rev) * 100 : 0;
    const subCostPercent = rev > 0 ? (subCost / rev) * 100 : 0;
    const contingencyPercent = rev > 0 ? (contingencyAmt / rev) * 100 : 0;
    const managementPercent = rev > 0 ? (managementCost / rev) * 100 : 0;
    const netProfitPercent = rev > 0 ? (trueNetProfit / rev) * 100 : 0;

    const dMargin = Number(desiredMargin) || 0;
    const marginDec = dMargin / 100;
    const inFeeDec = inFeePct / 100;
    const contingencyDec = cBuffer / 100;
    const divisor = 1 - inFeeDec - contingencyDec - marginDec;
    const targetBidPrice = divisor > 0 ? (subCostTotal + managementCost) / divisor : 0;

    let grade = "F";
    let gradeColor = "bg-rose-500 text-white print:bg-rose-100 print:text-rose-800";
    if (trueMargin >= 40 && effectiveHourlyRate > hourlyRate) {
       grade = "A"; gradeColor = "bg-emerald-500 text-white print:bg-emerald-100 print:text-emerald-800";
    } else if (trueMargin >= 20 && effectiveHourlyRate > hourlyRate) {
       grade = "B"; gradeColor = "bg-blue-500 text-white print:bg-blue-100 print:text-blue-800";
    } else if (trueMargin > 0 && effectiveHourlyRate <= hourlyRate) {
       grade = "C"; gradeColor = "bg-amber-500 text-white print:bg-amber-100 print:text-amber-800";
    } else if (trueMargin <= 0) {
       grade = "F"; gradeColor = "bg-rose-500 text-white print:bg-rose-100 print:text-rose-800";
    }

    return {
      trueNetProfit,
      grossArbitrageProfit,
      trueMargin,
      effectiveHourlyRate,
      totalPlatformFees,
      managementCost,
      contingencyAmt,
      platformFeePercent,
      subCostPercent,
      contingencyPercent,
      managementPercent,
      netProfitPercent,
      rev,
      subCost,
      hourlyRate,
      targetBidPrice,
      dMargin,
      grade,
      gradeColor,
    };
  }, [clientRevenue, inboundFee, subcontractorCost, outboundFee, applyFxFee, managementHours, ownerHourlyRate, desiredMargin, contingencyBuffer]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const faqs = [
    {
      q: 'What is a good profit margin for drop servicing?',
      a: 'A healthy target for service arbitrage is a 40% to 50% Gross Margin. After deducting your project management time and platform fees, your Net Arbitrage Margin should sit between 20% and 30%.'
    },
    {
      q: 'Do I need to tell my clients I am using subcontractors?',
      a: 'This depends on your Master Services Agreement (MSA). Many B2B agencies use white-label subcontractors legally and ethically by maintaining strict Quality Assurance (QA) and acting as the strategic director. Always ensure your contracts permit third-party fulfillment.'
    },
    {
      q: 'How do platform fees destroy arbitrage margins?',
      a: 'If a client pays you $1,000 via Upwork (10% fee), you receive $900. If you hire a Fiverr subcontractor for $500 (plus a 5.5% buying fee), you pay $527.50. Your expected $500 profit is actually $372.50 before you even calculate your own time.'
    },
    {
      q: 'How can I improve my arbitrage margins?',
      a: 'Move trusted subcontractors off third-party platforms to avoid fee stacking, utilize wire transfers or ACH instead of credit cards, and create strict Standard Operating Procedures (SOPs) to reduce your management hours.'
    }
  ];

  return (
    <div className="pb-24 space-y-24">
      {/* Hero Section */}
      <section className="print:hidden">
        <div className="text-center mb-16 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6"
          >
            Platform <span className="text-[#0f4c75]">Arbitrage</span> Calculator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Reverse-calculate platform fees (Upwork, Fiverr, Stripe) to find your true target bid and ensure your drop-servicing margins are mathematically flawless.
          </motion.p>
        </div>

        {/* 1. The Arbitrage Calculator UI (The Core Tool) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Column (Financial Inputs) */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 lg:col-span-5 print:hidden">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-slate-100 rounded-2xl">
              <Calculator className="text-[#0f4c75]" size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Financial Inputs</h3>
          </div>

          <div className="space-y-6">
            {/* Quick Presets */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Presets</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => { setInboundFee(10); setOutboundFee(5.5); }}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors"
                >
                  Upwork → Fiverr
                </button>
                <button 
                  onClick={() => { setInboundFee(2.9); setOutboundFee(5); }}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors"
                >
                  Stripe → Upwork
                </button>
                <button 
                  onClick={() => { setInboundFee(0); setOutboundFee(0); }}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors"
                >
                  Direct → Direct
                </button>
              </div>
            </div>

            {/* Group: The Source */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 relative pt-6">
              <span className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-md border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">Client Side</span>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Client Revenue ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={clientRevenue}
                      onChange={(e) => setClientRevenue(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0f4c75] focus:border-transparent transition-all"
                      placeholder="Total amount client pays"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Inbound Platform Fee (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={inboundFee}
                      onChange={(e) => setInboundFee(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0f4c75] focus:border-transparent transition-all"
                      placeholder="e.g., Stripe 2.9%, Upwork 10%"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Group: Subcontractor & Logistics */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 relative pt-6">
              <span className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-md border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">Fulfillment Side</span>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Subcontractor Cost ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={subcontractorCost}
                      onChange={(e) => setSubcontractorCost(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0f4c75] focus:border-transparent transition-all"
                      placeholder="Amount paid to subcontractor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Outbound Platform Fee (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={outboundFee}
                      onChange={(e) => setOutboundFee(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0f4c75] focus:border-transparent transition-all"
                      placeholder="e.g., Fiverr 5.5%"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    <Globe size={14} className="text-slate-400" /> Apply Cross-Border FX Fee (3%)
                  </div>
                  <button 
                    onClick={() => setApplyFxFee(!applyFxFee)}
                    className={`w-10 h-6 flex-shrink-0 rounded-full transition-colors relative flex items-center ${applyFxFee ? 'bg-[#0f4c75]' : 'bg-slate-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${applyFxFee ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Group: Time & Management */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 relative pt-6">
              <span className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-md border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">Owner Overhead</span>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Management Hours</label>
                  <input
                    type="number"
                    value={managementHours}
                    onChange={(e) => setManagementHours(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0f4c75] focus:border-transparent transition-all"
                    placeholder="Manager overhead time"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Owner Hourly Rate ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={ownerHourlyRate}
                      onChange={(e) => setOwnerHourlyRate(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0f4c75] focus:border-transparent transition-all"
                      placeholder="Your internal hourly cost"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Group: Risk Management */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 relative pt-6">
              <span className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-md border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">Risk & Planning</span>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Risk/Contingency Buffer (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={contingencyBuffer}
                      onChange={(e) => setContingencyBuffer(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0f4c75] focus:border-transparent transition-all"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 🎯 Target Bid Engine */}
            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-xl mt-6">
              <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                🎯 Target Bid Engine
              </h4>
              <div className="mb-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Desired Net Margin (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="number"
                    value={desiredMargin}
                    onChange={(e) => setDesiredMargin(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white border border-blue-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0f4c75] focus:border-transparent transition-all"
                    placeholder="e.g., 30"
                  />
                </div>
              </div>
              <div className="text-sm font-medium text-slate-700 leading-relaxed">
                To achieve a <strong className="text-blue-900">{results.dMargin}%</strong> profit on a <strong className="text-blue-900">{formatCurrency(results.subCost)}</strong> fulfillment, you must quote the client: <strong className="text-blue-900 block text-2xl mt-2">{results.targetBidPrice > 0 ? formatCurrency(results.targetBidPrice) : '---'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (The Arbitrage Dashboard) */}
        <div id="deal-sheet-export" className="bg-slate-900 print:bg-white text-white print:text-slate-900 p-6 sm:p-8 print:p-0 rounded-[2.5rem] print:rounded-none shadow-2xl print:shadow-none print:border-0 relative overflow-y-auto overflow-x-hidden flex flex-col lg:col-span-7 print:w-full print:col-span-12 print:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0f4c75]/20 blur-[100px] -mr-40 -mt-40 rounded-full print:hidden" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -ml-32 -mb-32 rounded-full print:hidden" />
          
          <div className="relative z-10 space-y-6 print:space-y-8">
            <div className="hidden print:block text-2xl font-bold mb-6 pt-4 text-slate-900 border-b border-slate-200 pb-4">Arbitrage Deal Analysis</div>

            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white print:text-slate-900">CFO Deal Ledger</h3>
              {results.rev > 0 && (
                <div className={`px-3 py-1 rounded-lg font-bold text-sm border flex items-center gap-2 ${results.gradeColor} border-current border-opacity-20`}>
                  Deal Grade <span className="text-lg">{results.grade}</span>
                </div>
              )}
            </div>

            <div className="space-y-4 font-mono text-sm sm:text-base bg-slate-800/40 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-2xl p-6">
               {/* Row 1 */}
               <div className="flex justify-between">
                   <span className="text-slate-400 print:text-slate-600">Client Revenue</span>
                   <span className="text-emerald-400 print:text-emerald-700 font-bold">{formatCurrency(results.rev)}</span>
               </div>
               {/* Row 2 */}
               <div className="flex justify-between">
                   <span className="text-slate-400 print:text-slate-600">- Total Platform Fees</span>
                   <span className="text-rose-400 print:text-rose-600">{formatCurrency(results.totalPlatformFees)}</span>
               </div>
               {/* Row 3 */}
               <div className="flex justify-between">
                   <span className="text-slate-400 print:text-slate-600">- Subcontractor COGS</span>
                   <span className="text-amber-400 print:text-amber-600">{formatCurrency(results.subCost)}</span>
               </div>
               {/* Row 4 */}
               <div className="flex justify-between">
                   <span className="text-slate-400 print:text-slate-600">- Contingency Buffer ({contingencyBuffer}%)</span>
                   <span className="text-slate-300 print:text-slate-700">{formatCurrency(results.contingencyAmt)}</span>
               </div>
        
               <hr className="border-slate-700 print:border-slate-300 my-4" />
        
               {/* Row 5 */}
               <div className="flex justify-between font-bold">
                   <span className="text-white print:text-slate-900">Gross Arbitrage Profit</span>
                   <span className="text-white print:text-slate-900">{formatCurrency(results.grossArbitrageProfit)}</span>
               </div>
        
               {/* Row 6 */}
               <div className="flex justify-between">
                   <span className="text-slate-500 print:text-slate-500">- Management Opportunity Cost</span>
                   <span className="text-rose-300 print:text-rose-600">{formatCurrency(results.managementCost)}</span>
               </div>
        
               <hr className="border-slate-700 print:border-slate-300 border-dashed my-4" />
        
               {/* Row 7 */}
               <div className="flex justify-between items-center text-xl sm:text-2xl pt-2">
                   <span className="font-bold text-white print:text-slate-900">True Net Profit</span>
                   <span className={`text-4xl font-black tracking-tighter ${results.trueNetProfit >= 0 ? 'text-emerald-400 print:text-emerald-600' : 'text-rose-400 print:text-rose-600'}`}>
                       {formatCurrency(results.trueNetProfit)}
                   </span>
               </div>
            </div>

            {/* Money Leak Visual Bar */}
            <div className="pt-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-slate-500 mb-3">The Money Leak Breakdown</h4>
              <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-800 print:bg-slate-200">
                 <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${results.platformFeePercent}%` }} title={`Platform Fees: ${formatCurrency(results.totalPlatformFees)}`} />
                 <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${results.subCostPercent}%` }} title={`Subcontractor: ${formatCurrency(results.subCost)}`} />
                 <div className="bg-slate-500 h-full transition-all duration-500" style={{ width: `${results.contingencyPercent}%` }} title={`Contingency Buffer: ${formatCurrency(results.contingencyAmt)}`} />
                 <div className="bg-slate-700 print:bg-slate-400 h-full transition-all duration-500" style={{ width: `${results.managementPercent}%` }} title={`Management: ${formatCurrency(results.managementCost)}`} />
                 <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.max(0, results.netProfitPercent)}%` }} title={`Net Profit: ${formatCurrency(Math.max(0, results.trueNetProfit))}`} />
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-[10px] font-bold uppercase tracking-wider">
                 <div className="flex items-center gap-1.5 text-slate-400 print:text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" /> <span className="hidden sm:inline">Platform</span> Fees ({results.platformFeePercent.toFixed(1)}%)
                 </div>
                 <div className="flex items-center gap-1.5 text-slate-400 print:text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shrink-0" /> Subcontractor ({results.subCostPercent.toFixed(1)}%)
                 </div>
                 {results.contingencyPercent > 0 && (
                   <div className="flex items-center gap-1.5 text-slate-400 print:text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-500 shrink-0" /> Contingency ({results.contingencyPercent.toFixed(1)}%)
                   </div>
                 )}
                 {results.managementPercent > 0 && (
                   <div className="flex items-center gap-1.5 text-slate-400 print:text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 print:bg-slate-400 shrink-0" /> Management ({results.managementPercent.toFixed(1)}%)
                   </div>
                 )}
                 {results.netProfitPercent > 0 && (
                   <div className="flex items-center gap-1.5 text-slate-400 print:text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" /> Net Profit ({results.netProfitPercent.toFixed(1)}%)
                   </div>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800 print:border-slate-200">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-slate-500 mb-2">True Margin (%)</p>
                <div className={`text-3xl font-bold tabular-nums ${results.trueMargin >= 20 ? "text-white print:text-slate-900" : results.trueMargin >= 0 ? "text-amber-400 print:text-amber-600" : "text-rose-400 print:text-rose-600"}`}>
                  {results.trueMargin.toFixed(1)}%
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-slate-500 mb-2">Effective Hourly Rate</p>
                <div className="text-3xl font-bold text-white print:text-slate-900 flex items-baseline gap-1 tabular-nums">
                  {formatCurrency(results.effectiveHourlyRate)}
                  <span className="text-sm text-slate-400 print:text-slate-500">/hr</span>
                </div>
              </div>
            </div>

            {/* Opportunity Cost Warning System */}
            {results.effectiveHourlyRate < results.hourlyRate && results.effectiveHourlyRate > 0 && results.hourlyRate > 0 && (
              <div className="bg-rose-500/10 print:bg-rose-50 border border-rose-500/20 print:border-rose-200 text-rose-300 print:text-rose-700 p-4 rounded-xl flex items-start gap-3 mt-4">
                <span className="text-xl print:text-rose-500 mt-1">⚠️</span>
                <div>
                  <h5 className="font-bold text-rose-400 print:text-rose-800 mb-1 leading-tight">Opportunity Cost Alert: You are losing money.</h5>
                  <p className="text-xs print:text-sm text-rose-200/80 print:text-rose-700/80">Your effective yield is lower than your base hourly rate. You must either raise the client price or reduce your management hours.</p>
                </div>
              </div>
            )}
            
            {results.effectiveHourlyRate >= results.hourlyRate && results.hourlyRate > 0 && results.effectiveHourlyRate > 0 && (
              <div className="text-emerald-400 print:text-emerald-600 text-sm font-bold mt-4 flex items-center gap-2">
                <Check size={16} /> Profitable Arbitrage Achieved.
              </div>
            )}

            {/* Deal Sheet Export Button */}
            <div className="pt-6 mt-auto border-t border-slate-800 print:hidden text-center">
              <button 
                disabled={isProcessing}
                onClick={() => {
                  executeAction(async () => {
                    await DatabaseService.logToolUsage('arbitrage-calculator');
                    window.print();
                    toast.success('Deal Sheet Exported.');
                    return true;
                  });
                }}
                className={`w-full xl:w-auto px-8 py-4 rounded-xl border border-white/10 text-slate-300 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-all hover:border-white/20 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}`}
              >
                {isProcessing ? 'Processing... (Generating PDF)' : 'Download Deal Sheet (PDF)'}
              </button>
            </div>

            {/* Print-only footer */}
            <div className="hidden print:block mt-12 pt-8 border-t border-slate-300">
              <div className="flex justify-between w-full text-sm font-bold mt-16 font-mono text-slate-800">
                <span>Agency Director Signature: ______________________</span>
                <span>Date: ______________________</span>
              </div>
            </div>

          </div>
        </div>
      </div>
      </section>

      {/* 2. The Features Grid (Scale Without the Sweat) */}
      <div className="max-w-6xl mx-auto py-24 px-4">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-16">Scale Your Agency with Precision</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Hidden Fee Detection",
              desc: "Automatically deduct dual-sided platform fees (Upwork, Fiverr, Stripe) so your profit margins are mathematically flawless."
            },
            {
              title: "Management Overhead",
              desc: "Factoring in subcontractor costs isn't enough. Calculate the exact cost of your project management time to ensure the arbitrage is actually worth the effort."
            },
            {
              title: "True Hourly Yield",
              desc: "Instantly see your 'Effective Hourly Rate' to determine if drop-servicing a project is more profitable than executing it yourself."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 bg-slate-50 text-[#0f4c75] rounded-2xl flex items-center justify-center mb-2 z-10 relative">
                <Check size={24} className="stroke-[3px]" />
              </div>
              <h3 className="text-xl font-black text-slate-900 z-10 relative">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed z-10 relative">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The Deep SEO & Methodology Article Block */}
      <div className="max-w-4xl mx-auto prose prose-slate prose-headings:font-sans mb-24 print:hidden px-4">
        <h3>What is Platform Arbitrage (Drop Servicing)?</h3>
        <p>Platform arbitrage is an agency fulfillment model where you sell a service to a client at a premium rate and outsource the execution to a subcontractor on platforms like Upwork, Fiverr, or specialized white-label firms. The profit is the spread between the client's payment and the fulfillment cost.</p>

        <h3>The Hidden Costs of Arbitrage</h3>
        <p>Many beginners calculate arbitrage simply as (Client Price - Subcontractor Price = Profit). This is a fatal business error. True arbitrage calculations must include inbound payment processing fees, outbound platform hiring fees, currency conversion spreads, and the agency owner's management time.</p>

        <h3>When to Outsource vs. Execute In-House</h3>
        <p>Use this calculator to find your 'True Hourly Yield.' If your internal hourly rate is $150/hr, but managing a subcontractor yields an effective rate of $45/hr, you are losing money by outsourcing. Arbitrage is only profitable when the management overhead is heavily systemized.</p>
      </div>

      {/* 4. The Massive Accordion FAQ */}
      <h2 className="text-3xl font-black text-slate-900 text-center mb-10 px-4">Drop Servicing & Arbitrage FAQ</h2>
      <div className="max-w-3xl mx-auto border-t border-slate-200 divide-y divide-slate-100 print:hidden px-4">
        {faqs.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div key={index} className="py-2">
              <button
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="font-bold text-slate-900 text-lg group-hover:text-[#0f4c75] transition-colors pr-8">{faq.q}</span>
                <div className={`flex-shrink-0 p-2 rounded-full transition-colors ${isOpen ? 'bg-[#0f4c75]/10 text-[#0f4c75]' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 text-slate-600 leading-relaxed pr-12">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
