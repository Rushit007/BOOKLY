'use client';
import React from 'react';
import Link from 'next/link';
import { CreepyButton } from '../common/CreepyButton';

export function FinalCTA() {
  return (
    <section
      className="border-b-2 border-black py-24 px-6 lg:px-8 text-center"
      style={{ backgroundColor: '#ffe17c' }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="font-cabinet font-700 text-xs uppercase tracking-[0.25em] text-black/40">
          Ready to begin?
        </p>
        <h2
          className="font-cabinet font-800 text-black"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.05 }}
        >
          Books that mean{' '}
          <span
            style={{
              WebkitTextStroke: '2.5px black',
              color: 'transparent',
            }}
          >
            something.
          </span>
        </h2>
        <p className="font-cabinet text-black/70 text-lg max-w-xl mx-auto" style={{ fontWeight: 500 }}>
          Join thousands of deliberate readers who trust BOOKLY for curated editions, genuine copies, and 24-hour dispatch.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/books">
            <CreepyButton
              primary="#1A1A1B"
              primaryHover="#333"
              eyeColor="#ffe17c"
              style={{ fontSize: '1rem', minWidth: '14em' }}
            >
              Explore Catalog ↗
            </CreepyButton>
          </Link>
          <Link href="/book-match">
            <CreepyButton
              primary="#ffffff"
              primaryHover="#f5f5f0"
              eyeColor="#1A1A1B"
              style={{ fontSize: '1rem', minWidth: '14em', '--cb-black': '#1A1A1B' } as React.CSSProperties}
            >
              ⚡ Try Book Match
            </CreepyButton>
          </Link>
        </div>
        <p className="font-cabinet text-black/50 text-xs">
          ✓ 7-day returns &nbsp;·&nbsp; ✓ Genuine editions &nbsp;·&nbsp; ✓ Free shipping over ₹500
        </p>
      </div>
    </section>
  );
}
