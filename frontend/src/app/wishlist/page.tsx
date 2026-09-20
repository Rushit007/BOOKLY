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
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex items-baseline justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800/80'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
            My Reading Wishlist
          </h1>
          <p className='text-xs text-slate-400 mt-1'>{wishlistCount} saved titles</p>
        </div>
        <Link href='/#catalog' className='text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline'>
          Explore More Books
        </Link>
      </div>

      {items.length === 0 ? (
        <div className='py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8'>
          <div className='w-16 h-16 bg-rose-50 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4'>
            <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>Your wishlist is empty</h2>
          <p className='text-sm text-slate-500 max-w-sm mx-auto mb-6'>
            Save books you wish to read later by clicking the heart icon on any book card.
          </p>
          <Link
            href='/#catalog'
            className='inline-block px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition'
          >
            Discover Books
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {items.map((item) => {
            const book = item.book;
            const discountedPrice = book.discount > 0
              ? Math.round(book.price * (1 - book.discount / 100))
              : book.price;

            return (
              <div key={item.id} className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-200'>
                <div>
                  <div className='aspect-[3/4] rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3 border border-slate-200 dark:border-slate-700'>
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-xs text-slate-400'>Cover</div>
                    )}
                  </div>
                  <Link href={'/books/' + book.id} className='text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400'>
                    {book.title}
                  </Link>
                  <p className='text-xs text-slate-500 mt-0.5 truncate'>by {book.author}</p>
                  <div className='flex items-baseline gap-2 mt-2'>
                    <span className='text-base font-black text-slate-900 dark:text-white'>{rupee}{discountedPrice}</span>
                    {book.discount > 0 && (
                      <span className='text-xs text-slate-400 line-through'>{rupee}{book.price}</span>
                    )}
                  </div>
                </div>

                <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2 mt-3'>
                  <button
                    onClick={() => {
                      addToCart(book, 1);
                      removeFromWishlist(book.id);
                    }}
                    className='flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs'
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(book.id)}
                    className='p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition'
                    title='Remove from Wishlist'
                  >
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
