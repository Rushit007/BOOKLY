'use client';

import React from 'react';
import Link from 'next/link';

const GENRES = [
  { label: 'Computer Science', slug: 'computer-science' },
  { label: 'Fiction & Literature', slug: 'fiction' },
  { label: 'Self-Help & Mindset', slug: 'self-help' },
  { label: 'Business & Finance', slug: 'business-finance' },
  { label: 'Science & Nature', slug: 'science-nature' },
];

const NAV_LINKS = [
  { label: 'Explore Catalog', href: '/#catalog' },
  { label: 'Book Match AI', href: '/book-match' },
  { label: 'Saved Editions', href: '/wishlist' },
  { label: 'Shopping Cart', href: '/cart' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Sign In', href: '/login' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
];

export function Footer() {
  return (
    <footer className='border-t border-[var(--border-main)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[var(--border-subtle)]'>

          {/* Brand column */}
          <div className='space-y-4'>
            <Link href='/' className='inline-flex items-center gap-2.5 group'>
              <div className='w-8 h-8 rounded-lg bg-[var(--text-main)] text-[var(--bg-page)] flex items-center justify-center font-editorial-serif font-bold text-base shadow-xs'>
                B
              </div>
              <div>
                <span className='font-editorial-serif text-xl font-bold text-[var(--text-main)] tracking-tight leading-none block'>
                  BOOKLY
                </span>
                <span className='font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--text-faint)] font-semibold block mt-0.5'>
                  Curated Editions
                </span>
              </div>
            </Link>
            <p className='font-sans text-xs leading-relaxed text-[var(--text-muted)] max-w-sm'>
              Curated physical editions for inquisitive minds. Built on archival craft, timeless ideas, and deliberate reading.
            </p>
          </div>

          {/* Genres */}
          <div>
            <p className='font-sans text-xs uppercase tracking-wider font-semibold text-[var(--text-main)] mb-4'>
              Collections
            </p>
            <ul className='space-y-2.5 font-sans text-xs'>
              {GENRES.map(g => (
                <li key={g.slug}>
                  <Link
                    href={`/?category=${g.slug}#catalog`}
                    className='text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors'
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className='font-sans text-xs uppercase tracking-wider font-semibold text-[var(--text-main)] mb-4'>
              Navigation
            </p>
            <ul className='space-y-2.5 font-sans text-xs'>
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className='text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors'
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project info */}
          <div className='space-y-3 font-sans text-xs'>
            <p className='uppercase tracking-wider font-semibold text-[var(--text-main)]'>
              Academic Capstone
            </p>
            <p className='font-medium text-[var(--text-main)]'>Gondaliya Rushit R.</p>
            <p className='text-[var(--text-faint)]'>Enrollment: 240841102020</p>
            <div className='pt-4 border-t border-[var(--border-subtle)] flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-[var(--text-faint)]'>
              {LEGAL_LINKS.map(l => (
                <Link key={l.href} href={l.href} className='hover:text-[var(--text-main)] transition-colors'>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[var(--text-faint)]'>
          <p>© 2026 BOOKLY Bookstore · All Rights Reserved</p>
          <div className='flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            <span>Archive Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
