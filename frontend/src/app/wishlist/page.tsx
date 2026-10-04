'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function WishlistPage() {
  const { items, wishlistCount, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const rupee = '\u20B9';

  return (
    <div className='min-h-screen bg-[var(--bg-page)]'>
      {/* Page header */}
      <div className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-baseline justify-between'>
          <div className='flex items-baseline gap-4'>
            <h1 className='font-editorial-serif text-3xl sm:text-4xl text-[var(--text-main)]'>
              Saved Editions
            </h1>
            <span className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)]'>
              {wishlistCount} TITLE{wishlistCount !== 1 ? 'S' : ''}
            </span>
          </div>
          <Link
            href='/books'
            className='hidden sm:inline font-editorial-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)] hover:text-[var(--text-main)] border-b border-[var(--border-subtle)] hover:border-[var(--border-main)] transition-colors pb-0.5'
          >
            Discover More ↗
          </Link>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {items.length === 0 ? (
          <div className='border-2 border-[var(--border-main)] bg-[var(--bg-surface)] py-24 text-center'>
            <p className='font-editorial-serif text-5xl text-[var(--text-faint)] mb-4'>
              Empty List
            </p>
            <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8'>
              Save books by clicking the heart on any book card
            </p>
            <Link
              href='/books'
              className='neo-btn-accent inline-flex items-center gap-2 px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider'
            >
              Explore Catalog ↗
            </Link>
          </div>
        ) : (
          /* Grid — bordered like featured section */
          <div className='border-l-2 border-t-2 border-[var(--border-main)]'>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
              {items.map((item) => {
                const book = item.book;
                const discountedPrice =
                  book.discount > 0
                    ? Math.round(book.price * (1 - book.discount / 100))
                    : book.price;

                return (
                  <div
                    key={item.id}
                    className='border-r-2 border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)] flex flex-col'
                  >
                    {/* Cover */}
                    <div className='relative aspect-[3/4] border-b border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-surface-elevated)]'>
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex flex-col justify-end p-3'>
                          <p className='font-editorial-serif text-sm text-[var(--text-main)] line-clamp-3'>
                            {book.title}
                          </p>
                          <p className='font-editorial-mono text-[8px] uppercase tracking-widest text-[var(--text-faint)] mt-1'>
                            {book.author}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className='p-3 flex-1 flex flex-col justify-between'>
                      <div>
                        <Link
                          href={'/books/' + book.id}
                          className='font-editorial-serif text-sm text-[var(--text-main)] line-clamp-2 hover:text-[var(--bg-accent-blue)] transition-colors block'
                        >
                          {book.title}
                        </Link>
                        <p className='font-editorial-mono text-[9px] text-[var(--text-faint)] mt-0.5 truncate'>
                          {book.author}
                        </p>
                        <div className='flex items-baseline gap-1.5 mt-2'>
                          <span className='font-editorial-serif text-base font-bold text-[var(--text-main)]'>
                            {rupee}{discountedPrice}
                          </span>
                          {book.discount > 0 && (
                            <span className='font-editorial-mono text-[9px] text-[var(--text-faint)] line-through'>
                              {rupee}{book.price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='flex gap-1.5 mt-3 border-t border-[var(--border-subtle)] pt-3'>
                        <button
                          onClick={() => {
                            addToCart(book, 1);
                            removeFromWishlist(book.id);
                          }}
                          className='flex-1 neo-btn-primary py-2 text-[9px] font-bold uppercase tracking-wider text-center'
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(book.id)}
                          title='Remove'
                          className='w-8 h-8 flex items-center justify-center border border-[var(--border-subtle)] text-[var(--text-faint)] hover:border-[var(--bg-accent-pink)] hover:text-[var(--bg-accent-pink)] transition-colors'
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
