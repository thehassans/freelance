import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
    }
  };

  return (
    <section className="mt-20 md:mt-32" id="contact">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row text-start">
        <div className="flex-1 p-8 md:p-16 bg-slate-900 text-white flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
            Get in Touch
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 tracking-tight">Let's talk about your business.</h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Have a question about FreelancerKit or want to suggest a new tool? We'd love to hear from you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Us</p>
                <p className="text-lg font-semibold">support@freelancerkit.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Chat</p>
                <p className="text-lg font-semibold">Available Mon-Fri, 9am-5pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-16 relative">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                <p className="text-slate-500 mb-8">
                  Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      required
                      type="email" 
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                    />
                  </div>
                  <div className="relative group">
                    <textarea 
                      required
                      placeholder="How can we help?"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all resize-none" 
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <p className="text-danger text-sm font-bold">{errorMessage}</p>
                )}

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  <Send size={18} /> {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
