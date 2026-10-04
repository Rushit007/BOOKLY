'use client';

import React from 'react';
import Link from 'next/link';

export function PillarsSection() {
  const pillars = [
    {
      num: '01',
      bgClass: 'bg-[#fed053] text-black',
      categorySlug: 'computer-science',
      title: 'Engineering Craft & Code',
      note: 'SYSTEMS ARCHITECTURE',
      desc: 'Clean code, resilient distributed systems, compiler internals, and software engineering masterpieces built to last generations.',
    },
    {
      num: '02',
      bgClass: 'bg-[#e83d84] text-white',
      categorySlug: 'fiction',
      title: 'Literary Narrative & Wisdom',
      note: 'TIMELESS EDITIONS',
      desc: 'Profound stories, philosophical allegories, and literary masterpieces that challenge perceptions of meaning and destiny.',
    },
    {
      num: '03',
      bgClass: 'bg-[#2b59ff] text-white',
      categorySlug: 'self-help',
      title: 'Habits, Mindset & Focus',
      note: 'BEHAVIORAL RIGOR',
      desc: 'Empirically grounded frameworks for compound habit formation, high-stakes decision making, and deep cognitive work.',
    },
    {
      num: '04',
      bgClass: 'bg-[#70c9a8] text-black',
      categorySlug: 'business-finance',
      title: 'Economics, Strategy & Design',
      note: 'FOUNDERS DOCTRINE',
      desc: 'First-principles business strategy, incentive alignment, visual aesthetics, and brand building with character.',
    },
  ];

  return (
    <section className='py-20 lg:py-28 border-b-2 border-black dark:border-neutral-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b-2 border-black/10 dark:border-neutral-800'>
          <div className='space-y-4 max-w-2xl'>
            <div className='flex items-center gap-3'>
              <span className='badge-pill-blue px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider'>
                PILLARS OF CURATION
              </span>
              <span className='font-editorial-mono text-xs text-neutral-500 uppercase tracking-widest'>
                STANDARDS
              </span>
            </div>
            <h2 className='font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-black dark:text-white leading-tight'>
              Four pillars we never compromise on.
            </h2>
          </div>
          <p className='font-editorial-sans text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed'>
            These are the principles we select volumes by, defend in catalog reviews, and use to filter out disposable content.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12'>
          {pillars.map((item) => (
            <div
              key={item.num}
              className='neo-card rounded-2xl p-6 flex flex-col justify-between space-y-6 bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 shadow-[4px_4px_0px_#0c0c0c] hover:-translate-y-1 transition-all'
            >
              {/* Card Header with Circle Number */}
              <div className='flex items-center justify-between'>
                <div
                  className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-editorial-mono text-sm font-black ${item.bgClass}`}
                >
                  {item.num}
                </div>
                <span className='font-editorial-mono text-[10px] uppercase font-bold tracking-widest text-neutral-500'>
                  {item.note}
                </span>
              </div>

              {/* Title & Desc */}
              <div className='space-y-3 flex-1'>
                <h3 className='font-editorial-serif text-2xl font-bold text-black dark:text-white leading-snug'>
                  {item.title}
                </h3>
                <p className='font-editorial-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                  {item.desc}
                </p>
              </div>

              {/* Action Link */}
              <div className='pt-4 border-t border-black/10 dark:border-neutral-800'>
                <Link
                  href={`/books?category=${item.categorySlug}`}
                  data-cursor='interactive'
                  className='inline-flex items-center gap-1.5 font-editorial-mono text-xs font-bold text-black dark:text-white hover:text-[#2b59ff] dark:hover:text-[#fed053] transition-colors'
                >
                  <span>Explore Collection</span>
                  <span className='text-sm'>↗</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
