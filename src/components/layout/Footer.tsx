import React from 'react';
import { Briefcase, Send, Twitter, Github, Linkedin, Youtube, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  onHomeClick?: () => void;
  onPricingClick?: () => void;
  onResourcesClick?: (tab?: 'guides' | 'blog' | 'templates' | 'glossary') => void;
  onContactClick?: () => void;
  onToolClick?: (slug: string) => void;
}

export default function Footer({ 
  onHomeClick, 
  onPricingClick, 
  onResourcesClick, 
  onContactClick,
  onToolClick 
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, type: 'home' | 'pricing' | 'resources' | 'tool' | 'contact', slug?: string) => {
    e.preventDefault();
    if (type === 'home' && onHomeClick) onHomeClick();
    if (type === 'pricing' && onPricingClick) onPricingClick();
    if (type === 'resources' && onResourcesClick) onResourcesClick();
    if (type === 'contact' && onContactClick) onContactClick();
    if (type === 'tool' && slug && onToolClick) onToolClick(slug);
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <div 
              className="flex items-center gap-2 cursor-pointer group w-fit"
              onClick={(e) => handleLinkClick(e, 'home')}
            >
              <img src="/freelancerkitlogo.png" alt="Freelancer Kit Logo" className="h-16 md:h-20 object-contain" />
            </div>
            
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              The ultimate toolkit for independent professionals. Price your work with confidence, automate your sales documents, and run your business like a pro agency.
            </p>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Stay Updated</h4>
              <div className="flex max-w-md gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                  <Send className="w-4 h-4" /> Subscribe
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">All systems operational</span>
            </div>
          </div>

          {/* Column 2: Finance Tools */}
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Finance & Pricing</h4>
            <ul className="space-y-3">
              {[
                { name: 'Invoice Generator', slug: 'invoice-generator' },
                { name: 'Rate Calculator', slug: 'freelance-rate-calculator' },
                { name: 'Tax Estimator', slug: 'freelance-tax-estimator' },
                { name: 'Runway Calculator', slug: 'financial-runway-calculator' },
                { name: 'Project Estimates', slug: 'project-cost-estimator' },
              ].map((link) => (
                <li key={link.slug}>
                  <a 
                    href={`/tool/${link.slug}`}
                    onClick={(e) => handleLinkClick(e, 'tool', link.slug)}
                    className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Proposals */}
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Contracts & Sales</h4>
            <ul className="space-y-3">
              {[
                { name: 'AI Proposal Gen', slug: 'ai-proposal-generator' },
                { name: 'Contract Builder', slug: 'contract-builder' },
                { name: 'Privacy Policy', slug: 'privacy-policy-generator' },
                { name: 'Retainer Builder', slug: 'retainer-agreement-builder' },
                { name: 'Portfolio Builder', slug: 'ai-portfolio-case-study-builder' },
              ].map((link) => (
                <li key={link.slug}>
                  <a 
                    href={`/tool/${link.slug}`}
                    onClick={(e) => handleLinkClick(e, 'tool', link.slug)}
                    className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-3">
              {[
                { name: 'Agency Blog', type: 'resources' },
                { name: 'Free Templates', type: 'resources' },
                { name: 'Glossary', type: 'resources' },
                { name: 'Pro Pricing', type: 'pricing' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.type === 'pricing' ? '/pricing' : '/resources'}
                    onClick={(e) => handleLinkClick(e, link.type as any)}
                    className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href="/contact" 
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary transition-colors" />
                  Support <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} FreelancerKit. Crafted for builders and fixers.</p>
            <div className="hidden md:block h-4 w-px bg-gray-200" />
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-all hover:scale-110">
              <Twitter size={20} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-all hover:scale-110">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-all hover:scale-110">
              <Linkedin size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-all hover:scale-110">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
