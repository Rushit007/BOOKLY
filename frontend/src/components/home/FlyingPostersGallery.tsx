'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { generateBookCoverSvg, VERIFIED_BOOK_COVERS } from '../../utils/bookCovers';
import { FlyingPosters, PosterItem, Canvas } from './FlyingPosters';
import { useCart } from '../../context/CartContext';
import { MOCK_BOOKS } from '../../data/mockBooks';

interface FlyingPostersGalleryProps {
  books?: Book[];
}

function discountedPrice(price: number, discount: number) {
  return Math.round(price * (1 - discount / 100));
}

// 10 Curated Books of the Month with editorial commentary
const EDITORIAL_SUMMARIES: Record<string, { badge: string; reason: string; quote: string }> = {
  'book-1': {
    badge: 'ENGINEERING MASTERWORK',
    reason: 'Selected for its timeless influence on professional software craftsmanship and foundational readable coding discipline.',
    quote: '"Clean code always looks like it was written by someone who cares."',
  },
  'book-2': {
    badge: 'SYSTEMS ARCHITECTURE LANDMARK',
    reason: 'The definitive architectural compass for distributed fault-tolerant systems, data streams, and database internals.',
    quote: '"A good system design anticipates failures rather than hiding them."',
  },
  'book-3': {
    badge: 'CAREER ACCELERATOR',
    reason: 'Celebrated for 25+ years of pragmatic mindset guidance, engineering mastery, and iterative refinement.',
    quote: '"Don’t live with broken windows in your codebase."',
  },
  'book-4': {
    badge: 'BEHAVIORAL TITAN',
    reason: 'Over 15 million readers transformed by James Clear’s 4 laws of behavior change and atomic compounding.',
    quote: '"You do not rise to the level of your goals. You fall to the level of your systems."',
  },
  'book-5': {
    badge: 'FINANCIAL WISDOM CLASSIC',
    reason: 'Morgan Housel illustrates that managing wealth is 80% behavior and psychology, and only 20% spreadsheet math.',
    quote: '"Doing well with money has a little to do with how smart you are and a lot to do with how you behave."',
  },
  'book-6': {
    badge: 'GLOBAL ALLEGORY OF DESTINY',
    reason: 'Paulo Coelho’s lyrical masterpiece on listening to one’s heart and pursuing a personal legend.',
    quote: '"When you want something, all the universe conspires in helping you to achieve it."',
  },
  'book-10': {
    badge: 'COSMIC PERSPECTIVE HEIRLOOM',
    reason: 'Carl Sagan’s sweeping poetic journey through 15 billion years of cosmic evolution and planetary curiosity.',
    quote: '"We are a way for the cosmos to know itself."',
  },
  'book-11': {
    badge: 'HISTORICAL REVOLUTION',
    reason: 'Yuval Noah Harari’s tour de force explaining how an insignificant ape became the master of planet Earth.',
    quote: '"Fiction has enabled us not merely to imagine things, but to do so collectively."',
  },
  'hindi-1': {
    badge: 'INDIAN LITERARY SOUL',
    reason: 'Munshi Premchand’s monumental magnum opus capturing the tragic, noble, and enduring essence of rural India.',
    quote: '"संसार में गाय जैसा सीधा और परोपकारी कोई प्राणी नहीं है।"',
  },
  'guj-1': {
    badge: 'GUJARATI CLASSICAL OPUS',
    reason: 'Govardhanram Tripathi’s epic four-volume narrative exploring the synthesis of Indian heritage and modernity.',
    quote: '"ધર્મ, નીતિ અને જ્ઞાનનું ચિરંતન સ્મારક."',
  },
};

