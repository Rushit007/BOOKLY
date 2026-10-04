'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, demoAdminLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    demoAdminLogin();
    router.push(redirectPath);
  };

  return (
    <div className='min-h-[90vh] flex items-center justify-center px-4 py-12 bg-[#faf9f5] dark:bg-[#0c0c0c]'>
      <div className='w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 border-2 border-black dark:border-white/20 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.15)] bg-white dark:bg-[#141414] overflow-hidden'>
        
        {/* Left Column: Brand & Aesthetic Editorial Panel */}
        <div className='lg:col-span-5 bg-[#ffe17c] p-8 lg:p-10 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black text-black relative overflow-hidden'>
          <div className='absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-black/5 pointer-events-none' />
          
          <div>
            <div className='flex items-center gap-2 mb-6'>
              <div className='w-8 h-8 bg-black flex items-center justify-center border border-black'>
                <span className='text-[#ffe17c] font-black text-sm'>⚡</span>
              </div>
              <span className='font-cabinet font-900 text-lg tracking-tight'>BOOKLY</span>
            </div>

            <div className='inline-block px-2.5 py-1 bg-black text-[#ffe17c] font-editorial-mono text-[9px] font-bold uppercase tracking-[0.2em] mb-4'>
              Member Portal
            </div>

            <h2 className='font-cabinet font-800 text-3xl lg:text-4xl leading-[1.08] tracking-tight mb-4'>
              Welcome Back to Your Library.
            </h2>

            <p className='font-cabinet text-sm text-black/75 leading-relaxed mb-6'>
              Sign in to manage your reading wishlist, tracked orders, book comparisons, and express one-click checkout.
            </p>
          </div>

          <div className='space-y-4 pt-6 border-t border-black/20'>
            <div className='flex items-center gap-3'>
              <span className='w-2 h-2 rounded-full bg-black' />
              <span className='font-editorial-mono text-xs font-semibold'>Curated volumes & author editions</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='w-2 h-2 rounded-full bg-black' />
              <span className='font-editorial-mono text-xs font-semibold'>Saved comparisons & reading wishlist</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='w-2 h-2 rounded-full bg-black' />
              <span className='font-editorial-mono text-xs font-semibold'>Instant UPI & safe checkout</span>
            </div>

            <div className='pt-4'>
              <blockquote className='italic font-editorial-serif text-sm text-black/80 border-l-2 border-black pl-3'>
                &ldquo;A reader lives a thousand lives before he dies.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className='lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-[#141414]'>
          <div className='mb-6'>
            <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-1'>
              Account Authorization
            </p>
            <h1 className='font-cabinet font-800 text-3xl text-neutral-900 dark:text-neutral-100'>
              Sign In
            </h1>
          </div>

          {error && (
            <div className='mb-6 p-3.5 border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 text-xs font-editorial-mono flex items-start gap-2.5'>
              <span className='font-black text-rose-600'>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1.5'>
                Email Address
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='name@example.com'
                className='w-full px-4 py-3 font-editorial-mono text-sm bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white/20 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:bg-[#ffe17c]/10 focus:border-black dark:focus:border-[#ffe17c] transition-colors'
              />
            </div>

            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300'>
                  Password
                </label>
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-[10px] font-editorial-mono text-neutral-500 hover:text-black dark:hover:text-white uppercase tracking-wider underline cursor-pointer'
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••••••'
                className='w-full px-4 py-3 font-editorial-mono text-sm bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white/20 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:bg-[#ffe17c]/10 focus:border-black dark:focus:border-[#ffe17c] transition-colors'
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-3.5 px-6 font-cabinet font-800 text-xs uppercase tracking-widest text-black bg-[#ffe17c] hover:bg-[#fed053] border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2'
            >
              {isLoading ? (
                <>
                  <span className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin' />
                  <span>Authorizing...</span>
                </>
              ) : (
                <span>Sign In to BOOKLY ↗</span>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className='mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800'>
            <div className='flex items-center justify-between gap-3'>
              <div className='text-left'>
                <p className='font-cabinet font-bold text-xs text-neutral-900 dark:text-neutral-100'>
                  Testing or Evaluating?
                </p>
                <p className='font-editorial-mono text-[10px] text-neutral-500'>
                  One-click demo administrator session
                </p>
              </div>
              <button
                type='button'
                onClick={handleDemoSignIn}
                className='px-3 py-1.5 border border-black dark:border-white/30 text-xs font-editorial-mono font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 transition-colors'
              >
                1-Click Demo
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className='mt-6 text-center text-xs font-cabinet'>
            <span className='text-neutral-500 dark:text-neutral-400'>
              First time on BOOKLY?{' '}
            </span>
            <Link
              href={`/register${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
              className='font-bold text-neutral-900 dark:text-[#ffe17c] underline underline-offset-4 hover:text-[#fed053]'
            >
              Create a free reader account →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className='min-h-[80vh] flex items-center justify-center font-editorial-mono text-xs'>Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
