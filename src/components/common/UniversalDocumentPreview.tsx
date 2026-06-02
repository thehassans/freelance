import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, ShieldCheck, Download, Printer } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useProtectedExport } from '../../hooks/useProtectedExport';
import FreemiumExportWrapper from './FreemiumExportWrapper';

interface UniversalDocumentPreviewProps {
  children: React.ReactNode;
  isLoading?: boolean;
  documentName?: string;
  onExportStart?: () => void;
  onExportEnd?: () => void;
  primaryColor?: string;
  hideControls?: boolean;
  extraActions?: React.ReactNode;
  toolId?: string;
  containerClassName?: string;
}

export default function UniversalDocumentPreview({ 
  children, 
  isLoading = false, 
  documentName = "Document",
  onExportStart,
  onExportEnd,
  primaryColor = "#0f4c75",
  hideControls = false,
  extraActions,
  toolId,
  containerClassName
}: UniversalDocumentPreviewProps) {
  const { isPro } = useUser();
  const { handleProtectedExport } = useProtectedExport();
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!paperRef.current) return;

    handleProtectedExport(async () => {
      if (onExportStart) onExportStart();

      try {
        // @ts-ignore - html2pdf is often loaded as a global or needs dynamic import
        const html2pdf = (await import('html2pdf.js')).default;
        
        const opt = {
          margin: 0,
          filename: `${documentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        const pdfObj = html2pdf().from(paperRef.current).set(opt);
        const pdfInstance = await pdfObj.toPdf().get('pdf');
        const blob = await pdfInstance.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = opt.filename;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('PDF Export Error:', error);
      } finally {
        if (onExportEnd) onExportEnd();
      }
    }, 'PDF Export');
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-[600px] relative">
      <FreemiumExportWrapper toolId={toolId || ''}>
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg mb-2 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isLoading ? 'bg-amber-400' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isLoading ? 'Generating...' : 'Live Preview'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {extraActions && extraActions}
            {!hideControls && (
              <>
                {!isPro && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">
                    <ShieldCheck size={12} className="text-amber-500/50" /> Watermarked
                  </div>
                )}
                <button 
                  type="button"
                  onClick={handlePrint}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer active:scale-95"
                  title="Print Document"
                >
                  <Printer size={18} />
                </button>
                <button 
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isLoading}
                  className="flex items-center gap-2 py-2.5 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/20 active:scale-95 cursor-pointer"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {isLoading ? 'Exporting...' : 'Get PDF'}
                </button>
              </>
            )}
          </div>
        </div>
      </FreemiumExportWrapper>

      <div 
        ref={containerRef}
        className="flex-grow bg-slate-100 rounded-[2.5rem] p-2 sm:p-4 md:p-6 overflow-auto flex justify-center items-start border border-slate-200/50 inner-shadow min-h-[800px] scroll-smooth"
      >
        <div 
          className={`relative group p-2 sm:p-4 w-full ${containerClassName || 'max-w-4xl'} mx-auto`}
        >
          <div 
            ref={paperRef}
            className={`w-full ${containerClassName || 'max-w-4xl'} mx-auto bg-white shadow-2xl relative overflow-hidden flex flex-col print:shadow-none transition-shadow duration-500 group-hover:shadow-3xl`}
            style={{ 
              padding: '24px 16px',
            }}
          >
            {isLoading ? (
              <div className="flex flex-col gap-8 opacity-40 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="w-48 h-12 bg-slate-100 rounded-lg" />
                  <div className="w-32 h-32 bg-slate-50 rounded-2xl" />
                </div>
                <div className="space-y-4">
                  <div className="w-full h-8 bg-slate-100 rounded-lg" />
                  <div className="w-3/4 h-8 bg-slate-100 rounded-lg" />
                </div>
                <div className="space-y-6 mt-12">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-full h-4 bg-slate-50 rounded-full" />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                   <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <span className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Crafting Document...</span>
                   </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-grow">
                  {children}
                </div>
                
                {!isPro && (
                  <div className="mt-auto pt-12 text-center">
                    <div className="py-4 border-t border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                        Generated safely by <span className="text-primary/40">FreelancerKit.io</span>
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
