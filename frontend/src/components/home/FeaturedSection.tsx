'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { RatingStars } from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { generateBookCoverSvg, VERIFIED_BOOK_COVERS } from '../../utils/bookCovers';

interface FeaturedSectionProps {
  books: Book[];
}

function discountedPrice(price: number, discount: number = 0) {
  return discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
}

// 4 Distinctive Editorial Color Palettes for the Deck
const CARD_THEMES = [
  {
    bg: '#FFFDF5',
    darkBg: '#1c1b18',
    accent: '#f59e0b',
    border: '#1c1917',
    badgeBg: '#1c1917',
    badgeText: '#ffe17c',
    highlight: '#d97706',
    pillBg: '#fef3c7',
    shadow: '14px 14px 0px #1c1917',
    tag: 'DESIGN & UI/UX · MASTERPIECE #01',
    coverTint: 'from-amber-400/20 to-transparent',
  },
  {
    bg: '#F0F9FF',
    darkBg: '#0f172a',
    accent: '#0284c7',
    border: '#0c4a6e',
    badgeBg: '#0369a1',
    badgeText: '#ffffff',
    highlight: '#0284c7',
    pillBg: '#e0f2fe',
    shadow: '14px 14px 0px #0c4a6e',
    tag: 'ANTHROPOLOGY & NATURE · MASTERPIECE #02',
    coverTint: 'from-sky-400/20 to-transparent',
  },
  {
    bg: '#FDF2F8',
    darkBg: '#2a1122',
    accent: '#db2777',
    border: '#831843',
    badgeBg: '#be185d',
    badgeText: '#ffffff',
    highlight: '#ec4899',
    pillBg: '#fce7f3',
    shadow: '14px 14px 0px #831843',
    tag: 'REGIONAL CLASSICS · MASTERPIECE #03',
    coverTint: 'from-pink-400/20 to-transparent',
  },
  {
    bg: '#F0FDF4',
    darkBg: '#0c221a',
    accent: '#059669',
    border: '#064e3b',
    badgeBg: '#047857',
    badgeText: '#ffffff',
    highlight: '#10b981',
    pillBg: '#d1fae5',
    shadow: '14px 14px 0px #064e3b',
    tag: 'VENTURE & PRODUCT · MASTERPIECE #04',
    coverTint: 'from-emerald-400/20 to-transparent',
  },
];

