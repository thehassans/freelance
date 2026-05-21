import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Type, 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  ShieldCheck,
  ArrowRightLeft,
  Info,
  Layout
} from 'lucide-react';

export default function ColorContrastChecker() {
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('#3B82F6');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // WCAG 2.1 Contrast Logic
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const audit = useMemo(() => {
    const rgb1 = hexToRgb(textColor);
    const rgb2 = hexToRgb(backgroundColor);
    
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const roundedRatio = parseFloat(ratio.toFixed(2));

    return {
      ratio: roundedRatio,
      aaNormal: roundedRatio >= 4.5,
      aaLarge: roundedRatio >= 3.0,
      aaaNormal: roundedRatio >= 7.0,
      aaaLarge: roundedRatio >= 4.5
    };
  }, [textColor, backgroundColor]);

  const swapColors = () => {
    const temp = textColor;
    setTextColor(backgroundColor);
    setBackgroundColor(temp);
  };

  const faqs = [
    {
      question: "What is the difference between AA and AAA compliance?",
      answer: "AA is the industry legal standard for most web accessibility laws worldwide (like ADA or EAA). It requires a 4.5:1 ratio for normal text. AAA is the highest 'gold standard' of accessibility, requiring a 7.0:1 ratio. While AAA is great for readability, it can significantly limit design palettes."
    },
    {
      question: "What is considered 'Large Text' in WCAG?",
      answer: "WCAG defines large text as text that is at least 18pt (roughly 24px) or 14pt (roughly 18.5px) if it is bold. Large text has lower contrast requirements because the increased weight and size make it inherently easier to read."
    },
    {
      question: "How is the contrast ratio calculated?",
      answer: "The ratio is calculated using relative luminance. Luminance is a measure of the light intensity of a color, weighted by how the human eye perceives different wavelengths. The formula is (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter of the two colors."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-emerald-100"
        >
          <ShieldCheck size={12} /> WCAG 2.1 Compliance Auditor
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Color <span className="text-emerald-600">Contrast</span> Checker
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          The ultimate accessibility tool for design agencies. Verify contrast ratios and meeting global AA/AAA standards in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                   <Palette size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Color Palette</h3>
             </div>

             <div className="space-y-8 relative">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Foreground (Text)</label>
                   <div className="flex gap-3">
                      <div className="relative flex-1">
                         <input 
                           type="text" 
                           value={textColor} 
                           onChange={(e) => setTextColor(e.target.value)}
                           className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold uppercase text-slate-900 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                         />
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg overflow-hidden border border-slate-200">
                            <input 
                               type="color" 
                               value={textColor} 
                               onChange={(e) => setTextColor(e.target.value)}
                               className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150"
                            />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex justify-center -my-4 relative z-10">
                   <button 
                     onClick={swapColors}
                     className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-slate-400 hover:text-emerald-500 hover:scale-110 transition-all group"
                     title="Swap Colors"
                   >
                      <ArrowRightLeft size={18} className="rotate-90 group-hover:rotate-[270deg] transition-transform duration-500" />
                   </button>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Background</label>
                   <div className="flex gap-3">
                      <div className="relative flex-1">
                         <input 
                           type="text" 
                           value={backgroundColor} 
                           onChange={(e) => setBackgroundColor(e.target.value)}
                           className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold uppercase text-slate-900 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                         />
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg overflow-hidden border border-slate-200">
                            <input 
                               type="color" 
                               value={backgroundColor} 
                               onChange={(e) => setBackgroundColor(e.target.value)}
                               className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150"
                            />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-balance">The auditor updates automatically as you adjust colors.</span>
                </div>
             </div>
          </section>
        </div>

        {/* Audit & Preview Column */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          <section className="bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2">
               {/* Numerical Audit */}
               <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                  <div className="text-center md:text-left">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Contrast Ratio</p>
                     <div className="flex items-baseline justify-center md:justify-start gap-3 mb-8">
                        <span className="text-7xl md:text-8xl font-black font-display tracking-tighter tabular-nums text-slate-900">
                           {audit.ratio}
                        </span>
                        <span className="text-2xl font-black text-slate-300">: 1</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3">
                        {[
                           { label: 'AA Normal', pass: audit.aaNormal },
                           { label: 'AA Large', pass: audit.aaLarge },
                           { label: 'AAA Normal', pass: audit.aaaNormal },
                           { label: 'AAA Large', pass: audit.aaaLarge },
                        ].map((item, i) => (
                           <div 
                             key={i} 
                             className={`flex items-center justify-between px-4 py-3 rounded-xl border ${item.pass ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}
                           >
                              <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
                              {item.pass ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Live Preview UI */}
               <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-50/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 text-center">Contextual Preview</p>
                  <div 
                    className="w-full aspect-[4/3] rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col p-8 transition-all duration-300"
                    style={{ backgroundColor: backgroundColor }}
                  >
                     <div className="flex-1 flex flex-col justify-center">
                        <p className="font-black text-xl mb-3" style={{ color: textColor }}>Enterprise Design</p>
                        <p className="text-sm font-medium leading-relaxed opacity-90" style={{ color: textColor }}>
                           This is a sample of how your selected typography will appear against the background context. Accessible design ensures everyone can consume your message clearly.
                        </p>
                     </div>
                     <button 
                       className="w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                       style={{ backgroundColor: textColor, color: backgroundColor }}
                     >
                        Contextual CTA
                     </button>
                  </div>
               </div>
            </div>
          </section>

          {/* Guidelines Table */}
          <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-2 bg-white/10 rounded-lg">
                      <Layout size={18} className="text-emerald-400" />
                   </div>
                   <h4 className="text-sm font-black uppercase tracking-tight">WCAG 2.1 Checkpoints</h4>
                </div>
                <div className="space-y-4">
                   <div className="grid grid-cols-3 gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">
                      <span>Standard</span>
                      <span>Target</span>
                      <span>Usage</span>
                   </div>
                   {[
                      { std: 'AA Normal', target: '4.5:1', usage: 'Body text (16px and below)' },
                      { std: 'AA Large', target: '3.0:1', usage: 'Headings / Interactive UI' },
                      { std: 'AAA Normal', target: '7.0:1', usage: 'Maximum legibility' },
                      { std: 'AAA Large', target: '4.5:1', usage: 'High contrast display' },
                   ].map((row, i) => (
                      <div key={i} className="grid grid-cols-3 gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl items-center">
                         <span className="text-xs font-bold text-white">{row.std}</span>
                         <span className="text-xs font-black text-emerald-400">{row.target}</span>
                         <span className="text-[10px] text-slate-400">{row.usage}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Protect your brand from accessibility pitfalls.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={40} className="text-emerald-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Failing to meet WCAG 2.1 color contrast standards isn't just bad design—it can lead to legal penalties, accessibility lawsuits, and severe SEO drop-offs. Search engines prioritize websites that are inclusive and readable for all users.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 font-sans">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Eye size={14} className="text-emerald-600" /> Visual Inclusion
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Over 2 billion people worldwide live with a vision impairment. Correct contrast ensures your content is perceivable for everyone.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Type size={14} className="text-blue-600" /> Typography Audit
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Don't just audit background colors. We analyze how foreground text weights interact with backdrop tones to ensure absolute clarity.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Big Info Section */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 blur-3xl -ml-48 -mt-48 rounded-full" />
              <div className="w-full md:w-1/2 space-y-8 relative z-10">
                 <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                    <ShieldCheck size={32} />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-balance">
                    Compliant by <br/>Engineering Design.
                 </h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed">
                    Accessibility is not a feature; it is a fundamental requirement of the modern web. Our auditor helps you stay compliant with ADA, Section 508, and EU accessibility mandates.
                 </p>
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
                       <CheckCircle2 size={18} /> Verified WCAG 2.1 Formulas
                    </div>
                    <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
                       <CheckCircle2 size={18} /> Instant Pass/Fail Feedback
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                 {[
                   { label: 'Standard', val: 'WCAG 2.1' },
                   { label: 'Pass Ratio', val: '4.5:1' },
                   { label: 'Max Goal', val: '7.0:1' },
                   { label: 'Status', val: 'Real-time' },
                 ].map((item, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{item.label}</p>
                      <p className="text-2xl font-black italic tracking-tight text-white">{item.val}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Accessibility Strategy FAQ</h2>
              <p className="text-slate-500 font-medium">Critical knowledge for inclusive digital design.</p>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-emerald-200/50 border-emerald-100' : ''}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <HelpCircle size={20} className="text-emerald-400" />
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
        <div className="bg-emerald-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Audit Every <br/>Single Pixel.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of accessibility-first designers who use our tools to verify their work and stay compliant.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-emerald-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Start Your Audit <Palette size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
