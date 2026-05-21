import React from 'react';
import { motion } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import { 
  Crown, 
  Zap, 
  CreditCard, 
  Download, 
  History, 
  ShieldCheck,
  ExternalLink,
  Smartphone,
  Calendar
} from 'lucide-react';
import CreditUsageBar from '../components/common/CreditUsageBar';

export default function BillingPage() {
  const { isPro, showProModal } = useUser();

  // Mock Currency preference - could be from context/settings
  const currency: string = 'USD'; // 'SAR' or 'USD'
  
  const formatCurrency = (amount: number) => {
    if (currency === 'SAR') {
      return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount * 3.75);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const invoices = [
    { id: 'INV-1092', date: 'May 01, 2026', amount: 89.00, status: 'Paid' },
    { id: 'INV-1021', date: 'Apr 01, 2026', amount: 89.00, status: 'Paid' },
    { id: 'INV-0988', date: 'Mar 01, 2026', amount: 89.00, status: 'Paid' },
  ];

  const handlePortalRedirect = () => {
    toast.info('Redirecting to secure Stripe Customer Portal...', {
      description: 'You will be able to manage your subscription and payment methods.',
      duration: 3000,
    });
  };

  const handleDownloadInvoice = (id: string) => {
    toast.success(`Downloading Invoice ${id}.pdf...`, {
      description: 'Your document is being generated and will download shortly.',
      icon: <Download size={16} />,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Billing & Subscription</h1>
        <p className="text-slate-500 font-medium italic">Manage your plan, payments, and invoice history.</p>
      </div>

      <div className="space-y-8">
        {/* Current Plan */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
          {isPro && (
             <div className="absolute top-0 right-0 p-8">
                <div className="bg-indigo-50 text-[#0f4c75] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                   <Crown size={12} className="fill-[#0f4c75]" /> Pro Active
                </div>
             </div>
          )}
          
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0f4c75]">
              {isPro ? <Crown size={20} /> : <Zap size={20} />}
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {isPro ? 'Your Plan' : 'Free Tier'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Current Tier</span>
                <h3 className="text-5xl font-black text-slate-900 tracking-tight">{isPro ? 'Agency Pro' : 'Free Starter'}</h3>
                {isPro && <p className="text-2xl font-black text-[#0f4c75] mt-2">{formatCurrency(89.00)}<span className="text-xs text-slate-400 font-bold uppercase tracking-widest"> / year</span></p>}
              </div>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                {isPro 
                  ? 'Professional tier with unlimited AI generations, white-labeled PDFs, and priority support.'
                  : 'You are using the free version. Upgrade to unlock high-ticket tools and unlimited generations.'}
              </p>
              
              {!isPro && <CreditUsageBar />}

              {isPro ? (
                <button 
                  onClick={handlePortalRedirect}
                  className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  Manage Subscription <ExternalLink size={16} />
                </button>
              ) : (
                <button 
                  onClick={() => showProModal('Premium Workspace')}
                  className="flex items-center gap-2 px-8 py-4 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#0b395a] transition-all shadow-xl shadow-[#0f4c75]/20 active:scale-95"
                >
                  <Crown size={16} /> Upgrade to Pro
                </button>
              )}
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={18} className="text-emerald-500" />
                     <span className="text-xs font-bold text-slate-700">Unlimited AI Generations</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={18} className="text-emerald-500" />
                     <span className="text-xs font-bold text-slate-700">White-label PDF Export</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={18} className="text-emerald-500" />
                     <span className="text-xs font-bold text-slate-700">Premium Contract Templates</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={18} className="text-emerald-500" />
                     <span className="text-xs font-bold text-slate-700">Multi-currency Support</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Payment Method - Only shown for PRO */}
        {isPro && (
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0f4c75]">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Payment Method</h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard size={120} />
              </div>
              <div className="relative z-10 w-full md:w-auto">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Linked Card</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                    <span className="font-black italic text-[10px]">VISA</span>
                  </div>
                  <span className="text-xl font-mono tracking-widest text-slate-300">•••• •••• •••• 4242</span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Expires 12/28</p>
                  <div className="h-4 w-px bg-slate-800" />
                  <div className="flex items-center gap-3 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                    <div className="flex items-center gap-1">
                      <Smartphone size={10} className="text-white" />
                      <span className="text-[8px] font-black uppercase">Pay</span>
                    </div>
                    <div className="px-1.5 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-black uppercase">
                      Tabby
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handlePortalRedirect}
                className="relative z-10 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95"
              >
                Update Method
              </button>
            </div>
          </section>
        )}

        {/* Billing History */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 min-h-[400px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0f4c75]">
              <History size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Billing History</h2>
          </div>

          {!isPro || invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">No Invoices Found</h3>
              <p className="text-sm text-slate-500 font-medium max-w-xs">
                {isPro ? 'Your billing history is currently empty.' : 'Upgrade to Pro to see your billing history and download official invoices.'}
              </p>
              {!isPro && (
                <button 
                  onClick={() => showProModal('Billing Access')}
                  className="mt-6 text-xs font-black text-[#0f4c75] uppercase tracking-widest hover:underline"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="text-start pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice</th>
                    <th className="text-start pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="text-start pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                    <th className="text-start pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="text-end pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="group">
                      <td className="py-6 text-xs font-black text-slate-900">{invoice.id}</td>
                      <td className="py-6 text-xs font-medium text-slate-500">{invoice.date}</td>
                      <td className="py-6 text-xs font-black text-slate-900">{formatCurrency(invoice.amount)}</td>
                      <td className="py-6">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-tighter">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-6 text-end">
                        <button 
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="p-2 text-slate-400 hover:text-[#0f4c75] hover:bg-slate-50 rounded-lg transition-all"
                        >
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      
      <div className="pb-24"></div>
    </motion.div>
  );
}

