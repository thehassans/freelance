import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: "Are the free tools actually free?",
    answer: "Yes. Over 30 of our core calculators, formatters, and utility tools are completely free to use without an account. For our advanced AI generators and document builders, we operate on a freemium model: you get 5 free premium exports per month before needing to upgrade."
  },
  {
    question: "How secure is my financial and client data?",
    answer: "We treat your data with enterprise-level security. Our standalone calculators run locally in your browser, meaning your financial inputs never hit our servers. For saved invoices and contracts, data is strictly encrypted and routed through our secure Firebase infrastructure."
  },
  {
    question: "Can I remove the FreelancerKit branding from my invoices?",
    answer: "Absolutely. Free users will see a subtle watermark on exported PDFs. Upgrading to Agency Pro unlocks fully white-labeled exports, allowing you to apply your own custom agency branding, logos, and hex codes to every deliverable."
  },
  {
    question: "How do the AI generation credits work?",
    answer: "Tools like our AI Proposal Engine and Portfolio Builder use advanced LLMs to generate high-converting copy. Free accounts share a pooled monthly limit of 5 generations. Agency Pro users bypass this limit entirely for unrestricted workflow scaling."
  },
  {
    question: "Am I locked into a long-term contract?",
    answer: "Never. You can upgrade, downgrade, or cancel your Pro subscription at any time directly from your billing dashboard. If you cancel, you will retain Pro access until the end of your current billing cycle, and your generated documents will always remain yours."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Column: Sticky Title */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f4c75]/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0f4c75] mb-6 shadow-sm">
              <HelpCircle size={14} /> Support Center
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Everything you need to know about pricing, privacy, and how we handle your business data.
            </p>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div 
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 group ${
                    openIndex === index 
                    ? 'border-[#0f4c75]/30 bg-[#0f4c75]/[0.02] shadow-sm' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-[#0f4c75]' : 'text-slate-900 group-hover:text-[#0f4c75]'}`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`${openIndex === index ? 'text-[#0f4c75]' : 'text-slate-400'}`}
                    >
                      <ChevronDown size={24} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed border-t border-slate-100/50 pt-6">
                          {faq.answer}
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
    </section>
  );
}
