'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    totalDiscount,
    totalAmount,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const rupee = '\u20B9';

  if (!isCartDrawerOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      <div
        onClick={closeCartDrawer}
        className='absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300'
      />
      <div className='fixed inset-y-0 right-0 max-w-full flex pl-10'>
        <div className='w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800'>
            <div className='flex items-center gap-2'>
              <svg className='w-6 h-6 text-indigo-600 dark:text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
              </svg>
              <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
                Your Cart <span className='text-sm font-normal text-slate-500'>({itemCount} items)</span>
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              aria-label='Close cart drawer'
              className='p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
            >
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className='flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100 dark:divide-slate-800'>
            {items.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center text-center p-6'>
                <div className='w-20 h-20 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-indigo-500 mb-4'>
                  <svg className='w-10 h-10' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                  </svg>
                </div>
                <h3 className='text-base font-semibold text-slate-900 dark:text-white mb-1'>Your cart is empty</h3>
                <p className='text-sm text-slate-500 max-w-xs mb-6'>Discover bestsellers and top-rated books across all genres.</p>
                <button
                  onClick={closeCartDrawer}
                  className='px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm'
                >
                  Explore Books
                </button>
              </div>
            ) : (
              items.map((item) => {
                const dp = item.book.discount
                  ? Math.round(item.book.price * (1 - item.book.discount / 100))
                  : item.book.price;

                return (
                  <div key={item.bookId} className='py-4 flex gap-4 items-center'>
                    <div className='relative w-16 h-22 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700'>
                      {item.book.coverImage ? (
                        <img src={item.book.coverImage} alt={item.book.title} className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-slate-400 text-xs'>Cover</div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-semibold text-slate-900 dark:text-white truncate'>
                        {item.book.title}
                      </h4>
                      <p className='text-xs text-slate-500 truncate mb-1'>{item.book.author}</p>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-sm font-bold text-indigo-600 dark:text-indigo-400'>
                          {rupee}{dp}
                        </span>
                        {item.book.discount > 0 && (
                          <span className='text-xs text-slate-400 line-through'>
                            {rupee}{item.book.price}
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800'>
                          <button
                            onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                            className='px-2.5 py-0.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold'
                          >
                            -
                          </button>
                          <span className='px-3 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                            className='px-2.5 py-0.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold'
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.bookId)}
                          className='text-xs text-rose-500 hover:text-rose-700 p-1'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className='border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900/60'>
              <div className='space-y-2 mb-4 text-sm'>
                <div className='flex justify-between text-slate-500 dark:text-slate-400'>
                  <span>Subtotal</span>
                  <span>{rupee}{subtotal}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className='flex justify-between text-emerald-600 dark:text-emerald-400'>
                    <span>Savings</span>
                    <span>-{rupee}{Math.round(totalDiscount)}</span>
                  </div>
                )}
                <div className='flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800'>
                  <span>Total</span>
                  <span>{rupee}{Math.round(totalAmount)}</span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <Link
                  href='/cart'
                  onClick={closeCartDrawer}
                  className='w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-center text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition'
                >
                  View Full Cart
                </Link>
                <Link
                  href='/cart'
                  onClick={closeCartDrawer}
                  className='w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-center text-sm font-semibold shadow-md shadow-indigo-500/20 transition'
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
