'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
      });
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[90vh] flex items-center justify-center px-4 py-12 bg-[#faf9f5] dark:bg-[#0c0c0c]'>
      <div className='w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 border-2 border-black dark:border-white/20 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.15)] bg-white dark:bg-[#141414] overflow-hidden'>
        
        {/* Left Column: Brand & Membership Benefits */}
        <div className='lg:col-span-5 bg-[#0c0c0c] text-white p-8 lg:p-10 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black relative overflow-hidden'>
          <div className='absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none' />

          <div>
            <div className='flex items-center gap-2 mb-6'>
              <div className='w-8 h-8 bg-[#ffe17c] flex items-center justify-center border border-black'>
                <span className='text-black font-black text-sm'>⚡</span>
              </div>
              <span className='font-cabinet font-900 text-lg tracking-tight text-white'>BOOKLY</span>
            </div>

            <div className='inline-block px-2.5 py-1 bg-[#ffe17c] text-black font-editorial-mono text-[9px] font-bold uppercase tracking-[0.2em] mb-4'>
              New Reader Pass
            </div>

            <h2 className='font-cabinet font-800 text-3xl lg:text-4xl leading-[1.08] tracking-tight mb-4'>
              Begin Your Reading Journey.
            </h2>

            <p className='font-cabinet text-sm text-neutral-400 leading-relaxed mb-6'>
              Create your complimentary reader account to access unedited editions, reader discussion rooms, personalized book matches, and instant one-click checkout.
            </p>
          </div>

          <div className='space-y-3.5 pt-6 border-t border-neutral-800 text-neutral-300'>
            <div className='flex items-center gap-3'>
              <span className='w-2 h-2 rounded-full bg-[#ffe17c]' />
              <span className='font-editorial-mono text-xs'>Free membership with lifetime benefits</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='w-2 h-2 rounded-full bg-[#ffe17c]' />
              <span className='font-editorial-mono text-xs'>Exclusive access to limited print volumes</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='w-2 h-2 rounded-full bg-[#ffe17c]' />
              <span className='font-editorial-mono text-xs'>Fast UPI (GPay, PhonePe, Paytm) checkout</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='w-2 h-2 rounded-full bg-[#ffe17c]' />
              <span className='font-editorial-mono text-xs'>Live package tracking & express delivery</span>
            </div>

            <div className='pt-4'>
              <div className='p-3 bg-neutral-900 border border-neutral-800 rounded'>
                <p className='font-editorial-mono text-[10px] text-neutral-400 uppercase tracking-widest'>
                  CapStone 2026 Project
                </p>
                <p className='font-cabinet font-bold text-xs text-white mt-0.5'>
                  Gondaliya Rushit R. (240841102020)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className='lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-[#141414]'>
          <div className='mb-6'>
            <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-1'>
              Registration Form
            </p>
            <h1 className='font-cabinet font-800 text-3xl text-neutral-900 dark:text-neutral-100'>
              Create Account
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
                Full Name *
              </label>
              <input
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Rushit Gondaliya'
                className='w-full px-4 py-2.5 font-editorial-mono text-sm bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white/20 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:bg-[#ffe17c]/10 focus:border-black dark:focus:border-[#ffe17c] transition-colors'
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1.5'>
                  Email Address *
                </label>
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='name@example.com'
                  className='w-full px-4 py-2.5 font-editorial-mono text-sm bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white/20 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:bg-[#ffe17c]/10 focus:border-black dark:focus:border-[#ffe17c] transition-colors'
                />
              </div>

              <div>
                <label className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1.5'>
                  Phone (For UPI & Delivery)
                </label>
                <input
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='9876543210'
                  className='w-full px-4 py-2.5 font-editorial-mono text-sm bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white/20 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:bg-[#ffe17c]/10 focus:border-black dark:focus:border-[#ffe17c] transition-colors'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <label className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300'>
                    Password *
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
                  placeholder='Min. 6 chars'
                  className='w-full px-4 py-2.5 font-editorial-mono text-sm bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white/20 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:bg-[#ffe17c]/10 focus:border-black dark:focus:border-[#ffe17c] transition-colors'
                />
              </div>

              <div>
                <label className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1.5'>
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Re-type password'
                  className='w-full px-4 py-2.5 font-editorial-mono text-sm bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white/20 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:bg-[#ffe17c]/10 focus:border-black dark:focus:border-[#ffe17c] transition-colors'
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-3.5 px-6 font-cabinet font-800 text-xs uppercase tracking-widest text-black bg-[#ffe17c] hover:bg-[#fed053] border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4'
            >
              {isLoading ? (
                <>
                  <span className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin' />
                  <span>Creating Your Account...</span>
                </>
              ) : (
                <span>Register Member Account ↗</span>
              )}
            </button>
          </form>

          {/* Already have an account */}
          <div className='mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs font-cabinet'>
            <span className='text-neutral-500 dark:text-neutral-400'>
              Already have an account?{' '}
            </span>
            <Link
              href={`/login${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
              className='font-bold text-neutral-900 dark:text-[#ffe17c] underline underline-offset-4 hover:text-[#fed053]'
            >
              Sign In here →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className='min-h-[80vh] flex items-center justify-center font-editorial-mono text-xs'>Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
