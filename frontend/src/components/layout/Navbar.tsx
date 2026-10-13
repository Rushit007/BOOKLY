'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '../common/ThemeToggle';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { PillNav } from './PillNav';
import { BooklyLogo } from '../common/BooklyLogo';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareBooks } = useCompare();
  const { user, isAuthenticated, logout } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push('/books?search=' + encodeURIComponent(searchQuery.trim()));
    } else {
      router.push('/books');
    }
  };

  // Nav items for the PillNav component
  const pillNavItems = [
    { label: 'Index', href: '/' },
    { label: 'Catalog', href: '/books' },
    { label: 'Book Match', href: '/book-match' },
    { label: 'Compare', href: '/compare', count: mounted && compareBooks.length > 0 ? compareBooks.length : undefined },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  // Mobile fallback nav links
  const navLinks = [
    { label: 'Index', href: '/' },
    { label: 'Catalog', href: '/books' },
    { label: 'Book Match', href: '/book-match' },
    { label: 'Compare', href: '/compare', count: compareBooks.length },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  // Determine active pill href
  const activePillHref = (() => {
    const match = pillNavItems.find(
      (item) => item.href !== '/' && pathname.startsWith(item.href)
    );
    return match?.href ?? (pathname === '/' ? '/' : undefined);
  })();

  const isIndexPage = pathname === '/';

  const BooklyLogoIcon = (
    <div className={`relative flex items-center justify-center ${isIndexPage ? 'animate-pulse' : ''}`}>
      <span className="text-amber-400 font-black text-sm drop-shadow-[0_0_8px_#f59e0b]">✦</span>
      {isIndexPage && (
        <>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </>
      )}
    </div>
  );

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className='sticky top-0 z-40 w-full border-b border-[var(--border-main)] bg-[var(--bg-surface)]/90 backdrop-blur-md transition-colors' style={{ height: '72px' }}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-[72px] gap-4'>

          {/* ── Custom Archival Logo ── */}
          <Link
            href='/'
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className='flex items-center shrink-0 group'
            data-cursor='interactive'
            title="Bookly - Return to top"
          >
            <BooklyLogo size="sm" showText={true} />
          </Link>

          {/* ── PillNav — Desktop center navigation ── */}
          <div className='hidden md:flex flex-1 items-center justify-center'>
            <PillNav
              logo={BooklyLogoIcon}
              items={pillNavItems}
              activeHref={activePillHref}
              baseColor='#09090b'
              pillColor='#18181b'
              pillTextColor='#FFFFFF'
              hoveredPillTextColor='#c5a059'
              initialLoadAnimation={true}
            />
          </div>

          {/* ── Actions & Utilities ── */}
          <div className='flex items-center gap-2 sm:gap-2.5'>
            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className='hidden lg:flex items-center relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search editions...'
                className='w-40 focus:w-52 px-3.5 py-1.5 text-xs font-array rounded-full border border-[var(--border-main)] bg-[var(--bg-surface-elevated)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[#42BFDD] transition-all shadow-xs'
              />
              <button
                type='submit'
                aria-label='Search'
                className='absolute right-2.5 text-[var(--text-faint)] hover:text-[#084B83] transition-colors'
              >
                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </button>
            </form>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('bookly_intro_completed');
                  window.location.href = '/?replay=true';
                }
              }}
              className='hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-amber-500 hover:border-amber-400 transition cursor-pointer'
              title='Replay Archival Prologue Video Sequence'
            >
              <span>✨ Replay Intro</span>
            </button>

            <ThemeToggle />

            {/* Wishlist */}
            <Link
              href='/wishlist'
              data-cursor='interactive'
              aria-label='Wishlist'
              className='relative w-9 h-9 rounded-full border border-[var(--border-main)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors shadow-xs'
              title='Saved Wishlist'
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
              </svg>
              {mounted && wishlistCount > 0 && (
                <span className='absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#FF66B3] text-white text-[9px] font-pixel font-bold flex items-center justify-center'>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              data-cursor='add'
              aria-label='Open Cart'
              className='relative w-9 h-9 rounded-full border border-[var(--border-main)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors shadow-xs'
              title='Shopping Cart'
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
              </svg>
              {mounted && itemCount > 0 && (
                <span className='absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#FF66B3] text-white text-[9px] font-pixel font-bold flex items-center justify-center'>
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {mounted && isAuthenticated && user ? (
              <div className='relative'>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  data-cursor='interactive'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-main)] bg-[var(--bg-surface)] font-sans text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors'
                >
                  <span className='max-w-[70px] truncate'>{user.name.split(' ')[0]}</span>
                  <span className='text-[10px] text-[var(--text-faint)]'>▼</span>
                </button>

                {isUserMenuOpen && (
                  <div className='absolute right-0 mt-2 w-80 sm:w-96 max-h-[85vh] overflow-y-auto overscroll-contain bg-[var(--bg-surface)] border-2 border-[var(--border-main)] rounded-2xl shadow-2xl p-3.5 z-50 font-sans text-sm animate-scale-in'>
                    {/* User Profile Header Card */}
                    <div className='p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] mb-3'>
                      <div className='flex items-center gap-3.5'>
                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-[#FF66B3] text-black font-black text-xl flex items-center justify-center shadow-md shrink-0'>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='font-bold text-base sm:text-lg text-[var(--text-main)] truncate'>
                            {user.name}
                          </p>
                          <p className='text-xs text-[var(--text-muted)] truncate font-mono mt-0.5'>
                            {user.email}
                          </p>
                          <div className='flex items-center gap-1.5 mt-1.5'>
                            <span className='px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/40 uppercase tracking-wide'>
                              {user.role === 'ADMIN' ? '⚡ System Administrator' : '👑 Verified Archival Patron'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Metrics Bar */}
                      <div className='grid grid-cols-3 gap-2 mt-3.5 pt-3.5 border-t border-[var(--border-subtle)] text-center'>
                        <div className='p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]'>
                          <p className='text-[11px] text-[var(--text-faint)] font-mono uppercase font-semibold'>Wishlist</p>
                          <p className='font-bold text-sm text-[var(--text-main)] mt-0.5'>{wishlistCount}</p>
                        </div>
                        <div className='p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]'>
                          <p className='text-[11px] text-[var(--text-faint)] font-mono uppercase font-semibold'>Compare</p>
                          <p className='font-bold text-sm text-[var(--text-main)] mt-0.5'>{compareBooks.length}</p>
                        </div>
                        <div className='p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]'>
                          <p className='text-[11px] text-[var(--text-faint)] font-mono uppercase font-semibold'>Cart</p>
                          <p className='font-bold text-sm text-[#FF66B3] mt-0.5'>{itemCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className='space-y-1.5'>
                      {user.role === 'ADMIN' && (
                        <Link
                          href='/admin'
                          onClick={() => setIsUserMenuOpen(false)}
                          className='p-3 rounded-xl flex items-center gap-3.5 font-semibold text-blue-600 hover:bg-blue-500/10 transition-colors'
                        >
                          <span className='w-8 h-8 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center text-base font-bold shrink-0'>
                            ⚡
                          </span>
                          <div>
                            <p className='text-sm font-bold text-[var(--text-main)]'>Admin Command Deck</p>
                            <p className='text-xs text-[var(--text-muted)] font-normal mt-0.5'>Manage book inventory, categories & system orders</p>
                          </div>
                        </Link>
                      )}

                      <Link
                        href='/orders'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='p-3 rounded-xl flex items-center gap-3.5 text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors'
                      >
                        <span className='w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-base font-bold shrink-0'>
                          📦
                        </span>
                        <div>
                          <p className='text-sm font-bold text-[var(--text-main)]'>Orders & Invoices</p>
                          <p className='text-xs text-[var(--text-muted)] mt-0.5'>Track dispatch status & download GST receipts</p>
                        </div>
                      </Link>

                      <Link
                        href='/wishlist'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='p-3 rounded-xl flex items-center gap-3.5 text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors'
                      >
                        <span className='w-8 h-8 rounded-lg bg-[#FF66B3]/15 text-[#FF66B3] flex items-center justify-center text-base font-bold shrink-0'>
                          ❤️
                        </span>
                        <div>
                          <p className='text-sm font-bold text-[var(--text-main)]'>My Wishlist ({wishlistCount})</p>
                          <p className='text-xs text-[var(--text-muted)] mt-0.5'>Curated editions saved for subsequent orders</p>
                        </div>
                      </Link>

                      <Link
                        href='/compare'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='p-3 rounded-xl flex items-center gap-3.5 text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors'
                      >
                        <span className='w-8 h-8 rounded-lg bg-[#42BFDD]/15 text-[#42BFDD] flex items-center justify-center text-base font-bold shrink-0'>
                          ⚖️
                        </span>
                        <div>
                          <p className='text-sm font-bold text-[var(--text-main)]'>Compare Editions ({compareBooks.length})</p>
                          <p className='text-xs text-[var(--text-muted)] mt-0.5'>Side-by-side volume specifications</p>
                        </div>
                      </Link>

                      <Link
                        href='/book-match'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='p-3 rounded-xl flex items-center gap-3.5 text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors'
                      >
                        <span className='w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center text-base font-bold shrink-0'>
                          ✦
                        </span>
                        <div>
                          <p className='text-sm font-bold text-[var(--text-main)]'>Personal Book Match Quiz</p>
                          <p className='text-xs text-[var(--text-muted)] mt-0.5'>AI-powered tailored reading recommendations</p>
                        </div>
                      </Link>
                    </div>

                    {/* Sign Out CTA */}
                    <div className='pt-2.5 mt-2.5 border-t border-[var(--border-subtle)]'>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className='w-full p-3 rounded-xl text-left text-rose-500 hover:bg-rose-500/10 font-bold transition-colors flex items-center justify-between cursor-pointer'
                      >
                        <span className='text-sm'>Sign Out of Session</span>
                        <span className='text-sm font-mono font-bold'>↗</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <Link
                  href='/login'
                  data-cursor='interactive'
                  className='hidden sm:inline-block font-sans font-semibold text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] px-2.5 py-1.5 transition-colors'
                >
                  Sign In
                </Link>
                <Link
                  href='/books'
                  data-cursor='interactive'
                  className='font-sans font-semibold text-xs text-[var(--bg-page)] bg-[var(--text-main)] rounded-full px-4 py-2 hover:opacity-90 transition-opacity flex items-center gap-1 shadow-xs'
                >
                  <span>Explore</span>
                  <span className='text-[10px]'>↗</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Toggle menu'
              className='md:hidden w-9 h-9 rounded-full border border-[var(--border-main)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-main)]'
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-[var(--border-main)] space-y-3 font-sans text-xs font-semibold animate-fade-in'>
            <form onSubmit={handleSearchSubmit} className='relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search books...'
                className='w-full px-4 py-2 text-xs rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] text-[var(--text-main)] focus:outline-none'
              />
            </form>
            <div className='flex flex-col space-y-1.5'>
              {navLinks.map((item) => (
                <Link
                  key={'mobile-' + item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className='px-2 py-0.5 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-full text-[10px]'>
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href='/cart'
                onClick={() => setIsMobileMenuOpen(false)}
                className='px-3.5 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-page)] flex items-center justify-between'
              >
                <span>Shopping Bag</span>
                <span>({itemCount})</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
