'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

interface ExplodedBookSectionProps {
  book?: Book;
}

// Default book is Atomic Habits (book-4)
const DEFAULT_ATOMIC_HABITS: Book = {
  id: 'book-4',
  title: 'Atomic Habits',
  subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
  author: 'James Clear',
  isbn: '9780735211292',
  publisher: 'Avery · Penguin Random House',
  description:
    'Over 15 million readers worldwide have adopted Clear’s 4-step framework for making good habits inevitable and bad habits impossible. Includes actionable implementation intentions, habit stacking guides, and environment design principles.',
  price: 499,
  discount: 25,
  stock: 120,
  categoryId: 'cat-3',
  category: {
    id: 'cat-3',
    name: 'Self-Help & Systems',
    slug: 'self-help',
    description: 'Personal growth and systems thinking',
  },
  coverImage:
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
  rating: 4.9,
  numReviews: 1420,
  createdAt: '2026-01-20T10:00:00.000Z',
};

export function ExplodedBookSection({ book = DEFAULT_ATOMIC_HABITS }: ExplodedBookSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [activePhase, setActivePhase] = useState<'unbox' | 'explode' | 'assembled'>('unbox');
  const [addedNotice, setAddedNotice] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // DOM Refs for 60fps direct transforms (zero re-render lag during rapid wheel scrolling)
  const boxWrapperRef = useRef<HTMLDivElement>(null);
  const boxLidRef = useRef<HTMLDivElement>(null);
  const boxBaseRef = useRef<HTMLDivElement>(null);
  const glowLightRef = useRef<HTMLDivElement>(null);

  // Exploded Layers Refs
  const bookCoreRef = useRef<HTMLDivElement>(null);
  const layerJacketRef = useRef<HTMLDivElement>(null);
  const layerSpineRef = useRef<HTMLDivElement>(null);
  const layerPagesRef = useRef<HTMLDivElement>(null);
  const layerRibbonRef = useRef<HTMLDivElement>(null);
  const layerSealRef = useRef<HTMLDivElement>(null);

  // HUD & Layout Refs
  const editorialPanelRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const phaseIndicatorRef = useRef<HTMLSpanElement>(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    addToCart(book);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2600);
  };

  // Jump smoothly to a specific animation phase
  const jumpToPhase = (phase: 'unbox' | 'explode' | 'assembled') => {
    if (!trackRef.current) return;
    const trackTop = trackRef.current.offsetTop;
    const trackHeight = trackRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = trackHeight - viewportHeight;

    let targetRatio = 0.1;
    if (phase === 'explode') targetRatio = 0.48;
    if (phase === 'assembled') targetRatio = 0.95;

    window.scrollTo({
      top: trackTop + targetRatio * totalScrollable,
      behavior: 'smooth',
    });
  };

  // Render 60fps Direct DOM Transforms for Unbox -> Explode -> Reassemble
  const updateExplodedAnimation = useCallback((progress: number) => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.innerText = `${Math.round(progress * 100)}%`;
    }

    // Determine current narrative phase
    let currentPhase: 'unbox' | 'explode' | 'assembled' = 'unbox';
    let phaseLabel = 'PHASE 01 // UNBOXING THE ARCHIVAL VAULT';
    if (progress >= 0.25 && progress < 0.7) {
      currentPhase = 'explode';
      phaseLabel = 'PHASE 02 // 3D EXPLODED ANATOMY OF CRAFTSMANSHIP';
    } else if (progress >= 0.7) {
      currentPhase = 'assembled';
      phaseLabel = 'PHASE 03 // ASSEMBLED CRITICS\' CHOICE EDITORIAL SPREAD';
    }
    setActivePhase(currentPhase);
    if (phaseIndicatorRef.current) {
      phaseIndicatorRef.current.innerText = phaseLabel;
    }

    // ─────────────────────────────────────────────────────────────
    // 1. PRESENTATION BOX TRANSFORMS (Progress: 0.00 -> 0.32)
    // ─────────────────────────────────────────────────────────────
    if (boxWrapperRef.current && boxLidRef.current && boxBaseRef.current && glowLightRef.current) {
      if (progress <= 0.02) {
        // Completely closed box resting on pedestal
        boxWrapperRef.current.style.transform = `perspective(1400px) rotateX(16deg) rotateY(-8deg) scale(1)`;
        boxWrapperRef.current.style.opacity = '1';
        boxLidRef.current.style.transform = `rotateX(0deg)`;
        glowLightRef.current.style.opacity = '0';
      } else if (progress < 0.28) {
        const t = Math.min(1, progress / 0.25);
        // Box lid swings open backwards
        const lidAngle = -t * 115;
        boxLidRef.current.style.transform = `rotateX(${lidAngle}deg)`;
        glowLightRef.current.style.opacity = `${t * 0.9}`;

        // Box slightly sinks and tilts as lid opens
        const boxTiltX = 16 - t * 6;
        const boxScale = 1 - t * 0.08;
        boxWrapperRef.current.style.transform = `perspective(1400px) rotateX(${boxTiltX}deg) rotateY(-8deg) scale(${boxScale})`;
        boxWrapperRef.current.style.opacity = '1';
      } else {
        // Box dissolves away as the book ascends and explodes
        const fadeT = Math.min(1, (progress - 0.28) / 0.08);
        boxWrapperRef.current.style.opacity = `${Math.max(0, 1 - fadeT * 1.5)}`;
        boxWrapperRef.current.style.transform = `perspective(1400px) translate3d(0, ${fadeT * 80}px, -120px) scale(0.9)`;
        boxLidRef.current.style.transform = `rotateX(-115deg)`;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. CENTRAL BOOK & EXPLODED ANATOMY (Progress: 0.00 -> 0.72)
    // ─────────────────────────────────────────────────────────────
    // Unboxing emergence (0.00 -> 0.26)
    let emergenceY = 140; // Hidden inside the box
    let emergenceZ = -40;
    let bookScale = 0.88;
    let bookTiltX = 14;
    let bookTiltY = -8;

    if (progress < 0.26) {
      const emergeT = Math.max(0, progress / 0.26);
      emergenceY = 140 - emergeT * 140; // Rises up from box
      emergenceZ = -40 + emergeT * 40;
      bookScale = 0.88 + emergeT * 0.12;
      bookTiltX = 14 - emergeT * 6;
    } else {
      emergenceY = 0;
      emergenceZ = 0;
      bookScale = 1;
      bookTiltX = 8;
    }

    // Explosion Factor (Peak at ~0.48, then contract back into solid book by 0.70)
    let explodeFactor = 0;
    if (progress >= 0.26 && progress <= 0.70) {
      const explodeT = (progress - 0.26) / (0.70 - 0.26);
      // Smooth bell curve using sine: 0 at start -> 1 at midpoint -> 0 at end
      explodeFactor = Math.sin(explodeT * Math.PI);
    }

    // Apply 3D offsets to the 5 exploded components
    if (
      layerJacketRef.current &&
      layerSpineRef.current &&
      layerPagesRef.current &&
      layerRibbonRef.current &&
      layerSealRef.current
    ) {
      // Layer 1: Front Dust Jacket (Floats top-left & forward)
      const jX = -explodeFactor * 175;
      const jY = -explodeFactor * 55;
      const jZ = explodeFactor * 130;
      const jRotY = -explodeFactor * 26;
      const jRotX = explodeFactor * 8;
      layerJacketRef.current.style.transform = `translate3d(${jX}px, ${jY}px, ${jZ}px) rotateY(${jRotY}deg) rotateX(${jRotX}deg)`;
      layerJacketRef.current.style.boxShadow = explodeFactor > 0.05
        ? `${-15 * explodeFactor}px ${20 * explodeFactor}px ${35 * explodeFactor}px rgba(0,0,0,0.5)`
        : '6px 6px 0px rgba(0,0,0,0.9)';

      // Layer 2: Smyth-Sewn Binding & Cloth Spine (Floats top-right)
      const spX = explodeFactor * 140;
      const spY = -explodeFactor * 105;
      const spZ = explodeFactor * 50;
      const spRotY = explodeFactor * 20;
      layerSpineRef.current.style.transform = `translate3d(${spX}px, ${spY}px, ${spZ}px) rotateY(${spRotY}deg)`;
      layerSpineRef.current.style.opacity = `${Math.min(1, explodeFactor * 2.2)}`;

      // Layer 3: Uncoated Munken Page Block & Typesetting (Floats right & slightly back)
      const pX = explodeFactor * 185;
      const pY = explodeFactor * 35;
      const pZ = explodeFactor * 15;
      const pRotY = explodeFactor * 18;
      layerPagesRef.current.style.transform = `translate3d(${pX}px, ${pY}px, ${pZ}px) rotateY(${pRotY}deg)`;
      layerPagesRef.current.style.opacity = `${Math.min(1, explodeFactor * 2.5)}`;

      // Layer 4: Silk Bookmark Ribbon (Drapes downward)
      const rX = explodeFactor * 20;
      const rY = explodeFactor * 145;
      const rZ = explodeFactor * 90;
      const rRotZ = -explodeFactor * 12;
      layerRibbonRef.current.style.transform = `translate3d(${rX}px, ${rY}px, ${rZ}px) rotateZ(${rRotZ}deg)`;
      layerRibbonRef.current.style.opacity = `${Math.min(1, explodeFactor * 2.2)}`;

      // Layer 5: Certificate of Provenance & Seal (Floats lower-left)
      const seX = -explodeFactor * 180;
      const seY = explodeFactor * 125;
      const seZ = explodeFactor * 110;
      const seRotY = -explodeFactor * 18;
      layerSealRef.current.style.transform = `translate3d(${seX}px, ${seY}px, ${seZ}px) rotateY(${seRotY}deg)`;
      layerSealRef.current.style.opacity = `${Math.min(1, explodeFactor * 2.5)}`;

      // Callout pins visibility
      const callouts = stageRef.current?.querySelectorAll<HTMLElement>('.exploded-callout');
      callouts?.forEach((el) => {
        el.style.opacity = `${Math.max(0, Math.min(1, (explodeFactor - 0.25) * 2.5))}`;
        el.style.transform = `scale(${0.9 + explodeFactor * 0.1})`;
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. FINAL REASSEMBLY & DOCKING INTO EDITORIAL CARD (Progress: 0.70 -> 1.00)
    // ─────────────────────────────────────────────────────────────
    if (bookCoreRef.current && editorialPanelRef.current) {
      if (progress < 0.70) {
        // Center position in stage
        bookCoreRef.current.style.transform = `perspective(1400px) translate3d(0, ${emergenceY}px, ${emergenceZ}px) rotateX(${bookTiltX}deg) rotateY(${bookTiltY}deg) scale(${bookScale})`;
        editorialPanelRef.current.style.opacity = '0';
        editorialPanelRef.current.style.pointerEvents = 'none';
        editorialPanelRef.current.style.transform = `translate3d(60px, 0, 0)`;
      } else {
        // Morph into the split 2-column layout!
        const dockT = (progress - 0.70) / 0.30;
        // Smooth ease out
        const easeDock = 1 - Math.pow(1 - dockT, 3);

        const isDesktop = window.innerWidth >= 1024;
        const targetX = isDesktop ? -280 * easeDock : 0;
        const targetY = isDesktop ? 0 : -140 * easeDock;
        const finalScale = isDesktop ? 1 - easeDock * 0.08 : 0.85;
        const finalTiltX = bookTiltX * (1 - easeDock);
        const finalTiltY = bookTiltY * (1 - easeDock);

        bookCoreRef.current.style.transform = `perspective(1400px) translate3d(${targetX}px, ${targetY}px, 0px) rotateX(${finalTiltX}deg) rotateY(${finalTiltY}deg) scale(${finalScale})`;

        // Editorial Panel fades and slides into view
        editorialPanelRef.current.style.opacity = `${Math.min(1, easeDock * 1.4)}`;
        editorialPanelRef.current.style.pointerEvents = easeDock > 0.6 ? 'auto' : 'none';
        const panelTranslateX = (1 - easeDock) * 50;
        editorialPanelRef.current.style.transform = `translate3d(${panelTranslateX}px, 0, 0)`;
      }
    }
  }, []);

  // Synchronize Scroll Event with Exploded Engine only when visible
  useEffect(() => {
    if (!mounted) return;

    let rafId: number;
    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { rootMargin: '100px' }
    );

    if (trackRef.current) {
      observer.observe(trackRef.current);
    }

    const handleScroll = () => {
      if (!isVisible || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScrollable = trackHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateExplodedAnimation(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, updateExplodedAnimation]);

  const discPrice = Math.round(book.price * (1 - (book.discount || 0) / 100));

  return (
    <div
      ref={trackRef}
      id="exploded-showcase"
      suppressHydrationWarning
      className="relative w-full border-b-2 border-black bg-[#0d0f12] text-white"
      style={{
        // 140vh provides responsive, smooth, non-trapping scroll runway
        height: '140vh',
      }}
    >
      {/* ── Sticky Viewport (Locks Screen During Unbox, Explode & Assemble) ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        
        {/* ── Top Ambient HUD Navigation ── */}
        <div className="relative z-30 pt-5 px-6 lg:px-12 border-b border-white/10 bg-[#0d0f12]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-accent-yellow)] text-black font-editorial-mono text-xs font-black">
                ★
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-editorial-mono text-[10px] font-black uppercase tracking-[0.25em] text-[var(--bg-accent-yellow)]">
                    COLLECTOR’S ASSEMBLY // EXPLODED VIEW
                  </span>
                  <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/40" />
                  <span
                    ref={phaseIndicatorRef}
                    className="hidden md:inline-block font-editorial-mono text-[10px] text-white/70 tracking-widest uppercase"
                  >
                    PHASE 01 // UNBOXING THE ARCHIVAL VAULT
                  </span>
                </div>
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  The Anatomy of {book.title}
                </h3>
              </div>
            </div>

            {/* Quick Interactive Phase Jump Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/15 rounded-lg font-editorial-mono text-[11px] font-bold">
              <button
                type="button"
                onClick={() => jumpToPhase('unbox')}
                className={`px-3 py-1.5 rounded transition-all ${
                  activePhase === 'unbox'
                    ? 'bg-[var(--bg-accent-yellow)] text-black shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                01. Unbox
              </button>
              <button
                type="button"
                onClick={() => jumpToPhase('explode')}
                className={`px-3 py-1.5 rounded transition-all ${
                  activePhase === 'explode'
                    ? 'bg-[var(--bg-accent-yellow)] text-black shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                02. Explode
              </button>
              <button
                type="button"
                onClick={() => jumpToPhase('assembled')}
                className={`px-3 py-1.5 rounded transition-all ${
                  activePhase === 'assembled'
                    ? 'bg-[var(--bg-accent-yellow)] text-black shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                03. Lock Layout
              </button>
            </div>
          </div>
        </div>

        {/* ── Center 3D Cinema Stage (Contains Box, Exploded Parts, & Locked Spread) ── */}
        <div
          ref={stageRef}
          className="relative flex-1 w-full max-w-7xl mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
          style={{ perspective: '1600px' }}
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[130px] opacity-75" />
            <div className="w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[150px] opacity-50" />
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* A. LUXURY COLLECTOR’S PRESENTATION BOX                      */}
          {/* ───────────────────────────────────────────────────────── */}
          <div
            ref={boxWrapperRef}
            className="absolute z-10 w-[340px] sm:w-[380px] h-[450px] sm:h-[490px] transition-transform duration-75 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'perspective(1400px) rotateX(16deg) rotateY(-8deg)',
            }}
          >
            {/* Box Velvet Glow Light when opening */}
            <div
              ref={glowLightRef}
              className="absolute inset-x-6 top-8 h-48 bg-amber-400/30 blur-2xl rounded-full transition-opacity duration-200 pointer-events-none"
              style={{ opacity: 0 }}
            />

            {/* Box Base (Deep Velvet Obsidian Tray) */}
            <div
              ref={boxBaseRef}
              className="absolute inset-0 rounded-2xl bg-[#14171d] border-2 border-[#2b313d] shadow-[0px_35px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 overflow-hidden"
              style={{
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9), 0 30px 60px rgba(0,0,0,0.95)',
              }}
            >
              {/* Velvet Tray Rim Inlay */}
              <div className="absolute inset-2 border border-amber-500/20 rounded-xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-editorial-mono text-[9px] uppercase tracking-[0.3em] text-amber-400/80">
                  ARCHIVAL VAULT № 2026
                </span>
                <span className="font-editorial-mono text-[9px] uppercase text-white/40">
                  BOOKLY CERTIFIED
                </span>
              </div>

              {/* Recessed Velvet Bed for Book */}
              <div className="flex-1 my-3 bg-[#0a0c0f] rounded-lg border border-black/80 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
                <div className="text-center space-y-1 opacity-50">
                  <span className="block font-editorial-mono text-[10px] text-amber-300 uppercase tracking-widest">
                    CUSTOM FIT DIE-CUT BED
                  </span>
                  <span className="block font-editorial-serif text-xs text-white/50 italic">
                    Resting 1st Edition Smyth-Sewn Block
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] font-editorial-mono text-white/40">
                <span>MAGNETIC CLOSURE</span>
                <span>FOIL DEBOSSED</span>
              </div>
            </div>

            {/* Box 3D Hinged Lid (Swings backward as scroll begins) */}
            <div
              ref={boxLidRef}
              className="absolute inset-0 rounded-2xl bg-[#181c24] border-2 border-amber-500/40 p-6 flex flex-col justify-between shadow-2xl origin-top"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
                transition: 'transform 0.08s linear',
              }}
            >
              {/* Gold Inlay Borders on Lid */}
              <div className="absolute inset-3 border border-amber-400/40 rounded-xl pointer-events-none" />
              <div className="absolute inset-4 border border-dashed border-amber-400/20 rounded-lg pointer-events-none" />

              <div className="flex justify-between items-center relative z-10">
                <span className="font-editorial-mono text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
                  BOOKLY PRIVATE ARCHIVE
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
              </div>

              {/* Lid Central Gold Hot-Stamped Seal */}
              <div className="text-center relative z-10 space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full border-2 border-amber-400/80 bg-amber-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <span className="font-editorial-serif text-2xl font-black text-amber-400">B</span>
                </div>
                <h4 className="font-editorial-serif text-2xl font-black text-white tracking-wide">
                  ATOMIC HABITS
                </h4>
                <p className="font-editorial-mono text-[10px] text-amber-200/70 uppercase tracking-widest">
                  JAMES CLEAR · DEFINITIVE HARDBOUND
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[10px] font-editorial-mono text-amber-400/60 uppercase">
                <span>SCROLL DOWN TO UNBOX</span>
                <span>EDITION OF 500</span>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* B. THE 3D BOOK & 5-LAYER EXPLODED ANATOMY                 */}
          {/* ───────────────────────────────────────────────────────── */}
          <div
            ref={bookCoreRef}
            className="absolute z-20 w-[270px] sm:w-[310px] aspect-[3/4.2] transition-transform duration-75 ease-out"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* ── LAYER 1: Front Dust Jacket (Cold-Foil Debossed 300 GSM) ── */}
            <div
              ref={layerJacketRef}
              className="absolute inset-0 rounded-lg border-2 border-amber-400/50 bg-[#1c1917] overflow-hidden select-none transition-shadow"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Book Cover Image / Visual */}
              <img
                src={book.coverImage || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop'}
                alt={book.title}
                className="w-full h-full object-cover"
              />

              {/* Gold Foil Shimmer Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/25 via-transparent to-yellow-200/20 pointer-events-none mix-blend-overlay" />

              {/* Neo-Brutalist Badges on Jacket */}
              <div className="absolute top-3 left-3 bg-[var(--bg-accent-yellow)] text-black px-2.5 py-1 font-editorial-mono text-[10px] font-black uppercase tracking-wider border border-black shadow-sm">
                ★ BOOK OF THE MONTH
              </div>
              <div className="absolute bottom-3 right-3 bg-black/90 text-white px-2.5 py-1 font-editorial-mono text-[10px] font-bold border border-white/20">
                ₹{discPrice} <span className="line-through text-gray-400 text-[8px]">₹{book.price}</span> (-25%)
              </div>

              {/* Exploded Callout Annotation: Jacket */}
              <div
                className="exploded-callout absolute -top-12 -left-28 sm:-left-36 pointer-events-none transition-all duration-300"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-black/95 border border-amber-400 rounded text-left shadow-2xl backdrop-blur-md">
                    <span className="block font-editorial-mono text-[9px] font-black text-amber-400 uppercase tracking-wider">
                      [ 01 · DUST JACKET ]
                    </span>
                    <span className="block font-editorial-sans text-[11px] text-white/90 font-bold whitespace-nowrap">
                      300 GSM Munken Polar + Cold-Stamping Foil
                    </span>
                  </div>
                  <div className="w-8 h-[1px] bg-amber-400 hidden sm:block" />
                </div>
              </div>
            </div>

            {/* ── LAYER 2: Smyth-Sewn Thread Binding & Cloth Spine ── */}
            <div
              ref={layerSpineRef}
              className="absolute -left-6 top-0 bottom-0 w-8 rounded-l-md bg-stone-900 border-2 border-stone-600 flex flex-col justify-around py-4 items-center shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                opacity: 0,
              }}
            >
              {/* Visible Stitched Thread Lines */}
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="w-full flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1 rounded-full bg-amber-400" />
                  <div className="w-3 h-[2px] bg-amber-200/80" />
                </div>
              ))}
              <span className="font-editorial-mono text-[7px] text-white/60 -rotate-90 uppercase tracking-widest whitespace-nowrap">
                SMYTH-SEWN
              </span>

              {/* Exploded Callout Annotation: Spine */}
              <div
                className="exploded-callout absolute -top-14 left-8 pointer-events-none transition-all duration-300"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-[1px] bg-emerald-400 hidden sm:block" />
                  <div className="px-3 py-1.5 bg-black/95 border border-emerald-400 rounded text-left shadow-2xl backdrop-blur-md">
                    <span className="block font-editorial-mono text-[9px] font-black text-emerald-400 uppercase tracking-wider">
                      [ 02 · ARCHIVAL SPINE ]
                    </span>
                    <span className="block font-editorial-sans text-[11px] text-white/90 font-bold whitespace-nowrap">
                      100% Cotton Thread · Lays 180° Flat Forever
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── LAYER 3: Core Munken Text Block & Typesetting ── */}
            <div
              ref={layerPagesRef}
              className="absolute inset-1 rounded-r-lg bg-[#FAF8F5] text-black p-5 shadow-2xl flex flex-col justify-between border-l-4 border-amber-700/60 overflow-hidden"
              style={{
                transformStyle: 'preserve-3d',
                opacity: 0,
              }}
            >
              {/* Simulated Typography Page Spread */}
              <div className="space-y-2 border-b border-black/10 pb-3">
                <span className="font-editorial-mono text-[8px] uppercase tracking-widest text-stone-500 block">
                  CHAPTER 01 · THE SURPRISING POWER OF TINY CHANGES
                </span>
                <h5 className="font-editorial-serif text-sm font-black leading-snug text-stone-900">
                  &ldquo;1% Better Every Day Compounds to 37x in One Year.&rdquo;
                </h5>
              </div>

              {/* Diagram / Graph */}
              <div className="my-2 p-2 bg-stone-100 rounded border border-stone-300">
                <div className="flex items-end justify-between h-10 px-1 gap-1">
                  <div className="w-1/6 bg-stone-300 h-2 rounded-t" />
                  <div className="w-1/6 bg-stone-400 h-3 rounded-t" />
                  <div className="w-1/6 bg-stone-500 h-5 rounded-t" />
                  <div className="w-1/6 bg-amber-500 h-7 rounded-t" />
                  <div className="w-1/6 bg-amber-600 h-9 rounded-t" />
                  <div className="w-1/6 bg-[var(--text-main)] h-10 rounded-t" />
                </div>
                <div className="text-[7px] font-editorial-mono text-center text-stone-600 mt-1 uppercase">
                  Habit Aggregation Curve (James Clear)
                </div>
              </div>

              <div className="flex items-center justify-between text-[8px] font-editorial-mono text-stone-500 border-t border-black/10 pt-2">
                <span>PAGE 27</span>
                <span>MUNKEN PURE 80 GSM</span>
              </div>

              {/* Exploded Callout Annotation: Pages */}
              <div
                className="exploded-callout absolute top-12 -right-32 sm:-right-44 pointer-events-none transition-all duration-300"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-[1px] bg-sky-400 hidden sm:block" />
                  <div className="px-3 py-1.5 bg-black/95 border border-sky-400 rounded text-left shadow-2xl backdrop-blur-md">
                    <span className="block font-editorial-mono text-[9px] font-black text-sky-400 uppercase tracking-wider">
                      [ 03 · TEXT BLOCK ]
                    </span>
                    <span className="block font-editorial-sans text-[11px] text-white/90 font-bold whitespace-nowrap">
                      80 GSM Acid-Free Munken Pure · Zero Bleed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── LAYER 4: Double-Woven Silk Bookmark Ribbon ── */}
            <div
              ref={layerRibbonRef}
              className="absolute -bottom-16 left-1/3 w-4 h-28 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 shadow-xl rounded-b origin-top pointer-events-none"
              style={{
                transformStyle: 'preserve-3d',
                opacity: 0,
              }}
            >
              <div className="w-full h-full border-x border-amber-300/40" />

              {/* Exploded Callout Annotation: Ribbon */}
              <div
                className="exploded-callout absolute bottom-2 -right-36 sm:-right-44 pointer-events-none transition-all duration-300"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-[1px] bg-amber-400 hidden sm:block" />
                  <div className="px-3 py-1.5 bg-black/95 border border-amber-400 rounded text-left shadow-2xl backdrop-blur-md">
                    <span className="block font-editorial-mono text-[9px] font-black text-amber-400 uppercase tracking-wider">
                      [ 04 · SILK RIBBON ]
                    </span>
                    <span className="block font-editorial-sans text-[11px] text-white/90 font-bold whitespace-nowrap">
                      8mm Japanese Grosgrain Ribbon Marker
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── LAYER 5: Archival Seal & First Edition Certificate Plate ── */}
            <div
              ref={layerSealRef}
              className="absolute -bottom-12 -left-10 w-28 h-28 rounded-xl bg-gradient-to-tr from-stone-900 to-stone-800 border-2 border-amber-400/80 p-3 shadow-2xl flex flex-col justify-between"
              style={{
                transformStyle: 'preserve-3d',
                opacity: 0,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-editorial-mono text-[7px] text-amber-400 uppercase font-black">
                  PROVENANCE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-center my-1">
                <span className="font-editorial-mono text-xs font-black text-white block">
                  #120 / 500
                </span>
                <span className="font-editorial-serif text-[8px] text-amber-200/70 italic">
                  Archival Verified
                </span>
              </div>
              <div className="w-full py-0.5 bg-amber-500/20 text-center font-editorial-mono text-[6px] text-amber-300 uppercase rounded">
                2026 CRITICS' CHOICE
              </div>

              {/* Exploded Callout Annotation: Seal */}
              <div
                className="exploded-callout absolute top-4 -left-36 sm:-left-44 pointer-events-none transition-all duration-300"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-black/95 border border-pink-400 rounded text-left shadow-2xl backdrop-blur-md">
                    <span className="block font-editorial-mono text-[9px] font-black text-pink-400 uppercase tracking-wider">
                      [ 05 · SERIALIZED SEAL ]
                    </span>
                    <span className="block font-editorial-sans text-[11px] text-white/90 font-bold whitespace-nowrap">
                      Hand-Numbered #120/500 Hologram
                    </span>
                  </div>
                  <div className="w-6 h-[1px] bg-pink-400 hidden sm:block" />
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* C. ASSEMBLED EDITORIAL CONTENT PANEL (Reveals on 0.70-1.0) */}
          {/* ───────────────────────────────────────────────────────── */}
          <div
            ref={editorialPanelRef}
            className="absolute right-4 sm:right-8 lg:right-12 max-w-lg lg:max-w-xl space-y-5 bg-[#14171f]/95 border-2 border-white/20 p-6 sm:p-8 rounded-2xl shadow-[12px_12px_0px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-100 z-30"
            style={{
              opacity: 0,
              pointerEvents: 'none',
              transform: 'translate3d(60px, 0, 0)',
            }}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--bg-accent-yellow)]/15 border border-[var(--bg-accent-yellow)]/40 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--bg-accent-yellow)] animate-ping" />
                <span className="font-editorial-mono text-[11px] font-black uppercase tracking-[0.22em] text-[var(--bg-accent-yellow)]">
                  CRITICS&apos; CHOICE · VOLUME 2026
                </span>
              </div>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mt-1">
                {book.title}
              </h2>
              <p className="font-editorial-mono text-xs sm:text-sm font-semibold text-white/70 mt-1">
                By {book.author} · Hardcover & Paperback Editions Available
              </p>
            </div>

            <blockquote className="border-l-4 border-[var(--bg-accent-yellow)] pl-4 italic font-editorial-sans text-base sm:text-lg text-white/90 leading-relaxed bg-white/5 py-2.5 rounded-r">
              &ldquo;You do not rise to the level of your goals. You fall to the level of your systems. A system is what produces enduring mastery.&rdquo;
            </blockquote>

            <p className="font-editorial-sans text-xs sm:text-sm text-white/70 leading-relaxed">
              {book.description}
            </p>

            {/* Technical Specification Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 font-editorial-mono text-xs font-bold">
              <div className="p-2.5 border border-white/10 bg-black/40 rounded">
                <span className="text-white/40 block text-[9px] uppercase tracking-wider">READING TIME</span>
                <span className="text-white font-black text-xs sm:text-sm">5.5 Hours</span>
              </div>
              <div className="p-2.5 border border-white/10 bg-black/40 rounded">
                <span className="text-white/40 block text-[9px] uppercase tracking-wider">BINDING</span>
                <span className="text-white font-black text-xs sm:text-sm">Smyth-Sewn</span>
              </div>
              <div className="p-2.5 border border-white/10 bg-black/40 rounded">
                <span className="text-white/40 block text-[9px] uppercase tracking-wider">STOCK READY</span>
                <span className="text-emerald-400 font-black text-xs sm:text-sm">{book.stock} Copies</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 font-editorial-mono text-xs sm:text-sm font-black uppercase tracking-wider bg-[var(--bg-accent-yellow)] text-black hover:bg-yellow-300 border-2 border-black transition-all shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1"
              >
                {addedNotice ? '✓ Added To Cart!' : `Order This Edition (₹${discPrice}) →`}
              </button>

              <Link
                href="/compare"
                className="py-3.5 px-4 font-editorial-mono text-xs font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all rounded"
              >
                Compare ⇄
              </Link>

              <button
                type="button"
                onClick={() => toggleWishlist(book)}
                className={`p-3 border border-white/20 rounded transition-all ${
                  isInWishlist(book.id)
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                }`}
                title="Save to Wishlist"
              >
                ♥
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom HUD Progress & Reassembly Guide ── */}
        <div className="relative z-30 pb-5 pt-3 px-6 lg:px-12 border-t border-white/10 bg-[#0d0f12]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Scroll Indicator Directive (As requested in Superdesign prompt) */}
            <div className="flex items-center gap-2 font-editorial-mono text-[11px] text-white/60 tracking-widest uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--bg-accent-yellow)] animate-pulse" />
              <span>
                {activePhase === 'unbox' && '↓ SCROLL TO UNBOX & DECONSTRUCT'}
                {activePhase === 'explode' && '↓ SCROLL TO EXPLODE & INSPECT CRAFTSMANSHIP'}
                {activePhase === 'assembled' && '✓ REASSEMBLED & LOCKED INTO EDITORIAL LAYOUT'}
              </span>
            </div>

            {/* Interactive Progress Meter */}
            <div className="flex items-center gap-4 w-full sm:w-80">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-amber-500 via-[var(--bg-accent-yellow)] to-emerald-400 transition-all duration-75"
                  style={{ width: '0%' }}
                />
              </div>
              <span
                ref={progressTextRef}
                className="font-editorial-mono text-xs font-black text-[var(--bg-accent-yellow)] w-10 text-right"
              >
                0%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
