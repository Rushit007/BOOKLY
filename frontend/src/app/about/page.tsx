'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-[var(--bg-page)] animate-fade-in'>
      {/* Header Banner */}
      <div className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16'>
          <div className='flex flex-wrap items-center gap-3 mb-4'>
            <span className='badge-pill-yellow px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider'>
              MANIFESTO &amp; ORIGIN
            </span>
            <span className='badge-pill-blue px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider'>
              EST. 2021
            </span>
          </div>
          <h1 className='font-editorial-serif text-4xl sm:text-6xl text-[var(--text-main)] leading-[1.1]'>
            Against the <br />
            <span className='italic font-normal editorial-highlighter'>algorithm</span> of fluff.
          </h1>
          <p className='font-editorial-sans text-base sm:text-lg text-[var(--text-muted)] mt-5 max-w-2xl leading-relaxed'>
            Bookly was born from a singular conviction: books are architectural artifacts for the mind. In a world overrun by fleeting social feeds and automated listicles, deliberate readers deserve a sanctuary of curated literature.
          </p>
        </div>
      </div>

      {/* Main Principles Grid */}
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='neo-card p-6 bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]'>
            <span className='w-8 h-8 rounded-full bg-[var(--bg-accent-yellow)] border-2 border-[var(--border-main)] flex items-center justify-center font-editorial-mono font-bold text-xs mb-4 text-black'>
              01
            </span>
            <h3 className='font-editorial-serif text-xl font-bold text-[var(--text-main)] mb-2'>
              Strict Editorial Rigor
            </h3>
            <p className='font-editorial-sans text-xs text-[var(--text-muted)] leading-relaxed'>
              We do not stock millions of randomly aggregated SKUs. Every title in our catalog is hand-selected for craftsmanship, endurance, and intellectual density.
            </p>
          </div>

          <div className='neo-card p-6 bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]'>
            <span className='w-8 h-8 rounded-full bg-[var(--bg-accent-blue)] text-white border-2 border-[var(--border-main)] flex items-center justify-center font-editorial-mono font-bold text-xs mb-4'>
              02
            </span>
            <h3 className='font-editorial-serif text-xl font-bold text-[var(--text-main)] mb-2'>
              Tactile Physical Craft
            </h3>
            <p className='font-editorial-sans text-xs text-[var(--text-muted)] leading-relaxed'>
              We celebrate ink, cloth bindings, acid-free archival paper, and typographic distinction. A physical book is permanent memory hardware.
            </p>
          </div>

          <div className='neo-card p-6 bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]'>
            <span className='w-8 h-8 rounded-full bg-[var(--bg-accent-mint)] border-2 border-[var(--border-main)] flex items-center justify-center font-editorial-mono font-bold text-xs mb-4 text-black'>
              03
            </span>
            <h3 className='font-editorial-serif text-xl font-bold text-[var(--text-main)] mb-2'>
              Independent Publishers
            </h3>
            <p className='font-editorial-sans text-xs text-[var(--text-muted)] leading-relaxed'>
              We champion independent presses, engineering monographs, rare translations, and seminal foundational texts that corporate algorithms bury.
            </p>
          </div>
        </div>

        {/* Dispatch & Packaging Spec */}
        <div className='neo-card p-8 bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-main)] shadow-[6px_6px_0px_var(--border-main)]'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[var(--border-subtle)] gap-4'>
            <div>
              <p className='font-editorial-mono text-[9px] uppercase tracking-[0.25em] text-[var(--text-faint)] font-bold'>
                PACKAGING SPECIFICATION
              </p>
              <h2 className='font-editorial-serif text-2xl text-[var(--text-main)] mt-0.5'>
                How your books arrive
              </h2>
            </div>
            <span className='badge-pill-mint px-3 py-1 rounded-full text-xs font-bold'>
              100% PLASTIC-FREE
            </span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 font-editorial-mono text-xs'>
            <div className='space-y-1'>
              <span className='text-[var(--text-faint)] uppercase text-[10px] block font-bold'>Step 1</span>
              <p className='font-bold text-[var(--text-main)]'>Archival Glassine</p>
              <p className='text-[10px] text-[var(--text-muted)]'>Dust and moisture protection without adhesives.</p>
            </div>
            <div className='space-y-1'>
              <span className='text-[var(--text-faint)] uppercase text-[10px] block font-bold'>Step 2</span>
              <p className='font-bold text-[var(--text-main)]'>Corner Protectors</p>
              <p className='text-[10px] text-[var(--text-muted)]'>Rigid edge armor ensuring corners arrive needle-sharp.</p>
            </div>
            <div className='space-y-1'>
              <span className='text-[var(--text-faint)] uppercase text-[10px] block font-bold'>Step 3</span>
              <p className='font-bold text-[var(--text-main)]'>Heavy Card Sleeve</p>
              <p className='text-[10px] text-[var(--text-muted)]'>Crush-proof 350 GSM corrugated craft shell.</p>
            </div>
            <div className='space-y-1'>
              <span className='text-[var(--text-faint)] uppercase text-[10px] block font-bold'>Step 4</span>
              <p className='font-bold text-[var(--text-main)]'>Bookmark Edition</p>
              <p className='text-[10px] text-[var(--text-muted)]'>Includes limited edition letterpress bookmark.</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className='p-8 bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)] flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div>
            <h3 className='font-editorial-serif text-2xl text-[var(--text-main)]'>
              Ready to find your next enduring read?
            </h3>
            <p className='font-editorial-mono text-xs text-[var(--text-muted)] mt-1'>
              Explore over 10,000 carefully curated architectural &amp; intellectual editions.
            </p>
          </div>
          <div className='flex items-center gap-3 shrink-0'>
            <Link
              href='/books'
              className='neo-btn-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider'
            >
              Catalog ↗
            </Link>
            <Link
              href='/book-match'
              className='neo-btn-accent px-6 py-3.5 text-xs font-bold uppercase tracking-wider'
            >
              Book Match ⚡
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
