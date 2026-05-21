import React from 'react';
import { motion } from 'motion/react';
import { X, Download, Copy, FileText, Table, Layout, CheckCircle2 } from 'lucide-react';
import { Template } from '../../lib/contentData';
import ReactMarkdown from 'react-markdown';

interface TemplatePreviewModalProps {
  template: Template;
  onClose: () => void;
  onExport: (template: Template) => void;
  onCopy: (content: string, id: string) => void;
  copyStatus: string | null;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onExport,
  onCopy,
  copyStatus
}) => {
  const contentToCopy = typeof template.contentData === 'string' 
    ? template.contentData 
    : template.content;

  const renderPreview = () => {
    if (template.formatType === 'spreadsheet' && template.contentData && typeof template.contentData !== 'string' && 'headers' in template.contentData) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {template.contentData.headers.map((header: string, i: number) => (
                  <th key={i} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {template.contentData.rows.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-sm text-slate-600 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {template.contentData.notes && (
            <div className="p-4 bg-amber-50/50 border-t border-amber-100 italic text-xs text-amber-800">
              Note: {template.contentData.notes}
            </div>
          )}
        </div>
      );
    }

    if (template.formatType === 'document' && template.contentData && typeof template.contentData !== 'string' && 'sections' in template.contentData) {
      return (
        <div className="max-w-2xl mx-auto bg-white shadow-xl shadow-slate-200/50 rounded-sm p-12 min-h-[800px] border border-slate-100">
          <div className="mb-10 pb-6 border-b-2 border-slate-900 flex justify-between items-end">
             <div>
               <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tight">
                 {template.title}
               </h3>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">
                 Agency Professional Standard • {new Date().getFullYear()}
               </p>
             </div>
             <div className="text-right">
               <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-tighter">
                 {template.category}
               </span>
             </div>
          </div>
          
          <div className="space-y-8">
            {template.contentData.sections.map((section: any, i: number) => (
              <div key={i} className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  {section.title || section.heading}
                </h4>
                {section.paragraphs?.map((p: string, pi: number) => (
                  <p key={pi} className="text-sm text-slate-600 leading-relaxed">
                    {p}
                  </p>
                ))}
                {(section.list || section.items) && (
                  <ul className="space-y-2">
                    {(section.list || section.items).map((item: string, li: number) => (
                      <li key={li} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              End of Document Preview
            </p>
          </div>
        </div>
      );
    }

    if (template.formatType === 'checklist' && template.contentData && typeof template.contentData !== 'string' && 'items' in template.contentData) {
      return (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-8 bg-slate-900 text-white">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              {template.title}
            </h3>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">
              Actionable Implementation Checklist
            </p>
          </div>
          <div className="p-8 space-y-4">
            {template.contentData.items.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 group hover:border-slate-300 transition-colors">
                <div className="w-6 h-6 rounded-md border-2 border-slate-200 shrink-0 group-hover:border-emerald-400 transition-colors" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto bg-white shadow-sm border border-slate-100 rounded-3xl p-10 prose prose-slate prose-sm max-w-none">
        <ReactMarkdown>{typeof template.contentData === 'string' ? template.contentData : template.content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
              {template.format === 'Excel' || template.format === 'Google Sheets' ? (
                <Table className="w-6 h-6 text-emerald-500" />
              ) : template.format === 'Notion' ? (
                <Layout className="w-6 h-6 text-indigo-500" />
              ) : (
                <FileText className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-2 py-0.5 bg-indigo-50 rounded-full">
                  {template.format}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {template.category}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{template.title}</h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
          {/* Sidebar info */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-100 p-8 flex flex-col shrink-0">
            <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
              {template.description}
            </p>

            <div className="space-y-3 pt-6 border-t border-slate-100 shrink-0">
              <button
                onClick={() => onExport(template)}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Export Asset
              </button>
              <button
                onClick={() => onCopy(contentToCopy, template.id)}
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  copyStatus === template.id 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {copyStatus === template.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Structure
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Premium Content Preview
                </h4>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
              </div>
              {renderPreview()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
