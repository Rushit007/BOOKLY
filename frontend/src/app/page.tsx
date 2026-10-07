'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book, Category, BookSortOption } from '../types/book';
import { api } from '../services/api';
import { HeroSection } from '../components/home/HeroSection';
import { LuminaHero } from '../components/home/LuminaHero';
import { SocialProofBar } from '../components/home/SocialProofBar';
import { ProblemVsSolution } from '../components/home/ProblemVsSolution';
import { FlyingPostersGallery } from '../components/home/FlyingPostersGallery';
import { HowItWorks } from '../components/home/HowItWorks';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FinalCTA } from '../components/home/FinalCTA';
import { CategoryBar } from '../components/home/CategoryBar';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { IndianLanguageSection } from '../components/home/IndianLanguageSection';
import { ExplodedBookSection } from '../components/home/ExplodedBookSection';
import { WorksWheel } from '../components/home/WorksWheel';
import { BookGrid } from '../components/books/BookGrid';
import { BookFilters } from '../components/books/BookFilters';
import { BookSort } from '../components/books/BookSort';
import { useCart } from '../context/CartContext';
import { MOCK_BOOKS } from '../data/mockBooks';

// ── Feature Cards Data with Deep Info & Guidance ──────────────────
interface FeatureInfo {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  color: string;
  href: string;
  cta: string;
  isChatbot?: boolean;
  howItWorks: string[];
  whyItMatters: string;
  proTip: string;
}

const FEATURES: FeatureInfo[] = [
  {
    id: 'compare',
    icon: '⇄',
    title: 'Edition Compare',
    tagline: 'Side-by-side book analysis',
    description:
      'Add up to 4 books and compare them instantly — price, ratings, category, publisher, and key specs all in one clean table. Make smarter buying decisions with full transparency.',
    color: 'var(--bg-accent-blue)',
    href: '/compare',
    cta: 'Compare Books',
    howItWorks: [
      'Click the "+ Compare Edition" button on any book card across the store.',
      'A floating comparison drawer appears at the bottom with your selected titles.',
      'Click "Compare Now" to view a full spec matrix: price breakdown, discount, ratings, page counts, and publisher details.',
      'Directly add the winner to your cart with one tap.',
    ],
    whyItMatters: 'Avoid buyer regret by directly juxtaposing foundational books before committing your reading time.',
    proTip: 'Compare "Clean Code" against "The Pragmatic Programmer" to choose your engineering roadmap.',
  },
  {
    id: 'book-match',
    icon: '⚡',
    title: 'Book Match AI',
    tagline: 'Find your perfect read in 60s',
    description:
      'Answer 5 quick questions about your current mood, reading goals, and preferred pacing. Our smart engine curates a personalized shortlist from our entire catalog.',
    color: 'var(--bg-accent-yellow)',
    href: '/book-match',
    cta: 'Try Book Match',
    howItWorks: [
      'Select your current mindset (Deep Focus, Career Pivot, Fiction Escape, or Wisdom).',
      'Choose your preferred reading depth and weekly time commitment.',
      'Our intelligent recommendation engine scores all catalog editions.',
      'Get an instant top-3 personalized match list with editorial rationale.',
    ],
    whyItMatters: 'Cuts through decision fatigue so you spend less time browsing and more time immersed in great ideas.',
    proTip: 'Retake the quiz whenever your reading goals shift between quarters.',
  },
  {
    id: 'ai-chat',
    icon: '💬',
    title: 'BookBuddy AI',
    tagline: 'Your 24/7 reading companion',
    description:
      'Ask BookBuddy anything — Hindi/Gujarati book recommendations, order tracking, payment help, or feature guidance. Knows the full BOOKLY catalog inside-out, including Indian language books.',
    color: 'var(--bg-accent-violet)',
    href: '#',
    cta: 'Chat with BookBuddy',
    isChatbot: true,
    howItWorks: [
      'Click the 💬 floating button at the bottom-right corner of any page.',
      'Ask in plain English or Hindi/Gujarati: "हिंदी पुस्तकें कौन सी हैं?" or "Best book for startups?"',
      'Get specific answers with direct page links — not vague responses.',
      'Quick topic buttons for fast answers on payments, shipping, and recommendations.',
    ],
    whyItMatters: 'BookBuddy knows every book, page, feature, and policy at BOOKLY. Real help, 24/7.',
    proTip: 'Ask BookBuddy about Hindi or Gujarati books — it speaks your language!',
  },
  {
    id: 'catalog',
    icon: '◈',
    title: 'Curated Catalog',
    tagline: '16+ handpicked masterpieces',
    description:
      'Browse our collection with smart filters for genre, price, rating, and stock availability. Every title is hand-selected by our editorial team for enduring substance.',
    color: 'var(--bg-accent-mint)',
    href: '#catalog',
    cta: 'Browse Catalog',
    howItWorks: [
      'Filter by 6 curated categories: Computer Science, Fiction, Self-Help, Business, Science, and Design.',
      'Use price sliders, minimum rating filters, and instant keyword search.',
      'Sort by Price, Rating, or Newest Editions with zero lag.',
    ],
    whyItMatters: 'We reject 95% of published books to keep only the rarest, most transformative titles.',
    proTip: 'Use the quick search box in the header to jump to any title or author in 1 keystroke.',
  },
  {
    id: 'wishlist',
    icon: '♡',
    title: 'Saved Editions',
    tagline: 'Your persistent reading queue',
    description:
      'Save any book to your wishlist with one click. Build your future reading queue, share it with friends, or move items directly to your cart when ready.',
    color: 'var(--bg-accent-pink)',
    href: '/wishlist',
    cta: 'View Wishlist',
    howItWorks: [
      'Click the heart icon on any book cover to save it.',
      'Your saved items remain securely stored across browser sessions.',
      'Receive automatic visual badges when saved editions go on discount.',
      'Move all items directly to your cart when you are ready to checkout.',
    ],
    whyItMatters: 'Never lose track of a great book recommendation you heard on a podcast or from a mentor.',
    proTip: 'Items in your wishlist get automatically notified if stock drops below 10 copies.',
  },
  {
    id: 'payment',
    icon: '✦',
    title: 'Prepaid Discount',
    tagline: '5% off every online order',
    description:
      'Pay via UPI, credit/debit card, or net banking and automatically get an extra 5% off your order total. Combined with book discounts, save up to 30% on bestsellers.',
    color: 'var(--bg-accent-yellow)',
    href: '/cart',
    cta: 'Shop & Save',
    howItWorks: [
      'Add your chosen editions to cart.',
      'Select Online Payment (Razorpay UPI, GPay, PhonePe, Cards) at checkout.',
      'The 5% prepaid incentive is automatically deducted before final payment.',
      'Plus enjoy free express shipping on all orders over ₹500.',
    ],
    whyItMatters: 'Rewards deliberate readers with guaranteed lowest net pricing on genuine publisher copies.',
    proTip: 'Stack with coupon code READ20 for the absolute best price guaranteed anywhere.',
  },
];

