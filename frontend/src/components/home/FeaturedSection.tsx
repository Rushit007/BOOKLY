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

// 4 Refined Minimal Color Palettes for the Deck
const CARD_THEMES = [
  {
    bg: '#ffffff',
    darkBg: '#121215',
    accent: '#d97706',
    border: 'var(--border-main)',
    badgeBg: 'var(--bg-surface-elevated)',
    badgeText: 'var(--text-main)',
    highlight: '#d97706',
    pillBg: '#fef3c7',
    shadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
    tag: 'DESIGN & CRAFT · CURATED #01',
    coverTint: 'from-amber-400/10 to-transparent',
  },
  {
    bg: '#ffffff',
    darkBg: '#121215',
    accent: '#2563eb',
    border: 'var(--border-main)',
    badgeBg: 'var(--bg-surface-elevated)',
    badgeText: 'var(--text-main)',
    highlight: '#2563eb',
    pillBg: '#dbeafe',
    shadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
    tag: 'SCIENCE & HISTORY · CURATED #02',
    coverTint: 'from-blue-400/10 to-transparent',
  },
  {
    bg: '#ffffff',
    darkBg: '#121215',
    accent: '#db2777',
    border: 'var(--border-main)',
    badgeBg: 'var(--bg-surface-elevated)',
    badgeText: 'var(--text-main)',
    highlight: '#db2777',
    pillBg: '#fce7f3',
    shadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
    tag: 'LITERATURE · CURATED #03',
    coverTint: 'from-pink-400/10 to-transparent',
  },
  {
    bg: '#ffffff',
    darkBg: '#121215',
    accent: '#059669',
    border: 'var(--border-main)',
    badgeBg: 'var(--bg-surface-elevated)',
    badgeText: 'var(--text-main)',
    highlight: '#059669',
    pillBg: '#d1fae5',
    shadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
    tag: 'VENTURE & STRATEGY · CURATED #04',
    coverTint: 'from-emerald-400/10 to-transparent',
  },
  {
    bg: '#ffffff',
    darkBg: '#121215',
    accent: '#8b5cf6',
    border: 'var(--border-main)',
    badgeBg: 'var(--bg-surface-elevated)',
    badgeText: 'var(--text-main)',
    highlight: '#8b5cf6',
    pillBg: '#ede9fe',
    shadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
    tag: 'PHILOSOPHY & MIND · CURATED #05',
    coverTint: 'from-purple-400/10 to-transparent',
  },
  {
    bg: '#ffffff',
    darkBg: '#121215',
    accent: '#ea580c',
    border: 'var(--border-main)',
    badgeBg: 'var(--bg-surface-elevated)',
    badgeText: 'var(--text-main)',
    highlight: '#ea580c',
    pillBg: '#ffedd5',
    shadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
    tag: 'HERITAGE & REALISM · CURATED #06',
    coverTint: 'from-orange-400/10 to-transparent',
  },
  {
    bg: '#ffffff',
    darkBg: '#121215',
    accent: '#0891b2',
    border: 'var(--border-main)',
    badgeBg: 'var(--bg-surface-elevated)',
    badgeText: 'var(--text-main)',
    highlight: '#0891b2',
    pillBg: '#cffafe',
    shadow: '0 20px 40px -15px rgba(0,0,0,0.08)',
    tag: 'DATA SYSTEMS & SCALING · CURATED #07',
    coverTint: 'from-cyan-400/10 to-transparent',
  },
];

