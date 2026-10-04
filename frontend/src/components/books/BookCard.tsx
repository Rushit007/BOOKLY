'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { RatingStars } from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

interface BookCardProps {
  book: Book;
}

// Genre-based cover colors for editorial fallbacks
const GENRE_COLORS: Record<string, { bg: string; accent: string }> = {
  'Computer Science': { bg: '#181824', accent: '#60a5fa' },
  'Fiction': { bg: '#221426', accent: '#f472b6' },
  'Self-Help': { bg: '#13261a', accent: '#34d399' },
  'Business & Finance': { bg: '#291d10', accent: '#fcd34d' },
  'Science & Nature': { bg: '#112233', accent: '#38bdf8' },
  'Design & UI/UX': { bg: '#2b141d', accent: '#fb7185' },
  'हिंदी पुस्तकें': { bg: '#2d1a00', accent: '#f97316' },
  'ગુજરાતી પુસ્તકો': { bg: '#001a2d', accent: '#22d3ee' },
};

// Safe fallback book cover if primary image errors
const BACKUP_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop';

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const [imgSrc, setImgSrc] = useState<string>(book.coverImage || BACKUP_COVER);
  const [imgErrorCount, setImgErrorCount] = useState(0);
  const [showQuickInfo, setShowQuickInfo] = useState(false);

  const isFavorite = isInWishlist(book.id);
  const inCompare = isInCompare(book.id);
  const discountedPrice =
    book.discount > 0
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price;
  const isOutOfStock = book.stock <= 0;

  const genreColors = GENRE_COLORS[book.category?.name || ''] || { bg: '#181818', accent: '#fed053' };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(book.id);
    } else {
      addToCompare(book);
    }
  };

  const handleImageError = () => {
    if (imgErrorCount === 0) {
      // Try reliable curated fallback cover
      setImgSrc(BACKUP_COVER);
      setImgErrorCount(1);
    } else {
      // Switch to typographic editorial jacket
      setImgErrorCount(2);
    }
  };

  return (
    <div
      className='neo-card group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[6px_6px_0px_var(--border-main)] animate-fade-in'
      style={{ borderRadius: 0 }}
    >
      {/* Cover Image Container */}
      <div className='relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-surface-elevated)]'>
        {imgErrorCount < 2 ? (
          <img
            src={imgSrc}
            alt={book.title}
            loading='lazy'
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            onError={handleImageError}
          />
        ) : (
          /* Editorial typographic fallback cover */
          <div
            className='w-full h-full flex flex-col justify-between p-5 select-none'
            style={{ backgroundColor: genreColors.bg }}
          >
            <div className='flex items-center justify-between'>
              <span
                className='font-editorial-mono text-xs uppercase font-bold tracking-[0.2em]'
                style={{ color: genreColors.accent }}
              >
                {book.category?.name || 'BOOKLY'}
              </span>
              <span className='text-xs opacity-60' style={{ color: genreColors.accent }}>
                EDITION
              </span>
            </div>
            <div>
              <p
                className='font-editorial-serif text-xl font-bold leading-tight line-clamp-3 mb-3'
                style={{ color: '#ffffff' }}
              >
                {book.title}
              </p>
              <div className='w-10 h-1 mb-2' style={{ backgroundColor: genreColors.accent }} />
              <p
                className='font-editorial-mono text-xs uppercase font-semibold tracking-wider'
                style={{ color: genreColors.accent }}
              >
                {book.author}
              </p>
            </div>
          </div>
        )}

        {/* Badge strip — top-left */}
        <div className='absolute top-2 left-2 flex flex-col gap-1.5 z-10'>
          {book.discount > 0 && (
            <span className='badge-pill-pink px-2.5 py-1 text-xs font-black font-editorial-mono uppercase tracking-wider inline-block shadow-sm'>
              −{book.discount}% OFF
            </span>
          )}
          {book.rating >= 4.8 && (
            <span className='badge-pill-yellow px-2.5 py-1 text-xs font-black font-editorial-mono uppercase tracking-wider inline-block shadow-sm'>
              ★ BESTSELLER
            </span>
          )}
        </div>

        {/* Action icons — top right (Wishlist + Compare + Quick Info) */}
        <div className='absolute top-2 right-2 flex flex-col gap-1.5 z-10'>
          {/* Wishlist button */}
          <button
            onClick={() => toggleWishlist(book)}
            aria-label='Toggle wishlist'
            title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
            className={
              'w-8 h-8 flex items-center justify-center border-2 border-[var(--border-main)] transition-all shadow-sm ' +
              (isFavorite
                ? 'bg-[var(--bg-accent-pink)] text-white'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)]')
            }
          >
            <svg className='w-4 h-4' fill={isFavorite ? 'currentColor' : 'none'} viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
            </svg>
          </button>

          {/* Compare icon button */}
          <button
            onClick={handleToggleCompare}
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
            title={inCompare ? 'Remove from compare' : 'Compare this edition'}
            className={
              'w-8 h-8 flex items-center justify-center border-2 border-[var(--border-main)] transition-all shadow-sm font-bold text-sm ' +
              (inCompare
                ? 'bg-[var(--bg-accent-blue)] text-white'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-accent-blue)] hover:text-white')
            }
          >
            ⇄
          </button>

          {/* Quick Info modal toggle button */}
          <button
            onClick={() => setShowQuickInfo(!showQuickInfo)}
            aria-label='Quick info'
            title='View Book Description & Feature Info'
            className='w-8 h-8 flex items-center justify-center border-2 border-[var(--border-main)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-accent-blue)] hover:text-white transition-all shadow-sm font-bold text-xs'
          >
            ℹ
          </button>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className='absolute inset-0 bg-black/75 flex items-center justify-center z-10'>
            <span className='px-4 py-2 border-2 border-white text-white font-editorial-mono text-sm font-black uppercase tracking-widest bg-black/60'>
              SOLD OUT
            </span>
          </div>
        )}

        {/* Quick Info Overlay / Modal */}
        {showQuickInfo && (
          <div className='absolute inset-0 bg-[var(--bg-surface)] p-4 flex flex-col justify-between z-20 overflow-y-auto animate-fade-in border-2 border-[var(--border-main)]'>
            <div>
              <div className='flex items-center justify-between border-b-2 border-[var(--border-main)] pb-2 mb-2'>
                <span className='font-editorial-mono text-xs font-bold uppercase text-[var(--bg-accent-blue)]'>
                  Quick Edition Info
                </span>
                <button
                  onClick={() => setShowQuickInfo(false)}
                  className='text-base font-bold text-[var(--text-main)] hover:text-rose-500'
                >
                  ✕
                </button>
              </div>
              <h4 className='font-editorial-serif text-base font-bold text-[var(--text-main)] line-clamp-2'>
                {book.title}
              </h4>
              <p className='font-editorial-mono text-xs text-[var(--text-muted)] mb-2'>
                By {book.author} · {book.publisher || 'Independent'}
              </p>
              <p className='font-editorial-sans text-xs text-[var(--text-muted)] line-clamp-4 leading-relaxed'>
                {book.description}
              </p>
              <div className='mt-3 space-y-1 text-xs font-editorial-mono text-[var(--text-faint)]'>
                <div><strong>ISBN:</strong> {book.isbn}</div>
                <div><strong>Category:</strong> {book.category?.name || 'General'}</div>
                <div><strong>Stock Status:</strong> {book.stock > 0 ? `${book.stock} copies ready` : 'Out of stock'}</div>
              </div>
            </div>
            <Link
              href={`/books/${book.id}`}
              className='mt-3 py-2 text-center text-xs font-bold uppercase tracking-wider font-editorial-mono bg-[var(--text-main)] text-[var(--bg-page)] hover:bg-[var(--bg-accent-yellow)] hover:text-black transition-colors'
            >
              Full Book Page →
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3 border-t-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div>
          {/* Category + Stock indicator */}
          <div className='flex items-center justify-between mb-1.5'>
            <span className='font-editorial-mono text-xs uppercase tracking-[0.16em] font-bold text-[var(--text-faint)]'>
              {book.category?.name || 'BOOK'}
            </span>
            <span className='font-editorial-mono text-xs font-bold text-[var(--text-faint)]'>
              QTY {book.stock}
            </span>
          </div>

          {/* Title - Large & Highly Readable */}
          <Link href={`/books/${book.id}`}>
            <h3 className='font-editorial-serif text-xl sm:text-2xl font-bold leading-snug text-[var(--text-main)] line-clamp-2 hover:text-[var(--bg-accent-blue)] transition-colors'>
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <p className='font-editorial-mono text-xs sm:text-sm font-semibold text-[var(--text-muted)] mt-1 truncate'>
            {book.author}
          </p>

          {/* Rating */}
          <div className='mt-2.5 flex items-center gap-1.5'>
            <RatingStars rating={book.rating} numReviews={book.numReviews} size='sm' />
          </div>
        </div>

        <div>
          {/* Price Row */}
          <div className='flex items-baseline justify-between py-2 border-t-2 border-b-2 border-[var(--border-subtle)] mb-3'>
            <div className='flex items-baseline gap-2.5'>
              <span className='font-editorial-serif text-2xl sm:text-3xl font-black text-[var(--text-main)]'>
                ₹{discountedPrice}
              </span>
              {book.discount > 0 && (
                <span className='font-editorial-mono text-xs sm:text-sm text-[var(--text-faint)] line-through font-bold'>
                  ₹{book.price}
                </span>
              )}
            </div>
            {book.discount > 0 && (
              <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 font-editorial-mono'>
                Save ₹{book.price - discountedPrice}
              </span>
            )}
          </div>

          {/* Action buttons: Details & Add to Cart */}
          <div className='grid grid-cols-2 gap-2'>
            <Link
              href={`/books/${book.id}`}
              className='py-2.5 px-3 text-center font-editorial-mono text-xs font-black uppercase tracking-wider border-2 border-[var(--border-main)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] hover:text-black transition-all'
            >
              Details
            </Link>
            <button
              onClick={() => addToCart(book)}
              disabled={isOutOfStock}
              className='py-2.5 px-3 font-editorial-mono text-xs font-black uppercase tracking-wider border-2 border-[var(--border-main)] bg-[var(--text-main)] text-[var(--bg-page)] hover:bg-[var(--bg-accent-yellow)] hover:text-black hover:border-[var(--border-main)] transition-all disabled:opacity-40 disabled:cursor-not-allowed'
            >
              {isOutOfStock ? 'Sold Out' : '+ Add'}
            </button>
          </div>

          {/* Compare toggle button */}
          <button
            onClick={handleToggleCompare}
            className={
              'w-full mt-2 py-1.5 font-editorial-mono text-xs font-bold uppercase tracking-wider border border-[var(--border-subtle)] transition-all flex items-center justify-center gap-1.5 ' +
              (inCompare
                ? 'bg-[var(--bg-accent-blue)] text-white border-[var(--border-main)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-main)] hover:bg-[var(--bg-surface-elevated)]')
            }
          >
            <span>{inCompare ? '✓ In Compare' : '+ Compare Edition'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
