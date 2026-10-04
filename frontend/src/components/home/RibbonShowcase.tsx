'use client';

/**
 * RibbonShowcase Component
 * Displays the Ribbons component in a premium, minimalist framing.
 * Adheres to the 'Minimalist Showcase' style guide from the prompt:
 * - Off-white background
 * - Ample whitespace
 * - Floating soft-shadow container
 * - Monochrome palette with a single brand accent
 * - Replay / Reset action button
 */

import React, { useState } from 'react';
import { Ribbons } from '../common/Ribbons';

export function RibbonShowcase() {
  const [isHovered, setIsHovered] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <section className="py-20 px-6 sm:px-12 bg-[#F9F9F9] dark:bg-[#0c0c0e] border-y-2 border-black flex items-center justify-center select-none overflow-hidden">
      <div
        className="relative w-full max-w-4xl aspect-[16/9] sm:aspect-[2/1] bg-white dark:bg-[#18181b] rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.08)] overflow-hidden border-2 border-black/10 dark:border-white/10 transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ── WebGL Fluid Ribbons Canvas (scoped to container) ── */}
        <div className="absolute inset-0 z-0">
          <Ribbons
            key={key}
            baseThickness={40}
            colors={['#1A1A1B', '#ffe17c']}
            speedMultiplier={0.5}
            maxAge={600}
            enableFade={true}
            enableShaderEffect={true}
            effectAmplitude={1.5}
            backgroundColor={[0, 0, 0, 0]}
            isGlobal={false}
          />
        </div>

        {/* ── Content Overlay ── */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-8 sm:p-12 text-center">
          <span className="font-editorial-mono text-xs uppercase tracking-[0.25em] text-[#888888] mb-2 font-bold">
            Interactive WebGL Motion
          </span>
          <h2 className="text-3xl sm:text-5xl font-editorial-serif font-black tracking-tight text-[#1A1A1B] dark:text-white mb-2">
            Fluid Motion
          </h2>
          <p className="text-[#888888] font-editorial-sans text-sm sm:text-base font-normal max-w-sm">
            Move your cursor across this card to steer the spring-tensioned WebGL ribbons.
          </p>
        </div>

        {/* ── Replay / Reset Button (Required by prompt) ── */}
        <div
          className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={() => setKey(prev => prev + 1)}
            className="px-6 py-3 bg-[#1A1A1B] hover:bg-black text-[#ffe17c] rounded-full text-xs font-editorial-mono font-bold tracking-wider uppercase shadow-xl transition-all border border-[#ffe17c]/30 flex items-center gap-2 group cursor-pointer"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-[-180deg] transition-transform duration-500"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Replay Motion
          </button>
        </div>

        {/* ── Interactive Highlight Underline ── */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-black dark:bg-[#ffe17c] w-full transition-transform duration-500 origin-left"
          style={{ transform: isHovered ? 'scaleX(1)' : 'scaleX(0)' }}
        />
      </div>
    </section>
  );
}

export default RibbonShowcase;
