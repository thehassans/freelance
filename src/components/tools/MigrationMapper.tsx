import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, ClipboardCheck, ArrowRight, ShieldAlert, 
  ChevronRight, ChevronDown, CheckCircle2, XCircle, 
  AlertTriangle, HardDrive, Filter, Layout,
  Smartphone, Globe, Users, ShoppingBag
} from 'lucide-react';

interface MigrationItem {
  id: string;
  label: string;
  description: string;
  defaultInScope: boolean;
  warning?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  items: MigrationItem[];
}

const CATEGORIES: Category[] = [
  {
    id: 'products',
    name: 'Products & Inventory',
    icon: ShoppingBag,
    items: [
      { id: 'p_titles', label: 'Titles & Descriptions', description: 'Core product copy and structural HTML.', defaultInScope: true },
      { id: 'p_pricing', label: 'Pricing & Inventory', description: 'Regular prices, sale prices, and stock levels.', defaultInScope: true },
      { id: 'p_images', label: 'High-Res Images', description: 'Gallery images and featured thumbnails.', defaultInScope: true },
      { id: 'p_variants', label: 'Product Variants', description: 'Options like size, color, and SKU permutations.', defaultInScope: true },
      { id: 'p_meta', label: 'Custom Metafields', description: 'Custom attributes, specifications, and dev-defined fields.', defaultInScope: false, warning: 'Requires custom script mapping for complex nested objects.' }
    ]
  },
  {
    id: 'customers',
    name: 'Customer Intelligence',
    icon: Users,
    items: [
      { id: 'c_info', label: 'Contact Information', description: 'Names, emails, and phone numbers.', defaultInScope: true },
      { id: 'c_addr', label: 'Shipping Addresses', description: 'Full historical address books.', defaultInScope: true },
      { id: 'c_hist', label: 'Order History', description: 'Past orders, line items, and transaction IDs.', defaultInScope: false, warning: 'Historical orders are often migrated as archived snapshots without active "refund" capability.' },
      { id: 'c_pass', label: 'Passwords', description: 'Encrypted login credentials.', defaultInScope: false, warning: 'Due to cryptographic security, legacy customer passwords cannot be migrated. Customers will be required to trigger a password reset on the new platform.' }
    ]
  },
  {
    id: 'seo',
    name: 'SEO & Content',
    icon: Globe,
    items: [
      { id: 's_301', label: '301 URL Redirects', description: 'Mapping old URLs to new structures to preserve ranking.', defaultInScope: true },
      { id: 's_blog', label: 'Blog Posts', description: 'Articles, comments, and author profiles.', defaultInScope: true },
      { id: 's_cms', label: 'CMS Pages', description: 'About Us, Contact, and custom landing pages.', defaultInScope: true },
      { id: 's_meta', label: 'Meta Titles/Descriptions', description: 'The snippets that appear in search engine results.', defaultInScope: true }
    ]
  }
];

const PLATFORMS = ['WooCommerce', 'Magento', 'Shopify', 'BigCommerce', 'Salesforce', 'Custom Engine'];

