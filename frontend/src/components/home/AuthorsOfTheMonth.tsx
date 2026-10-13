'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface AuthorData {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  nationality: string;
  booksPublishedCount: number;
  upcomingBook: {
    title: string;
    expectedDate: string;
    synopsis: string;
  };
  mostSold: {
    title: string;
    sales: string;
  };
  highestRated: {
    title: string;
    tier: string;
    score: string;
  };
  keyBooks: {
    id: string;
    title: string;
    year: string;
    price: number;
    cover: string;
    rating: string;
  }[];
}

const AUTHORS: AuthorData[] = [
  {
    id: 'author-1',
    name: 'James Clear',
    role: 'Behavioral Science & Systems Pioneer',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    nationality: 'American',
    bio: 'Author of the #1 New York Times bestseller Atomic Habits, translated into 50+ languages with over 15 million copies sold. His work specializes in habit formation, decision making, and continuous improvement.',
    booksPublishedCount: 4,
    upcomingBook: {
      title: 'The Clear Thinking Journal & System',
      expectedDate: 'November 2026',
      synopsis: 'A tactical handbook on mental models, structured decision logs, and intentional daily routines.',
    },
    mostSold: {
      title: 'Atomic Habits',
      sales: '15,000,000+ copies worldwide',
    },
    highestRated: {
      title: 'Atomic Habits',
      tier: 'Perfection',
      score: '99% Consensus',
    },
    keyBooks: [
      {
        id: 'book-4',
        title: 'Atomic Habits',
        year: '2018',
        price: 499,
        cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
        rating: 'Perfection',
      },
      {
        id: 'jc-2',
        title: 'Transform Your Habits',
        year: '2019',
        price: 349,
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
        rating: 'Go For It',
      },
    ],
  },
  {
    id: 'author-2',
    name: 'Robert C. Martin ("Uncle Bob")',
    role: 'Software Craftsmanship & Architecture Pioneer',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    nationality: 'American',
    bio: 'Founding author of the Agile Manifesto and legendary software craftsman. Uncle Bob has taught software architecture to tens of thousands of developers across three decades.',
    booksPublishedCount: 9,
    upcomingBook: {
      title: 'Clean Architecture: Enterprise Edition',
      expectedDate: 'December 2026',
      synopsis: 'Modern domain-driven paradigms, microservice boundaries, and event-sourced persistence layers.',
    },
    mostSold: {
      title: 'Clean Code',
      sales: '2,500,000+ copies in engineering libraries',
    },
    highestRated: {
      title: 'Clean Code',
      tier: 'Perfection',
      score: '98% Consensus',
    },
    keyBooks: [
      {
        id: 'book-1',
        title: 'Clean Code',
        year: '2008',
        price: 699,
        cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
        rating: 'Perfection',
      },
      {
        id: 'bob-2',
        title: 'Clean Architecture',
        year: '2017',
        price: 899,
        cover: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=600&auto=format&fit=crop',
        rating: 'Perfection',
      },
    ],
  },
  {
    id: 'author-3',
    name: 'Yuval Noah Harari',
    role: 'Historian, Philosopher & Archival Thinker',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    nationality: 'Israeli',
    bio: 'Professor in the Department of History at Hebrew University of Jerusalem and dual Polonsky Prize laureate. Author of Sapiens, Homo Deus, and Nexus exploring technology, truth, and humanity.',
    booksPublishedCount: 6,
    upcomingBook: {
      title: 'Nexus: A History of Information Networks',
      expectedDate: 'October 2026',
      synopsis: 'A profound examination of how information loops shaped the rise and fall of human societies.',
    },
    mostSold: {
      title: 'Sapiens: A Brief History of Humankind',
      sales: '23,000,000+ copies worldwide',
    },
    highestRated: {
      title: 'Sapiens',
      tier: 'Perfection',
      score: '99% Consensus',
    },
    keyBooks: [
      {
        id: 'book-11',
        title: 'Sapiens: A Brief History',
        year: '2014',
        price: 549,
        cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
        rating: 'Perfection',
      },
      {
        id: 'harari-2',
        title: '21 Lessons for the 21st Century',
        year: '2018',
        price: 499,
        cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?q=80&w=600&auto=format&fit=crop',
        rating: 'Go For It',
      },
    ],
  },
  {
    id: 'author-4',
    name: 'Munshi Premchand',
    role: 'Pioneer of Modern Hindi & Urdu Realism',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    nationality: 'Indian',
    bio: 'Revered as "Upanyas Samrat" (Emperor Among Novelists), Munshi Premchand revolutionized Indian literature with unmatched social empathy, portraying the rural heart of India with unflinching realism.',
    booksPublishedCount: 14,
    upcomingBook: {
      title: 'Premchand: The Complete Archival Hardbound Folio',
      expectedDate: 'January 2027',
      synopsis: 'Restored, unabridged Hindi and Urdu folios with original manuscript facsimile notes.',
    },
    mostSold: {
      title: 'Godan (गौदान)',
      sales: '5,000,000+ heritage copies in circulation',
    },
    highestRated: {
      title: 'Godan',
      tier: 'Perfection',
      score: '100% Consensus',
    },
    keyBooks: [
      {
        id: 'hindi-1',
        title: 'Godan (गौदान)',
        year: '1936',
        price: 199,
        cover: 'https://covers.openlibrary.org/b/isbn/9788171673322-L.jpg',
        rating: 'Perfection',
      },
      {
        id: 'prem-2',
        title: 'Nirmala (निर्मला)',
        year: '1927',
        price: 169,
        cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop',
        rating: 'Perfection',
      },
    ],
  },
  {
    id: 'author-5',
    name: 'Morgan Housel',
    role: 'Behavioral Finance & Human Psychology',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    nationality: 'American',
    bio: 'Partner at The Collaborative Fund and former Wall Street Journal columnist. Two-time winner of the Best in Business Award from the Society of American Business Editors and Writers.',
    booksPublishedCount: 3,
    upcomingBook: {
      title: 'Timeless Truths on Risk & Survival',
      expectedDate: 'February 2027',
      synopsis: 'Short stories and historical patterns on endurance, luck, and irrational market temperaments.',
    },
    mostSold: {
      title: 'The Psychology of Money',
      sales: '4,000,000+ copies worldwide',
    },
    highestRated: {
      title: 'The Psychology of Money',
      tier: 'Perfection',
      score: '97% Consensus',
    },
    keyBooks: [
      {
        id: 'book-5',
        title: 'The Psychology of Money',
        year: '2020',
        price: 399,
        cover: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg',
        rating: 'Perfection',
      },
      {
        id: 'mh-2',
        title: 'Same as Ever',
        year: '2023',
        price: 499,
        cover: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
        rating: 'Go For It',
      },
    ],
  },
];

