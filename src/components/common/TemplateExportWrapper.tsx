import React from 'react';
import { FileText, Printer, Calendar, Shield, CheckSquare, Grid } from 'lucide-react';

export type TemplateFormatType = 'spreadsheet' | 'document' | 'checklist';

interface TemplateExportWrapperProps {
  title: string;
  formatType: TemplateFormatType;
  contentData: any;
}

export default function TemplateExportWrapper({ title, formatType, contentData }: TemplateExportWrapperProps) {
  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const renderContent = () => {
    switch (formatType) {
      case 'spreadsheet':
        return (
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-[10px] sm:text-sm border-collapse border border-slate-300 print:table">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-400">
                  {contentData.headers?.map((header: string, i: number) => (
                    <th key={i} className="px-4 py-2 text-left font-black text-slate-800 uppercase tracking-wider border-r border-slate-300 last:border-r-0">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contentData.rows?.map((row: any[], i: number) => (
                  <tr key={i} className="border-b border-slate-200 print:even:bg-slate-50/80">
                    {row.map((cell: any, j: number) => (
                      <td key={j} className={`px-4 py-2 border-r border-slate-200 last:border-r-0 font-medium text-slate-700 ${cell && cell.toString().startsWith('$') ? 'text-right font-mono' : ''}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {contentData.notes && (
              <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Internal Calculation Notes:</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{contentData.notes}</p>
              </div>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="prose print:prose-slate max-w-none prose-sm sm:prose-base prose-headings:text-slate-900 prose-p:text-slate-700 prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed">
            {contentData.sections?.map((section: any, i: number) => (
              <div key={i} className="mb-10 print:break-inside-avoid">
                {section.title && <h2 className="text-xl md:text-2xl mb-6 flex items-center gap-2 border-b border-slate-100 pb-2 uppercase tracking-tighter">{section.title}</h2>}
                <div className="space-y-4">
                  {section.paragraphs?.map((p: string, j: number) => (
                    <p key={j} className="text-justify">{p}</p>
                  ))}
                  {section.list && (
                    <ul className="space-y-2 mt-4">
                      {section.list.map((item: string, k: number) => (
                        <li key={k} className="flex gap-2">
                          <span className="text-slate-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            {contentData.signatures && (
              <div className="mt-16 grid grid-cols-2 gap-12 print:break-inside-avoid">
                <div className="border-t border-slate-900 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Service Provider Signature</p>
                  <div className="h-10 border-b border-dashed border-slate-300" />
                  <p className="mt-2 text-xs font-bold text-slate-900">For FreelancerKit Enterprise</p>
                </div>
                <div className="border-t border-slate-900 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Client Authorization Signature</p>
                  <div className="h-10 border-b border-dashed border-slate-300" />
                  <p className="mt-2 text-xs font-bold text-slate-900">Authorized Signatory</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'checklist':
        return (
          <div className="grid grid-cols-1 print:grid-cols-2 gap-4 print:gap-x-12 print:gap-y-6">
            {contentData.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 print:border-slate-200 print:break-inside-avoid shadow-sm print:shadow-none bg-white">
                <div className="mt-1 w-5 h-5 rounded border-2 border-slate-300 shrink-0 print:border-slate-400 flex items-center justify-center">
                   {/* This simulates an empty checkbox */}
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 tracking-tight text-sm uppercase">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
           <div className="p-8 border border-dashed border-slate-200 rounded-3xl text-center">
              <p className="text-slate-400 font-bold">Standard Asset Export - Raw Data Preview</p>
              <pre className="mt-4 text-xs text-left bg-slate-50 p-4 rounded-xl overflow-auto whitespace-pre-wrap">
                 {JSON.stringify(contentData, null, 2)}
              </pre>
           </div>
        );
    }
  };

  return (
    <div className="hidden print:block print:w-full print:bg-white print:text-black min-h-screen p-8 sm:p-12">
      {/* PDF Header */}
      <div className="flex justify-between items-start mb-16 border-b-8 border-slate-900 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[#0f4c75]">
            <Shield size={32} className="fill-current" />
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter italic uppercase leading-none">FreelancerKit</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Professional Asset Hub</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md">
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Asset ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2 leading-none">{title}</h1>
          <div className="flex items-center justify-end gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
               <Calendar size={14} className="text-slate-300" />
               <span>Exported on: {timestamp}</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="flex items-center gap-1.5">
               <Printer size={14} className="text-slate-300" />
               <span>Print-Ready v1.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        <div className="absolute top-0 right-0 opacity-[0.03] -z-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
           {formatType === 'spreadsheet' ? <Grid size={600} /> : formatType === 'checklist' ? <CheckSquare size={600} /> : <FileText size={600} />}
        </div>
        
        <div className="relative z-10">
           {renderContent()}
        </div>
      </div>

      {/* PDF Footer */}
      <div className="print:fixed print:bottom-0 print:left-0 print:right-0 p-10 bg-white border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
        <div className="flex items-center gap-6">
           <span>&copy; {new Date().getFullYear()} FreelancerKit Enterprise</span>
           <span className="w-1 h-1 bg-slate-200 rounded-full" />
           <span>Terms of Use: Registered Site Asset</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="px-2 py-1 border border-slate-100 rounded">Verified Document</span>
           <div className="flex items-center gap-1">
              <span>Page </span>
              <span className="print:after:content-[counter(page)]"></span>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: auto; margin: 0; }
          body { 
            margin: 0;
            -webkit-print-color-adjust: exact;
          }
          nav, footer, button, .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
}
