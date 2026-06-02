import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code, 
  ShieldCheck, 
  Zap, 
  ChevronDown, 
  Copy, 
  Check, 
  Trash2, 
  AlignLeft, 
  Maximize2, 
  AlertCircle,
  HelpCircle,
  Cpu,
  FileJson,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [spacing, setSpacing] = useState<string>('2');
  const [isValidJson, setIsValidJson] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFormat = (jsonInput: string, currentSpacing: string) => {
    if (!jsonInput.trim()) {
      setOutput('');
      setError(null);
      setIsValidJson(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      setIsValidJson(true);
      setError(null);
      if (currentSpacing === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else {
        const spaceVal = parseInt(currentSpacing, 10) || 2;
        setOutput(JSON.stringify(parsed, null, spaceVal));
      }
    } catch (err: any) {
      setIsValidJson(false);
      const errMsg = err.message || 'Invalid JSON format';
      setError(errMsg);
      setOutput(errMsg);
    }
  };

  const handleBeautify = () => {
    let nextSpacing = spacing;
    if (spacing === 'minify') {
      nextSpacing = '2';
      setSpacing('2');
    }
    triggerFormat(input, nextSpacing);
  };

  const handleMinify = () => {
    setSpacing('minify');
    triggerFormat(input, 'minify');
  };

  const handleLoadExample = () => {
    const example = JSON.stringify({
      appName: "FlowState Studio",
      version: "1.4.2",
      active: true,
      stats: {
        totalUsers: 12850,
        weeklyRetention: 82.5,
        uptimePercent: 99.98
      },
      supportedFeatures: [
        "JSON Formatting & Validation",
        "Diff Inspection Engine",
        "WCAG Contrast Auditor",
        "Custom Presets"
      ],
      preferences: {
        theme: "Developer Dark",
        autoSave: true,
        editor: {
          tabSize: 2,
          fontSize: 14,
          wrapLines: false
        }
      },
      metadata: [
        {
          id: "item-001",
          tags: ["prod", "utility"]
        },
        {
          id: "item-002",
          tags: ["beta", "test"]
        }
      ]
    }, null, 2);
    
    setInput(example);
    triggerFormat(example, spacing === 'minify' ? '2' : spacing);
    if (spacing === 'minify') {
      setSpacing('2');
    }
    toast.success('Example JSON loaded successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      triggerFormat(text, spacing);
      toast.success('File loaded successfully');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValidJson(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Tool Header */}
      <div className="text-center mb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-amber-100"
        >
          <Zap size={12} /> Privacy-First Developer Tools
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          JSON <span className="text-amber-600">Formatter</span> & Validator
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Beautify, minify, and validate your JSON data with 100% local processing. No data ever leaves your device.
        </p>
      </div>

      <div className="space-y-6">
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 overflow-hidden"
            >
              <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="font-black text-red-900 text-sm uppercase tracking-tight">Syntax Error Detected</p>
                <p className="text-red-700 font-mono text-xs">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Input Side */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Input Raw JSON</label>
               <div className="flex items-center gap-2.5">
                 <button 
                   onClick={handleLoadExample}
                   className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors bg-transparent border-none cursor-pointer outline-none"
                 >
                   Load Example
                 </button>
                 <span className="text-slate-300 text-xs">|</span>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer outline-none"
                 >
                   <Upload size={10} /> Upload File
                 </button>
                 <span className="text-slate-300 text-xs">|</span>
                 <button 
                   onClick={clearAll}
                   className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer outline-none"
                 >
                   <Trash2 size={11} /> Clear
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileUpload} 
                   accept=".json" 
                   className="hidden" 
                 />
               </div>
            </div>
            <div className="relative flex-1 group">
              <textarea 
                value={input}
                onChange={(e) => {
                  const val = e.target.value;
                  setInput(val);
                  triggerFormat(val, spacing);
                }}
                placeholder='Paste your JSON here (e.g. {"name": "FlowState"})'
                className="w-full h-[500px] p-8 bg-white border border-slate-200 rounded-[2.5rem] focus:outline-none focus:border-amber-500 font-mono text-sm leading-relaxed shadow-sm transition-all resize-none group-hover:border-slate-300"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleBeautify}
                className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                <AlignLeft size={16} /> Beautify JSON
              </button>
              <button 
                onClick={handleMinify}
                className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Maximize2 size={16} /> Minify JSON
              </button>
            </div>
          </div>

          {/* Output Side */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1 h-6">
               <div className="flex items-center gap-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Formatted Output</label>
                 {isValidJson !== null && (
                   <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                     isValidJson 
                     ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                     : 'bg-rose-50 text-rose-600 border-rose-100'
                   }`}>
                     {isValidJson ? 'Valid JSON' : 'Invalid JSON'}
                   </span>
                 )}
               </div>

               {/* Spacing Controls Dropdown */}
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spacing:</span>
                 <select 
                   value={spacing}
                   onChange={(e) => {
                     const val = e.target.value;
                     setSpacing(val);
                     triggerFormat(input, val);
                   }}
                   className="text-[10px] font-black bg-white border border-slate-200 text-slate-750 rounded-lg px-2 py-1 outline-none focus:border-amber-500 cursor-pointer"
                 >
                   <option value="2">2 Spaces</option>
                   <option value="3">3 Spaces</option>
                   <option value="4">4 Spaces</option>
                   <option value="minify">Minified (Compact)</option>
                 </select>
               </div>
            </div>
            <div className="relative flex-1">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={handleCopy}
                  disabled={!output}
                  className={`p-3 rounded-xl transition-all border ${
                    output 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-white/5 border-white/5 text-slate-700 cursor-not-allowed'
                  }`}
                  title="Copy to Clipboard"
                >
                  {isCopying ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
              <div className="w-full h-[500px] bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-auto group">
                {output ? (
                  <pre className={`p-8 font-mono text-sm leading-relaxed ${isValidJson === false ? 'text-rose-500' : 'text-amber-400'}`}>
                    <code>{output}</code>
                  </pre>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center space-y-4">
                    <FileJson size={48} className="opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest opacity-40">Ready for processing</p>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block h-[56px]" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Strictly Isolated SEO Content Section */}
      <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">What is a JSON Formatter & Validator?</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-8">
          A JSON Formatter & Validator is a tool used to organize and check JSON (JavaScript Object Notation) data. It makes messy data easy for humans to read and ensures the code is structurally correct before being used in software applications.
        </p>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Why Use These Tools?</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-6">
          Developers frequently use JSON to transfer data between servers and apps. However, this data is often exported as a single, dense line without spaces to save storage space (called minifying). A Formatter & Validator tackles this through two main functions:
        </p>

        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">1. Formatting (Beautifying)</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              It takes compacted, hard-to-read JSON and restructures it with proper indentation, line breaks, and color-coding. This provides a clean, visual hierarchy making it easier to debug and understand.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">2. Validating</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              It checks the JSON code for syntax errors. It ensures that all brackets, quotes, and commas are properly placed according to JSON standards. If there is an error, the tool will instantly flag it, usually indicating the exact line number so you can fix it.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Common Features</h2>
        <p className="text-slate-600 leading-relaxed font-medium mb-4">
          Most JSON Formatter & Validator tools include the following features:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium mb-8">
          <li><strong>Error Highlighting:</strong> Pinpoints missing colons, unclosed strings, or trailing commas.</li>
          <li><strong>Tree View:</strong> Collapsible folders and arrays to easily navigate complex data structures.</li>
          <li><strong>Minification:</strong> Compresses the JSON back down into a single line to save space before deployment.</li>
        </ul>
      </section>
    </div>
  );
}
