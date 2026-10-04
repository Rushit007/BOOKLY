'use client';

import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className='relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b-2 border-[var(--border-main)] animate-fade-in'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Floating Asymmetric Micro-Badges Bar */}
        <div className='flex flex-wrap items-center gap-3 pb-8'>
          <div className='badge-pill-yellow px-3.5 py-1 rounded-full text-xs uppercase tracking-wider -rotate-1 shadow-[2px_2px_0px_var(--border-main)]'>
            ★ CURATED EDITIONS
          </div>
          <div className='badge-pill-blue px-3.5 py-1 rounded-full text-xs uppercase tracking-wider rotate-1 shadow-[2px_2px_0px_var(--border-main)]'>
            WORLDWIDE DISPATCH
          </div>
          <div className='badge-pill-mint px-3.5 py-1 rounded-full text-xs uppercase tracking-wider -rotate-2 shadow-[2px_2px_0px_var(--border-main)] hidden sm:block'>
            INDEPENDENT SINCE 2021
          </div>
          <div className='ml-auto badge-pill-pink px-4 py-1 rounded-full text-xs uppercase tracking-wider rotate-2 shadow-[2px_2px_0px_var(--border-main)] hidden md:block'>
            NEW ISSUE / VOL. 12
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
          {/* Hero Left Content: Statement Typography */}
          <div className='lg:col-span-7 space-y-8 animate-fade-in-up'>
            <h1 className='font-editorial-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-[var(--text-main)] leading-[1.05]'>
              Books that <br />
              <span className='italic font-normal editorial-highlighter'>mean</span>{' '}
              something.
            </h1>

            {/* Mission Brief / Editorial Paragraph */}
            <div className='space-y-2 max-w-xl'>
              <p className='font-editorial-mono text-[11px] uppercase tracking-[0.25em] text-[var(--text-faint)] font-bold'>
                MISSION BRIEF / CATALOGUE NOTE
              </p>
              <p className='text-base sm:text-lg text-[var(--text-muted)] leading-relaxed font-editorial-sans'>
                Bookly is an independent online bookstore for engineers, critical thinkers, and deliberate readers. We curate timeless volumes with architectural weight, zero algorithm fluff, and worldwide delivery.
              </p>
            </div>

            {/* Editorial Action Buttons */}
            <div className='flex flex-wrap items-center gap-4 pt-2'>
              <Link
                href='/books'
                data-cursor='interactive'
                className='neo-btn-primary px-8 py-4 text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_var(--border-main)] flex items-center gap-2 hover:scale-[1.02] transition-transform'
              >
                <span>EXPLORE CATALOG</span>
                <span className='text-sm'>↗</span>
              </Link>
              <Link
                href='/book-match'
                data-cursor='interactive'
                className='neo-btn-secondary px-8 py-4 text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_var(--border-main)] flex items-center gap-2 hover:scale-[1.02] transition-transform'
              >
                <span>⚡ TRY BOOK MATCH</span>
                <span className='text-sm'>↗</span>
              </Link>
              <Link
                href='/compare'
                data-cursor='compare'
                className='font-editorial-mono text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] underline underline-offset-4 px-2'
              >
                Compare Editions
              </Link>
            </div>

            {/* Editorial Index Numbers */}
            <div className='grid grid-cols-3 gap-6 pt-6 border-t-2 border-[var(--border-subtle)] max-w-lg'>
              <div>
                <span className='font-editorial-serif text-3xl font-black text-[var(--text-main)] block'>10,000+</span>
                <span className='font-editorial-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]'>PRINTED VOLUMES</span>
              </div>
              <div>
                <span className='font-editorial-serif text-3xl font-black text-[var(--bg-accent-blue)] block'>4.9★</span>
                <span className='font-editorial-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]'>READER SATISFACTION</span>
              </div>
              <div>
                <span className='font-editorial-serif text-3xl font-black text-[var(--bg-accent-pink)] block'>24H</span>
                <span className='font-editorial-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]'>DISPATCH WINDOW</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Book of the Month Showcase Card */}
          <div className='lg:col-span-5 relative flex justify-center animate-fade-in-up delay-200'>
            <div className='w-full max-w-sm neo-card rounded-2xl p-6 relative bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[var(--shadow-neo-lg)]'>
              {/* Header inside card */}
              <div className='flex items-center justify-between pb-4 border-b-2 border-[var(--border-subtle)]'>
                <div className='flex items-center gap-2'>
                  <span className='w-7 h-7 rounded-full bg-[var(--bg-accent-yellow)] border border-[var(--border-main)] flex items-center justify-center font-editorial-mono text-xs font-bold text-black'>
                    01
                  </span>
                  <span className='font-editorial-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]'>
                    BOOK OF THE MONTH
                  </span>
                </div>
                <span className='badge-pill-pink px-2.5 py-0.5 rounded-full text-[10px] font-bold'>
                  -15% OFF
                </span>
              </div>

              {/* Book Cover and Presentation */}
              <div className='py-6 flex gap-5 items-center'>
                <div className='w-32 aspect-[3/4] rounded-lg bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-main)] shadow-[3px_3px_0px_var(--border-main)] overflow-hidden shrink-0 relative'>
                  <img
                    src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&h=800&fit=crop'
                    alt='Clean Code'
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                  />
                </div>
                <div className='space-y-2'>
                  <span className='font-editorial-mono text-[10px] text-[var(--text-faint)] uppercase tracking-widest block'>
                    BY ROBERT C. MARTIN
                  </span>
                  <h3 className='font-editorial-serif font-bold text-xl text-[var(--text-main)] leading-tight'>
                    Clean Code
                  </h3>
                  <p className='font-editorial-sans text-xs text-[var(--text-muted)] line-clamp-3'>
                    A handbook of agile software craftsmanship. The essential guide for producing readable, maintainable software.
                  </p>
                  <div className='pt-1 flex items-baseline gap-2'>
                    <span className='font-editorial-mono font-bold text-lg text-[var(--text-main)]'>₹699</span>
                    <span className='font-editorial-mono text-xs text-[var(--text-faint)] line-through'>₹799</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className='pt-4 border-t-2 border-[var(--border-subtle)] flex items-center justify-between'>
                <span className='font-editorial-mono text-[11px] text-[var(--text-faint)] font-bold'>
                  4.8 ★ (340+ REVIEWS)
                </span>
                <Link
                  href='/books/a3050526-24ed-471e-b4bc-d7f813e195c6'
                  data-cursor='book'
                  className='neo-btn-accent px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--border-main)] flex items-center gap-1 hover:translate-x-0.5 transition-transform'
                >
                  <span>SPECIFICATION</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