interface UpcomingBookItem {
  id: string;
  title: string;
  author: string;
  expectedDate: string;
  category: string;
  synopsis: string;
  initialInterests: number;
  cover: string;
  format: string;
  preorderPerk: string;
}

const UPCOMING_BOOKS: UpcomingBookItem[] = [
  {
    id: 'up-1',
    title: 'The Clear Thinking Journal & System',
    author: 'James Clear',
    expectedDate: 'November 2026',
    category: 'Self-Help & Systems',
    synopsis: 'A tactical handbook on mental models, structured decision logs, and intentional daily routines.',
    initialInterests: 842,
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
    format: 'Archival Clothbound Hardcover • 352 Pages',
    preorderPerk: 'Free Habit Tracker + 20% Launch Credit',
  },
  {
    id: 'up-2',
    title: 'Nexus: Information Networks from Stone Age to AI',
    author: 'Yuval Noah Harari',
    expectedDate: 'October 2026',
    category: 'Science & History',
    synopsis: 'How information networks built civilization and now threaten to reshape our cognitive autonomy.',
    initialInterests: 1240,
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?q=80&w=600&auto=format&fit=crop',
    format: 'Gilded First Folio • 528 Pages',
    preorderPerk: 'Signed Collector Bookplate + Archival Dossier',
  },
  {
    id: 'up-3',
    title: 'Clean Architecture: Distributed Systems',
    author: 'Robert C. Martin',
    expectedDate: 'December 2026',
    category: 'Computer Science',
    synopsis: 'Mastering microservice boundaries, event storming, and immutable persistence architectures.',
    initialInterests: 690,
    cover: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=600&auto=format&fit=crop',
    format: 'Engineer\'s Hardbound Edition • 440 Pages',
    preorderPerk: 'Complimentary System Architecture Poster',
  },
  {
    id: 'up-4',
    title: 'Timeless Truths on Risk & Survival',
    author: 'Morgan Housel',
    expectedDate: 'February 2027',
    category: 'Business & Finance',
    synopsis: 'Short stories and historical patterns on endurance, luck, and irrational human temperaments.',
    initialInterests: 512,
    cover: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
    format: 'Special Deckle-Edge Hardbound • 320 Pages',
    preorderPerk: 'Collector Gilded Bookmark + VIP Access',
  },
];

