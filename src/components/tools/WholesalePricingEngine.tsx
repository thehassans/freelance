import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  Box, 
  TrendingUp, 
  DollarSign, 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  Info,
  ShieldCheck,
  Tag,
  PieChart,
  Calculator,
  ArrowRight,
  ShoppingCart,
  Factory,
  CheckCircle2
} from 'lucide-react';

export default function WholesalePricingEngine() {
  const [mfgCost, setMfgCost] = useState<string>('15');
  const [shippingCost, setShippingCost] = useState<string>('3');
  const [packagingCost, setPackagingCost] = useState<string>('2');
  const [wholesaleMargin, setWholesaleMargin] = useState<number>(50);
  const [retailMarkup, setRetailMarkup] = useState<number>(100);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pricing = useMemo(() => {
    const mfg = parseFloat(mfgCost) || 0;
    const ship = parseFloat(shippingCost) || 0;
    const pack = parseFloat(packagingCost) || 0;

    const totalCogs = mfg + ship + pack;
    
    // wholesalePrice = totalCogs / (1 - (wholesaleMargin / 100))
    const wholesalePrice = wholesaleMargin >= 100 ? totalCogs * 10 : totalCogs / (1 - (wholesaleMargin / 100));
    
    // retailPrice = wholesalePrice * (1 + (retailMarkup / 100))
    const retailPrice = wholesalePrice * (1 + (retailMarkup / 100));
    
    const makerProfit = wholesalePrice - totalCogs;
    const retailerProfit = retailPrice - wholesalePrice;

    const format = (val: number) => `$${val.toFixed(2)}`;

    return {
      totalCogs,
      wholesalePrice,
      retailPrice,
      makerProfit,
      retailerProfit,
      totalCogsF: format(totalCogs),
      wholesalePriceF: format(wholesalePrice),
      retailPriceF: format(retailPrice),
      makerProfitF: format(makerProfit),
      retailerProfitF: format(retailerProfit),
      
      // Percentages for the stacked bar
      cogsPerc: retailPrice > 0 ? (totalCogs / retailPrice) * 100 : 0,
      makerPerc: retailPrice > 0 ? (makerProfit / retailPrice) * 100 : 0,
      retailerPerc: retailPrice > 0 ? (retailerProfit / retailPrice) * 100 : 0
    };
  }, [mfgCost, shippingCost, packagingCost, wholesaleMargin, retailMarkup]);

  const faqs = [
    {
      question: "What is the difference between Margin and Markup?",
      answer: "Markup is the percentage added to your cost to reach a selling price. Margin is the percentage of the final selling price that is profit. For example, if an item costs $50 and you sell it for $100, you have a 100% markup but a 50% profit margin."
    },
    {
      question: "What is standard wholesale pricing?",
      answer: "The industry baseline is often 'Keystone Pricing', which typically means a 50% margin (or 2x cost) for wholesale, and a 100% markup (or 2x wholesale) for retail. This ensures both the manufacturer and the retailer have enough margin to cover overhead and marketing."
    },
    {
      question: "Why should I include packaging in COGS?",
      answer: "Packaging, inserts, and freight-in are variable costs tied directly to every unit sold. At scale, polymailers, custom boxes, and thermal labels can easily eat away 5-10% of your gross profit if they are buried in general overhead rather than accounted for in your base unit cost."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-indigo-100"
        >
          <Factory size={12} /> E-commerce Margin Framework
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Wholesale & <span className="text-indigo-600">Retail</span> Pricing Engine
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Price your products for sustainable growth. Calculate true manufacturing costs and protect your profit splits across the retail chain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                   <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Unit Cost Data</h3>
             </div>

             <div className="space-y-8">
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                     <Box size={12} /> Cost of Goods (COGS)
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 px-1">Manufacturing ($)</label>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input 
                              type="number" 
                              value={mfgCost} 
                              onChange={(e) => setMfgCost(e.target.value)}
                              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 px-1">Shipping ($)</label>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input 
                              type="number" 
                              value={shippingCost} 
                              onChange={(e) => setShippingCost(e.target.value)}
                              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                            />
                         </div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 px-1">Packaging & Inserts ($)</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                         <input 
                           type="number" 
                           value={packagingCost} 
                           onChange={(e) => setPackagingCost(e.target.value)}
                           className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                         />
                      </div>
                   </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                     <TrendingUp size={12} /> Pricing Strategy
                   </p>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-end mb-2">
                         <label className="text-[10px] font-bold text-slate-500 px-1">Wholesale Margin (%)</label>
                         <span className="text-indigo-600 font-black text-sm">{wholesaleMargin}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="80" 
                        value={wholesaleMargin} 
                        onChange={(e) => setWholesaleMargin(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-end mb-2">
                         <label className="text-[10px] font-bold text-slate-500 px-1">Retailer Markup (%)</label>
                         <span className="text-indigo-600 font-black text-sm">{retailMarkup}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="200" 
                        value={retailMarkup} 
                        onChange={(e) => setRetailMarkup(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Dashboard Column */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <section className="bg-slate-900 text-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none" />
             
             <div className="relative z-10 space-y-12">
                {/* 3-Column Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Total COGS</p>
                      <p className="text-4xl font-black font-display tracking-tighter text-slate-300">
                         {pricing.totalCogsF}
                      </p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Wholesale Price</p>
                      <p className="text-4xl font-black font-display tracking-tighter text-indigo-300">
                         {pricing.wholesalePriceF}
                      </p>
                   </div>
                   <div className="relative group/msrp bg-indigo-500/5 p-6 rounded-3xl border border-white/5 -m-6">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                        <Tag size={12} /> Retail MSRP
                      </p>
                      <p className="text-5xl font-black font-display tracking-tighter text-white drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                         {pricing.retailPriceF}
                      </p>
                   </div>
                </div>

                {/* Profit Split Visualization */}
                <div className="pt-12 border-t border-white/5 space-y-8">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">The MSRP Profit Split</p>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">COGS</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight">Maker Profit</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">Retailer Profit</span>
                         </div>
                      </div>
                   </div>

                   <div className="relative h-20 w-full bg-slate-950/40 rounded-[2rem] overflow-hidden border border-white/5 flex items-stretch group/bar shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pricing.cogsPerc}%` }}
                        className="bg-slate-700/80 border-r border-white/10 flex items-center justify-center relative overflow-hidden"
                      >
                         <span className="text-[10px] font-black text-slate-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {pricing.totalCogsF}
                         </span>
                      </motion.div>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pricing.makerPerc}%` }}
                        className="bg-indigo-600/80 border-r border-white/10 flex flex-col items-center justify-center relative group/innerMaker"
                      >
                         <span className="text-[8px] font-black text-indigo-200 uppercase tracking-tight opacity-60">Maker</span>
                         <span className="text-xs font-black text-white">{pricing.makerProfitF}</span>
                      </motion.div>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pricing.retailerPerc}%` }}
                        className="bg-emerald-500/80 flex flex-col items-center justify-center relative"
                      >
                         <span className="text-[8px] font-black text-emerald-100 uppercase tracking-tight opacity-60">Retailer</span>
                         <span className="text-xs font-black text-white">{pricing.retailerProfitF}</span>
                      </motion.div>
                   </div>

                   <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Net Maker Margin</p>
                         <p className="text-2xl font-black text-white">{wholesaleMargin}% <span className="text-xs text-slate-500 font-bold ml-1">of Wholesale</span></p>
                      </div>
                      <div className="text-right space-y-1">
                         <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Retailer Margin</p>
                         <p className="text-2xl font-black text-white">{(pricing.retailerProfit / pricing.retailPrice * 100).toFixed(1)}% <span className="text-xs text-slate-500 font-bold ml-1">of MSRP</span></p>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-start gap-6 relative group overflow-hidden">
             <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl relative z-10 shrink-0">
                <Info size={24} />
             </div>
             <div className="relative z-10">
                <h4 className="text-lg font-black text-slate-900 tracking-tight mb-2">The Multiplier Paradox</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                   A "Keystone Price" (2x wholesale) is the bare minimum for brick-and-mortar retail success. If your MSRP is lower than 4x-5x your raw unit cost, your business may struggle to survive the costs of returns, damaged units, and retail slotting fees.
                </p>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={40} className="text-indigo-600" />
             </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Price your products for scale, not just survival.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <ShoppingCart size={40} className="text-indigo-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Many e-commerce founders fail because they base their wholesale prices on raw manufacturing costs, forgetting packaging, freight, and hidden COGS. Our pricing engine ensures you protect your margins while leaving enough room for retail partners to make their standard markups.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-600" /> Margin Integrity
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Automatically calculate the inverse price based on target margins, preventing the common mistake of mixing up margin and markup.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <PieChart size={14} className="text-blue-600" /> Profit Distribution
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Visualize the three-way split between materials, your company, and your retailers to ensure everyone has "skin in the game."
                       </p>
                    </div>
                 </div>
                 <p>
                    Understanding standard retail multipliers is critical for landing distributors. If you don't leave enough "meat on the bone" for your retail partners, they will pass on your product, regardless of how much customers love it.
                 </p>
              </div>
           </div>
        </div>

        {/* Big Info Section */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 blur-3xl -ml-48 -mt-48 rounded-full" />
              <div className="w-full md:w-1/2 space-y-8 relative z-10">
                 <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl w-fit">
                    <TrendingUp size={32} />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-balance">
                    Precision Pricing for <br/>Direct-to-Retail.
                 </h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed">
                    Most founders underestimate their COGS by 15-20% by ignoring small items. Our auditor forces you to look at every line item.
                 </p>
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
                       <CheckCircle2 size={18} /> Inverse Margin-to-Price Calculations
                    </div>
                    <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
                       <CheckCircle2 size={18} /> Retailer Markup Simulator (50-200%)
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                 {[
                   { label: 'Standard', val: 'Keystone+' },
                   { label: 'Accuracy', val: 'Unit-Based' },
                   { label: 'Strategy', val: 'Margin-First' },
                   { label: 'Validation', val: 'COGS-Audit' },
                 ].map((item, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 font-sans">{item.label}</p>
                      <p className="text-2xl font-black italic tracking-tight text-white">{item.val}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Retail Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Critical pricing logic for e-commerce and physical product founders.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-indigo-200/50 border-indigo-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-indigo-400" />
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
        <div className="bg-indigo-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Master Your <br/>Profit Equation.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join elite product founders who use data-driven pricing models to scale their manufacturing and retain retail shelf space.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Simulate Your Prices <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
