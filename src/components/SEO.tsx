import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function SEO({ 
  title, 
  description,
  keywords = "freelancer tools, invoice generator, rate calculator, proposal generator, contract builder, billable hours tracker"
}: SEOProps) {
  
  const defaultTitle = "FreelancerKit";
  const defaultDescription = "Professional-grade tools to save your business time. Price your work accurately, close more leads with AI, and get paid faster. Zero account required.";
  
  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;
  const fullTitle = displayTitle.includes("FreelancerKit") ? displayTitle : `${displayTitle} | FreelancerKit`;
  
  return (
    <Helmet>
      <html lang="en" dir="ltr" />
      <title>{fullTitle}</title>
      <meta name="description" content={displayDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={displayDescription} />
      <meta property="og:image" content="https://picsum.photos/seed/freelancer/1200/630" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={displayDescription} />
      <meta property="twitter:image" content="https://picsum.photos/seed/freelancer/1200/630" />
      
      <link rel="canonical" href={window.location.origin} />
    </Helmet>
  );
}
