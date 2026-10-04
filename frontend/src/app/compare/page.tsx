'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../components/common/Toast';
import { RatingStars } from '../../components/common/RatingStars';
import { Book } from '../../types/book';
import { api } from '../../services/api';

export default function ComparePage() {
  const { compareBooks, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showSuccess, showInfo } = useToast();

  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [selectedBookToAdd, setSelectedBookToAdd] = useState<string>('');

  const rupee = '\u20B9';

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await api.getBooks({ limit: 50 });
        setAvailableBooks(res.data);
      } catch (err) {
        console.error('Failed to load books for comparison picker', err);
      }
    }
    loadCatalog();
  }, []);

  const handleAddFromDropdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookToAdd) return;
    const book = availableBooks.find((b) => b.id === selectedBookToAdd);
    if (book) {
      const res = addToCompare(book);
      showInfo('Comparison Updated', res.message);
      setSelectedBookToAdd('');
    }
  };

  // If no books are in compare
  if (compareBooks.length === 0) {
    return (
      <div className='min-h-screen bg-[var(--bg-page)] py-16 px-4 animate-fade-in'>
        <div className='max-w-xl mx-auto text-center border-2 border-[var(--border-main)] bg-[var(--bg-surface)] p-10 md:p-14 shadow-[6px_6px_0px_var(--border-main)]'>
          <div className='w-16 h-16 mx-auto bg-[var(--bg-accent-yellow)] border-2 border-[var(--border-main)] flex items-center justify-center text-2xl font-bold mb-6 shadow-[3px_3px_0px_var(--border-main)]'>
            ⚖
          </div>
          <h1 className='font-editorial-serif text-3xl sm:text-4xl text-[var(--text-main)] mb-3'>
            Compare Editions
          </h1>
          <p className='font-editorial-sans text-sm text-[var(--text-muted)] leading-relaxed mb-8 max-w-md mx-auto'>
            You haven't queued any books for comparison yet. Select up to 3 titles from the catalog to analyze specs, bindings, and prices side-by-side.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Link
              href='/books'
              className='neo-btn-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_var(--border-main)]'
            >
              Browse Catalog ↗
            </Link>
            <Link
              href='/book-match'
              className='neo-btn-secondary px-6 py-3.5 text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_var(--border-main)]'
            >
              Try Book Match ⚡
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const candidatesToAdd = availableBooks.filter(
    (b) => !compareBooks.some((cb) => cb.id === b.id)
  );

  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <div className='min-h-screen bg-[var(--bg-page)] animate-fade-in pb-16'>
      {/* Header */}
      <div className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-1.5 font-editorial-mono text-xs uppercase tracking-widest text-[var(--text-faint)]'>
              <Link href='/' className='hover:text-[var(--text-main)] font-semibold'>Home</Link>
              <span>/</span>
              <span className='text-[var(--text-main)] font-bold'>Compare</span>
            </div>
            <h1 className='font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-main)]'>
              Edition Specification Matrix
            </h1>
            <p className='font-editorial-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mt-1.5 font-bold'>
              Side-by-side technical and literary analysis ({compareBooks.length}/3 slots queued)
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => setShowInfoModal(true)}
              className='px-3.5 py-2 border-2 border-[var(--border-main)] bg-[var(--bg-accent-yellow)] text-black font-editorial-mono text-xs font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 shadow-sm'
            >
              <span>ℹ</span>
              <span>About Feature</span>
            </button>
            <button
              onClick={clearCompare}
              className='px-3.5 py-2 border-2 border-[var(--border-main)] bg-[var(--bg-surface)] font-editorial-mono text-xs font-bold text-[var(--bg-accent-pink)] hover:bg-[var(--bg-accent-pink)]/10 transition-colors uppercase tracking-wider'
            >
              Clear All
            </button>
            <Link
              href='/books'
              className='neo-btn-secondary px-4 py-2 font-editorial-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--border-main)]'
            >
              + Add Editions
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Explainer Banner */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6'>
        <div className='p-4 sm:p-5 border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[4px_4px_0px_var(--border-main)]'>
          <div className='flex items-center gap-3'>
            <span className='w-8 h-8 rounded-full bg-[var(--bg-accent-blue)] text-white font-bold flex items-center justify-center text-sm shrink-0 border border-black/20'>
              ⇄
            </span>
            <div>
              <h4 className='font-editorial-serif text-base font-bold text-[var(--text-main)]'>
                How Edition Compare Works
              </h4>
              <p className='font-editorial-sans text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 leading-relaxed'>
                Compare pricing, discount depth, average reader ratings, physical bindings, and publishers across up to 3 titles to make the most informed reading choice.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfoModal(true)}
            className='font-editorial-mono text-xs font-bold text-[var(--bg-accent-blue)] hover:underline whitespace-nowrap'
          >
            Read Feature Specs &amp; Tips →
          </button>
        </div>
      </div>

      {/* Feature Info Modal */}
      {showInfoModal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
          <div className='max-w-lg w-full neo-card bg-[var(--bg-surface)] border-2 border-[var(--border-main)] p-6 sm:p-8 shadow-[8px_8px_0px_var(--border-main)] animate-scale-in'>
            <div className='flex items-center justify-between border-b-2 border-[var(--border-main)] pb-3 mb-4'>
              <div className='flex items-center gap-2.5'>
                <span className='w-8 h-8 bg-[var(--bg-accent-blue)] text-white flex items-center justify-center text-base font-black border border-black'>
                  ⇄
                </span>
                <h3 className='font-editorial-serif text-2xl font-bold text-[var(--text-main)]'>
                  Compare Editions Guide
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className='text-xl font-bold text-[var(--text-main)] hover:text-rose-500'
              >
                ✕
              </button>
            </div>

            <div className='space-y-3 font-editorial-sans text-sm text-[var(--text-muted)] leading-relaxed'>
              <p>
                <strong>The Goal:</strong> Eliminate guesswork when choosing between foundational books in the same discipline (e.g. <em>Clean Code</em> vs <em>The Pragmatic Programmer</em>).
              </p>
              <div className='p-3 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1 text-xs font-editorial-mono'>
                <div>1. Click <strong>+ Compare Edition</strong> on any book in the store.</div>
                <div>2. Up to 3 titles fit into the matrix simultaneously.</div>
                <div>3. Check real-time warehouse inventory and savings before ordering.</div>
              </div>
              <p className='text-xs font-editorial-mono text-[var(--text-faint)]'>
                💡 <em>Pro Tip: You can order directly from the matrix column without navigating back to the catalog.</em>
              </p>
            </div>

            <div className='mt-6 pt-3 border-t-2 border-[var(--border-main)] flex justify-end'>
              <button
                onClick={() => setShowInfoModal(false)}
                className='py-2 px-5 font-editorial-mono text-xs font-bold uppercase bg-[var(--text-main)] text-[var(--bg-page)] border-2 border-[var(--border-main)] hover:bg-[var(--bg-accent-yellow)] hover:text-black transition-colors'
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6'>
        {/* Quick Add Slot Bar */}
        {compareBooks.length < 3 && candidatesToAdd.length > 0 && (
          <form
            onSubmit={handleAddFromDropdown}
            className='p-4 border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] flex flex-col sm:flex-row items-center gap-3 shadow-[3px_3px_0px_var(--border-main)]'
          >
            <div className='flex-1 w-full'>
              <label htmlFor='add-book-select' className='font-editorial-mono text-xs font-bold uppercase tracking-wider text-[var(--text-main)] block mb-1'>
                Select an edition to fill comparison slot ({compareBooks.length}/3):
              </label>
              <select
                id='add-book-select'
                value={selectedBookToAdd}
                onChange={(e) => setSelectedBookToAdd(e.target.value)}
                className='w-full px-3 py-2 text-xs font-editorial-mono bg-[var(--bg-surface)] border-2 border-[var(--border-main)] text-[var(--text-main)] focus:outline-none'
              >
                <option value=''>-- Select a book from catalog --</option>
                {candidatesToAdd.map((b) => (
                  <option key={'opt-' + b.id} value={b.id}>
                    {b.title} by {b.author} ({rupee}{b.price})
                  </option>
                ))}
              </select>
            </div>
            <button
              type='submit'
              disabled={!selectedBookToAdd}
              className='sm:self-end px-6 py-2.5 neo-btn-accent text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer disabled:opacity-50'
            >
              Add To Matrix
            </button>
          </form>
        )}

        {/* Matrix Table */}
        <div className='overflow-x-auto border-2 border-[var(--border-main)] bg-[var(--bg-surface)] shadow-[6px_6px_0px_var(--border-main)]'>
          <div className='min-w-[700px]'>
            {/* Top Cards Row */}
            <div className='grid grid-cols-4 border-b-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)]'>
              <div className='p-5 font-editorial-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-faint)] flex items-center'>
                EDITIONS &amp; ARTIFACTS
              </div>
              {compareBooks.map((book) => {
                const discountedPrice =
                  book.discount > 0
                    ? Math.round(book.price * (1 - book.discount / 100))
                    : book.price;
                const isFavorite = isInWishlist(book.id);
                const isOutOfStock = book.stock <= 0;

                return (
                  <div key={'col-header-' + book.id} className='p-5 border-l-2 border-[var(--border-main)] relative flex flex-col justify-between'>
                    <button
                      onClick={() => removeFromCompare(book.id)}
                      className='absolute top-3 right-3 w-6 h-6 border border-[var(--border-main)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-accent-pink)] hover:text-white flex items-center justify-center text-xs font-bold transition'
                      title='Remove from comparison'
                    >
                      ×
                    </button>

                    <div className='flex flex-col items-center text-center space-y-3 mb-4'>
                      <div className='w-24 aspect-[3/4] border-2 border-[var(--border-main)] bg-[var(--bg-surface)] overflow-hidden shadow-[2px_2px_0px_var(--border-main)]'>
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className='w-full h-full object-cover' />
                        ) : (
                          <div className='p-2 bg-[var(--bg-surface-elevated)] w-full h-full flex flex-col items-center justify-center text-[9px] font-editorial-mono'>
                            <span>{book.title}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/books/${book.id}`}
                          className='font-editorial-serif font-bold text-sm text-[var(--text-main)] hover:text-[var(--bg-accent-blue)] line-clamp-2'
                        >
                          {book.title}
                        </Link>
                        <p className='font-editorial-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] mt-0.5'>
                          {book.author}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='space-y-2 pt-2 border-t border-[var(--border-subtle)]'>
                      <button
                        onClick={() => addToCart(book, 1)}
                        disabled={isOutOfStock}
                        className={
                          'w-full py-2 px-3 text-[10px] font-bold uppercase tracking-wider border-2 transition ' +
                          (isOutOfStock
                            ? 'border-[var(--border-subtle)] text-[var(--text-faint)] cursor-not-allowed'
                            : 'neo-btn-primary cursor-pointer')
                        }
                      >
                        {isOutOfStock ? 'Sold Out' : '+ Add to Bag'}
                      </button>

                      <div className='grid grid-cols-2 gap-1.5'>
                        <button
                          onClick={() => toggleWishlist(book)}
                          className={
                            'py-1 text-[9px] font-editorial-mono font-bold uppercase tracking-wider border transition ' +
                            (isFavorite
                              ? 'bg-[var(--bg-accent-pink)] text-white border-[var(--border-main)]'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-main)]')
                          }
                        >
                          {isFavorite ? '♥ Saved' : '♡ Wishlist'}
                        </button>
                        <Link
                          href={`/books/${book.id}`}
                          className='py-1 text-[9px] font-editorial-mono font-bold uppercase tracking-wider border border-[var(--border-subtle)] hover:border-[var(--border-main)] text-center text-[var(--text-muted)]'
                        >
                          Specs ↗
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty placeholder slots */}
              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div
                  key={'empty-slot-col-' + i}
                  className='p-6 flex flex-col items-center justify-center border-l-2 border-[var(--border-main)] text-center space-y-2'
                >
                  <div className='w-12 h-16 border-2 border-dashed border-[var(--border-subtle)] flex items-center justify-center text-lg font-editorial-mono text-[var(--text-faint)]'>
                    +
                  </div>
                  <p className='font-editorial-mono text-[10px] font-bold uppercase text-[var(--text-faint)]'>Empty Slot</p>
                </div>
              ))}
            </div>

            {/* Spec Row: Price */}
            <div className='grid grid-cols-4 border-b border-[var(--border-subtle)] py-3 px-5 items-center font-editorial-mono text-xs'>
              <div className='text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider'>Price</div>
              {compareBooks.map((b) => {
                const dp = b.discount > 0 ? Math.round(b.price * (1 - b.discount / 100)) : b.price;
                return (
                  <div key={'price-' + b.id} className='px-3 border-l-2 border-[var(--border-subtle)] flex items-baseline gap-2'>
                    <span className='font-editorial-serif font-bold text-base text-[var(--text-main)]'>{rupee}{dp}</span>
                    {b.discount > 0 && <span className='text-[10px] text-[var(--text-faint)] line-through'>{rupee}{b.price}</span>}
                  </div>
                );
              })}
              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div key={'emp-p-' + i} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-faint)]'>-</div>
              ))}
            </div>

            {/* Spec Row: Category */}
            <div className='grid grid-cols-4 border-b border-[var(--border-subtle)] py-3 px-5 items-center font-editorial-mono text-xs bg-[var(--bg-surface-elevated)]/30'>
              <div className='text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider'>Genre</div>
              {compareBooks.map((b) => (
                <div key={'cat-' + b.id} className='px-3 border-l-2 border-[var(--border-subtle)] font-bold text-[var(--text-main)]'>
                  {b.category?.name || 'General'}
                </div>
              ))}
              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div key={'emp-c-' + i} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-faint)]'>-</div>
              ))}
            </div>

            {/* Spec Row: Rating */}
            <div className='grid grid-cols-4 border-b border-[var(--border-subtle)] py-3 px-5 items-center font-editorial-mono text-xs'>
              <div className='text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider'>Rating</div>
              {compareBooks.map((b) => (
                <div key={'rat-' + b.id} className='px-3 border-l-2 border-[var(--border-subtle)]'>
                  <RatingStars rating={b.rating} numReviews={b.numReviews} size='sm' />
                </div>
              ))}
              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div key={'emp-r-' + i} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-faint)]'>-</div>
              ))}
            </div>

            {/* Spec Row: Stock */}
            <div className='grid grid-cols-4 border-b border-[var(--border-subtle)] py-3 px-5 items-center font-editorial-mono text-xs bg-[var(--bg-surface-elevated)]/30'>
              <div className='text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider'>Stock</div>
              {compareBooks.map((b) => (
                <div key={'stk-' + b.id} className='px-3 border-l-2 border-[var(--border-subtle)] font-bold'>
                  {b.stock > 0 ? (
                    <span className='text-[var(--bg-accent-mint)]'>In Stock ({b.stock} left)</span>
                  ) : (
                    <span className='text-[var(--bg-accent-pink)]'>Sold Out</span>
                  )}
                </div>
              ))}
              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div key={'emp-s-' + i} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-faint)]'>-</div>
              ))}
            </div>

            {/* Spec Row: ISBN */}
            <div className='grid grid-cols-4 border-b border-[var(--border-subtle)] py-3 px-5 items-center font-editorial-mono text-xs'>
              <div className='text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider'>ISBN-13</div>
              {compareBooks.map((b) => (
                <div key={'isbn-' + b.id} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-muted)]'>
                  {b.isbn}
                </div>
              ))}
              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div key={'emp-isbn-' + i} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-faint)]'>-</div>
              ))}
            </div>

            {/* Spec Row: Reviews */}
            <div className='grid grid-cols-4 border-b border-[var(--border-subtle)] py-3 px-5 items-center font-editorial-mono text-xs bg-[var(--bg-surface-elevated)]/30'>
              <div className='text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider'>Reviews</div>
              {compareBooks.map((b) => (
                <div key={'rev-' + b.id} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-main)] font-bold'>
                  {b.numReviews} Verified Reviews
                </div>
              ))}
              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div key={'emp-rev-' + i} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-faint)]'>-</div>
              ))}
            </div>

            {/* Spec Row: Publisher */}
            <div className='grid grid-cols-4 py-3 px-5 items-center font-editorial-mono text-xs'>
              <div className='text-[10px] uppercase font-bold text-[var(--text-faint)] tracking-wider'>Publisher</div>
              {compareBooks.map((b) => (
                <div key={'pub-' + b.id} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-muted)]'>
                  {b.publisher || 'Independent Press'}
                </div>
              ))}
              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div key={'emp-pub-' + i} className='px-3 border-l-2 border-[var(--border-subtle)] text-[var(--text-faint)]'>-</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
