'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { generateBookCoverSvg, VERIFIED_BOOK_COVERS } from '../../utils/bookCovers';

interface IndianLanguageSectionProps {
  hindiBooks: Book[];
  gujaratiBooks: Book[];
}

function discountedPrice(price: number, discount: number = 0) {
  return discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
}

export function IndianLanguageSection({ hindiBooks, gujaratiBooks }: IndianLanguageSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'hindi' | 'gujarati'>('all');
  const [mounted, setMounted] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressPercentRef = useRef<HTMLSpanElement>(null);
  const currentCardCountRef = useRef<HTMLSpanElement>(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const allBooks = React.useMemo(() => {
    return [...hindiBooks, ...gujaratiBooks];
  }, [hindiBooks, gujaratiBooks]);

  const displayedBooks = activeTab === 'all'
    ? allBooks
    : activeTab === 'hindi'
    ? hindiBooks
    : gujaratiBooks;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateHorizontalPosition = useCallback(
    (progress: number, velocity: number = 0) => {
      if (!galleryRef.current) return;
      const galleryEl = galleryRef.current;
      const scrollWidth = galleryEl.scrollWidth;
      const clientWidth = window.innerWidth;
      const maxScroll = Math.max(0, scrollWidth - clientWidth + 80);

      const translateX = -progress * maxScroll;
      const skewX = Math.max(-2, Math.min(2, velocity * 0.06));
      galleryEl.style.transform = `translate3d(${translateX}px, 0, 0) skewX(${skewX}deg)`;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
      }
      if (progressPercentRef.current) {
        progressPercentRef.current.innerText = `${Math.round(progress * 100)}%`;
      }

      if (currentCardCountRef.current && displayedBooks.length > 0) {
        const currentBookIdx = Math.min(
          displayedBooks.length,
          Math.floor(progress * displayedBooks.length) + 1
        );
        currentCardCountRef.current.innerText = `${String(currentBookIdx).padStart(2, '0')} / ${String(displayedBooks.length).padStart(2, '0')}`;
      }

      const cards = galleryEl.querySelectorAll<HTMLElement>('.horiz-book-card');
      const centerX = clientWidth / 2;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const normDist = (cardCenter - centerX) / (clientWidth / 2);
        const clampedDist = Math.max(-1.1, Math.min(1.1, normDist));

        const rotateY = clampedDist * 9;
        const scale = Math.max(0.95, 1.02 - Math.abs(clampedDist) * 0.07);
        const translateZ = (1 - Math.min(1, Math.abs(clampedDist))) * 20;

        card.style.transform = `perspective(1100px) translate3d(0, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      });
    },
    [displayedBooks.length]
  );

  useEffect(() => {
    if (!mounted) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let lastProgress = 0;
    let currentVelocity = 0;
    let rafId: number;
    let timeoutId: NodeJS.Timeout;

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
      currentProgress += (targetProgress - currentProgress) * 0.08;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      currentVelocity = (currentProgress - lastProgress) * 60;
      lastProgress = currentProgress;

      updateHorizontalPosition(currentProgress, currentVelocity);
      rafId = requestAnimationFrame(renderLoop);
    };

    timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      currentProgress = targetProgress;
      rafId = requestAnimationFrame(renderLoop);
    }, 60);

    const onResize = () => handleScroll();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [mounted, updateHorizontalPosition, displayedBooks.length]);

  return (
    <div
      ref={trackRef}
      id="indian-literature"
      suppressHydrationWarning
      className="relative w-full border-b border-[var(--border-main)] bg-[var(--bg-page)]"
      style={{
        height: '520vh',
      }}
    >
      {/* ── Sticky Fullscreen Viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">

        {/* ── Header Bar ── */}
        <div className="relative z-30 pt-6 px-6 lg:px-12 border-b border-[var(--border-main)] bg-[var(--bg-surface)] backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-2">
                <span className="text-sm">🇮🇳</span>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Regional Literature · Panoramic Showcase
                </span>
              </div>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-main)] tracking-tight leading-tight">
                Hindi & Gujarati Classics
              </h2>
              <p className="font-sans text-sm sm:text-base text-[var(--text-muted)] mt-1.5 max-w-xl">
                Scroll to explore {allBooks.length} regional masterpieces — from Munshi Premchand and Harivansh Rai Bachchan to K.M. Munshi and Umashankar Joshi.
              </p>
            </div>

            {/* Filter Tabs & Scroll Progress */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex p-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] rounded-full gap-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 font-sans text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[var(--text-main)] text-[var(--bg-page)] shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  All ({allBooks.length})
                </button>
                <button
                  onClick={() => setActiveTab('hindi')}
                  className={`px-3.5 py-1.5 font-sans text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    activeTab === 'hindi'
                      ? 'bg-[var(--text-main)] text-[var(--bg-page)] shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Hindi ({hindiBooks.length})
                </button>
                <button
                  onClick={() => setActiveTab('gujarati')}
                  className={`px-3.5 py-1.5 font-sans text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    activeTab === 'gujarati'
                      ? 'bg-[var(--text-main)] text-[var(--bg-page)] shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Gujarati ({gujaratiBooks.length})
                </button>
              </div>

              {/* Progress meter */}
              <div className="flex items-center gap-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] px-3.5 py-1.5 rounded-full">
                <span className="font-sans text-[11px] font-semibold text-[var(--text-faint)]">
                  Progress
                </span>
                <div className="w-16 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-orange-500 transition-all duration-75"
                    style={{ width: '0%' }}
                  />
                </div>
                <span
                  ref={progressPercentRef}
                  className="font-mono text-xs font-semibold text-orange-600 dark:text-orange-400 w-8 text-right"
                >
                  0%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Horizontal Sliding Gallery Track ── */}
        <div className="relative z-20 flex-1 flex items-center overflow-hidden py-4 sm:py-6">
          <div
            ref={galleryRef}
            className="flex items-center gap-6 sm:gap-8 px-6 sm:px-16 transition-transform ease-out will-change-transform"
            style={{
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {displayedBooks.map((book, idx) => {
              const isHindi = book.categoryId === 'cat-7';
              const verifiedCover = VERIFIED_BOOK_COVERS[book.id] || book.coverImage;
              const fallbackSvg = generateBookCoverSvg({
                title: book.title,
                author: book.author,
                category: isHindi ? 'Hindi Literature' : 'Gujarati Classics',
              });
              const coverSrc = verifiedCover || fallbackSvg;
              const finalPrice = discountedPrice(book.price, book.discount);
              const inFav = isInWishlist(book.id);
              const inComp = isInCompare(book.id);

              return (
                <div
                  key={'horiz-book-' + book.id}
                  className="horiz-book-card w-[280px] sm:w-[310px] shrink-0 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Top Cover Showcase */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-surface-elevated)] p-4 border-b border-[var(--border-subtle)] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                      <span
                        className={`font-sans text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${
                          isHindi ? 'bg-orange-500 text-white' : 'bg-cyan-600 text-white'
                        }`}
                      >
                        {isHindi ? 'Hindi Classic' : 'Gujarati Classic'}
                      </span>
                      {book.discount > 0 && (
                        <span className="font-sans text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white">
                          -{book.discount}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist & Compare Buttons */}
                    <div className="absolute top-10 right-3 z-20 flex flex-col gap-1.5">
                      <button
                        onClick={() => toggleWishlist(book)}
                        aria-label="Wishlist"
                        className={`w-7 h-7 rounded-full border border-[var(--border-main)] flex items-center justify-center text-xs transition-all cursor-pointer ${
                          inFav
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-main)]'
                        }`}
                      >
                        {inFav ? '♥' : '♡'}
                      </button>
                      <button
                        onClick={() => (inComp ? removeFromCompare(book.id) : addToCompare(book))}
                        aria-label="Compare"
                        className={`w-7 h-7 rounded-full border border-[var(--border-main)] flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                          inComp
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-main)]'
                        }`}
                      >
                        ⇄
                      </button>
                    </div>

                    {/* Book Cover Image */}
                    <div className="relative w-36 sm:w-40 aspect-[3/4] rounded-lg shadow-md overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={coverSrc}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = fallbackSvg;
                        }}
                      />
                    </div>

                    {/* Volume Index */}
                    <span className="absolute bottom-2 left-3 font-mono text-[10px] text-[var(--text-faint)]">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                    <div>
                      <p className="font-sans text-[11px] font-medium text-[var(--text-faint)] truncate">
                        {book.author}
                      </p>
                      <Link href={`/books/${book.id}`}>
                        <h3 className="font-editorial-serif font-bold text-lg text-[var(--text-main)] line-clamp-1 hover:opacity-75 transition-opacity mt-0.5">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="font-sans text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="border-t border-[var(--border-subtle)] pt-3 flex flex-col gap-2.5">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-editorial-serif font-bold text-xl text-[var(--text-main)]">
                            ₹{finalPrice}
                          </span>
                          {book.discount > 0 && (
                            <span className="font-mono text-xs text-[var(--text-faint)] line-through">
                              ₹{book.price}
                            </span>
                          )}
                        </div>
                        <span className="font-sans text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          ★ {book.rating || 4.8}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/books/${book.id}`}
                          className="py-2 rounded-full text-center font-sans text-xs font-semibold border border-[var(--border-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors text-[var(--text-main)]"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => addToCart(book, 1)}
                          className="py-2 rounded-full text-center font-sans text-xs font-semibold bg-[var(--text-main)] text-[var(--bg-page)] hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                        >
                          + Add Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* End of Gallery Callout Card */}
            <div className="w-[280px] shrink-0 bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] rounded-2xl p-8 flex flex-col justify-between shadow-lg self-stretch">
              <div>
                <span className="text-3xl mb-4 block">🇮🇳</span>
                <h3 className="font-editorial-serif font-bold text-2xl text-[var(--text-main)] leading-tight mb-2">
                  Complete Regional Archive
                </h3>
                <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
                  Discover over 50+ curated Indian language editions with free express shipping across India.
                </p>
              </div>

              <Link
                href="/books"
                className="mt-6 py-2.5 px-5 text-center font-sans font-semibold text-xs rounded-full bg-[var(--text-main)] text-[var(--bg-page)] hover:opacity-90 transition-opacity"
              >
                Browse All Books →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom HUD Navigation Bar ── */}
        <div className="relative z-30 border-t border-[var(--border-main)] bg-[var(--bg-surface)] py-3 px-6 sm:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              ref={currentCardCountRef}
              className="font-mono text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20"
            >
              01 / {String(displayedBooks.length).padStart(2, '0')}
            </span>
            <span className="font-sans text-xs text-[var(--text-muted)] hidden sm:inline">
              Horizontal Scroll Stage
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-sans text-xs text-[var(--text-muted)] flex items-center gap-2">
              <span className="animate-pulse text-orange-500">●</span>
              <span>Scroll down to slide right</span>
              <span>→</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default IndianLanguageSection;
