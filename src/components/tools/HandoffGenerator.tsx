import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Copy, Check, Terminal, ExternalLink, 
  Type, Palette, MousePointer2, CheckCircle2, 
  ArrowRight, FileCode, Monitor
} from 'lucide-react';
import FreemiumExportWrapper from '../common/FreemiumExportWrapper';

interface TypographyToken {
  id: string;
  element: string;
  family: string;
  weight: string;
  size: string;
}

interface ColorToken {
  id: string;
  name: string;
  hex: string;
}

export default function HandoffGenerator() {
  // 1. STATE & DATA ENGINE
  const [projectName, setProjectName] = useState('Nebula Dashboard Rebrand');
  const [figmaUrl, setFigmaUrl] = useState('https://figma.com/file/handoff-sample');
  const [interactiveNotes, setInteractiveNotes] = useState('All buttons have a 0.2s ease-in-out hover scale. Transitions should be smooth.');
  
  const [typography, setTypography] = useState<TypographyToken[]>([
    { id: '1', element: 'H1', family: 'Inter', weight: '700', size: '48px' },
    { id: '2', element: 'Body', family: 'Inter', weight: '400', size: '16px' }
  ]);
  
  const [colors, setColors] = useState<ColorToken[]>([
    { id: '1', name: 'primary-blue', hex: '#0f4c75' },
    { id: '2', name: 'neutral-dark', hex: '#1b262c' }
  ]);

  const [copied, setCopied] = useState(false);

  // Helper Methods
  const addTypography = () => {
    setTypography([...typography, { id: Math.random().toString(36).substr(2, 9), element: 'New', family: 'Inter', weight: '400', size: '16px' }]);
  };

  const removeTypography = (id: string) => {
    setTypography(typography.filter(t => t.id !== id));
  };

  const updateTypography = (id: string, field: keyof TypographyToken, value: string) => {
    setTypography(typography.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addColor = () => {
    setColors([...colors, { id: Math.random().toString(36).substr(2, 9), name: 'new-color', hex: '#000000' }]);
  };

  const removeColor = (id: string) => {
    setColors(colors.filter(c => c.id !== id));
  };

  const updateColor = (id: string, field: keyof ColorToken, value: string) => {
    setColors(colors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Generate Payload
  const payload = useMemo(() => {
    if (typography.length === 0 && colors.length === 0) return null;

    let md = `## 🚀 Project: ${projectName}\n`;
    md += `**Design Source**: ${figmaUrl}\n\n`;
    
    md += `### 🎨 Color Tokens\n`;
    colors.forEach(c => {
      md += `- \`--${c.name}\`: ${c.hex}\n`;
    });
    
    md += `\n### 🔤 Typography System\n`;
    typography.forEach(t => {
      md += `- **${t.element}**: ${t.family}, ${t.weight}, ${t.size}\n`;
    });
    
    if (interactiveNotes) {
      md += `\n### ⚡ Interactive States\n`;
      md += `${interactiveNotes}\n`;
    }

    return md;
  }, [projectName, figmaUrl, typography, colors, interactiveNotes]);

  const handleCopy = () => {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[800px]">
      {/* 1. THE DESIGNER INPUT ENGINE */}
      <div className="w-full xl:w-2/5 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-8 h-full overflow-y-auto max-h-[850px] custom-scrollbar">
          {/* Context */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                  <Monitor size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-900">Project Context</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Standardize the handoff source</p>
                </div>
             </div>
             <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Project Name</label>
                  <input 
                    type="text" 
                    value={projectName || ''}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Figma / Design URL</label>
                  <input 
                    type="text" 
                    value={figmaUrl || ''}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono text-slate-500 focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all"
                  />
                </div>
             </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Type size={18} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Typography System</h3>
              </div>
              <button 
                onClick={addTypography}
                className="p-1.5 bg-slate-900 text-white rounded-lg hover:scale-110 transition-all shadow-md"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {typography.map((t) => (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-12 gap-2"
                  >
                    <input 
                      className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none"
                      placeholder="El"
                      value={t.element || ''}
                      onChange={(e) => updateTypography(t.id, 'element', e.target.value)}
                    />
                    <input 
                      className="col-span-4 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none"
                      placeholder="Family"
                      value={t.family || ''}
                      onChange={(e) => updateTypography(t.id, 'family', e.target.value)}
                    />
                    <input 
                      className="col-span-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none"
                      placeholder="W"
                      value={t.weight || ''}
                      onChange={(e) => updateTypography(t.id, 'weight', e.target.value)}
                    />
                    <input 
                      className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none"
                      placeholder="S"
                      value={t.size || ''}
                      onChange={(e) => updateTypography(t.id, 'size', e.target.value)}
                    />
                    <button 
                      onClick={() => removeTypography(t.id)}
                      className="col-span-1 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Color Tokens</h3>
              </div>
              <button 
                onClick={addColor}
                className="p-1.5 bg-slate-900 text-white rounded-lg hover:scale-110 transition-all shadow-md"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {colors.map((c) => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative group">
                       <input 
                        type="color" 
                        value={c.hex || '#000000'}
                        onChange={(e) => updateColor(c.id, 'hex', e.target.value)}
                        className="w-10 h-10 p-0 border-0 rounded-xl cursor-pointer bg-transparent"
                      />
                      <div 
                        className="absolute inset-0 w-full h-full rounded-xl border-2 border-white shadow-sm pointer-events-none"
                        style={{ backgroundColor: c.hex }}
                      />
                    </div>
                    <input 
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none"
                      placeholder="Token Name"
                      value={c.name || ''}
                      onChange={(e) => updateColor(c.id, 'name', e.target.value)}
                    />
                    <input 
                      className="w-24 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-mono text-slate-500 outline-none"
                      placeholder="#HEX"
                      value={c.hex || '#000000'}
                      onChange={(e) => updateColor(c.id, 'hex', e.target.value)}
                    />
                    <button 
                      onClick={() => removeColor(c.id)}
                      className="flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive States */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer2 size={18} className="text-slate-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Interactive States</h3>
            </div>
            <textarea 
              value={interactiveNotes || ''}
              onChange={(e) => setInteractiveNotes(e.target.value)}
              placeholder="Describe transitions, hover effects, and animations..."
              className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 focus:ring-2 focus:ring-[#0f4c75] outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* 2. THE DEVELOPER PAYLOAD (Right Panel) */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-[#0B1120] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-full relative">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Terminal size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-blue-500/20 w-fit mb-0.5">PAYLOAD_JSON</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Auto-Generated Developer Document</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
            </div>
          </div>

          <div className="flex-1 p-8 font-mono text-sm overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
              {!payload ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 filter grayscale">
                   <FileCode size={48} className="mb-4" />
                   <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Awaiting Design Input...</p>
                   <p className="text-xs font-bold text-slate-500 mt-2">Add typography or color tokens to generate payload</p>
                </div>
              ) : (
                <pre className="text-slate-300 whitespace-pre-wrap">
                  {payload.split('\n').map((line, i) => {
                    if (line.startsWith('## ') || line.startsWith('### ')) {
                      return <span key={i} className="text-blue-400 font-bold block mt-4">{line}</span>;
                    }
                    if (line.includes('`')) {
                      return <span key={i} className="block">
                        {line.split('`').map((part, pi) => (
                          pi % 2 === 1 ? <span key={pi} className="text-emerald-400">{part}</span> : part
                        ))}
                      </span>;
                    }
                    return <span key={i} className="block">{line}</span>;
                  })}
                </pre>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 bg-white/[0.02] border-t border-white/5 space-y-6">
             <div className="flex flex-col md:flex-row gap-4">
                <FreemiumExportWrapper toolId="handoff-gen" className="flex-1">
                  <button 
                    onClick={handleCopy}
                    disabled={!payload}
                    className="w-full px-8 py-5 bg-[#0f4c75] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0b3c5d] active:scale-95 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={18} />
                        Copied to Clipboard
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy Handoff Payload
                      </>
                    )}
                  </button>
                </FreemiumExportWrapper>
                <button 
                  onClick={() => {
                    window.location.href = `/tools/project-timeline-gen?phase=design&status=complete`;
                  }}
                  className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 active:scale-95 transition-all group"
                >
                   Mark Design Phase Complete <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             
             <div className="flex items-center justify-center gap-4 py-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-Time Sync Active</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-2">
                   <CheckCircle2 size={10} className="text-blue-400" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">W3C Compliant</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
