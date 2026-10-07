'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { generateBookCoverSvg, VERIFIED_BOOK_COVERS } from '../../utils/bookCovers';

interface WorksWheelProps {
  books: Book[];
  label?: string;
  action?: string;
}

function discountedPrice(price: number, discount: number) {
  return Math.round(price * (1 - discount / 100));
}

export function WorksWheel({ books, label = 'Discover Your Next Read', action = 'View Book' }: WorksWheelProps) {
  const total = books.length;
  // rotationDeg: the current rotation of the whole wheel in degrees
  const [rotationDeg, setRotationDeg] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetRotRef = useRef(0);

  // Each book occupies 360/total degrees around the circle
  const sliceDeg = total > 0 ? 360 / total : 0;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // Smooth interpolation toward target rotation
  const animateToTarget = useCallback(() => {
    const diff = targetRotRef.current - rotationRef.current;
    if (Math.abs(diff) < 0.05) {
      rotationRef.current = targetRotRef.current;
      setRotationDeg(rotationRef.current);
      const idx = Math.round((-rotationRef.current / sliceDeg + total * 1000)) % total;
      setActiveIdx(((idx % total) + total) % total);
      rafRef.current = null;
      return;
    }
    rotationRef.current += diff * 0.09;
    setRotationDeg(rotationRef.current);

    const idx = Math.round((-rotationRef.current / sliceDeg + total * 1000)) % total;
    setActiveIdx(((idx % total) + total) % total);

    rafRef.current = requestAnimationFrame(animateToTarget);
  }, [sliceDeg, total]);

  // Scroll handler: rotate wheel smoothly only when visible
  useEffect(() => {
    if (!mounted || total === 0) return;

    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { rootMargin: '100px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const onScroll = () => {
      if (!isVisible || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const maxScroll = sectionRef.current.offsetHeight - window.innerHeight;
      if (maxScroll > 0) {
        const progress = Math.max(0, Math.min(1, -rect.top / maxScroll));
        targetRotRef.current = progress * 360 * 1.5;
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(animateToTarget);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, animateToTarget, total]);

  // Manual navigation
  const goTo = (idx: number) => {
    const normalized = ((idx % total) + total) % total;
    targetRotRef.current = -normalized * sliceDeg;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animateToTarget);
    }
  };
  const goPrev = () => {
    targetRotRef.current -= sliceDeg;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animateToTarget);
  };
  const goNext = () => {
    targetRotRef.current += sliceDeg;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animateToTarget);
  };

  // Keyboard
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
  };

  if (total === 0) return null;

  const activeBook = books[activeIdx];
  const finalPrice = discountedPrice(activeBook.price, activeBook.discount);

  return (
    <div
      ref={sectionRef as any}
      id="works-wheel"
      className="relative w-full border-b-2 border-[var(--border-main)] bg-[var(--bg-page)]"
      style={{ height: '130vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* ── Header bar ── */}
        <div className="border-b-2 border-[var(--border-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-block w-3 h-3 bg-[var(--bg-accent-pink)] border-2 border-[var(--border-main)]" />
            <div>
              <p className="font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)]">
                SCROLL TO SPIN · CIRCULAR WHEEL VIEW
              </p>
              <h2 className="font-editorial-serif text-2xl sm:text-3xl text-[var(--text-main)] mt-0.5">
                {label}
              </h2>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="font-editorial-mono text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
              {activeIdx + 1} / {total}
            </span>
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="w-9 h-9 border-2 border-[var(--border-main)] flex items-center justify-center hover:bg-[var(--bg-surface-elevated)] transition-colors font-editorial-mono text-sm"
            >←</button>
            <button
              onClick={goNext}
              aria-label="Next"
              className="w-9 h-9 border-2 border-[var(--border-main)] flex items-center justify-center hover:bg-[var(--bg-surface-elevated)] transition-colors font-editorial-mono text-sm"
            >→</button>
          </div>
        </div>
      </div>

      {/* ── Body: Wheel + Detail ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">

          {/* ─── THE CIRCULAR WHEEL ─── */}
          <div
            className="relative flex-shrink-0 outline-none"
            style={{ width: '420px', height: '420px', maxWidth: '90vw', maxHeight: '90vw' }}
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-label="Book wheel — scroll page or use arrow keys"
          >
            {/* Outer ring decoration */}
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '50%',
                border: '2px dashed var(--border-subtle)',
                pointerEvents: 'none',
              }}
            />
            {/* Center hub */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '56px',
                height: '56px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-accent-pink)',
                border: '3px solid var(--border-main)',
                boxShadow: '3px 3px 0 var(--border-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: '22px' }}>📚</span>
            </div>

            {/* Active book indicator pointer (at bottom, 270deg position) */}
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-accent-yellow)',
                border: '2px solid var(--border-main)',
                zIndex: 25,
                pointerEvents: 'none',
              }}
            />

            {/* The spinning ring — ALL books rotate together */}
            <div
              suppressHydrationWarning
              style={{
                position: 'absolute',
                inset: 0,
                transform: `rotate(${mounted ? rotationDeg : 0}deg)`,
                transition: reducedMotion ? 'none' : undefined,
                transformOrigin: '50% 50%',
              }}
            >
              {books.map((book, i) => {
                const angleDeg = i * sliceDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const radius = 165;
                const cx = Math.round(Math.sin(angleRad) * radius * 100) / 100;
                const cy = Math.round(-Math.cos(angleRad) * radius * 100) / 100;

                const currentRot = mounted ? rotationDeg : 0;
                const absoluteAngle = ((angleDeg + currentRot) % 360 + 360) % 360;
                const distFromBottom = Math.min(Math.abs(absoluteAngle - 180), 360 - Math.abs(absoluteAngle - 180));
                const isActive = distFromBottom < sliceDeg / 2;

                return (
                  <div
                    key={book.id}
                    suppressHydrationWarning
                    onClick={() => goTo(i)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '88px',
                      height: 'auto',
                      transform: `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px)) rotate(${-currentRot}deg)`,
                      transition: reducedMotion ? 'none' : 'opacity 0.3s ease, box-shadow 0.3s ease',
                      cursor: isActive ? 'default' : 'pointer',
                      zIndex: isActive ? 15 : 10,
                    }}
                  >
                    {/* Book card */}
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '3/4',
                        border: isActive
                          ? '3px solid var(--border-main)'
                          : '2px solid var(--border-subtle)',
                        boxShadow: isActive
                          ? '5px 5px 0 var(--border-main)'
                          : '2px 2px 0 var(--border-subtle)',
                        overflow: 'hidden',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        opacity: isActive ? 1 : 0.65,
                        transform: isActive ? 'scale(1.18)' : 'scale(1)',
                        transition: reducedMotion
                          ? 'none'
                          : 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease, box-shadow 0.3s ease',
                      }}
                    >
                      {(() => {
                        const verified = VERIFIED_BOOK_COVERS[book.id] || book.coverImage;
                        const fallbackSvg = generateBookCoverSvg({
                          title: book.title,
                          author: book.author,
                          category: book.category?.name,
                        });
                        const src = imgErrors[book.id] ? fallbackSvg : (verified || fallbackSvg);

                        return (
                          <img
                            src={src}
                            alt={book.title}
                            draggable={false}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }}
                            onError={() => {
                              if (!imgErrors[book.id]) {
                                setImgErrors(p => ({ ...p, [book.id]: true }));
                              }
                            }}
                          />
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll hint label */}
            <p
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-32px',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--text-faint)',
                pointerEvents: 'none',
              }}
            >
              ↕ scroll page to spin wheel
            </p>
          </div>

          {/* ─── ACTIVE BOOK DETAIL ─── */}
          <div
            className="w-full lg:max-w-md"
            key={`detail-${activeBook.id}`}
            style={{
              animation: reducedMotion ? 'none' : 'ww-slide-in 0.42s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            <div
              className="bg-[var(--bg-surface)] p-6 sm:p-8"
              style={{ border: '2px solid var(--border-main)', boxShadow: '7px 7px 0 var(--border-main)' }}
            >
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span
                  className="font-editorial-mono text-[9px] uppercase tracking-[0.22em] font-bold px-2.5 py-1 border-2 border-[var(--border-main)]"
                  style={{ backgroundColor: 'var(--bg-accent-yellow)', color: '#000' }}
                >
                  {activeBook.category?.name ?? 'Book'}
                </span>
                {activeBook.discount > 0 && (
                  <span
                    className="font-editorial-mono text-[9px] uppercase tracking-[0.18em] font-bold px-2.5 py-1 border-2 border-[var(--border-main)]"
                    style={{ backgroundColor: 'var(--bg-accent-pink)', color: '#fff' }}
                  >
                    -{activeBook.discount}% OFF
                  </span>
                )}
                <span
                  className="font-editorial-mono text-[9px] uppercase font-bold px-2.5 py-1 border-2 border-[var(--border-main)]"
                  style={{
                    backgroundColor: activeBook.stock > 50 ? 'var(--bg-accent-mint)' : activeBook.stock > 10 ? 'var(--bg-accent-yellow)' : 'var(--bg-accent-red)',
                    color: activeBook.stock > 50 ? '#fff' : '#000',
                  }}
                >
                  {activeBook.stock > 50 ? 'In Stock' : activeBook.stock > 0 ? `${activeBook.stock} left` : 'Sold Out'}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-editorial-serif font-black text-[var(--text-main)]"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.1 }}
              >
                {activeBook.title}
              </h3>

              {activeBook.subtitle && (
                <p className="font-editorial-sans text-sm italic text-[var(--text-muted)] mt-1">
                  {activeBook.subtitle}
                </p>
              )}

              {/* Author + rating */}
              <div className="flex flex-wrap items-center gap-4 mt-3 mb-4">
                <span className="font-editorial-mono text-[11px] uppercase tracking-wider text-[var(--text-faint)]">
                  By {activeBook.author}
                </span>
                <span className="font-editorial-mono text-sm font-bold text-[var(--text-main)]">
                  {activeBook.rating.toFixed(1)} ★
                </span>
                <span className="font-editorial-mono text-xs text-[var(--text-faint)]">
                  ({activeBook.numReviews.toLocaleString()} reviews)
                </span>
              </div>

              {/* Description */}
              <p
                className="font-editorial-sans text-sm text-[var(--text-muted)] leading-relaxed mb-5"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                  overflow: 'hidden',
                }}
              >
                {activeBook.description}
              </p>

              {/* Price row */}
              <div
                className="flex items-baseline gap-3 mb-6 pt-4"
                style={{ borderTop: '2px solid var(--border-subtle)' }}
              >
                <span className="font-editorial-mono font-black text-2xl text-[var(--text-main)]">
                  ₹{finalPrice}
                </span>
                {activeBook.discount > 0 && (
                  <span className="font-editorial-mono text-sm text-[var(--text-faint)] line-through">
                    ₹{activeBook.price}
                  </span>
                )}
                {activeBook.publisher && (
                  <span className="ml-auto font-editorial-mono text-[10px] text-[var(--text-faint)] uppercase tracking-wide hidden sm:block">
                    {activeBook.publisher}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/books/${activeBook.id}`}
                  className="font-editorial-mono text-xs font-black uppercase tracking-wider px-7 py-3.5 flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor: 'var(--text-main)',
                    color: 'var(--bg-page)',
                    border: '2px solid var(--border-main)',
                    boxShadow: '4px 4px 0 var(--border-main)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = 'var(--bg-accent-yellow)';
                    el.style.color = '#000';
                    el.style.transform = 'translate(-2px,-2px)';
                    el.style.boxShadow = '6px 6px 0 var(--border-main)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = 'var(--text-main)';
                    el.style.color = 'var(--bg-page)';
                    el.style.transform = '';
                    el.style.boxShadow = '4px 4px 0 var(--border-main)';
                  }}
                >
                  {action} ↗
                </Link>
                <Link
                  href="/books"
                  className="font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] underline underline-offset-4 px-2 transition-colors"
                >
                  Browse All
                </Link>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-start gap-2 mt-5 flex-wrap">
              {books.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to ${books[i].title}`}
                  title={books[i].title}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === activeIdx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: i === activeIdx ? 'var(--bg-accent-pink)' : 'var(--border-subtle)',
                    border: '2px solid var(--border-main)',
                    transition: 'all 0.35s ease',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