export default function MigrationMapper() {
  // 1. STATE MANAGEMENT
  const [sourcePlatform, setSourcePlatform] = useState('WooCommerce');
  const [destPlatform, setDestPlatform] = useState('Shopify');
  
  // Track toggle states: { [id]: boolean }
  const [itemStates, setItemStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CATEGORIES.forEach(cat => cat.items.forEach(item => {
      initial[item.id] = item.defaultInScope;
    }));
    return initial;
  });

  // Track counts: { [categoryId]: number }
  const [counts, setCounts] = useState<Record<string, number>>({
    products: 1000,
    customers: 5000,
    seo: 50
  });

  const [expandedCats, setExpandedCats] = useState<string[]>(['products', 'customers']);
  const [copied, setCopied] = useState(false);

  // 2. THE BUSINESS LOGIC
  const toggleItem = (id: string) => {
    setItemStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCategory = (catId: string) => {
    setExpandedCats(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const sortedItems = useMemo(() => {
    const included: { item: MigrationItem; catName: string }[] = [];
    const excluded: { item: MigrationItem; catName: string }[] = [];
    const activeDisclaimers: string[] = [];

    CATEGORIES.forEach(cat => {
      cat.items.forEach(item => {
        if (itemStates[item.id]) {
          included.push({ item, catName: cat.name });
        } else {
          excluded.push({ item, catName: cat.name });
          if (item.warning) activeDisclaimers.push(item.warning);
        }
      });
    });

    return { included, excluded, activeDisclaimers };
  }, [itemStates]);

  const handleCopy = () => {
    const text = `DATA MIGRATION SIGN-OFF: ${sourcePlatform} to ${destPlatform}\n\n` +
      `✅ IN SCOPE:\n` + sortedItems.included.map(i => `- ${i.item.label} (${i.catName})`).join('\n') + `\n\n` +
      `❌ EXCLUDED:\n` + sortedItems.excluded.map(i => `- ${i.item.label} (${i.catName})`).join('\n') + `\n\n` +
      `⚠️ DISCLAIMERS:\n` + sortedItems.activeDisclaimers.join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 min-h-[850px]">
      {/* 1. THE MAPPING ENGINE (Left) */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 overflow-y-auto max-h-[850px] custom-scrollbar">
          {/* Platform Context */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Database size={24} />
               </div>
               <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 leading-tight">Migration Mapping</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Scope definition & Entity Control</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Source Platform</label>
                <select 
                  value={sourcePlatform || 'WooCommerce'}
                  onChange={(e) => setSourcePlatform(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Destination Platform</label>
                <select 
                  value={destPlatform || 'Shopify'}
                  onChange={(e) => setDestPlatform(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Categorized Entity Toggles */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
               <Filter size={14} className="text-slate-400" />
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Entity Scoping</h3>
            </div>

            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/50">
                  <div 
                    onClick={() => toggleCategory(cat.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                         <cat.icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{cat.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{cat.items.length} Data Points</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-lg" onClick={(e) => e.stopPropagation()}>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Est.</label>
                          <input 
                            type="number"
                            value={counts[cat.id] || 0}
                            onChange={(e) => setCounts({...counts, [cat.id]: parseInt(e.target.value) || 0})}
                            className="w-16 bg-transparent text-[10px] font-bold text-slate-700 outline-none text-right"
                          />
                       </div>
                       {expandedCats.includes(cat.id) ? <ChevronDown size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-slate-300" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedCats.includes(cat.id) && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-slate-100 bg-white"
                      >
                        <div className="p-2 space-y-1">
                          {cat.items.map(item => (
                            <div 
                              key={item.id}
                              onClick={() => toggleItem(item.id)}
                              className={`p-4 flex items-center justify-between cursor-pointer rounded-2xl transition-all group ${itemStates[item.id] ? 'bg-indigo-50/20' : 'bg-transparent hover:bg-slate-50'}`}
                            >
                              <div className="flex flex-col flex-1 pr-8">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[11px] font-bold transition-colors ${itemStates[item.id] ? 'text-indigo-600' : 'text-slate-600'}`}>{item.label}</span>
                                  {item.warning && (
                                    <div className="relative group/tip">
                                      <AlertTriangle size={12} className="text-amber-500 cursor-help" />
                                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[9px] rounded-lg opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl border border-white/10 font-medium">
                                        {item.warning}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{item.description}</p>
                              </div>
                              <div className={`w-10 h-5 rounded-full relative transition-colors ${itemStates[item.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                <motion.div 
                                  animate={{ x: itemStates[item.id] ? 22 : 2 }}
                                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE SIGN-OFF DOCUMENT (Right) */}
      <div className="flex flex-col gap-6">
        <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-full relative">
          <div className="p-8 bg-white border-b border-slate-100 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                      <ClipboardCheck size={20} />
                   </div>
                   <div>
                     <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 leading-tight">Migration Sign-Off</h2>
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Formal Annex Document</span>
                   </div>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-lg flex items-center gap-2">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revision:</span>
                   <span className="text-[9px] font-black text-slate-900">MIG-2026.04.1</span>
                </div>
             </div>
          </div>

          <div className="flex-1 p-10 bg-white m-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
                <div className="space-y-8">
                   {/* Header Section */}
                   <div className="text-center space-y-2 pb-8 border-b border-slate-50">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Scope Control Document</h3>
                      <div className="flex items-center justify-center gap-4">
                         <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">From:</span>
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{sourcePlatform}</span>
                         </div>
                         <ArrowRight size={12} className="text-slate-300" />
                         <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">To:</span>
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{destPlatform}</span>
                         </div>
                      </div>
                   </div>

                   {/* Included List */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-100">
                         <CheckCircle2 size={14} className="text-emerald-500" />
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Included Migration Scope</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                         <AnimatePresence mode="popLayout">
                           {sortedItems.included.map(({ item, catName }) => (
                             <motion.div 
                               key={item.id}
                               layout
                               initial={{ opacity: 0, scale: 0.95 }}
                               animate={{ opacity: 1, scale: 1 }}
                               exit={{ opacity: 0, scale: 0.95 }}
                               className="p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl flex items-center gap-3"
                             >
                                <CheckCircle2 size={10} className="text-emerald-400 shrink-0" />
                                <div className="flex flex-col">
                                   <span className="text-[10px] font-bold text-slate-700 leading-tight">{item.label}</span>
                                   <span className="text-[8px] font-black text-emerald-600/50 uppercase tracking-widest">{catName}</span>
                                </div>
                             </motion.div>
                           ))}
                         </AnimatePresence>
                      </div>
                   </div>

                   {/* Excluded List */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b-2 border-rose-100">
                         <XCircle size={14} className="text-rose-500" />
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600">Explicitly Excluded Items</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 opacity-60">
                         <AnimatePresence mode="popLayout">
                           {sortedItems.excluded.map(({ item, catName }) => (
                             <motion.div 
                               key={item.id}
                               layout
                               initial={{ opacity: 0, scale: 0.95 }}
                               animate={{ opacity: 1, scale: 1 }}
                               exit={{ opacity: 0, scale: 0.95 }}
                               className="p-3 bg-rose-50/30 border border-rose-100/50 rounded-xl flex items-center gap-3 grayscale"
                             >
                                <XCircle size={10} className="text-rose-300 shrink-0" />
                                <div className="flex flex-col">
                                   <span className="text-[10px] font-bold text-slate-500 leading-tight">{item.label}</span>
                                   <span className="text-[8px] font-black text-rose-400/50 uppercase tracking-widest">{catName}</span>
                                </div>
                             </motion.div>
                           ))}
                         </AnimatePresence>
                      </div>
                   </div>

                   {/* Dynamic Disclaimers */}
                   {sortedItems.activeDisclaimers.length > 0 && (
                      <div className="space-y-4 bg-slate-900 p-8 rounded-[2rem] text-white">
                         <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={14} className="text-amber-400" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Disclaimers</h4>
                         </div>
                         <ul className="space-y-4">
                            {sortedItems.activeDisclaimers.map((d, i) => (
                              <li key={i} className="flex gap-3">
                                 <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                 <p className="text-[10px] font-medium text-slate-300 leading-relaxed italic">{d}</p>
                              </li>
                            ))}
                         </ul>
                      </div>
                   )}
                </div>
             </div>
             {/* Fade Bottom */}
             <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>

          {/* Footer Pipeline */}
          <div className="p-8 bg-slate-50 border-t border-slate-200">
             <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={handleCopy}
                  className="flex-1 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/10 group"
                >
                   {copied ? <CheckCircle2 size={18} /> : <ClipboardCheck size={18} />}
                   {copied ? 'Sign-Off Copied!' : 'Copy Sign-Off Sheet'}
                </button>
                <button 
                  onClick={() => {
                    const params = new URLSearchParams({
                      source: sourcePlatform,
                      dest: destPlatform,
                      type: 'Migration Annex'
                    });
                    window.location.href = `/tools/contract-builder?${params.toString()}`;
                  }}
                  className="px-8 py-5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:border-slate-300 active:scale-95 transition-all group shadow-sm"
                >
                   Attach to Contract <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>

             <div className="flex items-center justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                   <ShieldAlert size={10} className="text-indigo-400" />
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">ISO 27001 Logic Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                   <HardDrive size={10} className="text-indigo-400" />
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Data Integrity Guard</span>
                </div>
                <div className="flex items-center gap-2">
                   <Layout size={10} className="text-indigo-400" />
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Auto-Formatted Annex</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
