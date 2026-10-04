'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { generateBookCoverSvg, VERIFIED_BOOK_COVERS } from '../../utils/bookCovers';
import { FlyingPosters, PosterItem, Canvas } from './FlyingPosters';
import { CreepyButton } from '../common/CreepyButton';

interface FlyingPostersGalleryProps {
  books: Book[];
}

function discountedPrice(price: number, discount: number) {
  return Math.round(price * (1 - discount / 100));
}

export function FlyingPostersGallery({ books }: FlyingPostersGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasInstanceRef = useRef<Canvas | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Map books into PosterItem format with verified covers and fallback SVGs (Memoized)
  const posterItems: PosterItem[] = useMemo(() => {
    return books.map((book) => {
      const verifiedUrl = VERIFIED_BOOK_COVERS[book.id] || book.coverImage;
      const fallbackSvg = generateBookCoverSvg({
        title: book.title,
        author: book.author,
        category: book.category?.name || 'Edition',
      });

      return {
        id: book.id,
        image: verifiedUrl || fallbackSvg,
        fallbackImage: fallbackSvg,
        title: book.title,
        author: book.author,
        price: book.price,
        category: book.category?.name || 'Curated',
      };
    });
  }, [books]);

  const activeBook = books[activeIdx % books.length] || books[0];
  const finalPrice = activeBook ? discountedPrice(activeBook.price, activeBook.discount || 0) : 0;

  // Callback from FlyingPosters when Canvas instance is ready
  const handleCanvasRef = useCallback((instance: Canvas | null) => {
    canvasInstanceRef.current = instance;
  }, []);

  // Synchronize Page Scroll with 3D Poster Flying Motion in BOTH scroll-down and scroll-up directions
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (!trackRef.current || !canvasInstanceRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Distance scrolled through this section (works both down and up!)
      const scrolled = -rect.top;
      const totalScrollable = trackHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Direct DOM update avoids React re-renders that would interrupt WebGL rendering
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
      }
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.height = `${Math.max(15, progress * 100)}%`;
      }

      // Total travel distance in 3D WebGL units
      const singlePosterHeight = canvasInstanceRef.current.medias?.[0]?.height || 10;
      const totalTravel = singlePosterHeight * posterItems.length;
      canvasInstanceRef.current.setScrollTarget(progress * totalTravel * 1.6);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Establish initial position immediately
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted, posterItems.length]);

  // Step controls
  const stepPoster = (direction: 'next' | 'prev') => {
    if (!canvasInstanceRef.current) return;
    const singlePosterHeight = canvasInstanceRef.current.medias?.[0]?.height || 10;
    const delta = direction === 'next' ? singlePosterHeight : -singlePosterHeight;
    canvasInstanceRef.current.scroll.target += delta;
  };

  return (
    <div
      ref={trackRef}
      id="flying-posters-showcase"
      className="relative w-full border-b-2 border-black"
      style={{
        height: '280vh',
        backgroundColor: '#121516',
      }}
    >
      {/* ── Sticky Fullscreen Viewport (Locks screen while scrolling through this section) ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Subtle Ambient Background Glows */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ backgroundColor: '#ffe17c' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full pointer-events-none opacity-15 blur-3xl"
          style={{ backgroundColor: '#38bdf8' }}
        />

        {/* ── Top HUD ── */}
        <div className="relative z-20 pt-6 sm:pt-8 px-6 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 mb-2 pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-[#ffe17c] animate-pulse" />
              <span className="font-editorial-mono font-bold text-xs text-[#ffe17c] uppercase tracking-widest">
                WebGL 3D Distortion Gallery
              </span>
            </div>
            <h2
              className="font-editorial-serif font-black text-white tracking-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', lineHeight: 1.1 }}
            >
              Curated Volumes in Flight.
            </h2>
            <p className="font-editorial-sans text-[#b7c6c2]/80 text-xs sm:text-sm mt-1 max-w-lg">
              Scroll down to fly through our editions. Watch the GPU warp and fold 3D planes dynamically as velocity changes.
            </p>
          </div>

          {/* Controls & Progress Badge */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-2 self-start sm:self-auto rounded-xl pointer-events-auto shadow-lg">
            <div className="font-editorial-mono text-xs font-bold text-white/70">
              <span className="text-[#ffe17c]">
                {String((activeIdx % posterItems.length) + 1).padStart(2, '0')}
              </span>
              <span className="text-white/40"> / {String(posterItems.length).padStart(2, '0')}</span>
            </div>

            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#ffe17c] transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>

            <div className="flex items-center gap-1 border-l border-white/15 pl-2">
              <button
                onClick={() => stepPoster('prev')}
                aria-label="Previous Poster"
                className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors text-xs"
              >
                ↑
              </button>
              <button
                onClick={() => stepPoster('next')}
                aria-label="Next Poster"
                className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors text-xs"
              >
                ↓
              </button>
            </div>
          </div>
        </div>

        {/* ── WebGL 3D Flying Posters Canvas ── */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {mounted && (
            <FlyingPosters
              items={posterItems}
              planeWidth={380}
              planeHeight={510}
              distortion={3.6}
              scrollEase={0.06}
              cameraFov={45}
              cameraZ={20}
              onActiveIndexChange={(idx) => setActiveIdx(idx)}
              canvasRefCallback={handleCanvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />
          )}
        </div>

        {/* ── Bottom HUD: Active Book Showcase + Replay / Action CTA ── */}
        <div className="relative z-20 pb-8 px-6 lg:px-12 flex flex-col sm:flex-row sm:items-end justify-between gap-5 pointer-events-none">
          {/* Active Book Card Preview */}
          {activeBook && (
            <div
              className="bg-black/80 backdrop-blur-md border-2 border-white/20 p-5 rounded-2xl max-w-md w-full pointer-events-auto transition-all duration-300 shadow-[6px_6px_0px_#ffe17c]"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-editorial-mono text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#ffe17c] text-black">
                  {activeBook.category?.name || 'FEATURED EDITION'}
                </span>
                <div className="flex items-center gap-1 text-[#ffbc2e] text-xs">
                  ★ ★ ★ ★ ★ <span className="text-white/60 text-[11px] ml-1">({activeBook.rating})</span>
                </div>
              </div>

              <h3 className="font-editorial-serif font-black text-xl sm:text-2xl text-white truncate">
                {activeBook.title}
              </h3>
              <p className="font-editorial-mono text-xs text-white/60 mt-0.5 mb-3">
                By {activeBook.author} · {activeBook.publisher || 'Archival Edition'}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial-serif text-2xl font-black text-white">
                    ₹{finalPrice}
                  </span>
                  {activeBook.discount > 0 && (
                    <span className="font-editorial-mono text-xs text-white/40 line-through">
                      ₹{activeBook.price}
                    </span>
                  )}
                </div>

                <Link href={`/books/${activeBook.id}`}>
                  <CreepyButton
                    primary="#ffe17c"
                    primaryHover="#ffd447"
                    eyeColor="#0c0c0c"
                    className="font-editorial-mono text-xs font-black uppercase text-black py-2.5 px-5 rounded-full"
                  >
                    View Edition ↗
                  </CreepyButton>
                </Link>
              </div>
            </div>
          )}

          {/* Scroll Down Prompt Indicator */}
          <div className="flex flex-col items-end gap-2 text-right pointer-events-auto">
            <span className="font-editorial-mono text-[11px] uppercase tracking-[0.25em] text-white/50 font-bold">
              Scroll to fly
            </span>
            <div className="w-1 h-12 bg-white/20 rounded-full relative overflow-hidden">
              <div
                ref={scrollIndicatorRef}
                className="w-full bg-[#ffe17c] rounded-full transition-all duration-75"
                style={{ height: '15%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlyingPostersGallery;
