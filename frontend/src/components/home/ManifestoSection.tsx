'use client';

import React from 'react';
import Link from 'next/link';

export function ManifestoSection() {
  return (
    <section className='w-full bg-[#0c0c0c] text-[#f7f5f0] border-b-2 border-black py-20 lg:py-28 relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Top Badges & Index Header */}
        <div className='flex flex-wrap items-center justify-between gap-4 pb-12 border-b border-neutral-800'>
          <div className='flex items-center gap-3'>
            <span className='badge-pill-yellow px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black'>
              MANIFESTO
            </span>
            <span className='font-editorial-mono text-xs text-neutral-400 uppercase tracking-[0.2em]'>
              FILE 001 / BOOKLY DOCTRINE
            </span>
          </div>
          <span className='font-editorial-mono text-xs text-neutral-400 uppercase tracking-widest hidden sm:block'>
            STAMPED 2026
          </span>
        </div>

        {/* Large Statement Quote */}
        <div className='py-12 lg:py-16 max-w-5xl'>
          <blockquote className='font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-[#f7f5f0] leading-[1.15] font-normal'>
            &ldquo;We curate volumes that argue for themselves. Foundational engineering craft, timeless literature, and philosophy your mind can run with on a Monday morning.&rdquo;
          </blockquote>
        </div>

        {/* Bottom Section Metadata & Action */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-10 border-t border-neutral-800 font-editorial-mono text-xs text-neutral-400 uppercase tracking-widest'>
          <div className='flex items-center gap-6'>
            <span>BOOKLY PRESS &amp; ARCHIVE</span>
            <span className='text-[#fed053]'>*</span>
            <span>INK NO. 04 / LINEN NO. 02</span>
          </div>

          <Link
            href='/about'
            data-cursor='interactive'
            className='inline-flex items-center gap-2 text-[#f7f5f0] hover:text-[#fed053] transition-colors underline underline-offset-8'
          >
            <span>READ OUR CURATION CRITERIA</span>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
