import React from 'react';

export default function TrustLogos() {
  return (
    <div className="py-12 border-t border-slate-100 mt-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center mb-10">
          Built for modern freelancers using
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale transition-all">
          <LogoItem 
            name="Webflow" 
            viewBox="0 0 24 24"
            d="M3 4.5h3.5v15H3zM8.5 4.5h3.5v15H8.5zM14 4.5h7.5v3.5H17.5V11H21v3.5h-3.5v5H14z" 
          />
          <LogoItem 
            name="Shopify" 
            viewBox="0 0 24 24"
            d="M5.8 2.5L3.3 6l2 15.5h13.5l2-15.5L18.2 2.5H5.8zm3.2 5.5h6v2h-6V8zm0 4h6v2h-6v-2z"
          />
          <LogoItem 
            name="WordPress" 
            viewBox="0 0 24 24"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"
          />
          <LogoItem 
            name="Stripe" 
            viewBox="0 0 24 24"
            d="M12.5 13.5c-1.1-.4-1.5-.7-1.5-1.1 0-.5.5-.8 1.1-.8.7 0 1.2.3 1.5.7l1.3-.9c-.6-.8-1.5-1.2-2.8-1.2-1.7 0-2.8 1-2.8 2.4 0 1.5 1 2.2 2.5 2.7 1.2.4 1.7.9 1.7 1.4s-.7 1-1.6 1c-1 0-1.8-.4-2.2-1.1L8 18.5c.7 1.1 2 1.6 3.5 1.6 1.9 0 3.3-1 3.3-2.6-.1-1.6-1-2.2-2.3-3z"
          />
          <LogoItem 
            name="Upwork" 
            viewBox="0 0 24 24"
            d="M18.5 2h-13C4.1 2 3 3.1 3 4.5v13c0 1.4 1.1 2.5 2.5 2.5h13c1.4 0 2.5-1.1 2.5-2.5v-13c0-1.4-1.1-2.5-2.5-2.5zM12 18H5.5V6H12v12zm1-12h5.5v12H13V6z"
          />
        </div>
      </div>
    </div>
  );
}

function LogoItem({ name, d, viewBox = "0 0 24 24", strokeWidth = 2 }: { name: string, d: string, viewBox?: string, strokeWidth?: number }) {
  return (
    <div className="flex items-center gap-2 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
      <svg className="w-6 h-6 md:w-8 md:h-8" viewBox={viewBox} fill="currentColor">
        <path d={d} />
      </svg>
      <span className="text-sm font-black tracking-tight text-slate-900">{name}</span>
    </div>
  );
}
