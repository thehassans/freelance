import fs from 'fs';

let content = fs.readFileSync('src/pages/ToolsPage.tsx', 'utf8');

// 1. Add Check icon import
content = content.replace(/import \{ Search, Zap, History, FileText, ChevronDown, HelpCircle, Inbox, Sparkles, Flame \} from 'lucide-react';/,
`import { Search, Zap, History, FileText, ChevronDown, HelpCircle, Inbox, Sparkles, Flame, Check } from 'lucide-react';`);

// 2. Add audienceFilter state and isDropdownOpen state
content = content.replace(/const \[sortFilter, setSortFilter\] = useState<'A-Z' \| 'Most Popular' \| 'Recently Added'>\('Most Popular'\);/,
`const [sortFilter, setSortFilter] = useState<'A-Z' | 'Most Popular' | 'Recently Added'>('Most Popular');
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);`);

// 3. Update filteredTools logic
content = content.replace(/const filteredTools = useMemo\(\(\) => \{[\s\S]*?return result;\n  \}, \[searchQuery, activeCategory, sortFilter, filterTab\]\);/m,
`  const filteredTools = useMemo(() => {
    let result = TOOLS.filter(tool => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = tool.name.toLowerCase().includes(query) || 
                            tool.description.toLowerCase().includes(query) ||
                            tool.category.toLowerCase().includes(query);
                            
      const matchesCategory = activeCategory === 'All' ? true : tool.category === activeCategory;
      const matchesAudience = audienceFilter === 'All' ? true : tool.audience === audienceFilter;
      
      let matchesTier = true;
      if (filterTab === 'Free') matchesTier = tool.tier.toUpperCase() === 'FREE';
      if (filterTab === 'Freemium') matchesTier = tool.tier.toUpperCase() === 'FREEMIUM';
      
      return matchesSearch && matchesCategory && matchesTier && matchesAudience;
    });

    if (filterTab === 'Trending') {
      result = [...result].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    } else if (sortFilter === 'A-Z') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortFilter === 'Most Popular') {
      result = [...result].sort((a, b) => b.monthlyViews - a.monthlyViews);
    } else if (sortFilter === 'Recently Added') {
      result = [...result].sort((a, b) => TOOLS.indexOf(b) - TOOLS.indexOf(a));
    }

    return result;
  }, [searchQuery, activeCategory, sortFilter, filterTab, audienceFilter]);`);

// 4. Advanced Sorting Dropdown and Target Audience Filter
content = content.replace(/\{\/\* Advanced Sorting Dropdown \*\/\}[\s\S]*?<\/div>\n            <\/div>/,
`{/* Advanced Sorting Dropdown */}
              <div className="shrink-0 relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer shadow-sm hover:border-slate-300 hover:bg-slate-50 h-full min-w-[200px]"
                >
                  <span>Sort By: {sortFilter}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="bg-white shadow-xl border border-slate-100 rounded-xl overflow-hidden py-1 absolute z-50 mt-2 w-48 right-0"
                    >
                       {['Most Popular', 'A-Z', 'Recently Added'].map(opt => (
                         <div
                           key={opt}
                           onClick={() => {
                              setSortFilter(opt as any);
                              setIsDropdownOpen(false);
                           }}
                           className="hover:bg-slate-50 text-slate-700 cursor-pointer px-4 py-2 text-sm transition-colors flex items-center justify-between"
                         >
                           <span className={sortFilter === opt ? 'text-blue-600 font-medium' : ''}>{opt}</span>
                           {sortFilter === opt && <Check size={14} className="text-blue-600" />}
                         </div>
                       ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Target Audience Filter Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Target Audience:</span>
              {['All', 'Solo Freelancer', 'Dev Agency', 'Creative Studio'].map(aud => (
                <button
                  key={aud}
                  onClick={() => setAudienceFilter(aud)}
                  className={\`text-xs font-medium px-3 py-1 rounded-full border transition-colors \${
                     audienceFilter === aud 
                       ? 'bg-[#0f4c75] text-white border-[#0f4c75]' 
                       : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }\`}
                >
                  {aud}
                </button>
              ))}
            </div>`);

// 5. Replace FAQ data and the bottom section
content = content.replace(/const FAQS = \[[\s\S]*?\];/m,
`const FAQS = [
  {
    q: 'Do I need to create an account to use the free tools?',
    a: 'No, our core calculators are available instantly with no login required. Accounts are only needed to save client data or export white-labeled PDFs.'
  },
  {
    q: 'What does the Freemium tag mean?',
    a: 'Freemium tools utilize advanced AI or generate exportable assets. Free accounts receive 5 credits per month to use these specific modules.'
  },
  {
    q: 'Can I integrate these tools with my existing CRM?',
    a: 'Currently, FreelancerKit operates as a standalone operating system, but API webhooks and Zapier integrations are on our immediate roadmap.'
  }
];

const METHODOLOGY = [
  {
    title: 'Zero Spreadsheets',
    desc: 'Replace cluttered Excel templates with hardened, purpose-built utilities that scale with your business.'
  },
  {
    title: 'Bank-Grade Security',
    desc: 'Your client data and financial metrics are secured by Google Cloud firewalls and state-of-the-art encryption.'
  },
  {
    title: 'Client-Facing Professionalism',
    desc: 'Generate white-labeled proposals and statements that position you as a premium service provider.'
  }
];`);

const bottomSEO = `{/* Footer Help */}
            <div className="max-w-5xl mx-auto py-20 border-t border-slate-200 mt-12">
               <h2 className="text-3xl font-black text-slate-900 mb-10 text-center tracking-tight">Why Top Agencies Use FreelancerKit</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {METHODOLOGY.map((item, i) => (
                    <div key={i} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm text-center">
                       <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0f4c75]">
                         <Zap size={24} />
                       </div>
                       <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
               </div>
               
               <h3 className="text-2xl font-black text-slate-900 mb-8 text-center tracking-tight">Frequently Asked Questions</h3>
               <div className="space-y-4 max-w-3xl mx-auto">
                  {FAQS.map((faq, i) => (
                    <details key={i} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                       <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900">
                         {faq.q}
                         <ChevronDown className="transition-transform group-open:rotate-180 text-slate-400" size={20} />
                       </summary>
                       <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50">
                         {faq.a}
                       </div>
                    </details>
                  ))}
               </div>
            </div>`;

content = content.replace(/\{\/\* Footer Help \*\/\}[\s\S]*?<\/div>\n            <\/div>/, bottomSEO);

fs.writeFileSync('src/pages/ToolsPage.tsx', content);
