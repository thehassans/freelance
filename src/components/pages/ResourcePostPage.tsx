import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, Zap } from 'lucide-react';
import { getPostBySlug, MdxContent } from '../../lib/mdx';

interface ResourcePostPageProps {
  slug?: string | null;
  folder?: 'blog' | 'glossary' | 'templates';
  onBack?: () => void;
}

export default function ResourcePostPage({ slug: propSlug, folder = 'blog', onBack }: ResourcePostPageProps) {
  const { slug: paramsSlug } = useParams<{ slug: string }>();
  const activeSlug = propSlug || paramsSlug;
  const [post, setPost] = useState<MdxContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (activeSlug) {
        const data = await getPostBySlug(activeSlug, folder);
        setPost(data);
      }
      setLoading(false);
    }
    loadPost();
  }, [activeSlug, folder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0f4c75]/20 border-t-[#0f4c75] rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6">
        <h1 className="text-2xl font-black text-slate-900">Post not found.</h1>
        <button 
          onClick={onBack}
          className="text-[#0f4c75] font-black uppercase tracking-widest text-xs flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back to Resources
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-24 bg-white min-h-screen"
    >
      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumbs / Back Navigation */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0f4c75] transition-colors text-xs font-black uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Resources
        </button>

        {/* Header */}
        <header className="mb-12">
          {folder === 'blog' && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-[#0f4c75]/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0f4c75] border border-[#0f4c75]/10">
                  {post.metadata.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                {post.metadata.title}
              </h1>

              <div className="flex items-center justify-between py-6 border-y border-slate-100 mb-12">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                    <Calendar size={14} /> {post.metadata.date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                    <Clock size={14} /> {post.metadata.readTime}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-[#0f4c75] transition-colors">
                    <Share2 size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-[#0f4c75] transition-colors">
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>

              {post.metadata.image && (
                <div className="rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl mb-12">
                  <img 
                    src={post.metadata.image} 
                    alt={post.metadata.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </>
          )}

          {folder === 'glossary' && (
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f4c75]/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0f4c75] border border-[#0f4c75]/10 mb-6">
                Dictionary Terms
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                {post.metadata.term}
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mb-12">
                {post.metadata.definition}
              </p>
              <div className="h-1 w-20 bg-[#0f4c75] rounded-full mx-auto md:mx-0 mb-12" />
            </div>
          )}

          {folder === 'templates' && (
            <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 mb-12 relative overflow-hidden">
               {post.metadata.isPro && (
                  <div className="absolute top-8 right-8 flex items-center gap-1 px-4 py-2 bg-[#0f4c75] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#0f4c75]/20">
                    <Zap size={12} fill="currentColor" /> Pro
                  </div>
                )}
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f4c75]/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0f4c75] border border-[#0f4c75]/10 mb-6">
                {post.metadata.format}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                {post.metadata.name}
              </h1>
              <p className="text-slate-500 font-medium mb-8">
                {post.metadata.description}
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-[#0f4c75] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0b395a] transition-all">
                  Get This Template
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Body Content */}
        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-a:text-[#0f4c75] prose-strong:text-slate-900 prose-blockquote:border-[#0f4c75] prose-blockquote:bg-[#0f4c75]/5 prose-blockquote:rounded-2xl prose-blockquote:p-6 prose-blockquote:italic prose-blockquote:font-medium">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-slate-100">
           <div className="bg-slate-50 p-12 rounded-[2.5rem] text-center border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Enjoyed this guide?</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                Join our newsletter to get tactical business teardowns delivered to your inbox every Tuesday.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                 <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="flex-grow px-6 h-14 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#0f4c75]/5 transition-all"
                 />
                 <button className="h-14 px-8 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0b395a] transition-all whitespace-nowrap px-8">
                   Subscribe
                 </button>
              </div>
           </div>
        </footer>
      </div>
    </motion.div>
  );
}
