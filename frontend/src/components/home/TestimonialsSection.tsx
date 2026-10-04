'use client';
import React, { useRef } from 'react';

const REVIEWS = [
  { quote: "BOOKLY's curation is extraordinary. Every book I've ordered has been exactly what I needed — the editorial approach makes it feel like buying from a legendary independent bookshop owner.", author: 'Priya Mehta', role: 'Principal Product Designer · Bengaluru', book: 'Deep Work', rating: 5, av: 'PM', col: '#ffe17c' },
  { quote: 'Used Book Match to find my next read — it recommended Designing Data-Intensive Applications and changed how I think about distributed systems. Genuinely impressed.', author: 'Arjun Sharma', role: 'Senior Staff Engineer · Pune', book: 'DDIA', rating: 5, av: 'AS', col: '#b7c6c2' },
  { quote: "The packaging is as premium as the books. Every order arrived in archival condition with a custom bookmark. I've gifted BOOKLY editions to four colleagues already.", author: 'Ritika Patel', role: 'Research Fellow · Mumbai', book: 'Atomic Habits', rating: 5, av: 'RP', col: '#e8d5f0' },
  { quote: "I've read 48 books this year and discovered 30 of them through BOOKLY's recommendations. The AI match tool understood my reading habits better than I did myself.", author: 'Vikram Nair', role: 'Founder · Chennai', book: 'The Pragmatic Programmer', rating: 5, av: 'VN', col: '#ffd4d4' },
  { quote: "BOOKLY is the only place I trust for engineering books. The compare feature helped me choose between three editions — the spec matrix saved hours of research.", author: 'Sneha Kulkarni', role: 'ML Engineer · Hyderabad', book: 'Clean Code', rating: 5, av: 'SK', col: '#d4f0ff' },
  { quote: "As someone who reads 3–4 books a month, finding the right next book used to be stressful. BOOKLY's Book Match eliminated that friction completely.", author: 'Karthik Rajan', role: 'CTO · Bangalore', book: 'The Phoenix Project', rating: 5, av: 'KR', col: '#ffe17c' },
  { quote: 'Hindi books section is exceptional. Found titles I could not locate anywhere else — delivered in pristine condition with original publisher binding.', author: 'Ananya Singh', role: 'Literature Professor · Delhi', book: 'Godan – Premchand', rating: 5, av: 'AN', col: '#b7c6c2' },
  { quote: 'The 7-day exchange policy is real. Had a damaged-copy issue — resolved within 24 hours with zero friction. This is what premium service looks like.', author: 'Rohan Desai', role: 'Consultant · Ahmedabad', book: 'Zero to One', rating: 5, av: 'RD', col: '#e8d5f0' },
  { quote: "I appreciate that BOOKLY doesn't just sell books — they curate them. Every title has been vetted. That editorial rigour shows in what they don't sell too.", author: 'Meera Iyer', role: 'Author & Scholar · Mysore', book: 'Thinking, Fast and Slow', rating: 5, av: 'MI', col: '#ffd4d4' },
  { quote: "BookBuddy AI recommended 'The Mom Test' when I described my startup struggles. Perfect suggestion. This is the future of book discovery.", author: 'Siddharth Rao', role: 'Startup Founder · Pune', book: 'The Mom Test', rating: 5, av: 'SR', col: '#d4f0ff' },
];

