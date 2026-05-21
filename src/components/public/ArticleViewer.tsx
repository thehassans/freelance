import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar, Zap, ArrowRight, Share2, BookOpen } from 'lucide-react';
import { Article } from '../../lib/contentData';

interface ArticleViewerProps {
  article: Article;
  onBack: () => void;
  onToolClick?: (toolId: string) => void;
}

export default function ArticleViewer({ article, onBack, onToolClick }: ArticleViewerProps) {
  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#0f4c75] selection:text-white">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-xl group-hover:-translate-x-1 transition-all border border-transparent group-hover:border-slate-100">
              <ArrowLeft size={18} />
            </div>
            Back to Content Hub
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Now Reading</span>
              <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{article.title}</span>
            </div>
            <button 
              onClick={shareArticle}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100"
              title="Share Article"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <article className="pt-16 pb-32">
        {/* Header Section */}
        <header className="max-w-4xl mx-auto px-4 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <span className="px-5 py-2 bg-[#0f4c75] text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#0f4c75]/20">
              {article.category}
            </span>
            <div className="h-4 w-px bg-slate-200" />
            {article.readTime && (
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Clock size={14} className="text-[#0f4c75]" /> {article.readTime}
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Calendar size={14} /> {article.publishDate}
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight leading-[1.05] mb-16 text-balance"
          >
            {article.title}
          </motion.h1>

          {article.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full aspect-[21/10] rounded-[4rem] overflow-hidden shadow-3xl shadow-slate-200 group"
            >
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                onError={(e) => { 
                  const target = e.currentTarget;
                  if (target.src !== `https://picsum.photos/seed/${article.id}/1200/600`) {
                    target.src = `https://picsum.photos/seed/${article.id}/1200/600`;
                  }
                }}
              />
            </motion.div>
          )}
        </header>

        {/* Article Body */}
        <div className="max-w-2xl mx-auto px-4">
          <div 
            className="prose prose-slate prose-xl max-w-none font-medium text-slate-600 leading-[1.8] article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Embedded Premium Tool CTA */}
          {article.targetToolId && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 p-12 md:p-16 bg-[#0a192f] rounded-[4rem] text-white relative overflow-hidden group shadow-3xl shadow-[#0a192f]/20"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f4c75]/30 blur-[100px] -mr-48 -mt-48 rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -ml-32 -mb-32 rounded-full" />
              
              <div className="relative z-10 text-center max-w-lg mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-10 border border-white/5">
                  <Zap size={14} fill="currentColor" /> Conversion Engine
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-tight">
                  Stop theoretical planning.
                </h3>
                <p className="text-white/50 text-xl font-medium mb-12 leading-relaxed">
                  Put this strategy to work. Launch the <span className="text-white font-bold">{article.targetToolName}</span> and calculate your metrics with deterministic accuracy.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => onToolClick?.(article.targetToolId)}
                    className="w-full sm:w-auto px-12 py-6 bg-white text-[#0a192f] rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 group/btn"
                  >
                    Launch Tool Now <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Engagement Footer */}
          <footer className="mt-40 pt-20 border-t border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-300">
              <BookOpen size={24} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Article Completed</p>
            <button 
              onClick={onBack}
              className="text-[#0f4c75] font-black text-2xl hover:tracking-widest transition-all duration-500 underline underline-offset-[12px] decoration-2"
            >
              Back to the Knowledge Hub
            </button>
          </footer>
        </div>
      </article>
    </div>
  );
}
