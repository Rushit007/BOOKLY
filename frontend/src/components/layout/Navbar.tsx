'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '../common/ThemeToggle';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { PillNav } from './PillNav';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareBooks } = useCompare();
  const { user, isAuthenticated, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push('/books?search=' + encodeURIComponent(searchQuery.trim()));
    } else {
      router.push('/books');
    }
  };

  // Nav items for the PillNav component (no counts — those are handled by icon badges)
  const pillNavItems = [
    { label: 'Index', href: '/' },
    { label: 'Catalog', href: '/books' },
    { label: 'Book Match', href: '/book-match' },
    { label: 'Compare', href: '/compare', count: compareBooks.length > 0 ? compareBooks.length : undefined },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  // Mobile fallback nav links (used in the mobile drawer below the header)
  const navLinks = [
    { label: 'INDEX', href: '/' },
    { label: 'CATALOG', href: '/books' },
    { label: 'BOOK MATCH', href: '/book-match' },
    { label: 'COMPARE', href: '/compare', count: compareBooks.length },
    { label: 'ABOUT', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'CONTACT', href: '/contact' },
  ];

  // Determine active pill href
  const activePillHref = (() => {
    const match = pillNavItems.find(
      (item) => item.href !== '/' && pathname.startsWith(item.href)
    );
    return match?.href ?? (pathname === '/' ? '/' : undefined);
  })();

  // Logo icon for PillNav
  const BooklyLogoIcon = (
    <span style={{ color: '#ffe17c', fontSize: '16px', fontWeight: 900, lineHeight: 1 }}>⚡</span>
  );

  return (
    <header className='sticky top-0 z-40 w-full border-b-2 border-black' style={{ backgroundColor: '#ffe17c', height: '80px' }}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20 gap-4'>

          {/* ── Logo ── */}
          <Link href='/' className='flex items-center gap-3 shrink-0 group' data-cursor='interactive'>
            <div className='w-10 h-10 bg-black flex items-center justify-center border-2 border-black group-hover:bg-[#ffe17c] transition-colors' style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
              <span style={{ color: '#ffe17c', fontSize: '18px', fontWeight: 900 }} className='group-hover:opacity-0 transition-opacity'>⚡</span>
            </div>
            <div>
              <span className='font-cabinet font-800 text-xl tracking-tight text-black leading-none block'>
                BOOKLY
              </span>
              <span className='font-cabinet text-[9px] uppercase font-700 tracking-[0.22em] text-black/50 block mt-0.5'>
                CURATED EDITIONS
              </span>
            </div>
          </Link>

          {/* ── PillNav — Desktop center navigation ── */}
          <div className='hidden md:flex flex-1 items-center justify-center'>
            <PillNav
              logo={BooklyLogoIcon}
              items={pillNavItems}
              activeHref={activePillHref}
              baseColor='#1A1A1B'
              pillColor='#ffe17c'
              pillTextColor='#1A1A1B'
              hoveredPillTextColor='#ffe17c'
              initialLoadAnimation={true}
            />
          </div>

          {/* ── Actions & Utilities ── */}
          <div className='flex items-center gap-2 sm:gap-3'>
            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className='hidden lg:flex items-center relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search editions...'
                className='w-44 focus:w-56 px-3.5 py-1.5 text-xs font-cabinet border-2 border-black bg-white text-black placeholder:text-black/40 focus:outline-none transition-all'
              />
              <button
                type='submit'
                aria-label='Search'
                className='absolute right-2.5 text-black/60 hover:text-black transition-colors'
              >
                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </button>
            </form>

            <ThemeToggle />

            {/* Wishlist */}
            <Link
              href='/wishlist'
              data-cursor='interactive'
              aria-label='Wishlist'
              className='relative w-9 h-9 border-2 border-black bg-white flex items-center justify-center text-black hover:bg-black hover:text-[#ffe17c] transition-colors'
              title='Saved Wishlist'
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
              </svg>
              {wishlistCount > 0 && (
                <span className='absolute -top-1 -right-1 w-4 h-4 bg-black text-[#ffe17c] rounded-full text-[9px] font-bold flex items-center justify-center'>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              data-cursor='add'
              aria-label='Open Cart'
              className='relative w-9 h-9 border-2 border-black bg-white flex items-center justify-center text-black hover:bg-black hover:text-[#ffe17c] transition-colors'
              title='Shopping Cart'
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
              </svg>
              {itemCount > 0 && (
                <span className='absolute -top-1 -right-1 w-4 h-4 bg-black text-[#ffe17c] rounded-full text-[9px] font-bold flex items-center justify-center'>
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {isAuthenticated && user ? (
              <div className='relative'>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  data-cursor='interactive'
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[var(--border-main)] bg-[var(--bg-surface)] font-editorial-mono text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors'
                >
                  <span className='max-w-[70px] truncate'>{user.name.split(' ')[0]}</span>
                  <span className='text-[10px] text-[var(--text-faint)]'>▼</span>
                </button>

                {isUserMenuOpen && (
                  <div className='absolute right-0 mt-2 w-52 bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[var(--shadow-neo)] py-2 z-50 font-editorial-mono text-xs animate-scale-in'>
                    <div className='px-4 py-2 border-b-2 border-[var(--border-subtle)]'>
                      <p className='font-bold text-[var(--text-main)] truncate'>{user.name}</p>
                      <p className='text-[10px] text-[var(--text-faint)] truncate'>{user.email}</p>
                      <span className='inline-block mt-1 px-2 py-0.5 text-[9px] font-bold bg-[var(--bg-accent-yellow)] text-black border border-[var(--border-main)]'>
                        {user.role}
                      </span>
                    </div>
                    {user.role === 'ADMIN' && (
                      <Link
                        href='/admin'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='block px-4 py-2 font-bold text-[var(--bg-accent-blue)] hover:bg-[var(--bg-surface-elevated)]'
                      >
                        ⚡ Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href='/orders'
                      onClick={() => setIsUserMenuOpen(false)}
                      className='block px-4 py-2 text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                    >
                      Order Archives
                    </Link>
                    <Link
                      href='/wishlist'
                      onClick={() => setIsUserMenuOpen(false)}
                      className='block px-4 py-2 text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                    >
                      Saved Editions ({wishlistCount})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className='w-full text-left px-4 py-2 text-rose-500 hover:bg-rose-500/10 border-t border-[var(--border-subtle)] mt-1 font-bold'
                    >
                      Sign Out ↗
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <Link
                  href='/login'
                  data-cursor='interactive'
                  className='hidden sm:inline-block font-cabinet font-700 text-xs text-black px-3 py-1.5 hover:underline'
                >
                  Sign In
                </Link>
                <Link
                  href='/books'
                  data-cursor='interactive'
                  className='font-cabinet font-700 text-xs text-white bg-black border-2 border-black px-4 py-1.5 uppercase tracking-wide flex items-center gap-1 hover:-translate-y-0.5 transition-transform'
                  style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
                >
                  <span>START READING</span>
                  <span>↗</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Toggle menu'
              className='md:hidden w-9 h-9 rounded-full border-2 border-[var(--border-main)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-main)]'
            >
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t-2 border-[var(--border-main)] space-y-3 font-editorial-mono text-xs font-bold animate-fade-in'>
            <form onSubmit={handleSearchSubmit} className='relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search books...'
                className='w-full px-3 py-2 text-xs rounded-xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] text-[var(--text-main)]'
              />
            </form>
            <div className='flex flex-col space-y-1.5'>
              {navLinks.map((item) => (
                <Link
                  key={'mobile-' + item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between text-[var(--text-main)]'
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className='px-2 py-0.5 bg-[var(--bg-accent-yellow)] text-black rounded text-[10px]'>
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href='/cart'
                onClick={() => setIsMobileMenuOpen(false)}
                className='px-3 py-2 rounded-xl bg-[var(--text-main)] text-[var(--bg-page)] flex items-center justify-between'
              >
                <span>SHOPPING CART</span>
                <span>({itemCount})</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
