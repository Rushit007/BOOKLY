'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: '⇄',
    title: 'Edition Compare',
    desc: 'Add up to 4 books and see a full spec matrix side-by-side — price, rating, publisher, page count.',
    href: '/compare',
  },
  {
    icon: '⚡',
    title: 'Book Match AI',
    desc: 'Answer 5 quick questions. Our engine scores your entire catalog and returns a curated top-3 shortlist.',
    href: '/book-match',
  },
  {
    icon: '💬',
    title: 'BookBuddy AI',
    desc: 'Ask anything in English or Hindi/Gujarati. BookBuddy knows every book, policy and feature at BOOKLY.',
    href: '#',
  },
  {
    icon: '◈',
    title: 'Curated Catalog',
    desc: '16+ hand-picked masterpieces. Smart filters by genre, price, rating and stock. Zero algorithmic fluff.',
    href: '/books',
  },
  {
    icon: '♡',
    title: 'Saved Editions',
    desc: 'Save books with one click. Your list persists across sessions and notifies you when prices drop.',
    href: '/wishlist',
  },
  {
    icon: '✦',
    title: 'Prepaid Discount',
    desc: 'Pay online via UPI or card and get an automatic 5% discount before checkout. Stack with promo codes.',
    href: '/cart',
  },
];

export function LuminaFeatureGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      className="border-y-2 border-black py-20 px-6 lg:px-8"
      style={{ backgroundColor: '#ffe17c' }}
    >
      <div className="max-w-7xl mx-auto">
        <p className="font-cabinet font-700 text-xs uppercase tracking-[0.25em] text-black/40 mb-3 text-center">
          Every tool you need
        </p>
        <h2
          className="font-cabinet font-800 text-black text-center mb-12"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
        >
          Built for deliberate readers.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Link
              key={f.title}
              href={f.href}
              className="bg-white border-2 border-black p-6 flex flex-col gap-4 group transition-transform hover:-translate-y-1"
              style={{ boxShadow: '4px 4px 0 #000' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Icon box */}
              <div
                className="w-16 h-16 border-2 border-black flex items-center justify-center text-2xl transition-colors"
                style={{ backgroundColor: hoveredIdx === i ? '#ffe17c' : '#b7c6c2' }}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="font-cabinet font-800 text-black text-xl mb-2">{f.title}</h3>
                <p className="font-cabinet text-black/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
              <span className="font-cabinet font-700 text-black text-xs uppercase tracking-wide mt-auto group-hover:underline">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
