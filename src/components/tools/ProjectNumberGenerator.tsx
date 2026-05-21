import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, Copy, Check, RotateCcw, Settings, Plus, Info, Zap, Calendar, User } from 'lucide-react';

export default function ProjectNumberGenerator() {
  const [prefix, setPrefix] = useState('INV');
  const [suffix, setSuffix] = useState('');
  const [startNumber, setStartNumber] = useState(1);
  const [padding, setPadding] = useState(4);
  const [includeYear, setIncludeYear] = useState(true);
  const [includeClientInitials, setIncludeClientInitials] = useState(false);
  const [clientInitials, setClientInitials] = useState('AC');
  const [count, setCount] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentYear = new Date().getFullYear().toString().slice(-2);

  const generatedNumbers = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const num = (startNumber + i).toString().padStart(padding, '0');
      let parts = [prefix];
      
      if (includeClientInitials && clientInitials) {
        parts.push(clientInitials.toUpperCase());
      }
      
      if (includeYear) {
        parts.push(currentYear);
      }
      
      parts.push(num);
      
      if (suffix) {
        parts.push(suffix);
      }
      
      return parts.filter(Boolean).join('-');
    });
  }, [prefix, suffix, startNumber, padding, includeYear, includeClientInitials, clientInitials, count]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Hash size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Number Architect</h3>
              <p className="text-xs text-slate-400">Standardize your document naming convention.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Prefix</label>
                <input 
                  type="text" 
                  value={prefix || ''}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. INV or PRJ"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Start Number</label>
                <input 
                  type="number" 
                  value={startNumber || 0}
                  onChange={(e) => setStartNumber(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Padding (Zeros)</label>
                <select 
                  value={padding || 4}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value={1}>No Padding (1)</option>
                  <option value={2}>Double (01)</option>
                  <option value={3}>Triple (001)</option>
                  <option value={4}>Quad (0001)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Suffix (Optional)</label>
                <input 
                  type="text" 
                  value={suffix || ''}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g. TAX"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 text-sm font-bold"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dynamic Components</h4>
              
              <div className="flex flex-wrap gap-4">
                 <button 
                  onClick={() => setIncludeYear(!includeYear)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2 ${includeYear ? 'bg-purple-50 border-purple-200 text-purple-600 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                 >
                   <Calendar size={14} /> Include Year ({currentYear})
                 </button>
                 
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIncludeClientInitials(!includeClientInitials)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2 ${includeClientInitials ? 'bg-purple-50 border-purple-200 text-purple-600 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      <User size={14} /> Client Initials
                    </button>
                    {includeClientInitials && (
                      <input 
                        type="text" 
                        value={clientInitials || ''}
                        onChange={(e) => setClientInitials(e.target.value.slice(0, 3))}
                        placeholder="XYZ"
                        className="w-16 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] uppercase font-black focus:outline-none focus:border-purple-500"
                      />
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 mx-1 p-6 rounded-3xl relative overflow-hidden group border border-purple-500/20 shadow-2xl">
           <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500/10 group-hover:scale-150 transition-transform duration-700" size={150} />
           <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-purple-500 text-white rounded-2xl shadow-lg shadow-purple-500/30">
                 <Info size={20} />
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Consistent numbering reduces "Lost Invoice" syndrome and makes project folders instantly searchable.
              </p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
           <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100 italic font-black text-xs">
                    #
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Batch Preview</h4>
              </div>
              <div className="flex items-center gap-3">
                 <label className="text-[9px] font-bold text-slate-400">Count</label>
                 <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                    {[5, 10, 20].map(v => (
                       <button 
                        key={v}
                        onClick={() => setCount(v)}
                        className={`px-2 py-1 rounded text-[9px] font-black transition-all ${count === v ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-slate-900'}`}
                       >
                         {v}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="p-4 sm:p-8 flex-grow space-y-3 overflow-y-auto max-h-[600px] no-scrollbar">
              {generatedNumbers.map((num, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={num}
                  className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-purple-200 rounded-2xl transition-all group"
                >
                  <span className="font-mono text-sm font-bold text-slate-800 tracking-wider transition-colors group-hover:text-purple-600">{num}</span>
                  <button 
                    onClick={() => copyToClipboard(num, i)}
                    className="p-2 bg-white rounded-xl border border-slate-100 hover:border-purple-500 hover:text-purple-500 transition-all shadow-sm"
                  >
                    {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </motion.div>
              ))}
           </div>

           <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setStartNumber(startNumber + count)}
                className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center justify-center gap-2 hover:border-purple-500 hover:text-purple-500 transition-all shadow-sm"
              >
                <Plus size={16} /> Sync Counter to Last Used
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
