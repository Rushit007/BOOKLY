'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { BooklyLogo } from '@/components/common/BooklyLogo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    name: 'Dashboard Overview',
    href: '/admin',
    badge: 'Live',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Books & Catalog',
    href: '/admin/books',
    badge: 'Inventory',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    name: 'Orders & Shipments',
    href: '/admin/orders',
    badge: 'COD / Track',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    name: 'Categories & Taxonomy',
    href: '/admin/categories',
    badge: 'Genres',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    name: 'Patron Directory',
    href: '/admin/users',
    badge: 'Accounts',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.replace('/login?redirect=' + encodeURIComponent(pathname) + '&error=admin_clearance_required');
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] animate-pulse">
            Verifying Cryptographic Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--border-subtle)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-md w-full p-8 bg-[var(--bg-surface)] border-2 border-[var(--border-main)] text-center relative z-10 shadow-[6px_6px_0px_var(--border-main)] rounded-2xl animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-rose-500/10 border-2 border-rose-500 rounded-2xl flex items-center justify-center text-3xl font-black text-rose-500 shadow-sm">
            🔒
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-extrabold text-rose-500 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30">
            RESTRICTED ACCESS • 403
          </span>
          <h2 className="font-serif text-3xl font-black text-[var(--text-main)] mt-4 mb-2 tracking-tight">
            Admin Clearance Required
          </h2>
          <p className="font-sans text-xs text-[var(--text-muted)] mb-6 leading-relaxed">
            This administrative control deck is strictly restricted to the authorized store owner. Unauthorized access attempts are monitored and recorded.
          </p>

          <div className="space-y-3">
            <Link
              href={'/login?redirect=' + encodeURIComponent(pathname)}
              className="block w-full py-3.5 px-4 bg-[var(--text-main)] text-[var(--bg-page)] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all border-2 border-[var(--border-main)] shadow-[3px_3px_0px_var(--border-main)] rounded-xl"
            >
              Sign In with Authorized Credentials →
            </Link>
            <Link
              href="/"
              className="inline-block text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] underline mt-2"
            >
              ← Return to Main Bookstore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex flex-col md:flex-row transition-colors">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[var(--bg-surface)] border-r-2 border-[var(--border-main)] flex flex-col justify-between shrink-0 shadow-sm z-30">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b-2 border-[var(--border-main)] flex items-center justify-between">
            <Link href="/" className="inline-flex items-center group">
              <BooklyLogo size="sm" showText={true} />
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-400 text-black border border-amber-500 shadow-xs">
                BOSS DECK
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* System Live Radar */}
          <div className="mx-4 my-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 leading-tight">
                  LIVE TELEMETRY
                </p>
                <p className="text-[9px] text-[var(--text-faint)] font-mono">Store Engine Active</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              v2.4
            </span>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-faint)] mb-2">
              Navigation Controls
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold transition-all border ${
                    isActive
                      ? 'bg-[var(--text-main)] text-[var(--bg-page)] border-[var(--text-main)] shadow-[3px_3px_0px_var(--border-main)] translate-x-1'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] border-transparent hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-1.5 rounded-lg ${isActive ? 'bg-[var(--bg-page)]/20 text-[var(--bg-page)]' : 'bg-amber-400/15 text-amber-500 group-hover:bg-amber-400/30'}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${isActive ? 'bg-[var(--bg-page)]/20 text-[var(--bg-page)] font-bold' : 'text-[var(--text-faint)] bg-[var(--bg-page)]'}`}>
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout link */}
        <div className="p-4 border-t-2 border-[var(--border-main)] space-y-3 bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] shadow-xs">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-[#FF66B3] text-black font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
              👑
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[var(--text-main)] truncate font-sans">
                  {user.name}
                </p>
              </div>
              <p className="text-[10px] text-amber-500 font-mono font-semibold uppercase tracking-wider">
                Store Owner (Admin)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-main)] transition text-center"
              title="Open customer storefront"
            >
              <span>Store ↗</span>
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider text-rose-500 hover:text-white hover:bg-rose-600 bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
              title="Sign out of Admin Portal"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}
