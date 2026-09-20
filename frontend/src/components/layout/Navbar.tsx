'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../common/ThemeToggle';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const router = useRouter();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push('/?search=' + encodeURIComponent(searchQuery.trim()) + '#catalog');
    } else {
      router.push('/');
    }
  };

  const searchIcon = (
    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
    </svg>
  );

  const heartIcon = (
    <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
    </svg>
  );

  const bagIcon = (
    <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
    </svg>
  );

  const bookIcon = (
    <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
    </svg>
  );

  return (
    <header className='sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-18 gap-4'>
          {/* Logo & Brand */}
          <Link href='/' className='flex items-center gap-2.5 shrink-0 group'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform'>
              {bookIcon}
            </div>
            <div>
              <span className='text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300 bg-clip-text text-transparent'>
                BOOKLY
              </span>
              <span className='hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1'>
                Online Bookstore
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className='hidden md:flex flex-1 max-w-lg relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by title, author, ISBN, publisher...'
              className='w-full pl-11 pr-4 py-2.5 text-sm rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition'
            />
            <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
              {searchIcon}
            </div>
          </form>

          {/* Nav Links & Actions */}
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <Link
              href='/#catalog'
              className='hidden lg:inline-flex px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition'
            >
              Explore Catalog
            </Link>

            <ThemeToggle />

            {/* Wishlist Button */}
            <Link
              href='/wishlist'
              className='relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
              title='Wishlist'
            >
              {heartIcon}
              {wishlistCount > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-sm animate-pulse'>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              className='relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
              title='Cart'
            >
              {bagIcon}
              {itemCount > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-sm'>
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account */}
            {isAuthenticated && user ? (
              <div className='relative'>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className='flex items-center gap-2 p-1.5 pl-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer'
                >
                  <span className='text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[90px] truncate'>
                    {user.name.split(' ')[0]}
                  </span>
                  <div className='w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold'>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className='absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50'>
                    <div className='px-4 py-2 border-b border-slate-100 dark:border-slate-800'>
                      <p className='text-xs font-semibold text-slate-900 dark:text-white truncate'>{user.name}</p>
                      <p className='text-[10px] text-slate-400 truncate'>{user.email}</p>
                      <span className='inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'>
                        {user.role}
                      </span>
                    </div>
                    {user.role === 'ADMIN' && (
                      <Link
                        href='/admin'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition'
                      >
                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href='/orders'
                      onClick={() => setIsUserMenuOpen(false)}
                      className='block px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    >
                      My Orders
                    </Link>
                    <Link
                      href='/wishlist'
                      onClick={() => setIsUserMenuOpen(false)}
                      className='block px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    >
                      My Wishlist ({wishlistCount})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className='w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <Link
                  href='/login'
                  className='px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition'
                >
                  Sign In
                </Link>
                <Link
                  href='/register'
                  className='hidden sm:inline-flex px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition'
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            >
              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3'>
            <form onSubmit={handleSearchSubmit} className='relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search books, authors, ISBN...'
                className='w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400'>
                {searchIcon}
              </div>
            </form>
            <div className='flex flex-col space-y-2 pt-2'>
              <Link
                href='/#catalog'
                onClick={() => setIsMobileMenuOpen(false)}
                className='px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg'
              >
                Browse Catalog
              </Link>
              <Link
                href='/orders'
                onClick={() => setIsMobileMenuOpen(false)}
                className='px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg'
              >
                My Orders
              </Link>
              <Link
                href='/wishlist'
                onClick={() => setIsMobileMenuOpen(false)}
                className='px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg'
              >
                My Wishlist ({wishlistCount})
              </Link>
              <Link
                href='/cart'
                onClick={() => setIsMobileMenuOpen(false)}
                className='px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg'
              >
                Shopping Cart ({itemCount})
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
