'use client';
import React, { useRef, useState } from 'react';

interface CreepyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Override button background (default: Bookly black #1A1A1B) */
  primary?: string;
  /** Override hover background (default: #2a2a2b) */
  primaryHover?: string;
  /** Override eye / text color (default: #ffe17c yellow) */
  eyeColor?: string;
}

type Coords = { x: number; y: number };

export function CreepyButton({
  children,
  className = '',
  onClick,
  primary,
  primaryHover,
  eyeColor,
  style,
  ...props
}: CreepyButtonProps) {
  const eyesRef = useRef<HTMLSpanElement>(null);
  const [ec, setEc] = useState<Coords>({ x: 0, y: 0 });

  const tx = -50 + ec.x * 50;
  const ty = -50 + ec.y * 50;
  const eyeStyle: React.CSSProperties = { transform: `translate(${tx}%, ${ty}%)` };

  const updateEyes = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    const ev = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    if (!eyesRef.current) return;
    const rect = eyesRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ev.clientX - cx;
    const dy = ev.clientY - cy;
    const angle = Math.atan2(-dy, dx) + Math.PI / 2;
    const dist = Math.min(Math.hypot(dx, dy), 200);
    setEc({ x: (Math.sin(angle) * dist) / 150, y: (Math.cos(angle) * dist) / 100 });
  };

  const p5 = primary ?? '#1A1A1B';
  const p6 = primaryHover ?? '#2a2a2b';
  const eye = eyeColor ?? '#ffe17c';

  const cssVars = {
    '--cb-p5': p5,
    '--cb-p6': p6,
    '--cb-eye': eye,
    ...style,
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        .creepy-btn {
          background-color: #000;
          border-radius: 1.25em;
          color: var(--cb-eye);
          cursor: pointer;
          letter-spacing: .08em;
          min-width: 9em;
          padding: 0;
          border: 2px solid #000;
          outline: .1875em solid transparent;
          transition: outline .1s linear, box-shadow .2s;
          -webkit-tap-highlight-color: transparent;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 800;
          position: relative;
          display: inline-block;
          text-transform: uppercase;
          tracking-wider: .1em;
        }
        .creepy-btn:hover {
          box-shadow: 4px 4px 0 #000;
        }
        .creepy-btn__cover {
          background-color: var(--cb-p5);
          box-shadow: 0 0 0 .125em #000 inset;
          padding: .65em 1.4em;
          border-radius: inherit;
          display: block;
          position: relative;
          z-index: 1;
          transform-origin: 1.25em 50%;
          transition: background-color .3s, transform .3s cubic-bezier(.65,0,.35,1);
        }
        .creepy-btn__eyes {
          position: absolute;
          display: flex;
          align-items: center;
          gap: .375em;
          right: .9em;
          bottom: .55em;
          height: .75em;
          z-index: 0;
          pointer-events: none;
        }
        .creepy-btn__eye {
          animation: cb-blink 3s infinite;
          background-color: var(--cb-eye);
          border-radius: 50%;
          overflow: hidden;
          width: .75em;
          height: .75em;
          position: relative;
          display: block;
        }
        .creepy-btn__pupil {
          background-color: #000;
          border-radius: 50%;
          display: block;
          position: absolute;
          width: .375em;
          height: .375em;
          top: 50%;
          left: 50%;
        }
        .creepy-btn:focus-visible { outline: .1875em solid var(--cb-eye); }
        .creepy-btn:hover .creepy-btn__cover,
        .creepy-btn:focus-visible .creepy-btn__cover {
          background-color: var(--cb-p6);
          transform: rotate(-12deg);
          transition-timing-function: cubic-bezier(.65,0,.35,1.65);
        }
        .creepy-btn:active .creepy-btn__cover {
          transform: rotate(0);
          transition-timing-function: cubic-bezier(.65,0,.35,1);
        }
        @keyframes cb-blink {
          0%,92%,100% { animation-timing-function: cubic-bezier(.32,0,.67,0); height: .75em; }
          96%          { animation-timing-function: cubic-bezier(.33,1,.68,1); height: 0; }
        }
      `}</style>

      <button
        className={`creepy-btn ${className}`}
        type="button"
        style={cssVars}
        onClick={onClick}
        onMouseMove={updateEyes}
        onTouchMove={updateEyes}
        onMouseLeave={() => setEc({ x: 0, y: 0 })}
        {...props}
      >
        <span className="creepy-btn__eyes" ref={eyesRef}>
          <span className="creepy-btn__eye">
            <span className="creepy-btn__pupil" style={eyeStyle} />
          </span>
          <span className="creepy-btn__eye">
            <span className="creepy-btn__pupil" style={eyeStyle} />
          </span>
        </span>
        <span className="creepy-btn__cover">{children}</span>
      </button>
    </>
  );
}

export default CreepyButton;
