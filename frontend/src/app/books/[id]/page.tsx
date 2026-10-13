'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Book } from '../../../types/book';
import { api } from '../../../services/api';
import { RatingStars } from '../../../components/common/RatingStars';
import { TierRatingWidget } from '../../../components/common/TierRatingWidget';
import { BookCard } from '../../../components/books/BookCard';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCompare } from '../../../context/CompareContext';
import { useAuth } from '../../../context/AuthContext';
import { getAuthenticCover } from '../../../utils/bookCovers';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params?.id as string;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { isAuthenticated } = useAuth();

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
      <div className='border-b border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2'>
          <Link
            href='/'
            className='font-sans text-xs text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors'
          >
            Home
          </Link>
          <span className='font-sans text-xs text-[var(--text-faint)]'>/</span>
          <Link
            href='/books'
            className='font-sans text-xs text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors'
          >
            Catalog
          </Link>
          <span className='font-sans text-xs text-[var(--text-faint)]'>/</span>
          <span className='font-sans text-xs font-medium text-[var(--text-main)] truncate max-w-xs'>
            {book.title}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border border-[var(--border-main)] rounded-2xl bg-[var(--bg-surface)] overflow-hidden shadow-xs'>
          {/* Left: Real-Book Cover Presentation */}
          <div className='lg:col-span-5 border-r border-[var(--border-main)] bg-[var(--bg-surface-elevated)] relative overflow-hidden'>
            {/* Real Silk Ribbon Bookmark */}
            <div className='tactile-ribbon' title='Archival Bookmark' />

            <div className='relative aspect-[3/4] w-full'>
              {/* Real Book Spine Overlay & Hinge Lighting */}
              <div className='tactile-spine' />

              {book.coverImage ? (
                <img
                  src={getAuthenticCover(book)}
                  alt={book.title}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex flex-col justify-between p-8 bg-[var(--bg-surface-elevated)]'>
                  <span className='font-sans text-xs uppercase tracking-wider text-[var(--text-muted)]'>
                    {book.category?.name || 'Edition'}
                  </span>
                  <div>
                    <h2 className='font-editorial-serif text-3xl leading-tight text-[var(--text-main)] mb-3 font-bold'>
                      {book.title}
                    </h2>
                    {book.subtitle && (
                      <p className='font-sans text-sm italic text-[var(--text-muted)] mb-3'>
                        {book.subtitle}
                      </p>
                    )}
                    <p className='font-sans text-xs uppercase tracking-wider text-[var(--text-muted)]'>
                      by {book.author}
                    </p>
                  </div>
                </div>
              )}

              {/* Discount badge */}
              {book.discount > 0 && (
                <div className='absolute bottom-3 left-3 z-10'>
                  <span className='px-2.5 py-1 rounded-full text-xs font-sans font-bold bg-rose-500 text-white shadow-sm'>
                    -{book.discount}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Metadata + Actions */}
          <div className='lg:col-span-7 px-6 py-8 space-y-6 bg-[var(--bg-surface)]'>
            {/* Category */}
            <div className='flex items-center gap-2.5'>
              <span className='px-3 py-1 rounded-full text-xs font-sans font-semibold bg-[var(--bg-surface-elevated)] text-[var(--text-main)] border border-[var(--border-main)]'>
                {book.category?.name || 'Curated'}
              </span>
              {book.rating >= 4.8 && (
                <span className='px-3 py-1 rounded-full text-xs font-sans font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'>
                  ★ Bestseller
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className='font-editorial-serif text-3xl sm:text-4xl text-[var(--text-main)] leading-tight font-black'>
                {book.title}
              </h1>
              {book.subtitle && (
                <p className='font-editorial-sans text-sm italic text-[var(--text-muted)] mt-1'>
                  {book.subtitle}
                </p>
              )}
              <p className='font-editorial-mono text-xs uppercase tracking-widest text-[var(--text-faint)] mt-2'>
                AUTHORED BY{' '}
                <span className='font-bold text-[var(--text-main)]'>{book.author}</span>
              </p>
            </div>

            {/* Rating + Stock */}
            <div className='flex items-center gap-4 py-3 border-y border-[var(--border-subtle)]'>
              <RatingStars rating={book.rating} numReviews={book.numReviews} size='md' />
              <span className='text-[var(--border-subtle)]'>|</span>
              <span
                className={
                  'font-pixel text-[8px] uppercase tracking-wider ' +
                  (book.stock > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400')
                }
              >
                {book.stock > 0 ? `IN STOCK (${book.stock})` : 'SOLD OUT'}
              </span>
            </div>

            {/* Price */}
            <div className='flex items-baseline gap-3'>
              <span className='font-serif text-3xl font-black text-zinc-900 dark:text-white'>
                {rupee}{discountedPrice}
              </span>
              {book.discount > 0 && (
                <>
                  <span className='text-sm text-zinc-400 line-through'>
                    {rupee}{book.price}
                  </span>
                  <span className='px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800'>
                    SAVE {rupee}{book.price - discountedPrice}
                  </span>
                </>
              )}
            </div>

            {/* 4-Tier Reader Consensus System */}
            <TierRatingWidget
              bookId={book.id}
              initialTier={book.tierRating}
              initialVotes={book.tierVotes}
            />

            {/* Member Content or Auth Gate */}
            {!isAuthenticated ? (
              <div className='p-6 sm:p-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-900/60 shadow-xs space-y-4 rounded-2xl'>
                <div className='flex items-center gap-2'>
                  <span className='px-2.5 py-1 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-mono text-[9px] font-bold'>
                    🔒 EXCLUSIVE READER ACCESS
                  </span>
                  <span className='text-[11px] text-zinc-500 uppercase tracking-wider font-semibold'>
                    Notebook Member Gate
                  </span>
                </div>

                <h3 className='font-serif font-black text-lg text-zinc-900 dark:text-white leading-relaxed'>
                  Sign In to Read Full Volume Dossier &amp; Place Order
                </h3>

                <p className='text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed'>
                  Full volume specifications, curator notes, reader discussions, and express Indian dispatch are reserved for verified readers. Registration is 100% free and takes 30 seconds.
                </p>

                {/* Blurred preview of synopsis */}
                <div className='relative overflow-hidden max-h-16 opacity-40 filter blur-[2px] select-none'>
                  <p className='text-xs text-zinc-500'>
                    {book.description}
                  </p>
                </div>

                <div className='pt-2 flex flex-wrap items-center gap-3'>
                  <Link
                    href={`/register?redirect=${encodeURIComponent(`/books/${book.id}`)}`}
                    className='py-2.5 px-6 font-bold text-xs uppercase tracking-wider text-white bg-zinc-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all shadow-md rounded-full'
                  >
                    Create Free Notebook Account ↗
                  </Link>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(`/books/${book.id}`)}`}
                    className='py-2.5 px-6 font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-full'
                  >
                    Sign In to Library
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Synopsis */}
                <div>
                  <p className='font-array text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)] mb-2'>
                    Synopsis
                  </p>
                  <p className='font-array text-sm text-[var(--text-muted)] leading-relaxed'>
                    {book.description}
                  </p>
                </div>

                {/* Quantity + Actions */}
                <div className='space-y-3 pt-2'>
                  <div className='flex items-center gap-3'>
                    {/* Qty stepper */}
                    <div className='flex items-center border-2 border-[var(--border-main)] rounded-xl overflow-hidden'>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className='px-4 py-2.5 font-array font-bold text-lg text-[var(--text-main)] hover:bg-[#E5F3F4] transition-colors border-r border-[var(--border-subtle)]'
                      >
                        −
                      </button>
                      <span className='px-5 py-2.5 font-pixel text-xs font-bold text-[var(--text-main)] min-w-[3rem] text-center'>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(book.stock || 99, quantity + 1))}
                        className='px-4 py-2.5 font-array font-bold text-lg text-[var(--text-main)] hover:bg-[#E5F3F4] transition-colors border-l border-[var(--border-subtle)]'
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={
                        'flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-2 transition flex items-center justify-center gap-2 font-array rounded-full ' +
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
                        'w-11 h-11 border-2 rounded-full flex items-center justify-center transition ' +
                        (isFavorite
                          ? 'bg-[#FF66B3] border-[#FF66B3] text-white shadow-md shadow-[#FF66B3]/30'
                          : 'border-[var(--border-main)] text-[var(--text-main)] hover:bg-[#E5F3F4]')
                      }
                    >
                      <svg className='w-4 h-4' fill={isFavorite ? 'currentColor' : 'none'} viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                      </svg>
                    </button>

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
                    <div className='border-2 border-[var(--text-accent-mint)] bg-[var(--bg-accent-mint)]/10 p-3 font-editorial-mono text-xs font-bold text-[var(--text-accent-mint)]'>
                      ✓ Added {quantity} copy to your cart
                    </div>
                  )}
                  {compareFeedback && (
                    <div className='border-2 border-[var(--text-accent-blue)] bg-[var(--bg-accent-blue)]/10 p-3 font-editorial-mono text-xs font-bold text-[var(--text-accent-blue)] flex items-center justify-between'>
                      <span>{compareFeedback}</span>
                      <Link href='/compare' className='font-bold underline ml-2'>View →</Link>
                    </div>
                  )}
                </div>
              </>
            )}

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
