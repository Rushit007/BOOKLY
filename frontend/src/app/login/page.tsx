'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<'reader' | 'admin'>(
    redirectPath.startsWith('/admin') ? 'admin' : 'reader'
  );
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'admin_clearance_required'
      ? '🔒 Admin Clearance Required: Sign in with store owner credentials to access the administrative dashboard.'
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (activeTab === 'admin') {
        const cleanEmail = identifier.trim().toLowerCase();
        await login({ email: cleanEmail, password });
        
        // Check if authenticated user is ADMIN
        const savedUserStr = localStorage.getItem('bookly_user');
        const loggedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
        if (loggedUser && loggedUser.role !== 'ADMIN') {
          setError('Access Denied: This account does not possess administrator clearance.');
          setIsLoading(false);
          return;
        }

        router.push(redirectPath !== '/' ? redirectPath : '/admin');
        return;
      }

      // Reader Login (supports email or 10-digit phone)
      const cleanEmail = identifier.includes('@')
        ? identifier.trim().toLowerCase()
        : `${identifier.replace(/\D/g, '')}@phone.bookly.in`;

      await login({ email: cleanEmail, password });
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f4ede2] dark:bg-[#09090b] relative overflow-hidden font-sans">
      {/* Background Vintage Wooden Desk Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#d3c5b4_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Main Skeuomorphic Notebook Container */}
      <div className="w-full max-w-3xl relative">
        
        {/* Spiral Binder Loops on Top / Left */}
        <div className="hidden sm:flex absolute -left-5 top-12 bottom-12 flex-col justify-between z-30 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-8 h-4 rounded-full bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-800 shadow-md border border-zinc-600 transform -rotate-12" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900/60 shadow-inner -ml-1" />
            </div>
          ))}
        </div>

        {/* Notebook Top Sticky Tabs (Reader vs Admin) */}
        <div className="flex items-end gap-2 pl-8 sm:pl-12 mb-0 relative z-20">
          <button
            type="button"
            onClick={() => {
              setActiveTab('reader');
              setError(null);
            }}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-t-2 border-x-2 ${
              activeTab === 'reader'
                ? 'bg-[#fffdf9] dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 border-[#d8cdbd] dark:border-zinc-700 shadow-sm translate-y-0.5'
                : 'bg-[#e8ded0] dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 border-transparent hover:bg-[#ede5d8]'
            }`}
          >
            <span>📖</span>
            <span>Reader Account</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setError(null);
            }}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-t-2 border-x-2 ${
              activeTab === 'admin'
                ? 'bg-[#fffdf9] dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 border-[#d8cdbd] dark:border-zinc-700 shadow-sm translate-y-0.5'
                : 'bg-[#e8ded0] dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 border-transparent hover:bg-[#ede5d8]'
            }`}
          >
            <span>🔐</span>
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Notebook Sheet Page */}
        <div
          className="relative rounded-2xl p-8 sm:p-14 shadow-2xl border-2 border-[#d8cdbd] dark:border-zinc-800 bg-[#fffdf9] dark:bg-[#141416] overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, rgba(148, 163, 184, 0.22) 31px, rgba(148, 163, 184, 0.22) 32px)`,
          }}
        >
          {/* Vertical Red Ledger Margin Line */}
          <div className="absolute top-0 bottom-0 left-16 sm:left-24 w-0.5 bg-rose-400/50 pointer-events-none" />

          {/* Top Stamp & Metadata */}
          <div className="pl-12 sm:pl-16 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                <span>ENTRY REF: #BK-{new Date().getFullYear()}</span>
                <span>·</span>
                <span className="text-rose-600 font-bold">CONFIDENTIAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-zinc-900 dark:text-zinc-100 mt-1">
                {activeTab === 'reader' ? 'Reader Library Log-In' : 'Admin Security Verification'}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {activeTab === 'reader'
                  ? 'Access your saved volumes, order tracker, and consensus votes.'
                  : 'Administrative control room for catalog, orders, inventory, and returns.'}
              </p>
            </div>

            {/* Rubber Stamp Badge */}
            <div className="border-2 border-dashed border-zinc-400 dark:border-zinc-600 rounded-lg p-2 text-center rotate-3 self-start sm:self-center opacity-80">
              <p className="font-mono text-[9px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                BOOKLY ARCHIVE
              </p>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                VERIFIED PASS
              </p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="pl-12 sm:pl-16 space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium">
                {error}
              </div>
            )}

            {/* Identifier: Email OR Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                {activeTab === 'reader' ? 'Email Address or 10-Digit Mobile Number' : 'Admin Master Email / User'}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  activeTab === 'reader'
                    ? 'e.g. reader@bookly.com or 9876543210'
                    : 'Enter authorized administrator credentials'
                }
                className="w-full px-4 py-3 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs transition"
              />
              <p className="text-[11px] text-zinc-500 italic">
                {activeTab === 'reader'
                  ? 'Enter your registered email ID or Indian mobile number.'
                  : 'Authorized personnel only. No public registration permitted.'}
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  {showPassword ? 'Hide 👁' : 'Show 👁'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? 'Verifying Credentials...' : activeTab === 'reader' ? 'Sign In to Library ↗' : 'Authenticate & Enter Admin Deck ↗'}
              </button>
            </div>

            {/* Bottom Register Switch */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-600 dark:text-zinc-400">
              New to BOOKLY?{' '}
              <Link
                href="/register"
                className="font-bold text-zinc-900 dark:text-white underline underline-offset-4 hover:text-amber-600"
              >
                Create a Free Notebook Account ↗
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4ede2]">
          <div className="w-8 h-8 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
