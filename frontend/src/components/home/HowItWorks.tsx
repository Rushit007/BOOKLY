'use client';

import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
import Link from 'next/link';
import { CreepyButton } from '../common/CreepyButton';

const STEPS = [
  {
    number: '01',
    act: 'ACT 01 · CURATION',
    title: 'Curate or Match',
    lead: 'In every curated edition,',
    desc: 'Filter 16+ masterpieces by genre, price, or rating — or let Book Match AI pinpoint your ideal edition in 60s.',
    glow: '#ffe17c',
    bg: '#1f2620',
    href: '/books',
    cta: 'Explore Catalog',
  },
  {
    number: '02',
    act: 'ACT 02 · PRECISION',
    title: 'Deep Spec Compare',
    lead: 'discover the surgical craft of',
    desc: 'Audit binding durability, translations, paper weight, and typographical fidelity side-by-side in our Compare Tray.',
    glow: '#38bdf8',
    bg: '#14202b',
    href: '/compare',
    cta: 'Compare Editions',
  },
  {
    number: '03',
    act: 'ACT 03 · GUIDANCE',
    title: 'Consult BookBuddy AI',
    lead: 'unlocking conversational wisdom with',
    desc: 'Ask chapter questions, request Hindi/Gujarati classics, or track shipments 24/7 in fluent regional languages.',
    glow: '#a78bfa',
    bg: '#20182c',
    href: '#ai-chat',
    cta: 'Chat with BookBuddy',
    isChat: true,
  },
  {
    number: '04',
    act: 'ACT 04 · PRIVILEGE',
    title: 'Prepaid 5% Incentive',
    lead: 'claiming instant publisher rewards through',
    desc: 'Pay online via UPI, GPay, or Cards for an automated 5% checkout discount, packaged in archival-grade protective materials.',
    glow: '#f59e0b',
    bg: '#271c12',
    href: '/cart',
    cta: 'View Cart & Save',
  },
  {
    number: '05',
    act: 'ACT 05 · IMMERSION',
    title: 'Deliberate Reading',
    lead: 'that unites us in timeless ideas',
    desc: 'Unbox genuine first-edition publisher copies backed by our signature 7-Day Exchange Guarantee and lifetime reading membership.',
    glow: '#10b981',
    bg: '#12261b',
    href: '/books',
    cta: 'Start Reading Now',
  },
];

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const flowContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const activeStepTextRef = useRef<HTMLSpanElement>(null);

  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update horizontal tape position with velocity skew dynamics
  const updateTapePosition = useCallback((progress: number, velocity: number = 0) => {
    if (!flowContainerRef.current) return;
    const flowEl = flowContainerRef.current;
    const scrollWidth = flowEl.scrollWidth;
    const clientWidth = window.innerWidth;
    const maxScroll = Math.max(0, scrollWidth - clientWidth + 120);

    const translateX = -progress * maxScroll;
    // Dynamic skew effect based on scroll velocity (capped at 4deg for readability)
    const skewX = Math.max(-4, Math.min(4, velocity * 0.15));

    flowEl.style.transform = `translate3d(${translateX}px, 0, 0) skewX(${skewX}deg)`;

    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.innerText = `${Math.round(progress * 100)}%`;
    }

    const currentStepIdx = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
    setActiveStep(currentStepIdx);

    if (activeStepTextRef.current) {
      activeStepTextRef.current.innerText = `STEP 0${currentStepIdx + 1} / 0${STEPS.length} · ${STEPS[currentStepIdx].title.toUpperCase()}`;
    }
  }, []);

  // GSAP-aligned Scroll-Pinned Translation Engine
  // With requested safety check delay inside useLayoutEffect to ensure DOM widths are 100% measured
  useEffect(() => {
    if (!mounted) return;

    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScrollable = trackHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Calculate instant scroll velocity for subtle tape skew
      const currentScrollY = window.scrollY;
      const currentTime = performance.now();
      const dt = Math.max(16, currentTime - lastTime);
      const dy = currentScrollY - lastScrollY;
      const velocity = dy / dt;

      lastScrollY = currentScrollY;
      lastTime = currentTime;

      updateTapePosition(progress, velocity);
    };

    // Safety check delay ensures fonts and flex widths are fully calculated
    timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }, 60);

    const onResize = () => handleScroll();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [mounted, updateTapePosition]);

  // Jump to specific step
  const scrollToStep = (idx: number) => {
    if (!trackRef.current) return;
    const trackTop = trackRef.current.offsetTop;
    const trackHeight = trackRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = trackHeight - viewportHeight;

    const targetProgress = STEPS.length > 1 ? idx / (STEPS.length - 1) : 0;
    const targetScrollY = trackTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  return (
    <div
      ref={trackRef}
      id="how-it-works-flow"
      suppressHydrationWarning
      className="relative w-full border-b-2 border-black bg-[#101412]"
      style={{
        // 400vh gives ample vertical scroll runway to experience the horizontal ticker tape flow
        height: '400vh',
      }}
    >
      {/* ── Sticky Fullscreen Viewport (Pins vertical scroll until narrative finishes) ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">

        {/* ── Ambient Top HUD ── */}
        <div className="relative z-30 pt-6 sm:pt-8 px-6 lg:px-12 border-b-2 border-black bg-[#141a16]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ffe17c] animate-pulse" />
                <span className="font-editorial-mono font-bold text-xs text-[#ffe17c] uppercase tracking-widest">
                  GSAP Horizontal Scroll · Continuous Flow
                </span>
              </div>
              <h2
                className="font-editorial-serif font-black text-white tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
              >
                The Five Steps to Your Next Great Read.
              </h2>
            </div>

            {/* Step Status Badge & Scroll Meter */}
            <div className="flex items-center gap-4 self-start sm:self-auto">
              <div className="bg-black/50 border border-white/15 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
                <span
                  ref={activeStepTextRef}
                  className="font-editorial-mono text-xs font-black text-[#ffe17c] uppercase tracking-wider"
                >
                  STEP 01 / 05 · CURATE OR MATCH
                </span>
                <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-[#ffe17c] transition-all duration-75"
                    style={{ width: '0%' }}
                  />
                </div>
                <span
                  ref={progressTextRef}
                  className="font-editorial-mono text-xs font-black text-white w-9 text-right"
                >
                  0%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Continuous Horizontal Flowing Sentence & Step Stations ── */}
        <div className="relative z-20 flex-1 flex items-center overflow-hidden py-8">
          <div
            ref={flowContainerRef}
            className="flex items-center gap-8 sm:gap-14 px-8 sm:px-20 whitespace-nowrap will-change-transform transition-transform ease-out"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {/* Introductory Narrative Lead */}
            <div className="shrink-0 flex items-center gap-6">
              <span className="font-editorial-mono text-xs uppercase tracking-[0.3em] text-[#ffe17c] font-black border-2 border-[#ffe17c] px-3 py-1 bg-black/60 shadow-[3px_3px_0px_#ffe17c]">
                BEGIN JOURNEY
              </span>
              <h3
                className="font-editorial-serif font-black text-white/90 tracking-tight"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1.0 }}
              >
                At BOOKLY,
              </h3>
            </div>

            {/* 5 Distinct Horizontal Step Stations Linked Inline with Narrative */}
            {STEPS.map((step, idx) => (
              <React.Fragment key={'step-station-' + step.number}>
                {/* Embedded Sentence Conjunction Lead */}
                <div className="shrink-0 flex items-center gap-6">
                  <span
                    className="font-cabinet font-700 text-white/75 italic"
                    style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}
                  >
                    {step.lead}
                  </span>

                  {/* Flowing SVG connector punctuation */}
                  <svg
                    width="64"
                    height="24"
                    viewBox="0 0 64 24"
                    fill="none"
                    className="shrink-0 text-white/30"
                  >
                    <path
                      d="M2 12C14 2 26 22 38 12C50 2 56 18 62 12"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Rich Interactive Step Station Card */}
                <div
                  className="w-[380px] sm:w-[440px] shrink-0 border-3 border-black rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[10px_10px_0px_#000000] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                  style={{
                    backgroundColor: step.bg,
                    borderColor: step.glow,
                    boxShadow: `8px 8px 0px ${step.glow}40`,
                  }}
                >
                  {/* Subtle Background Glow */}
                  <div
                    className="absolute -top-20 -right-20 w-44 h-44 rounded-full pointer-events-none opacity-25 blur-2xl"
                    style={{ backgroundColor: step.glow }}
                  />

                  {/* Top Bar: Act Badge & Step Indicator */}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <span
                      className="font-editorial-mono text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-black border"
                      style={{ color: step.glow, borderColor: step.glow }}
                    >
                      {step.act}
                    </span>
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-editorial-mono font-black text-base shadow-[2px_2px_0px_#000]"
                      style={{
                        borderColor: step.glow,
                        color: step.glow,
                        backgroundColor: '#101412',
                      }}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Card Title & Description */}
                  <div className="relative z-10 space-y-3 mb-6">
                    <h4
                      className="font-editorial-serif font-black text-2xl sm:text-3xl text-white tracking-tight"
                      style={{ textShadow: `0 0 20px ${step.glow}30` }}
                    >
                      {step.title}
                    </h4>
                    <p className="font-cabinet text-sm sm:text-base text-[#b7c6c2] leading-relaxed whitespace-normal font-500">
                      {step.desc}
                    </p>
                  </div>

                  {/* Interactive Action Button */}
                  <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="font-editorial-mono text-[11px] text-white/50 font-bold">
                      Protocol {step.number} of 05
                    </span>
                    <Link href={step.href}>
                      <CreepyButton
                        primary="#1A1A1B"
                        primaryHover="#2a2a2b"
                        eyeColor={step.glow}
                        style={{ fontSize: '0.85rem', minWidth: '11em' }}
                      >
                        {step.cta} →
                      </CreepyButton>
                    </Link>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Climax of the continuous flow narrative */}
            <div className="shrink-0 flex items-center gap-6 pl-4">
              <span className="text-4xl">✦</span>
              <h3
                className="font-editorial-serif font-black text-[#ffe17c] tracking-tight"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1.0 }}
              >
                turning reading into pure transformation.
              </h3>
              <Link
                href="/books"
                className="font-cabinet font-800 text-sm sm:text-base uppercase tracking-widest px-8 py-5 bg-[#ffe17c] text-black border-3 border-black shadow-[6px_6px_0px_#ffffff] hover:bg-white transition-all ml-4"
              >
                Explore Full Library ↗
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom HUD Step Navigation & Indicator ── */}
        <div className="relative z-30 border-t-2 border-black bg-[#141a16] py-3 px-6 sm:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-editorial-mono text-[10px] font-bold uppercase text-[#b7c6c2]/60 mr-2 hidden sm:inline">
              Scroll down to flow horizontally or jump to act:
            </span>
            {STEPS.map((s, i) => (
              <button
                key={'how-nav-step-' + i}
                onClick={() => scrollToStep(i)}
                className={`font-editorial-mono text-xs font-black px-3 py-1 border-2 border-black rounded transition-all cursor-pointer ${
                  activeStep === i
                    ? 'bg-[#ffe17c] text-black shadow-[2px_2px_0px_#000] scale-105'
                    : 'bg-[#1e2621] text-[#b7c6c2] hover:bg-black hover:text-white'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-editorial-mono text-xs font-bold text-white flex items-center gap-2">
              <span className="animate-pulse text-[#ffe17c]">●</span>
              <span>Vertical scroll translates horizontally</span>
              <span className="font-black text-[#ffe17c]">→</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HowItWorks;
