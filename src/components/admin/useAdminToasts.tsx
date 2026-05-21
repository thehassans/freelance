import React, { useState } from 'react';

export function useAdminToasts() {
  const [toasts, setToasts] = useState<any[]>([]);

  const showToast = (message: string, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const ToastContainer = () => (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 99999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? '#0F2A1E' : t.type === 'error' ? '#2A0F0F' : '#1C2340',
          border: `1px solid ${t.type === 'success' ? '#6EE7B7' : t.type === 'error' ? '#F87171' : '#252E4A'}`,
          color: t.type === 'success' ? '#6EE7B7' : t.type === 'error' ? '#F87171' : '#E8EAF0',
          padding: '12px 16px', borderRadius: 8, fontSize: 14, maxWidth: 320,
          animation: 'slideIn 0.2s ease', // requires some css, we'll inline it or just not care if anim fails
        }}>
          {t.type === 'success' ? '✓ ' : t.type === 'error' ? '✕ ' : 'ℹ '}
          {t.message}
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}
