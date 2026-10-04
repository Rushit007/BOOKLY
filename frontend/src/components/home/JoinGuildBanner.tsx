'use client';

import React from 'react';
import Link from 'next/link';

export function JoinGuildBanner() {
  return (
    <section className='w-full bg-[#fed053] text-[#0c0c0c] border-b-2 border-black py-16 md:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-8'>
          <div className='space-y-3 max-w-2xl'>
            <div className='inline-block font-editorial-mono text-xs uppercase font-bold tracking-[0.2em] border-b-2 border-black pb-0.5'>
              ACQUISITION &amp; DISCOVERY
            </div>
            <h2 className='font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight'>
              Seeking a rare volume or specific edition?
            </h2>
            <p className='font-editorial-sans text-sm sm:text-base text-neutral-800 leading-relaxed'>
              Our editorial curators source out-of-print software treatises, international philosophical translations, and collector bindings on demand.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-4 shrink-0'>
            <Link
              href='/contact'
              data-cursor='interactive'
              className='px-8 py-4 bg-black text-[#f7f5f0] border-2 border-black rounded-full font-editorial-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition shadow-[4px_4px_0px_rgba(0,0,0,0.3)] flex items-center gap-2'
            >
              <span>SUBMIT BOOK BRIEF</span>
              <span className='text-sm'>↗</span>
            </Link>
            <Link
              href='/book-match'
              data-cursor='interactive'
              className='px-6 py-4 bg-white text-black border-2 border-black rounded-full font-editorial-mono text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition shadow-[4px_4px_0px_rgba(0,0,0,0.3)] flex items-center gap-1.5'
            >
              <span>TRY BOOK MATCH</span>
              <span className='text-sm'>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
