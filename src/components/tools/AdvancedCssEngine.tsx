import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Box, 
  Layers, 
  Sun, 
  Moon, 
  Copy, 
  CheckCircle2, 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  RefreshCw,
  Palette,
  LayoutDashboard,
  Maximize2,
  Code
} from 'lucide-react';

type Mode = 'smooth' | 'glassmorphism' | 'neumorphism';

export default function AdvancedCssEngine() {
  const [activeMode, setActiveMode] = useState<Mode>('glassmorphism');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Glassmorphism State
  const [glassBlur, setGlassBlur] = useState(12);
  const [glassTransparency, setGlassTransparency] = useState(0.2);
  const [glassColor, setGlassColor] = useState('#ffffff');
  const [glassOutline, setGlassOutline] = useState(true);

  // Smooth Shadows State
  const [elevation, setElevation] = useState(5);
  const [shadowColor, setShadowColor] = useState('0, 0, 0');

  // Neumorphism State
  const [baseColor, setBaseColor] = useState('#e0e5ec');
  const [distance, setDistance] = useState(10);
  const [intensity, setIntensity] = useState(0.15);
  const [neumorphBlur, setNeumorphBlur] = useState(20);
  const [shape, setShape] = useState<'flat' | 'pressed'>('flat');

  // Helper: Hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  // Helper: Adjust color brightness for Neumorphism
  const adjustColor = (hex: string, amt: number) => {
    let { r, g, b } = hexToRgb(hex);
    r = Math.max(0, Math.min(255, r + amt));
    g = Math.max(0, Math.min(255, g + amt));
    b = Math.max(0, Math.min(255, b + amt));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const styleData = useMemo(() => {
    if (activeMode === 'glassmorphism') {
      const { r, g, b } = hexToRgb(glassColor);
      const background = `rgba(${r}, ${g}, ${b}, ${glassTransparency})`;
      const backdropFilter = `blur(${glassBlur}px)`;
      const border = glassOutline ? `1px solid rgba(255, 255, 255, ${glassTransparency + 0.1})` : 'none';
      
      const css = `background: ${background};\nbackdrop-filter: ${backdropFilter};\n-webkit-backdrop-filter: ${backdropFilter};\nborder: ${border};\nborder-radius: 2.5rem;`;
      
      return { 
        preview: { background, backdropFilter, WebkitBackdropFilter: backdropFilter, border, borderRadius: '2.5rem' },
        css 
      };
    }

    if (activeMode === 'smooth') {
      // Exponential shadow layering
      const steps = elevation;
      const layers = [];
      for (let i = 1; i <= 5; i++) {
        const dist = Math.pow(i, 2) * (steps / 5);
        const blur = Math.pow(i, 2.2) * (steps / 4);
        const opacity = (0.15 / i).toFixed(2);
        layers.push(`${dist}px ${dist}px ${blur}px rgba(${shadowColor}, ${opacity})`);
      }
      const boxShadow = layers.join(', ');
      const background = '#ffffff';
      const css = `box-shadow: ${boxShadow};\nbackground: ${background};\nborder-radius: 2.5rem;`;
      
      return { 
        preview: { boxShadow, background, borderRadius: '2.5rem' },
        css
      };
    }

    if (activeMode === 'neumorphism') {
      const lightColor = adjustColor(baseColor, 40);
      const darkColor = adjustColor(baseColor, -20);
      const shadowDist = distance;
      const blurVal = neumorphBlur;
      
      let boxShadow = '';
      if (shape === 'flat') {
        boxShadow = `${shadowDist}px ${shadowDist}px ${blurVal}px ${darkColor}, -${shadowDist}px -${shadowDist}px ${blurVal}px ${lightColor}`;
      } else {
        boxShadow = `inset ${shadowDist}px ${shadowDist}px ${blurVal}px ${darkColor}, inset -${shadowDist}px -${shadowDist}px ${blurVal}px ${lightColor}`;
      }
      
      const css = `background: ${baseColor};\nbox-shadow: ${boxShadow};\nborder-radius: 2.5rem;`;
      
      return {
        preview: { background: baseColor, boxShadow, borderRadius: '2.5rem' },
        css
      };
    }

    return { preview: {}, css: '' };
  }, [activeMode, glassBlur, glassTransparency, glassColor, glassOutline, elevation, shadowColor, baseColor, distance, intensity, neumorphBlur, shape]);

  const handleCopy = () => {
    navigator.clipboard.writeText(styleData.css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: "What is Glassmorphism?",
      answer: "Glassmorphism is a UI design trend that uses backdrop-filter: blur to create a frosted glass effect. It allows the background content to bleed through in a blurry, elegant way, creating hierarchy and depth in modern web interfaces."
    },
    {
      question: "Why use layered smooth shadows?",
      answer: "A single CSS box-shadow often looks harsh and artificial because it doesn't mimic how light actually falls off in the physical world. Layering 4-6 shadows with decreasing opacity and increasing blur creates a 'smooth' gradient effect that provides natural depth, often seen in premium designs from Stripe or Apple."
    },
    {
      question: "Is backdrop-filter supported on all browsers?",
      answer: "Modern browsers (Chrome, Safari, Edge, Firefox) have excellent support for backdrop-filter. However, it requires the -webkit prefix for Safari. It is always good practice to provide a slightly more opaque background-color as a fallback for very old browsers."
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
          <Palette size={12} /> Design System Accelerator
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 text-balance">
          Advanced <span className="text-indigo-600">CSS Effects</span> Engine
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Generate production-ready CSS for premium Glassmorphism, smooth multi-layered shadows, and Neumorphic components.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-slate-200/50">
          {(['glassmorphism', 'smooth', 'neumorphism'] as Mode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeMode === mode 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Box size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Parameters</h3>
            </div>

            <div className="space-y-8">
              {activeMode === 'glassmorphism' && (
                <>
                  <div>
                    <div className="flex justify-between mb-3 px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Blur ({glassBlur}px)</label>
                    </div>
                    <input type="range" min="0" max="40" value={glassBlur} onChange={(e) => setGlassBlur(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-3 px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transparency ({Math.round(glassTransparency * 100)}%)</label>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" value={glassTransparency} onChange={(e) => setGlassTransparency(parseFloat(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Color</label>
                      <input type="color" value={glassColor} onChange={(e) => setGlassColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-200 p-1" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Outline</label>
                      <button onClick={() => setGlassOutline(!glassOutline)} className={`w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${glassOutline ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {glassOutline ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeMode === 'smooth' && (
                <>
                  <div>
                    <div className="flex justify-between mb-3 px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elevation ({elevation})</label>
                    </div>
                    <input type="range" min="1" max="100" value={elevation} onChange={(e) => setElevation(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Shadow Tone</label>
                    <div className="flex gap-3">
                      {['0, 0, 0', '79, 70, 229', '15, 23, 42'].map((rgb) => (
                        <button 
                          key={rgb}
                          onClick={() => setShadowColor(rgb)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${shadowColor === rgb ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent opacity-50'}`}
                          style={{ backgroundColor: `rgb(${rgb})` }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeMode === 'neumorphism' && (
                <>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Base UI Color</label>
                    <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-200 p-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between mb-3 px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Distance</label>
                      </div>
                      <input type="range" min="1" max="50" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-3 px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Blur</label>
                      </div>
                      <input type="range" min="1" max="100" value={neumorphBlur} onChange={(e) => setNeumorphBlur(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Surface Shape</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['flat', 'pressed'].map((s) => (
                        <button 
                          key={s}
                          onClick={() => setShape(s as any)}
                          className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${shape === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Preview & Code Column */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <section className="bg-white rounded-[3.5rem] border border-slate-200 p-4 md:p-6 shadow-sm overflow-hidden group">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-800">
               {/* Background Pattern for Glassmorphism */}
               <div className="absolute inset-0 opacity-40">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-400 rounded-full blur-[100px] opacity-50" />
                  <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-rose-500 rounded-full blur-[100px] opacity-30" />
               </div>

               {/* The Preview Card */}
               <motion.div 
                 layout
                 style={styleData.preview}
                 className="w-full max-w-[280px] h-[280px] relative z-10 flex flex-col items-center justify-center gap-6 p-8 shadow-2xl transition-all duration-300 transform-gpu"
               >
                  <div className={`p-4 rounded-2xl ${activeMode === 'smooth' || activeMode === 'neumorphism' ? 'bg-indigo-50 text-indigo-600' : 'bg-white/20 text-white shadow-xl backdrop-blur-md'}`}>
                    <LayoutDashboard size={40} />
                  </div>
                  <div className="text-center">
                    <p className={`font-black uppercase tracking-widest text-[10px] mb-1 ${activeMode === 'smooth' || activeMode === 'neumorphism' ? 'text-slate-400' : 'text-white/60'}`}>Preview Canvas</p>
                    <p className={`font-black text-xl flex items-center gap-2 ${activeMode === 'smooth' || activeMode === 'neumorphism' ? 'text-slate-900' : 'text-white'}`}>
                      Enterprise UI <Zap size={16} className="text-indigo-500" />
                    </p>
                  </div>
               </motion.div>
            </div>

            <div className="mt-8 px-4 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <Code size={14} className="text-indigo-500" /> CSS Output
                </div>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                >
                  {copied ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy Styles</>}
                </button>
              </div>
              <div className="relative group/code">
                <pre className="bg-slate-900 text-indigo-400 p-8 rounded-3xl font-mono text-sm overflow-x-auto border border-slate-800 shadow-xl max-h-[160px] custom-scrollbar">
                  <code>{styleData.css}</code>
                </pre>
                <div className="absolute inset-0 bg-indigo-500/5 blur-xl pointer-events-none opacity-0 group-hover/code:opacity-100 transition-opacity" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 space-y-24">
        {/* Value Prop */}
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Design enterprise-grade UI components in seconds.</h2>
           </div>
           <div className="bg-white border border-slate-200 p-8 md:p-16 rounded-[3.5rem] shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <RefreshCw size={40} className="text-indigo-600" />
              </div>
              <div className="prose prose-slate max-w-none prose-lg font-medium text-slate-600 leading-relaxed">
                 <p>
                    Modern web design requires complex CSS math. Stop guessing alpha channels and layering multiple drop-shadows by hand. Generate production-ready code for Glassmorphism, Neumorphism, and multi-layered Smooth Shadows instantly.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Layers size={14} className="text-indigo-600" /> Natural Depth
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Our linear and exponential shadow algorithms recreate how light interacts with surfaces, avoiding the "floaty" look of standard single shadows.
                       </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                       <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                         <Maximize2 size={14} className="text-pink-600" /> Real-time Preview
                       </h4>
                       <p className="text-sm text-slate-500 leading-normal">
                         Instantly visualize how your styles will look against dynamic background patterns, ensuring readability and visual balance before you commit to code.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Comparison Section */}
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 blur-3xl -ml-48 -mt-48 rounded-full" />
              <div className="w-full md:w-1/2 space-y-8 relative z-10">
                 <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl w-fit">
                    <Sun size={32} />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                    Beyond Standard <br/>Shadow Presets.
                 </h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed">
                    Most developers rely on standard library shadows that lack character. Our engine treats CSS as a photographic medium.
                 </p>
                 <div className="flex flex-col gap-4">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                       <p className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest">The Secret Sauce</p>
                       <p className="text-sm text-slate-300">We use a layered approach with variable alpha curves, making elements feel anchored and physical rather than just "lifted" off the page.</p>
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl mb-4 shadow-xl" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Standard</p>
                    <p className="text-xs font-bold text-slate-400 italic">One Layer</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center border-indigo-500/30">
                    <div className="w-16 h-16 bg-white rounded-2xl mb-4 shadow-[5px_5px_10px_rgba(0,0,0,0.1),15px_15px_30px_rgba(0,0,0,0.05)]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Premium</p>
                    <p className="text-xs font-bold text-white italic">6 Layers</p>
                 </div>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Design Engineering FAQ</h2>
              <p className="text-slate-500 font-medium">Technical insights into modern CSS styling techniques.</p>
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
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight text-balance">Elevate Your <br/>Style Definition.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of precision engineers who use our engine to build high-fidelity components for modern web apps.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-6 bg-white text-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto group"
            >
              Start Generating <Palette size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
