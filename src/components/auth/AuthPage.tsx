import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ArrowRight, Mail, Lock, User, Briefcase, ChevronLeft } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface AuthPageProps {
  onBack: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthPage({ onBack, initialMode = 'login' }: AuthPageProps) {
  const { login } = useUser();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    // Simulate login
    setTimeout(() => {
      login();
      onBack();
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    console.log(`Authenticating with ${provider}...`);
    setTimeout(() => {
      login();
      onBack();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-8 left-4 sm:left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
      >
        <ChevronLeft size={18} />
        Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-slate-100"
      >
        {/* Header/Branding */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Briefcase size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Freelancer<span className="text-primary">Kit</span>
          </h2>
          <p className="text-slate-500 text-sm">
            {mode === 'login' ? 'Welcome back! Please enter your details.' : 'Start your professional journey today.'}
          </p>
        </div>

        <div className="space-y-6">
          {/* OAuth Section */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialAuth('GitHub')}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 transition-all h-12 disabled:opacity-50"
            >
              <Github size={20} />
              Continue with GitHub
            </button>
            <button
              onClick={() => handleSocialAuth('Google')}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 transition-all h-12 disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-slate-400 uppercase tracking-widest font-black text-[10px]">Or continue with</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group"
                >
                  <label className="sr-only">Full Name</label>
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required={mode === 'signup'}
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full ps-11 pe-4 h-12 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <label className="sr-only">Email address</label>
              <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full ps-11 pe-4 h-12 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="relative group">
              <label className="sr-only">Password</label>
              <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full ps-11 pe-4 h-12 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold text-red-500 mt-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary text-white rounded-xl text-sm font-black hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 transition-all h-12 shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="text-sm font-bold text-slate-500 hover:text-primary transition-colors"
            >
              {mode === 'login' ? (
                <>Don't have an account? <span className="text-primary hover:underline">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-primary hover:underline">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex gap-8 items-center justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secure AES-256</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SOC2 Compliant</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ISO 27001</span>
      </motion.div>
    </div>
  );
}
