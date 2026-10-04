'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ── Individual Toast Item ──────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const duration = toast.duration ?? 4500;
    const leaveTimer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 400);
    }, duration);
    return () => clearTimeout(leaveTimer);
  }, [toast.id, toast.duration, onRemove]);

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const accentColors: Record<ToastType, string> = {
    success: 'var(--bg-accent-mint)',
    error: 'var(--bg-accent-pink)',
    info: 'var(--bg-accent-blue)',
    warning: 'var(--bg-accent-yellow)',
  };

  const bgColors: Record<ToastType, string> = {
    success: 'rgba(112,201,168,0.12)',
    error: 'rgba(232,61,132,0.12)',
    info: 'rgba(43,89,255,0.12)',
    warning: 'rgba(254,208,83,0.15)',
  };

  const accent = accentColors[toast.type];
  const bg = bgColors[toast.type];

  return (
    <div
      style={{
        transform: visible && !leaving ? 'translateX(0)' : 'translateX(110%)',
        opacity: visible && !leaving ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
        background: `var(--bg-surface)`,
        border: `2px solid ${accent}`,
        boxShadow: `4px 4px 0px ${accent}`,
        borderRadius: 0,
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'auto',
      }}
      className="relative overflow-hidden"
    >
      {/* Accent strip */}
      <div style={{ background: accent, height: '3px', width: '100%' }} />

      <div className="flex items-start gap-3 px-4 py-3">
        {/* Icon */}
        <div
          className="w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5"
          style={{
            background: bg,
            border: `2px solid ${accent}`,
            color: accent,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {icons[toast.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="font-bold text-[11px] uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}
          >
            {toast.title}
          </p>
          {toast.message && (
            <p
              className="text-[11px] mt-0.5 leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
            >
              {toast.message}
            </p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={() => {
            setLeaving(true);
            setTimeout(() => onRemove(toast.id), 400);
          }}
          className="shrink-0 w-5 h-5 flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform"
          style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}
        >
          ×
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: '2px',
          background: accent,
          opacity: 0.4,
          animation: `toast-progress ${(toast.duration ?? 4500) / 1000}s linear forwards`,
        }}
      />
    </div>
  );
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message, duration: 6000 });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          pointerEvents: 'none',
          maxWidth: '380px',
          width: 'calc(100vw - 3rem)',
        }}
      >
        <style>{`
          @keyframes toast-progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
