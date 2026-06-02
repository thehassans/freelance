import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
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
  Layout,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function ColorContrastChecker() {
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('#3B82F6');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [suggestedColor, setSuggestedColor] = useState<string | null>(null);

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

  const calculateRatio = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return parseFloat(ratio.toFixed(2));
  };

  const audit = useMemo(() => {
    const ratio = calculateRatio(textColor, backgroundColor);

    return {
      ratio,
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3.0,
      aaaNormal: ratio >= 7.0,
      aaaLarge: ratio >= 4.5
    };
  }, [textColor, backgroundColor]);

  // Smart Suggestions Logic
  const handleSuggestColor = () => {
    // Mock logic to find a passing color by darkening/lightening foreground
    // Simple heuristic: darken if ratio < 4.5
    const rgb = hexToRgb(textColor);
    const isLightBackground = getLuminance(hexToRgb(backgroundColor).r, hexToRgb(backgroundColor).g, hexToRgb(backgroundColor).b) > 0.5;
    
    let currentTextColor = textColor;
    let ratio = audit.ratio;
    
    // Attempt to find a color in 10 steps
    for (let i = 0; i < 20; i++) {
        if (ratio >= 4.5) break;
        
        // Slightly darken or lighten towards extreme
        const stepRgb = hexToRgb(currentTextColor);
        const change = isLightBackground ? -15 : 15;
        const newR = Math.max(0, Math.min(255, stepRgb.r + change));
        const newG = Math.max(0, Math.min(255, stepRgb.g + change));
        const newB = Math.max(0, Math.min(255, stepRgb.b + change));
        
        currentTextColor = `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
        ratio = calculateRatio(currentTextColor, backgroundColor);
    }
    
    setSuggestedColor(currentTextColor);
    toast.success('Generated accessible alternative');
  };

  const swapColors = () => {
    const temp = textColor;
    setTextColor(backgroundColor);
    setBackgroundColor(temp);
    setSuggestedColor(null);
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        {/* Tool Header */}
        <div className="text-center mb-16 px-4 print:hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-emerald-100"
          >
            FREE TOOL
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            WCAG <span className="text-emerald-600">Contrast</span> Auditor
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg text-balance">
            The ultimate accessibility tool for design agencies. Verify contrast ratios and meeting global AA/AAA standards in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-6 print:hidden">
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
                             onChange={(e) => { setTextColor(e.target.value); setSuggestedColor(null); }}
                             className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold uppercase text-slate-900 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                           />
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg overflow-hidden border border-slate-200">
                              <input 
                                 type="color" 
                                 value={textColor} 
                                 onChange={(e) => { setTextColor(e.target.value); setSuggestedColor(null); }}
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
                             onChange={(e) => { setBackgroundColor(e.target.value); setSuggestedColor(null); }}
                             className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold uppercase text-slate-900 focus:outline-none focus:border-emerald-500 transition-all font-mono"
                           />
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg overflow-hidden border border-slate-200">
                              <input 
                                 type="color" 
                                 value={backgroundColor} 
                                 onChange={(e) => { setBackgroundColor(e.target.value); setSuggestedColor(null); }}
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-balance">Enterprise level color analysis system.</span>
                  </div>
               </div>
            </section>
          </div>

          {/* Audit & Preview Column */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-6">
            <section className="bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col print:shadow-none print:border-none print:rounded-none">
              <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
                 {/* Numerical Audit */}
                 <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                    <div className="text-center md:text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Contrast Ratio</p>
                       <div className="flex items-baseline justify-center md:justify-start gap-3 mb-4">
                          <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums text-slate-900">
                             {audit.ratio}
                          </span>
                          <span className="text-2xl font-black text-slate-300">: 1</span>
                       </div>

                       {/* 2. 'Smart Color Suggestion' Feature */}
                       <div className="mb-8 min-h-[60px] flex flex-col items-center md:items-start print:hidden">
                          {!audit.aaNormal && (
                            <div className="space-y-3">
                               <button 
                                 onClick={handleSuggestColor}
                                 className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                               >
                                  <Sparkles size={14} /> ✨ Suggest Accessible Colors
                               </button>
                               {suggestedColor && (
                                 <motion.div 
                                   initial={{ opacity: 0, y: 10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
                                 >
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended:</span>
                                    <button 
                                      onClick={() => { setTextColor(suggestedColor); setSuggestedColor(null); }}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-900 rounded-lg text-xs font-bold font-mono hover:border-emerald-500 border border-transparent transition-all"
                                    >
                                       <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: suggestedColor }} />
                                       {suggestedColor.toUpperCase()}
                                    </button>
                                 </motion.div>
                               )}
                            </div>
                          )}
                          {audit.aaNormal && (
                             <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <CheckCircle2 size={14} /> WCAG Passing Colors
                             </div>
                          )}
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
                 <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-50/50 print:bg-white print:p-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 text-center print:text-left print:mt-12">UI Sandbox Preview</p>
                    <div 
                      className="w-full h-full flex flex-col justify-center rounded-[2.5rem] shadow-xl p-8 transition-all duration-300 print:shadow-none print:border print:border-slate-100 print:rounded-3xl"
                      style={{ backgroundColor: backgroundColor }}
                    >
                       <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-2xl font-bold mb-2 transition-all leading-tight" style={{ color: textColor }}>
                             Heading (Large Text)
                          </h3>
                          <p className="text-sm mb-4 leading-relaxed transition-all opacity-95" style={{ color: textColor }}>
                             This is standard body text. It simulates the AA Normal contrast requirement for readability on long-form content.
                          </p>
                          <div 
                            className="w-full py-2.5 px-4 rounded-xl border border-solid font-bold text-center text-sm transition-all"
                            style={{ borderColor: textColor, color: textColor }}
                          >
                             Action Button
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </section>

            {/* Guidelines Table */}
            <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden print:bg-white print:text-slate-900 print:shadow-none print:border print:border-slate-200 print:rounded-3xl print:mt-12">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none print:hidden" />
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-2 bg-white/10 rounded-lg print:bg-slate-100">
                        <Layout size={18} className="text-emerald-400 print:text-emerald-600" />
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
                        <div key={i} className="grid grid-cols-3 gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl items-center print:bg-white print:border-slate-100">
                           <span className="text-xs font-bold text-white print:text-slate-900">{row.std}</span>
                           <span className="text-xs font-black text-emerald-400 print:text-emerald-600">{row.target}</span>
                           <span className="text-[10px] text-slate-400">{row.usage}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 4. Print-Safe CSS for PDF Generation & FAQ Section */}
        <section className="mt-24 space-y-12 print:hidden">
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

            <div className="bg-emerald-600 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 blur-3xl -ml-48 -mt-48 rounded-full" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Audit Every Single Pixel.</h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
                  Join thousands of accessibility-first designers who use our tools to verify their work and stay compliant.
                </p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-12 py-6 bg-white text-emerald-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
                >
                  Start New Audit <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
        </section>

        {/* 5. Strict Layout Isolation for SEO Content */}
        <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
          <h2>What is a Color Contrast Checker?</h2>
          <p>
            A Color Contrast Checker is a digital accessibility tool used to evaluate the contrast ratio between two colors, typically foreground (text) and background colors. It ensures that text is readable and visually accessible for all users, including people with visual impairments.
          </p>
          <p>
            This tool is widely used in web design, UI/UX development, branding, and digital marketing to create accessible and user-friendly designs that comply with accessibility standards such as WCAG (Web Content Accessibility Guidelines).
          </p>

          <h3>Why Color Contrast Matters</h3>
          <p>Color contrast plays a critical role in readability and user experience. If text does not stand out clearly against its background, users may struggle to read content, leading to poor engagement and accessibility issues.</p>
          <p>A Color Contrast Checker helps designers and developers:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Improve text readability</li>
            <li>Ensure accessibility compliance (WCAG standards)</li>
            <li>Enhance user experience</li>
            <li>Support visually impaired users</li>
            <li>Maintain professional design quality</li>
            <li>Avoid design-related usability issues</li>
          </ul>
          <p>Proper contrast ensures that content is clear and usable for everyone.</p>

          <h3>Benefits of a Color Contrast Checker</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Improved Accessibility:</strong> The tool ensures that websites and applications are accessible to users with visual impairments, including color blindness and low vision.</li>
            <li><strong>WCAG Compliance:</strong> A Color Contrast Checker helps designers meet WCAG guidelines, which are often required for professional and government websites.</li>
            <li><strong>Better User Experience:</strong> High contrast improves readability, making content easier to consume on all devices and screen types.</li>
            <li><strong>Professional Design Quality:</strong> Using proper color combinations enhances the visual appeal and trustworthiness of a brand or website.</li>
            <li><strong>Reduced Design Errors:</strong> The tool prevents common mistakes like using low-contrast color combinations that reduce readability.</li>
          </ul>

          <h3>How a Color Contrast Checker Works</h3>
          <p>A Color Contrast Checker analyzes the brightness difference between two colors using a mathematical formula to calculate a contrast ratio.</p>
          <p>It compares:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Text color (foreground)</li>
            <li>Background color</li>
          </ul>
          <p>The result is expressed as a ratio, such as 4.5:1 or 7:1, which determines how readable the text is.</p>

          <h3>WCAG Contrast Standards</h3>
          <p>To ensure accessibility, WCAG defines minimum contrast requirements:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>4.5:1 for normal text</li>
            <li>3:1 for large text</li>
            <li>7:1 for enhanced accessibility (AAA level)</li>
          </ul>
          <p>A Color Contrast Checker automatically verifies whether your color combination meets these standards.</p>

          <h3>Key Features of a Color Contrast Checker</h3>
          <p>A modern Color Contrast Checker may include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Real-time contrast ratio calculation</li>
            <li>WCAG compliance testing</li>
            <li>Accessibility pass/fail indicators</li>
            <li>Color picker integration</li>
            <li>Light and dark mode previews</li>
            <li>Suggested accessible color alternatives</li>
            <li>Preview of text in different sizes</li>
            <li>Hex, RGB, and HSL support</li>
            <li>Design system integration</li>
          </ul>

          <h3>When Should You Use a Color Contrast Checker?</h3>
          <p>This tool is useful during web development, mobile branding, and content audits. It is essential whenever visual content includes text.</p>

          <h3>Who Uses Color Contrast Checkers?</h3>
          <p>UI/UX designers, developers, graphic designers, and accessibility experts rely on these tools to create inclusive digital experiences.</p>

          <h3>Why Businesses Need It</h3>
          <p>Businesses use Color Contrast Checkers to ensure legal compliance, improve credibility, and enhance customer satisfaction.</p>

          <h3>Final Thoughts</h3>
          <p>
            A Color Contrast Checker is an essential tool for creating accessible, readable, and user-friendly designs. By ensuring proper contrast between text and background colors, it improves usability, meets accessibility standards, and enhances overall design quality.
          </p>
        </section>
      </div>
    </div>
  );
}
