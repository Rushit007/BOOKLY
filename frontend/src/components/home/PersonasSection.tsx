'use client';
import React from 'react';
import Link from 'next/link';

const PERSONAS = [
  {
    badge: 'THE STUDENT',
    emoji: '🎓',
    title: 'Master the fundamentals before the market does.',
    points: ['Clean Code & DSA bibles', 'Budget-friendly editions', 'Exam-prep comparison tool', 'Free shipping over ₹500'],
    bg: '#b7c6c2',
    textColor: '#000',
    shadow: 'none',
    href: '/?category=computer-science#catalog',
  },
  {
    badge: 'THE PROFESSIONAL',
    emoji: '⚡',
    title: 'Every hour you spend reading compounds into leverage.',
    points: ['Business & leadership books', 'Book Match in 60 seconds', 'Order by 2PM, ships same day', '5% prepaid discount always'],
    bg: '#ffe17c',
    textColor: '#000',
    shadow: '8px 8px 0 #000',
    href: '/?category=business-finance#catalog',
  },
  {
    badge: 'THE ENTHUSIAST',
    emoji: '📚',
    title: 'You read to understand the world, not just to pass time.',
    points: ['Fiction, Science & History', 'BookBuddy AI recommendations', 'Wishlist with price alerts', 'Compare up to 4 editions'],
    bg: '#272727',
    textColor: '#fff',
    shadow: 'none',
    href: '/books',
  },
];

export function PersonasSection() {
  return (
    <section className="bg-white border-b-2 border-black py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="font-cabinet font-700 text-xs uppercase tracking-[0.25em] text-black/40 mb-3 text-center">
          Who is BOOKLY for?
        </p>
        <h2
          className="font-cabinet font-800 text-black text-center mb-12"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
        >
          A bookstore shaped around you.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERSONAS.map(p => (
            <div
              key={p.badge}
              className="border-2 border-black p-7 flex flex-col gap-5"
              style={{ backgroundColor: p.bg, boxShadow: p.shadow }}
            >
              {/* Badge pill */}
              <span
                className="self-start bg-white border-2 border-black px-3 py-1 font-cabinet font-700 text-xs uppercase tracking-wider text-black rounded-full"
              >
                {p.badge}
              </span>

              <div className="text-4xl">{p.emoji}</div>

              <h3
                className="font-cabinet font-800 text-xl leading-tight"
                style={{ color: p.textColor }}
              >
                {p.title}
              </h3>

              <ul className="space-y-2 flex-1">
                {p.points.map(pt => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="font-cabinet font-800 text-sm" style={{ color: p.textColor, opacity: 0.5 }}>→</span>
                    <span className="font-cabinet text-sm" style={{ color: p.textColor, opacity: 0.8 }}>{pt}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                className="self-start font-cabinet font-800 text-xs uppercase tracking-wide px-5 py-2.5 border-2 border-current transition-colors"
                style={{ color: p.textColor }}
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
