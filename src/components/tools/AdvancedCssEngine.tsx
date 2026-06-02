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
  Code,
  Sparkles,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

type Mode = 'glassmorphism' | 'smooth' | 'neumorphism' | 'mesh_gradient' | 'neon_glow';

export default function AdvancedCssEngine() {
  const [activeMode, setActiveMode] = useState<Mode>('glassmorphism');
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'css' | 'tailwind'>('css');
  const [generateVars, setGenerateVars] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);

  // Glassmorphism State
  const [glassBlur, setGlassBlur] = useState(12);
  const [glassTransparency, setGlassTransparency] = useState(0.2);
  const [glassColor, setGlassColor] = useState('#ffffff');
  const [glassOutline, setGlassOutline] = useState(true);

  // Hover Glassmorphism State
  const [hoverGlassBlur, setHoverGlassBlur] = useState(18);
  const [hoverGlassTransparency, setHoverGlassTransparency] = useState(0.3);

  // Smooth Shadows State
  const [elevation, setElevation] = useState(15);
  const [shadowColor, setShadowColor] = useState('0, 0, 0');

  // Hover Smooth Shadows State
  const [hoverElevation, setHoverElevation] = useState(30);

  // Neumorphism State
  const [baseColor, setBaseColor] = useState('#e0e5ec');
  const [distance, setDistance] = useState(10);
  const [intensity, setIntensity] = useState(0.15);
  const [neumorphBlur, setNeumorphBlur] = useState(20);
  const [shape, setShape] = useState<'flat' | 'pressed'>('flat');

  // Hover Neumorphism State
  const [hoverDistance, setHoverDistance] = useState(15);
  const [hoverNeumorphBlur, setHoverNeumorphBlur] = useState(30);

  // Mesh Gradient State
  const [meshColor1, setMeshColor1] = useState('#4f46e5');
  const [meshColor2, setMeshColor2] = useState('#ec4899');
  const [meshColor3, setMeshColor3] = useState('#06b6d4');
  const [meshColor4, setMeshColor4] = useState('#e11d48');

  // Neon Glow State
  const [neonColor, setNeonColor] = useState('#06b6d4');
  const [neonIntensity, setNeonIntensity] = useState(20);
  const [neonSpread, setNeonSpread] = useState(5);

  // Hover Neon Glow State
  const [hoverNeonIntensity, setHoverNeonIntensity] = useState(35);

  const modeLabels: Record<Mode, string> = {
    glassmorphism: 'GLASSMORPHISM',
    smooth: 'SMOOTH SHADOWS',
    neumorphism: 'NEUMORPHISM',
    mesh_gradient: 'MESH GRADIENT',
    neon_glow: 'NEON GLOW'
  };

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
    let preview: React.CSSProperties = {};
    let hoverPreview: React.CSSProperties = {};
    let cssText = '';
    let tailwindClass = '';

    const transitionCss = '\ntransition: all 0.3s ease;';
    const transitionTailwind = 'transition-all duration-300';

    if (activeMode === 'glassmorphism') {
      const { r, g, b } = hexToRgb(glassColor);
      const background = `rgba(${r}, ${g}, ${b}, ${glassTransparency})`;
      const backdropFilter = `blur(${glassBlur}px)`;
      const border = glassOutline ? `1px solid rgba(255, 255, 255, ${(glassTransparency + 0.1).toFixed(2)})` : 'none';
      
      preview = { 
        background, 
        backdropFilter, 
        WebkitBackdropFilter: backdropFilter, 
        border, 
        borderRadius: '2.5rem' 
      };

      if (hoverActive) {
        const hoverBg = `rgba(${r}, ${g}, ${b}, ${hoverGlassTransparency})`;
        const hoverBlur = `blur(${hoverGlassBlur}px)`;
        const hoverBorder = glassOutline ? `1px solid rgba(255, 255, 255, ${(hoverGlassTransparency + 0.1).toFixed(2)})` : 'none';
        hoverPreview = {
          background: hoverBg,
          backdropFilter: hoverBlur,
          WebkitBackdropFilter: hoverBlur,
          border: hoverBorder
        };
      }

      // CSS Variable mode output
      if (generateVars && format === 'css') {
        cssText = `:root {
  --glass-bg: ${background};
  --glass-blur: blur(${glassBlur}px);
  --glass-border: ${border};
  --glass-radius: 2.5rem;${hoverActive ? `\n  --glass-bg-hover: rgba(${r}, ${g}, ${b}, ${hoverGlassTransparency});\n  --glass-blur-hover: blur(${hoverGlassBlur}px);` : ''}
}

.premium-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--glass-radius);${hoverActive ? transitionCss : ''}
}${hoverActive ? `\n\n.premium-card:hover {
  background: var(--glass-bg-hover);
  backdrop-filter: var(--glass-blur-hover);
  -webkit-backdrop-filter: var(--glass-blur-hover);
}` : ''}`;
      } else {
        cssText = `background: ${background};\nbackdrop-filter: ${backdropFilter};\n-webkit-backdrop-filter: ${backdropFilter};\nborder: ${border};\nborder-radius: 2.5rem;${hoverActive ? transitionCss : ''}`;
        if (hoverActive) {
          cssText += `\n\n.premium-card:hover {
  background: rgba(${r}, ${g}, ${b}, ${hoverGlassTransparency});
  backdrop-filter: blur(${hoverGlassBlur}px);
  -webkit-backdrop-filter: blur(${hoverGlassBlur}px);
}`;
        }
      }

      const cleanBorder = glassOutline ? `border border-white/${Math.round((glassTransparency + 0.1) * 100)}` : '';
      tailwindClass = `bg-[rgba(${r},${g},${b},${glassTransparency})] backdrop-blur-[${glassBlur}px] ${cleanBorder} rounded-[2.5rem]`;
      if (hoverActive) {
        const cleanHoverBorder = glassOutline ? `hover:border-white/${Math.round((hoverGlassTransparency + 0.1) * 100)}` : '';
        tailwindClass += ` ${transitionTailwind} hover:bg-[rgba(${r},${g},${b},${hoverGlassTransparency})] hover:backdrop-blur-[${hoverGlassBlur}px] ${cleanHoverBorder}`;
      }
    }

    else if (activeMode === 'smooth') {
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
      
      preview = { 
        boxShadow, 
        background, 
        borderRadius: '2.5rem' 
      };

      let hoverBoxShadow = '';
      if (hoverActive) {
        const hoverLayers = [];
        const hoverSteps = hoverElevation;
        for (let i = 1; i <= 5; i++) {
          const dist = Math.pow(i, 2) * (hoverSteps / 5);
          const blur = Math.pow(i, 2.2) * (hoverSteps / 4);
          const opacity = (0.18 / i).toFixed(2);
          hoverLayers.push(`${dist}px ${dist}px ${blur}px rgba(${shadowColor}, ${opacity})`);
        }
        hoverBoxShadow = hoverLayers.join(', ');
        hoverPreview = {
          boxShadow: hoverBoxShadow
        };
      }

      if (generateVars && format === 'css') {
        cssText = `:root {
  --smooth-bg: ${background};
  --smooth-shadow: ${boxShadow};
  --smooth-radius: 2.5rem;${hoverActive ? `\n  --smooth-shadow-hover: ${hoverBoxShadow};` : ''}
}

.premium-card {
  background: var(--smooth-bg);
  box-shadow: var(--smooth-shadow);
  border-radius: var(--smooth-radius);${hoverActive ? transitionCss : ''}
}${hoverActive ? `\n\n.premium-card:hover {
  box-shadow: var(--smooth-shadow-hover);
}` : ''}`;
      } else {
        cssText = `background: ${background};\nbox-shadow: ${boxShadow};\nborder-radius: 2.5rem;${hoverActive ? transitionCss : ''}`;
        if (hoverActive) {
          cssText += `\n\n.premium-card:hover {
  box-shadow: ${hoverBoxShadow};
}`;
        }
      }

      tailwindClass = `bg-white shadow-[${boxShadow}] rounded-[2.5rem]`;
      if (hoverActive) {
        tailwindClass += ` ${transitionTailwind} hover:shadow-[${hoverBoxShadow}]`;
      }
    }

    else if (activeMode === 'neumorphism') {
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
      
      preview = { 
        background: baseColor, 
        boxShadow, 
        borderRadius: '2.5rem' 
      };

      let hoverBoxShadow = '';
      if (hoverActive) {
        const hoverLightColor = adjustColor(baseColor, 45);
        const hoverDarkColor = adjustColor(baseColor, -25);
        const hDist = hoverDistance;
        const hBlur = hoverNeumorphBlur;
        if (shape === 'flat') {
          hoverBoxShadow = `${hDist}px ${hDist}px ${hBlur}px ${hoverDarkColor}, -${hDist}px -${hDist}px ${hBlur}px ${hoverLightColor}`;
        } else {
          hoverBoxShadow = `inset ${hDist}px ${hDist}px ${hBlur}px ${hoverDarkColor}, inset -${hDist}px -${hDist}px ${hBlur}px ${hoverLightColor}`;
        }
        hoverPreview = {
          boxShadow: hoverBoxShadow
        };
      }

      if (generateVars && format === 'css') {
        cssText = `:root {
  --neumorph-bg: ${baseColor};
  --neumorph-shadow: ${boxShadow};
  --neumorph-radius: 2.5rem;${hoverActive ? `\n  --neumorph-shadow-hover: ${hoverBoxShadow};` : ''}
}

.premium-card {
  background: var(--neumorph-bg);
  box-shadow: var(--neumorph-shadow);
  border-radius: var(--neumorph-radius);${hoverActive ? transitionCss : ''}
}${hoverActive ? `\n\n.premium-card:hover {
  box-shadow: var(--neumorph-shadow-hover);
}` : ''}`;
      } else {
        cssText = `background: ${baseColor};\nbox-shadow: ${boxShadow};\nborder-radius: 2.5rem;${hoverActive ? transitionCss : ''}`;
        if (hoverActive) {
          cssText += `\n\n.premium-card:hover {
  box-shadow: ${hoverBoxShadow};
}`;
        }
      }

      tailwindClass = `bg-[${baseColor}] shadow-[${boxShadow}] rounded-[2.5rem]`;
      if (hoverActive) {
        tailwindClass += ` ${transitionTailwind} hover:shadow-[${hoverBoxShadow}]`;
      }
    }

    else if (activeMode === 'mesh_gradient') {
      const bgVal = `radial-gradient(at 10% 20%, ${meshColor1} 0px, transparent 50%), radial-gradient(at 80% 10%, ${meshColor2} 0px, transparent 50%), radial-gradient(at 40% 90%, ${meshColor3} 0px, transparent 50%), radial-gradient(at 90% 80%, ${meshColor4} 0px, transparent 50%)`;
      
      preview = {
        backgroundColor: meshColor1,
        backgroundImage: bgVal,
        borderRadius: '2.5rem'
      };

      const hoverBgVal = `radial-gradient(at 20% 30%, ${meshColor1} 0px, transparent 55%), radial-gradient(at 70% 20%, ${meshColor2} 0px, transparent 55%), radial-gradient(at 50% 80%, ${meshColor3} 0px, transparent 55%), radial-gradient(at 80% 70%, ${meshColor4} 0px, transparent 55%)`;

      if (hoverActive) {
        hoverPreview = {
          backgroundImage: hoverBgVal
        };
      }

      if (generateVars && format === 'css') {
        cssText = `:root {
  --mesh-bg-color: ${meshColor1};
  --mesh-bg-image: ${bgVal};
  --mesh-radius: 2.5rem;${hoverActive ? `\n  --mesh-bg-image-hover: ${hoverBgVal};` : ''}
}

.premium-card {
  background-color: var(--mesh-bg-color);
  background-image: var(--mesh-bg-image);
  border-radius: var(--mesh-radius);${hoverActive ? transitionCss : ''}
}${hoverActive ? `\n\n.premium-card:hover {
  background-image: var(--mesh-bg-image-hover);
}` : ''}`;
      } else {
        cssText = `background-color: ${meshColor1};\nbackground-image: ${bgVal};\nborder-radius: 2.5rem;${hoverActive ? transitionCss : ''}`;
        if (hoverActive) {
          cssText += `\n\n.premium-card:hover {
  background-image: ${hoverBgVal};
}`;
        }
      }

      tailwindClass = `bg-[${meshColor1}] bg-[radial-gradient(at_10%_20%,${meshColor1}_0px,transparent_50%),radial-gradient(at_80%_10%,${meshColor2}_0px,transparent_50%),radial-gradient(at_40%_90%,${meshColor3}_0px,transparent_50%),radial-gradient(at_90%_80%,${meshColor4}_0px,transparent_50%)] rounded-[2.5rem]`;
      if (hoverActive) {
        tailwindClass += ` ${transitionTailwind} hover:bg-[radial-gradient(at_20%_30%,${meshColor1}_0px,transparent_55%),radial-gradient(at_70%_20%,${meshColor2}_0px,transparent_55%),radial-gradient(at_50%_80%,${meshColor3}_0px,transparent_55%),radial-gradient(at_80%_70%,${meshColor4}_0px,transparent_55%)]`;
      }
    }

    else if (activeMode === 'neon_glow') {
      const neonShadow = `0 0 ${neonIntensity}px ${neonColor}, inset 0 0 ${Math.round(neonIntensity / 2)}px ${neonColor}`;
      const border = `1px solid ${neonColor}`;
      const textShadow = `0 0 ${Math.round(neonIntensity / 2)}px ${neonColor}`;

      preview = {
        backgroundColor: '#0f172a',
        border,
        boxShadow: neonShadow,
        borderRadius: '2.5rem'
      };

      let hoverNeonShadow = '';
      if (hoverActive) {
        hoverNeonShadow = `0 0 ${hoverNeonIntensity}px ${neonColor}, inset 0 0 ${Math.round(hoverNeonIntensity / 2)}px ${neonColor}`;
        hoverPreview = {
          boxShadow: hoverNeonShadow
        };
      }

      if (generateVars && format === 'css') {
        cssText = `:root {
  --neon-bg: #0f172a;
  --neon-border: ${border};
  --neon-shadow: ${neonShadow};
  --neon-text-shadow: ${textShadow};
  --neon-radius: 2.5rem;${hoverActive ? `\n  --neon-shadow-hover: ${hoverNeonShadow};` : ''}
}

.premium-card {
  background-color: var(--neon-bg);
  border: var(--neon-border);
  box-shadow: var(--neon-shadow);
  border-radius: var(--neon-radius);${hoverActive ? transitionCss : ''}
}

.premium-card .neon-text {
  text-shadow: var(--neon-text-shadow);
}${hoverActive ? `\n\n.premium-card:hover {
  box-shadow: var(--neon-shadow-hover);
}` : ''}`;
      } else {
        cssText = `background-color: #0f172a;\nborder: ${border};\nbox-shadow: ${neonShadow};\nborder-radius: 2.5rem;${hoverActive ? transitionCss : ''}`;
        if (hoverActive) {
          cssText += `\n\n.premium-card:hover {
  box-shadow: ${hoverNeonShadow};
}`;
        }
      }

      tailwindClass = `bg-[#0f172a] border border-[${neonColor}] shadow-[0_0_${neonIntensity}px_${neonColor},inset_0_0_${Math.round(neonIntensity / 2)}px_${neonColor}] rounded-[2.5rem]`;
      if (hoverActive) {
        tailwindClass += ` ${transitionTailwind} hover:shadow-[0_0_${hoverNeonIntensity}px_${neonColor},inset_0_0_${Math.round(hoverNeonIntensity / 2)}px_${neonColor}]`;
      }
    }

    return {
      preview,
      hoverPreview,
      css: format === 'tailwind' ? tailwindClass : cssText
    };
  }, [
    activeMode, 
    glassBlur, 
    glassTransparency, 
    glassColor, 
    glassOutline, 
    elevation, 
    shadowColor, 
    baseColor, 
    distance, 
    intensity, 
    neumorphBlur, 
    shape,
    hoverActive,
    hoverGlassBlur,
    hoverGlassTransparency,
    hoverElevation,
    hoverDistance,
    hoverNeumorphBlur,
    meshColor1,
    meshColor2,
    meshColor3,
    meshColor4,
    neonColor,
    neonIntensity,
    neonSpread,
    hoverNeonIntensity,
    format,
    generateVars
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(styleData.css);
    setCopied(true);
    toast.success('CSS classes copied successfully!');
    setTimeout(() => setCopied(false), 2000);
  };

  const activeStyle = {
    ...styleData.preview,
    ...(isHovered && hoverActive ? styleData.hoverPreview : {}),
    transition: hoverActive ? 'all 0.3s ease' : 'none'
  };

  const neonTextColor = activeMode === 'neon_glow' ? neonColor : (activeMode === 'smooth' || activeMode === 'neumorphism' ? '#0f172a' : '#ffffff');
  const neonTextShadow = activeMode === 'neon_glow' ? `0 0 ${Math.round((isHovered && hoverActive ? hoverNeonIntensity : neonIntensity) / 2)}px ${neonColor}` : 'none';

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
          Generate production-ready CSS and Tailwind utility codes for next-gen UI components. Build Glassmorphism, Neumorphism, Mesh Gradients, and Neon Glow cards in seconds.
        </p>
      </div>

      {/* Mode Navigation Pills */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 p-2 rounded-2xl flex flex-wrap gap-1 shadow-inner border border-slate-200/50 justify-center">
          {(['glassmorphism', 'smooth', 'neumorphism', 'mesh_gradient', 'neon_glow'] as Mode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setActiveMode(mode);
                setIsHovered(false);
              }}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeMode === mode 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {modeLabels[mode]}
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
                      <button onClick={() => setGlassOutline(!glassOutline)} className={`w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${glassOutline ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
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
                          className={`w-12 h-12 rounded-full border-2 transition-all cursor-pointer ${shadowColor === rgb ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent opacity-50'}`}
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
                          className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${shape === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeMode === 'mesh_gradient' && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Mesh Color Swatches</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Color 1 (Base)</span>
                      <input type="color" value={meshColor1} onChange={(e) => setMeshColor1(e.target.value)} className="w-full h-11 rounded-xl cursor-pointer bg-slate-50 border border-slate-200 p-1" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Color 2</span>
                      <input type="color" value={meshColor2} onChange={(e) => setMeshColor2(e.target.value)} className="w-full h-11 rounded-xl cursor-pointer bg-slate-50 border border-slate-200 p-1" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Color 3</span>
                      <input type="color" value={meshColor3} onChange={(e) => setMeshColor3(e.target.value)} className="w-full h-11 rounded-xl cursor-pointer bg-slate-50 border border-slate-200 p-1" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Color 4</span>
                      <input type="color" value={meshColor4} onChange={(e) => setMeshColor4(e.target.value)} className="w-full h-11 rounded-xl cursor-pointer bg-slate-50 border border-slate-200 p-1" />
                    </div>
                  </div>
                </div>
              )}

              {activeMode === 'neon_glow' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Neon Luminous Color</label>
                    <input type="color" value={neonColor} onChange={(e) => setNeonColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-200 p-1" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-3 px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Glow Intensity ({neonIntensity}px)</label>
                    </div>
                    <input type="range" min="1" max="50" value={neonIntensity} onChange={(e) => setNeonIntensity(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              )}

              {/* Hover State Toggle under parameters */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Configure Hover State</span>
                    <span className="text-xs text-slate-400 block leading-normal">Reveal and output secondary hover transitions</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHoverActive(!hoverActive);
                      setIsHovered(false);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      hoverActive ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                    aria-label="Toggle Hover Configuration"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        hoverActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Secondary hover sliders if active */}
                <AnimatePresence>
                  {hoverActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-6 pt-4 border-t border-dashed border-slate-100 overflow-hidden"
                    >
                      {activeMode === 'glassmorphism' && (
                        <>
                          <div>
                            <div className="flex justify-between mb-3 px-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hover Blur ({hoverGlassBlur}px)</label>
                            </div>
                            <input type="range" min="0" max="40" value={hoverGlassBlur} onChange={(e) => setHoverGlassBlur(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-3 px-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hover Transparency ({Math.round(hoverGlassTransparency * 100)}%)</label>
                            </div>
                            <input type="range" min="0" max="1" step="0.01" value={hoverGlassTransparency} onChange={(e) => setHoverGlassTransparency(parseFloat(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                          </div>
                        </>
                      )}

                      {activeMode === 'smooth' && (
                        <div>
                          <div className="flex justify-between mb-3 px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hover Elevation ({hoverElevation})</label>
                          </div>
                          <input type="range" min="1" max="100" value={hoverElevation} onChange={(e) => setHoverElevation(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                        </div>
                      )}

                      {activeMode === 'neumorphism' && (
                        <>
                          <div>
                            <div className="flex justify-between mb-3 px-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hover Distance ({hoverDistance}px)</label>
                            </div>
                            <input type="range" min="1" max="50" value={hoverDistance} onChange={(e) => setHoverDistance(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-3 px-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hover Blur ({hoverNeumorphBlur}px)</label>
                            </div>
                            <input type="range" min="1" max="100" value={hoverNeumorphBlur} onChange={(e) => setHoverNeumorphBlur(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                          </div>
                        </>
                      )}

                      {activeMode === 'mesh_gradient' && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Hover Mesh Dynamic State</span>
                          <p className="text-xs text-slate-400 leading-relaxed">Hovering shifts coordinates of radial gradient center-points dynamically to simulate advanced physics aesthetics.</p>
                        </div>
                      )}

                      {activeMode === 'neon_glow' && (
                        <div>
                          <div className="flex justify-between mb-3 px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hover Neon Glow Intensity ({hoverNeonIntensity}px)</label>
                          </div>
                          <input type="range" min="1" max="100" value={hoverNeonIntensity} onChange={(e) => setHoverNeonIntensity(parseInt(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                 style={activeStyle}
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
                 className="w-full max-w-[280px] h-[280px] relative z-10 flex flex-col items-center justify-center gap-6 p-8 shadow-2xl transition-all duration-300 transform-gpu cursor-pointer"
               >
                  <div 
                    className={`p-4 rounded-2xl transition-all duration-300 ${
                      activeMode === 'smooth' || activeMode === 'neumorphism' 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : (activeMode === 'neon_glow' 
                           ? 'bg-slate-950 text-slate-50 border' 
                           : 'bg-white/20 text-white shadow-xl backdrop-blur-md')
                    }`}
                    style={activeMode === 'neon_glow' ? { borderColor: neonColor, boxShadow: `0 0 ${Math.round((isHovered && hoverActive ? hoverNeonIntensity : neonIntensity) / 3)}px ${neonColor}` } : {}}
                  >
                    <LayoutDashboard size={40} style={activeMode === 'neon_glow' ? { color: neonColor, filter: `drop-shadow(0 0 5px ${neonColor})` } : {}} />
                  </div>
                  <div className="text-center">
                    <p className={`font-black uppercase tracking-widest text-[10px] mb-2 ${activeMode === 'smooth' || activeMode === 'neumorphism' ? 'text-slate-405' : 'text-white/60'}`} style={activeMode === 'neon_glow' ? { color: neonColor, textShadow: neonTextShadow } : {}}>
                      {hoverActive && isHovered ? 'Hover Active' : 'Preview Canvas'}
                    </p>
                    <p 
                      className={`font-black text-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                        activeMode === 'smooth' || activeMode === 'neumorphism' 
                          ? 'text-slate-900' 
                          : 'text-white'
                      }`}
                      style={{ color: neonTextColor, textShadow: neonTextShadow }}
                    >
                      Enterprise UI <Zap size={16} className={activeMode === 'neon_glow' ? '' : 'text-indigo-500'} style={activeMode === 'neon_glow' ? { color: neonColor, filter: `drop-shadow(0 0 5px ${neonColor})` } : {}} />
                    </p>
                  </div>
               </motion.div>
            </div>

            <div className="mt-8 px-4 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <Code size={14} className="text-indigo-500" /> CSS Output
                  </div>

                  {/* Format selector */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setFormat('css')}
                      className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${format === 'css' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Raw CSS
                    </button>
                    <button
                      onClick={() => setFormat('tailwind')}
                      className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${format === 'tailwind' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Tailwind
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {format === 'css' && (
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors select-none">
                      <input 
                        type="checkbox" 
                        checked={generateVars} 
                        onChange={(e) => setGenerateVars(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-505 border-slate-300 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="text-[9.5px] font-black uppercase tracking-wider">Generate CSS Variables</span>
                    </label>
                  )}

                  <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${copied ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                  >
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Code</>}
                  </button>
                </div>
              </div>
              
              <div className="relative group/code">
                <pre className="bg-slate-900 text-indigo-400 p-8 rounded-3xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-xl max-h-[220px] custom-scrollbar">
                  <code>{styleData.css}</code>
                </pre>
                <div className="absolute inset-0 bg-indigo-500/5 blur-xl pointer-events-none opacity-0 group-hover/code:opacity-100 transition-opacity" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Strictly Isolated SEO Content Section */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">What is the Advanced CSS Effects Engine?</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-8">
          The Advanced CSS Effects Engine is a production-ready code generator designed for UI/UX designers and front-end developers. It removes the guesswork from creating complex, multi-layered visual styles like Glassmorphism and Neumorphism by instantly generating perfectly calculated, cross-browser compatible CSS and Tailwind utility classes.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Why Modern Web Design Requires Advanced CSS</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-4">
          Flat design is evolving. To create depth, hierarchy, and premium visual experiences, modern web applications rely on advanced styling techniques. However, writing these styles manually often requires stacking multiple box-shadows, calculating backdrop-filters, and managing complex RGBA alpha channels.
        </p>
        <p className="text-slate-600 leading-relaxed font-medium mb-8">
          Our engine automates this math, ensuring your design systems remain consistent, accessible, and performant.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Core Effects Explained</h2>
        
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">1. Glassmorphism</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              A design trend that mimics the look of frosted glass. It uses background blur, semi-transparent backgrounds, and subtle light borders to create a sense of vertical depth, allowing underlying colors or images to bleed through softly. Perfect for modern dashboard modals, sticky navigation bars, and premium SaaS landing pages.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">2. Neumorphism (Soft UI)</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              A visual style that blends background colors, shapes, gradients, highlights, and shadows to make UI elements appear as if they are extruded from the background itself. It relies heavily on precise, multi-layered box-shadow properties to create "pushed in" or "popped out" states.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">3. Mesh Gradients</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Free-flowing, multi-color gradients that blend smoothly together. Unlike rigid linear or radial gradients, mesh gradients provide a highly organic, fluid aesthetic that serves as a perfect backdrop for hero sections and modern branding.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">4. Neon Glow</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Utilizing intensely saturated drop-shadows and text-shadows against dark mode backgrounds to create luminous, cyberpunk-inspired glowing interfaces.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Streamlining the Developer Workflow</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-4">
          Getting the visual look right is only half the battle. This tool is built for implementation:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium mb-8">
          <li><strong>Tailwind CSS Integration:</strong> Stop translating raw CSS. Toggle the output to instantly generate a string of Tailwind utility classes ready to be pasted into your React, Next.js, or Vue components.</li>
          <li><strong>CSS Variables:</strong> Export your generated parameters as CSS custom properties to easily integrate them into your global enterprise design system.</li>
          <li><strong>Interactive States:</strong> Automatically generate the required transition rules and :hover states to ensure your UI feels alive and responsive to user input.</li>
        </ul>
      </section>
    </div>
  );
}
