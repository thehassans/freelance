import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hash, 
  DollarSign, 
  Eye, 
  TrendingUp, 
  MousePointer2, 
  Target, 
  ShoppingCart, 
  BarChart3, 
  Percent,
  Calculator,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';

export default function CPMCalculator() {
  // Primary Variables (Omni-Directional)
  const [cost, setCost] = useState<string>('5000');
  const [impressions, setImpressions] = useState<string>('1000000');
  const [cpm, setCpm] = useState<string>('5');
  
  // Performance Estimates
  const [ctr, setCtr] = useState<string>('1.5');
  const [conversionRate, setConversionRate] = useState<string>('2.5');
  const [aov, setAov] = useState<string>('75');

  // Logic Helpers
  const [lastPrimaryChanged, setLastPrimaryChanged] = useState<'cost' | 'impressions' | 'cpm'>('cost');
  const [solvedVariable, setSolvedVariable] = useState<'cost' | 'impressions' | 'cpm' | null>(null);

  // Math Engine
  useEffect(() => {
    const c = parseFloat(cost) || 0;
    const i = parseFloat(impressions) || 0;
    const m = parseFloat(cpm) || 0;

    // Detect which variable to solve for based on what was NOT last changed
    if (lastPrimaryChanged === 'cost') {
      if (i > 0) {
        const solvedCPM = (c / i) * 1000;
        setCpm(solvedCPM.toFixed(2));
        setSolvedVariable('cpm');
      }
    } else if (lastPrimaryChanged === 'cpm') {
      if (i > 0) {
        const solvedCost = (m * i) / 1000;
        setCost(solvedCost.toFixed(2));
        setSolvedVariable('cost');
      }
    } else if (lastPrimaryChanged === 'impressions') {
      if (m > 0) {
        const solvedCost = (m * i) / 1000;
        setCost(solvedCost.toFixed(2));
        setSolvedVariable('cost');
      } else if (c > 0) {
        const solvedCPM = (c / i) * 1000;
        setCpm(solvedCPM.toFixed(2));
        setSolvedVariable('cpm');
      }
    }
  }, [cost, impressions, cpm, lastPrimaryChanged]);

  // Derived Metrics
  const numCost = parseFloat(cost) || 0;
  const numImpressions = parseFloat(impressions) || 0;
  const numCtr = parseFloat(ctr) || 0;
  const numConvRate = parseFloat(conversionRate) || 0;
  const numAov = parseFloat(aov) || 0;

  const totalClicks = numImpressions * (numCtr / 100);
  const cpc = totalClicks > 0 ? numCost / totalClicks : 0;
  const totalConversions = totalClicks * (numConvRate / 100);
  const totalRevenue = totalConversions * numAov;
  const roas = numCost > 0 ? totalRevenue / numCost : 0;

  const handlePrimaryChange = (field: 'cost' | 'impressions' | 'cpm', val: string) => {
    setLastPrimaryChanged(field);
    if (field === 'cost') setCost(val);
    if (field === 'impressions') setImpressions(val);
    if (field === 'cpm') setCpm(val);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 py-12 mb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 border border-blue-100">
                <BarChart3 size={12} /> Media Buying Intelligence
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3 text-balance">
                CPM <span className="text-slate-400 font-light">Forecast</span> Engine
              </h1>
              <p className="text-slate-500 font-medium text-lg max-w-xl">
                Advanced performance forecasting for modern advertisers. Auto-solve for reach and calculate your path to ROAS profitably.
              </p>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-xs pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Solver Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Enterprise Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          
          {/* Left Panel: Inputs */}
          <div className="w-full lg:w-5/12 space-y-6">
            {/* Campaign Basics Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Target size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Campaign Basics</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2 px-1">Total Ad Spend ($)</label>
                  <div className={`relative transition-all duration-300 rounded-2xl border ${solvedVariable === 'cost' ? 'border-blue-500 ring-4 ring-blue-50 bg-blue-100/5' : 'border-slate-200 focus-within:border-slate-400'}`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                    <input 
                      type="number"
                      id="cost-input"
                      value={cost}
                      onChange={(e) => handlePrimaryChange('cost', e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-6 py-4 bg-transparent font-bold text-xl text-slate-900 outline-none placeholder:text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2 px-1">Total Impressions</label>
                  <div className={`relative transition-all duration-300 rounded-2xl border ${solvedVariable === 'impressions' ? 'border-blue-500 ring-4 ring-blue-50 bg-blue-100/5' : 'border-slate-200 focus-within:border-slate-400'}`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      <Eye size={16} />
                    </div>
                    <input 
                      type="number"
                      id="impressions-input"
                      value={impressions}
                      onChange={(e) => handlePrimaryChange('impressions', e.target.value)}
                      placeholder="1,000,000"
                      className="w-full pl-12 pr-6 py-4 bg-transparent font-bold text-xl text-slate-900 outline-none placeholder:text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2 px-1">CPM (Cost Per Mille)</label>
                  <div className={`relative transition-all duration-300 rounded-2xl border ${solvedVariable === 'cpm' ? 'border-blue-500 ring-4 ring-blue-50 bg-blue-100/5' : 'border-slate-200 focus-within:border-slate-400'}`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                    <input 
                      type="number"
                      id="cpm-input"
                      value={cpm}
                      onChange={(e) => handlePrimaryChange('cpm', e.target.value)}
                      placeholder="5.00"
                      className="w-full pl-10 pr-6 py-4 bg-transparent font-bold text-xl text-slate-900 outline-none placeholder:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Estimates Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Performance Estimates</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2 px-1">Click-Through Rate (%)</label>
                  <div className="relative rounded-2xl border border-slate-200 focus-within:border-slate-400 transition-colors">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</div>
                    <input 
                      type="number"
                      id="ctr-input"
                      value={ctr}
                      onChange={(e) => setCtr(e.target.value)}
                      className="w-full px-6 py-4 bg-transparent font-bold text-xl text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2 px-1">Conversion Rate (%)</label>
                  <div className="relative rounded-2xl border border-slate-200 focus-within:border-slate-400 transition-colors">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</div>
                    <input 
                      type="number"
                      id="conversion-rate-input"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(e.target.value)}
                      className="w-full px-6 py-4 bg-transparent font-bold text-xl text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2 px-1">Average Order Value (AOV)</label>
                  <div className="relative rounded-2xl border border-slate-200 focus-within:border-slate-400 transition-colors">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                    <input 
                      type="number"
                      id="aov-input"
                      value={aov}
                      onChange={(e) => setAov(e.target.value)}
                      className="w-full pl-10 pr-6 py-4 bg-transparent font-bold text-xl text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Results Dashboard */}
          <div className="w-full lg:w-7/12">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 h-full text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Analysis Output</h3>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400">v4.0 PRO ENGINE</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Revenue Card (Green) */}
                  <div id="revenue-projection-card" className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem]">
                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">
                      <DollarSign size={12} /> Projected Revenue
                    </div>
                    <div className="text-4xl font-black tracking-tight mb-2">
                      ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-emerald-400/60 font-medium">Potential campaign value</div>
                  </div>

                  {/* ROAS Card (Green) */}
                  <div id="roas-forecast-card" className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem]">
                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">
                      <TrendingUp size={12} /> Forecasted ROAS
                    </div>
                    <div className="text-4xl font-black tracking-tight mb-2">
                      {roas.toFixed(2)}x
                    </div>
                    <div className="text-xs text-emerald-400/60 font-medium">Return on ad spend</div>
                  </div>

                  {/* Clicks Card (Blue) */}
                  <div id="clicks-estimate-card" className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-[2rem]">
                    <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">
                      <MousePointer2 size={12} /> Total Clicks
                    </div>
                    <div className="text-4xl font-black tracking-tight mb-2">
                      {totalClicks.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-400/60 font-medium">Estimated traffic flow</div>
                  </div>

                  {/* CPC Card (Blue) */}
                  <div id="cpc-estimate-card" className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-[2rem]">
                    <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">
                      <DollarSign size={12} /> Est. CPC
                    </div>
                    <div className="text-4xl font-black tracking-tight mb-2">
                      ${cpc.toFixed(2)}
                    </div>
                    <div className="text-xs text-blue-400/60 font-medium">Cost per individual click</div>
                  </div>
                </div>

                {/* Main Conversion Metric */}
                <div id="conversion-summary-panel" className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem]">
                   <div className="flex items-center justify-between gap-8">
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                          <ShoppingCart size={12} /> conversions
                        </div>
                        <div className="text-6xl font-black tracking-tighter">
                          {totalConversions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                          Predicted acquisitions based on <span className="text-white">{numConvRate}%</span> conversion rate.
                        </div>
                      </div>
                      <div className="hidden sm:block">
                         <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-blue-500 flex items-center justify-center">
                            <span className="text-lg font-black">{numConvRate}%</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-12 flex items-center gap-6 justify-center">
                   <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Multi-Layer Calc
                   </div>
                   <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Revenue Projected
                   </div>
                   <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Solver Priority
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Details & Layout Integration (Bottom Area) */}
        <section id="cpm-seo-guide" className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none">
          <div className="space-y-12 text-slate-600">
            <header className="mb-16">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-md mb-6 border border-slate-200">
                <Info size={10} /> Authority Guide
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight !my-0">
                What is CPM?
              </h2>
            </header>

            <div className="grid grid-cols-1 gap-8 text-lg leading-relaxed">
              <p>
                <strong>CPM</strong>, also known as <strong>Cost Per Mille</strong>, is a digital advertising metric used to measure the cost of showing an advertisement to 1,000 users. Businesses and marketers use CPM to understand how efficiently their ads are reaching potential customers and increasing brand visibility.
              </p>
              <p>
                In simple terms, CPM helps advertisers evaluate how much they are paying for exposure and impressions rather than clicks or direct sales.
              </p>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mt-16">Why CPM Matters in Digital Marketing</h3>
            <p>
              CPM campaigns are commonly used for brand awareness and audience reach. Since the objective is visibility, CPM advertising is ideal for businesses that want to introduce their products, services, or brand to a larger audience. 
              With the right strategy, CPM advertising can help companies:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 list-none p-0">
              <li className="flex items-center gap-3 font-bold text-slate-900"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Build stronger brand recognition</li>
              <li className="flex items-center gap-3 font-bold text-slate-900"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Reach targeted audiences at scale</li>
              <li className="flex items-center gap-3 font-bold text-slate-900"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Improve remarketing opportunities</li>
              <li className="flex items-center gap-3 font-bold text-slate-900"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Increase customer familiarity and trust</li>
              <li className="flex items-center gap-3 font-bold text-slate-900"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Support long-term conversion strategies</li>
            </ul>

            <h3 className="text-3xl font-black text-slate-900 mt-20 pt-12 border-t border-slate-100">Benefits of CPM Advertising</h3>
            
            <h4 className="text-xl font-bold text-slate-900 mb-4">Increased Brand Awareness</h4>
            <p>
              CPM campaigns are designed to maximize visibility. Your ads appear in front of a large number of users, helping your business stay recognizable and memorable across digital platforms. 
              Whether you’re launching a new product or entering a new market, CPM advertising can help your brand gain exposure quickly.
            </p>

            <h4 className="text-xl font-bold text-slate-900 mb-4">Cost-Effective Marketing</h4>
            <p>
              One of the biggest advantages of CPM advertising is budget control. Advertisers can set spending limits based on the number of impressions they want to achieve. 
              This makes CPM an effective option for businesses looking to generate awareness without paying for every click or conversion.
            </p>

            <h4 className="text-xl font-bold text-slate-900 mb-4">Better Retargeting Opportunities</h4>
            <p>
              Even if users do not immediately purchase after seeing your ad, CPM campaigns help introduce your brand to potential customers. 
              Once visitors interact with your website or social platforms, you can retarget them later with more personalized campaigns through platforms like Facebook, Instagram, or Google Ads. 
              This repeated exposure increases the likelihood of future conversions.
            </p>

            <div className="bg-slate-100 rounded-3xl p-10 mt-16">
              <h3 className="text-2xl font-black text-slate-900 !mt-0">How to Calculate CPM</h3>
              <p>The CPM formula is simple:</p>
              <code className="block bg-white p-6 rounded-2xl text-xl font-mono text-blue-600 border border-slate-200 mb-6">
                CPM = (Total Campaign Cost / Total Impressions) × 1000
              </code>
              <p>To calculate CPM, you need:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Total advertising cost</li>
                <li>Total number of impressions</li>
              </ul>
              <p>Divide the campaign cost by impressions, then multiply the result by 1,000.</p>
            </div>

            <div className="border-l-4 border-slate-900 pl-8 my-16 py-4 italic text-xl">
              <h4 className="font-black not-italic text-sm uppercase tracking-widest text-slate-400 mb-4">CPM Example</h4>
              <p className="text-slate-900 font-medium leading-relaxed">
                Suppose a business spends $3,000 on an advertising campaign that generates 1,500,000 impressions.
                The calculation would be:
              </p>
              <p className="font-mono text-slate-900 mt-4 bg-slate-100 inline-block px-4 py-2 rounded-lg">
                CPM = (3000 / 1500000) × 1000 = 2
              </p>
              <p className="text-slate-600 text-sm mt-4 not-italic">
                In this example, the CPM is $2, meaning the advertiser pays $2 for every 1,000 impressions.
              </p>
            </div>

            <h3 className="text-2xl font-black text-slate-900">When Should You Use CPM?</h3>
            <p>CPM marketing works best when your goal is:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
              <li className="flex items-center gap-3"><ChevronRight size={16} className="text-blue-500" /> Brand awareness</li>
              <li className="flex items-center gap-3"><ChevronRight size={16} className="text-blue-500" /> Product launches</li>
              <li className="flex items-center gap-3"><ChevronRight size={16} className="text-blue-500" /> Audience expansion</li>
              <li className="flex items-center gap-3"><ChevronRight size={16} className="text-blue-500" /> Social media visibility</li>
              <li className="flex items-center gap-3"><ChevronRight size={16} className="text-blue-500" /> Display advertising campaigns</li>
            </ul>
            <p>Businesses often use CPM campaigns at the top of the marketing funnel to attract attention before focusing on conversions.</p>

            <h3 className="text-3xl font-black text-slate-900 mt-20">CPM vs CPC vs CPA</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="bg-white border border-slate-200 p-8 rounded-3xl">
                <h4 className="text-lg font-black text-slate-900 mb-2">CPM (Cost Per Mille)</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">You pay for every 1,000 ad impressions.</p>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Best for: Brand awareness and visibility.</p>
              </div>

              <div className="bg-white border border-slate-200 p-8 rounded-3xl">
                <h4 className="text-lg font-black text-slate-900 mb-2">CPC (Cost Per Click)</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">You pay only when someone clicks your advertisement.</p>
                <div className="text-[10px] font-mono bg-slate-50 p-2 rounded mb-4">CPC = Total Campaign Cost / Total Clicks</div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Best for: Website traffic and lead generation.</p>
              </div>

              <div className="bg-white border border-slate-200 p-8 rounded-3xl">
                <h4 className="text-lg font-black text-slate-900 mb-2">CPA (Cost Per Action)</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">You pay only when a user completes a specific action like purchasing, filling a form, or signing up.</p>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Best for: Conversion-focused campaigns.</p>
              </div>
            </div>

            <div className="mt-24 text-center border-t border-slate-100 pt-16">
              <h3 className="text-3xl font-black text-slate-900">Final Thoughts</h3>
              <p className="max-w-3xl mx-auto text-xl">
                CPM advertising remains one of the most effective ways to increase online visibility and strengthen brand recognition. While it may not directly guarantee sales, it plays an important role in building audience awareness and supporting long-term marketing success. 
                When combined with retargeting and conversion campaigns, CPM can become a powerful part of a complete digital marketing strategy.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Utility */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Calculator className="text-slate-400" size={24} />
            <h5 className="font-black text-slate-900 uppercase tracking-[0.3em] text-xs">CPM Analysis Tool v4.0</h5>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Professional media buying suite for campaign forecasting and performance auditing.
          </p>
        </div>
      </footer>
    </div>
  );
}
