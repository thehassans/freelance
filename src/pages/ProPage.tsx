import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Zap, Shield, Image as ImageIcon, Globe, Users, Lock, Unlock, CreditCard, Star, LifeBuoy, Sparkles } from 'lucide-react';
import TrustLogos from '../components/layout/TrustLogos';
import { useUser } from '../contexts/UserContext';
import { useSearchParams } from 'react-router-dom';

export default function ProPage() {
  const { user, isPro } = useUser();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = React.useState<'free' | 'pro'>('pro');
  const [loading, setLoading] = React.useState(false);
  
  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('success') === 'false';

  const handleUpgrade = async () => {
    if (!user) {
      alert("Please sign in to upgrade to Pro.");
      return;
    }

    if (isPro) {
      alert("You are already a Pro user! Thank you for your support.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, userEmail: user.email }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#0f4c75]/5 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-900 max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-black mb-2">Welcome to Pro, {user?.name?.split(' ')[0]}! 🚀</h3>
              <p className="font-medium opacity-80">Your payment was successful. Your account is being provisioned and will be updated in a few moments.</p>
            </motion.div>
          )}

          {canceled && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-900 max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-black mb-2">Payment Cancelled</h3>
              <p className="font-medium opacity-80">No worries! You can upgrade whenever you're ready to scale your agency.</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f4c75]/10 rounded-full text-[#0f4c75] text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <Zap size={14} /> FreelancerKit Pro
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Scale your agency.<br />Protect your time.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Unlock the advanced operational tools used by elite independent professionals. 
            Automate your workflow and focus on what you do best.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="px-10 py-5 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#0b395a] transition-all shadow-xl shadow-[#0f4c75]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isPro ? 'Already Pro' : 'Upgrade to Pro Now'}
            </button>
          </motion.div>
        </div>

        {/* TRUST LOGOS - Social Proof */}
        <div className="mt-16 border-y border-slate-100 py-10 bg-slate-50/50">
          <TrustLogos />
        </div>
      </section>

      {/* Feature 1: Capacity Planner */}
      <section className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="aspect-video bg-slate-50 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f4c75]/10 to-transparent" />
                <div className="absolute inset-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="h-4 w-32 bg-slate-100 rounded-full" />
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="space-y-2">
                        <div className="h-20 bg-slate-50 rounded-xl relative overflow-hidden">
                          <div className={`absolute bottom-0 w-full bg-[#0f4c75]/20`} style={{ height: `${20 + i * 15}%` }} />
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full" />
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100" />
                        <div className="h-3 w-1/2 bg-slate-50 rounded-full" />
                        <div className="ms-auto h-3 w-12 bg-[#0f4c75]/10 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 text-start">
              <div className="w-12 h-12 bg-[#0f4c75]/10 rounded-2xl flex items-center justify-center text-[#0f4c75] mb-6">
                <Users size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">Capacity Planner</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Prevent team burnout before it happens. Visualize your bandwidth, track assigned hours, and maximize your profit margins with real-time utilization metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Mini-CRM */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-start">
              <div className="w-12 h-12 bg-[#0f4c75]/10 rounded-2xl flex items-center justify-center text-[#0f4c75] mb-6">
                <Shield size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">Smart Mini-CRM</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Stop typing the same addresses. Securely save your frequent clients and recurring line items locally to generate proposals and invoices in seconds.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="aspect-video bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-300/50 overflow-hidden relative p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                    <div className="h-8 w-24 bg-[#0f4c75] rounded-xl" />
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-slate-50 rounded-2xl shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users size={20} />
                      </div>
                      <div className="space-y-2 flex-grow">
                        <div className="h-3 w-1/3 bg-slate-200 rounded-full" />
                        <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: White-Label Exports */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-[#0f4c75]/10 rounded-2xl flex items-center justify-center text-[#0f4c75] mx-auto mb-6">
            <ImageIcon size={24} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">White-Label Exports</h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-16">
            Your brand, front and center. Remove our watermarks from all PDF exports and add your own custom logo for a truly professional touch.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Free Version */}
            <div className="space-y-6">
              <div className="aspect-[3/4] bg-slate-50 rounded-3xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center rotate-12 opacity-10 pointer-events-none">
                  <span className="text-4xl font-black text-slate-900 whitespace-nowrap">FREELANCERKIT WATERMARK</span>
                </div>
                <div className="w-3/4 h-3/4 bg-white shadow-lg rounded-lg p-6 space-y-4">
                  <div className="h-4 w-1/2 bg-slate-100 rounded" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-50 rounded" />
                    <div className="h-2 w-full bg-slate-50 rounded" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Free Version</p>
            </div>
            
            {/* Pro Version */}
            <div className="space-y-6">
              <div className="aspect-[3/4] bg-white rounded-3xl border-2 border-[#0f4c75]/20 shadow-2xl shadow-[#0f4c75]/10 relative overflow-hidden flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-white shadow-xl rounded-lg p-6 space-y-4 relative">
                  <div className="absolute top-6 end-6 w-12 h-12 bg-[#0f4c75] rounded-xl flex items-center justify-center text-white text-[8px] font-black">LOGO</div>
                  <div className="h-4 w-1/2 bg-slate-900 rounded" />
                  <div className="space-y-2 pt-8">
                    <div className="h-2 w-full bg-slate-50 rounded" />
                    <div className="h-2 w-full bg-slate-50 rounded" />
                    <div className="h-2 w-full bg-slate-50 rounded" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-black text-[#0f4c75] uppercase tracking-widest">Pro Version (Clean & Branded)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[#0f4c75]/5 -z-10 blur-3xl rounded-full" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">Invest in your Freedom</h2>
            <p className="text-slate-400 font-medium max-w-lg mx-auto">Choose the plan that fits your current business stage. Upgrade to unlock full operational leverage.</p>
            
            {/* Loss Aversion Toggle */}
            <div className="mt-12 inline-flex items-center p-1 bg-white/5 rounded-2xl border border-white/10">
              <button 
                onClick={() => setViewMode('free')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'free' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                Free User
              </button>
              <button 
                onClick={() => setViewMode('pro')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'pro' ? 'bg-[#0f4c75] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Pro User
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className={`bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col transition-all duration-500 ${viewMode === 'pro' ? 'opacity-40 grayscale blur-[1px]' : 'opacity-100'}`}>
              <div className="mb-8">
                <h3 className="text-xl font-black mb-2 tracking-tight">Standard</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">$0</span>
                  <span className="text-slate-400 font-medium">/forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  { text: '20+ Business Calculators', locked: false },
                  { text: 'Watermarked PDF Exports', locked: false },
                  { text: '5 AI Credits / Month', locked: false },
                  { text: 'Smart Mini-CRM', locked: true },
                  { text: 'White-label Branding', locked: true },
                  { text: 'Capacity Planner', locked: true }
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-3 font-medium ${item.locked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {item.locked ? <Lock size={16} /> : <Check size={18} className="text-green-400" />} {item.text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
                Current Plan
              </button>
            </div>

            {/* Pro Tier */}
            <div className={`bg-white rounded-[2.5rem] p-1 shadow-2xl transition-all duration-500 ${viewMode === 'free' ? 'shadow-none scale-[0.98]' : 'shadow-[#0f4c75]/50 scale-105'} flex flex-col relative overflow-hidden group`}>
              <div className="bg-white px-10 pt-10 pb-10 flex flex-col h-full rounded-[2.2rem]">
                <div className="absolute top-0 end-0 bg-[#0f4c75] text-white px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest">Lifetime Value</div>
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Agency Pro</h3>
                  <div className="flex items-baseline gap-1 text-slate-900">
                    <span className="text-5xl font-black">$89</span>
                    <span className="text-slate-500 font-medium">/year</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-2 flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Save $91 vs Monthly
                  </p>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {[
                    'Full Operational Leverage',
                    'Team Capacity Planner',
                    'Cloud Sync (Mini-CRM)',
                    'White-labeled Exports',
                    'Custom Agency Branding',
                    'Infinite AI Proposals'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                      <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                        <Check size={12} className="text-[#0f4c75]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-5 bg-[#0f4c75] hover:bg-[#0b395a] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#0f4c75]/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : isPro ? 'Already Pro' : (
                    <>Get Unlimited Access <ArrowRight size={16} /></>
                  )}
                </button>
                <div className="mt-4 text-center">
                  <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                    Managing a team of 10+? Contact Sales for volume discounts.
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wall of Love (Social Proof Banner) */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative">
            <div className="text-4xl text-slate-200 font-serif absolute -top-8 -left-8 pointer-events-none">"</div>
            <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-8 relative z-10">
              FreelancerKit replaced three different subscriptions we were using for scoping and contracts. 
              The Algorithmic Recovery tool alone paid for the annual Pro subscription in the first week.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Jenkins" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900">Sarah Jenkins</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Founder, Elevate Digital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Feature Highlight Reel */}
      <section className="py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0f4c75]">Elite Features</span>
            <h2 className="text-3xl font-black text-slate-900 mt-4 tracking-tight">Professionally Vetted. Agency Ready.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Unlimited AI Generation',
                desc: 'Bypass the pooled monthly limit. Use our neural engines to generate high-converting copy without friction.',
                icon: <Sparkles className="text-blue-600" />
              },
              {
                title: 'White-label Exports',
                desc: 'Apply your hex codes, upload your agency logo, and remove all FreelancerKit branding from every PDF.',
                icon: <ImageIcon className="text-emerald-600" />
              },
              {
                title: 'Priority Support',
                desc: 'Join our private Agency Pro Slack channel and get direct access to our product team for feature requests.',
                icon: <LifeBuoy className="text-rose-600" />
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Equation Section */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Pays for itself in one billable hour.</h2>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-2xl md:text-5xl font-black text-[#0f4c75] flex items-center gap-4 flex-wrap justify-center">
              <span>1 Hour Saved</span>
              <span className="text-slate-300">/ Month</span>
              <span className="text-slate-400">=</span>
              <span className="text-emerald-600">$1,200+ Annual Value</span>
            </div>
            <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed">
              Stop wasting non-billable hours wrestling with scattered Google Docs and manual spreadsheets. 
              FreelancerKit centralizes your operations so you can focus on writing code and closing clients.
            </p>
          </div>
        </div>
      </section>

      {/* Comprehensive Feature Matrix */}
      <section className="py-24 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Compare Plan Features</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-6 px-4 text-left text-sm font-black uppercase tracking-widest text-slate-400">Feature</th>
                  <th className="py-6 px-4 text-center text-sm font-black uppercase tracking-widest text-slate-400">Free</th>
                  <th className="py-6 px-4 text-center text-sm font-black uppercase tracking-widest text-[#0f4c75]">Agency Pro ($89)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: 'Standard Calculators', free: '✓', pro: '✓' },
                  { feature: 'AI Proposal Scripts', free: '5 / mo', pro: 'Unlimited' },
                  { feature: 'PDF Exports', free: 'Watermarked', pro: 'Clean / White-labeled' },
                  { feature: 'Client CRM', free: 'Local Only', pro: 'Full Cloud Sync' },
                  { feature: 'Capacity Planner', free: 'Basic Views', pro: 'Advanced Analytics' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-4 text-slate-900 font-bold">{row.feature}</td>
                    <td className="py-6 px-4 text-center text-slate-500 font-medium">{row.free}</td>
                    <td className="py-6 px-4 text-center text-[#0f4c75] font-black">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Risk Reversal Block */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="p-10 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white relative">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-center text-emerald-500">
                <Shield size={24} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">14-Day Zero-Risk Guarantee.</h2>
             <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                Take Agency Pro for a spin. Generate your contracts, use the AI planner, and white-label your exports. 
                If it doesn't instantly streamline your agency workflow, email us within 14 days for a full, immediate refund. 
                No questions asked.
             </p>
             <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                <Star size={14} fill="currentColor" /> TRUSTED BY 5,000+ PROFESSIONALS
             </div>
          </div>
        </div>
      </section>

      {/* Final Push Bottom CTA */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
          {/* Decorative mesh */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#0f4c75_0%,transparent_40%)] opacity-30" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,#0f4c75_0%,transparent_40%)] opacity-30" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight">Ready to stop fighting spreadsheets?</h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Join 5,000+ independent professionals who are scoping faster, closing more leads, and protecting their profit margins.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={handleUpgrade}
                className="w-full sm:w-auto px-10 py-5 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#155e8d] transition-all shadow-xl shadow-[#0f4c75]/20 active:scale-95"
              >
                Upgrade to Agency Pro
              </button>
              <button 
                onClick={() => window.location.href = '/tools'}
                className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Start with Free Tools
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