const VOICES = [
  { text: '"Priya M. — ★★★★★  BOOKLY is the only online bookstore I recommend to every person on my team. The curation is so sharp I\'ve never once been disappointed with a purchase."', col: '#ffe17c' },
  { text: '"Arjun S. — ★★★★★  I used the Book Match quiz three times this year. Each time it nailed exactly the kind of book my brain needed in that moment. Uncanny accuracy."', col: '#b7c6c2' },
  { text: '"Ritika P. — ★★★★★  Four BOOKLY orders this month. Four pristine deliveries. The archival-quality packaging alone justifies the premium — books arrived as if never touched."', col: '#e8d5f0' },
  { text: '"Vikram N. — ★★★★★  The compare feature showed side-by-side spec differences between two editions of the same book. Saved ₹300 and got the right version on first try."', col: '#ffd4d4' },
  { text: '"Sneha K. — ★★★★★  BookBuddy answered my question about distributed systems books in under 10 seconds — more accurate than most Google searches I\'ve done on the same topic."', col: '#d4f0ff' },
  { text: '"Karthik R. — ★★★★★  As a CTO I read differently from most. BOOKLY\'s filters understand depth — I can sort by complexity and find exactly the right intellectual challenge level."', col: '#ffe17c' },
];

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{ color: '#ffbc2e', fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

function ReviewCard({ r }: { r: (typeof REVIEWS)[0] }) {
  return (
    <div className="flex-shrink-0 w-80 border-2 border-black bg-white p-6 flex flex-col gap-4 select-none" style={{ boxShadow: '4px 4px 0 #000' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: r.col }}>{r.av}</div>
        <Stars n={r.rating} />
      </div>
      <p className="font-cabinet text-black/80 text-sm leading-relaxed flex-1">&ldquo;{r.quote}&rdquo;</p>
      <div className="border-t-2 border-black/10 pt-3 space-y-1">
        <p className="font-cabinet font-800 text-black text-xs">{r.author}</p>
        <p className="font-cabinet text-black/50 text-[11px]">{r.role}</p>
        <span className="inline-block font-cabinet text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 border border-black" style={{ backgroundColor: r.col }}>📚 {r.book}</span>
      </div>
    </div>
  );
}

function Track({ items, dur, rev }: { items: typeof REVIEWS; dur: number; rev?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="flex items-stretch gap-5"
      onMouseEnter={() => { if (ref.current) ref.current.style.animationPlayState = 'paused'; }}
      onMouseLeave={() => { if (ref.current) ref.current.style.animationPlayState = 'running'; }}
      style={{ animation: `${rev ? 'scrollRev' : 'scrollFwd'} ${dur}s linear infinite`, willChange: 'transform' }}
    >
      {items.map((r, i) => <ReviewCard key={i} r={r} />)}
    </div>
  );
}

function VoiceTrack({ items, dur }: { items: typeof VOICES; dur: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="flex items-stretch gap-6"
      onMouseEnter={() => { if (ref.current) ref.current.style.animationPlayState = 'paused'; }}
      onMouseLeave={() => { if (ref.current) ref.current.style.animationPlayState = 'running'; }}
      style={{ animation: `scrollFwd ${dur}s linear infinite`, willChange: 'transform' }}
    >
      {items.map((v, i) => (
        <div key={i} className="flex-shrink-0 w-[480px] px-7 py-6 border-l-4 select-none" style={{ borderLeftColor: v.col, backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <p className="font-cabinet text-white/90 text-sm leading-[1.9] italic">{v.text}</p>
        </div>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const doubled = [...REVIEWS, ...REVIEWS];
  const doubledV = [...VOICES, ...VOICES];
  const bg = '#b7c6c2';

  return (
    <>
      <style>{`
        @keyframes scrollFwd { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes scrollRev { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
      `}</style>

      {/* ── Section 1: Reader Reviews Ticker ── */}
      <section className="border-b-2 border-black py-20 overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <p className="font-cabinet font-700 text-xs uppercase tracking-[.25em] text-black/40 mb-3">Reader Reviews</p>
          <h2 className="font-cabinet font-800 text-black" style={{ fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1.1 }}>Readers who chose deliberately.</h2>
          <p className="font-cabinet text-black/60 text-base mt-3 max-w-xl mx-auto">10,000+ verified readers. Real opinions. Hover any card to pause.</p>
        </div>
        {/* Row 1 forward */}
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: `linear-gradient(to right,${bg},transparent)` }} />
          <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: `linear-gradient(to left,${bg},transparent)` }} />
          <div className="overflow-hidden"><div className="flex gap-5 pl-5"><Track items={doubled} dur={55} /></div></div>
        </div>
        {/* Row 2 reverse */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: `linear-gradient(to right,${bg},transparent)` }} />
          <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: `linear-gradient(to left,${bg},transparent)` }} />
          <div className="overflow-hidden"><div className="flex gap-5 pl-5"><Track items={doubled} dur={65} rev /></div></div>
        </div>
      </section>

      {/* ── Section 2: Slow "What Our Readers Say" Ticker ── */}
      <section className="border-b-2 border-black py-16 overflow-hidden" style={{ backgroundColor: '#1A1A1B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <p className="font-cabinet font-700 text-xs uppercase tracking-[.25em] text-white/30 mb-3">In Their Own Words</p>
          <h2 className="font-cabinet font-800 text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: 1.1 }}>What our readers say.</h2>
          <p className="font-cabinet text-white/40 text-sm mt-2">Hover to pause · Read at your own pace</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right,#1A1A1B,transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left,#1A1A1B,transparent)' }} />
          <div className="overflow-hidden"><div className="flex gap-6 pl-6"><VoiceTrack items={doubledV} dur={90} /></div></div>
        </div>
      </section>
    </>
  );
}
 
