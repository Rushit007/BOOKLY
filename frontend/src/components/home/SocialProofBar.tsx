'use client';
import React from 'react';

const NAMES = [
  'O\'REILLY MEDIA', 'PRENTICE HALL', '10,000+ READERS', 'ADDISON-WESLEY',
  'HARPER COLLINS', '4.9★ RATING', 'CROWN BUSINESS', 'FARRAR STRAUS',
  'BALLANTINE BOOKS', '24H DISPATCH', 'SIGNET CLASSIC', 'HARRIMAN HOUSE',
  'GRAND CENTRAL', '₹0 SHIPPING ₹500+', 'AVERY PUBLISHER', '100% GENUINE',
];

export function SocialProofBar() {
  const doubled = [...NAMES, ...NAMES];
  return (
    <div
      className="border-b-2 border-black overflow-hidden py-4"
      style={{ backgroundColor: '#171e19' }}
    >
      <div className="lumina-marquee gap-12">
        {doubled.map((name, i) => (
          <React.Fragment key={i}>
            <span
              className="font-cabinet font-700 text-sm uppercase tracking-widest whitespace-nowrap shrink-0"
              style={{ color: '#b7c6c2', opacity: 0.55 }}
            >
              {name}
            </span>
            <span className="shrink-0" style={{ color: '#b7c6c2', opacity: 0.25 }}>✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
