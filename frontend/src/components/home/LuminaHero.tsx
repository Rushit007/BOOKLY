'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';

export function LuminaHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [bgMode, setBgMode] = useState<'grand-library' | 'cinema-video'>('grand-library');

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleBgMode = () => {
    setBgMode((prev) => (prev === 'grand-library' ? 'cinema-video' : 'grand-library'));
  };

  const curatorBooks = [
    {
      id: 'book-2',
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      cat: 'Systems Engineering',
      price: '₹1,250',
      cover: 'https://covers.openlibrary.org/b/id/10543594-L.jpg',
      verdict: 'PERFECTION',
      rating: '4.9',
    },
    {
      id: 'book-1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      cat: 'Craftsmanship',
      price: '₹699',
      cover: 'https://covers.openlibrary.org/b/id/10287413-L.jpg',
      verdict: 'PERFECTION',
      rating: '4.8',
    },
    {
      id: 'book-13',
      title: '1984',
      author: 'George Orwell',
      cat: 'Dystopian Classic',
      price: '₹249',
      cover: 'https://covers.openlibrary.org/b/id/8575782-L.jpg',
      verdict: 'PERFECTION',
      rating: '4.8',
    },
    {
      id: 'book-12',
      title: 'Zero to One',
      author: 'Peter Thiel',
      cat: 'Ventures & Tech',
      price: '₹360',
      cover: 'https://covers.openlibrary.org/b/id/12848981-L.jpg',
      verdict: 'RECOMMENDED',
      rating: '4.7',
    },
    {
      id: 'book-5',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      cat: 'Behavioral Finance',
      price: '₹399',
      cover: 'https://covers.openlibrary.org/b/id/10403362-L.jpg',
      verdict: 'PERFECTION',
      rating: '4.8',
    },
    {
      id: 'book-10',
      title: 'Cosmos',
      author: 'Carl Sagan',
      cat: 'Astrophysics & Mind',
      price: '₹424',
      cover: 'https://covers.openlibrary.org/b/id/12627914-L.jpg',
      verdict: 'PERFECTION',
      rating: '4.9',
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[var(--border-main)] bg-zinc-950 text-white min-h-[640px] flex items-center">
      {/* ── High-Quality Background Layer ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {bgMode === 'grand-library' ? (
          <>
            {/* Ultra High Quality Grand Archival Bookstore & Library Background */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 scale-100"
              style={{
                backgroundImage: `url('/hero-bookstore-bg.jpg')`,
                filter: 'brightness(0.95) contrast(1.1) saturate(1.15)',
              }}
            />
            {/* Subtle Amber Atmospheric Warmth */}
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-black/60 pointer-events-none" />
            {/* Edge and Text Legibility Contrast Vignettes */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/75 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              src="/videos/home-book-index.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center opacity-90 brightness-110 contrast-110 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left Column: Hero Content (Clean Floating Typography, No Box) ── */}
          <div className="lg:col-span-7">
            <div className="space-y-7">
              {/* Refined Minimal Badge */}
              <div className="inline-flex items-center gap-2.5 bg-black/50 backdrop-blur-md border border-[#42BFDD]/60 rounded-full px-4 py-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#42BFDD] animate-ping" />
                <span className="font-array font-bold text-xs text-[#42BFDD] uppercase tracking-wider">
                  Archival Editions · Personal Book Match
                </span>
              </div>

              {/* Minimal Headline */}
              <h1
                className="font-pixel font-bold text-white leading-[1.25] tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
                style={{ fontSize: 'clamp(1.75rem, 3.8vw, 2.85rem)' }}
              >
                Books that carry{' '}
                <span className="text-[#FF66B3] underline decoration-[#FF66B3]/60 underline-offset-4">
                  depth
                </span>{' '}
                and enduring substance.
              </h1>

              {/* Sub-line */}
              <p className="font-array text-zinc-100 text-sm sm:text-base leading-relaxed max-w-xl font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                Curated for inquisitive minds. Foundational engineering craft, seminal non-fiction, and timeless literature printed on archival paper for deliberate readers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/books"
                  className="px-8 py-3.5 rounded-full bg-[#FF66B3] text-white font-array uppercase tracking-wider text-xs font-bold hover:bg-[#42BFDD] hover:text-[#084B83] transition-all shadow-xl shadow-[#FF66B3]/40 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <span>Explore Collection</span>
                  <span className="text-xs">↗</span>
                </Link>
                <Link
                  href="/book-match"
                  className="px-7 py-3.5 rounded-full bg-black/60 text-white border border-white/25 backdrop-blur-md font-pixel text-[11px] font-semibold hover:border-[#42BFDD] hover:bg-black/80 transition-all shadow-lg flex items-center gap-2"
                >
                  <span className="text-[#FF66B3]">✦</span>
                  <span>Book Match Quiz</span>
                </Link>
              </div>

              {/* Trust Strip */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-zinc-200 border-t border-white/15 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                <span className="font-array text-xs font-semibold flex items-center gap-1.5">
                  <span className="text-[#42BFDD] font-black">✓</span> 100% Genuine First Editions
                </span>
                <span className="font-array text-xs font-semibold flex items-center gap-1.5">
                  <span className="text-[#42BFDD] font-black">✓</span> Archival Acid-Free Paper
                </span>
                <span className="font-array text-xs font-semibold flex items-center gap-1.5">
                  <span className="text-[#FF66B3] font-black">✓</span> Free Express Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Sleek Curator's Pick Showcase (Direct Floating View, No Box) ── */}
          <div className="lg:col-span-5 relative">
            <div className="relative space-y-4">
              {/* Header tag */}
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <div>
                  <span className="font-sans text-[11px] font-bold text-amber-400 uppercase tracking-widest block drop-shadow-md">
                    CURATOR&apos;S PICK
                  </span>
                  <h3 className="font-editorial-serif text-xl sm:text-2xl font-black text-white mt-0.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                    Essential Classics
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 border border-amber-400/50 shadow-md">
                  6 Volumes
                </span>
              </div>

              {/* Expanded Book List with Real Covers & Badges */}
              <div className="space-y-2.5 my-2 max-h-[370px] overflow-y-auto pr-1 custom-scrollbar">
                {curatorBooks.map((item, idx) => (
                  <Link
                    key={item.title}
                    href={`/books`}
                    className="p-2.5 rounded-xl border border-white/15 bg-black/40 hover:bg-black/65 backdrop-blur-md transition-all flex items-center justify-between gap-3 group hover:border-[#42BFDD]/50 shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Real Book Cover Thumbnail */}
                      <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 bg-black/60 border border-white/20 shadow-md">
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black/80 text-[9px] font-mono font-bold text-white flex items-center justify-center">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#42BFDD] transition-colors drop-shadow-sm">
                          {item.title}
                        </p>
                        <p className="font-sans text-[11px] text-zinc-300 truncate">
                          {item.author} · <span className="text-zinc-400 font-mono text-[10px]">{item.cat}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono font-bold text-emerald-400">
                            ★ {item.rating}
                          </span>
                          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-zinc-300 border border-white/10">
                            {item.verdict}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black text-amber-400 shrink-0 whitespace-nowrap pl-2 drop-shadow-sm">
                      {item.price}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Footer CTA */}
              <Link
                href="/books"
                className="w-full block py-3 rounded-xl text-center font-sans text-xs font-bold uppercase tracking-wider bg-white/95 hover:bg-[#42BFDD] hover:text-black text-black transition-all shadow-xl mt-2"
              >
                View Full Library Archive →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Atmosphere & Media Control Badges */}
      <div className="absolute bottom-4 right-6 z-20 hidden sm:flex items-center gap-2.5">
        <button
          onClick={toggleBgMode}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 hover:bg-black text-amber-300 hover:text-white text-[10px] font-mono border border-amber-500/40 backdrop-blur-md transition-all shadow-xl cursor-pointer"
          title="Switch hero visual atmosphere"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{bgMode === 'grand-library' ? '🏛️ GRAND LIBRARY HD' : '🎬 CINEMA REEL'}</span>
        </button>

        {bgMode === 'cinema-video' && (
          <button
            onClick={togglePlayback}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-[10px] font-mono border border-white/30 backdrop-blur-md transition-all shadow-xl cursor-pointer"
            title="Toggle hero background video"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isPlaying ? '⏸ PAUSE' : '▶ PLAY'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
