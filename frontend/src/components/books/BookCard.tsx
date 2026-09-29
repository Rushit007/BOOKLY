'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const isFavorite = isInWishlist(book.id);
  const inCompare = isInCompare(book.id);
  const discountedPrice =
    book.discount > 0
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price;
  const isOutOfStock = book.stock <= 0;

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(book.id);
    } else {
      addToCompare(book);
    }
  };

  return (
    <div className='group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden'>
      {/* Cover Image Container */}
      <div className='relative aspect-[3/4] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden'>
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white'>
            <span className='text-xs uppercase font-bold tracking-wider text-indigo-300'>
              {book.author}
            </span>
            <span className='text-sm font-bold mt-2'>{book.title}</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className='absolute top-3 left-3 flex flex-col gap-1.5 z-10'>
          {book.discount > 0 && (
            <Badge variant='discount'>
              -{book.discount}% OFF
            </Badge>
          )}
          {book.rating >= 4.8 && <Badge variant='bestseller'>BESTSELLER</Badge>}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={() => toggleWishlist(book)}
          aria-label='Toggle wishlist'
          className={
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 z-10 shadow-sm ' +
            (isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-rose-500')
          }
        >
          <svg
            className='w-4 h-4'
            fill={isFavorite ? 'currentColor' : 'none'}
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
            />
          </svg>
        </button>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className='absolute inset-0 bg-slate-950/70 flex items-center justify-center'>
            <span className='px-3 py-1 bg-slate-900 text-slate-200 text-xs font-bold uppercase rounded-lg border border-slate-700'>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Book Metadata Content */}
      <div className='flex-1 p-4 flex flex-col justify-between'>
        <div>
          <div className='flex items-center justify-between text-xs text-slate-400 mb-1'>
            <span className='truncate max-w-[140px] font-medium'>
              {book.category?.name || 'Book'}
            </span>
            <span>ISBN: {book.isbn.slice(-5)}</span>
          </div>

          <Link
            href={`/books/${book.id}`}
            className='group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition'
          >
            <h3 className='font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug mb-1'>
              {book.title}
            </h3>
          </Link>

          <p className='text-xs text-slate-500 dark:text-slate-400 truncate mb-2'>
            by{' '}
            <span className='font-medium text-slate-700 dark:text-slate-300'>
              {book.author}
            </span>
          </p>

          <div className='mb-3'>
            <RatingStars rating={book.rating} numReviews={book.numReviews} size='sm' />
          </div>
        </div>

        <div>
          {/* Pricing Row */}
          <div className='flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mb-3'>
            <div className='flex items-baseline gap-1.5'>
              <span className='text-lg font-black text-slate-900 dark:text-white'>
                {'\u20B9'}{discountedPrice}
              </span>
              {book.discount > 0 && (
                <span className='text-xs text-slate-400 line-through'>
                  {'\u20B9'}{book.price}
                </span>
              )}
            </div>
            <span className='text-[11px] font-semibold text-emerald-600 dark:text-emerald-400'>
              {book.stock > 0 ? `In Stock (${book.stock})` : 'Sold Out'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className='grid grid-cols-2 gap-2'>
            <Link
              href={`/books/${book.id}`}
              className='py-2 px-2.5 rounded-xl text-center text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition'
            >
              Details
            </Link>
            <button
              onClick={() => addToCart(book, 1)}
              disabled={isOutOfStock}
              className={
                'py-2 px-2.5 rounded-xl text-center text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 ' +
                (isOutOfStock
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20')
              }
            >
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                />
              </svg>
              Add
            </button>
          </div>

          {/* Compare Toggle Button */}
          <button
            onClick={handleToggleCompare}
            className={
              'w-full mt-2 py-1.5 px-2 rounded-xl text-center text-[11px] font-semibold transition border flex items-center justify-center gap-1.5 ' +
              (inCompare
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold'
                : 'border-slate-200/80 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800')
            }
          >
            <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
            </svg>
            <span>{inCompare ? '\u2713 In Compare' : '+ Compare'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
