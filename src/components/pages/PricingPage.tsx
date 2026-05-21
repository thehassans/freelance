import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, HelpCircle, Zap, ShieldCheck, CreditCard, Sparkles, X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { DatabaseService } from '../../services/DatabaseService';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const { user, tier, setTier, showAuthModal } = useUser();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!user?.uid) {
      showAuthModal('signup');
      return;
    }

    if (tier === 'PRO') return;
      
    // Simulate Stripe Checkout Redirect
    console.log("Redirecting to Stripe...");
    const win = window.open('https://stripe.com', '_blank');
    if (win) win.focus();
    
    setIsUpgrading(true);
    try {
      await DatabaseService.upgradeUserTier(user.uid, 'PRO');
      setTier('PRO');
      alert("Demo: You are now a PRO member!");
    } catch (e) {
      console.error("Upgrade failed:", e);
    } finally {
      setIsUpgrading(false);
    }
  };

  const plans = [
    {
      id: 'FREE',
      name: 'Free',
      description: 'Essential utilities for independent freelancers.',
      price: '0',
      cta: user && tier === 'FREE' ? 'Current Plan' : 'Start for Free',
      disabled: user && tier === 'FREE',
      features: [
        { text: 'Access to 70+ standard calculators', included: true },
        { text: '5 Free AI Generations / month', included: true },
        { text: 'Standard PDF & Excel Exports', included: true },
        { text: 'Local browser storage', included: true },
        { text: 'No Custom Agency Branding', included: false },
        { text: 'Watermarked Documents', included: false },
        { text: 'No Legal Contract Builder', included: false },
        { text: 'No Agency Capacity Planner', included: false }
      ],
      highlight: false
    },
    {
      id: 'PRO',
      name: 'Pro',
      description: 'The complete operational suite for scaling agencies.',
      price: isAnnual ? '89' : '9',
      period: isAnnual ? '/year' : '/month',
      cta: user && tier === 'PRO' ? 'Current Plan' : 'Upgrade to Pro',
      disabled: user && tier === 'PRO',
      features: [
        { text: 'Unlimited AI Proposals & Scripts', included: true },
        { text: 'Unwatermarked, Clean Exports', included: true },
        { text: 'Custom Agency Colors & Branding', included: true },
        { text: 'Premium Legal Contracts & NDAs', included: true },
        { text: 'Agency Capacity Planner & Heatmaps', included: true },
        { text: 'Cloud Sync & Client CRM', included: true },
        { text: 'Priority 24/7 Support', included: true }
      ],
      highlight: true
    }
  ];

  const faqs = [
    {
      q: "Can I cancel my Pro subscription anytime?",
      a: "Absolutely. You can cancel your subscription with one click from your account settings. You'll retain access until the end of your billing period."
    },
    {
      q: "Is my client data secure?",
      a: "Yes. We use standard AES-256 encryption. For 'Free' users, data stays entirely in your browser. For 'Pro' users, cloud saves are end-to-end encrypted."
    },
    {
      q: "What happens if I downgrade back to Free?",
      a: "Your existing saved invoices and proposals will remain accessible, but you will lose access to premium editing features and unlimited AI generations."
    },
    {
      q: "Do you offer a refund policy?",
      a: "We offer a 14-day 'no questions asked' refund for your first purchase. This is the ROI guarantee: if it doesn't save you time, we don't want your money."
    }
  ];

  return (
    <div className="py-12 md:py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Invest in your <span className="text-primary italic">Freedom</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            If FreelancerKit saves you just <span className="font-bold text-slate-900">one hour a month</span>, it has already paid for itself. Stop fighting spreadsheets and start growing.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-colors hover:bg-slate-300"
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Annual</span>
              <span className="px-2 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Save 20%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 md:p-10 border transition-all ${plan.highlight ? 'border-primary shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-sm'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg shadow-primary/20">
                  <Sparkles size={14} /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-slate-900">${plan.price}</span>
                <span className="text-slate-400 font-bold">{plan.period}</span>
              </div>

              <button 
                onClick={plan.id === 'PRO' ? handleUpgrade : undefined}
                disabled={plan.disabled}
                className={`w-full py-4 rounded-2xl font-black transition-all mb-10 ${plan.highlight ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 disabled:opacity-50'}`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-4 text-start">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${
                      feature.included 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {feature.included ? <Check size={14} /> : <X size={14} />}
                    </div>
                    <span className={`text-sm font-medium ${
                      feature.included 
                        ? 'text-slate-600' 
                        : 'text-slate-400 line-through decoration-slate-300 opacity-70'
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ROI Spotlight */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden mb-24">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -mr-48 -mt-48" />
          <h2 className="text-3xl md:text-5xl text-white font-black mb-8 relative z-10">Calculated ROI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-white">
            <div>
              <div className="text-primary text-4xl font-black mb-2">2h+</div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Saved per week</p>
            </div>
            <div>
              <div className="text-primary text-4xl font-black mb-2">100%</div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Privacy control</p>
            </div>
            <div>
              <div className="text-primary text-4xl font-black mb-2">3x</div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Higher closing rate</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Overcoming Objections</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 p-6 md:p-8 rounded-3xl group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 cursor-help">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                    <HelpCircle size={18} />
                   </div>
                   {faq.q}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed ps-11">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <p className="text-slate-400 text-sm font-medium mb-4">Secure checkout powered by Stripe</p>
          <div className="flex justify-center gap-6 opacity-30 grayscale items-center">
             <ShieldCheck size={24} />
             <CreditCard size={24} />
             <Zap size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
