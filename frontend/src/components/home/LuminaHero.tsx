'use client';
import React from 'react';
import Link from 'next/link';
import { CreepyButton } from '../common/CreepyButton';
import { TubesBackground } from './TubesBackground';

export function LuminaHero() {
  return (
    <section
      className="lumina-dot-bg border-b-2 border-black relative"
      style={{ backgroundColor: '#ffe17c' }}
    >
      <TubesBackground enableClickInteraction={true}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left Column ── */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-2 shadow-hard-4">
              <span className="w-2 h-2 rounded-full bg-black inline-block" />
              <span className="font-cabinet font-700 text-sm text-black uppercase tracking-wide">
                NEW: AI Book Match 2.0
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-cabinet font-800 text-black leading-none"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.0 }}
            >
              STOP BROWSING.{' '}
              <span
                style={{
                  WebkitTextStroke: '2.5px black',
                  color: 'transparent',
                  display: 'inline',
                }}
              >
                START
              </span>{' '}
              READING.
            </h1>

            {/* Sub-line */}
            <p className="font-cabinet text-black/70 text-lg leading-relaxed max-w-lg" style={{ fontWeight: 500 }}>
              Stop juggling 12 different bookstores. BOOKLY brings curated editions, smart recommendations, and genuine publisher copies into one bold experience.
            </p>

            {/* CTA group */}
            <div className="flex flex-wrap items-center gap-5">
              <Link href="/books">
                <CreepyButton
                  primary="#1A1A1B"
                  primaryHover="#333"
                  eyeColor="#ffe17c"
                  style={{ fontSize: '0.95rem', minWidth: '13em' }}
                >
                  Explore Catalog ↗
                </CreepyButton>
              </Link>
              <Link href="/book-match">
                <CreepyButton
                  primary="#ffffff"
                  primaryHover="#f5f0e0"
                  eyeColor="#1A1A1B"
                  style={{ fontSize: '0.95rem', minWidth: '13em', '--cb-black': '#1A1A1B' } as React.CSSProperties}
                >
                  ⚡ Try Book Match
                </CreepyButton>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-5 text-black/60">
              <span className="font-cabinet text-xs font-500 flex items-center gap-1">
                <span className="text-black">✓</span> 14-day free returns
              </span>
              <span className="font-cabinet text-xs font-500 flex items-center gap-1">
                <span className="text-black">✓</span> Genuine publisher editions
              </span>
              <span className="font-cabinet text-xs font-500 flex items-center gap-1">
                <span className="text-black">✓</span> No credit card required
              </span>
            </div>
          </div>

          {/* ── Right Column: Browser Mockup ── */}
          <div className="relative">
            {/* Offset shadow block */}
            <div
              className="absolute inset-0 translate-x-3 translate-y-3 bg-black rounded-sm"
              style={{ zIndex: 0 }}
            />
            <div
              className="relative bg-white border-2 border-black rounded-sm overflow-hidden"
              style={{ zIndex: 1, boxShadow: '12px 12px 0 #000' }}
            >
              {/* Browser chrome */}
              <div className="bg-[#f4f4f5] border-b-2 border-black px-4 py-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/20" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/20" />
                <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/20" />
                <div className="ml-3 flex-1 bg-white border border-gray-200 rounded px-3 py-1">
                  <span className="font-cabinet text-xs text-gray-400">bookly.store/catalog</span>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-5 space-y-4">
                {/* Top stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Books Curated', val: '16+', color: '#ffe17c' },
                    { label: 'Avg Rating', val: '4.9★', color: '#b7c6c2' },
                    { label: 'Dispatched', val: '24H', color: '#b7c6c2' },
                  ].map(s => (
                    <div
                      key={s.label}
                      className="border-2 border-black p-3 text-center"
                      style={{ backgroundColor: s.color }}
                    >
                      <p className="font-cabinet font-800 text-black text-lg">{s.val}</p>
                      <p className="font-cabinet text-black/60 text-[10px] uppercase tracking-wide mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Book list mockup */}
                <div className="space-y-2">
                  {[
                    { title: 'Clean Code', author: 'Robert C. Martin', price: '₹699', badge: 'CS' },
                    { title: 'Atomic Habits', author: 'James Clear', price: '₹374', badge: 'Self-Help' },
                    { title: 'Zero to One', author: 'Peter Thiel', price: '₹360', badge: 'Business' },
                  ].map(b => (
                    <div key={b.title} className="flex items-center justify-between border-2 border-black p-3 bg-[#f4f4f5]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-[#b7c6c2] border border-black flex items-center justify-center text-[8px] font-cabinet font-700 text-black text-center leading-tight px-0.5">
                          {b.badge}
                        </div>
                        <div>
                          <p className="font-cabinet font-700 text-black text-xs">{b.title}</p>
                          <p className="font-cabinet text-black/50 text-[10px]">{b.author}</p>
                        </div>
                      </div>
                      <span className="font-cabinet font-800 text-black text-sm">{b.price}</span>
                    </div>
                  ))}
                </div>

                {/* Accent panel */}
                <div className="border-2 border-black p-3" style={{ backgroundColor: '#b7c6c2' }}>
                  <p className="font-cabinet font-700 text-black text-xs uppercase tracking-wide">📖 Book Match AI Active</p>
                  <p className="font-cabinet text-black/70 text-[11px] mt-1">Analysing your reading profile…</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </TubesBackground>
    </section>
  );
}
