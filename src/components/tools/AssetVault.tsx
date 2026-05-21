import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Copy, Check, Shield, Globe, 
  Lock, Share2, Type, Palette, Image as ImageIcon,
  Calendar, Building2, ExternalLink, ArrowRight, Link as LinkIcon, ChevronDown, Moon, Sun, Loader2, FolderDown, FileCode2, FileDown
} from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumAction } from '../../hooks/usePremiumAction';
import { DatabaseService } from '../../services/DatabaseService';

interface BrandColor {
  id: string;
  name: string;
  hex: string;
}

const encodeData = (data: any) => {
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (e) {
    return '';
  }
};

const decodeData = (hash: string) => {
  try {
    return JSON.parse(decodeURIComponent(atob(hash)));
  } catch (e) {
    return null;
  }
};

export default function AssetVault() {
  const { executeAction, isProcessing } = usePremiumAction();
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  
  // 1. STATE MANAGEMENT
  const [clientName, setClientName] = useState('Acme Corp');
  const [projectDate, setProjectDate] = useState(new Date().toISOString().split('T')[0]);
  const [primaryLogo, setPrimaryLogo] = useState('https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=400&q=80');
  const [secondaryLogo, setSecondaryLogo] = useState('https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=400&q=80');
  const [headingFont, setHeadingFont] = useState('Space Grotesk');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [driveLink, setDriveLink] = useState('');
  const [figmaLink, setFigmaLink] = useState('');
  const [colors, setColors] = useState<BrandColor[]>([
    { id: '1', name: 'Primary Navy', hex: '#001F3F' },
    { id: '2', name: 'Electric Blue', hex: '#0074D9' },
    { id: '3', name: 'Accent Teal', hex: '#39CCCC' },
    { id: '4', name: 'Clean White', hex: '#F8F9FA' }
  ]);
  
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Preview Card Modes (Light = false, Dark = true)
  const [primaryDark, setPrimaryDark] = useState(false);
  const [secondaryDark, setSecondaryDark] = useState(false);
  const [headingDark, setHeadingDark] = useState(false);
  const [bodyDark, setBodyDark] = useState(false);

  // Hydration
  useEffect(() => {
    const hashData = window.location.hash.replace('#data=', '');
    if (hashData) {
      const decoded = decodeData(hashData);
      if (decoded) {
        if (decoded.clientName) setClientName(decoded.clientName);
        if (decoded.projectDate) setProjectDate(decoded.projectDate);
        if (decoded.primaryLogo) setPrimaryLogo(decoded.primaryLogo);
        if (decoded.secondaryLogo) setSecondaryLogo(decoded.secondaryLogo);
        if (decoded.headingFont) setHeadingFont(decoded.headingFont);
        if (decoded.bodyFont) setBodyFont(decoded.bodyFont);
        if (decoded.driveLink) setDriveLink(decoded.driveLink);
        if (decoded.figmaLink) setFigmaLink(decoded.figmaLink);
        if (decoded.colors) setColors(decoded.colors);
      }
    }
    setIsHydrated(true);
  }, []);

  // Serialization
  useEffect(() => {
    if (!isHydrated) return;

    const data = {
      clientName,
      projectDate,
      primaryLogo,
      secondaryLogo,
      headingFont,
      bodyFont,
      colors,
      driveLink,
      figmaLink
    };

    const encoded = encodeData(data);
    window.history.replaceState(null, '', `#data=${encoded}`);
  }, [clientName, projectDate, primaryLogo, secondaryLogo, headingFont, bodyFont, colors, driveLink, figmaLink, isHydrated]);


  // 2. ACTIONS
  const addColor = () => {
    const newColor: BrandColor = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Color',
      hex: '#000000'
    };
    setColors([...colors, newColor]);
  };

  const removeColor = (id: string) => {
    setColors(colors.filter(c => c.id !== id));
  };

  const updateColor = (id: string, field: keyof BrandColor, value: string) => {
    setColors(colors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleGenerateLink = async () => {
    await executeAction(async (userId) => {
      const slug = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'client';
      const mockUrl = `https://freelancerkit.com/vault/${slug}-${Math.random().toString(36).substr(2, 5)}`;
      
      await navigator.clipboard.writeText(mockUrl);
      setIsLinkCopied(true);
      toast.success("Secure link copied to clipboard!");
      
      const vaultData = { clientName, projectDate, primaryLogo, secondaryLogo, headingFont, bodyFont, colors, driveLink, figmaLink };
      await DatabaseService.saveUserDocument(userId, 'brand_vault', vaultData);
      toast.success("Vault generated successfully. Saved to your Agency Workspaces.");
      
      setTimeout(() => setIsLinkCopied(false), 3000);
    });
  };

  const handleExportPDF = async () => {
    await executeAction(async (userId) => {
      window.print();
      const vaultData = { clientName, projectDate, primaryLogo, secondaryLogo, headingFont, bodyFont, colors, driveLink, figmaLink };
      await DatabaseService.saveUserDocument(userId, 'brand_vault', vaultData);
      toast.success("Vault generated successfully. Saved to your Agency Workspaces.");
    });
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="pb-24 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 min-h-[800px]">
        {/* LEFT PANEL: THE EDITOR */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16" />
            
            {/* Client Details */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                  <Building2 size={16} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Client Details</h3>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Client Name</label>
                  <input 
                    type="text" 
                    value={clientName || ''} 
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Project Date</label>
                  <input 
                    type="date" 
                    value={projectDate || ''} 
                    onChange={(e) => setProjectDate(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Raw Asset Links */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                  <FolderDown size={16} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Raw Asset Links</h3>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Google Drive / Dropbox Folder URL</label>
                  <input 
                    type="text" 
                    value={driveLink || ''} 
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Figma File URL</label>
                  <input 
                    type="text" 
                    value={figmaLink || ''} 
                    onChange={(e) => setFigmaLink(e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Logo Assets */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                   <ImageIcon size={16} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Logo Assets</h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Logo URL</label>
                  <input 
                    type="text" 
                    value={primaryLogo || ''} 
                    onChange={(e) => setPrimaryLogo(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-mono text-slate-600 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secondary Logo URL</label>
                  <input 
                    type="text" 
                    value={secondaryLogo || ''} 
                    onChange={(e) => setSecondaryLogo(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-xs font-mono text-slate-600 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                    <Palette size={16} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Color Palette</h3>
                </div>
                <button 
                  onClick={addColor}
                  className="p-2 bg-slate-900 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {colors.map((color) => (
                    <motion.div 
                      key={color.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-2 items-center bg-white border border-slate-100 p-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="w-12 h-12 rounded-[1rem] border border-slate-200 shadow-inner shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <input 
                        type="text" 
                        value={color.name || ''}
                        onChange={(e) => updateColor(color.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-transparent text-xs font-bold text-slate-800 outline-none placeholder:text-slate-300"
                        placeholder="Name"
                      />
                      <input 
                        type="text" 
                        value={color.hex || ''}
                        onChange={(e) => updateColor(color.id, 'hex', e.target.value)}
                        className="w-[84px] px-3 py-2 bg-slate-50 rounded-xl text-[10px] font-mono text-slate-500 outline-none uppercase text-center"
                        placeholder="#000000"
                      />
                      <button 
                        onClick={() => removeColor(color.id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
                  <Type size={16} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Typography</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Heading Font</label>
                  <input 
                    type="text" 
                    value={headingFont || ''} 
                    onChange={(e) => setHeadingFont(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                    placeholder="e.g. Space Grotesk"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Body Font</label>
                  <input 
                    type="text" 
                    value={bodyFont || ''} 
                    onChange={(e) => setBodyFont(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                    placeholder="e.g. Inter"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center px-4 py-2 border border-blue-200 bg-blue-50/50 rounded-2xl">
            <p className="text-[10px] font-black tracking-widest uppercase text-blue-500">Auto-Saving via URL State.</p>
          </div>
        </div>

        {/* RIGHT PANEL: THE VAULT PREVIEW */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative bg-[#0b0f19] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col min-h-full">
            {/* Header */}
            <div className="px-8 pt-12 pb-10 sm:px-14 border-b border-white/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                    <Shield size={14} className="text-green-400" />
                    Secure Brand Asset Vault
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white capitalize tracking-tight" style={{ fontFamily: headingFont, display: 'swap' }}>{clientName}</h1>
                  <p className="text-slate-400 text-sm font-medium" style={{ fontFamily: bodyFont }}>Deliverable Published: {projectDate}</p>
                </div>
                <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                  Read Only Access
                </div>
              </div>

              {/* Logos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`relative border border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col items-center justify-center gap-6 group transition-colors duration-500 ${primaryDark ? 'bg-black' : 'bg-white'}`}>
                  <div className="absolute top-4 right-4 flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                     <button onClick={() => setPrimaryDark(false)} className={`p-1.5 rounded-full transition-colors ${!primaryDark ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-white'}`} title="Light Mode"><Sun size={12} /></button>
                     <button onClick={() => setPrimaryDark(true)} className={`p-1.5 rounded-full transition-colors ${primaryDark ? 'bg-slate-900 shadow-sm text-white' : 'text-slate-400 hover:text-white'}`} title="Dark Mode"><Moon size={12} /></button>
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${primaryDark ? 'text-slate-500' : 'text-slate-400'}`}>Primary Mark</div>
                  <div className="h-32 flex items-center justify-center p-4 w-full">
                     <img src={primaryLogo} alt="Primary Logo" className={`max-h-full max-w-full object-contain ${primaryDark ? 'brightness-200' : ''}`} />
                  </div>
                  <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${primaryDark ? 'text-white' : 'text-slate-900'}`}>
                    Download Source <ExternalLink size={12} />
                  </button>
                </div>

                <div className={`relative border border-white/5 rounded-[2rem] p-8 sm:p-10 flex flex-col items-center justify-center gap-6 group transition-colors duration-500 ${secondaryDark ? 'bg-black' : 'bg-white'}`}>
                   <div className="absolute top-4 right-4 flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                     <button onClick={() => setSecondaryDark(false)} className={`p-1.5 rounded-full transition-colors ${!secondaryDark ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-white'}`} title="Light Mode"><Sun size={12} /></button>
                     <button onClick={() => setSecondaryDark(true)} className={`p-1.5 rounded-full transition-colors ${secondaryDark ? 'bg-slate-900 shadow-sm text-white' : 'text-slate-400 hover:text-white'}`} title="Dark Mode"><Moon size={12} /></button>
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${secondaryDark ? 'text-slate-500' : 'text-slate-400'}`}>Secondary Mark</div>
                  <div className="h-32 flex items-center justify-center p-4 w-full">
                     <img src={secondaryLogo} alt="Secondary Logo" className={`max-h-full max-w-full object-contain ${secondaryDark ? 'brightness-200' : ''}`} />
                  </div>
                  <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${secondaryDark ? 'text-white' : 'text-slate-900'}`}>
                    Download Source <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-8 py-12 sm:px-14 sm:py-16 space-y-16">
              {/* Color Swatches Bento */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: headingFont }}>Brand Palette</h2>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Click swatch to copy HEX</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colors.map((color) => (
                    <button 
                      key={color.id}
                      onClick={() => copyToClipboard(color.hex)}
                      className="flex flex-col gap-3 group relative text-left"
                    >
                      <div 
                        className="w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] border border-white/5 shadow-2xl group-hover:-translate-y-1 group-active:translate-y-0 transition-transform duration-300 flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        <AnimatePresence>
                          {copiedColor === color.hex && (
                            <motion.div 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="bg-white/90 backdrop-blur-md p-3 rounded-full text-slate-900 shadow-xl"
                            >
                              <Check size={20} strokeWidth={3} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="px-1 space-y-1">
                        <div className="text-xs font-bold text-white tracking-wide truncate" style={{ fontFamily: bodyFont }}>{color.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{color.hex}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Preview Bento */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: headingFont }}>Typography System</h2>
                <div className="grid grid-cols-1 gap-6">
                  {/* Heading Preview */}
                  <div className={`p-8 sm:p-12 border border-white/5 rounded-[2rem] space-y-8 relative overflow-hidden transition-colors duration-500 ${headingDark ? 'bg-[#000000]' : 'bg-[#FFFFFF]'}`}>
                    <div className="absolute top-4 right-4 flex items-center bg-slate-500/10 backdrop-blur-md rounded-full p-1 border border-slate-500/20">
                       <button onClick={() => setHeadingDark(false)} className={`p-1.5 rounded-full transition-colors ${!headingDark ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-700'}`} title="Light Mode"><Sun size={12} /></button>
                       <button onClick={() => setHeadingDark(true)} className={`p-1.5 rounded-full transition-colors ${headingDark ? 'bg-slate-900 shadow-sm text-white' : 'text-slate-400 hover:text-white'}`} title="Dark Mode"><Moon size={12} /></button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-500/10 pb-4">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${headingDark ? 'text-slate-400' : 'text-slate-500'}`}>Primary Heading</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${headingDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'}`}>{headingFont}</span>
                    </div>
                    <div>
                        <div className={`text-4xl sm:text-5xl md:text-6xl font-medium leading-tight tracking-tight mb-8 ${headingDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: headingFont }}>
                            The quick brown fox jumps over the lazy dog.
                        </div>
                        <div className={`text-xs sm:text-sm font-medium tracking-widest uppercase overflow-hidden whitespace-nowrap overflow-ellipsis ${headingDark ? 'text-slate-500' : 'text-slate-400'}`} style={{ fontFamily: headingFont }}>
                            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
                        </div>
                    </div>
                  </div>

                  {/* Body Preview */}
                  <div className={`p-8 sm:p-12 border border-white/5 rounded-[2rem] space-y-8 relative overflow-hidden transition-colors duration-500 ${bodyDark ? 'bg-[#000000]' : 'bg-[#FFFFFF]'}`}>
                    <div className="absolute top-4 right-4 flex items-center bg-slate-500/10 backdrop-blur-md rounded-full p-1 border border-slate-500/20">
                       <button onClick={() => setBodyDark(false)} className={`p-1.5 rounded-full transition-colors ${!bodyDark ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-700'}`} title="Light Mode"><Sun size={12} /></button>
                       <button onClick={() => setBodyDark(true)} className={`p-1.5 rounded-full transition-colors ${bodyDark ? 'bg-slate-900 shadow-sm text-white' : 'text-slate-400 hover:text-white'}`} title="Dark Mode"><Moon size={12} /></button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-500/10 pb-4">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${bodyDark ? 'text-slate-400' : 'text-slate-500'}`}>Body Text</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${bodyDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'}`}>{bodyFont}</span>
                    </div>
                    <div>
                        <div className={`text-lg sm:text-xl leading-relaxed max-w-3xl mb-8 ${bodyDark ? 'text-slate-300' : 'text-slate-600'}`} style={{ fontFamily: bodyFont }}>
                            Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.
                        </div>
                        <div className={`text-[10px] font-mono tracking-widest uppercase ${bodyDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Assets Downloads */}
              {(driveLink || figmaLink) && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: headingFont }}>Raw Design Files</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {driveLink && (
                      <a href={driveLink} target="_blank" rel="noopener noreferrer" className="p-6 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-4 group">
                        <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all">
                          <FolderDown size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white mb-1">Brand Assets Folder</div>
                          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            Google Drive / Dropbox <ExternalLink size={10} />
                          </div>
                        </div>
                      </a>
                    )}
                    {figmaLink && (
                      <a href={figmaLink} target="_blank" rel="noopener noreferrer" className="p-6 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-4 group">
                        <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-105 transition-all">
                          <FileCode2 size={24} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white mb-1">Source Design File</div>
                          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            Figma <ExternalLink size={10} />
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* THE PRO DELIVERY HOOK */}
            <div className="mt-auto p-8 sm:p-14 bg-white/5 border-t border-white/5 backdrop-blur-sm">
               <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 text-center lg:text-left">
                    <h4 className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: headingFont }}>Publish & Share</h4>
                    <p className="text-slate-400 text-sm font-medium" style={{ fontFamily: bodyFont }}>Generate a secure, read-only link for {clientName || 'your client'}.</p>
                  </div>
                  
                  <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
                     <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                       <button 
                          onClick={handleExportPDF}
                          disabled={isProcessing}
                          className="w-full sm:w-auto px-8 py-5 bg-white/10 text-white rounded-[2rem] font-bold text-sm tracking-wide flex items-center justify-center gap-3 hover:bg-white/20 active:scale-95 transition-all outline-none disabled:opacity-50"
                       >
                         {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} className="text-slate-400" />}
                         Export as PDF
                       </button>
                       <button 
                          onClick={handleGenerateLink}
                          disabled={isProcessing}
                          className="w-full sm:w-auto px-8 sm:px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-bold text-sm tracking-wide flex items-center justify-center gap-3 hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/10 group disabled:opacity-50"
                       >
                         {isProcessing ? (
                           <Loader2 size={18} className="animate-spin text-slate-400" />
                         ) : isLinkCopied ? (
                           <Copy size={18} className="text-green-500" />
                         ) : (
                           <LinkIcon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                         )}
                         {isLinkCopied ? 'Copy Link' : 'Generate Secure Link'}
                       </button>
                     </div>
                     
                     <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 group cursor-help grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider group-hover:text-white">Password Protect</span>
                          <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[8px] font-black rounded border border-indigo-500/30 uppercase">Pro</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-help grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider group-hover:text-white">Custom Domain</span>
                          <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[8px] font-black rounded border border-indigo-500/30 uppercase">Pro</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Accordion Section */}
      <div className="max-w-5xl mx-auto py-16 border-t border-slate-200 mt-12">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: headingFont }}>The Zero-Friction Brand Handoff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left pt-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: headingFont }}>The Old Way: Scattered Assets</h3>
              <p className="text-slate-600 leading-relaxed font-medium" style={{ fontFamily: bodyFont }}>
                Sending your client a disorganized zip file with varying versions of logos, colors, and raw files diminishes your perceived value. It inevitably leads to scattered email chains, version control nightmares, and clients using the wrong hex codes.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: headingFont }}>The New Way: Unified Vault</h3>
              <p className="text-slate-600 leading-relaxed font-medium" style={{ fontFamily: bodyFont }}>
                A structured, hosted brand vault acts as a single, immutable source of truth. It justifies higher project retainers by providing the client's internal marketing team with a professional portal they can reference long after the engagement ends.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-12">
          {[
            {
              q: "Why use a digital vault instead of a zip file?",
              a: "Zip files get lost in email threads. A secure, hosted URL provides a single, immutable source of truth for the client's internal marketing team."
            },
            {
              q: "Does generating a brand vault consume a credit?",
              a: "Yes. Exporting the vault to PDF or generating a live hosted link utilizes one freemium credit."
            },
            {
              q: "Where is the client data saved after I generate it?",
              a: "All generated vaults are securely stored in your internal Agency Workspaces tab for easy retrieval, editing, and duplication."
            },
            {
              q: "Can I password-protect the client link?",
              a: "Password protection, access expiration, and custom domain routing (e.g., vault.youragency.com) are available exclusively on the Agency Pro plan."
            },
            {
              q: "What happens if I update the colors or logos later?",
              a: "If you share a live link, any saved changes you make from your dashboard will automatically update on the client's end, eliminating version control issues."
            },
            {
              q: "Can the client download the raw design files from this portal?",
              a: "Yes. You can link your Figma, Google Drive, or Dropbox folders directly inside the vault settings for secure raw asset delivery."
            }
          ].map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="border-b border-slate-200 last:border-0 bg-transparent">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-600 transition-colors pr-8" style={{ fontFamily: headingFont }}>{faq.q}</h3>
                  <div className={`p-2 rounded-full transition-colors flex-shrink-0 ${isOpen ? 'bg-slate-100' : 'bg-transparent text-slate-400 group-hover:bg-slate-50'}`}>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="pb-6 pr-12">
                        <p className="text-slate-600 leading-relaxed font-medium" style={{ fontFamily: bodyFont }}>
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
