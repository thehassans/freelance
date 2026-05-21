export const DEFAULT_TOOLS = [
  // FINANCE & BILLING
  { id: 'tool_cpm', name: 'Ultimate CPM Calculator', slug: 'ultimate-cpm-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '#', status: 'published', sortOrder: 1, description: 'Solve for CPM, Spend, or Impressions with our bi-directional media buying tool.', metaTitle: 'CPM Calculator | FreelancerKit', metaDesc: 'Calculate CPM, spend, or impressions instantly.' },
  { id: 'tool_fb_cpa', name: 'Facebook Ads CPA Calculator', slug: 'facebook-ads-cpa-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '📊', status: 'published', sortOrder: 2, description: 'Estimate your Facebook Ads campaign performance, conversions, and target CPA.' },
  { id: 'tool_rate_calc', name: 'Freelance Rate Calculator', slug: 'freelance-rate-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '💵', status: 'published', sortOrder: 3, description: 'Calculate your exact hourly rate based on income goals, expenses, and taxes.' },
  { id: 'tool_email_roi', name: 'Email Marketing ROI Calculator', slug: 'email-marketing-roi-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '📧', status: 'published', sortOrder: 4, description: 'Calculate the total revenue and ROI of your email marketing campaigns.' },
  { id: 'tool_social_roi', name: 'Social Media ROI Calculator', slug: 'social-media-roi-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '📣', status: 'published', sortOrder: 5, description: 'Defend your retainer by calculating the Lifetime Value impact of social leads.' },
  { id: 'tool_profit', name: 'Profit Margin Calculator', slug: 'profit-margin-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '📈', status: 'published', sortOrder: 6, description: 'Calculate gross profit and net margins for your work.' },
  { id: 'tool_biz_val', name: 'Business Valuation Calculator', slug: 'business-valuation-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '🏢', status: 'published', sortOrder: 7, description: 'Calculate your company\'s exit value based on SDE and industry multiples.' },
  { id: 'tool_roas', name: 'ROAS & Break-Even Calculator', slug: 'roas-break-even-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '📉', status: 'published', sortOrder: 8, description: 'Analyze ad performance, calculate net profit, and find your break-even ROAS.' },
  { id: 'tool_platform_arb', name: 'Platform Arbitrage Calculator', slug: 'platform-arbitrage-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '⚖️', status: 'published', sortOrder: 9, description: 'Reverse-calculate platform fees (Upwork/Fiverr) to find your true target bid.' },
  { id: 'tool_runway', name: 'Runway & Burn Calculator', slug: 'runway-burn-calculator', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '🚀', status: 'published', sortOrder: 10, description: 'Calculate your survival cash based on burn rate.' },
  { id: 'tool_wholesale', name: 'Wholesale & MSRP Pricing Engine', slug: 'wholesale-msrp-pricing', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '🏷️', status: 'published', sortOrder: 11, description: 'Simulate wholesale margins, retailer markups, and profit splits with precision.' },
  { id: 'tool_annual_goal', name: 'Annual Goal Planner', slug: 'annual-goal-planner', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '🎯', status: 'published', sortOrder: 12, description: 'Reverse-calculate your fees based on desired annual income.' },
  { id: 'tool_late_payment', name: 'Late Payment Tool', slug: 'late-payment-tool', category: 'Finance & Billing', tier: 'free', isAI: false, icon: '⚠️', status: 'published', sortOrder: 13, description: 'Calculate interest and fees for overdue invoices.' },

  // SALES & PROPOSALS
  { id: 'tool_ai_proposal', name: 'AI Proposal Generator', slug: 'ai-proposal-generator', category: 'Sales & Proposals', tier: 'freemium', isAI: true, icon: '✨', status: 'published', sortOrder: 14, description: 'Generate a professional freelance proposal in seconds with AI.', aiModel: 'claude-sonnet-4-20250514', aiMaxTokens: 1000, aiCreditsPerUse: 1 },
  { id: 'tool_cold_pitch', name: 'Cold Pitch Framework Gen', slug: 'cold-pitch-framework-gen', category: 'Sales & Proposals', tier: 'free', isAI: true, icon: '📨', status: 'published', sortOrder: 15, description: 'Draft highly converting outbound emails focused entirely on client pain points.' },
  { id: 'tool_ai_portfolio', name: 'AI Portfolio Builder', slug: 'ai-portfolio-builder', category: 'Sales & Proposals', tier: 'freemium', isAI: true, icon: '🎨', status: 'published', sortOrder: 16, description: 'Input raw notes and get a professional STAR case study for your portfolio.' },
  { id: 'tool_ai_testimonial', name: 'AI Testimonial Tool', slug: 'ai-testimonial-tool', category: 'Sales & Proposals', tier: 'freemium', isAI: true, icon: '⭐', status: 'published', sortOrder: 17, description: 'Generate high-converting testimonial request scripts with AI.' },
  { id: 'tool_ai_followup', name: 'AI Follow-up Generator', slug: 'ai-follow-up-generator', category: 'Sales & Proposals', tier: 'freemium', isAI: true, icon: '📬', status: 'published', sortOrder: 18, description: 'AI-powered scripts for overdue invoices and lead nurturing.' },
  { id: 'tool_content_brief', name: 'Content Brief Automation', slug: 'content-brief-automation', category: 'Sales & Proposals', tier: 'freemium', isAI: true, icon: '📋', status: 'published', sortOrder: 19, description: 'Generate strict structural markdown briefs for writers and AI generation.' },
  { id: 'tool_framework', name: 'The Framework Matrix', slug: 'framework-matrix', category: 'Sales & Proposals', tier: 'free', isAI: true, icon: '⚙️', status: 'published', sortOrder: 20, description: 'Generate technical stack recommendations to pitch and justify architectures.' },
  { id: 'tool_retainer', name: 'Retainer Builder', slug: 'retainer-builder', category: 'Sales & Proposals', tier: 'freemium', isAI: false, icon: '🤝', status: 'published', sortOrder: 21, description: 'Create recurring revenue agreements for long-term clients.' },
  { id: 'tool_project_cost', name: 'Project Cost Estimator', slug: 'project-cost-estimator', category: 'Sales & Proposals', tier: 'free', isAI: false, icon: '💼', status: 'published', sortOrder: 22, description: 'Estimate project costs by breaking down tasks and adding buffers.' },

  // LEGAL & SCOPING
  { id: 'tool_contract', name: 'Contract Agreement Builder', slug: 'contract-agreement-builder', category: 'Legal & Scoping', tier: 'free', isAI: false, icon: '⚖️', status: 'published', sortOrder: 23, description: 'Draft simple, enforceable freelance service agreements and NDAs.' },
  { id: 'tool_privacy', name: 'Privacy Policy Gen', slug: 'privacy-policy-gen', category: 'Legal & Scoping', tier: 'free', isAI: false, icon: '📜', status: 'published', sortOrder: 24, description: 'Generate GDPR-compliant privacy policies for your website.' },
  { id: 'tool_gdpr', name: 'GDPR/CCPA Cookie Consent', slug: 'gdpr-ccpa-cookie-consent', category: 'Legal & Scoping', tier: 'free', isAI: false, icon: '🍪', status: 'published', sortOrder: 25, description: 'Generate compliant cookie consent banners and privacy scripts.' },
  { id: 'tool_erp', name: 'ERP/API Integration Scoper', slug: 'erp-api-integration-scoper', category: 'Legal & Scoping', tier: 'freemium', isAI: false, icon: '🔌', status: 'published', sortOrder: 26, description: 'Calculate complexity multipliers and padded timelines for system integrations.' },
  { id: 'tool_zero_trust', name: 'Zero Trust Architecture Scoper', slug: 'zero-trust-architecture-scoper', category: 'Legal & Scoping', tier: 'freemium', isAI: false, icon: '🔒', status: 'published', sortOrder: 27, description: 'Map out security perimeters and calculate Zero Trust implementation complexity.' },
  { id: 'tool_data_migration', name: 'Data Migration Mapper', slug: 'data-migration-mapper', category: 'Legal & Scoping', tier: 'freemium', isAI: false, icon: '🗺️', status: 'published', sortOrder: 28, description: 'Generate strict data sign-off checklists for e-commerce migrations.' },
  { id: 'tool_design_handoff', name: 'Design-to-Dev Handoff Generator', slug: 'design-to-dev-handoff', category: 'Legal & Scoping', tier: 'free', isAI: false, icon: '🎨', status: 'published', sortOrder: 29, description: 'Standardize asset, hex, and typography transfers for developers.' },

  // MARKETING & GROWTH
  { id: 'tool_headline', name: 'Headline Idea Generator', slug: 'headline-idea-generator', category: 'Marketing & Growth', tier: 'free', isAI: false, icon: '💡', status: 'published', sortOrder: 30, description: 'Generate high-converting blog and email subject lines using proven templates.' },
  { id: 'tool_engagement', name: 'Engagement Rate Calculator', slug: 'engagement-rate-calculator', category: 'Marketing & Growth', tier: 'free', isAI: false, icon: '📱', status: 'published', sortOrder: 31, description: 'Audit the health of any social media profile using reach or follower metrics.' },
  { id: 'tool_backlink', name: 'Backlink Discovery Tool', slug: 'backlink-discovery-tool', category: 'Marketing & Growth', tier: 'free', isAI: false, icon: '🔗', status: 'published', sortOrder: 32, description: 'Audit any domain to discover inbound links and referring domains.' },
  { id: 'tool_ab', name: 'Conversion & A/B Uplift Calculator', slug: 'ab-uplift-calculator', category: 'Marketing & Growth', tier: 'free', isAI: false, icon: '🧪', status: 'published', sortOrder: 33, description: 'Compare two variants and calculate conversion rate uplift.' },
  { id: 'tool_algo', name: 'Algorithmic Recovery Auditor', slug: 'algorithmic-recovery-auditor', category: 'Marketing & Growth', tier: 'freemium', isAI: false, icon: '📉', status: 'published', sortOrder: 34, description: 'Diagnose traffic drops and generate a recovery roadmap.' },
  { id: 'tool_cannib', name: 'Cannibalization Risk Detector', slug: 'cannibalization-risk-detector', category: 'Marketing & Growth', tier: 'free', isAI: false, icon: '⚠️', status: 'published', sortOrder: 35, description: 'Cross-reference URLs and keywords to flag overlapping SEO content.' },
  { id: 'tool_seo_meta', name: 'SEO & Meta Tag Kit', slug: 'seo-meta-tag-kit', category: 'Marketing & Growth', tier: 'free', isAI: false, icon: '🔍', status: 'published', sortOrder: 36, description: 'Generate SEO tags and UTM params for your portfolio.' },
  { id: 'tool_roas2', name: 'ROAS Calculator', slug: 'roas-calculator', category: 'Marketing & Growth', tier: 'free', isAI: false, icon: '💹', status: 'published', sortOrder: 37, description: 'Calculate Return on Ad Spend for any campaign.' },

  // SEO & DEV
  { id: 'tool_word', name: 'Word & Content Analyzer', slug: 'word-content-analyzer', category: 'SEO & Dev', tier: 'free', isAI: false, icon: '📝', status: 'published', sortOrder: 38, description: 'Advanced real-time word count, reading time, and keyword density analysis.' },
  { id: 'tool_case', name: 'Advanced Case Converter', slug: 'advanced-case-converter', category: 'SEO & Dev', tier: 'free', isAI: false, icon: 'Aa', status: 'published', sortOrder: 39, description: 'Standardize formatting with title, sentence, camel, and snake case.' },
  { id: 'tool_diff', name: 'Text Diff Tool', slug: 'text-diff-tool', category: 'SEO & Dev', tier: 'free', isAI: false, icon: '↔️', status: 'published', sortOrder: 40, description: 'Instantly compare two versions of code or copy.' },
  { id: 'tool_wcag', name: 'WCAG Contrast Auditor', slug: 'wcag-contrast-auditor', category: 'SEO & Dev', tier: 'free', isAI: false, icon: '♿', status: 'published', sortOrder: 41, description: 'Ensure brand colors meet WCAG 2.1 AA and AAA compliance.' },
  { id: 'tool_json', name: 'JSON Formatter & Validator', slug: 'json-formatter-validator', category: 'SEO & Dev', tier: 'free', isAI: false, icon: '{ }', status: 'published', sortOrder: 42, description: 'Beautify, minify, and validate JSON instantly in your browser.' },
  { id: 'tool_robots', name: 'Advanced Robots.txt Generator', slug: 'robots-txt-generator', category: 'SEO & Dev', tier: 'freemium', isAI: false, icon: '🤖', status: 'published', sortOrder: 43, description: 'Prevent catastrophic SEO mistakes with a validated robots.txt generator.' },
  { id: 'tool_css', name: 'Advanced CSS Engine', slug: 'advanced-css-engine', category: 'SEO & Dev', tier: 'free', isAI: false, icon: '🎨', status: 'published', sortOrder: 44, description: 'Generate Glassmorphism, Neumorphism, and multi-layered Smooth Shadows.' },
  { id: 'tool_html_word', name: 'HTML Word Counter', slug: 'html-word-counter', category: 'SEO & Dev', tier: 'free', isAI: false, icon: '<>', status: 'published', sortOrder: 45, description: 'Strip code tags for accurate word counts and reading time audits.' },
  { id: 'tool_html_text', name: 'HTML ↔ Text Converter', slug: 'html-text-converter', category: 'SEO & Dev', tier: 'free', isAI: false, icon: '⇄', status: 'published', sortOrder: 46, description: 'Clean up messy formatting or generate plain-text fallbacks for email.' },
  { id: 'tool_px_rem', name: 'PX to REM Converter', slug: 'px-to-rem-converter', category: 'SEO & Dev', tier: 'free', isAI: false, icon: 'px', status: 'published', sortOrder: 47, description: 'Convert pixels to REM units for responsive web typography.' },
  { id: 'tool_dmarc', name: 'DMARC & SPF Record Generator', slug: 'dmarc-spf-generator', category: 'SEO & Dev', tier: 'freemium', isAI: false, icon: '📮', status: 'published', sortOrder: 48, description: 'Generate valid DNS TXT records for SPF and DMARC.' },
  { id: 'tool_server_cfg', name: 'Server Config Generator', slug: 'server-config-generator', category: 'SEO & Dev', tier: 'freemium', isAI: false, icon: '🖥️', status: 'published', sortOrder: 49, description: 'Generate secure .htaccess or Nginx configuration snippets.' },
  { id: 'tool_http_headers', name: 'HTTP Security Header Auditor', slug: 'http-security-header-auditor', category: 'SEO & Dev', tier: 'free', isAI: false, icon: '🛡️', status: 'published', sortOrder: 50, description: 'Audit website security posture by checking critical HTTP headers.' },

  // SECURITY & COMPLIANCE
  { id: 'tool_wp_sec', name: 'WordPress Security Auditor', slug: 'wordpress-security-auditor', category: 'Security & Compliance', tier: 'freemium', isAI: false, icon: '🔐', status: 'published', sortOrder: 51, description: 'Scan WordPress sites for common security exposures.' },
  { id: 'tool_data_breach', name: 'Data Breach Risk Calculator', slug: 'data-breach-risk-calculator', category: 'Security & Compliance', tier: 'free', isAI: false, icon: '🚨', status: 'published', sortOrder: 52, description: 'Calculate the estimated financial liability of a data breach.' },
  { id: 'tool_ransomware', name: 'Ransomware Downtime Cost Calculator', slug: 'ransomware-downtime-calculator', category: 'Security & Compliance', tier: 'freemium', isAI: false, icon: '💸', status: 'published', sortOrder: 53, description: 'Analyze the hourly financial impact of system downtime during an attack.' },
  { id: 'tool_brand_vault', name: 'Brand Asset Vault Builder', slug: 'brand-asset-vault-builder', category: 'Security & Compliance', tier: 'free', isAI: false, icon: '🗄️', status: 'published', sortOrder: 54, description: 'Generate a secure, read-only dashboard for final client assets.' },
  { id: 'tool_zero_trust2', name: 'Zero Trust Scoper', slug: 'zero-trust-scoper', category: 'Security & Compliance', tier: 'freemium', isAI: false, icon: '🔒', status: 'published', sortOrder: 55, description: 'Map security perimeters for Zero Trust implementation.' },
  { id: 'tool_server_cfg2', name: 'Server Hardening Config', slug: 'server-hardening-config', category: 'Security & Compliance', tier: 'freemium', isAI: false, icon: '⚙️', status: 'published', sortOrder: 56, description: 'Harden your web server with secure configuration snippets.' },
  { id: 'tool_gdpr2', name: 'GDPR Compliance Checklist', slug: 'gdpr-compliance-checklist', category: 'Security & Compliance', tier: 'free', isAI: false, icon: '✅', status: 'published', sortOrder: 57, description: 'Generate a GDPR compliance checklist for your SaaS or website.' },
  { id: 'tool_http_audit', name: 'HTTP Header Security Audit', slug: 'http-header-security-audit', category: 'Security & Compliance', tier: 'free', isAI: false, icon: '🔎', status: 'published', sortOrder: 58, description: 'Audit CSP, HSTS, and X-Frame-Options headers on any site.' },

  // OPERATIONS & PM
  { id: 'tool_invoice', name: 'Invoice Generator', slug: 'invoice-generator', category: 'Operations & PM', tier: 'free', isAI: false, icon: '🧾', status: 'published', sortOrder: 59, description: 'Create and download professional invoices without watermarks.' },
  { id: 'tool_capacity', name: 'Agency Capacity Planner', slug: 'agency-capacity-planner', category: 'Operations & PM', tier: 'free', isAI: false, icon: '📅', status: 'published', sortOrder: 60, description: 'Manage team hours and project bandwidth in one dashboard.' },
  { id: 'tool_task_triage', name: 'Full-Stack Task Triage', slug: 'task-triage', category: 'Operations & PM', tier: 'free', isAI: false, icon: '🎯', status: 'published', sortOrder: 61, description: 'Drag-and-drop Eisenhower matrix to manage agency workloads.' },
  { id: 'tool_timeline', name: 'Project Timeline Gen', slug: 'project-timeline-gen', category: 'Operations & PM', tier: 'free', isAI: false, icon: '📆', status: 'published', sortOrder: 62, description: 'Generate Gantt-style visual timelines for client milestones.' },
  { id: 'tool_billable', name: 'Billable Hours Tracker', slug: 'billable-hours-tracker', category: 'Operations & PM', tier: 'freemium', isAI: false, icon: '⏱️', status: 'published', sortOrder: 63, description: 'Track your hours and sync them to your projects.' },
  { id: 'tool_expense', name: 'Business Expense Tracker', slug: 'business-expense-tracker', category: 'Operations & PM', tier: 'free', isAI: false, icon: '📒', status: 'published', sortOrder: 64, description: 'Track and categorize your business expenses.' },
  { id: 'tool_currency', name: 'Currency Rate Converter', slug: 'currency-rate-converter', category: 'Operations & PM', tier: 'free', isAI: false, icon: '💱', status: 'published', sortOrder: 65, description: 'Live exchange rates for 160+ currencies.' },
  { id: 'tool_onboarding', name: 'Onboarding Checklist', slug: 'onboarding-checklist', category: 'Operations & PM', tier: 'free', isAI: false, icon: '✅', status: 'published', sortOrder: 66, description: 'Custom client workflows and onboarding trackers.' },
  { id: 'tool_revision', name: 'Revision Token Tracker', slug: 'revision-token-tracker', category: 'Operations & PM', tier: 'free', isAI: false, icon: '🔄', status: 'published', sortOrder: 67, description: 'Visually track client revisions and lock scopes.' },
  { id: 'tool_timezone', name: 'Global Timezone Converter', slug: 'global-timezone-converter', category: 'Operations & PM', tier: 'free', isAI: false, icon: '🌍', status: 'published', sortOrder: 68, description: 'Convert times across multiple client timezones.' },
];

export const DEFAULT_BLOGS = [
  {
    id: 'blog_001',
    title: 'SOP: Executing High-Stakes Data Migrations',
    slug: 'sop-executing-high-stakes-data-migrations',
    category: 'Operations SOP',
    type: 'SOP',
    status: 'published',
    excerpt: 'The strict sign-off checklist required to move raw data and SEO equity safely between enterprise platforms.',
    content: '',
    coverImage: '',
    tags: ['data', 'migration', 'SOP'],
    readTime: '8 min',
    publishedAt: '2026-04-10',
    views: 142,
    relatedTools: ['tool_data_migration']
  },
  {
    id: 'blog_002',
    title: 'SOP: Scoping Deep API Integrations',
    slug: 'sop-scoping-deep-api-integrations',
    category: 'Operations SOP',
    type: 'SOP',
    status: 'published',
    excerpt: 'How to calculate complexity multipliers and build padded timelines for ERP and custom API rollouts.',
    content: '',
    coverImage: '',
    tags: ['API', 'integration', 'scoping', 'SOP'],
    readTime: '6 min',
    publishedAt: '2026-04-08',
    views: 98,
    relatedTools: ['tool_erp']
  },
  {
    id: 'blog_003',
    title: 'SOP: Auditing Web Accessibility (WCAG 2.1)',
    slug: 'sop-auditing-web-accessibility',
    category: 'Operations SOP',
    type: 'SOP',
    status: 'published',
    excerpt: 'The procedure for checking luminosity to ensure AA and AAA legal compliance for enterprise clients.',
    content: '',
    coverImage: '',
    tags: ['accessibility', 'WCAG', 'SOP'],
    readTime: '5 min',
    publishedAt: '2026-04-05',
    views: 76,
    relatedTools: ['tool_wcag']
  },
  {
    id: 'blog_004',
    title: 'How to Set Your Freelance Rate in 2026',
    slug: 'how-to-set-freelance-rate-2026',
    category: 'Guides',
    type: 'GUIDE',
    status: 'published',
    excerpt: 'A complete guide to calculating your minimum viable rate based on expenses, taxes, and income goals.',
    content: '',
    coverImage: '',
    tags: ['pricing', 'rate', 'freelancing'],
    readTime: '7 min',
    publishedAt: '2026-03-20',
    views: 312,
    relatedTools: ['tool_rate_calc']
  },
  {
    id: 'blog_005',
    title: 'The Freelancer\'s Guide to Writing Proposals That Win',
    slug: 'freelancers-guide-to-winning-proposals',
    category: 'Guides',
    type: 'GUIDE',
    status: 'published',
    excerpt: 'Structure, tone, and psychology behind proposals that convert prospects into paying clients.',
    content: '',
    coverImage: '',
    tags: ['proposals', 'sales', 'freelancing'],
    readTime: '10 min',
    publishedAt: '2026-03-15',
    views: 445,
    relatedTools: ['tool_ai_proposal']
  },
  {
    id: 'blog_006',
    title: 'Understanding CPM, CPC, and CPA for Freelance Media Buyers',
    slug: 'understanding-cpm-cpc-cpa-media-buying',
    category: 'Blog',
    type: 'BLOG',
    status: 'published',
    excerpt: 'Break down the three core ad pricing models and when to optimize for each.',
    content: '',
    coverImage: '',
    tags: ['advertising', 'media-buying', 'CPM'],
    readTime: '6 min',
    publishedAt: '2026-03-10',
    views: 189,
    relatedTools: ['tool_cpm', 'tool_fb_cpa']
  },
  {
    id: 'blog_007',
    title: 'GDPR Compliance Checklist for Freelance Web Developers',
    slug: 'gdpr-compliance-checklist-freelance-developers',
    category: 'Guides',
    type: 'GUIDE',
    status: 'draft',
    excerpt: 'Everything you need to know to keep your clients\' websites compliant with GDPR and CCPA.',
    content: '',
    coverImage: '',
    tags: ['GDPR', 'compliance', 'legal'],
    readTime: '8 min',
    publishedAt: null,
    views: 0,
    relatedTools: ['tool_gdpr', 'tool_privacy']
  }
];

export const DEFAULT_USERS = [
  { id: 'user_001', name: 'Sarah Chen', email: 'sarah@example.com', tier: 'pro', status: 'active', joinedAt: '2026-01-15', lastSeen: '2026-05-14', aiCreditsUsed: 234, aiCreditsLimit: 1000, toolLaunches: 47, savedItems: 12 },
  { id: 'user_002', name: 'Marcus Webb', email: 'marcus@example.com', tier: 'pro', status: 'active', joinedAt: '2026-03-01', lastSeen: '2026-05-13', aiCreditsUsed: 89, aiCreditsLimit: 1000, toolLaunches: 23, savedItems: 5 },
  { id: 'user_003', name: 'Priya Sharma', email: 'priya@example.com', tier: 'pro', status: 'active', joinedAt: '2026-02-10', lastSeen: '2026-05-12', aiCreditsUsed: 567, aiCreditsLimit: 1000, toolLaunches: 91, savedItems: 28 },
  { id: 'user_004', name: 'James Okafor', email: 'james@example.com', tier: 'free', status: 'active', joinedAt: '2026-04-05', lastSeen: '2026-05-10', aiCreditsUsed: 8, aiCreditsLimit: 10, toolLaunches: 12, savedItems: 3 },
  { id: 'user_005', name: 'Lisa Tanaka', email: 'lisa@example.com', tier: 'lifetime', status: 'active', joinedAt: '2026-01-01', lastSeen: '2026-05-14', aiCreditsUsed: 412, aiCreditsLimit: 1000, toolLaunches: 134, savedItems: 67 },
  { id: 'user_006', name: 'Ahmed Hassan', email: 'ahmed@example.com', tier: 'free', status: 'active', joinedAt: '2026-05-01', lastSeen: '2026-05-14', aiCreditsUsed: 3, aiCreditsLimit: 10, toolLaunches: 7, savedItems: 1 },
  { id: 'user_007', name: 'Emma Williams', email: 'emma@example.com', tier: 'free', status: 'suspended', joinedAt: '2026-03-15', lastSeen: '2026-04-20', aiCreditsUsed: 10, aiCreditsLimit: 10, toolLaunches: 5, savedItems: 0 },
];

export const DEFAULT_SUBSCRIPTIONS = [
  { id: 'sub_001', userId: 'user_001', userName: 'Sarah Chen', email: 'sarah@example.com', plan: 'Pro Annual', amount: 79, currency: 'USD', status: 'active', startDate: '2026-01-15', nextBilling: '2027-01-15', cancelAtEnd: false },
  { id: 'sub_002', userId: 'user_002', userName: 'Marcus Webb', email: 'marcus@example.com', plan: 'Pro Monthly', amount: 9, currency: 'USD', status: 'active', startDate: '2026-03-01', nextBilling: '2026-06-01', cancelAtEnd: false },
  { id: 'sub_003', userId: 'user_003', userName: 'Priya Sharma', email: 'priya@example.com', plan: 'Pro Monthly', amount: 9, currency: 'USD', status: 'active', startDate: '2026-02-10', nextBilling: '2026-06-10', cancelAtEnd: false },
  { id: 'sub_004', userId: 'user_004', userName: 'James Okafor', email: 'james@example.com', plan: 'Pro Annual', amount: 79, currency: 'USD', status: 'cancelled', startDate: '2025-11-20', nextBilling: null, cancelAtEnd: true },
  { id: 'sub_005', userId: 'user_005', userName: 'Lisa Tanaka', email: 'lisa@example.com', plan: 'Lifetime', amount: 199, currency: 'USD', status: 'active', startDate: '2026-01-01', nextBilling: null, cancelAtEnd: false },
];

export const DEFAULT_FLAGS = {
  // AI Tools
  ai_proposal_generator: true,
  ai_portfolio_builder: true,
  ai_follow_up_generator: true,
  ai_cold_pitch: true,
  ai_content_brief: true,
  ai_testimonial_tool: true,
  ai_framework_matrix: true,

  // Site Features
  announcement_bar: true,
  maintenance_mode: false,
  referral_program: false,
  pro_gate_strict: false,
  show_launch_counts: true,
  new_user_onboarding: true,
  blog_comments: false,
  newsletter_signup: true,

  // Content sections
  resources_sops: true,
  resources_guides: true,
  resources_templates: true,
  resources_glossary: true,
  resources_blog: true,

  // Monetization
  annual_plan_discount: true,
  lifetime_plan_visible: true,
  coupon_codes_enabled: false,
};

export const DEFAULT_PLANS = {
  free: {
    name: 'Free',
    badge: 'Always Free',
    price: 0,
    aiCredits: 10,
    aiCreditsLabel: '10 AI generations/month',
    invoiceLimit: 3,
    invoiceLimitLabel: '3 invoices/month (watermarked)',
    savedItems: 10,
    pdfWatermark: true,
    features: [
      'Access to all 68 calculators',
      '10 AI generations per month',
      '3 PDF exports (watermarked)',
      '10 saved results',
      'Community support'
    ]
  },
  pro: {
    name: 'Pro',
    badge: 'Most Popular',
    priceMonthly: 9,
    priceAnnual: 79,
    annualSavings: '27%',
    stripePriceMonthly: '',
    stripePriceAnnual: '',
    aiCredits: 1000,
    aiCreditsLabel: '1,000 AI generations/month',
    invoiceLimit: null,
    invoiceLimitLabel: 'Unlimited invoices (no watermark)',
    savedItems: null,
    pdfWatermark: false,
    features: [
      'Everything in Free',
      '1,000 AI generations per month',
      'Unlimited PDF exports (no watermark)',
      'Unlimited saved results',
      'Priority email support',
      'Early access to new tools'
    ]
  },
  lifetime: {
    name: 'Lifetime',
    badge: 'Best Value',
    price: 199,
    stripePriceId: '',
    aiCredits: 1000,
    features: [
      'Everything in Pro — forever',
      'One-time payment',
      'All future tools included',
      'Lifetime updates'
    ]
  }
};

export const DEFAULT_AI_USAGE = [
  { id: 'ai_001', userId: 'user_001', userName: 'Sarah Chen', toolName: 'AI Proposal Generator', model: 'claude-sonnet-4-20250514', tokensIn: 450, tokensOut: 980, costUSD: 0.0042, status: 'success', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'ai_002', userId: 'user_003', userName: 'Priya Sharma', toolName: 'AI Portfolio Builder', model: 'claude-sonnet-4-20250514', tokensIn: 380, tokensOut: 820, costUSD: 0.0036, status: 'success', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'ai_003', userId: 'user_005', userName: 'Lisa Tanaka', toolName: 'Cold Pitch Framework', model: 'claude-sonnet-4-20250514', tokensIn: 210, tokensOut: 390, costUSD: 0.0018, status: 'success', timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: 'ai_004', userId: 'user_002', userName: 'Marcus Webb', toolName: 'AI Proposal Generator', model: 'claude-sonnet-4-20250514', tokensIn: 510, tokensOut: 1100, costUSD: 0.0049, status: 'success', timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: 'ai_005', userId: 'user_001', userName: 'Sarah Chen', toolName: 'Content Brief Automation', model: 'claude-sonnet-4-20250514', tokensIn: 290, tokensOut: 750, costUSD: 0.0031, status: 'success', timestamp: new Date(Date.now() - 18000000).toISOString() },
];

export function generateMockEvents(tools: any[]) {
  const events = [];
  const now = Date.now();
  const toolNames = tools.map(t => ({ id: t.id, name: t.name, tier: t.tier }));
  
  // Generate 200 random events over last 30 days
  for (let i = 0; i < 200; i++) {
    const tool = toolNames[Math.floor(Math.random() * toolNames.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now - daysAgo * 86400000);
    events.push({
      type: 'tool_launch',
      toolId: tool.id,
      toolName: tool.name,
      toolTier: tool.tier,
      timestamp: date.toISOString(),
      date: date.toISOString().split('T')[0]
    });
  }

  // Save mock events
  localStorage.setItem('fk_events', JSON.stringify(events));
  return events;
}

export function syncLaunchCounts(tools: any[], events: any[]) {
  return tools.map(tool => ({
    ...tool,
    launchCount: events.filter(e => e.toolId === tool.id).length
  }));
}
