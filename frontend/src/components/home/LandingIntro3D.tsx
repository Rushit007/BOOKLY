'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { BooklyLogo } from '../common/BooklyLogo';

interface LandingIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function LandingIntro3D({ onComplete, forceShow = false }: LandingIntroProps) {
  const pathname = usePathname();
  const [isClientReady, setIsClientReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Strictly NEVER render intro video sequence on admin portal, login, or any non-index route
  if (pathname !== '/' || pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  const chapters = [
    'PROLOGUE · THE AWAKENING OF THE ARCHIVE',
    'CHAPTER I · CRAFTING THE ENDURING BOUND VOLUMES',
    'FINALE · WELCOME TO THE BOOKLY REPOSITORY',
  ];

  useEffect(() => {
    setIsClientReady(true);
    const isReplayRequested = typeof window !== 'undefined' && (forceShow || window.location.search.includes('replay=true'));
    const hasAlreadyPlayed = typeof window !== 'undefined' && sessionStorage.getItem('bookly_intro_completed');

    if (hasAlreadyPlayed && !isReplayRequested) {
      setDismissed(true);
      return;
    }

    // First visit in this session or user explicitly requested replay
    setDismissed(false);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleFinish();
      } else if (e.code === 'Space') {
        e.preventDefault();
        toggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [forceShow]);

  const handleFinish = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bookly_intro_completed', 'true');
    }
    setTimeout(() => {
      setDismissed(true);
      onComplete?.();
    }, 700);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration > 0) {
      const p = (currentTime / duration) * 100;
      setProgress(p);

      if (p < 35) {
        setActiveChapter(0);
      } else if (p < 75) {
        setActiveChapter(1);
      } else {
        setActiveChapter(2);
      }
    }
  };

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextState = !videoRef.current.muted;
    videoRef.current.muted = nextState;
    setIsMuted(nextState);
  };

  if (!isClientReady || dismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#050508] text-white flex flex-col items-center justify-center overflow-hidden select-none transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* ── Background Video Container ── */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/book-landing-animation.mp4"
          autoPlay
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleFinish}
          className="w-full h-full object-cover sm:object-contain max-h-screen brightness-105 contrast-105"
        />

        {/* Ambient Film Grain & Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70 pointer-events-none" />
      </div>

      {/* ── Goated Ambient Floating Golden Embers (Particle Layer) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-t from-amber-400 to-yellow-200 animate-pulse shadow-[0_0_8px_#f59e0b]"
            style={{
              width: `${Math.max(2, (i % 4) * 2 + 2)}px`,
              height: `${Math.max(2, (i % 4) * 2 + 2)}px`,
              top: `${(i * 19) % 95}%`,
              left: `${(i * 23) % 95}%`,
              opacity: 0.3 + (i % 6) * 0.12,
              animationDuration: `${2.5 + (i % 5)}s`,
              transform: `translateY(${Math.sin(i) * 20}px)`,
            }}
          />
        ))}
      </div>

      {/* ── Luxury Archival Gilded Corner Brackets (Cinematic Framing) ── */}
      <div className="absolute inset-6 pointer-events-none border border-amber-500/25 rounded-2xl z-30 hidden sm:block">
        <div className="absolute top-2 left-2 text-amber-400 font-mono text-xs opacity-75">╔ 01</div>
        <div className="absolute top-2 right-2 text-amber-400 font-mono text-xs opacity-75">ARCHIVAL ╗</div>
        <div className="absolute bottom-2 left-2 text-amber-400 font-mono text-xs opacity-75">╚ PRESS</div>
        <div className="absolute bottom-2 right-2 text-amber-400 font-mono text-xs opacity-75">EST. 2026 ╝</div>
      </div>

      {/* ── Top Bar: Custom Unique Brand Logo, Audio Visualizer & Controls ── */}
      <div className="absolute top-6 left-0 right-0 max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
          <BooklyLogo size="sm" showText={false} />
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-white font-serif flex items-center gap-1.5">
              <span>BOOKLY</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 font-mono">
                ARCHIVAL
              </span>
            </p>
            <p className="text-[10px] text-zinc-400 font-mono tracking-wider">
              {chapters[activeChapter]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Wave Equalizer Button */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="px-4 py-2 rounded-full bg-black/70 hover:bg-zinc-900 text-xs font-mono text-zinc-200 border border-white/15 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
          >
            {/* Visualizer bars */}
            <div className="flex items-end gap-0.5 h-3">
              <span className={`w-0.5 bg-amber-400 rounded-full transition-all ${isMuted ? 'h-1' : 'h-3 animate-pulse'}`} />
              <span className={`w-0.5 bg-amber-400 rounded-full transition-all ${isMuted ? 'h-1.5' : 'h-2 animate-bounce'}`} />
              <span className={`w-0.5 bg-amber-400 rounded-full transition-all ${isMuted ? 'h-1' : 'h-3.5 animate-pulse'}`} />
            </div>
            <span>{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
          </button>

          {/* Skip / Enter Archive Button */}
          <button
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-white/40"
          >
            <span>Enter Archive</span>
            <span className="text-xs font-black">↗</span>
          </button>
        </div>
      </div>

      {/* ── Center Prologue Accent ── */}
      <div className="absolute bottom-24 left-0 right-0 max-w-xl mx-auto px-6 text-center z-40 pointer-events-none">
        <p className="font-editorial-serif text-sm sm:text-base text-zinc-300 drop-shadow-md italic">
          &ldquo;A deliberate library of foundational engineering craft and timeless literature.&rdquo;
        </p>
      </div>

      {/* ── Bottom Progress Bar & Time Indicator ── */}
      <div className="absolute bottom-6 left-6 right-6 max-w-6xl mx-auto z-50 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold tracking-wider text-amber-300 uppercase">
              {chapters[activeChapter]}
            </span>
          </div>
          <span className="text-zinc-400 font-semibold">{Math.round(progress)}% · Press ESC to skip</span>
        </div>
        <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden backdrop-blur-md border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-[#FF66B3] to-[#42BFDD] transition-all duration-100 ease-out shadow-[0_0_12px_#FF66B3]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
