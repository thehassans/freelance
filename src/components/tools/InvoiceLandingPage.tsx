import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  ShieldCheck, 
  Calculator, 
  CheckCircle2, 
  ChevronDown, 
  Code, 
  User, 
  Building2,
  Briefcase,
  ArrowRight,
  Receipt,
  Columns,
  Palette,
  LayoutTemplate,
  Mail,
  Repeat,
  BarChart,
  Smartphone
} from 'lucide-react';
import InvoiceGenerator from './InvoiceGenerator';

interface InvoiceLandingPageProps {
  onPricingClick?: () => void;
}

export default function InvoiceLandingPage({ onPricingClick }: InvoiceLandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Receipt size={32} className="text-[#0f4c75]" />,
      title: "Easy Tax Invoice",
      description: "Create, manage, send and track tax invoices without any hassle."
    },
    {
      icon: <Columns size={32} className="text-[#0f4c75]" />,
      title: "Customization of Columns",
      description: "Customizable invoice format to add more relevant information and columns."
    },
    {
      icon: <Palette size={32} className="text-[#0f4c75]" />,
      title: "Brand Your Invoice",
      description: "Easily add the business logo and change the color of the invoice with one click. No Watermark. No Ads."
    },
    {
      icon: <LayoutTemplate size={32} className="text-[#0f4c75]" />,
      title: "Invoice Templates",
      description: "Beautifully designed and fully customizable invoice templates with magic color feature."
    },
    {
      icon: <Mail size={32} className="text-[#0f4c75]" />,
      title: "Email & Track Invoices",
      description: "Send invoice via email and get to know when the invoice was opened."
    },
    {
      icon: <Repeat size={32} className="text-[#0f4c75]" />,
      title: "Recurring Invoices",
      description: "Create recurring invoices for you that take place at regular intervals."
    },
    {
      icon: <BarChart size={32} className="text-[#0f4c75]" />,
      title: "Insightful Reports",
      description: "Get ready-made essential reports to analyze your business and client information."
    },
    {
      icon: <Smartphone size={32} className="text-[#0f4c75]" />,
      title: "Easy Access Anywhere",
      description: "Easy to use dashboard for mobile and desktop. Get email alerts in real-time."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Add Details",
      description: "Input your agency info, client details, and itemized services."
    },
    {
      number: "02",
      title: "Apply Compliance",
      description: "Toggle on necessary tax columns or payment QR codes."
    },
    {
      number: "03",
      title: "Download & Get Paid",
      description: "Export a pristine A4 PDF ready to send to your client."
    }
  ];

  const seoSections = [
    {
      title: "Online Invoice Generator for Pakistan — GST, NTN, STRN & FBR Compliance",
      content: "When generating invoices in Pakistan, compliance with the Federal Board of Revenue (FBR) and the Sales Tax Act 1990 is essential. A professional tax invoice must reflect the current 18% GST rate, and depending on your region, may need to comply with provincial authorities like SRB (Sindh), PRA (Punjab), or KPKRA. For legitimate B2B transactions, always include your National Tax Number (NTN) and Sales Tax Registration Number (STRN). Businesses exceeding the PKR 10 million threshold or mandated sectors must integrate with PRAL e-invoicing. This invoice generator ensures you can easily add all required tax compliance fields and custom columns to remain strictly compliant with Pakistani tax laws."
    },
    {
      title: "What is an Invoice vs. Receipt vs. Bill?",
      content: "While often used interchangeably, these terms have distinct financial meanings. An **invoice** is a commercial document sent by a seller to a buyer to request payment for goods or services provided, issued before payment is made. A **receipt** is the definitive proof of payment, acknowledging that the invoice has been settled. A **bill** is simply the buyer's perspective of the invoice—you send an invoice, and your client receives it as a bill they must pay."
    },
    {
      title: "6 Types of Invoices",
      content: "Understanding invoice types helps streamline your accounting. **1. Standard Invoice:** The foundational bill for services rendered. **2. Proforma Invoice:** A preliminary bill sent to buyers in advance of a shipment or delivery of goods. **3. Service Invoice:** Specifically itemizes hours or consulting tasks. **4. Commercial Invoice:** Used for international trade and customs declarations. **5. Recurring Invoice:** Regularly sent at specific intervals (weekly, monthly) for ongoing services. **6. Credit Note:** Issued to refund or provide credit to a buyer for returned goods or overbilling."
    },
    {
      title: "Invoice Numbering Methods",
      content: "A solid invoice numbering system prevents accounting chaos. You can use several methods: **Sequential:** The simplest method, starting from a base number and increasing by one (e.g., INV/001, INV/002). **Date Wise:** Incorporates the creation date for easy chronological tracking (e.g., 2021-04-23-001). **Project ID:** Links the invoice directly to a specific project code (e.g., PRJ-XYZ-01). **Client ID:** Attributes the invoice to a specific customer's account number (e.g., CLI-402-001)."
    },
    {
      title: "How to Make an Invoice for Freelancers",
      content: "Freelancers must ensure their invoices act as professional agreements as much as payment requests. Start by clearly defining your terms of service directly on the invoice. Keep the line-item descriptions clear and easily understandable to non-technical clients. Explicitly define your payment policies, including net terms (e.g., Net 15, Net 30) and any late fee penalties. Finally, offer multiple payment options by providing clear banking details, payment links, and payment instructions to remove any friction from getting paid."
    }
  ];

  const faqs = [
    {
      question: "What is an invoice used for?",
      answer: "To accept payments, track growth, record sales, file tax returns, and provide legal protection."
    },
    {
      question: "Is this invoice generator truly free?",
      answer: "FREE! It is free for every small business, agency, startup, and entrepreneur. You can generate 15 documents every year."
    },
    {
      question: "Can I add my brand logo and colors?",
      answer: "Yes, you can upload both .jpg and .png format for the logo image and change template colors."
    },
    {
      question: "Do you support recurring invoices?",
      answer: "Yes, you can create weekly, monthly, and yearly recurring invoices."
    },
    {
      question: "Is an account necessary?",
      answer: "Yes, to access all invoices in one place and make creation easy."
    },
    {
      question: "Are my invoices saved online?",
      answer: "Yes. All invoices are saved online and accessible anytime."
    },
    {
      question: "Is my financial data secure?",
      answer: "Yes. Your data is stored securely with encryption and cloud protection. We are ISO/IEC 27001:2022 certified."
    },
    {
      question: "How does the platform make money?",
      answer: "We want to enable easy transactions. We make revenue through our premium marketplace."
    }
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section & Tool */}
      <section>
        <div className="text-center mb-16 px-4 pt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6"
          >
            Free Professional <span className="text-[#0f4c75]">Invoice Generator</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            The fastest way to bill your clients. A feature-rich, high-compliance invoicing tool designed for modern freelancers and agencies.
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <InvoiceGenerator onPricingClick={onPricingClick} />
        </div>
      </section>

      {/* The Extended 'Features' Grid */}
      <section className="bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Built for Serious Business</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Everything you need, nothing you don't.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#0f4c75]/5 transition-all flex flex-col"
              >
                <div className="mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-100">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{feature.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 overflow-hidden pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
              Pristine Invoices in <br/><span className="text-[#0f4c75]">Just 3 Steps</span>
            </h2>
            <div className="space-y-12">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="text-4xl font-black text-slate-200 shrink-0">{step.number}</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-[#0f4c75]/5 rounded-[3rem] -rotate-3 blur-3xl" />
             <div className="relative bg-white p-8 rounded-[3rem] border border-slate-200 shadow-2xl">
                <div className="w-full aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-slate-400">
                    <CheckCircle2 size={64} strokeWidth={1} />
                    <p className="font-bold text-sm uppercase tracking-widest italic">A4 Export Ready</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-[#1a365d] py-24 sm:py-32 rounded-[3.5rem] mx-4 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Tailored for Your Workflow</h2>
            <p className="text-[#1a365d]/20 text-white/60 font-medium text-lg">Whether you're a solo pro or a scaling agency.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <Code className="mb-4 text-white" size={32} />
              <h4 className="text-xl font-bold mb-2">Dev Agencies</h4>
              <p className="text-white/60 text-sm leading-relaxed">Perfect for billing agile sprints, API integrations, and retainer support.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center text-center">
               <User className="mb-4 text-white" size={32} />
               <h4 className="text-xl font-bold mb-2">Consultants</h4>
               <p className="text-white/60 text-sm leading-relaxed">Clean, minimal designs that highlight your professional personal brand.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <Globe className="mb-4 text-white" size={32} />
              <h4 className="text-xl font-bold mb-2">B2B Exporters</h4>
              <p className="text-white/60 text-sm leading-relaxed">Full support for multi-currency billing and international tax compliance.</p>
            </div>
            <div className="p-8 bg-white/10 rounded-3xl border border-white/20 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold mb-2">And You?</h4>
                <p className="text-white/60 text-sm leading-relaxed">Join 2,000+ pros sending invoices today.</p>
              </div>
              <button className="mt-6 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group">
                Start Invoicing <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 'Ultimate SEO Guide' Article Block */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto prose prose-slate prose-headings:font-sans prose-headings:font-black prose-h2:text-3xl prose-h3:text-2xl prose-h3:mt-8 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm">
          {seoSections.map((section, idx) => (
            <div key={idx} className="mb-10 last:mb-0">
              {idx === 0 ? (
                <h2>{section.title}</h2>
              ) : (
                <h3>{section.title}</h3>
              )}
              {/* Note: since content has markdown-like bold strings, we could parse it, but for simplicity we will render it as dangerouslySetInnerHTML or carefully split. I'll split simplistic ** into <strong> */}
              <p dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          ))}
        </div>
      </section>

      {/* SEO Optimized FAQ */}
      <section className="px-4 pt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500 font-medium">Clear answers for your invoicing concerns.</p>
        </div>
        <div className="max-w-3xl mx-auto border-t border-slate-200 divide-y divide-slate-200">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-2">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between py-6 text-left"
              >
                <span className="text-lg font-bold text-slate-900 pr-8">{faq.question}</span>
                <ChevronDown className={`text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-600 leading-relaxed font-medium pb-6 pt-2">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