const TESTIMONIALS = [
  {
    quote: "BOOKLY's curation is extraordinary. Every book I've ordered has been exactly what I needed. The editorial approach makes it feel like buying from a legendary independent bookshop owner.",
    author: 'Priya Mehta',
    role: 'Principal Product Designer · Bengaluru',
    rating: 5,
  },
  {
    quote: 'Used Book Match to find my next read — it recommended Designing Data-Intensive Applications and it changed how I think about distributed systems. Genuinely impressed.',
    author: 'Arjun Sharma',
    role: 'Senior Staff Engineer · Pune',
    rating: 5,
  },
  {
    quote: "The packaging is as premium as the books themselves. Every order arrived in archival condition with a custom bookmark. I've gifted BOOKLY editions to four colleagues already.",
    author: 'Ritika Patel',
    role: 'Research Fellow & Bibliophile · Mumbai',
    rating: 5,
  },
];

const EDITORIAL_STATS = [
  { value: '16+', label: 'Hand-Curated Editions', color: 'var(--bg-accent-yellow)' },
  { value: '6', label: 'Enduring Genres', color: 'var(--bg-accent-blue)' },
  { value: '4.8★', label: 'Average Reader Rating', color: 'var(--bg-accent-mint)' },
  { value: '24H', label: 'Dispatch Guarantee', color: 'var(--bg-accent-pink)' },
  { value: '5%', label: 'Prepaid Instant Discount', color: 'var(--bg-accent-violet)' },
  { value: '₹0', label: 'Free Delivery Over ₹500', color: 'var(--bg-accent-yellow)' },
];

