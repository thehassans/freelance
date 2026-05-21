import React from 'react';
import { Tool } from '../types';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, FileText, User, Flame } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  trendingRank?: number;
  key?: string | number;
}

export default function ToolCard({ tool, onClick, trendingRank }: ToolCardProps) {
  const isFreemium = tool.tier.toUpperCase() === 'FREEMIUM';
  const isFree = tool.tier.toUpperCase() === 'FREE';

  const Icon = tool.icon;

  return (
    <motion.div 
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-6 border border-slate-200 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300 cursor-pointer overflow-hidden h-full flex flex-col ${
        isFreemium ? 'bg-slate-50/30' : ''
      }`}
    >
      {/* Trending Badge */}
      {trendingRank && (
        <div className="absolute top-0 left-0 z-20">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-br-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg scale-110 origin-top-left animate-pulse">
            <Flame size={12} fill="currentColor" />
            #{trendingRank} Trending
          </div>
        </div>
      )}

      {/* Tier Badge - Absolute top-right */}
      <div className="absolute top-6 right-6 z-10">
        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm border flex items-center gap-1.5 ${
          isFreemium ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
          'bg-emerald-50 text-emerald-600 border-emerald-200'
        }`}>
          {isFreemium && <Sparkles size={10} className="fill-current" />}
          {tool.tier}
        </span>
      </div>

      <div className="flex flex-col h-full z-10">
        {/* Header - Icon & Title aligned top-left */}
        <div className="flex flex-col items-start gap-5 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-blue-200 transition-all duration-300 shadow-sm group-hover:shadow-md">
            <Icon 
              className="text-[#0f4c75] transform transition-transform duration-300 group-hover:scale-110" 
              size={32} 
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors duration-300">
            {tool.name}
          </h3>
        </div>

        {/* Description - Clamped to 2 lines */}
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
          {tool.description}
        </p>

        {/* Specs & Details Row */}
        <div className="pt-6 border-t border-slate-50 flex flex-wrap gap-2 mb-6">
          {tool.outputType && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
              <FileText size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold whitespace-nowrap">{tool.outputType}</span>
            </div>
          )}
          {tool.persona && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
              <User size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold whitespace-nowrap">{tool.persona}</span>
            </div>
          )}
          {tool.hasAI && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 rounded-xl text-indigo-600 border border-indigo-100">
              <Sparkles size={12} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">AI</span>
            </div>
          )}
        </div>

        {/* Primary Action Footer */}
        <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-blue-600 transition-colors duration-300">
            Launch Module
          </span>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:translate-x-1">
            <ArrowRight size={18} />
          </div>
        </div>
      </div>

      {/* Decorative Background Number */}
      {trendingRank && (
        <div className="absolute -bottom-4 right-2 text-9xl font-black text-slate-50/50 pointer-events-none z-0 transition-opacity duration-300 group-hover:opacity-0">
          {trendingRank < 10 ? `0${trendingRank}` : trendingRank}
        </div>
      )}
    </motion.div>
  );
}
