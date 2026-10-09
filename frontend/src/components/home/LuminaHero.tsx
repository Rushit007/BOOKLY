'use client';
import React from 'react';
import Link from 'next/link';
import { TubesBackground } from './TubesBackground';

export function LuminaHero() {
  return (
    <section className="border-b border-[var(--border-main)] relative bg-[var(--bg-surface-elevated)] transition-colors">
      <TubesBackground enableClickInteraction={true}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* ── Left Column ── */}
            <div className="lg:col-span-7 space-y-8">
              {/* Refined Minimal Badge */}
              <div className="inline-flex items-center gap-2.5 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-full px-4 py-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-sans font-semibold text-xs text-[var(--text-main)] uppercase tracking-wider">
                  Archival Editions · Personal Book Match
                </span>
              </div>

              {/* Minimal Editorial Heading */}
              <h1
                className="font-editorial-serif font-bold text-[var(--text-main)] leading-[1.08] tracking-tight"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 4.8rem)' }}
              >
                Books that carry{' '}
                <span className="italic font-normal text-[var(--text-muted)]">
                  depth
                </span>{' '}
                and enduring substance.
              </h1>

              {/* Sub-line */}
              <p className="font-sans text-[var(--text-muted)] text-base sm:text-lg leading-relaxed max-w-xl">
                Curated for inquisitive minds. Foundational engineering craft, seminal non-fiction, and timeless literature printed on archival paper for deliberate readers.
              </p>

              {/* Minimal CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/books"
                  className="px-7 py-3.5 rounded-full bg-[var(--text-main)] text-[var(--bg-page)] font-sans text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
                >
                  <span>Explore Collection</span>
                  <span className="text-xs">↗</span>
                </Link>
                <Link
                  href="/book-match"
                  className="px-7 py-3.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] font-sans text-sm font-semibold hover:bg-[var(--bg-surface-elevated)] transition-colors shadow-xs flex items-center gap-2"
                >
                  <span>✦ Book Match Quiz</span>
                </Link>
              </div>

              {/* Minimal Trust Strip */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
                <span className="font-sans text-xs font-medium flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span> 100% Genuine First Editions
                </span>
                <span className="font-sans text-xs font-medium flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span> Archival Acid-Free Paper
                </span>
                <span className="font-sans text-xs font-medium flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span> Free Express Dispatch
                </span>
              </div>
            </div>

            {/* ── Right Column: Sleek Minimal Showcase ── */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-6 sm:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all">
                {/* Header tag */}
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
                  <div>
                    <span className="font-sans text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider block">
                      CURATOR&apos;S PICK
                    </span>
                    <h3 className="font-editorial-serif text-xl font-bold text-[var(--text-main)] mt-0.5">
                      Essential Classics
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    3 Volumes
                  </span>
                </div>

                {/* Minimal Book List */}
                <div className="space-y-3.5 my-6">
                  {[
                    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', cat: 'Systems', price: '₹1,499' },
                    { title: 'The Psychology of Money', author: 'Morgan Housel', cat: 'Finance', price: '₹399' },
                    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cat: 'Mindset', price: '₹499' },
                  ].map((item, idx) => (
                    <div
                      key={item.title}
                      className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/60 hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-faint)] font-mono text-xs flex items-center justify-center font-medium">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-sans font-semibold text-xs sm:text-sm text-[var(--text-main)] line-clamp-1">
                            {item.title}
                          </p>
                          <p className="font-sans text-[11px] text-[var(--text-muted)]">
                            {item.author} · <span className="text-[var(--text-faint)]">{item.cat}</span>
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[var(--text-main)] whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Minimal Footer CTA */}
                <Link
                  href="/books"
                  className="w-full block py-3 rounded-xl text-center font-sans text-xs font-semibold uppercase tracking-wider bg-[var(--bg-surface-elevated)] hover:bg-[var(--text-main)] text-[var(--text-main)] hover:text-[var(--bg-page)] border border-[var(--border-main)] transition-colors"
                >
                  View Full Library Archive →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </TubesBackground>
    </section>
  );
}
