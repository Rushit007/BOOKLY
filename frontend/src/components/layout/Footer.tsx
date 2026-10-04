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
  { label: 'Book Match', href: '/book-match' },
  { label: 'Saved Editions', href: '/wishlist' },
  { label: 'Shopping Cart', href: '/cart' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Sign In', href: '/login' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const SOCIALS = [
  { label: 'TW', href: '#' },
  { label: 'IG', href: '#' },
  { label: 'GH', href: '#' },
  { label: 'LI', href: '#' },
];

export function Footer() {
  return (
    <footer className='border-t-2 border-black' style={{ backgroundColor: '#171e19' }}>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4' style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Brand column */}
          <div className='p-8' style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <div className='mb-6'>
              <Link href='/' className='group flex items-center gap-3'>
                <div
                  className='w-10 h-10 flex items-center justify-center border-2 transition-colors'
                  style={{ backgroundColor: '#272727', borderColor: 'rgba(255,255,255,0.15)' }}
                >
                  <span style={{ color: '#ffe17c', fontSize: '16px', fontWeight: 900 }}>⚡</span>
                </div>
                <span className='font-cabinet font-800 text-xl text-white'>BOOKLY</span>
              </Link>
            </div>
            <p className='font-cabinet text-sm leading-relaxed mb-6' style={{ color: '#b7c6c2', opacity: 0.6 }}>
              Curated editions for curious minds. A premium bookstore built on craft, care, and character.
            </p>
            {/* Social icon squares */}
            <div className='flex items-center gap-2'>
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className='w-10 h-10 flex items-center justify-center border font-cabinet font-700 text-xs transition-all duration-150'
                  style={{ backgroundColor: '#272727', borderColor: 'rgba(255,255,255,0.12)', color: '#b7c6c2' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = '#ffe17c';
                    el.style.color = '#000';
                    el.style.borderColor = '#ffe17c';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = '#272727';
                    el.style.color = '#b7c6c2';
                    el.style.borderColor = 'rgba(255,255,255,0.12)';
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div className='p-8' style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <p className='font-cabinet font-700 text-[9px] uppercase tracking-[0.22em] mb-5' style={{ color: 'rgba(255,255,255,0.3)' }}>
              Top Genres
            </p>
            <ul className='space-y-3'>
              {GENRES.map(g => (
                <li key={g.slug}>
                  <Link
                    href={`/?category=${g.slug}#catalog`}
                    className='font-cabinet text-sm transition-colors hover:text-[#ffe17c]'
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className='p-8' style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <p className='font-cabinet font-700 text-[9px] uppercase tracking-[0.22em] mb-5' style={{ color: 'rgba(255,255,255,0.3)' }}>
              Navigate
            </p>
            <ul className='space-y-3'>
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className='font-cabinet text-sm transition-colors hover:text-[#ffe17c]'
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project info */}
          <div className='p-8'>
            <p className='font-cabinet font-700 text-[9px] uppercase tracking-[0.22em] mb-5' style={{ color: 'rgba(255,255,255,0.3)' }}>
              Academic Project
            </p>
            <div className='space-y-2'>
              <p className='font-cabinet font-700 text-base text-white'>Gondaliya Rushit R.</p>
              <p className='font-cabinet text-[10px]' style={{ color: 'rgba(255,255,255,0.4)' }}>
                Enrollment: <span style={{ color: '#ffe17c' }}>240841102020</span>
              </p>
              <p className='font-cabinet text-[10px]' style={{ color: 'rgba(255,255,255,0.4)' }}>
                Final Year Capstone Project
              </p>
            </div>
            <div className='mt-6 pt-6' style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p className='font-cabinet font-700 text-[9px] uppercase tracking-[0.22em] mb-3' style={{ color: 'rgba(255,255,255,0.3)' }}>
                Legal
              </p>
              <div className='flex flex-wrap gap-x-3 gap-y-1.5'>
                {LEGAL_LINKS.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className='font-cabinet text-[9px] uppercase tracking-wider transition-colors hover:text-[#ffe17c]'
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3'>
          <p className='font-cabinet text-[9px] uppercase tracking-[0.18em]' style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2026 BOOKLY Bookstore · Designed & Built by Gondaliya Rushit R.
          </p>
          <div className='flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full animate-pulse' style={{ backgroundColor: '#b7c6c2' }} />
            <span className='font-cabinet text-[9px] uppercase tracking-wider' style={{ color: 'rgba(255,255,255,0.3)' }}>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
