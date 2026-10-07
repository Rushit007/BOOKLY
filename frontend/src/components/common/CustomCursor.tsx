'use client';

import React, { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<string>('default');
  const [cursorText, setCursorText] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch desktop devices
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let rafId: number | null = null;
    let targetX = -100;
    let targetY = -100;

    const updatePosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        document.body.classList.add('custom-cursor-active');
      }

      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const type = cursorTarget.getAttribute('data-cursor') || 'hover';
        const text = cursorTarget.getAttribute('data-cursor-text') || '';
        setCursorType(type);
        setCursorText(text);
        return;
      }

      const isClickable = target.closest('button, a, input, select, textarea');
      if (isClickable) {
        setCursorType('interactive');
        setCursorText('');
      } else {
        setCursorType('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      document.body.classList.remove('custom-cursor-active');
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      document.body.classList.add('custom-cursor-active');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  const isLabel =
    cursorType === 'book' ||
    cursorType === 'add' ||
    cursorType === 'compare' ||
    Boolean(cursorText);

  const label =
    cursorText ||
    (cursorType === 'book'
      ? 'VIEW'
      : cursorType === 'add'
      ? 'ADD'
      : cursorType === 'compare'
      ? 'COMPARE'
      : '');

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 select-none will-change-transform"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        transition: 'opacity 0.15s ease',
      }}
    >
      {isLabel ? (
        <div className="flex items-center justify-center px-3.5 py-1.5 rounded-full bg-[#1A1A1B] text-[#ffe17c] font-editorial-mono text-[10px] font-black tracking-widest uppercase border-2 border-[#ffe17c] shadow-[3px_3px_0px_#000000]">
          {label}
        </div>
      ) : cursorType === 'interactive' ? (
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-black dark:border-[#ffe17c] bg-black/10 dark:bg-white/10 backdrop-blur-[1px] transition-all duration-150 animate-pulse" />
          <div className="absolute w-2 h-2 rounded-full bg-white dark:bg-[#ffe17c] border border-black" />
        </div>
      ) : (
        <div className="w-4 h-4 rounded-full bg-white dark:bg-[#ffe17c] border-2 border-black shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-transform duration-75" />
      )}
    </div>
  );
}

export default CustomCursor;
