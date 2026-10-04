'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Book } from '../../../types/book';
import { api } from '../../../services/api';
import { RatingStars } from '../../../components/common/RatingStars';
import { BookCard } from '../../../components/books/BookCard';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCompare } from '../../../context/CompareContext';
import { useAuth } from '../../../context/AuthContext';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params?.id as string;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState(false);
  const [compareFeedback, setCompareFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadBook() {
      if (!bookId) return;
      setIsLoading(true);
      try {
        const found = await api.getBookById(bookId);
        setBook(found);
        const catalog = await api.getBooks({ limit: 5 });
        setRelatedBooks(catalog.data.filter((b) => b.id !== bookId).slice(0, 4));
      } catch (err) {
        console.error('Error loading book:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBook();
  }, [bookId]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[var(--bg-page)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='font-editorial-serif text-5xl text-[var(--text-faint)] animate-pulse mb-4'>···</div>
          <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]'>
            Loading Edition
          </p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className='min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-center text-center px-4'>
        <p className='font-editorial-serif text-5xl text-[var(--text-faint)] mb-4'>Not Found</p>
        <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8'>
          The requested edition could not be located in our catalog
        </p>
        <Link href='/' className='neo-btn-accent px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider inline-block'>
          Return to Catalog ↗
        </Link>
      </div>
    );
  }

  const discountedPrice =
    book.discount > 0
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price;

  const isFavorite = isInWishlist(book.id);
  const isOutOfStock = book.stock <= 0;
  const rupee = '\u20B9';

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  return (
    <div className='min-h-screen bg-[var(--bg-page)]'>
      {/* Breadcrumb strip */}
      <div className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2'>
          <Link
            href='/'
            className='font-editorial-mono text-[9px] uppercase tracking-widest text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors'
          >
            HOME
          </Link>
          <span className='font-editorial-mono text-[9px] text-[var(--text-faint)]'>/</span>
          <Link
            href='/#catalog'
            className='font-editorial-mono text-[9px] uppercase tracking-widest text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors'
          >
            CATALOG
          </Link>
          <span className='font-editorial-mono text-[9px] text-[var(--text-faint)]'>/</span>
          <span className='font-editorial-mono text-[9px] uppercase tracking-widest text-[var(--text-main)] truncate max-w-xs'>
            {book.title}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border-2 border-[var(--border-main)]'>
          {/* Left: Cover */}
          <div className='lg:col-span-5 border-r-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)]'>
            <div className='relative aspect-[3/4] w-full'>
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex flex-col justify-between p-8 bg-[var(--bg-surface-elevated)]'>
                  <span className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)]'>
                    {book.category?.name || 'FICTION'}
                  </span>
                  <div>
                    <h2 className='font-editorial-serif text-4xl leading-tight text-[var(--text-main)] mb-4'>
                      {book.title}
                    </h2>
                    {book.subtitle && (
                      <p className='font-editorial-sans text-sm italic text-[var(--text-muted)] mb-4'>
                        {book.subtitle}
                      </p>
                    )}
                    <p className='font-editorial-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]'>
                      {book.author}
                    </p>
                  </div>
                </div>
              )}

              {/* Discount badge */}
              {book.discount > 0 && (
                <div className='absolute top-0 left-0'>
                  <span className='badge-pill-pink inline-block px-3 py-1 text-[10px] font-bold font-editorial-mono uppercase tracking-wider'>
                    −{book.discount}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Metadata + Actions */}
          <div className='lg:col-span-7 px-6 py-8 space-y-6 bg-[var(--bg-surface)]'>
            {/* Category */}
            <div className='flex items-center gap-3'>
              <span className='badge-pill-yellow px-2.5 py-1 text-[9px] font-bold font-editorial-mono uppercase tracking-widest inline-block'>
                {book.category?.name || 'BOOK'}
              </span>
              {book.rating >= 4.8 && (
                <span className='badge-pill-mint px-2.5 py-1 text-[9px] font-bold font-editorial-mono uppercase tracking-widest inline-block'>
                  BESTSELLER
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className='font-editorial-serif text-3xl sm:text-4xl text-[var(--text-main)] leading-tight'>
                {book.title}
              </h1>
              {book.subtitle && (
                <p className='font-editorial-sans text-sm italic text-[var(--text-muted)] mt-1'>
                  {book.subtitle}
                </p>
              )}
              <p className='font-editorial-mono text-[10px] uppercase tracking-widest text-[var(--text-faint)] mt-3'>
                by{' '}
                <span className='font-bold text-[var(--text-muted)]'>{book.author}</span>
              </p>
            </div>

            {/* Rating + Stock */}
            <div className='flex items-center gap-4 py-3 border-y border-[var(--border-subtle)]'>
              <RatingStars rating={book.rating} numReviews={book.numReviews} size='md' />
              <span className='text-[var(--border-subtle)]'>|</span>
              <span
                className={
                  'font-editorial-mono text-[9px] font-bold uppercase tracking-wider ' +
                  (book.stock > 0
                    ? 'text-[var(--bg-accent-mint)]'
                    : 'text-[var(--bg-accent-pink)]')
                }
              >
                {book.stock > 0 ? `IN STOCK (${book.stock})` : 'OUT OF STOCK'}
              </span>
            </div>

            {/* Price */}
            <div className='flex items-baseline gap-3'>
              <span className='font-editorial-serif text-4xl font-bold text-[var(--text-main)]'>
                {rupee}{discountedPrice}
              </span>
              {book.discount > 0 && (
                <>
                  <span className='font-editorial-mono text-base text-[var(--text-faint)] line-through'>
                    {rupee}{book.price}
                  </span>
                  <span className='badge-pill-mint px-2 py-0.5 text-[9px] font-bold font-editorial-mono uppercase tracking-wider inline-block'>
                    SAVE {rupee}{book.price - discountedPrice}
                  </span>
                </>
              )}
            </div>

            {/* Member Content or Auth Gate */}
            {!isAuthenticated ? (
              <div className='p-6 sm:p-8 border-2 border-black dark:border-white/20 bg-gradient-to-br from-[#ffe17c]/20 via-white to-neutral-50 dark:from-[#ffe17c]/10 dark:via-[#141414] dark:to-[#0c0c0c] shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.1)] space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='px-2.5 py-1 bg-black text-[#ffe17c] font-editorial-mono text-[9px] font-black uppercase tracking-[0.2em]'>
                    🔒 MEMBER ACCESS REQUIRED
                  </span>
                  <span className='font-editorial-mono text-[10px] text-neutral-500'>
                    Free Reader Pass
                  </span>
                </div>

                <h3 className='font-cabinet font-800 text-xl sm:text-2xl text-neutral-900 dark:text-white leading-tight'>
                  Register to Read Synopsis & Order This Edition
                </h3>

                <p className='font-cabinet text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed'>
                  First time on BOOKLY? Full volume specifications, curator notes, reader discussions, and express dispatch are reserved for verified readers. Registration is 100% free and takes 30 seconds.
                </p>

                {/* Blurred preview of synopsis */}
                <div className='relative overflow-hidden max-h-16 opacity-60 filter blur-[1.5px] select-none'>
                  <p className='font-editorial-sans text-xs text-neutral-500'>
                    {book.description}
                  </p>
                </div>

                <div className='pt-2 flex flex-wrap items-center gap-3'>
                  <Link
                    href={`/register?redirect=${encodeURIComponent(`/books/${book.id}`)}`}
                    className='py-3 px-6 font-cabinet font-800 text-xs uppercase tracking-widest text-black bg-[#ffe17c] hover:bg-[#fed053] border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all'
                  >
                    Create Free Account →
                  </Link>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/books/${book.id}`)}`}
                    className='py-3 px-5 font-cabinet font-800 text-xs uppercase tracking-widest text-neutral-900 dark:text-white border-2 border-black dark:border-white/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Synopsis */}
                <div>
                  <p className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)] mb-2'>
                    Synopsis
                  </p>
                  <p className='font-editorial-sans text-sm text-[var(--text-muted)] leading-relaxed'>
                    {book.description}
                  </p>
                </div>

                {/* Quantity + Actions */}
                <div className='space-y-3 pt-2'>
                  <div className='flex items-center gap-3'>
                    {/* Qty stepper */}
                    <div className='flex items-center border-2 border-[var(--border-main)]'>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className='px-4 py-2.5 font-editorial-mono font-bold text-lg text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] transition-colors border-r border-[var(--border-subtle)]'
                      >
                        −
                      </button>
                      <span className='px-5 py-2.5 font-editorial-mono text-sm font-bold text-[var(--text-main)] min-w-[3rem] text-center'>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(book.stock || 99, quantity + 1))}
                        className='px-4 py-2.5 font-editorial-mono font-bold text-lg text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] transition-colors border-l border-[var(--border-subtle)]'
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={
                        'flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-2 transition flex items-center justify-center gap-2 font-editorial-mono ' +
                        (isOutOfStock
                          ? 'border-[var(--border-subtle)] text-[var(--text-faint)] cursor-not-allowed bg-[var(--bg-surface-elevated)]'
                          : 'neo-btn-primary cursor-pointer')
                      }
                    >
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                      </svg>
                      {isOutOfStock ? 'UNAVAILABLE' : 'ADD TO CART'}
                    </button>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(book)}
                      aria-label='Wishlist'
                      className={
                        'w-11 h-11 border-2 flex items-center justify-center transition ' +
                        (isFavorite
                          ? 'bg-[var(--bg-accent-pink)] border-[var(--border-main)] text-white'
                          : 'border-[var(--border-main)] text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)]')
                      }
                    >
                      <svg className='w-4 h-4' fill={isFavorite ? 'currentColor' : 'none'} viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}

                {/* Compare */}
                <button
                  onClick={() => {
                    if (isInCompare(book.id)) {
                      removeFromCompare(book.id);
                      setCompareFeedback(`Removed "${book.title}" from comparison.`);
                    } else {
                      const res = addToCompare(book);
                      setCompareFeedback(res.message);
                    }
                    setTimeout(() => setCompareFeedback(null), 3000);
                  }}
                  aria-label='Compare'
                  className={
                    'w-11 h-11 border-2 flex items-center justify-center transition font-editorial-mono text-xs font-bold ' +
                    (isInCompare(book.id)
                      ? 'bg-[var(--bg-accent-blue)] border-[var(--border-main)] text-white'
                      : 'border-[var(--border-main)] text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)]')
                  }
                >
                  ⇄
                </button>
              </div>

              {addedMessage && (
                <div className='border border-[var(--bg-accent-mint)] bg-[var(--bg-accent-mint)]/10 p-3 font-editorial-mono text-[10px] text-[var(--bg-accent-mint)]'>
                  ✓ Added {quantity} copy to your cart
                </div>
              )}
              {compareFeedback && (
                <div className='border border-[var(--bg-accent-blue)] bg-[var(--bg-accent-blue)]/10 p-3 font-editorial-mono text-[10px] text-[var(--bg-accent-blue)] flex items-center justify-between'>
                  <span>{compareFeedback}</span>
                  <Link href='/compare' className='font-bold underline ml-2'>View →</Link>
                </div>
              )}
            </div>

            {/* Specs table */}
            <div className='border-t border-[var(--border-subtle)] pt-5 grid grid-cols-2 sm:grid-cols-3 gap-4'>
              {[
                { label: 'Publisher', value: book.publisher || 'N/A' },
                { label: 'ISBN-13', value: book.isbn },
                { label: 'Format', value: 'Hardcover / Paperback' },
              ].map((spec) => (
                <div key={spec.label}>
                  <p className='font-editorial-mono text-[8px] uppercase tracking-[0.18em] text-[var(--text-faint)] mb-0.5'>
                    {spec.label}
                  </p>
                  <p className='font-editorial-mono text-[10px] font-bold text-[var(--text-main)]'>
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className='mt-16'>
            <div className='border-b-2 border-[var(--border-main)] pb-4 mb-0 flex items-baseline gap-4'>
              <span className='inline-block w-3 h-3 bg-[var(--bg-accent-violet)] border-2 border-[var(--border-main)]' />
              <h3 className='font-editorial-serif text-2xl text-[var(--text-main)]'>
                You Might Also Enjoy
              </h3>
            </div>
            <div className='border-l-2 border-[var(--border-main)]'>
              <div className='grid grid-cols-2 md:grid-cols-4'>
                {relatedBooks.map((relBook) => (
                  <div key={relBook.id} className='border-r-2 border-b-2 border-[var(--border-main)]'>
                    <BookCard book={relBook} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
