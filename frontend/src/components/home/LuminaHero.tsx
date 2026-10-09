'use client';
import React from 'react';
import Link from 'next/link';
import { CreepyButton } from '../common/CreepyButton';
import { TubesBackground } from './TubesBackground';

export function LuminaHero() {
  return (
    <section
      className="lumina-dot-bg border-b border-[var(--border-main)] relative bg-[var(--bg-surface-elevated)] transition-colors"
    >
      <TubesBackground enableClickInteraction={true}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left Column ── */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-full px-4 py-2 shadow-xs">
              <span className="font-pixel text-[8px] text-[var(--bg-accent-orange)]">[ ARCHIVE 2026 ]</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-accent-mint)] animate-pulse" />
              <span className="font-editorial-mono font-bold text-xs text-[var(--text-main)] uppercase tracking-wider">
                Curated Physical Editions & Book Match
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-editorial-serif font-black text-[var(--text-main)] leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.2rem)', lineHeight: 1.05 }}
            >
              Books that carry{' '}
              <span className="font-marker text-[var(--bg-accent-orange)] inline-block -rotate-1">
                weight
              </span>{' '}
              and soul.
            </h1>

            {/* Sub-line */}
            <p className="font-editorial-sans text-[var(--text-muted)] text-base sm:text-lg leading-relaxed max-w-lg">
              Curated for inquisitive minds. Foundational engineering craft, seminal non-fiction, and timeless literature printed to endure for generations.
            </p>

            {/* CTA group */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/books">
                <CreepyButton
                  primary="#18181b"
                  primaryHover="#27272a"
                  eyeColor="#fcd34d"
                  style={{ fontSize: '0.95rem', minWidth: '13em' }}
                >
                  Explore Collection ↗
                </CreepyButton>
              </Link>
              <Link href="/book-match">
                <CreepyButton
                  primary="#ffffff"
                  primaryHover="#f4f4f5"
                  eyeColor="#18181b"
                  style={{ fontSize: '0.95rem', minWidth: '13em', '--cb-black': '#18181b' } as React.CSSProperties}
                >
                  ✦ Personal Book Match
                </CreepyButton>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-5 text-[var(--text-muted)]">
              <span className="font-editorial-mono text-xs font-semibold flex items-center gap-1.5">
                <span className="text-[var(--bg-accent-mint)]">✓</span> 100% Genuine First Editions
              </span>
              <span className="font-editorial-mono text-xs font-semibold flex items-center gap-1.5">
                <span className="text-[var(--bg-accent-mint)]">✓</span> Archival Paper Craft
              </span>
              <span className="font-editorial-mono text-xs font-semibold flex items-center gap-1.5">
                <span className="text-[var(--bg-accent-mint)]">✓</span> Express Worldwide Dispatch
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
                    { label: 'Curated', val: '24+', color: 'var(--bg-accent-yellow)' },
                    { label: 'Rating', val: '4.9★', color: 'var(--bg-surface-elevated)' },
                    { label: 'Dispatch', val: '24H', color: 'var(--bg-surface-elevated)' },
                  ].map(s => (
                    <div
                      key={s.label}
                      className="border border-[var(--border-main)] p-2.5 text-center shadow-xs"
                      style={{ backgroundColor: s.color }}
                    >
                      <p className="font-editorial-serif font-black text-[var(--text-main)] text-base">{s.val}</p>
                      <p className="font-editorial-mono text-[var(--text-muted)] text-[9px] uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Book list mockup */}
                <div className="space-y-2">
                  {[
                    { title: 'Clean Code', author: 'Robert C. Martin', price: '₹699', badge: 'CS' },
                    { title: 'Atomic Habits', author: 'James Clear', price: '₹374', badge: 'MIND' },
                    { title: 'Zero to One', author: 'Peter Thiel', price: '₹360', badge: 'BIZ' },
                  ].map(b => (
                    <div key={b.title} className="flex items-center justify-between border border-[var(--border-main)] p-2.5 bg-[var(--bg-surface)] shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-9 bg-[var(--text-main)] text-[var(--bg-page)] border border-[var(--border-main)] flex items-center justify-center text-[7px] font-pixel text-center leading-tight">
                          {b.badge}
                        </div>
                        <div>
                          <p className="font-editorial-sans font-bold text-[var(--text-main)] text-xs">{b.title}</p>
                          <p className="font-editorial-mono text-[var(--text-faint)] text-[9px]">{b.author}</p>
                        </div>
                      </div>
                      <span className="font-editorial-mono font-bold text-[var(--text-main)] text-xs">{b.price}</span>
                    </div>
                  ))}
                </div>

                {/* Accent panel */}
                <div className="border border-[var(--border-main)] p-2.5 bg-[var(--bg-surface-elevated)] shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-pixel text-[8px] text-[var(--bg-accent-orange)]">✦</span>
                    <p className="font-editorial-mono font-bold text-[var(--text-main)] text-[11px] uppercase tracking-wider">Book Match Algorithm</p>
                  </div>
                  <p className="font-editorial-sans text-[var(--text-muted)] text-[11px] mt-0.5">Matching reader pace, mood, and depth…</p>
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
