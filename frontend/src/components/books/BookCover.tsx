'use client';

import React, { useState } from 'react';

interface BookCoverProps {
  src?: string | null;
  title: string;
  author: string;
  category?: string;
  isbn?: string;
  className?: string;
  aspect?: string;
  showBadge?: string;
}

// Category palette mapping for bespoke editorial cloth jackets
const CATEGORY_PALETTES: Record<string, { bg: string; accent: string; text: string; sub: string }> = {
  'Computer Science': { bg: '#18181b', accent: '#fed053', text: '#ffffff', sub: '#a1a1aa' },
  'Fiction': { bg: '#2b2620', accent: '#e83d84', text: '#fbfaf8', sub: '#dcd7ca' },
  'Self-Help': { bg: '#1c2e24', accent: '#10b981', text: '#f0fdf4', sub: '#86efac' },
  'Business & Finance': { bg: '#172554', accent: '#60a5fa', text: '#eff6ff', sub: '#93c5fd' },
  'Science & Nature': { bg: '#2e1065', accent: '#c084fc', text: '#faf5ff', sub: '#d8b4fe' },
  'Design & UI/UX': { bg: '#451a03', accent: '#fbbf24', text: '#fffbeb', sub: '#fde68a' },
  'default': { bg: '#1c1917', accent: '#fed053', text: '#fafaf9', sub: '#a8a29e' },
};

export function BookCover({
  src,
  title,
  author,
  category = 'Curated Edition',
  isbn,
  className = '',
  aspect = 'aspect-[3/4]',
  showBadge,
}: BookCoverProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If provided an external URL that fails, or if no URL was provided:
  const palette = CATEGORY_PALETTES[category] || CATEGORY_PALETTES['default'];

  // Alternative reliable image fallback if original fails
  const cleanIsbn = isbn ? isbn.replace(/[^0-9X]/gi, '') : '';
  const openLibraryUrl = cleanIsbn ? `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg?default=false` : null;

  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden border-2 border-[var(--border-main)] select-none shadow-[2px_2px_0px_var(--border-main)] transition-all ${className}`}
      style={{ backgroundColor: palette.bg }}
    >
      {/* Real Image Layer */}
      {src && !imageError && (
        <img
          src={src}
          alt={title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            // If primary image fails, mark error so the editorial jacket renders cleanly
            setImageError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Editorial Bespoke Book Jacket (Shown when image is missing or errors) */}
      {(imageError || !src) && (
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between text-left"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          {/* Subtle Cloth / Book Texture & Spine Highlight */}
          <div className="absolute inset-y-0 left-0 w-3 bg-black/25 border-r border-white/10" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

          {/* Top Header / Category Pill */}
          <div className="relative z-10 pl-2">
            <span
              className="inline-block px-2 py-0.5 text-[8px] font-editorial-mono font-bold tracking-widest uppercase border"
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderColor: palette.accent,
                color: palette.accent,
              }}
            >
              {category}
            </span>
          </div>

          {/* Center Book Title & Geometric Accent */}
          <div className="relative z-10 pl-2 py-2 my-auto">
            <div
              className="w-6 h-1 mb-2 rounded-full"
              style={{ backgroundColor: palette.accent }}
            />
            <h4
              className="font-editorial-serif font-black text-sm sm:text-base leading-tight line-clamp-3"
              style={{ color: palette.text }}
            >
              {title}
            </h4>
            <p
              className="font-editorial-mono text-[9px] uppercase tracking-wider mt-1.5 line-clamp-1"
              style={{ color: palette.sub }}
            >
              BY {author}
            </p>
          </div>

          {/* Bottom Bar: Bookly Press & Bookmark ribbon */}
          <div className="relative z-10 pl-2 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="font-editorial-mono text-[7px] uppercase tracking-widest opacity-70">
              BOOKLY EDITIONS
            </span>
            <div
              className="w-3 h-4 border border-black/40 shadow-xs"
              style={{ backgroundColor: palette.accent }}
            />
          </div>
        </div>
      )}

      {/* Optional Badge */}
      {showBadge && (
        <div className="absolute top-0 right-0 z-20">
          <span className="badge-pill-yellow px-2 py-0.5 text-[9px] font-bold font-editorial-mono uppercase tracking-wider border-b-2 border-l-2 border-[var(--border-main)]">
            {showBadge}
          </span>
        </div>
      )}
    </div>
  );
}
