'use client';

import React from 'react';

interface BooklyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function BooklyLogo({
  size = 'md',
  showText = true,
  className = '',
}: BooklyLogoProps) {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* ── Official Archival Bookstore Emblem ── */}
      <div className={`relative ${iconDimensions} rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-1 flex items-center justify-center shadow-md border border-amber-500/40 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300`}>
        {/* Subtle Ambient Foil Glow */}
        <div className="absolute inset-0 rounded-xl bg-amber-400/15 blur-[2px] pointer-events-none" />

        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-sm"
        >
          {/* Left Archival Book Folio */}
          <path
            d="M10 45C17 42 25 42 32 45V18C25 15 17 15 10 18V45Z"
            fill="url(#booklyPageLeft)"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Right Archival Book Folio */}
          <path
            d="M54 45C47 42 39 42 32 45V18C39 15 47 15 54 18V45Z"
            fill="url(#booklyPageRight)"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Left Page Embossed Lines */}
          <path d="M15 24C19 22 24 22 28 24" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M15 30C19 28 24 28 28 30" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M15 36C19 34 24 34 28 36" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />

          {/* Right Page Embossed Lines */}
          <path d="M49 24C45 22 40 22 36 24" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M49 30C45 28 40 28 36 30" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M49 36C45 34 40 34 36 36" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />

          {/* Spine Binding */}
          <path
            d="M32 17V46"
            stroke="#fed053"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Crimson Bookmark Ribbon */}
          <path
            d="M32 18V50L27.5 46.5L23 50V33"
            fill="#ef4444"
            stroke="#b91c1c"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Literary Golden Star / Spark Above Book */}
          <path
            d="M32 7L33.5 11.5L38 13L33.5 14.5L32 19L30.5 14.5L26 13L30.5 11.5L32 7Z"
            fill="#fed053"
            className="drop-shadow-[0_0_6px_rgba(254,208,83,0.8)]"
          />
          <circle cx="32" cy="13" r="1.2" fill="#ffffff" />

          {/* Bottom Stand Arch */}
          <path d="M20 48L32 51L44 48" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

          {/* Gradients */}
          <defs>
            <linearGradient id="booklyPageLeft" x1="10" y1="18" x2="32" y2="45" gradientUnits="userSpaceOnUse">
              <stop stopColor="#27272a" />
              <stop offset="1" stopColor="#18181b" />
            </linearGradient>
            <linearGradient id="booklyPageRight" x1="54" y1="18" x2="32" y2="45" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3f3f46" />
              <stop offset="1" stopColor="#18181b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Brand Name & Typography ── */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif tracking-tight font-black leading-none text-zinc-950 dark:text-zinc-50 ${textSize}`}>
            BOOKLY
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 font-bold mt-1">
            Curated Bookstore
          </span>
        </div>
      )}
    </div>
  );
}
