'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '../../services/api';
import { Book, Category } from '../../types/book';
import { RatingStars } from '../../components/common/RatingStars';
import { Badge } from '../../components/common/Badge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

type ReadingPreference = 'any' | 'habits' | 'engineering' | 'inspiration';

export default function BookMatchPage() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Preference states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [budget, setBudget] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [readingGoal, setReadingGoal] = useState<ReadingPreference>('any');

  const rupee = '\u20B9';

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [catsRes, booksRes] = await Promise.all([
          api.getCategories(),
          api.getBooks({ limit: 100 }),
        ]);
        setCategories(catsRes);
        setBooks(booksRes.data);
      } catch (err) {
        console.error('Failed to load catalog for BOOK MATCH', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Matching Score calculation
  const matchedBooks = useMemo(() => {
    if (!books.length) return [];

    return books
      .map((book) => {
        let score = 0;
        const reasons: string[] = [];

        const discountedPrice =
          book.discount > 0
            ? Math.round(book.price * (1 - book.discount / 100))
            : book.price;

        // 1. Category / Genre (35 pts)
        if (selectedCategory === 'all') {
          score += 35;
          reasons.push('Fits your open genre preference');
        } else if (
          book.categoryId === selectedCategory ||
          book.category?.slug === selectedCategory ||
          book.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
        ) {
          score += 35;
          reasons.push(`Direct match in ${book.category?.name || 'selected genre'}`);
        } else {
          score += 10;
        }

        // 2. Budget (25 pts)
        if (discountedPrice <= budget) {
          score += 25;
          const savings = book.price - discountedPrice;
          if (savings > 0) {
            reasons.push(`Under your ${rupee}${budget} budget at ${rupee}${discountedPrice} (${book.discount}% off)`);
          } else {
            reasons.push(`Fits your ${rupee}${budget} budget at ${rupee}${discountedPrice}`);
          }
        } else if (discountedPrice <= budget * 1.2) {
          score += 15;
          reasons.push(`Close to your budget (${rupee}${discountedPrice})`);
        } else {
          score += 5;
        }

        // 3. Minimum Rating (20 pts)
        if (book.rating >= minRating) {
          score += 20;
          reasons.push(`High satisfaction rating of ${book.rating}★ (${book.numReviews}+ reviews)`);
        } else if (book.rating >= minRating - 0.3) {
          score += 12;
          reasons.push(`Solid rating of ${book.rating}★`);
        } else {
          score += 5;
        }

        // 4. Availability (10 pts)
        if (book.stock > 0) {
          score += 10;
          reasons.push(`In stock for fast dispatch (${book.stock} copies)`);
        } else {
          if (!inStockOnly) {
            score += 4;
            reasons.push('Available on backorder');
          }
        }

        // 5. Reading Preference (10 pts)
        const textToSearch = `${book.title} ${book.subtitle || ''} ${book.description}`.toLowerCase();
        if (readingGoal === 'habits') {
          if (
            textToSearch.includes('habit') ||
            textToSearch.includes('productiv') ||
            textToSearch.includes('framework') ||
            textToSearch.includes('mindset')
          ) {
            score += 10;
            reasons.push('Matches your goal for building habits & practical systems');
          } else {
            score += 5;
          }
        } else if (readingGoal === 'engineering') {
          if (
            textToSearch.includes('code') ||
            textToSearch.includes('software') ||
            textToSearch.includes('craftsmanship') ||
            textToSearch.includes('agile') ||
            textToSearch.includes('program')
          ) {
            score += 10;
            reasons.push('Curated for software craftsmanship & code quality');
          } else {
            score += 5;
          }
        } else if (readingGoal === 'inspiration') {
          if (
            textToSearch.includes('fable') ||
            textToSearch.includes('dream') ||
            textToSearch.includes('alchemist') ||
            textToSearch.includes('wisdom') ||
            textToSearch.includes('journey')
          ) {
            score += 10;
            reasons.push('Matches your search for inspirational & philosophical literature');
          } else {
            score += 5;
          }
        } else {
          score += 10;
        }

        // Cap at 100%
        const matchPercentage = Math.min(100, Math.max(20, Math.round(score)));

        return {
          book,
          discountedPrice,
          matchPercentage,
          reasons,
        };
      })
      .filter((item) => {
        if (inStockOnly && item.book.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [books, selectedCategory, budget, minRating, inStockOnly, readingGoal]);

  const handleAddToCartWithNotice = (book: Book) => {
    addToCart(book, 1);
    setFeedbackMessage(`Added "${book.title}" to your cart!`);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const handleAddToCompareWithNotice = (book: Book) => {
    const res = addToCompare(book);
    setFeedbackMessage(res.message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10'>
      {/* Hero / Header */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white shadow-xl'>
        <div className='relative z-10 max-w-2xl space-y-3'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300'>
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
            </svg>
            <span>Personalized Book Recommendation Engine</span>
          </div>

          <h1 className='text-3xl sm:text-5xl font-black tracking-tight text-white'>
            BOOK MATCH
          </h1>
          <p className='text-base sm:text-lg text-indigo-200 font-medium'>
            &ldquo;Find a book that fits you&rdquo;
          </p>
          <p className='text-xs sm:text-sm text-slate-300 leading-relaxed pt-1'>
            Select your reading genre, set your budget and rating standards, and let our deterministic catalog algorithm calculate your match score with personalized recommendations.
          </p>
        </div>

        {/* Ambient Decorative Shapes */}
        <div className='absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute right-20 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none' />
      </div>

      {feedbackMessage && (
        <div className='p-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm'>
          <span>&#10003; {feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className='text-sm font-bold'>&times;</button>
        </div>
      )}

      {/* Preferences Form */}
      <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6'>
        <div className='flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm'>
              1
            </div>
            <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
              Customize Your Reading Preferences
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setBudget(1000);
              setMinRating(4.0);
              setInStockOnly(true);
              setReadingGoal('any');
            }}
            className='text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline'
          >
            Reset Preferences
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* 1. Category / Genre */}
          <div className='space-y-2'>
            <label htmlFor='match-category' className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Preferred Genre / Category
            </label>
            <select
              id='match-category'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              <option value='all'>All Genres &amp; Categories</option>
              {categories.map((cat) => (
                <option key={'cat-' + cat.id} value={cat.slug || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Budget Slider */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <label htmlFor='budget-slider' className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Max Budget:
              </label>
              <span className='text-sm font-black text-indigo-600 dark:text-indigo-400'>
                {budget >= 1000 ? 'Any Budget' : `${rupee}${budget}`}
              </span>
            </div>
            <input
              id='budget-slider'
              type='range'
              min='200'
              max='1000'
              step='50'
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className='w-full accent-indigo-600 cursor-pointer'
            />
            <div className='flex justify-between text-[10px] text-slate-400 font-semibold'>
              <span>{rupee}200</span>
              <span>{rupee}500</span>
              <span>{rupee}750</span>
              <span>{rupee}1000+</span>
            </div>
          </div>

          {/* 3. Minimum Rating */}
          <div className='space-y-2'>
            <label htmlFor='match-rating' className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Minimum Rating
            </label>
            <select
              id='match-rating'
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className='w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              <option value='0'>Any Rating</option>
              <option value='4.0'>4.0+ Stars (Recommended)</option>
              <option value='4.5'>4.5+ Stars (Highly Rated)</option>
              <option value='4.8'>4.8+ Stars (Top Masterpieces)</option>
            </select>
          </div>

          {/* 4. Reading Goal / Style */}
          <div className='space-y-2'>
            <label htmlFor='match-reading-goal' className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Reading Focus / Style
            </label>
            <select
              id='match-reading-goal'
              value={readingGoal}
              onChange={(e) => setReadingGoal(e.target.value as ReadingPreference)}
              className='w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              <option value='any'>Any Reading Style</option>
              <option value='habits'>Practical Habits &amp; Productivity</option>
              <option value='engineering'>Software Engineering &amp; Clean Code</option>
              <option value='inspiration'>Inspirational Journey &amp; Fiction</option>
            </select>
          </div>

          {/* 5. Stock Filter */}
          <div className='space-y-2 flex flex-col justify-end'>
            <label className='flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer'>
              <input
                type='checkbox'
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className='w-4 h-4 accent-indigo-600 rounded'
              />
              <span className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                Show only In-Stock books for immediate shipping
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <section className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2'>
          <div>
            <span className='text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'>
              Match Results
            </span>
            <h2 className='text-2xl font-black text-slate-900 dark:text-white mt-0.5'>
              Recommended Books For You ({matchedBooks.length})
            </h2>
          </div>
          <span className='text-xs text-slate-400'>
            Sorted by highest match compatibility score
          </span>
        </div>

        {isLoading ? (
          <div className='py-20 text-center space-y-4'>
            <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto' />
            <p className='text-xs font-semibold text-slate-500'>Calculating match scores across catalog...</p>
          </div>
        ) : matchedBooks.length === 0 ? (
          <div className='py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 max-w-lg mx-auto space-y-4'>
            <div className='w-14 h-14 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center text-xl font-bold'>
              !
            </div>
            <h3 className='text-lg font-bold text-slate-900 dark:text-white'>No Direct Matches Found</h3>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Try broadening your budget or changing the genre filter to discover matching titles.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setBudget(1000);
                setMinRating(4.0);
              }}
              className='px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs'
            >
              Broaden Filters
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {matchedBooks.map(({ book, discountedPrice, matchPercentage, reasons }, index) => {
              const isFavorite = isInWishlist(book.id);
              const inCompare = isInCompare(book.id);
              const isOutOfStock = book.stock <= 0;

              return (
                <div
                  key={'match-' + book.id}
                  className='relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300'
                >
                  {/* Rank & Match Score Bar */}
                  <div className='flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800'>
                    <span className='text-[11px] font-bold text-slate-400 uppercase tracking-wider'>
                      Rank #{index + 1}
                    </span>

                    <div className='flex items-center gap-1.5'>
                      <div className='px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs'>
                        {matchPercentage}% MATCH
                      </div>
                    </div>
                  </div>

                  {/* Book Presentation */}
                  <div className='flex gap-4 items-start mb-4'>
                    <div className='w-24 aspect-[3/4] rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-md relative'>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full bg-slate-950 p-2 flex flex-col items-center justify-center text-center text-[10px] text-white font-bold'>
                          <span className='text-indigo-400 uppercase'>{book.author}</span>
                          <span className='line-clamp-2 mt-1'>{book.title}</span>
                        </div>
                      )}
                      {book.discount > 0 && (
                        <div className='absolute top-1 left-1'>
                          <Badge variant='discount'>-{book.discount}%</Badge>
                        </div>
                      )}
                    </div>

                    <div className='flex-1 overflow-hidden space-y-1.5'>
                      <span className='inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 truncate max-w-full'>
                        {book.category?.name || 'Curated'}
                      </span>

                      <Link href={`/books/${book.id}`}>
                        <h3 className='font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2'>
                          {book.title}
                        </h3>
                      </Link>

                      <p className='text-xs text-slate-500 dark:text-slate-400 truncate'>
                        by {book.author}
                      </p>

                      <div className='flex items-center gap-1.5 pt-0.5'>
                        <span className='text-xs font-black text-amber-500'>★ {book.rating}</span>
                        <span className='text-[10px] text-slate-400'>({book.numReviews})</span>
                      </div>

                      <div className='flex items-baseline gap-1.5 pt-1'>
                        <span className='text-base font-black text-slate-900 dark:text-white'>
                          {rupee}{discountedPrice}
                        </span>
                        {book.discount > 0 && (
                          <span className='text-xs text-slate-400 line-through'>
                            {rupee}{book.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Why It Matched Section */}
                  <div className='flex-1 p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs mb-4 space-y-1.5'>
                    <div className='flex items-center gap-1 text-[11px] font-bold text-indigo-900 dark:text-indigo-200'>
                      <svg className='w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                      </svg>
                      <span>Why This Book Matched:</span>
                    </div>
                    <ul className='space-y-1 text-slate-600 dark:text-slate-300 text-[11px] pl-3 list-disc'>
                      {reasons.map((r, i) => (
                        <li key={'reason-' + i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions: Add to Cart, Details, Wishlist, Compare */}
                  <div className='space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800'>
                    <div className='grid grid-cols-2 gap-2'>
                      <Link
                        href={`/books/${book.id}`}
                        className='py-2 px-3 rounded-xl text-center text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition'
                      >
                        Book Details
                      </Link>

                      <button
                        onClick={() => handleAddToCartWithNotice(book)}
                        disabled={isOutOfStock}
                        className={
                          'py-2 px-3 rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-1 ' +
                          (isOutOfStock
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs')
                        }
                      >
                        <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                        </svg>
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => toggleWishlist(book)}
                        className={
                          'flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition ' +
                          (isFavorite
                            ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800')
                        }
                      >
                        <svg className='w-3.5 h-3.5' fill={isFavorite ? 'currentColor' : 'none'} viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                        </svg>
                        <span>{isFavorite ? 'Saved' : 'Wishlist'}</span>
                      </button>

                      <button
                        onClick={() => handleAddToCompareWithNotice(book)}
                        className={
                          'flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition ' +
                          (inCompare
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-900 dark:text-indigo-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800')
                        }
                      >
                        <span>{inCompare ? 'In Compare' : '+ Compare'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
