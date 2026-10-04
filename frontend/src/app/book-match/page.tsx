'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '../../services/api';
import { Book, Category } from '../../types/book';
import { RatingStars } from '../../components/common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../components/common/Toast';

type ReadingPreference = 'any' | 'habits' | 'engineering' | 'inspiration';

export default function BookMatchPage() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { showSuccess, showInfo } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        // 1. Category Matching (35 pts)
        if (selectedCategory === 'all') {
          score += 35;
          reasons.push('Fits broad general reading exploration');
        } else {
          const matchCat =
            book.category?.slug === selectedCategory ||
            book.category?.id === selectedCategory ||
            book.categoryId === selectedCategory;
          if (matchCat) {
            score += 35;
            reasons.push(`Direct match in preferred genre: ${book.category?.name || 'Selected Category'}`);
          } else {
            score += 8;
          }
        }

        // 2. Budget Matching (25 pts)
        if (discountedPrice <= budget) {
          score += 25;
          const saving = budget - discountedPrice;
          if (saving > 100) {
            reasons.push(`Comfortably within budget (${rupee}${saving} under target)`);
          } else {
            reasons.push(`Priced within budget at ${rupee}${discountedPrice}`);
          }
        } else {
          const diff = discountedPrice - budget;
          if (diff <= 150) {
            score += 12;
            reasons.push(`Slightly above budget (${rupee}${diff} over), but high editorial value`);
          } else {
            score += 0;
          }
        }

        // 3. Rating Standard (20 pts)
        if (book.rating >= minRating) {
          score += 20;
          reasons.push(`Meets minimum rating standard (${book.rating}★ rating)`);
        } else if (book.rating >= minRating - 0.4) {
          score += 10;
        }

        // 4. Stock Availability (10 pts)
        if (book.stock > 0) {
          score += 10;
          reasons.push('In stock and ready for immediate 24h dispatch');
        } else {
          score += 2;
        }

        // 5. Reading Focus (10 pts)
        const textToSearch = `${book.title} ${book.subtitle || ''} ${book.description}`.toLowerCase();
        if (readingGoal === 'habits') {
          if (
            textToSearch.includes('habit') ||
            textToSearch.includes('productiv') ||
            textToSearch.includes('framework') ||
            textToSearch.includes('mindset')
          ) {
            score += 10;
            reasons.push('Aligned with goal for building systematic habits');
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
            reasons.push('Curated specifically for software craftsmanship');
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
            reasons.push('Curated for philosophical depth and inspiring prose');
          } else {
            score += 5;
          }
        } else {
          score += 10;
        }

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

  const handleAddToCompareWithNotice = (book: Book) => {
    const res = addToCompare(book);
    showInfo('Comparison Updated', res.message);
  };

  const [showMatchInfoModal, setShowMatchInfoModal] = useState(false);

  return (
    <div className='min-h-screen bg-[var(--bg-page)] animate-fade-in pb-16'>
      {/* Editorial Header */}
      <div className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14'>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
            <div className='flex flex-wrap items-center gap-3'>
              <span className='badge-pill-yellow px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--border-main)]'>
                ⚡ DETERMINISTIC ALGORITHM
              </span>
              <span className='badge-pill-mint px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--border-main)]'>
                PERSONALIZED MATCHING
              </span>
            </div>
            <button
              onClick={() => setShowMatchInfoModal(true)}
              className='px-3.5 py-1.5 border-2 border-[var(--border-main)] bg-[var(--bg-accent-yellow)] text-black font-editorial-mono text-xs font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 shadow-sm'
            >
              <span>ℹ</span>
              <span>How Match Works</span>
            </button>
          </div>

          <h1 className='font-editorial-serif text-4xl sm:text-6xl text-[var(--text-main)] leading-[1.05]'>
            Book <span className='italic font-normal editorial-highlighter'>Match</span> Engine
          </h1>
          <p className='font-editorial-sans text-base text-[var(--text-muted)] mt-4 max-w-2xl leading-relaxed'>
            Tune your genre taste, budget ceiling, and quality standard. Our catalog scoring algorithm ranks every volume by compatibility with zero corporate advertising bias.
          </p>
        </div>
      </div>

      {/* Match Algorithm Info Modal */}
      {showMatchInfoModal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
          <div className='max-w-lg w-full neo-card bg-[var(--bg-surface)] border-2 border-[var(--border-main)] p-6 sm:p-8 shadow-[8px_8px_0px_var(--border-main)] animate-scale-in'>
            <div className='flex items-center justify-between border-b-2 border-[var(--border-main)] pb-3 mb-4'>
              <div className='flex items-center gap-2.5'>
                <span className='w-8 h-8 bg-[var(--bg-accent-yellow)] text-black flex items-center justify-center text-base font-black border border-black'>
                  ⚡
                </span>
                <h3 className='font-editorial-serif text-2xl font-bold text-[var(--text-main)]'>
                  Book Match Engine Details
                </h3>
              </div>
              <button
                onClick={() => setShowMatchInfoModal(false)}
                className='text-xl font-bold text-[var(--text-main)] hover:text-rose-500'
              >
                ✕
              </button>
            </div>

            <div className='space-y-3 font-editorial-sans text-sm text-[var(--text-muted)] leading-relaxed'>
              <p>
                <strong>The 100-Point Compatibility Formula:</strong>
              </p>
              <div className='p-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1.5 text-xs font-editorial-mono text-[var(--text-main)]'>
                <div>• <strong>Genre Compatibility (35 pts):</strong> Direct match with your chosen topic focus.</div>
                <div>• <strong>Budget Calibration (25 pts):</strong> Rewarded if priced within or under your target ceiling.</div>
                <div>• <strong>Reader Rating Standard (20 pts):</strong> Based on verified community review sentiment.</div>
                <div>• <strong>Warehouse Readiness (10 pts):</strong> Real-time in-stock availability for 24h dispatch.</div>
                <div>• <strong>Topic Intent Analysis (10 pts):</strong> Semantic keyword alignment with your reading goal.</div>
              </div>
              <p className='text-xs font-editorial-mono text-[var(--text-faint)]'>
                💡 <em>Zero sponsored placements: Ranking is strictly computed by compatibility score.</em>
              </p>
            </div>

            <div className='mt-6 pt-3 border-t-2 border-[var(--border-main)] flex justify-end'>
              <button
                onClick={() => setShowMatchInfoModal(false)}
                className='py-2 px-5 font-editorial-mono text-xs font-bold uppercase bg-[var(--text-main)] text-[var(--bg-page)] border-2 border-[var(--border-main)] hover:bg-[var(--bg-accent-yellow)] hover:text-black transition-colors'
              >
                Close Info
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8'>
        {/* Preference Controls Card */}
        <div className='neo-card-flat border-2 border-[var(--border-main)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[6px_6px_0px_var(--border-main)] space-y-6'>
          <div className='flex items-center justify-between pb-4 border-b-2 border-[var(--border-subtle)]'>
            <div className='flex items-center gap-2.5'>
              <span className='w-7 h-7 rounded-full bg-[var(--bg-accent-yellow)] border-2 border-[var(--border-main)] flex items-center justify-center font-editorial-mono text-xs font-bold text-black'>
                01
              </span>
              <h2 className='font-editorial-serif text-xl font-bold text-[var(--text-main)]'>
                Set Your Reading Parameters
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
              className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] hover:text-[var(--bg-accent-pink)] transition-colors'
            >
              Reset Filters
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-editorial-mono text-xs'>
            {/* 1. Category */}
            <div className='space-y-1.5'>
              <label htmlFor='match-category' className='block text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]'>
                Preferred Genre / Focus
              </label>
              <select
                id='match-category'
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='w-full p-3 font-editorial-mono text-xs bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-main)] text-[var(--text-main)] focus:outline-none'
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
            <div className='space-y-1.5'>
              <div className='flex justify-between items-center'>
                <label htmlFor='budget-slider' className='text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]'>
                  Budget Ceiling:
                </label>
                <span className='font-bold text-[var(--text-main)] font-editorial-serif text-base'>
                  {budget >= 1000 ? 'No Limit' : `${rupee}${budget}`}
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
                className='w-full accent-black dark:accent-white cursor-pointer py-1'
              />
              <div className='flex justify-between text-[9px] text-[var(--text-faint)] font-bold'>
                <span>{rupee}200</span>
                <span>{rupee}500</span>
                <span>{rupee}750</span>
                <span>{rupee}1000+</span>
              </div>
            </div>

            {/* 3. Rating */}
            <div className='space-y-1.5'>
              <label htmlFor='match-rating' className='block text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]'>
                Quality Standard
              </label>
              <select
                id='match-rating'
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className='w-full p-3 font-editorial-mono text-xs bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-main)] text-[var(--text-main)] focus:outline-none'
              >
                <option value='0'>Any Rating</option>
                <option value='4.0'>4.0+ Stars (Recommended)</option>
                <option value='4.5'>4.5+ Stars (Critically Acclaimed)</option>
                <option value='4.8'>4.8+ Stars (Top Masterpieces)</option>
              </select>
            </div>

            {/* 4. Reading Goal */}
            <div className='space-y-1.5'>
              <label htmlFor='match-reading-goal' className='block text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]'>
                Thematic Aim
              </label>
              <select
                id='match-reading-goal'
                value={readingGoal}
                onChange={(e) => setReadingGoal(e.target.value as ReadingPreference)}
                className='w-full p-3 font-editorial-mono text-xs bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-main)] text-[var(--text-main)] focus:outline-none'
              >
                <option value='any'>Any Reading Style</option>
                <option value='habits'>Practical Systems &amp; Habits</option>
                <option value='engineering'>Software Engineering &amp; Architecture</option>
                <option value='inspiration'>Philosophical Literature &amp; Fiction</option>
              </select>
            </div>

            {/* 5. In-Stock Checkbox */}
            <div className='space-y-1.5 flex flex-col justify-end'>
              <label className='flex items-center gap-3 p-3 bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-main)] cursor-pointer'>
                <input
                  type='checkbox'
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className='w-4 h-4 accent-black dark:accent-white'
                />
                <span className='text-[10px] font-bold uppercase tracking-wider text-[var(--text-main)]'>
                  Show in-stock volumes only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Stream */}
        <section className='space-y-6'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-[var(--border-main)]'>
            <div className='flex items-center gap-3'>
              <span className='font-editorial-serif text-2xl text-[var(--text-main)]'>
                Compatible Recommendations
              </span>
              <span className='px-2.5 py-0.5 border border-[var(--border-main)] bg-[var(--bg-accent-yellow)] text-black font-editorial-mono text-[10px] font-bold'>
                {matchedBooks.length} TITLES
              </span>
            </div>
            <span className='font-editorial-mono text-[9px] uppercase tracking-wider text-[var(--text-faint)]'>
              Ranked by deterministic compatibility score
            </span>
          </div>

          {isLoading ? (
            <div className='py-20 text-center space-y-4'>
              <div className='font-editorial-serif text-5xl text-[var(--text-faint)] animate-pulse'>···</div>
              <p className='font-editorial-mono text-xs text-[var(--text-muted)] uppercase tracking-wider'>
                Scoring catalog against preferences...
              </p>
            </div>
          ) : matchedBooks.length === 0 ? (
            <div className='py-16 px-4 text-center neo-card bg-[var(--bg-surface)] border-2 border-[var(--border-main)] max-w-lg mx-auto space-y-4 shadow-[4px_4px_0px_var(--border-main)]'>
              <div className='w-14 h-14 mx-auto bg-[var(--bg-accent-yellow)] border-2 border-[var(--border-main)] flex items-center justify-center text-xl font-bold'>
                !
              </div>
              <h3 className='font-editorial-serif text-2xl text-[var(--text-main)]'>No Direct Matches</h3>
              <p className='font-editorial-sans text-xs text-[var(--text-muted)]'>
                Try increasing your budget ceiling or switching genres to uncover matching editions.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setBudget(1000);
                  setMinRating(4.0);
                }}
                className='neo-btn-accent px-6 py-3 text-xs font-bold uppercase tracking-wider'
              >
                Reset Parameters
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
                    className='neo-card flex flex-col bg-[var(--bg-surface)] border-2 border-[var(--border-main)] p-5 shadow-[4px_4px_0px_var(--border-main)] hover:shadow-[6px_6px_0px_var(--border-main)] transition-all'
                  >
                    {/* Rank & Score Bar */}
                    <div className='flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] font-editorial-mono'>
                      <span className='text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider'>
                        RANK #{index + 1}
                      </span>
                      <span className='badge-pill-mint px-2.5 py-0.5 rounded-full text-[10px] font-black'>
                        {matchPercentage}% MATCH
                      </span>
                    </div>

                    {/* Book Presentation */}
                    <div className='flex gap-4 items-start mb-4'>
                      <div className='w-20 aspect-[3/4] border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] overflow-hidden shrink-0 shadow-[2px_2px_0px_var(--border-main)] relative'>
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full p-2 flex flex-col justify-end text-[8px] font-editorial-mono text-[var(--text-faint)]'>
                            <span>{book.title}</span>
                          </div>
                        )}
                        {book.discount > 0 && (
                          <span className='badge-pill-pink absolute top-0 left-0 px-1.5 py-0.2 text-[8px] font-bold'>
                            −{book.discount}%
                          </span>
                        )}
                      </div>

                      <div className='flex-1 overflow-hidden space-y-1'>
                        <span className='font-editorial-mono text-[9px] uppercase tracking-widest text-[var(--text-faint)] block truncate'>
                          {book.category?.name || 'CURATED'}
                        </span>

                        <Link href={`/books/${book.id}`}>
                          <h3 className='font-editorial-serif font-bold text-base text-[var(--text-main)] hover:text-[var(--bg-accent-blue)] line-clamp-2 leading-tight'>
                            {book.title}
                          </h3>
                        </Link>

                        <p className='font-editorial-mono text-[10px] text-[var(--text-muted)] truncate'>
                          {book.author}
                        </p>

                        <div className='pt-0.5'>
                          <RatingStars rating={book.rating} numReviews={book.numReviews} size='sm' />
                        </div>

                        <div className='flex items-baseline gap-2 pt-1 font-editorial-mono'>
                          <span className='font-editorial-serif text-lg font-bold text-[var(--text-main)]'>
                            {rupee}{discountedPrice}
                          </span>
                          {book.discount > 0 && (
                            <span className='text-[10px] text-[var(--text-faint)] line-through'>
                              {rupee}{book.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Why It Matched Section */}
                    <div className='flex-1 p-3 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs mb-4 space-y-1.5 font-editorial-mono'>
                      <p className='font-bold text-[10px] uppercase tracking-wider text-[var(--text-main)]'>
                        Algorithm Match Notes:
                      </p>
                      <ul className='space-y-1 text-[10px] text-[var(--text-muted)] pl-3 list-disc'>
                        {reasons.slice(0, 3).map((r, i) => (
                          <li key={'reason-' + i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className='space-y-2 pt-2 border-t border-[var(--border-subtle)]'>
                      <div className='grid grid-cols-2 gap-2'>
                        <Link
                          href={`/books/${book.id}`}
                          className='neo-btn-secondary py-2 text-center text-[10px] font-bold uppercase tracking-wider'
                        >
                          Details
                        </Link>

                        <button
                          onClick={() => addToCart(book, 1)}
                          disabled={isOutOfStock}
                          className={
                            'py-2 text-center text-[10px] font-bold uppercase tracking-wider border-2 transition ' +
                            (isOutOfStock
                              ? 'border-[var(--border-subtle)] text-[var(--text-faint)] cursor-not-allowed'
                              : 'neo-btn-primary cursor-pointer')
                          }
                        >
                          {isOutOfStock ? 'Sold Out' : '+ Bag'}
                        </button>
                      </div>

                      <div className='grid grid-cols-2 gap-2 font-editorial-mono'>
                        <button
                          onClick={() => toggleWishlist(book)}
                          className={
                            'py-1.5 text-[9px] font-bold uppercase tracking-wider border transition text-center ' +
                            (isFavorite
                              ? 'bg-[var(--bg-accent-pink)] text-white border-[var(--border-main)]'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-main)]')
                          }
                        >
                          {isFavorite ? '♥ Saved' : '♡ Wishlist'}
                        </button>

                        <button
                          onClick={() => handleAddToCompareWithNotice(book)}
                          className={
                            'py-1.5 text-[9px] font-bold uppercase tracking-wider border transition text-center ' +
                            (inCompare
                              ? 'bg-[var(--bg-accent-blue)] text-white border-[var(--border-main)]'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-main)]')
                          }
                        >
                          {inCompare ? '✓ Compared' : '+ Compare'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
