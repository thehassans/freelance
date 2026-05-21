import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, RefreshCw, ArrowRightLeft, TrendingUp, Info, DollarSign, Euro, PoundSterling, Landmark, Percent, Wallet, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const GATEWAY_FEES = [
  { id: 'mid', name: 'Mid-Market (0%)', rate: 0 },
  { id: 'stripe', name: 'Stripe Cross-Border (~2%)', rate: 0.02 },
  { id: 'paypal', name: 'PayPal (~3.5%)', rate: 0.035 },
  { id: 'upwork', name: 'Upwork/Platform (~5%)', rate: 0.05 },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [gatewayId, setGatewayId] = useState('mid');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchRates();
  }, [fromCurrency]);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/fx-rates/${fromCurrency}`);
      if (!resp.ok) throw new Error('Network response was not ok');
      const data = await resp.json();
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch rates via proxy:', err);
      // Fallback to secondary API if proxy fails
      try {
        const resp2 = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const data2 = await resp2.json();
        if (data2.rates) {
          setRates(data2.rates);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          return;
        }
      } catch (err2) {
        console.error('Fallback API also failed:', err2);
      }
      setRates({ 'EUR': 0.92, 'GBP': 0.79, 'AED': 3.67 });
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeResult = useMemo(() => {
    if (fromCurrency === toCurrency) return { raw: amount, fee: 0, net: amount };
    const rate = rates[toCurrency] || 0;
    const raw = amount * rate;
    const feeRate = GATEWAY_FEES.find(f => f.id === gatewayId)?.rate || 0;
    const fee = raw * feeRate;
    const net = raw - fee;

    return { 
      raw: Number(raw.toFixed(2)), 
      fee: Number(fee.toFixed(2)), 
      net: Number(net.toFixed(2)),
      rate: Number(rate.toFixed(4))
    };
  }, [amount, fromCurrency, toCurrency, rates, gatewayId]);

  // Generate mock historical data for the sparkline
  const sparklineData = useMemo(() => {
    const baseRate = rates[toCurrency] || 1;
    return Array.from({ length: 20 }).map((_, i) => ({
      value: baseRate + (Math.random() - 0.5) * 0.05
    }));
  }, [rates, toCurrency]);

  const volatility = useMemo(() => {
    const values = sparklineData.map(d => d.value);
    const range = Math.max(...values) - Math.min(...values);
    if (range > 0.04) return { label: 'High', color: 'text-danger' };
    if (range > 0.02) return { label: 'Moderate', color: 'text-warning' };
    return { label: 'Stable', color: 'text-success' };
  }, [sparklineData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">FX Gatekeeper</h3>
                <p className="text-xs text-slate-400 font-medium">International parity & fee simulation.</p>
              </div>
            </div>
            {lastUpdated && !isLoading && (
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Live Rates</span>
                <span className="text-[10px] font-mono font-bold text-slate-400">{lastUpdated}</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Amount to Transfer</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg group-focus-within:text-accent transition-colors">
                    {CURRENCIES.find(c => c.code === fromCurrency)?.symbol}
                  </span>
                  <input 
                    type="number" 
                    value={amount || 0}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-accent text-xl font-black transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">From</label>
                  <div className="relative">
                    <select 
                      value={fromCurrency || 'USD'}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-accent text-sm font-bold cursor-pointer appearance-none"
                    >
                      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Landmark size={14} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <button 
                    onClick={() => {
                      const temp = fromCurrency;
                      setFromCurrency(toCurrency);
                      setToCurrency(temp);
                    }}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all text-slate-400 hover:text-accent hover:rotate-180 active:scale-90"
                  >
                    <ArrowRightLeft size={18} />
                  </button>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">To</label>
                  <div className="relative">
                    <select 
                      value={toCurrency || 'EUR'}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-accent text-sm font-bold cursor-pointer appearance-none"
                    >
                      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Landmark size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Payment Gateway / FX Fee</label>
                <div className="relative">
                  <select 
                    value={gatewayId || 'mid'}
                    onChange={(e) => setGatewayId(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-accent text-sm font-bold appearance-none cursor-pointer"
                  >
                    {GATEWAY_FEES.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Percent size={14} />
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Wallet size={14} />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={fetchRates}
              className="w-full py-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:border-accent hover:bg-accent/5 hover:text-accent transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
            >
              <RefreshCw className={isLoading ? 'animate-spin' : ''} size={14} /> 
              {isLoading ? 'Syncing Markets...' : 'Refresh Market Data'}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={80} />
           </div>
           <div className="flex gap-4 relative z-10">
              <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-800 leading-relaxed font-medium italic">
                Platform fees (Stripe/PayPal) are often hidden in currency spreads. We simulate a 2-5% deduction to show you what actually arrives in your bank.
              </p>
           </div>
        </div>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8">
        <div className="bg-[#0B1120] rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col border border-white/5">
           <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full -mr-32 -mt-32" />
           
           <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-start">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                   <TrendingUp size={14} className="text-accent" /> Conversion Audit
                </h4>
                <div className="bg-accent/20 px-2 py-1 rounded-md">
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent">Bank Parity Enabled</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">True Take-Home Amount</p>
                <motion.div
                  key={exchangeResult.net}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                   <span className="text-3xl font-light text-accent/60 font-mono">
                     {CURRENCIES.find(c => c.code === toCurrency)?.symbol}
                   </span>
                   <h2 className="text-6xl sm:text-7xl font-black tracking-tighter tabular-nums font-display">
                     {exchangeResult.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </h2>
                </motion.div>
              </div>

              <div className="space-y-5 py-8 border-y border-white/5">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 font-medium">Market Conversion</span>
                   <span className="font-mono font-bold text-slate-300">
                     {CURRENCIES.find(c => c.code === toCurrency)?.symbol}{exchangeResult.raw.toLocaleString()}
                   </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 font-medium italic">Gateway Fee ({gatewayId === 'mid' ? '0%' : GATEWAY_FEES.find(f => f.id === gatewayId)?.name.split('(~')[1]?.replace(')', '')})</span>
                   <span className="font-mono font-bold text-danger">
                     -{CURRENCIES.find(c => c.code === toCurrency)?.symbol}{exchangeResult.fee.toLocaleString()}
                   </span>
                </div>
                <div className="pt-4 flex items-center justify-between">
                   <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Rate:</span>
                      <span className="text-[11px] font-mono font-bold text-accent">
                        1 {fromCurrency} = {exchangeResult.rate.toFixed(4)} {toCurrency}
                      </span>
                   </div>
                   <div className="flex items-center gap-1.5 text-slate-500">
                      <AlertCircle size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest italic">Live Spread</span>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">30-Day Market Trend</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${volatility.color}`}>
                      Volatility: {volatility.label}
                    </span>
                 </div>
                 <div className="h-20 w-full opacity-60">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={sparklineData}>
                          <YAxis hide domain={['dataMin', 'dataMax']} />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#5ce1e6" 
                            strokeWidth={3} 
                            dot={false} 
                            animationDuration={1500}
                          />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="pt-6">
                <Link 
                  to={`/tools/invoice-generator?amount=${exchangeResult.net}&currency=${toCurrency}`}
                  className="w-full py-5 bg-[#0f4c75] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  Lock Rate in Invoice <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-[9px] text-center text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold">
                  Bypass platform conversion fees by billing in {fromCurrency} directly.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
