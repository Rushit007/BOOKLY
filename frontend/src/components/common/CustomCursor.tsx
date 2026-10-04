'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Ribbons } from './Ribbons';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<string>('default');
  const [cursorText, setCursorText] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect theme class on html element
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) {
        setIsVisible(true);
        document.body.classList.add('custom-cursor-active');
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
      observer.disconnect();
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Vibrant ribbon colors matching Bookly palette
  const ribbonColors = useMemo(
    () => (isDark ? ['#ffe17c', '#ffffff', '#38bdf8', '#a78bfa'] : ['#1A1A1B', '#f59e0b', '#2563eb', '#ec4899']),
    [isDark]
  );

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

  return (
    <>
      {/* ── Global Fluid Ribbon WebGL Layer (Spans entire screen, 100% click-through) ── */}
      <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden">
        <Ribbons
          isGlobal={true}
          colors={ribbonColors}
          baseThickness={38}
          baseSpring={0.04}
          baseFriction={0.88}
          speedMultiplier={0.6}
          maxAge={600}
          pointCount={55}
          enableFade={true}
          enableShaderEffect={true}
          effectAmplitude={1.6}
          backgroundColor={[0, 0, 0, 0]}
        />
      </div>

      {/* ── Custom Cursor Ball / Pointer Indicator & Contextual Badges ── */}
      {isVisible && (
        <div
          className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
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
            /* The sleek white ball cursor requested by the user, leading the fluid ribbon */
            <div className="w-4 h-4 rounded-full bg-white dark:bg-[#ffe17c] border-2 border-black shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform duration-75" />
          )}
        </div>
      )}
    </>
  );
}

export default CustomCursor;