export function AuthorsOfTheMonth() {
  const [mounted, setMounted] = useState(false);
  const [activeAuthorIdx, setActiveAuthorIdx] = useState(0);

  // Interest State with strict single count increment
  const [interests, setInterests] = useState<Record<string, number>>({
    'up-1': 842,
    'up-2': 1240,
    'up-3': 690,
    'up-4': 512,
  });
  const [userInterested, setUserInterested] = useState<Record<string, boolean>>({});

  // Pinned Horizontal Scroll Refs
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Hydrate user watchlist from localStorage so it persists across refreshes
    try {
      const savedWatchlist = localStorage.getItem('bookly_priority_watchlist');
      if (savedWatchlist) {
        const parsed = JSON.parse(savedWatchlist);
        if (parsed && typeof parsed === 'object') {
          setUserInterested(parsed);
        }
      }
      const savedCounts = localStorage.getItem('bookly_interest_counts');
      if (savedCounts) {
        const parsedCounts = JSON.parse(savedCounts);
        if (parsedCounts && typeof parsedCounts === 'object') {
          setInterests((prev) => ({
            ...prev,
            ...parsedCounts,
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to load priority watchlist from localStorage', e);
    }
  }, []);

  // Update horizontal position based on vertical scroll through the pinned container
  const updateHorizontalScroll = useCallback((progress: number) => {
    if (!horizontalTrackRef.current) return;
    const trackEl = horizontalTrackRef.current;
    const scrollWidth = trackEl.scrollWidth;
    const clientWidth = window.innerWidth;
    const maxScroll = Math.max(0, scrollWidth - clientWidth + 96);

    const translateX = -progress * maxScroll;
    trackEl.style.transform = `translate3d(${translateX}px, 0, 0)`;

    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
    }

    const currentIdx = Math.min(
      AUTHORS.length - 1,
      Math.floor(progress * AUTHORS.length)
    );
    setActiveAuthorIdx(currentIdx);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (!pinSectionRef.current) return;
      const rect = pinSectionRef.current.getBoundingClientRect();
      const sectionHeight = pinSectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const totalScrollable = sectionHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      updateHorizontalScroll(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, updateHorizontalScroll]);

  // Click handler to jump to a specific author in the horizontal pinning
  const scrollToAuthor = (idx: number) => {
    if (!pinSectionRef.current) return;
    const sectionTop = pinSectionRef.current.offsetTop;
    const sectionHeight = pinSectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollable = sectionHeight - viewportHeight;

    const targetProgress = idx / (AUTHORS.length - 1 || 1);
    const targetY = sectionTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  // Strictly +1 or -1 interest toggle with immediate localStorage persistence
  const handleInterestClick = (id: string) => {
    setUserInterested((prev) => {
      const isCurrently = Boolean(prev[id]);
      const nextUserInterested = {
        ...prev,
        [id]: !isCurrently,
      };
      try {
        localStorage.setItem('bookly_priority_watchlist', JSON.stringify(nextUserInterested));
      } catch (e) {
        console.warn('Failed to save priority watchlist to localStorage', e);
      }
      return nextUserInterested;
    });

    setInterests((prev) => {
      const isCurrently = Boolean(userInterested[id]);
      const nextInterests = {
        ...prev,
        [id]: (prev[id] || 0) + (isCurrently ? -1 : 1),
      };
      try {
        localStorage.setItem('bookly_interest_counts', JSON.stringify(nextInterests));
      } catch (e) {
        console.warn('Failed to save interest count to localStorage', e);
      }
      return nextInterests;
    });
  };

  const handleClearWatchlist = () => {
    setUserInterested({});
    try {
      localStorage.removeItem('bookly_priority_watchlist');
    } catch (e) {
      console.warn('Failed to clear priority watchlist', e);
    }
  };

  const interestedList = UPCOMING_BOOKS.filter((ub) => userInterested[ub.id]);

  return (
    <div className="bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      
      {/* ── 1. PINNED HORIZONTAL SCROLL: AUTHORS OF THE MONTH ── */}
      <div
        ref={pinSectionRef}
        id="authors-of-the-month"
        className="relative w-full border-b border-[var(--border-main)]"
        style={{ height: '360vh' }}
      >
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between py-8 px-4 sm:px-8 lg:px-12 bg-[var(--bg-page)]">
          
          {/* Top Bar: Section Header & Author Selector Pills */}
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-main)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-main)] text-[10px] font-mono font-bold tracking-widest uppercase mb-1 border border-[var(--border-main)]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>PINNED CURATOR SPOTLIGHT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[var(--text-main)]">
                Authors of the Month
              </h2>
            </div>

            {/* Author Nav Pills & Progress */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {AUTHORS.map((author, idx) => (
                  <button
                    key={author.id}
                    onClick={() => scrollToAuthor(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      activeAuthorIdx === idx
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)]'
                    }`}
                  >
                    {author.name}
                  </button>
                ))}
              </div>

              {/* Progress track */}
              <div className="hidden lg:flex items-center gap-2 border-l border-[var(--border-main)] pl-3">
                <div className="w-20 h-1.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-amber-400 transition-all duration-75"
                    style={{ width: '0%' }}
                  />
                </div>
                <span className="font-mono text-[10px] font-bold text-[var(--text-muted)]">
                  {String(activeAuthorIdx + 1).padStart(2, '0')}/{String(AUTHORS.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Horizontal Track Container */}
          <div className="relative w-full my-auto overflow-hidden py-4">
            <div
              ref={horizontalTrackRef}
              className="flex items-center gap-8 transition-transform duration-75 ease-out will-change-transform"
              style={{ width: 'max-content' }}
            >
              {AUTHORS.map((author, idx) => (
                <div
                  key={author.id}
                  className="w-[85vw] max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col lg:flex-row gap-8 items-center shrink-0"
                >
                  {/* Left Column: Portrait & Stats */}
                  <div className="lg:w-1/3 flex flex-col items-center text-center shrink-0">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[var(--bg-surface)] shadow-2xl ring-2 ring-amber-400/40 mb-4">
                      <img
                        src={author.photo}
                        alt={author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                      VOL. 0{idx + 1} SPOTLIGHT
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-[var(--text-main)] mt-1">
                      {author.name}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                      {author.role} · {author.nationality}
                    </p>

                    <div className="grid grid-cols-2 gap-2 w-full mt-5 pt-4 border-t border-[var(--border-subtle)]">
                      <div className="bg-[var(--bg-surface-elevated)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                        <p className="text-[9px] text-[var(--text-faint)] uppercase font-mono">Published</p>
                        <p className="text-sm font-black text-[var(--text-main)]">
                          {author.booksPublishedCount} Volumes
                        </p>
                      </div>
                      <div className="bg-[var(--bg-surface-elevated)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                        <p className="text-[9px] text-[var(--text-faint)] uppercase font-mono">Top Verdict</p>
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          👑 {author.highestRated.tier}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Bio, Track Record, and Key Editions */}
                  <div className="lg:w-2/3 space-y-5">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-[var(--text-faint)] tracking-widest mb-1">
                        Editorial Biography
                      </p>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed font-sans line-clamp-4">
                        {author.bio}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                        <span className="text-[9px] font-mono uppercase text-[var(--text-faint)] block mb-1">
                          Most Acclaimed Edition
                        </span>
                        <p className="font-serif font-bold text-sm text-[var(--text-main)]">
                          {author.mostSold.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{author.mostSold.sales}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                        <span className="text-[9px] font-mono uppercase text-[var(--text-faint)] block mb-1">
                          Consensus Rating
                        </span>
                        <p className="font-serif font-bold text-sm text-[var(--text-main)]">
                          👑 {author.highestRated.title}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                          {author.highestRated.score}
                        </p>
                      </div>
                    </div>

                    {/* Key Editions */}
                    <div className="pt-2">
                      <p className="text-[10px] font-mono uppercase text-[var(--text-faint)] tracking-widest mb-2">
                        Essential Archival Bibliography
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {author.keyBooks.map((book) => (
                          <div
                            key={book.id}
                            className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center gap-3"
                          >
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded shadow-sm shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[var(--text-main)] truncate">{book.title}</p>
                              <p className="text-[11px] text-[var(--text-faint)] font-mono">₹{book.price} · {book.year}</p>
                              <span className="inline-block mt-0.5 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                👑 {book.rating}
                              </span>
                            </div>
                            <Link
                              href={`/books/${book.id}`}
                              className="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--text-main)] hover:text-[var(--bg-page)] text-[var(--text-main)] text-xs font-bold transition shadow-2xs shrink-0"
                              title="Explore edition"
                            >
                              ↗
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Scroll Notice Bar */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-[var(--text-faint)] pt-3 border-t border-[var(--border-main)]">
            <span className="flex items-center gap-2">
              <span className="animate-bounce">↕</span>
              <span>SCROLL VERTICALLY TO EXPLORE ALL AUTHORS HORIZONTALLY BEFORE ADVANCING</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollToAuthor(Math.max(0, activeAuthorIdx - 1))}
                disabled={activeAuthorIdx === 0}
                className="px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] disabled:opacity-30 hover:bg-[var(--text-main)] hover:text-[var(--bg-page)] transition cursor-pointer"
              >
                ← PREV
              </button>
              <button
                onClick={() => scrollToAuthor(Math.min(AUTHORS.length - 1, activeAuthorIdx + 1))}
                disabled={activeAuthorIdx === AUTHORS.length - 1}
                className="px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] disabled:opacity-30 hover:bg-[var(--text-main)] hover:text-[var(--bg-page)] transition cursor-pointer"
              >
                NEXT →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. UPCOMING BOOKS & READER WATCHLIST SECTION ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-main)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-2 border border-amber-500/20">
              <span>✦ FUTURE EDITIONS IN PRODUCTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[var(--text-main)]">
              Upcoming Archival Releases
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xl">
              Preview manuscripts currently in binderies. Cast your interest to unlock priority print allocation and first-subscriber discounts upon release.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-main)] border border-[var(--border-main)] font-mono text-xs font-bold">
              ⭐ {interestedList.length} Pinned in Watchlist
            </span>
          </div>
        </div>

        {/* ── Interactive Tray: My Pinned Watchlist Section ── */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-amber-400/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg text-amber-500">⭐</span>
              <h3 className="font-serif font-black text-lg text-[var(--text-main)]">
                Your Priority Launch Watchlist
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black">
                {interestedList.length} Selected
              </span>
            </div>
            {interestedList.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  ✓ Saved to Local Storage (Auto-persists)
                </span>
                <button
                  onClick={handleClearWatchlist}
                  className="text-[11px] font-mono font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {interestedList.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-[var(--border-main)] rounded-2xl bg-[var(--bg-surface-elevated)]/40">
              <p className="font-serif text-base text-[var(--text-muted)]">
                You haven&apos;t marked interest in any upcoming titles yet.
              </p>
              <p className="text-xs text-[var(--text-faint)] mt-1">
                Click &quot;🤍 I&apos;m Interested&quot; on any upcoming volume below to pin it to your personal launch watchlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {interestedList.map((book) => (
                <div
                  key={'watchlist-' + book.id}
                  className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] flex items-center gap-3.5 relative group shadow-sm"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-14 h-20 object-cover rounded-lg shadow-md shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif font-bold text-xs text-[var(--text-main)] line-clamp-1">{book.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">By {book.author}</p>
                    <p className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold mt-1">
                      Due: {book.expectedDate}
                    </p>
                    <button
                      onClick={() => handleInterestClick(book.id)}
                      className="mt-2 text-[10px] font-mono text-rose-500 hover:text-rose-700 font-bold underline cursor-pointer"
                    >
                      Remove ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Upcoming Books Grid with Real Photo Covers & Rich Details ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UPCOMING_BOOKS.map((ub) => {
            const isInt = Boolean(userInterested[ub.id]);
            const count = interests[ub.id] ?? ub.initialInterests;

            return (
              <div
                key={ub.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-3xl p-5 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all group overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Real Book Cover Container with 3D shadow lift */}
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[var(--bg-surface-elevated)] shadow-md group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={ub.cover}
                      alt={ub.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20">
                        {ub.category}
                      </span>
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-xs">
                        {ub.expectedDate}
                      </span>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                      <p className="text-[10px] font-mono text-amber-300 font-bold">{ub.format}</p>
                    </div>
                  </div>

                  {/* Book Metadata */}
                  <div>
                    <h4 className="font-serif font-black text-base text-[var(--text-main)] line-clamp-2 leading-snug">
                      {ub.title}
                    </h4>
                    <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">By {ub.author}</p>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed mt-2">
                      {ub.synopsis}
                    </p>
                  </div>

                  {/* Preorder Perk Strip */}
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                    <span className="text-amber-500 font-bold">🎁</span>
                    <span className="truncate">{ub.preorderPerk}</span>
                  </div>
                </div>

                {/* Bottom Action Strip & Strictly Single-Step Interest Counter */}
                <div className="pt-4 mt-4 border-t border-[var(--border-main)] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[var(--text-muted)] font-medium">
                    <strong className="text-[var(--text-main)] font-black">{count.toLocaleString()}</strong> readers
                  </div>

                  <button
                    onClick={() => handleInterestClick(ub.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
                      isInt
                        ? 'bg-amber-400 text-black font-black border border-amber-500'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-main)] border border-[var(--border-main)] hover:bg-[var(--border-main)]'
                    }`}
                  >
                    <span>{isInt ? '❤️ Interested' : '🤍 I’m Interested'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </div>
  );
}