const CURATED_BUNDLES = [
  {
    title: 'The System Architect Trio',
    books: ['Clean Code', 'Designing Data-Intensive Applications', 'The Pragmatic Programmer'],
    originalPrice: 2848,
    bundlePrice: 2299,
    discount: '19% OFF BUNDLE',
    tag: 'SOFTWARE CRAFT',
    description: 'The definitive foundation for building resilient, clean, and massively scalable software systems.',
  },
  {
    title: 'Mindset & Compounding Capital',
    books: ['Atomic Habits', 'The Psychology of Money', 'Thinking, Fast and Slow'],
    originalPrice: 1447,
    bundlePrice: 1149,
    discount: '21% OFF BUNDLE',
    tag: 'BEHAVIOR & WEALTH',
    description: 'Deconstruct your habits, decode irrational human finance, and rewire your cognitive biases.',
  },
  {
    title: 'Cosmic Perspective & Human History',
    books: ['Sapiens', 'Cosmos', '1984'],
    originalPrice: 1347,
    bundlePrice: 1049,
    discount: '22% OFF BUNDLE',
    tag: 'HISTORY & CIVILIZATION',
    description: 'From biological foraging to deep space exploration and totalitarian dystopia — broad perspective.',
  },
];

const HOME_FAQS = [
  {
    q: 'How does the Book Match AI recommend titles?',
    a: 'Book Match uses a 5-point editorial matrix assessing your reading appetite, available hours, and technical depth to match you directly with our catalog without generic automated filler.',
  },
  {
    q: 'Are all books 100% genuine publisher editions?',
    a: 'Yes, absolutely. We source exclusively from authorized publishers (Prentice Hall, O\'Reilly, HarperCollins, Avery, etc.) in brand-new collector-grade condition.',
  },
  {
    q: 'How do I get the 5% prepaid discount?',
    a: 'Simply choose any online payment option (UPI, Card, Net Banking via Razorpay) at checkout. The 5% discount is calculated and applied automatically before you pay.',
  },
  {
    q: 'What is your shipping and return policy?',
    a: 'Orders above ₹500 qualify for free express shipping dispatched within 24 hours. We offer a 7-day hassle-free return window if a book arrives damaged or misprinted.',
  },
];

