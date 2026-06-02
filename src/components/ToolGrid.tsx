import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tool } from '../types';
import ToolCard from './ToolCard';

export default function ToolGrid({ 
  tools, 
  onToolClick, 
  showTrendingBadges,
  favoritedTools = [],
  onStarToggle
}: { 
  tools: Tool[], 
  onToolClick: (slug: string) => void, 
  showTrendingBadges?: boolean,
  favoritedTools?: string[],
  onStarToggle?: (id: string, e: React.MouseEvent) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ToolCard 
              tool={tool} 
              onClick={() => onToolClick(tool.slug)} 
              trendingRank={showTrendingBadges && index < 3 ? index + 1 : undefined}
              isStarred={favoritedTools.includes(tool.id)}
              onStarToggle={onStarToggle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
