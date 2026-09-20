'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className='bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200 pt-16 pb-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100 dark:border-slate-900'>
          {/* Brand Info */}
          <div className='lg:col-span-2 space-y-4'>
            <div className='flex items-center gap-2.5'>
              <div className='w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20'>
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
              </div>
              <span className='text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300 bg-clip-text text-transparent'>
                BOOKLY
              </span>
            </div>
            <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed'>
              A state-of-the-art online bookstore and e-commerce platform curated for passionate readers, developers, thinkers, and lifelong learners.
            </p>
            <div className='flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400'>
              <span className='w-2 h-2 rounded-full bg-emerald-500 animate-ping' />
              <span>Full-Stack Architecture: Next.js + NestJS + PostgreSQL + Prisma</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4'>
              Top Genres
            </h4>
            <ul className='space-y-2.5 text-sm text-slate-500 dark:text-slate-400'>
              <li>
                <Link href='/?category=computer-science#catalog' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  Computer Science
                </Link>
              </li>
              <li>
                <Link href='/?category=fiction#catalog' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  Fiction & Literature
                </Link>
              </li>
              <li>
                <Link href='/?category=self-help#catalog' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  Self-Help & Mindset
                </Link>
              </li>
              <li>
                <Link href='/?category=business-finance#catalog' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  Business & Finance
                </Link>
              </li>
              <li>
                <Link href='/?category=science-nature#catalog' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  Science & Nature
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4'>
              Navigation
            </h4>
            <ul className='space-y-2.5 text-sm text-slate-500 dark:text-slate-400'>
              <li>
                <Link href='/#catalog' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  Explore Books
                </Link>
              </li>
              <li>
                <Link href='/wishlist' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href='/cart' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href='/login' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Info & Security */}
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4'>
              Academic Project
            </h4>
            <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400'>
              <p className='font-bold text-slate-900 dark:text-slate-200'>Gondaliya Rushit R.</p>
              <p>Enrollment: <span className='font-mono font-semibold text-indigo-600 dark:text-indigo-400'>240841102020</span></p>
              <p>Final Year Capstone Project</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400'>
          <p>© 2026 BOOKLY Bookstore. Designed & Built by Gondaliya Rushit R.</p>
          <div className='flex items-center gap-4'>
            <span>Next.js 16</span>
            <span>•</span>
            <span>NestJS 11</span>
            <span>•</span>
            <span>PostgreSQL</span>
            <span>•</span>
            <span>Prisma ORM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