// ── Main Home Page Content ──────────────────────────────────────
function HomeContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<BookSortOption>('newest');
  const [page, setPage] = useState(1);

  // Feature Info Modal state
  const [activeFeatureModal, setActiveFeatureModal] = useState<FeatureInfo | null>(null);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  // FAQ open index
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quick mood filter
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getBooks({
        page,
        limit: 8,
        search: search || undefined,
        category: selectedCategory || undefined,
        minPrice,
        maxPrice,
        minRating,
        inStock: inStockOnly || undefined,
        sort,
      });
      setBooks(res.data);
      setTotalItems(res.meta.totalItems);
      setTotalPages(res.meta.totalPages);
    } catch {
      setBooks([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, selectedCategory, minPrice, maxPrice, minRating, inStockOnly, sort]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinRating(undefined);
    setInStockOnly(false);
    setSearch('');
    setSort('newest');
    setPage(1);
    setActiveMood(null);
  };

  const handleMoodSelect = (mood: string, categorySlug: string) => {
    setActiveMood(mood);
    setSelectedCategory(categorySlug);
    setPage(1);
    const catalogElem = document.getElementById('catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Books for WorksWheel: first 9 catalog books (excluding language-specific categories)
  const wheelBooks = MOCK_BOOKS.filter(
    b => b.categoryId !== 'cat-7' && b.categoryId !== 'cat-8'
  ).slice(0, 9);

  return (
    <div className='flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]'>
      {/* ── Lumina Neo-Brutalist Hero ── */}
      <LuminaHero />

      {/* ── Social Proof Marquee ── */}
      <SocialProofBar />

      {/* ── Works Wheel: Interactive Book Carousel ── */}
      <WorksWheel
        books={wheelBooks}
        label="Discover Your Next Read"
        action="View Book"
      />

      {/* ── Problem vs Solution ── */}
      <ProblemVsSolution />

      {/* ── Flying Posters 3D WebGL Distortion Gallery (Optimized with Visibility Gating) ── */}
      <FlyingPostersGallery books={wheelBooks} />

      {/* ── How It Works (Dark Mode Flow) ── */}
      <HowItWorks />

      {/* ── Testimonials (Asymmetric Cards) ── */}
      <TestimonialsSection />

      {/* ── Live Activity Ticker ── */}
      <div className='bg-[var(--text-main)] text-[var(--bg-page)] py-2.5 px-4 overflow-hidden border-b-2 border-[var(--border-main)]'>
        <div className='animate-marquee whitespace-nowrap flex items-center gap-12 font-editorial-mono text-xs font-bold uppercase tracking-widest'>
          <span>⚡ A reader in Bengaluru purchased *Designing Data-Intensive Applications* · 4m ago</span>
          <span>✦ Verified Order #8892 dispatched to New Delhi · 14m ago</span>
          <span>★ *Atomic Habits* now 25% off · Only 18 copies remaining</span>
          <span>📦 Free express shipping unlocked on orders above ₹500</span>
          <span>🛡️ 100% Genuine Publisher First Editions · 7-Day Exchange Guaranteed</span>
          <span>⚡ A reader in Mumbai added *Clean Code* to compare list · 2m ago</span>
        </div>
      </div>

      {/* ── Editorial Stats Strip ── */}
      <section className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
            {EDITORIAL_STATS.map((stat, i) => (
              <div
                key={i}
                className='border-2 border-[var(--border-main)] p-4 text-center bg-[var(--bg-surface)] hover:-translate-y-1 transition-transform'
                style={{ boxShadow: '3px 3px 0px var(--border-main)' }}
              >
                <p
                  className='font-editorial-serif text-3xl sm:text-4xl font-black mb-1'
                  style={{ color: stat.color === 'var(--bg-accent-yellow)' ? '#eab308' : stat.color }}
                >
                  {stat.value}
                </p>
                <p className='font-editorial-mono text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Bar ── */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setPage(1);
        }}
      />

      {/* ── Featured Editions ── */}
      <FeaturedSection books={books} />

      {/* ── Indian Language Books Section ── */}
      <IndianLanguageSection
        hindiBooks={MOCK_BOOKS.filter(b => b.categoryId === 'cat-7')}
        gujaratiBooks={MOCK_BOOKS.filter(b => b.categoryId === 'cat-8')}
      />

      {/* ── 3D Exploded View Unboxing & Anatomy Section ("Book of the Month") ── */}
      <ExplodedBookSection />


      {/* ── 1-Click Interactive Reading Mood Selector ── */}
      <section className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)] py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-[var(--border-main)]'>
            <div>
              <span className='font-editorial-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--bg-accent-blue)]'>
                INSTANT DISCOVERY WIDGET
              </span>
              <h2 className='font-editorial-serif text-3xl sm:text-4xl font-black text-[var(--text-main)] mt-1'>
                What is your reading appetite today?
              </h2>
            </div>
            <p className='font-editorial-mono text-xs text-[var(--text-faint)] uppercase tracking-wider'>
              Click a mood to instantly curate the catalog
            </p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {[
              { label: '⚙️ Architecture & Code', desc: 'Deep technical craft & algorithms', slug: 'computer-science' },
              { label: '🚀 Leverage & Wealth', desc: 'Modern finance & startup strategy', slug: 'business-finance' },
              { label: '🧠 Mindset & Focus', desc: 'Atomic productivity & habit loops', slug: 'self-help' },
              { label: '🌌 Cosmic Imagination', desc: 'Astrophysics, fiction & philosophy', slug: 'science-nature' },
            ].map((m) => (
              <button
                key={m.slug}
                onClick={() => handleMoodSelect(m.label, m.slug)}
                className={
                  'p-5 text-left border-2 border-[var(--border-main)] transition-all ' +
                  (selectedCategory === m.slug
                    ? 'bg-[var(--bg-accent-yellow)] text-black shadow-[4px_4px_0px_var(--border-main)] -translate-y-1'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-main)] hover:bg-[var(--bg-surface)] hover:-translate-y-0.5')
                }
              >
                <h4 className='font-editorial-serif text-lg font-bold'>{m.label}</h4>
                <p className='font-editorial-sans text-xs text-[var(--text-muted)] mt-1'>{m.desc}</p>
                <span className='inline-block mt-3 font-editorial-mono text-[11px] font-bold uppercase tracking-wider underline'>
                  {selectedCategory === m.slug ? '✓ Applied to Catalog' : 'Select Mood →'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curated Reading Bundles (Save Up To 22%) ── */}
      <section className='border-b-2 border-[var(--border-main)] bg-[var(--bg-page)] py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-4 mb-10 pb-6 border-b-2 border-[var(--border-main)]'>
            <span className='inline-block w-4 h-4 bg-[var(--bg-accent-pink)] border-2 border-[var(--border-main)]' />
            <div>
              <p className='font-editorial-mono text-xs uppercase tracking-[0.25em] text-[var(--text-faint)] font-bold'>
                CURATED BUNDLES · SAVINGS SUITE
              </p>
              <h2 className='font-editorial-serif text-3xl sm:text-4xl font-black text-[var(--text-main)] mt-1'>
                Essential Reading Trilogies
              </h2>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {CURATED_BUNDLES.map((bundle, idx) => (
              <div
                key={idx}
                className='neo-card p-6 bg-[var(--bg-surface)] border-2 border-[var(--border-main)] flex flex-col justify-between hover:-translate-y-1.5 transition-all shadow-[6px_6px_0px_var(--border-main)]'
              >
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='badge-pill-pink px-2.5 py-1 text-xs font-black font-editorial-mono uppercase tracking-wider'>
                      {bundle.discount}
                    </span>
                    <span className='font-editorial-mono text-xs font-bold text-[var(--text-faint)] uppercase'>
                      {bundle.tag}
                    </span>
                  </div>

                  <h3 className='font-editorial-serif text-2xl font-bold text-[var(--text-main)] mb-2'>
                    {bundle.title}
                  </h3>
                  <p className='font-editorial-sans text-sm text-[var(--text-muted)] mb-4 leading-relaxed'>
                    {bundle.description}
                  </p>

                  <div className='space-y-1.5 p-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] mb-5'>
                    <p className='font-editorial-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)]'>
                      INCLUDED IN THIS BUNDLE:
                    </p>
                    {bundle.books.map((b, bIdx) => (
                      <div key={bIdx} className='flex items-center gap-2 font-editorial-serif text-sm font-semibold text-[var(--text-main)]'>
                        <span className='text-[var(--bg-accent-blue)]'>✓</span> {b}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className='flex items-baseline justify-between py-3 border-t-2 border-b-2 border-[var(--border-subtle)] mb-4'>
                    <div className='flex items-baseline gap-2'>
                      <span className='font-editorial-serif text-3xl font-black text-[var(--text-main)]'>
                        ₹{bundle.bundlePrice}
                      </span>
                      <span className='font-editorial-mono text-sm text-[var(--text-faint)] line-through font-bold'>
                        ₹{bundle.originalPrice}
                      </span>
                    </div>
                    <span className='font-editorial-mono text-xs font-bold text-emerald-600'>
                      Save ₹{bundle.originalPrice - bundle.bundlePrice}
                    </span>
                  </div>

                  <Link
                    href='#catalog'
                    onClick={() => {
                      const book = books[0];
                      if (book) addToCart(book);
                    }}
                    className='w-full block py-3 text-center font-editorial-mono text-xs font-black uppercase tracking-wider border-2 border-[var(--border-main)] bg-[var(--text-main)] text-[var(--bg-page)] hover:bg-[var(--bg-accent-yellow)] hover:text-black transition-all'
                  >
                    Add Complete Bundle to Cart →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards Section with Interactive Info [ℹ] Buttons ── */}
      <section className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)] py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Section Header */}
          <div className='flex items-center gap-4 mb-10 pb-6 border-b-2 border-[var(--border-main)]'>
            <span className='inline-block w-4 h-4 bg-[var(--bg-accent-yellow)] border-2 border-[var(--border-main)]' />
            <div>
              <p className='font-editorial-mono text-xs uppercase tracking-[0.25em] text-[var(--text-faint)] font-bold mb-1'>
                BOOKSTORE CAPABILITIES · WHY READ WITH BOOKLY
              </p>
              <h2 className='font-editorial-serif text-3xl sm:text-5xl font-black text-[var(--text-main)]'>
                Built for deliberate, serious readers.
              </h2>
            </div>
          </div>

          {/* Feature Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {FEATURES.map((feature, idx) => (
              <div
                key={feature.id}
                className='neo-card p-6 bg-[var(--bg-surface)] border-2 border-[var(--border-main)] group flex flex-col justify-between hover:-translate-y-1.5 transition-all shadow-[6px_6px_0px_var(--border-main)]'
              >
                <div>
                  {/* Icon + Number + Info [ℹ] Button */}
                  <div className='flex items-start justify-between mb-4'>
                    <div
                      className='w-12 h-12 border-2 border-[var(--border-main)] flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform shadow-sm'
                      style={{ backgroundColor: feature.color, color: '#0c0c0c' }}
                    >
                      {feature.icon}
                    </div>

                    <div className='flex items-center gap-2'>
                      {/* Info [i] feature explainer button requested by user */}
                      <button
                        onClick={() => setActiveFeatureModal(feature)}
                        title={`Click to read complete details about ${feature.title}`}
                        className='px-2 py-1 font-editorial-mono text-xs font-bold uppercase tracking-wider border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-accent-yellow)] text-[var(--text-main)] transition-colors flex items-center gap-1 shadow-sm'
                      >
                        <span>ℹ</span>
                        <span>Info</span>
                      </button>
                      <span className='font-editorial-mono text-xs uppercase tracking-[0.2em] text-[var(--text-faint)] font-bold'>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Title + Tagline */}
                  <p className='font-editorial-mono text-xs uppercase tracking-[0.16em] text-[var(--text-faint)] font-bold mb-1'>
                    {feature.tagline}
                  </p>
                  <h3 className='font-editorial-serif text-2xl sm:text-3xl font-black text-[var(--text-main)] mb-3'>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className='font-editorial-sans text-base text-[var(--text-muted)] leading-relaxed mb-6'>
                    {feature.description}
                  </p>
                </div>

                {/* Card footer: CTA Button + Info Link */}
                <div className='pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3'>
                  {feature.isChatbot ? (
                    <button
                      onClick={() => {
                        const chatToggle = document.querySelector('button[aria-label="Open AI Assistant"]') as HTMLElement;
                        if (chatToggle) chatToggle.click();
                      }}
                      className='inline-flex items-center gap-2 font-editorial-mono text-xs font-black uppercase tracking-wider px-5 py-2.5 border-2 border-[var(--border-main)] bg-[var(--text-main)] text-[var(--bg-page)] hover:bg-[var(--bg-accent-yellow)] hover:text-black transition-all'
                    >
                      <span>{feature.cta}</span>
                      <span>💬</span>
                    </button>
                  ) : (
                    <Link
                      href={feature.href}
                      className='inline-flex items-center gap-2 font-editorial-mono text-xs font-black uppercase tracking-wider px-5 py-2.5 border-2 border-[var(--border-main)] bg-[var(--text-main)] text-[var(--bg-page)] hover:bg-[var(--bg-accent-yellow)] hover:text-black transition-all group/btn'
                    >
                      <span>{feature.cta}</span>
                      <span className='group-hover/btn:translate-x-1 transition-transform'>↗</span>
                    </Link>
                  )}

                  <button
                    onClick={() => setActiveFeatureModal(feature)}
                    className='text-xs font-editorial-mono text-[var(--text-faint)] hover:text-[var(--text-main)] underline font-bold'
                  >
                    How it works →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Info Modal / Drawer (when user clicks Info button) ── */}
      {activeFeatureModal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
          <div className='max-w-xl w-full neo-card bg-[var(--bg-surface)] border-2 border-[var(--border-main)] p-6 sm:p-8 shadow-[10px_10px_0px_var(--border-main)] animate-scale-in'>
            {/* Modal Header */}
            <div className='flex items-start justify-between border-b-2 border-[var(--border-main)] pb-4 mb-5'>
              <div className='flex items-center gap-3'>
                <div
                  className='w-12 h-12 border-2 border-[var(--border-main)] flex items-center justify-center text-2xl font-bold'
                  style={{ backgroundColor: activeFeatureModal.color, color: '#0c0c0c' }}
                >
                  {activeFeatureModal.icon}
                </div>
                <div>
                  <span className='font-editorial-mono text-xs uppercase tracking-wider font-bold text-[var(--bg-accent-blue)]'>
                    FEATURE DEEP-DIVE
                  </span>
                  <h3 className='font-editorial-serif text-2xl sm:text-3xl font-black text-[var(--text-main)]'>
                    {activeFeatureModal.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveFeatureModal(null)}
                className='text-2xl font-bold text-[var(--text-main)] hover:text-rose-500 w-8 h-8 flex items-center justify-center border-2 border-[var(--border-main)]'
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className='space-y-4'>
              <div>
                <h4 className='font-editorial-mono text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-1'>
                  OVERVIEW
                </h4>
                <p className='font-editorial-sans text-base text-[var(--text-main)] leading-relaxed'>
                  {activeFeatureModal.description}
                </p>
              </div>

              <div>
                <h4 className='font-editorial-mono text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2'>
                  HOW TO USE THIS FEATURE
                </h4>
                <ul className='space-y-2'>
                  {activeFeatureModal.howItWorks.map((step, sIdx) => (
                    <li key={sIdx} className='flex items-start gap-2.5 font-editorial-sans text-sm text-[var(--text-muted)]'>
                      <span className='w-5 h-5 rounded-full bg-[var(--bg-accent-yellow)] text-black font-editorial-mono text-xs font-bold flex items-center justify-center shrink-0 border border-black/20'>
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='p-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]'>
                <p className='font-editorial-mono text-xs font-bold uppercase text-[var(--bg-accent-mint)]'>
                  💡 PRO TIP
                </p>
                <p className='font-editorial-sans text-sm text-[var(--text-main)] mt-1 font-medium'>
                  {activeFeatureModal.proTip}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className='mt-6 pt-4 border-t-2 border-[var(--border-main)] flex items-center justify-between gap-4'>
              <button
                onClick={() => setActiveFeatureModal(null)}
                className='py-2.5 px-4 font-editorial-mono text-xs font-bold uppercase border-2 border-[var(--border-main)] hover:bg-[var(--bg-surface-elevated)]'
              >
                Close Info
              </button>
              {activeFeatureModal.isChatbot ? (
                <button
                  onClick={() => {
                    setActiveFeatureModal(null);
                    const chatToggle = document.querySelector('button[aria-label="Open AI Assistant"]') as HTMLElement;
                    if (chatToggle) chatToggle.click();
                  }}
                  className='py-2.5 px-6 font-editorial-mono text-xs font-black uppercase bg-[var(--text-main)] text-[var(--bg-page)] hover:bg-[var(--bg-accent-yellow)] hover:text-black border-2 border-[var(--border-main)]'
                >
                  Launch BookBuddy →
                </button>
              ) : (
                <Link
                  href={activeFeatureModal.href}
                  onClick={() => setActiveFeatureModal(null)}
                  className='py-2.5 px-6 font-editorial-mono text-xs font-black uppercase bg-[var(--text-main)] text-[var(--bg-page)] hover:bg-[var(--bg-accent-yellow)] hover:text-black border-2 border-[var(--border-main)]'
                >
                  Open {activeFeatureModal.title} →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Testimonials ── */}
      <section className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)] py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-4 mb-10 pb-6 border-b-2 border-[var(--border-main)]'>
            <span className='inline-block w-4 h-4 bg-[var(--bg-accent-mint)] border-2 border-[var(--border-main)]' />
            <div>
              <p className='font-editorial-mono text-xs uppercase tracking-[0.3em] text-[var(--text-faint)] font-bold mb-1'>
                VERIFIED READER DISPATCHES
              </p>
              <h2 className='font-editorial-serif text-3xl sm:text-4xl font-black text-[var(--text-main)]'>
                What our readers say
              </h2>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className='neo-card p-6 bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]'
              >
                <div className='flex gap-1 mb-4'>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className='text-[var(--bg-accent-yellow)] text-xl'>★</span>
                  ))}
                </div>
                <blockquote className='font-editorial-sans text-base text-[var(--text-main)] leading-relaxed mb-5 italic'>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className='border-t border-[var(--border-subtle)] pt-4'>
                  <p className='font-editorial-serif text-lg font-bold text-[var(--text-main)]'>{t.author}</p>
                  <p className='font-editorial-mono text-xs uppercase tracking-wider text-[var(--text-faint)] font-semibold mt-0.5'>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalog Section Header ── */}
      <div id='catalog' className='border-y-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <span className='inline-block w-4 h-4 bg-[var(--bg-accent-blue)] border-2 border-[var(--border-main)]' />
            <div>
              <p className='font-editorial-mono text-xs uppercase tracking-[0.22em] font-bold text-[var(--text-faint)]'>
                BOOKLY CATALOG · FULL COLLECTION
              </p>
              <h2 className='font-editorial-serif text-3xl sm:text-4xl font-black text-[var(--text-main)] mt-0.5'>
                Browse All Titles ({totalItems})
              </h2>
            </div>
          </div>
          {search && (
            <div className='flex items-center gap-2 border-2 border-[var(--border-main)] px-3 py-1.5 bg-[var(--bg-accent-yellow)] self-start'>
              <span className='font-editorial-mono text-xs font-bold uppercase tracking-wider text-black'>QUERY: {search}</span>
              <button onClick={() => setSearch('')} className='font-bold text-black hover:text-rose-600 transition-colors text-base'>✕</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Catalog Grid ── */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start'>
          <div className='lg:col-span-1 sticky top-24'>
            <BookFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => { setSelectedCategory(cat); setPage(1); }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); setPage(1); }}
              minRating={minRating}
              onRatingChange={(r) => { setMinRating(r); setPage(1); }}
              inStockOnly={inStockOnly}
              onInStockChange={(stk) => { setInStockOnly(stk); setPage(1); }}
              onResetFilters={handleResetFilters}
            />
          </div>

          <div className='lg:col-span-3 space-y-6'>
            <BookSort currentSort={sort} onSortChange={(s) => { setSort(s); setPage(1); }} totalItems={totalItems} />
            <BookGrid books={books} isLoading={isLoading} />

            {totalPages > 1 && (
              <div className='pt-6 flex items-center justify-center border-t-2 border-[var(--border-main)] gap-0'>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className={
                    'px-6 py-3 font-editorial-mono text-xs font-bold uppercase tracking-wider border-2 border-[var(--border-main)] border-r-0 transition ' +
                    (page <= 1
                      ? 'text-[var(--text-faint)] cursor-not-allowed bg-[var(--bg-surface-elevated)]'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] cursor-pointer')
                  }
                >
                  ← PREV
                </button>
                <div className='px-8 py-3 font-editorial-mono text-xs font-bold border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]'>
                  {page} / {totalPages}
                </div>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className={
                    'px-6 py-3 font-editorial-mono text-xs font-bold uppercase tracking-wider border-2 border-[var(--border-main)] border-l-0 transition ' +
                    (page >= totalPages
                      ? 'text-[var(--text-faint)] cursor-not-allowed bg-[var(--bg-surface-elevated)]'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] cursor-pointer')
                  }
                >
                  NEXT →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Frequently Asked Questions Accordion ── */}
      <section className='border-t-2 border-b-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-10'>
            <span className='font-editorial-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--bg-accent-violet)]'>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className='font-editorial-serif text-3xl sm:text-4xl font-black text-[var(--text-main)] mt-1'>
              Everything you need to know about BOOKLY
            </h2>
          </div>

          <div className='space-y-3'>
            {HOME_FAQS.map((faq, fIdx) => (
              <div
                key={fIdx}
                className='border-2 border-[var(--border-main)] bg-[var(--bg-surface)] overflow-hidden transition-all'
              >
                <button
                  onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                  className='w-full p-5 text-left flex items-center justify-between gap-4 font-editorial-serif text-lg font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]'
                >
                  <span>{faq.q}</span>
                  <span className='font-editorial-mono text-lg font-black'>
                    {openFaq === fIdx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === fIdx && (
                  <div className='px-5 pb-5 pt-1 font-editorial-sans text-base text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]'>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final Lumina Call To Action ── */}
      <FinalCTA />

      {/* ── Newsletter Section with Promo Reward ── */}
      <section className='border-b-2 border-[var(--border-main)] bg-[var(--bg-accent-yellow)]'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div>
              <p className='font-editorial-mono text-xs uppercase tracking-[0.3em] text-black/60 font-bold mb-2'>
                EDITORIAL DISPATCH · GET 15% VOUCHER
              </p>
              <h2 className='font-editorial-serif text-4xl sm:text-5xl font-black text-black leading-tight'>
                Books worth reading,<br />
                <span className='italic'>curated weekly.</span>
              </h2>
              <p className='font-editorial-sans text-base text-black/80 mt-3 leading-relaxed max-w-sm'>
                Get our Monday dispatch — one curated book recommendation, deep excerpt, and immediate 15% discount code. Join 3,500+ deliberate readers.
              </p>
            </div>
            <div>
              {newsletterDone ? (
                <div className='border-2 border-black p-6 text-center bg-black/10'>
                  <p className='font-editorial-serif text-3xl font-black text-black mb-1'>You&apos;re in! 📚</p>
                  <p className='font-editorial-mono text-xs font-bold text-black uppercase tracking-wider'>
                    Use code <strong className='bg-black text-[var(--bg-accent-yellow)] px-2 py-0.5'>READ15</strong> at checkout for 15% off!
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setNewsletterDone(true); }}
                  className='flex border-2 border-black overflow-hidden shadow-[4px_4px_0px_black]'
                >
                  <input
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='your.email@company.com'
                    className='flex-1 px-4 py-4 font-editorial-mono text-sm bg-white text-black placeholder:text-black/50 focus:outline-none border-none'
                  />
                  <button
                    type='submit'
                    className='px-6 py-4 bg-black text-[var(--bg-accent-yellow)] font-editorial-mono text-xs font-black uppercase tracking-wider hover:bg-[#222] transition-colors whitespace-nowrap'
                  >
                    Subscribe & Save →
                  </button>
                </form>
              )}
              <p className='font-editorial-mono text-xs uppercase tracking-wider text-black/60 mt-2 font-bold'>
                No spam ever. Instant coupon code on signup.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-[var(--bg-page)]'>
          <div className='w-10 h-10 border-4 border-[var(--border-main)] border-t-[var(--bg-accent-yellow)] rounded-full animate-spin' />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
