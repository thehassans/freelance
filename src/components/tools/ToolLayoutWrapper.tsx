import React from 'react';
import { TOOLS, CATEGORIES } from '../../lib/tools-registry';
import ToolSEONavigator, { RelatedTool } from './ToolSEONavigator';

interface ToolLayoutWrapperProps {
  activeToolSlug: string;
  children: React.ReactNode;
}

export default function ToolLayoutWrapper({ activeToolSlug, children }: ToolLayoutWrapperProps) {
  const activeTool = TOOLS.find(t => t.slug === activeToolSlug);

  if (!activeTool) return <>{children}</>;

  const toolCategories = Array.isArray(activeTool.category) ? activeTool.category : [activeTool.category];
  const primaryCategoryId = toolCategories[0];
  const category = CATEGORIES.find(c => c.id === primaryCategoryId);
  const categoryName = category ? category.name : primaryCategoryId;

  // Find related tools in the same primary category
  const relatedToolsRaw = TOOLS.filter(
    t => t.slug !== activeToolSlug && 
    (Array.isArray(t.category) ? t.category.includes(primaryCategoryId) : t.category === primaryCategoryId)
  ).slice(0, 3); // Get top 3

  const relatedTools: RelatedTool[] = relatedToolsRaw.map(t => ({
    title: t.name,
    description: t.description,
    href: `/tools/${t.slug}`,
  }));

  return (
    <>
      <div className="tool-content-wrapper">
        {children}
      </div>
      <ToolSEONavigator 
        currentToolName={activeTool.name}
        categoryName={categoryName}
        relatedTools={relatedTools}
      />
    </>
  );
}