export function FlyingPostersGallery({ books }: FlyingPostersGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasInstanceRef = useRef<Canvas | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use 10 Books of the Month
  const galleryBooks = useMemo(() => {
    const list = books && books.length >= 10 ? books : MOCK_BOOKS;
    return list.slice(0, 10);
  }, [books]);

  // Map into PosterItem format
  const posterItems: PosterItem[] = useMemo(() => {
    return galleryBooks.map((book) => {
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
  }, [galleryBooks]);

  const activeBook = galleryBooks[activeIdx % galleryBooks.length] || galleryBooks[0];
  const finalPrice = activeBook ? discountedPrice(activeBook.price, activeBook.discount || 0) : 0;
  const activeEditorial = EDITORIAL_SUMMARIES[activeBook?.id] || {
    badge: 'CURATOR’S CHOICE',
    reason: 'Handpicked for exceptional literary prose, enduring intellectual depth, and collector binding appeal.',
    quote: '"A book must be the axe for the frozen sea inside us."',
  };

  const handleCanvasRef = useCallback((instance: Canvas | null) => {
    canvasInstanceRef.current = instance;
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            canvasInstanceRef.current?.resume();
          } else {
            canvasInstanceRef.current?.pause();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (trackRef.current) {
      observer.observe(trackRef.current);
    }

    const handleScroll = () => {
      if (!isVisible || !trackRef.current || !canvasInstanceRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScrollable = trackHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Synchronize 3D WebGL distortion gallery with page scroll
      if (canvasInstanceRef.current && typeof (canvasInstanceRef.current as any).scrollToProgress === 'function') {
        (canvasInstanceRef.current as any).scrollToProgress(progress);
      }

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
      }
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.height = `${Math.max(15, progress * 100)}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted]);

  const stepPoster = (direction: 'next' | 'prev') => {
    if (!canvasInstanceRef.current) return;
    const canvas = canvasInstanceRef.current as any;
    const newIdx = direction === 'next'
      ? Math.min(posterItems.length - 1, activeIdx + 1)
      : Math.max(0, activeIdx - 1);
    
    if (typeof canvas.scrollToIndex === 'function') {
      canvas.scrollToIndex(newIdx);
    }
    setActiveIdx(newIdx);
  };

  const jumpToBook = (idx: number) => {
    if (!canvasInstanceRef.current) return;
    const canvas = canvasInstanceRef.current as any;
    if (typeof canvas.scrollToIndex === 'function') {
      canvas.scrollToIndex(idx);
    }
    setActiveIdx(idx);
  };

  return (
    <div
      ref={trackRef}
      className="relative w-full bg-[#09090b] text-white"
      style={{ height: '380vh' }}
    >
      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="relative z-30 pt-6 px-6 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 mb-2 pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono font-bold text-xs text-amber-300 uppercase tracking-widest">
                10 Curated Books of the Month
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
              Curator’s Choice in 3D Flight
            </h2>
          </div>

          {/* Progress and controls */}
          <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md border border-white/15 px-4 py-2 self-start sm:self-auto rounded-xl pointer-events-auto shadow-lg">
            <div className="font-mono text-xs font-bold text-white/70">
              <span className="text-amber-400">
                {String((activeIdx % posterItems.length) + 1).padStart(2, '0')}
              </span>
              <span className="text-white/40"> / {String(posterItems.length).padStart(2, '0')}</span>
            </div>

            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-amber-400 transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>

            <div className="flex items-center gap-1 border-l border-white/15 pl-2">
              <button
                onClick={() => stepPoster('prev')}
                aria-label="Previous Book"
                className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors text-xs cursor-pointer"
              >
                ↑
              </button>
              <button
                onClick={() => stepPoster('next')}
                aria-label="Next Book"
                className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors text-xs cursor-pointer"
              >
                ↓
              </button>
            </div>
          </div>
        </div>

        {/* ── WebGL 3D Flying Posters Canvas (Center) ── */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
          {mounted && (
            <FlyingPosters
              items={posterItems}
              planeWidth={360}
              planeHeight={490}
              distortion={3.2}
              scrollEase={0.06}
              cameraFov={45}
              cameraZ={20}
              onActiveIndexChange={(idx) => setActiveIdx(idx)}
              canvasRefCallback={handleCanvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />
          )}
        </div>

        {/* ── Left Sidebar: 10 Books Index & "Why this Book of the Month?" ── */}
        <div className="absolute left-6 lg:left-12 top-28 bottom-28 w-72 hidden xl:flex flex-col justify-between z-20 pointer-events-auto">
          {/* 10 Books Jump List */}
          <div className="bg-zinc-950/80 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-xl max-h-[45vh] overflow-y-auto space-y-1.5">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 pb-2 border-b border-white/10">
              The 10 Books of the Month
            </p>
            {galleryBooks.map((b, idx) => {
              const isSelected = (activeIdx % galleryBooks.length) === idx;
              return (
                <button
                  key={b.id}
                  onClick={() => jumpToBook(idx)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-black font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate pr-2">
                    {idx + 1}. {b.title}
                  </span>
                  {isSelected && <span className="text-[10px]">●</span>}
                </button>
              );
            })}
          </div>

          {/* Editorial Review Box */}
          <div className="bg-zinc-950/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-xs">✦</span>
              <span className="text-[10px] font-mono uppercase font-black text-amber-300 tracking-wider">
                Why Book of the Month?
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {activeEditorial.reason}
            </p>
            <blockquote className="text-[11px] italic text-zinc-400 border-l border-amber-400/40 pl-2 pt-1 font-serif">
              {activeEditorial.quote}
            </blockquote>
          </div>
        </div>

        {/* ── Right Sidebar: Enlarged Book Specification & Actions ── */}
        <div className="absolute right-6 lg:right-12 top-28 bottom-28 w-80 hidden lg:flex flex-col justify-end z-20 pointer-events-auto">
          {activeBook && (
            <div className="bg-zinc-950/90 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase bg-amber-400 text-black">
                  {activeEditorial.badge}
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  👑 Perfection 99%
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                  {activeBook.title}
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  By {activeBook.author} · {activeBook.publisher || 'Archival Edition'}
                </p>
              </div>

              <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                {activeBook.description}
              </p>

              <div className="flex items-baseline justify-between pt-3 border-t border-white/10">
                <div>
                  <span className="text-2xl font-serif font-black text-white">
                    ₹{finalPrice}
                  </span>
                  {activeBook.discount > 0 && (
                    <span className="text-xs text-zinc-500 line-through ml-2">
                      ₹{activeBook.price}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  ISBN: {activeBook.isbn.slice(-6)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => addToCart(activeBook, 1)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 text-black hover:bg-amber-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
                >
                  Add to Cart
                </button>
                <Link
                  href={`/books/${activeBook.id}`}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition text-center flex items-center justify-center cursor-pointer"
                >
                  Details ↗
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="relative z-20 pb-6 px-6 lg:px-12 flex justify-between items-center pointer-events-none">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Drag posters or scroll page to warp through 3D editions
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Scroll Depth</span>
            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                ref={scrollIndicatorRef}
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: '15%' }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
