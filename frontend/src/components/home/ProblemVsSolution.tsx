'use client';
import React from 'react';

const PROBLEMS = [
  'Algorithm-driven, no curation',
  'Fake reviews & reseller listings',
  'Overwhelming choice, zero guidance',
  'No personalized recommendations',
  'Slow dispatch, poor packaging',
  'No price transparency',
];

const SOLUTIONS = [
  'Hand-curated, editorially selected titles',
  '100% genuine publisher first editions',
  'Book Match AI finds your perfect read in 60s',
  'Personal recommendations from 5 quiz answers',
  '24H dispatch, archival-grade packaging',
  '5% instant discount on every online payment',
];

export function ProblemVsSolution() {
  return (
    <section className="bg-white border-b-2 border-black py-20 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p className="font-cabinet font-700 text-xs uppercase tracking-[0.25em] text-black/40 mb-3 text-center">
          Problem vs Solution
        </p>
        <h2
          className="font-cabinet font-800 text-black text-center mb-12"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
        >
          Why BOOKLY beats the noise.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card A — Problem */}
          <div
            className="rounded-3xl p-8 space-y-4"
            style={{
              backgroundColor: '#f4f4f5',
              border: '2px dashed #d1d5db',
              opacity: 0.75,
            }}
          >
            <p className="font-cabinet font-800 text-black text-xl mb-5">
              🛒 Generic Bookstores
            </p>
            <ul className="space-y-3">
              {PROBLEMS.map(p => (
                <li key={p} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full border-2 border-black/30 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black text-red-500"
                    style={{ backgroundColor: '#fff' }}
                  >
                    ✕
                  </span>
                  <span className="font-cabinet text-black/70 text-sm leading-snug">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card B — Solution */}
          <div
            className="rounded-3xl p-8 space-y-4 border-2 border-black"
            style={{ backgroundColor: '#ffe17c', boxShadow: '8px 8px 0 #000' }}
          >
            <p className="font-cabinet font-800 text-black text-xl mb-5">
              📚 BOOKLY
            </p>
            <ul className="space-y-3">
              {SOLUTIONS.map(s => (
                <li key={s} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center shrink-0 mt-0.5 text-xs font-black bg-black text-white"
                  >
                    ✓
                  </span>
                  <span className="font-cabinet font-500 text-black text-sm leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
