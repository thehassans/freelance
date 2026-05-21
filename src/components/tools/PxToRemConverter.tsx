import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Settings, 
  HelpCircle, 
  ChevronDown, 
  Accessibility, 
  Smartphone, 
  Zap, 
  ArrowRightLeft,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function PxToRemConverter() {
  const [baseSize, setBaseSize] = useState<number | string>(16);
  const [pxValue, setPxValue] = useState<number | string>(24);
  const [remValue, setRemValue] = useState<number | string>(1.5);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const commonSizes = [8, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 64, 80, 96];

  const handlePxChange = (val: string) => {
    setPxValue(val);
    if (val === '') {
      setRemValue('');
      return;
    }
    const px = parseFloat(val);
    const base = typeof baseSize === 'string' ? parseFloat(baseSize) : baseSize;
    if (!isNaN(px) && base && base !== 0) {
      const rem = px / base;
      setRemValue(parseFloat(rem.toFixed(4)));
    }
  };

  const handleRemChange = (val: string) => {
    setRemValue(val);
    if (val === '') {
      setPxValue('');
      return;
    }
    const rem = parseFloat(val);
    const base = typeof baseSize === 'string' ? parseFloat(baseSize) : baseSize;
    if (!isNaN(rem) && base) {
      const px = rem * base;
      setPxValue(parseFloat(px.toFixed(2)));
    }
  };

  const handleBaseChange = (val: string) => {
    setBaseSize(val);
    const base = parseFloat(val);
    if (!isNaN(base) && base !== 0) {
      const px = typeof pxValue === 'string' ? parseFloat(pxValue) : pxValue;
      if (!isNaN(px)) {
        const rem = px / base;
        setRemValue(parseFloat(rem.toFixed(4)));
      }
    }
  };

  const faqs = [
    {
      question: "What is the difference between EM and REM?",
      answer: "REM (Root EM) units are always relative to the font-size of the root <html> element. EM units are relative to the font-size of their direct parent. EMs can cause compounding sizing issues (where font size gets exponentially larger or smaller as you nest elements), whereas REMs stay consistent across the entire document."
    },
    {
      question: "Why is the default base size 16px?",
      answer: "16px is the standard default text size across all major web browsers including Chrome, Safari, and Firefox. It provides a baseline for accessibility and legibility that most users are accustomed to."
    },
    {
      question: "Can I use REM for things other than font size?",
      answer: "Absolutely! You can use REM for padding, margins, widths, and heights. Using REM for your entire layout ensures that when a user changes their browser's default font size, the entire UI scales proportionally, maintaining visual harmony."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-sky-100"
        >
          <Zap size={12} /> Pro Developer Tool
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          PX to <span className="text-sky-600">REM</span> Converter
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
          The precision-engineered bidirectional calculator for responsive design and accessible typography.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Input & Table Column */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Type size={120} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Base Size */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1 flex items-center gap-2">
                  <Settings size={12} /> Base Size (PX)
                </label>
                <input 
                  type="number"
                  value={baseSize}
                  onChange={(e) => handleBaseChange(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-sky-500 font-bold text-slate-900 transition-all"
                  placeholder="16"
                />
              </div>

              {/* PX Input */}
              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1 flex items-center gap-2">
                   Pixels (PX)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={pxValue}
                    onChange={(e) => handlePxChange(e.target.value)}
                    className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-sky-500 font-bold text-slate-900 shadow-sm transition-all"
                    placeholder="24"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[10px] uppercase tracking-widest pointer-events-none">PX</span>
                </div>
              </div>

              {/* REM Input */}
              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1 flex items-center gap-2">
                   Relative (REM)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={remValue}
                    onChange={(e) => handleRemChange(e.target.value)}
                    className="w-full px-6 py-5 bg-sky-50 border border-sky-100 rounded-2xl focus:outline-none focus:border-sky-500 font-bold text-sky-900 transition-all font-mono"
                    placeholder="1.5"
                    step="0.01"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sky-300 font-black text-[10px] uppercase tracking-widest pointer-events-none">REM</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center gap-6 justify-between">
               <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ArrowRightLeft size={16} />
                  </div>
                  Bi-directional calculation active
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Formula: {pxValue || 'px'} / {baseSize || 'base'} = {remValue || 'rem'}
               </div>
            </div>
          </section>

          {/* Reference Table */}
          <section className="bg-slate-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/10 blur-3xl -ml-32 -mt-32 rounded-full" />
             <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tight mb-8">Dynamic Reference Grid</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                   {commonSizes.map((px) => {
                     const base = typeof baseSize === 'string' ? parseFloat(baseSize) : baseSize;
                     const rem = !isNaN(base) && base !== 0 ? (px / base).toFixed(3) : 0;
                     return (
                       <button 
                         key={px}
                         onClick={() => {
                           setPxValue(px);
                           handlePxChange(px.toString());
                         }}
                         className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all text-center group"
                       >
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-sky-400 transition-colors">{px}PX</p>
                         <p className="text-lg font-mono font-black text-white">{rem}<span className="text-[10px] ml-0.5 opacity-40 uppercase">rem</span></p>
                       </button>
                     );
                   })}
                </div>
                <p className="mt-8 text-[10px] text-slate-500 font-medium italic">
                  * Table based on current Base Size of {baseSize}px. Click any tile to load it into the calculator.
                </p>
             </div>
          </section>
        </div>

        {/* Visual Preview Column */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 mb-6 flex items-center gap-2">
              <Accessibility size={20} className="text-sky-500" /> Live Text Preview
            </h3>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 min-h-[200px] flex items-center justify-center overflow-hidden">
               <p 
                 className="text-slate-900 leading-tight transition-all duration-300 transform-gpu"
                 style={{ fontSize: remValue ? `${remValue}rem` : '1rem' }}
               >
                 The quick brown fox jumps over the lazy dog.
               </p>
            </div>
            <div className="mt-6 space-y-3">
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Current Size</span>
                  <span className="text-sky-600">{pxValue}px / {remValue}rem</span>
               </div>
               <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100/50">
                  <p className="text-[10px] text-sky-700 font-medium leading-relaxed">
                    This sample scales based on your REM input. If your root font-size was {baseSize}px, this is exactly how large the text would appear in a browser.
                  </p>
               </div>
            </div>
          </section>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Math Explanation */}
        <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">How to Calculate PX to REM</h2>
           <div className="bg-white border border-slate-200 p-10 md:p-16 rounded-[3rem] shadow-sm text-start relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Info size={40} className="text-sky-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Transitioning from static Pixel (PX) values to Relative EM (REM) units is a fundamental step in modern, professional frontend development. 
                    The formula is straightforward but powerful:
                 </p>
                 <div className="my-12 p-8 bg-slate-900 text-white rounded-3xl font-mono text-xl md:text-2xl text-center shadow-xl">
                    Target PX ÷ Base Size = REM
                 </div>
                 <p>
                    For example, if your base size is <strong>16px</strong> (the browser default) and your mockups show a font size of <strong>24px</strong>, 
                    the calculation would be 24 ÷ 16 = <strong>1.5rem</strong>.
                 </p>
                 <p>
                    Using this converter ensures you don't have to break your flow doing head-math, allowing you to build pixel-perfect interfaces that scale natively.
                 </p>
              </div>
           </div>
        </div>

        {/* Advantages Grid */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Why Use REM Instead of PX?</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Standardize your design system logic.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-200 hover:shadow-2xl hover:shadow-sky-500/5 transition-all"
              >
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Accessibility size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4">Accessibility (A11y)</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">
                    REM units respect the user's browser font-size settings. When a visually impaired user increases their default browser font size from 16px to 24px, your entire UI scales up natively. Hard-coded PX values ignore these settings, potentially making your site unusable for many.
                 </p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-200 hover:shadow-2xl hover:shadow-sky-500/5 transition-all"
              >
                 <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Smartphone size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4">Responsive Design</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">
                    By using REMs, you can scale your entire website's typography up or down across mobile and desktop simply by changing the root font size in a single media query. This "Master Switch" approach is much more efficient than updating hundreds of individual PX values.
                 </p>
              </motion.div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Typography Best Practices</h2>
              <p className="text-slate-500 font-medium">Expert answers for technical designers.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-sky-200/50 border-sky-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-sky-400" />
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
      <section className="mt-32 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-3xl -mr-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Standardize Your <br/>Frontend Workflow</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
              Start using REM units today to build more accessible, scalable, and professional web applications.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-sky-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-sky-500 hover:scale-105 transition-all shadow-2xl shadow-sky-600/20"
            >
              Back to Calculator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
