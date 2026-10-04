'use client';

import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
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

  // Update horizontal position with panoramic 3D perspective rotation and velocity skew
  const updateHorizontalPosition = useCallback(
    (progress: number, velocity: number = 0) => {
      if (!galleryRef.current) return;
      const galleryEl = galleryRef.current;
      const scrollWidth = galleryEl.scrollWidth;
      const clientWidth = window.innerWidth;
      const maxScroll = Math.max(0, scrollWidth - clientWidth + 80);

      const translateX = -progress * maxScroll;
      // Softened velocity skew for ultra-smooth gliding
      const skewX = Math.max(-2.2, Math.min(2.2, velocity * 0.08));
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

      // Panoramic 3D curve effect: cards angle towards the viewer like an elegant curved gallery
      const cards = galleryEl.querySelectorAll<HTMLElement>('.horiz-book-card');
      const centerX = clientWidth / 2;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const normDist = (cardCenter - centerX) / (clientWidth / 2);
        const clampedDist = Math.max(-1.1, Math.min(1.1, normDist));

        // Softened rotation and scale for silky visual depth
        const rotateY = clampedDist * 11;
        const scale = Math.max(0.94, 1.03 - Math.abs(clampedDist) * 0.09);
        const translateZ = (1 - Math.min(1, Math.abs(clampedDist))) * 25;

        card.style.transform = `perspective(1100px) translate3d(0, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      });
    },
    [displayedBooks.length]
  );

  // Robust Scroll-Lock Horizontal Gallery Translation with Silky Lerp Smoothing
  useEffect(() => {
    if (!mounted) return;

    let timeoutId: NodeJS.Timeout;
    let targetProgress = 0;
    let currentProgress = 0;
    let currentVelocity = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
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

      const now = performance.now();
      const dt = Math.max(16, now - lastTime);
      const dy = window.scrollY - lastScrollY;
      currentVelocity = dy / dt;

      lastScrollY = window.scrollY;
      lastTime = now;
    };

    const renderLoop = () => {
      // Gentle damping factor (0.08) creates physical weight and prevents sudden snapping
      currentProgress += (targetProgress - currentProgress) * 0.08;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      currentVelocity *= 0.88; // Decay velocity gently

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
      className="relative w-full border-b-2 border-black bg-[var(--bg-page)]"
      style={{
        // 520vh creates an unhurried, slower, silky smooth horizontal gallery voyage
        height: '520vh',
      }}
    >
      {/* ── Sticky Fullscreen Viewport (Locks screen while user scrolls through regional books) ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">

        {/* ── Ambient Top Header HUD ── */}
        <div className="relative z-30 pt-6 sm:pt-8 px-6 lg:px-12 border-b-2 border-black bg-[var(--bg-surface)] backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <div>
              <div className="inline-flex items-center gap-2.5 bg-orange-100 dark:bg-orange-950/60 border border-orange-500/40 rounded-full px-3.5 py-1 mb-2">
                <span className="text-base leading-none">🇮🇳</span>
                <span className="font-editorial-mono text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#ea580c]">
                  BHARAT KA SAHITYA · HORIZONTAL GALLERY
                </span>
              </div>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-main)] tracking-tight leading-tight">
                Hindi & Gujarati Literature
              </h2>
              <p className="font-cabinet text-sm sm:text-base text-[var(--text-muted)] mt-1.5 max-w-xl font-500">
                Scroll down to travel horizontally through {allBooks.length} regional masterpieces — from Munshi Premchand and Harivansh Rai Bachchan to K.M. Munshi and Umashankar Joshi.
              </p>
            </div>

            {/* Filter Tabs & Scroll HUD Meter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Language Tabs */}
              <div className="flex border-2 border-black bg-[var(--bg-surface-elevated)] shadow-[3px_3px_0px_#000] overflow-hidden">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 font-editorial-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-black text-[#ffe17c]'
                      : 'bg-transparent text-[var(--text-muted)] hover:bg-black/10'
                  }`}
                >
                  All ({allBooks.length})
                </button>
                <button
                  onClick={() => setActiveTab('hindi')}
                  className={`px-4 py-2 font-editorial-mono text-xs font-black uppercase tracking-wider border-l-2 border-black transition-all cursor-pointer ${
                    activeTab === 'hindi'
                      ? 'bg-[#ea580c] text-white'
                      : 'bg-transparent text-[var(--text-muted)] hover:bg-black/10'
                  }`}
                >
                  🔶 Hindi ({hindiBooks.length})
                </button>
                <button
                  onClick={() => setActiveTab('gujarati')}
                  className={`px-4 py-2 font-editorial-mono text-xs font-black uppercase tracking-wider border-l-2 border-black transition-all cursor-pointer ${
                    activeTab === 'gujarati'
                      ? 'bg-[#0891b2] text-white'
                      : 'bg-transparent text-[var(--text-muted)] hover:bg-black/10'
                  }`}
                >
                  🔷 Gujarati ({gujaratiBooks.length})
                </button>
              </div>

              {/* Progress meter */}
              <div className="flex items-center gap-3 bg-black/5 dark:bg-white/10 border-2 border-black px-4 py-2 rounded-lg">
                <span className="font-editorial-mono text-xs font-bold text-[var(--text-faint)]">
                  Progress
                </span>
                <div className="w-20 h-2 bg-black/15 dark:bg-white/20 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-[#ea580c] transition-all duration-75"
                    style={{ width: '0%' }}
                  />
                </div>
                <span
                  ref={progressPercentRef}
                  className="font-editorial-mono text-xs font-black text-[#ea580c] w-10 text-right"
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
                  className="horiz-book-card w-[280px] sm:w-[320px] shrink-0 bg-[var(--bg-surface)] border-3 border-black rounded-xl shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.15)] overflow-hidden flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Top Cover Showcase */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 dark:from-stone-900 dark:to-stone-950 p-4 border-b-2 border-black flex items-center justify-center">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 lumina-dot-bg opacity-30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                      <span
                        className={`font-editorial-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000] ${
                          isHindi ? 'bg-[#ea580c] text-white' : 'bg-[#0891b2] text-white'
                        }`}
                      >
                        {isHindi ? 'Hindi Classic' : 'Gujarati Classic'}
                      </span>
                      {book.discount > 0 && (
                        <span className="font-editorial-mono text-[9px] font-black uppercase px-2 py-0.5 bg-[#ec4899] text-white border border-black shadow-[2px_2px_0px_#000]">
                          -{book.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Interactive Wishlist & Compare Floating Buttons */}
                    <div className="absolute top-10 right-3 z-20 flex flex-col gap-1.5">
                      <button
                        onClick={() => toggleWishlist(book)}
                        aria-label="Wishlist"
                        className={`w-7 h-7 rounded border border-black flex items-center justify-center text-xs transition-all ${
                          inFav
                            ? 'bg-[#ec4899] text-white shadow-[2px_2px_0px_#000]'
                            : 'bg-white hover:bg-[#ffe17c] text-black shadow-[2px_2px_0px_#000]'
                        }`}
                      >
                        {inFav ? '♥' : '♡'}
                      </button>
                      <button
                        onClick={() => (inComp ? removeFromCompare(book.id) : addToCompare(book))}
                        aria-label="Compare"
                        className={`w-7 h-7 rounded border border-black flex items-center justify-center text-xs font-bold transition-all ${
                          inComp
                            ? 'bg-[#3b82f6] text-white shadow-[2px_2px_0px_#000]'
                            : 'bg-white hover:bg-[#3b82f6] hover:text-white text-black shadow-[2px_2px_0px_#000]'
                        }`}
                      >
                        ⇄
                      </button>
                    </div>

                    {/* Book Cover Image */}
                    <div className="relative w-36 sm:w-40 aspect-[3/4] bg-black border-2 border-black shadow-[5px_5px_0px_#000] overflow-hidden group-hover:scale-105 transition-transform duration-500">
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
                    <span className="absolute bottom-2 left-3 font-editorial-mono text-[10px] font-black text-black/50 dark:text-white/50">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                    <div>
                      <p className="font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] truncate">
                        {book.author}
                      </p>
                      <Link href={`/books/${book.id}`}>
                        <h3 className="font-editorial-serif font-black text-lg text-[var(--text-main)] line-clamp-1 hover:text-[#ea580c] transition-colors mt-0.5">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="font-cabinet text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="border-t border-black/15 pt-3 flex flex-col gap-2.5">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-cabinet font-900 text-xl text-[var(--text-main)]">
                            ₹{finalPrice}
                          </span>
                          {book.discount > 0 && (
                            <span className="font-cabinet text-xs text-[var(--text-faint)] line-through">
                              ₹{book.price}
                            </span>
                          )}
                        </div>
                        <span className="font-editorial-mono text-[10px] font-bold text-[#059669]">
                          ★ {book.rating || 4.8}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/books/${book.id}`}
                          className="py-2 text-center font-cabinet font-800 text-xs uppercase tracking-wider border-2 border-black bg-[var(--bg-surface-elevated)] hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000]"
                        >
                          Inspect →
                        </Link>
                        <button
                          onClick={() => addToCart(book, 1)}
                          className="py-2 text-center font-cabinet font-800 text-xs uppercase tracking-wider border-2 border-black bg-[#ffe17c] hover:bg-black hover:text-[#ffe17c] text-black transition-all shadow-[2px_2px_0px_#000]"
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
            <div className="w-[300px] shrink-0 bg-black text-white border-3 border-black rounded-xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#000] self-stretch">
              <div>
                <span className="text-3xl mb-4 block">🇮🇳</span>
                <h3 className="font-editorial-serif font-black text-2xl text-[#ffe17c] leading-tight mb-2">
                  Complete Regional Archive
                </h3>
                <p className="font-cabinet text-sm text-[#b7c6c2] leading-relaxed">
                  Discover over 50+ hand-curated Indian language editions with free express shipping across India.
                </p>
              </div>

              <Link
                href="/books"
                className="mt-6 py-3 px-6 text-center font-cabinet font-800 text-xs uppercase tracking-widest bg-[#ffe17c] text-black border-2 border-white hover:bg-white transition-all shadow-[4px_4px_0px_#ffffff]"
              >
                Browse All Books →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom HUD Navigation Bar ── */}
        <div className="relative z-30 border-t-2 border-black bg-[var(--bg-surface)] py-3 px-6 sm:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              ref={currentCardCountRef}
              className="font-editorial-mono text-xs font-black text-[#ea580c] bg-orange-100 dark:bg-orange-950 px-2.5 py-1 border border-black"
            >
              01 / {String(displayedBooks.length).padStart(2, '0')}
            </span>
            <span className="font-editorial-mono text-xs font-bold text-[var(--text-muted)] hidden sm:inline">
              Horizontal Scroll-Pinned Stage
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-editorial-mono text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
              <span className="animate-pulse text-[#ea580c]">●</span>
              <span>Scroll down to slide right</span>
              <span className="font-black">→</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default IndianLanguageSection;
