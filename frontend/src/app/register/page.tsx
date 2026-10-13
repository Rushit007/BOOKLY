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
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [preferredGenre, setPreferredGenre] = useState('Computer Science & Architecture');
  const [readingGoal, setReadingGoal] = useState('12 books per year');
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
      // Store user's profile details locally for instant checkout prefill
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'bookly_reader_profile',
          JSON.stringify({ city, address, preferredGenre, readingGoal, phone })
        );
      }
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f4ede2] dark:bg-[#09090b] relative overflow-hidden font-sans">
      {/* Background Vintage Ledger Desk */}
      <div className="absolute inset-0 bg-[radial-gradient(#d3c5b4_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Main Skeuomorphic Notebook Container */}
      <div className="w-full max-w-4xl relative">
        
        {/* Spiral Binder Rings on Left */}
        <div className="hidden sm:flex absolute -left-5 top-14 bottom-14 flex-col justify-between z-30 pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-8 h-4 rounded-full bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-800 shadow-md border border-zinc-600 transform -rotate-12" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900/60 shadow-inner -ml-1" />
            </div>
          ))}
        </div>

        {/* Notebook Top Header Tab */}
        <div className="flex items-end pl-8 sm:pl-12 mb-0 relative z-20">
          <div className="px-6 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider bg-[#fffdf9] dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 border-t-2 border-x-2 border-[#d8cdbd] dark:border-zinc-700 shadow-sm translate-y-0.5 flex items-center gap-2">
            <span>✍️</span>
            <span>New Reader Application &amp; Archival Ledger</span>
          </div>
        </div>

        {/* Notebook Ruled Paper Sheet */}
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
                <span>MEMBERSHIP FORMULARY NO. {Math.floor(1000 + Math.random() * 9000)}</span>
                <span>·</span>
                <span className="text-emerald-600 font-bold">LIFETIME ACCESS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-zinc-900 dark:text-zinc-100 mt-1">
                Open Your Personal Reading Ledger
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Join our private literary community. Free forever, express Indian courier dispatch, and full catalog access.
              </p>
            </div>

            {/* Embossed Wax Seal Badge */}
            <div className="w-16 h-16 rounded-full border-2 border-amber-500/80 bg-amber-50 dark:bg-amber-950/40 flex flex-col items-center justify-center text-center shadow-md self-start sm:self-center rotate-6 shrink-0">
              <span className="text-amber-600 font-black text-xs">BOOKLY</span>
              <span className="text-[8px] font-mono text-zinc-600 dark:text-zinc-300">GUILD</span>
            </div>
          </div>

          {/* Form with all requested details */}
          <form onSubmit={handleSubmit} className="pl-12 sm:pl-16 space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium">
                {error}
              </div>
            )}

            {/* Row 1: Full Legal Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>
            </div>

            {/* Row 2: Mobile Number & Shipping City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  10-Digit Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 rounded-r-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  City / State
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>
            </div>

            {/* Row 3: Physical Delivery Address */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Primary Shipping / Delivery Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No., Landmark, Area & Postal Pincode"
                className="w-full px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>

            {/* Row 4: Reading Preferences & Goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Favorite Reading Focus
                </label>
                <select
                  value={preferredGenre}
                  onChange={(e) => setPreferredGenre(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
                >
                  <option>Computer Science &amp; Architecture</option>
                  <option>Self-Help &amp; Behavioral Systems</option>
                  <option>Business &amp; Finance</option>
                  <option>Fiction &amp; Literary Classics</option>
                  <option>Science &amp; Astronomy</option>
                  <option>Hindi Literature (हिंदी साहित्य)</option>
                  <option>Gujarati Classics (ગુજરાતી સાહિત્ય)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Annual Reading Target
                </label>
                <select
                  value={readingGoal}
                  onChange={(e) => setReadingGoal(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
                >
                  <option>6 volumes per year (Casual reader)</option>
                  <option>12 volumes per year (1 book every month)</option>
                  <option>24 volumes per year (Fortnightly reader)</option>
                  <option>52+ volumes per year (Voracious bibliophile)</option>
                </select>
              </div>
            </div>

            {/* Row 5: Password & Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Password (Min 6 chars)
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Confirm Password
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? 'Creating Your Account...' : 'Complete Registration & Open Ledger ↗'}
              </button>
            </div>

            {/* Bottom Login Switch */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-600 dark:text-zinc-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-zinc-900 dark:text-white underline underline-offset-4 hover:text-amber-600"
              >
                Sign In to Your Notebook ↗
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4ede2]">
          <div className="w-8 h-8 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
