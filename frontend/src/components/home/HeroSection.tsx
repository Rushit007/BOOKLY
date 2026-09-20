'use client';

import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className='relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24'>
      {/* Background Glow Blobs */}
      <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
          {/* Hero Left Content */}
          <div className='lg:col-span-7 space-y-6 text-center lg:text-left'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold'>
              <span className='w-2 h-2 rounded-full bg-indigo-500 animate-pulse' />
              <span>Modern Online Bookstore & E-Commerce Platform</span>
            </div>

            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]'>
              Unlock Endless Knowledge With{' '}
              <span className='bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent'>
                BOOKLY
              </span>
            </h1>

            <p className='text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal'>
              Discover curated bestsellers, software engineering masterpieces, timeless fiction, and mind-expanding non-fiction with seamless delivery.
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2'>
              <Link
                href='#catalog'
                className='px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200'
              >
                Browse Books Catalog
              </Link>
              <Link
                href='#featured'
                className='px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all duration-200'
              >
                Featured Bestsellers
              </Link>
            </div>

            {/* Metric Counters */}
            <div className='grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 max-w-lg mx-auto lg:mx-0'>
              <div>
                <p className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>10,000+</p>
                <p className='text-xs font-medium text-slate-400'>Books Available</p>
              </div>
              <div>
                <p className='text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400'>99.8%</p>
                <p className='text-xs font-medium text-slate-400'>Satisfied Readers</p>
              </div>
              <div>
                <p className='text-2xl sm:text-3xl font-black text-cyan-500'>24/7</p>
                <p className='text-xs font-medium text-slate-400'>Instant Access</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Book Showcase */}
          <div className='lg:col-span-5 relative flex justify-center'>
            <div className='relative w-72 sm:w-80 aspect-[3/4] rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-1 shadow-2xl shadow-indigo-500/20 transform rotate-2 hover:rotate-0 transition-transform duration-500'>
              <div className='w-full h-full rounded-[22px] bg-slate-900 p-6 flex flex-col justify-between text-white overflow-hidden relative'>
                {/* Visual Cover Elements */}
                <div className='absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none' />
                <div>
                  <span className='px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-widest text-cyan-300'>
                    BOOK OF THE MONTH
                  </span>
                  <h3 className='text-2xl font-black mt-4 leading-snug'>Clean Code</h3>
                  <p className='text-xs text-slate-400 mt-1'>by Robert C. Martin</p>
                </div>
                <div className='space-y-3 pt-6'>
                  <div className='flex items-center gap-1.5 text-amber-400 text-sm'>
                    <span>★★★★★</span>
                    <span className='text-xs text-slate-300 font-bold'>4.9 / 5.0</span>
                  </div>
                  <p className='text-xs text-slate-300 line-clamp-3 leading-relaxed'>
                    A handbook of agile software craftsmanship. The essential guide for producing readable, maintainable, and robust software.
                  </p>
                  <div className='pt-2 flex items-center justify-between border-t border-slate-800'>
                    <span className='text-xl font-black text-white'>₹699</span>
                    <Link
                      href='/books/book-1'
                      className='px-4 py-2 bg-white text-slate-950 text-xs font-bold rounded-xl hover:bg-slate-100 transition'
                    >
                      Read Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