export function FeaturedSection({ books }: FeaturedSectionProps) {
  // Use first 4 featured editions
  const featured = books.slice(0, 4);
  const totalCards = featured.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update card transform and 3D stack positions with tactile deck physics
  const updateCardPositions = useCallback(
    (progress: number) => {
      if (totalCards <= 1) return;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
      }

      const currentActive = Math.min(
        totalCards - 1,
        Math.floor(progress * totalCards)
      );

      if (progressTextRef.current) {
        progressTextRef.current.innerText = `0${currentActive + 1} / 0${totalCards}`;
      }

      const numTransitions = totalCards - 1;

      featured.forEach((_, i) => {
        const cardEl = cardsRef.current[i];
        if (!cardEl) return;

        if (i === 0) {
          // Base card: scales down, drifts slightly up into the stacked fan
          const scale = Math.max(0.86, 1 - progress * 0.12);
          const translateY = -progress * 22;
          const opacity = Math.max(0.5, 1 - progress * 0.35);
          cardEl.style.transform = `perspective(1400px) translate3d(0, ${translateY}px, 0) scale(${scale})`;
          cardEl.style.opacity = `${opacity}`;
          cardEl.style.zIndex = '10';
        } else {
          const start = (i - 1) / numTransitions;
          const end = i / numTransitions;

          if (progress <= start) {
            // Waiting below the viewport with physical angle
            cardEl.style.transform = `perspective(1400px) translate3d(0, 120%, -60px) rotateX(12deg) rotateZ(-2deg) scale(0.96)`;
            cardEl.style.opacity = '0';
            cardEl.style.zIndex = `${10 + i * 5}`;
          } else if (progress >= end) {
            // Landed into the deck! Stacks with subtle elevation
            const postProgress = (progress - end) / (1 - end || 1);
            const scale = Math.max(0.88, 1 - postProgress * 0.1);
            const translateY = -postProgress * 18;
            const opacity = Math.max(0.65, 1 - postProgress * 0.25);
            cardEl.style.transform = `perspective(1400px) translate3d(0, ${translateY}px, 0) scale(${scale})`;
            cardEl.style.opacity = `${opacity}`;
            cardEl.style.zIndex = `${10 + i * 5}`;
          } else {
            // Actively sliding into the deck with dynamic 3D angle
            const rawT = (progress - start) / (end - start);
            // Silky smooth Hermite / Smoothstep easing for a luxurious physical card draw
            const t = rawT * rawT * (3 - 2 * rawT);
            const translateY = (1 - t) * 110;
            const rotateX = (1 - t) * 9;
            const rotateZ = (1 - t) * -2;
            const scale = 0.97 + t * 0.03;
            const translateZ = (1 - t) * -50;

            cardEl.style.transform = `perspective(1400px) translate3d(0, ${translateY}%, ${translateZ}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
            cardEl.style.opacity = `${Math.min(1, rawT * 2)}`;
            cardEl.style.zIndex = `${10 + i * 5}`;
          }
        }
      });
    },
    [totalCards, featured]
  );

  // Synchronize Page Scroll with Stacking Card Deck with Silky Lerp Smoothing
  useEffect(() => {
    if (!mounted || totalCards === 0) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let rafId: number;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScrollable = trackHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      targetProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
    };

    const renderLoop = () => {
      // Damped lerp for ultra-smooth inertia
      currentProgress += (targetProgress - currentProgress) * 0.09;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      updateCardPositions(currentProgress);

      const active = Math.min(totalCards - 1, Math.floor(currentProgress * totalCards));
      setActiveIdx(active);

      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    currentProgress = targetProgress;
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [mounted, totalCards, updateCardPositions]);

  // Jump to specific card in the stack
  const scrollToCard = (index: number) => {
    if (!trackRef.current) return;
    const trackTop = trackRef.current.offsetTop;
    const trackHeight = trackRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = trackHeight - viewportHeight;

    const targetProgress = totalCards > 1 ? index / (totalCards - 1) : 0;
    const targetScrollY = trackTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  return (
    <div
      ref={trackRef}
      id="featured"
      suppressHydrationWarning
      className="relative w-full border-b-2 border-black bg-[var(--bg-page)]"
      style={{
        // 460vh provides an unhurried, calm, and majestic stacking runway
        height: `${Math.max(380, totalCards * 115)}vh`,
      }}
    >
      {/* ── Sticky Fullscreen Viewport (Pins user to the deck stage) ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">

        {/* ── Section Header Bar ── */}
        <div className="relative z-30 border-b-2 border-black bg-[var(--bg-surface)] backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="w-3.5 h-3.5 bg-[#ffe17c] border-2 border-black shadow-[2px_2px_0px_#000]" />
              <div>
                <p className="font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)] font-bold">
                  EDITOR&apos;S CHOICE · 3D STACKING DECK
                </p>
                <h2 className="font-editorial-serif text-2xl sm:text-3xl text-[var(--text-main)] font-black leading-tight">
                  Featured Editions
                </h2>
              </div>
            </div>

            {/* Scroll Progress & Quick Catalog Link */}
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex items-center gap-3 bg-[var(--bg-surface-elevated)] border-2 border-black px-3.5 py-1.5 rounded-lg shadow-[2px_2px_0px_#000]">
                <span className="font-editorial-mono text-[10px] font-bold uppercase text-[var(--text-muted)]">
                  Deck Stack
                </span>
                <div className="w-24 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-[#f59e0b] transition-all duration-75"
                    style={{ width: '0%' }}
                  />
                </div>
                <span
                  ref={progressTextRef}
                  className="font-editorial-mono text-xs font-black text-[var(--text-main)] w-12 text-right"
                >
                  01 / 0{totalCards}
                </span>
              </div>

              <Link
                href="#catalog"
                className="flex items-center gap-2 font-editorial-mono text-xs font-bold uppercase tracking-wider text-black bg-[#ffe17c] border-2 border-black px-4 py-2 hover:bg-black hover:text-[#ffe17c] transition-all shadow-hard-4"
              >
                View Catalog <span className="text-base leading-none">↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Center Stage: Deck of 3D Stacking Cards ── */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-hidden">
          <div className="relative w-full max-w-5xl h-[560px] sm:h-[590px] flex items-center justify-center">
            {featured.map((book, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const verifiedCover = VERIFIED_BOOK_COVERS[book.id] || book.coverImage;
              const fallbackSvg = generateBookCoverSvg({
                title: book.title,
                author: book.author,
                category: book.category?.name || 'Edition',
              });
              const coverSrc = verifiedCover || fallbackSvg;
              const finalPrice = discountedPrice(book.price, book.discount);
              const savings = book.discount > 0 ? book.price - finalPrice : 0;
              const inFav = isInWishlist(book.id);
              const inComp = isInCompare(book.id);

              return (
                <div
                  key={'stack-card-' + book.id}
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  className="absolute inset-0 w-full h-full border-3 border-black rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300"
                  style={{
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    boxShadow: theme.shadow,
                    willChange: 'transform, opacity',
                    transform: idx === 0 ? 'perspective(1400px) translate3d(0, 0, 0)' : 'perspective(1400px) translate3d(0, 120%, -60px)',
                    zIndex: 10 + idx * 5,
                  }}
                >
                  {/* Left Column: Premium Book Cover Artwork with theme styling */}
                  <div
                    className="md:w-5/12 p-6 sm:p-8 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-3 relative overflow-hidden group"
                    style={{
                      borderColor: theme.border,
                      background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.pillBg} 100%)`,
                    }}
                  >
                    {/* Background Dot Texture */}
                    <div className="absolute inset-0 lumina-dot-bg opacity-30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-editorial-mono text-[10px] font-black uppercase px-2.5 py-1 border border-black shadow-[2px_2px_0px_#000]"
                          style={{
                            backgroundColor: theme.badgeBg,
                            color: theme.badgeText,
                          }}
                        >
                          {book.category?.name || 'Curated'}
                        </span>
                        {book.discount > 0 && (
                          <span className="font-editorial-mono text-[10px] font-black uppercase px-2.5 py-1 bg-[#ec4899] text-white border border-black shadow-[2px_2px_0px_#000]">
                            -{book.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Card Number Watermark */}
                      <span className="font-editorial-mono text-xs font-black" style={{ color: theme.border }}>
                        VOL. 0{idx + 1}
                      </span>
                    </div>

                    {/* Center Book Cover with 3D shadow lift */}
                    <div className="relative z-10 my-4 flex justify-center">
                      <div className="relative w-44 sm:w-52 aspect-[3/4] bg-black border-2 border-black shadow-[8px_8px_0px_#000] overflow-hidden group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500">
                        <img
                          src={coverSrc}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallbackSvg;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
                      </div>
                    </div>

                    {/* Bottom Metadata Mini-strip */}
                    <div className="relative z-10 flex items-center justify-between text-xs font-editorial-mono font-bold border-t border-black/15 pt-3 text-black/70">
                      <span>ISBN: 978-01{idx}44</span>
                      <span className="font-black text-black">
                        ★ {book.rating || 4.8} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Book Specifications, Summary & Action Deck */}
                  <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto bg-white/60 dark:bg-black/20">
                    <div>
                      {/* Sub-header */}
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="font-editorial-mono text-xs uppercase tracking-widest font-black" style={{ color: theme.highlight }}>
                          {theme.tag}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(book)}
                            aria-label="Save to Wishlist"
                            className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center transition-all cursor-pointer ${
                              inFav
                                ? 'bg-[#ec4899] text-white shadow-[2px_2px_0px_#000]'
                                : 'bg-white hover:bg-[#ffe17c] text-black shadow-[2px_2px_0px_#000]'
                            }`}
                          >
                            {inFav ? '♥' : '♡'}
                          </button>
                          <button
                            onClick={() => (inComp ? removeFromCompare(book.id) : addToCompare(book))}
                            aria-label="Compare Edition"
                            className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                              inComp
                                ? 'bg-[#3b82f6] text-white shadow-[2px_2px_0px_#000]'
                                : 'bg-white hover:bg-[#3b82f6] hover:text-white text-black shadow-[2px_2px_0px_#000]'
                            }`}
                          >
                            ⇄
                          </button>
                        </div>
                      </div>

                      {/* Main Title */}
                      <h3 className="font-editorial-serif font-black text-2xl sm:text-4xl text-black tracking-tight leading-tight mb-2">
                        {book.title}
                      </h3>

                      {/* Author & Rating */}
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="font-cabinet font-700 text-sm sm:text-base text-black/75">
                          by <strong className="text-black">{book.author}</strong>
                        </span>
                        <span className="text-black/30">·</span>
                        <div className="flex items-center gap-1.5">
                          <RatingStars rating={book.rating || 4.8} size="sm" />
                          <span className="font-editorial-mono text-xs text-black/60 font-bold">
                            ({book.numReviews || 420})
                          </span>
                        </div>
                      </div>

                      {/* Editorial Synopsis */}
                      <p className="font-cabinet text-sm sm:text-base text-black/80 leading-relaxed line-clamp-3 sm:line-clamp-4 mb-6 font-500">
                        {book.description ||
                          'A seminal work of uncompromising clarity and depth. Hand-selected for our permanent collection for its profound insights into craft, human behavior, and enduring systems.'}
                      </p>

                      {/* Spec Pills */}
                      <div
                        className="grid grid-cols-3 gap-3 p-3.5 border-2 border-black mb-6 rounded-lg"
                        style={{ backgroundColor: theme.pillBg }}
                      >
                        <div>
                          <p className="font-editorial-mono text-[9px] uppercase tracking-wider text-black/60 font-bold">
                            Format
                          </p>
                          <p className="font-cabinet font-800 text-xs sm:text-sm text-black">
                            Hardcover Archival
                          </p>
                        </div>
                        <div>
                          <p className="font-editorial-mono text-[9px] uppercase tracking-wider text-black/60 font-bold">
                            Stock Status
                          </p>
                          <p className="font-cabinet font-800 text-xs sm:text-sm text-[#059669]">
                            {book.stock || 24} Copies Left
                          </p>
                        </div>
                        <div>
                          <p className="font-editorial-mono text-[9px] uppercase tracking-wider text-black/60 font-bold">
                            Dispatch
                          </p>
                          <p className="font-cabinet font-800 text-xs sm:text-sm text-black">
                            24H Express
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Deck */}
                    <div className="border-t-2 border-black/15 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Pricing block */}
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-cabinet font-900 text-2xl sm:text-3xl text-black">
                            ₹{finalPrice}
                          </span>
                          {book.discount > 0 && (
                            <span className="font-cabinet text-base text-black/40 line-through">
                              ₹{book.price}
                            </span>
                          )}
                          {savings > 0 && (
                            <span
                              className="font-editorial-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]"
                              style={{ backgroundColor: theme.accent, color: '#000' }}
                            >
                              Save ₹{savings}
                            </span>
                          )}
                        </div>
                        <p className="font-editorial-mono text-[10px] text-black/60 mt-0.5">
                          Includes taxes & complimentary express shipping
                        </p>
                      </div>

                      {/* Primary Actions */}
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/books/${book.id}`}
                          className="font-cabinet font-800 text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-5 py-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-all text-center shadow-[3px_3px_0px_#000]"
                        >
                          Inspect →
                        </Link>
                        <button
                          onClick={() => addToCart(book, 1)}
                          className="font-cabinet font-800 text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-7 py-3 text-black border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center active:translate-x-1 active:translate-y-1 cursor-pointer"
                          style={{ backgroundColor: theme.accent }}
                        >
                          Add to Cart ⚡
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Deck Controls & Card Selector ── */}
        <div className="relative z-30 border-t-2 border-black bg-[var(--bg-surface)] py-3 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-editorial-mono text-[10px] font-bold uppercase text-[var(--text-faint)] mr-2 hidden sm:inline">
              Scroll down to slide deck or jump:
            </span>
            {featured.map((b, i) => (
              <button
                key={'deck-step-' + i}
                onClick={() => scrollToCard(i)}
                className={`font-editorial-mono text-xs font-bold px-3 py-1 border-2 border-black rounded transition-all cursor-pointer ${
                  activeIdx === i
                    ? 'bg-[#ffe17c] text-black shadow-[2px_2px_0px_#000] scale-105'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:bg-white'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-editorial-mono text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5 animate-bounce">
              <span>↓</span> Scroll to stack next card
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedSection;
