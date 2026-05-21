import React, { useState } from 'react';
import { Mail, Twitter, MessageSquare, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Context & Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
                Get in <span className="text-primary">touch</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Need help with your account, have a feature request, or found a bug? 
                Whether you're a freelancer or an agency, we're here to support your growth.
              </p>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 w-fit">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="text-sm font-bold text-green-700">Usually replies within 24 hours</span>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Support</p>
                  <a href="mailto:support@freelancerkit.io" className="text-slate-900 font-bold hover:text-primary transition-colors">
                    support@freelancerkit.io
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                  <Twitter size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Follow on X</p>
                  <a href="https://twitter.com/freelancerkit" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold hover:text-primary transition-colors">
                    @freelancerkit
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Community</p>
                  <span className="text-slate-900 font-bold">Join the Discord</span>
                </div>
              </div>
            </div>

            {/* Quick deflector/FAQ tease */}
            <div className="pt-8 border-t border-slate-200">
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Common Questions</h4>
               <ul className="space-y-3">
                 {['How do I cancel my Pro subscription?', 'Is my data encrypted?', 'Can I request a custom tool?'].map((q) => (
                   <li key={q} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary cursor-pointer transition-colors group">
                     <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> {q}
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium appearance-none cursor-pointer"
                      >
                        <option>General Inquiry</option>
                        <option>Billing Support</option>
                        <option>Bug Report</option>
                        <option>Feature Request</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Tell us what's on your mind..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none"
                      />
                    </div>

                    <button 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Message Sent!</h2>
                  <p className="text-slate-500 font-medium">
                    Thank you for reaching out. Our team has received your message and will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:underline pt-4"
                  >
                    Send another message <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Background decorative elements */}
            <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute -z-10 -top-12 -right-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-50" />
          </div>

        </div>
      </div>
    </div>
  );
}
