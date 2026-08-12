import React, { useState, useEffect } from 'react';
import { storage } from '../../lib/adminStorage';
import { AuthPage } from '../ui/auth-page';

export default function AdminPINScreen({ onSuccess }: { onSuccess: () => void }) {
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

  const handleLogin = (email: string, pass: string) => {
    if (lockoutTimer > 0) return;

    const attempts = storage.get('fk_admin_attempts') || { count: 0, lockoutUntil: 0 };
    const savedPin = storage.get('fk_admin_pin') || '2611';

    // Verify email and password
    // We accept any admin email for now, but verify the PIN as password
    // For a real setup we'd verify both against a saved configuration
    if (email && String(pass) === String(savedPin)) {
      storage.set('fk_admin_attempts', { count: 0, lockoutUntil: 0 });
      sessionStorage.setItem('fk_admin_session', 'true');
      
      // Send login notification asynchronously
      import('../../lib/email').then(({ sendAdminEmail }) => {
        sendAdminEmail(
          email, 
          'Admin Login Alert - FreelancerKit', 
          `A successful login to the FreelancerKit Admin Panel occurred at ${new Date().toISOString()}.\n\nIf this was not you, please secure your account immediately.`
        ).catch(console.error);
      });

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
    }
  };

  if (lockoutTimer > 0) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center p-4">
        <div className="text-[#F87171] flex flex-col items-center gap-4">
          <span className="text-2xl font-bold">Locked out</span>
          <span>Try again in {Math.floor(lockoutTimer / 60)}:{(lockoutTimer % 60).toString().padStart(2, '0')}.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-50 overflow-y-auto">
      <AuthPage onSubmit={handleLogin} error={error} />
    </div>
  );
}