'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[var(--bg-page)]'>
      <div className='w-full max-w-md'>
        {/* Header panel */}
        <div className='border-2 border-[var(--border-main)] border-b-0 bg-[var(--bg-surface-elevated)] px-8 py-6'>
          <div className='flex items-center gap-3 mb-1'>
            <span className='inline-block w-3 h-3 bg-[var(--bg-accent-yellow)] border-2 border-[var(--border-main)]' />
            <p className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)]'>
              MEMBER ACCESS
            </p>
          </div>
          <h1 className='font-editorial-serif text-3xl text-[var(--text-main)]'>
            Sign In
          </h1>
        </div>

        {/* Form panel */}
        <div className='border-2 border-[var(--border-main)] bg-[var(--bg-surface)] px-8 py-8 space-y-6'>
          {error && (
            <div className='border border-[var(--bg-accent-pink)] bg-[var(--bg-accent-pink)]/10 p-3 font-editorial-mono text-[10px] text-[var(--bg-accent-pink)]'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)] block mb-1.5'>
                Email Address
              </label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='name@example.com'
                className='w-full px-3 py-2.5 font-editorial-mono text-sm bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-main)]'
              />
            </div>

            <div>
              <label className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)] block mb-1.5'>
                Password
              </label>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='w-full px-3 py-2.5 font-editorial-mono text-sm bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-main)]'
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full neo-btn-primary py-3.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2'
            >
              {isLoading ? 'Signing In...' : 'Sign In to Account →'}
            </button>
          </form>

          <div className='pt-4 border-t border-[var(--border-subtle)] text-center'>
            <span className='font-editorial-mono text-[9px] uppercase tracking-wider text-[var(--text-faint)]'>
              No account yet?{' '}
            </span>
            <Link
              href='/register'
              className='font-editorial-mono text-[9px] uppercase tracking-wider font-bold text-[var(--text-main)] hover:text-[var(--bg-accent-blue)] transition-colors border-b border-[var(--border-subtle)] hover:border-[var(--bg-accent-blue)]'
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