export function FeaturedSection({ books }: FeaturedSectionProps) {
  // 7 Fresh New Arrivals
  const featured = books && books.length >= 7 ? books.slice(0, 7) : books;
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
            cardEl.style.transform = `perspective(1400px) translate3d(0, 115%, -60px) rotateX(10deg) scale(0.96)`;
            cardEl.style.opacity = '0';
            cardEl.style.zIndex = `${10 + i * 5}`;
          } else if (progress >= end) {
            const postProgress = (progress - end) / (1 - end || 1);
            const scale = Math.max(0.88, 1 - postProgress * 0.1);
            const translateY = -postProgress * 18;
            const opacity = Math.max(0.65, 1 - postProgress * 0.25);
            cardEl.style.transform = `perspective(1400px) translate3d(0, ${translateY}px, 0) scale(${scale})`;
            cardEl.style.opacity = `${opacity}`;
            cardEl.style.zIndex = `${10 + i * 5}`;
          } else {
            const rawT = (progress - start) / (end - start);
            const t = rawT * rawT * (3 - 2 * rawT);
            const translateY = (1 - t) * 105;
            const rotateX = (1 - t) * 8;
            const rotateZ = (1 - t) * -1.5;
            const scale = 0.97 + t * 0.03;
            const translateZ = (1 - t) * -45;

            cardEl.style.transform = `perspective(1400px) translate3d(0, ${translateY}%, ${translateZ}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
            cardEl.style.opacity = `${Math.min(1, rawT * 2.2)}`;
            cardEl.style.zIndex = `${10 + i * 5}`;
          }
        }
      });
    },
    [totalCards, featured]
  );

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
      const diff = targetProgress - currentProgress;
      currentProgress += diff * 0.085;
      if (Math.abs(diff) < 0.0002) {
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
      className="relative w-full border-b border-[var(--border-main)] bg-[var(--bg-page)]"
      style={{
        height: `${Math.max(380, totalCards * 115)}vh`,
      }}
    >
      {/* ── Sticky Fullscreen Viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">

        {/* ── Section Header Bar ── */}
        <div className="relative z-30 border-b border-[var(--border-main)] bg-[var(--bg-surface)] backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] font-semibold">
                  CURATED SELECTION · 3D SLIDING DECK
                </p>
                <h2 className="font-editorial-serif text-2xl sm:text-3xl text-[var(--text-main)] font-bold leading-tight">
                  Featured Editions
                </h2>
              </div>
            </div>

            {/* Scroll Progress, Step Buttons & Quick Catalog Link */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollToCard(Math.max(0, activeIdx - 1))}
                  disabled={activeIdx === 0}
                  aria-label="Previous Featured Card"
                  className="w-7 h-7 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] text-xs font-mono font-bold text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-page)] disabled:opacity-30 transition flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  ↑
                </button>
                <button
                  onClick={() => scrollToCard(Math.min(totalCards - 1, activeIdx + 1))}
                  disabled={activeIdx === totalCards - 1}
                  aria-label="Next Featured Card"
                  className="w-7 h-7 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] text-xs font-mono font-bold text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-page)] disabled:opacity-30 transition flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  ↓
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-3 bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] px-3.5 py-1.5 rounded-full">
                <span className="font-sans text-[10px] font-semibold uppercase text-[var(--text-muted)]">
                  Deck Stack
                </span>
                <div className="w-24 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-amber-500 transition-all duration-75"
                    style={{ width: '0%' }}
                  />
                </div>
                <span
                  ref={progressTextRef}
                  className="font-mono text-xs font-semibold text-[var(--text-main)] w-12 text-right"
                >
                  01 / 0{totalCards}
                </span>
              </div>

              <Link
                href="/books"
                className="font-sans text-xs font-semibold uppercase tracking-wider px-4 py-2 border border-[var(--border-main)] rounded-full hover:bg-[var(--bg-surface-elevated)] text-[var(--text-main)] transition-colors"
              >
                Browse All →
              </Link>
            </div>
          </div>
        </div>

        {/* ── 3D Tactile Stacking Cards Stage ── */}
        <div className="relative flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-[520px] sm:h-[540px]">
            {featured.map((book, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const realPhoto = {
                'book-1': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
                'book-2': 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
                'book-3': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
                'book-4': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
                'book-5': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop',
                'book-6': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop',
                'book-7': 'https://images.unsplash.com/photo-1507842229453-7801335c02b5?q=80&w=800&auto=format&fit=crop',
              }[book.id];
              const fallbackSvg = generateBookCoverSvg({
                title: book.title,
                author: book.author,
                category: book.category?.name || 'Edition',
              });
              const coverSrc = realPhoto || VERIFIED_BOOK_COVERS[book.id] || book.coverImage || fallbackSvg;
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
                  className="absolute inset-0 w-full h-full border border-[var(--border-main)] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    willChange: 'transform, opacity',
                    transform: idx === 0 ? 'perspective(1400px) translate3d(0, 0, 0)' : 'perspective(1400px) translate3d(0, 115%, -60px)',
                    zIndex: 10 + idx * 5,
                  }}
                >
                  {/* Left Column: Real Photographic Book Cover Artwork */}
                  <div
                    className="md:w-5/12 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[var(--border-main)] relative overflow-hidden group bg-[var(--bg-surface-elevated)]"
                  >
                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)]">
                          {book.category?.name || 'Curated'}
                        </span>
                        {book.discount > 0 && (
                          <span className="font-sans text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono">
                            -{book.discount}% OFF
                          </span>
                        )}
                      </div>

                      <span className="font-mono text-xs font-semibold text-[var(--text-faint)]">
                        VOL. 0{idx + 1}
                      </span>
                    </div>

                    {/* Center Book Cover with soft shadow lift & real photo fallback check */}
                    <div className="relative z-10 my-4 flex justify-center">
                      <div className="relative w-40 sm:w-48 aspect-[3/4] rounded-lg shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <img
                          src={coverSrc}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onLoad={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            if (img.naturalWidth <= 2 || img.naturalHeight <= 2) {
                              img.src = realPhoto || fallbackSvg;
                            }
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = realPhoto || fallbackSvg;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
                      </div>
                    </div>

                    {/* Bottom Metadata Mini-strip */}
                    <div className="relative z-10 flex items-center justify-between text-xs font-mono border-t border-[var(--border-subtle)] pt-3 text-[var(--text-muted)]">
                      <span>ISBN: 978-01{idx}44</span>
                      <span className="font-bold text-[var(--text-main)]">
                        ★ {book.rating || 4.8} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Book Specifications & Actions */}
                  <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[var(--bg-surface)]">
                    <div>
                      {/* Sub-header */}
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="font-sans text-xs uppercase tracking-wider font-semibold text-[var(--text-faint)]">
                          {theme.tag}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(book)}
                            aria-label="Save to Wishlist"
                            className={`w-8 h-8 rounded-full border border-[var(--border-main)] flex items-center justify-center transition-all cursor-pointer ${
                              inFav
                                ? 'bg-rose-500 text-white'
                                : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-main)] text-[var(--text-main)]'
                            }`}
                          >
                            {inFav ? '♥' : '♡'}
                          </button>
                          <button
                            onClick={() => (inComp ? removeFromCompare(book.id) : addToCompare(book))}
                            aria-label="Compare Edition"
                            className={`w-8 h-8 rounded-full border border-[var(--border-main)] flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                              inComp
                                ? 'bg-blue-600 text-white'
                                : 'bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-main)] text-[var(--text-main)]'
                            }`}
                          >
                            ⇄
                          </button>
                        </div>
                      </div>

                      {/* Main Title */}
                      <h3 className="font-editorial-serif font-bold text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight leading-tight mb-1.5">
                        {book.title}
                      </h3>

                      {/* Author & Rating */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="font-sans text-sm text-[var(--text-muted)]">
                          by <strong className="text-[var(--text-main)]">{book.author}</strong>
                        </span>
                        <span className="text-[var(--text-faint)]">·</span>
                        <div className="flex items-center gap-1.5">
                          <RatingStars rating={book.rating || 4.8} size="sm" />
                          <span className="font-mono text-xs text-[var(--text-faint)]">
                            ({book.numReviews || 420})
                          </span>
                        </div>
                      </div>

                      {/* Editorial Synopsis */}
                      <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3 sm:line-clamp-4 mb-5">
                        {book.description ||
                          'A seminal work of uncompromising clarity and depth. Hand-selected for our permanent collection for its profound insights into craft, human behavior, and enduring systems.'}
                      </p>

                      {/* Spec Pills */}
                      <div className="grid grid-cols-3 gap-3 p-3 bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] mb-5 rounded-xl">
                        <div>
                          <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--text-faint)] font-semibold">
                            Format
                          </p>
                          <p className="font-sans font-semibold text-xs sm:text-sm text-[var(--text-main)]">
                            Hardcover Archival
                          </p>
                        </div>
                        <div>
                          <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--text-faint)] font-semibold">
                            Availability
                          </p>
                          <p className="font-sans font-semibold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                            {book.stock || 24} In Stock
                          </p>
                        </div>
                        <div>
                          <p className="font-sans text-[10px] uppercase tracking-wider text-[var(--text-faint)] font-semibold">
                            Dispatch
                          </p>
                          <p className="font-sans font-semibold text-xs sm:text-sm text-[var(--text-main)]">
                            24H Express
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Deck */}
                    <div className="border-t border-[var(--border-subtle)] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Pricing block */}
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif font-bold text-2xl sm:text-3xl text-[var(--text-main)]">
                            ₹{finalPrice}
                          </span>
                          {book.discount > 0 && (
                            <span className="font-mono text-sm text-[var(--text-faint)] line-through">
                              ₹{book.price}
                            </span>
                          )}
                          {savings > 0 && (
                            <span className="font-sans text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              Save ₹{savings}
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-[11px] text-[var(--text-faint)] mt-0.5">
                          Taxes included · Free express shipping
                        </p>
                      </div>

                      {/* Primary Actions */}
                      <div className="flex items-center gap-2.5">
                        <Link
                          href={`/books/${book.id}`}
                          className="font-sans font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full border border-[var(--border-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors text-center text-[var(--text-main)]"
                        >
                          Inspect →
                        </Link>
                        <button
                          onClick={() => addToCart(book, 1)}
                          className="font-sans font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full bg-[var(--text-main)] text-[var(--bg-page)] hover:opacity-90 transition-opacity text-center cursor-pointer shadow-sm"
                        >
                          Add to Cart
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
        <div className="relative z-30 border-t border-[var(--border-main)] bg-[var(--bg-surface)] py-3 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-semibold uppercase text-[var(--text-faint)] mr-2 hidden sm:inline">
              Scroll down to slide or select:
            </span>
            {featured.map((b, i) => (
              <button
                key={'deck-step-' + i}
                onClick={() => scrollToCard(i)}
                className={`font-sans text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  activeIdx === i
                    ? 'bg-[var(--text-main)] text-[var(--bg-page)] border-[var(--text-main)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-main)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-sans text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 animate-bounce">
              <span>↓</span> Scroll to stack next card
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedSection;
