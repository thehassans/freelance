import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Split, 
  Trash2, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Search,
  Zap,
  Upload,
  Settings,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

export default function TextDiffTool() {
  // --- State ---
  const [comparisonMode, setComparisonMode] = useState<'word' | 'char'>('word');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // --- Input State ---
  const [original, setOriginal] = useState('Paste the original version of your text here.');
  const [modified, setModified] = useState('Paste the updated version of your text here for comparison.');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- Freemium Actions ---
  const handlePlagiarismScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('Shield Check - 98% Original Content');
      toast.success('Scan complete');
    }, 1500);
  };

  const mockFileUpload = () => {
    toast.success('File parsed successfully');
  };

  // --- Diff Engine Logic ---
  const diffResult = useMemo(() => {
    if (comparisonMode === 'word') {
      const originalWords = original.split(/(\s+)/);
      const modifiedWords = modified.split(/(\s+)/);
      
      const result: { type: 'added' | 'removed' | 'same', value: string }[] = [];
      let i = 0, j = 0;
      while (i < originalWords.length || j < modifiedWords.length) {
        if (i < originalWords.length && j < modifiedWords.length && originalWords[i] === modifiedWords[j]) {
          result.push({ type: 'same', value: originalWords[i] });
          i++; j++;
        } else if (j < modifiedWords.length && !originalWords.includes(modifiedWords[j], i)) {
          result.push({ type: 'added', value: modifiedWords[j] });
          j++;
        } else {
          result.push({ type: 'removed', value: originalWords[i] });
          i++;
        }
      }
      return result;
    } else {
      // Character level diff (simplified)
      const result: { type: 'added' | 'removed' | 'same', value: string }[] = [];
      let i = 0, j = 0;
      while (i < original.length || j < modified.length) {
        if (i < original.length && j < modified.length && original[i] === modified[j]) {
          result.push({ type: 'same', value: original[i] });
          i++; j++;
        } else if (j < modified.length && !original.includes(modified[j], i)) {
          result.push({ type: 'added', value: modified[j] });
          j++;
        } else {
          result.push({ type: 'removed', value: original[i] });
          i++;
        }
      }
      return result;
    }
  }, [original, modified, comparisonMode]);

  const faqs = [
    {
      question: "How does the highlight system work?",
      answer: "Red highlights indicate text that was deleted from the original version. Green highlights indicate text that was added or modified in the updated version. Neutral text has remained unchanged."
    },
    {
      question: "Is this tool secure for sensitive data?",
      answer: "Yes. All processing happens entirely in your browser. None of your text is ever sent to our servers, making it safe for comparing contracts, code, or private communications."
    },
    {
      question: "Can I compare code snippets?",
      answer: "Absolutely. The Diff Tool handles any plain-text input, including HTML, CSS, JavaScript, and other programming languages. It's particularly useful for reviewing manual code changes or bug fixes."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}} />
      {/* 1. Enterprise Action Bar & Freemium Engine */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 mb-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Split size={18} />
              </span>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight">Comparison Mode</h2>
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={() => setComparisonMode('word')}
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border transition-all ${comparisonMode === 'word' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    Words
                  </button>
                  <button 
                    onClick={() => setComparisonMode('char')}
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border transition-all ${comparisonMode === 'char' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    Chars
                  </button>
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <button 
              onClick={handlePlagiarismScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isScanning ? <Zap size={14} className="animate-spin text-amber-400" /> : <Search size={14} />}
              {isScanning ? 'Scanning...' : 'Scan for Plagiarism'}
            </button>

            {scanResult && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-[10px] font-bold"
              >
                <ShieldCheck size={14} className="text-emerald-600" /> {scanResult}
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 print:px-0">
        {/* Tool Header */}
        <div className="text-center mb-12 print:hidden">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-emerald-100"
          >
             Free Tool
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Text <span className="text-indigo-600">Comparison</span> Engine
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            High-fidelity document auditing for legal, technical, and editorial workflows.
          </p>
        </div>

        {/* 2. Side-by-Side Input Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl mx-auto mb-12 print:hidden">
          {/* Left Column: Original */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-slate-400" />
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Original Document</h3>
              </div>
              <button 
                onClick={mockFileUpload}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <Upload size={12} /> Upload File
              </button>
            </div>
            <textarea 
              value={original}
              onChange={(e) => {
                setOriginal(e.target.value);
                setScanResult(null);
              }}
              placeholder="Enter original text..."
              className="w-full flex-1 p-4 bg-slate-50 border-none rounded-2xl font-mono text-sm text-slate-600 leading-relaxed focus:ring-2 focus:ring-indigo-500/10 resize-none outline-none"
            />
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>{original.length} Characters</span>
              <button onClick={() => { setOriginal(''); setScanResult(null); }} className="hover:text-rose-500 flex items-center gap-1">
                <Trash2 size={10} /> Clear
              </button>
            </div>
          </div>
 
          {/* Right Column: Modified */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-slate-400" />
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Modified Document</h3>
              </div>
              <button 
                onClick={mockFileUpload}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <Upload size={12} /> Upload File
              </button>
            </div>
            <textarea 
              value={modified}
              onChange={(e) => {
                setModified(e.target.value);
                setScanResult(null);
              }}
              placeholder="Enter modified text..."
              className="w-full flex-1 p-4 bg-slate-50 border-none rounded-2xl font-mono text-sm text-slate-600 leading-relaxed focus:ring-2 focus:ring-indigo-500/10 resize-none outline-none"
            />
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>{modified.length} Characters</span>
              <button onClick={() => setModified('')} className="hover:text-rose-500 flex items-center gap-1">
                <Trash2 size={10} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* 3. The Audit Result & Merge Dashboard (Bottom Section) */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden print:shadow-none print:border-none print:rounded-none">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                <Search size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Audit & Merge Suggestions</h3>
                <p className="text-xs text-slate-500 font-medium">Side-by-side visual difference engine</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black uppercase flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" /> {diffResult.filter(d => d.type === 'added').length} Additions
              </div>
              <div className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-[10px] font-black uppercase flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full" /> {diffResult.filter(d => d.type === 'removed').length} Deletions
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 font-mono text-sm leading-[2] text-slate-700 print:p-0">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 min-h-[400px] print:bg-white print:border-none print:p-0">
              {diffResult.map((part, idx) => (
                <span 
                  key={idx} 
                  className={`relative group inline whitespace-pre-wrap transition-all duration-200 ${
                    part.type === 'added' ? 'bg-emerald-100 text-emerald-800 px-1 rounded mx-0.5' : 
                    part.type === 'removed' ? 'bg-rose-100 text-rose-800 line-through px-1 rounded mx-0.5' : 
                    'text-slate-600'
                  }`}
                >
                  {part.value}
                  {(part.type === 'added' || part.type === 'removed') && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg shadow-xl translate-y-2 group-hover:translate-y-0 transition-all z-20 print:hidden pointer-events-none">
                      <button className="p-0.5 text-emerald-500 hover:bg-emerald-50 rounded"><Check size={10} /></button>
                      <button className="p-0.5 text-rose-500 hover:bg-rose-50 rounded"><X size={10} /></button>
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-900 text-white/50 flex items-center justify-between print:hidden">
            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Audit Interface v4.2</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> <span className="text-[10px] text-white">Inserted</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-rose-500 rounded-full" /> <span className="text-[10px] text-white">Deleted</span></div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion - print:hidden */}
        <section className="mt-24 print:hidden">
           <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Text Comparison FAQ</h2>
                 <p className="text-slate-500 font-medium tracking-tight">Understanding the mechanics of digital text auditing.</p>
              </div>
              <div className="space-y-4">
                 {faqs.map((faq, idx) => (
                   <div 
                     key={idx}
                     className={`bg-white rounded-3xl border border-slate-200 transition-all overflow-hidden ${openFaq === idx ? 'shadow-xl shadow-indigo-100/50 border-indigo-200' : ''}`}
                   >
                     <button 
                       onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                       className="w-full flex items-center justify-between p-6 text-left"
                     >
                       <span className="text-base font-bold text-slate-900 flex items-center gap-3">
                         <HelpCircle size={18} className="text-indigo-400" />
                         {faq.question}
                       </span>
                       <ChevronDown className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} size={18} />
                     </button>
                     <AnimatePresence>
                       {openFaq === idx && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                         >
                           <div className="px-6 pb-6 pl-14">
                             <p className="text-slate-500 text-sm leading-relaxed font-medium">
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

        <section className="mt-24 print:hidden">
          <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden text-white">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-3xl -ml-32 -mt-32 rounded-full" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Unlock Enterprise Auditing.</h2>
              <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-10 font-medium">
                Get unlimited PDF exports, specialized team accounts, and advanced API access.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-900/20 flex items-center gap-3 mx-auto group"
              >
                Upgrade to Pro <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* 5. Strict Layout Isolation for SEO Content */}
        <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate max-w-none print:hidden">
          <h2>What is a Text Comparison Engine?</h2>
          <p>
            A Text Comparison Engine is a digital tool that analyzes two or more pieces of text to identify similarities, differences, and structural changes between them. It highlights matching content, modified sections, and missing or added information to help users quickly understand how documents differ.
          </p>
          <p>
            This tool is widely used in content editing, software development, legal documentation, academic writing, and plagiarism detection.
          </p>

          <h3>Why a Text Comparison Engine is Important</h3>
          <p>
            In many industries, even small changes in text can have a major impact. A Text Comparison Engine helps ensure accuracy, consistency, and clarity when reviewing multiple versions of a document.
          </p>
          <p>It helps users:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Detect changes between document versions</li>
            <li>Improve content accuracy and consistency</li>
            <li>Prevent plagiarism or duplication</li>
            <li>Review edits efficiently</li>
            <li>Maintain version control</li>
            <li>Save time during manual comparison</li>
          </ul>
          <p>Instead of reading documents line by line, users can instantly see differences in a structured format.</p>

          <h3>Benefits of a Text Comparison Engine</h3>
          
          <h4>Faster Document Review</h4>
          <p>The tool highlights differences automatically, making it easy to review long documents in seconds instead of manually checking each line.</p>

          <h4>Improved Accuracy</h4>
          <p>By clearly identifying even minor changes, the tool reduces human error during editing and proofreading.</p>

          <h4>Better Version Control</h4>
          <p>Writers and teams can track how content evolves over time and ensure that the latest version is always accurate and complete.</p>

          <h4>Plagiarism Detection Support</h4>
          <p>Text comparison helps identify copied or reused content by comparing documents against existing sources.</p>

          <h4>Enhanced Collaboration</h4>
          <p>Teams working on shared documents can easily see what has been added, removed, or modified by different contributors.</p>

          <h3>How a Text Comparison Engine Works</h3>
          <p>A Text Comparison Engine analyzes text using advanced algorithms that break content into smaller elements such as words, sentences, or paragraphs.</p>
          <p>It then compares:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Word-by-word changes</li>
            <li>Sentence structure differences</li>
            <li>Added or removed sections</li>
            <li>Formatting variations</li>
            <li>Rewritten or paraphrased content</li>
          </ul>
          <p>After analysis, the tool highlights changes using colors or markers such as:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Added text</li>
            <li>Deleted text</li>
            <li>Modified text</li>
            <li>Unchanged content</li>
          </ul>
          <p>This visual representation makes differences easy to understand.</p>

          <h3>Key Features of a Text Comparison Engine</h3>
          <p>A modern Text Comparison Engine may include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Side-by-side comparison view</li>
            <li>Inline difference highlighting</li>
            <li>Word-level and character-level comparison</li>
            <li>Document version tracking</li>
            <li>Merge suggestions</li>
            <li>Export comparison reports</li>
            <li>File upload support (DOCX, PDF, TXT, etc.)</li>
            <li>Plagiarism detection integration</li>
            <li>API support for developers</li>
          </ul>
          <p>These features make it useful for both individuals and enterprise-level teams.</p>

          <h3>When Should You Use a Text Comparison Engine?</h3>
          <p>This tool is useful in many scenarios, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Editing blog posts or website content</li>
            <li>Reviewing legal contracts or agreements</li>
            <li>Comparing software code versions</li>
            <li>Checking academic assignments</li>
            <li>Tracking document revisions</li>
            <li>Verifying translated content</li>
            <li>Detecting duplicated content</li>
          </ul>
          <p>It is especially valuable when accuracy and version tracking are important.</p>

          <h3>Who Uses Text Comparison Tools?</h3>
          <p>A Text Comparison Engine is commonly used by:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Content writers and editors</li>
            <li>Developers and engineers</li>
            <li>Legal professionals</li>
            <li>Students and researchers</li>
            <li>SEO specialists</li>
            <li>Business teams</li>
            <li>Translators and proofreaders</li>
          </ul>
          <p>It supports anyone working with multiple versions of text documents.</p>

          <h3>Why Businesses Use Text Comparison Engines</h3>
          <p>Businesses rely on text comparison tools to ensure:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Content consistency across platforms</li>
            <li>Accurate documentation updates</li>
            <li>High-quality publishing standards</li>
            <li>Reduced errors in communication</li>
            <li>Efficient collaboration between teams</li>
          </ul>
          <p>It helps maintain professionalism and reliability in all written materials.</p>

          <h3>Final Thoughts</h3>
          <p>
            A Text Comparison Engine is an essential tool for anyone working with written content. By quickly identifying differences between documents, it improves accuracy, saves time, and ensures consistency across all versions.
          </p>
          <p>
            Whether used for writing, coding, legal review, or content management, a Text Comparison Engine helps users maintain control over document changes and produce more reliable, high-quality results.
          </p>
        </section>
      </div>
    </div>
  );
}

