'use client';

import React from 'react';

export function TopTicker() {
  const items = [
    'INDEPENDENT BOOKSELLER',
    'CURATED EDITIONS',
    'LITERATURE WITH WEIGHT',
    'WORLDWIDE DISPATCH',
    'EXCELLENCE IN PRINT',
    '10,000+ VOLUMES',
    'STAMPED 2026',
    'READING WITH CHARACTER',
    'PRECISION CRAFT',
  ];

  return (
    <div className='w-full bg-[#0c0c0c] text-[#f7f5f0] border-b border-black py-2 overflow-hidden select-none z-50 relative'>
      <div className='animate-marquee whitespace-nowrap flex items-center gap-6 font-editorial-mono text-[11px] font-bold tracking-[0.2em] uppercase'>
        {/* Render twice for continuous loop */}
        {[...items, ...items, ...items].map((text, idx) => (
          <React.Fragment key={`ticker-${idx}`}>
            <span>{text}</span>
            <span className='text-[#fed053] font-black text-xs'>*</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
