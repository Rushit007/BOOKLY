'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book } from '../../types/book';
import { RatingStars } from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';

interface BookCardProps {
  book: Book;
}

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

const BACKUP_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop';

export function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const [imgSrc, setImgSrc] = useState<string>(book.coverImage || BACKUP_COVER);
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const isFavorite = isInWishlist(book.id);
  const inCompare = isInCompare(book.id);
  const discountedPrice =
    book.discount > 0
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price;
  const isOutOfStock = book.stock <= 0;

  const genreColors = GENRE_COLORS[book.category?.name || ''] || { bg: '#181818', accent: '#d97706' };

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
      setImgSrc(BACKUP_COVER);
      setImgErrorCount(1);
    } else {
      setImgErrorCount(2);
    }
  };

  return (
    <div
      className='tactile-book-card group relative flex flex-col bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300'
    >
      {/* Cover Image Container */}
      <div className='relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-surface-elevated)]'>
        {/* Real Book Spine Overlay */}
        <div className='tactile-spine' />

        {imgErrorCount < 2 ? (
          <img
            src={imgSrc}
            alt={book.title}
            loading='lazy'
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            onError={handleImageError}
          />
        ) : (
          <div
            className='w-full h-full flex flex-col justify-between p-5 select-none'
            style={{ backgroundColor: genreColors.bg }}
          >
            <div className='flex items-center justify-between'>
              <span
                className='font-sans text-xs uppercase font-bold tracking-[0.2em]'
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
                className='font-editorial-serif text-lg font-bold leading-tight line-clamp-3 mb-3'
                style={{ color: '#ffffff' }}
              >
                {book.title}
              </p>
              <div className='w-8 h-0.5 mb-2' style={{ backgroundColor: genreColors.accent }} />
              <p
                className='font-sans text-xs uppercase font-semibold tracking-wider'
                style={{ color: genreColors.accent }}
              >
                {book.author}
              </p>
            </div>
          </div>
        )}

        {/* Badge strip — top-left */}
        <div className='absolute top-3 left-3 flex flex-col gap-1.5 z-10'>
          {book.discount > 0 && (
            <span className='px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-rose-500 text-white shadow-sm'>
              -{book.discount}%
            </span>
          )}
          {book.rating >= 4.8 && (
            <span className='px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-amber-500 text-black shadow-sm'>
              ★ 4.8+
            </span>
          )}
        </div>

        {/* Action icons — top right (Wishlist + Compare) */}
        <div className='absolute top-3 right-3 flex flex-col gap-1.5 z-10'>
          <button
            onClick={() => toggleWishlist(book)}
            aria-label='Toggle wishlist'
            title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
            className={
              'w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-main)] transition-all shadow-sm cursor-pointer ' +
              (isFavorite
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]')
            }
          >
            <svg className='w-4 h-4' fill={isFavorite ? 'currentColor' : 'none'} viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
            </svg>
          </button>

          <button
            onClick={handleToggleCompare}
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
            title={inCompare ? 'Remove from compare' : 'Compare edition'}
            className={
              'w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-main)] transition-all shadow-sm font-bold text-xs cursor-pointer ' +
              (inCompare
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]')
            }
          >
            ⇄
          </button>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className='absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-10'>
            <span className='px-4 py-1.5 rounded-full text-white font-sans text-xs font-bold uppercase tracking-widest bg-black/80 border border-white/20'>
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]'>
        <div>
          {/* Category */}
          <div className='flex items-center justify-between mb-1'>
            <span className='font-sans text-[11px] uppercase tracking-wider font-semibold text-[var(--text-faint)]'>
              {book.category?.name || 'Book'}
            </span>
            <span className='font-mono text-[11px] text-[var(--text-faint)]'>
              Stock: {book.stock}
            </span>
          </div>

          {/* Title */}
          <Link href={`/books/${book.id}`}>
            <h3 className='font-editorial-serif text-lg sm:text-xl font-bold leading-snug text-[var(--text-main)] line-clamp-2 hover:opacity-75 transition-opacity'>
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <p className='font-sans text-xs font-medium text-[var(--text-muted)] mt-1 truncate'>
            {book.author}
          </p>

          {/* Rating */}
          <div className='mt-2 flex items-center gap-1.5'>
            <RatingStars rating={book.rating} numReviews={book.numReviews} size='sm' />
          </div>
        </div>

        <div>
          {/* Price Row */}
          <div className='flex items-baseline justify-between py-2 border-t border-b border-[var(--border-subtle)] mb-3'>
            <div className='flex items-baseline gap-2'>
              <span className='font-editorial-serif text-xl sm:text-2xl font-bold text-[var(--text-main)]'>
                ₹{discountedPrice}
              </span>
              {book.discount > 0 && (
                <span className='font-mono text-xs text-[var(--text-faint)] line-through'>
                  ₹{book.price}
                </span>
              )}
            </div>
            {book.discount > 0 && (
              <span className='text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-sans'>
                Save ₹{book.price - discountedPrice}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className='grid grid-cols-2 gap-2'>
            <Link
              href={`/books/${book.id}`}
              className='py-2 px-3 rounded-full text-center font-sans text-xs font-semibold border border-[var(--border-main)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors'
            >
              Details
            </Link>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  router.push(`/register?redirect=${encodeURIComponent(`/books/${book.id}`)}`);
                  return;
                }
                addToCart(book);
              }}
              disabled={isOutOfStock}
              className='py-2 px-3 rounded-full font-sans text-xs font-semibold bg-[var(--text-main)] text-[var(--bg-page)] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs'
            >
              {isOutOfStock ? 'Sold Out' : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
