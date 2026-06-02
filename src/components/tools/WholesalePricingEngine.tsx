import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  CheckCircle2,
} from "lucide-react";

export default function WholesalePricingEngine() {
  const [currency, setCurrency] = useState<string>("$");
  const [mfgCost, setMfgCost] = useState<string>("15");
  const [shippingCost, setShippingCost] = useState<string>("3");
  const [packagingCost, setPackagingCost] = useState<string>("2");
  const [wholesaleMargin, setWholesaleMargin] = useState<number>(50);
  const [retailMarkup, setRetailMarkup] = useState<number>(100);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pricing = useMemo(() => {
    const mfg = parseFloat(mfgCost) || 0;
    const ship = parseFloat(shippingCost) || 0;
    const pack = parseFloat(packagingCost) || 0;

    const totalCogs = mfg + ship + pack;

    // wholesalePrice = totalCogs / (1 - (wholesaleMargin / 100))
    const wholesalePrice =
      wholesaleMargin >= 100
        ? totalCogs * 10
        : totalCogs / (1 - wholesaleMargin / 100);

    // retailPrice = wholesalePrice * (1 + (retailMarkup / 100))
    const retailPrice = wholesalePrice * (1 + retailMarkup / 100);

    const makerProfit = wholesalePrice - totalCogs;
    const retailerProfit = retailPrice - wholesalePrice;

    const format = (val: number) => {
      const numericVal = typeof val === "number" && !isNaN(val) ? val : 0;
      return `${currency}${numericVal.toFixed(2)}`;
    };

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
      retailerPerc: retailPrice > 0 ? (retailerProfit / retailPrice) * 100 : 0,
    };
  }, [
    mfgCost,
    shippingCost,
    packagingCost,
    wholesaleMargin,
    retailMarkup,
    currency,
  ]);

  const faqs = [
    {
      question: "What is the difference between Margin and Markup?",
      answer:
        "Markup is the percentage added to your cost to reach a selling price. Margin is the percentage of the final selling price that is profit. For example, if an item costs $50 and you sell it for $100, you have a 100% markup but a 50% profit margin.",
    },
    {
      question: "What is standard wholesale pricing?",
      answer:
        "The industry baseline is often 'Keystone Pricing', which typically means a 50% margin (or 2x cost) for wholesale, and a 100% markup (or 2x wholesale) for retail. This ensures both the manufacturer and the retailer have enough margin to cover overhead and marketing.",
    },
    {
      question: "Why should I include packaging in COGS?",
      answer:
        "Packaging, inserts, and freight-in are variable costs tied directly to every unit sold. At scale, polymailers, custom boxes, and thermal labels can easily eat away 5-10% of your gross profit if they are buried in general overhead rather than accounted for in your base unit cost.",
    },
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
          Wholesale & <span className="text-indigo-600">Retail</span> Pricing
          Engine
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed font-sans">
          Price your products for sustainable growth. Calculate true
          manufacturing costs and protect your profit splits across the retail
          chain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">
                  Unit Cost Data
                </h3>
              </div>
              <div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg outline-none cursor-pointer focus:border-indigo-500 transition-all focus:outline-none"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="SAR ">SAR (SAR)</option>
                  <option value="Rs ">PKR (Rs)</option>
                  <option value="₹">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Box size={12} /> Cost of Goods (COGS)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 px-1">
                      Manufacturing ({currency.trim()})
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        {currency}
                      </span>
                      <input
                        type="number"
                        value={mfgCost}
                        onChange={(e) => setMfgCost(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 px-1">
                      Shipping ({currency.trim()})
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        {currency}
                      </span>
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
                  <label className="text-[10px] font-bold text-slate-500 px-1">
                    Packaging & Inserts ({currency.trim()})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      {currency}
                    </span>
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
                    <label className="text-[10px] font-bold text-slate-500 px-1">
                      Wholesale Margin (%)
                    </label>
                    <span className="text-indigo-600 font-black text-sm">
                      {wholesaleMargin}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={wholesaleMargin}
                    onChange={(e) =>
                      setWholesaleMargin(parseInt(e.target.value))
                    }
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed px-1">
                    Formula: COGS / (1 - Margin). Ensures your gross profit hits the target percentage.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-bold text-slate-500 px-1">
                      Retailer Markup (%)
                    </label>
                    <span className="text-indigo-600 font-black text-sm">
                      {retailMarkup}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={retailMarkup}
                    onChange={(e) => setRetailMarkup(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed px-1">
                    Formula: Wholesale + (Wholesale × Markup). The standard Keystone markup is 100%.
                  </p>
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
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">
                    Total COGS
                  </p>
                  <p className="text-4xl font-black font-display tracking-tighter text-slate-300">
                    {pricing.totalCogsF}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">
                    Wholesale Price
                  </p>
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
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    The MSRP Profit Split
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                        COGS
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight">
                        Maker Profit
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
                        Retailer Profit
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative h-20 w-full bg-slate-950/40 rounded-[2rem] overflow-hidden border border-white/5 flex items-stretch group/bar shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pricing.cogsPerc}%` }}
                    className="bg-slate-700/80 border-r border-white/10 flex flex-col items-center justify-center relative overflow-hidden px-1 min-w-[50px] shrink-0"
                  >
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight opacity-60">
                      COGS
                    </span>
                    <span className="text-xs font-black text-slate-300">
                      {pricing.totalCogsF}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pricing.makerPerc}%` }}
                    className="bg-indigo-600/80 border-r border-white/10 flex flex-col items-center justify-center relative group/innerMaker px-1 min-w-[80px]"
                  >
                    <span className="text-[8px] font-black text-indigo-200 uppercase tracking-tight opacity-60">
                      Maker
                    </span>
                    <span className="text-xs font-black text-white whitespace-nowrap">
                      Maker: {pricing.makerProfitF}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pricing.retailerPerc}%` }}
                    className="bg-emerald-500/80 flex flex-col items-center justify-center relative px-1 min-w-[80px]"
                  >
                    <span className="text-[8px] font-black text-emerald-100 uppercase tracking-tight opacity-60">
                      Retailer
                    </span>
                    <span className="text-xs font-black text-white whitespace-nowrap">
                      Retailer: {pricing.retailerProfitF}
                    </span>
                  </motion.div>
                </div>

                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                      Net Maker Margin
                    </p>
                    <p className="text-2xl font-black text-white">
                      {wholesaleMargin}%{" "}
                      <span className="text-xs text-slate-500 font-bold ml-1">
                        of Wholesale
                      </span>
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      Retailer Margin
                    </p>
                    <p className="text-2xl font-black text-white">
                      {((typeof pricing?.retailerProfit === "number" &&
                      typeof pricing?.retailPrice === "number" &&
                      pricing.retailPrice > 0
                        ? (pricing.retailerProfit / pricing.retailPrice) * 100
                        : 0) || 0).toFixed(1)}
                      %{" "}
                      <span className="text-xs text-slate-500 font-bold ml-1">
                        of MSRP
                      </span>
                    </p>
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
              <h4 className="text-lg font-black text-slate-900 tracking-tight mb-2">
                The Multiplier Paradox
              </h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                A "Keystone Price" (2x wholesale) is the bare minimum for
                brick-and-mortar retail success. If your MSRP is lower than
                4x-5x your raw unit cost, your business may struggle to survive
                the costs of returns, damaged units, and retail slotting fees.
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
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Price your products for scale, not just survival.
            </h2>
          </div>
          <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden font-sans">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingCart size={40} className="text-indigo-600" />
            </div>
            <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
              <p>
                Many e-commerce founders fail because they base their wholesale
                prices on raw manufacturing costs, forgetting packaging,
                freight, and hidden COGS. Our pricing engine ensures you protect
                your margins while leaving enough room for retail partners to
                make their standard markups.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />{" "}
                    Margin Integrity
                  </h4>
                  <p className="text-sm text-slate-500 leading-normal">
                    Automatically calculate the inverse price based on target
                    margins, preventing the common mistake of mixing up margin
                    and markup.
                  </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                    <PieChart size={14} className="text-blue-600" /> Profit
                    Distribution
                  </h4>
                  <p className="text-sm text-slate-500 leading-normal">
                    Visualize the three-way split between materials, your
                    company, and your retailers to ensure everyone has "skin in
                    the game."
                  </p>
                </div>
              </div>
              <p>
                Understanding standard retail multipliers is critical for
                landing distributors. If you don't leave enough "meat on the
                bone" for your retail partners, they will pass on your product,
                regardless of how much customers love it.
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
                Precision Pricing for <br />
                Direct-to-Retail.
              </h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                Most founders underestimate their COGS by 15-20% by ignoring
                small items. Our auditor forces you to look at every line item.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
                  <CheckCircle2 size={18} /> Inverse Margin-to-Price
                  Calculations
                </div>
                <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
                  <CheckCircle2 size={18} /> Retailer Markup Simulator (50-200%)
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
              {[
                { label: "Standard", val: "Keystone+" },
                { label: "Accuracy", val: "Unit-Based" },
                { label: "Strategy", val: "Margin-First" },
                { label: "Validation", val: "COGS-Audit" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 font-sans">
                    {item.label}
                  </p>
                  <p className="text-2xl font-black italic tracking-tight text-white">
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Retail Strategy FAQ
            </h2>
            <p className="text-slate-500 font-medium">
              Critical pricing logic for e-commerce and physical product
              founders.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? "shadow-xl shadow-indigo-200/50 border-indigo-100" : ""}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-8 text-left"
                >
                  <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <HelpCircle size={20} className="text-indigo-400" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`text-slate-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
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

      {/* Comprehensive SEO Content Section */}
      <article className="w-full max-w-4xl mx-auto mt-24 mb-20 prose prose-slate md:prose-lg text-slate-600">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-12 mb-6">
          What is Wholesale Price?
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          At its core, wholesale price is the amount a manufacturer or
          distributor charges a business (the retailer) for products bought in
          large quantities. Unlike selling a single item to a person on the
          street, wholesale is a business-to-business (B2B) transaction.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          The primary goal of wholesale pricing is to earn a profit by selling
          at a price higher than the cost of production, while remaining low
          enough that the retailer can still add their own markup. You are
          essentially trading a higher profit-per-item for a higher volume-per-sale.
          Instead of spending your marketing budget to find 100 individual
          customers, you find one retail partner who buys 100 units at once.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-12 mb-6">
          Wholesale vs. Retail Pricing
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          Understanding the difference between wholesale pricing vs. retail
          pricing is very important for your bottom line. While they involve the
          same product, the business models are fundamentally different:
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li className="text-lg leading-relaxed">
            <strong>Wholesale Price:</strong> This is what the retailer pays you. It is
            built on the concept of economies of scale. Because the retailer is buying in bulk,
            you can afford to lower the price per unit. Your profit margins are typically smaller
            (usually between 20% and 50%), but your 'cost per sale' is much lower because you are
            processing fewer, larger orders.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Retail Price:</strong> This is the final price the end consumer pays.
            It is significantly higher because the retailer has to cover last-mile expenses,
            including store rent, sales staff, marketing, and the risk of unsold inventory.
          </li>
        </ul>
        <p className="text-lg leading-relaxed mb-6">
          The difference between these two prices is known as the retail margin.
          For example, if you sell a shirt for 20 wholesale and the retailer
          sells it for 50, that 30 gap allows the retailer to stay in business
          while bringing your product to a wider audience.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-12 mb-6">
          How to Calculate Wholesale Price
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          To figure wholesale pricing correctly, you need to follow a
          methodical, step-by-step process. Skipping even one of these steps can
          result in a price that either scares away retailers or leaves you
          losing money on every bulk order.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          1. Research Your Market
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          Before looking at your own numbers, you need to understand the
          landscape. Your price tells a story about your brand.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li className="text-lg leading-relaxed">
            <strong>Identify Your Tier:</strong> Are you a discount brand, a contemporary
            brand, or a luxury label? A budget price for a luxury product can actually hurt sales
            because it signals low quality to retailers.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Audience Expectations:</strong> If your target retailers serve
            budget-conscious customers, your price must leave room for them to offer a competitive
            retail price.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Find Your Break-Even Point:</strong> Determine the minimum price you
            can charge just to cover costs. Knowing this floor ensures you never accidentally agree
            to a deal that costs you money.
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          2. Calculate Your Production Costs (COGM)
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          This is the most important step. You must determine your Cost of Goods
          Manufactured (COGM). This represents the total investment required to
          create a single product and get it ready for sale.
        </p>
        <div className="text-lg leading-relaxed font-semibold italic bg-slate-50 p-4 border-l-4 border-indigo-500 mb-6 rounded-r-xl">
          The COGM Formula: Total Material Cost + Total Labor Cost +
          Additional/Overhead = COGM
        </div>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li className="text-lg leading-relaxed">
            <strong>Materials:</strong> Every physical component, from raw ingredients
            to the final sticker on the box.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Labor:</strong> The cost of the time spent manufacturing the product.
            Calculate the time spent per unit multiplied by the hourly wage.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Overhead:</strong> This includes rent for your production space,
            utilities, equipment depreciation, and software.
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          3. Set Your Desired Profit Margin
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          Your profit margin is the reward for your work and the capital you use
          to grow. When selling wholesale, you are moving higher volumes, which
          allows you to accept a lower margin than you would in retail.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li className="text-lg leading-relaxed">
            <strong>Standard Margins:</strong> In the wholesale world, aim for a profit
            margin between 15% and 50%.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>The Volume Trade-off:</strong> It is much more efficient to sell 500
            units to one retailer at a 20% margin than to sell 500 units to individuals at a 60%
            margin, due to lower shipping and marketing efforts per unit.
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          4. Account for Operating Expenses
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          A common mistake is forgetting that your profit must also cover the
          costs of running the business. You need to factor in all these
          expenses:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li className="text-lg leading-relaxed">
            <strong>Fixed Costs:</strong> Rent, utilities, and software subscriptions.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Variable Costs:</strong> Shipping and handling, merchant processing
            fees, and sales commissions.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Customer Acquisition:</strong> What does it cost you in ads or trade
            show fees to land one new wholesale account?
          </li>
        </ul>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-12 mb-6">
          Wholesale Pricing Methods and Formulas
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          Depending on your industry and how you want to position your brand, you will
          likely use one of these three methods.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          The Keystone Pricing Method
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          The Keystone method is the most straightforward approach used in the
          retail and apparel industries. It relies on a simple 100% markup,
          essentially doubling your cost to reach the wholesale price.
        </p>
        <div className="text-lg leading-relaxed font-semibold italic bg-slate-50 p-4 border-l-4 border-indigo-500 mb-6 rounded-r-xl">
          The Formula: Wholesale Price = Cost of Goods × 2
        </div>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          The Absorption Pricing Method
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          The Absorption method is ideal for manufacturers who want to be
          mathematically certain that every single business expense is covered.
          Instead of a flat multiplier, this method 'absorbs' all production
          costs and operating expenses before adding a specific profit dollar
          amount.
        </p>
        <div className="text-lg leading-relaxed font-semibold italic bg-slate-50 p-4 border-l-4 border-indigo-500 mb-6 rounded-r-xl">
          The Formula: Wholesale Price = (COGM + Operating Expenses) + Desired
          Profit Margin
        </div>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          The Differentiated (Demand) Pricing Method
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          Differentiated pricing is a more fluid strategy used to figure out
          wholesale pricing based on market demand or buyer behavior. Rather
          than a fixed price for everyone, you adjust the rate to incentivize
          larger orders or to capitalize on peak seasons.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-12 mb-6">
          Tips to Set Wholesale Prices
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          To finalize your pricing strategy, you need to look beyond the
          formulas and consider the long-term relationship with your retail
          partners.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-8">
          <li className="text-lg leading-relaxed">
            <strong>Set a Manufacturer’s Suggested Retail Price (MSRP):</strong> An MSRP is the price
            you recommend retailers charge the end consumer. It prevents retailers from undercutting Each
            other and devaluing your brand.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Implement a Dual Pricing Strategy:</strong> If you sell both to
            retailers and directly to customers through your own website (DTC), your website price Should
            match the MSRP you give your retailers.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Use Minimum Order Quantities (MOQs):</strong> An MOQ is the lowest
            number of units a retailer must purchase to qualify for wholesale pricing. This is a vital
            tool for protecting your time and profit.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Strategically Align with Sales Volumes:</strong> Offer a volume kicker,
            a temporary discount for orders that exceed a certain threshold, to reward high-volume
            buyers.
          </li>
          <li className="text-lg leading-relaxed">
            <strong>Conduct Regular Pricing Audits:</strong> Make it a habit to review your
            wholesale price list every quarter. Regular audits let you make small, incremental price
            adjustments.
          </li>
        </ul>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-12 mb-6">
          How to Calculate Wholesale Pricing FAQ
        </h2>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          What is the simplest formula for wholesale price?
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          The most basic calculation is: Wholesale Price = Cost of Goods + Desired
          Profit Margin. Most businesses aim for a wholesale margin between 15% and 50%.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          What is a good wholesale profit margin?
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          A healthy margin typically falls between 30% and 50%. This gives you enough
          profit to reinvest in the business while leaving the retailer enough room to add their own
          50%-60% markup.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          How does wholesale pricing differ from retail pricing?
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          Retail price is what the end user pays, while wholesale is the B2B discounted price for
          businesses. Wholesale focuses on high-volume efficiency, whereas retail pricing covers the
          high costs of individual customer acquisition and storefront overhead.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          What is the Keystone method?
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          It is a pricing strategy where you double your cost of production to reach your wholesale Price,
          and the retailer doubles that wholesale price to reach the retail price.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          Can I change my wholesale prices for different retailers?
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          Yes, this is called differentiated pricing. You can offer lower rates to retailers who buy in
          bulk or are long-term partners, as long as you maintain a consistent base price to protect Your
          brand value.
        </p>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-4">
          How do I handle shipping costs in wholesale?
        </h3>
        <p className="text-lg leading-relaxed mb-6">
          Most wholesalers use Ex Works (EXW) or Free on Board (FOB) terms, meaning the retailer pays
          for the shipping from your warehouse. However, some wholesalers offer free freight on orders
          over a certain amount to encourage larger purchases.
        </p>
      </article>

      {/* CTA Footer */}
      <section className="mt-32 max-w-7xl mx-auto px-4">
        <div className="bg-indigo-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">
              Master Your <br />
              Profit Equation.
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join elite product founders who use data-driven pricing models to
              scale their manufacturing and retain retail shelf space.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-12 py-6 bg-white text-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Simulate Your Prices{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
