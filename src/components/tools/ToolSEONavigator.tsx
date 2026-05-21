import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RelatedTool {
  title: string;
  description: string;
  href: string;
}

interface ToolSEONavigatorProps {
  currentToolName: string;
  categoryName: string;
  relatedTools: RelatedTool[];
}

export default function ToolSEONavigator({
  currentToolName,
  categoryName,
  relatedTools
}: ToolSEONavigatorProps) {
  // Generate a URL-friendly category slug
  const categorySlug = categoryName.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
  const baseUrl = window.location.origin;

  // Build the JSON-LD BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${baseUrl}/tools?category=${categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": currentToolName,
        "item": window.location.href // Use current page URL
      }
    ]
  };

  return (
    <section className="max-w-6xl mx-auto py-12 border-t border-slate-200 mt-16 print:hidden px-6">
      {/* JSON-LD Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Related Tools Engine */}
      {relatedTools && relatedTools.length > 0 && (
        <div className="related-tools-engine">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">
            Explore more {categoryName} tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <Link
                key={index}
                to={tool.href}
                className="group block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all hover:border-[#6c63ff]/30 flex flex-col h-full"
              >
                <div className="flex-grow">
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#6c63ff] transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-sm font-bold text-[#6c63ff]">
                  Launch Tool <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
