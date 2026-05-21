import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Fingerprint } from 'lucide-react';
import { storage } from '../../lib/adminStorage';

export default function AdminPINScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    const attempts = storage.get('fk_admin_attempts') || { count: 0, lockoutUntil: 0 };
    if (attempts.lockoutUntil > Date.now()) {
      setLockoutTimer(Math.ceil((attempts.lockoutUntil - Date.now()) / 1000));
    }
  }, []);

  useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setInterval(() => setLockoutTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTimer]);

  const handlePinProcess = (inputPin: string) => {
    if (lockoutTimer > 0) return;

    const attempts = storage.get('fk_admin_attempts') || { count: 0, lockoutUntil: 0 };
    const savedPin = storage.get('fk_admin_pin') || '2611';

    if (String(inputPin) === String(savedPin)) {
      storage.set('fk_admin_attempts', { count: 0, lockoutUntil: 0 });
      sessionStorage.setItem('fk_admin_session', 'true');
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      
      const newCount = attempts.count + 1;
      if (newCount >= 5) {
        const lockoutUntil = Date.now() + 30 * 60 * 1000; // 30 mins
        storage.set('fk_admin_attempts', { count: newCount, lockoutUntil });
        setLockoutTimer(30 * 60);
      } else {
        storage.set('fk_admin_attempts', { count: newCount, lockoutUntil: 0 });
      }
      setPin('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handlePinProcess(pin);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B0C14]/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={error ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, scale: 1 }}
        transition={{ duration: error ? 0.4 : 0.2 }}
        className="bg-[#13192B] border border-[#252E4A] p-8 rounded-2xl w-full max-w-sm flex flex-col items-center text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-[#1C2340] rounded-full flex items-center justify-center mb-6">
          <Fingerprint size={32} className="text-[#6EE7B7]" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#E8EAF0] mb-2 font-display">Admin Access</h2>
        
        {lockoutTimer > 0 ? (
          <div className="text-[#F87171] mt-4 flex justify-center items-center gap-2">
             <ShieldAlert size={18} />
             <span>Locked out. Try again in {Math.floor(lockoutTimer / 60)}:{(lockoutTimer % 60).toString().padStart(2, '0')}.</span>
          </div>
        ) : (
          <>
            <p className="text-[#6B7280] text-sm mb-8">Enter your 4-digit PIN to continue.</p>
            
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoFocus
              placeholder="Enter PIN"
              value={pin}
              style={{
                textAlign: 'center',
                fontSize: '24px',
                letterSpacing: '8px',
                width: '160px',
                padding: '12px',
                background: '#0F1623',
                border: '1px solid #252E4A',
                borderRadius: '8px',
                color: '#E8EAF0',
                outline: 'none',
                marginBottom: '24px'
              }}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setPin(val);
                if (val.length === 4) handlePinProcess(val);
              }}
              onKeyDown={handleKeyDown}
            />

            {error ? (
              <p className="text-[#F87171] text-sm h-5 animate-pulse">Incorrect PIN</p>
            ) : (
              <p className="text-[#6B7280] text-sm h-5"></p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
