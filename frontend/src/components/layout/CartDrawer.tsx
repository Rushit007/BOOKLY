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
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className='absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in'
      />

      {/* Drawer Panel */}
      <div className='fixed inset-y-0 right-0 max-w-full flex pl-10'>
        <div className='w-screen max-w-md bg-[var(--bg-surface)] border-l-2 border-[var(--border-main)] flex flex-col shadow-2xl animate-slide-in-right'>

          {/* Header */}
          <div className='flex items-center justify-between px-5 py-4 border-b-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)]'>
            <div className='flex items-baseline gap-3'>
              <span className='font-editorial-serif text-xl text-[var(--text-main)]'>Cart</span>
              <span className='font-editorial-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-faint)]'>
                {itemCount} ITEM{itemCount !== 1 ? 'S' : ''}
              </span>
            </div>
            <button
              onClick={closeCartDrawer}
              aria-label='Close cart drawer'
              className='w-8 h-8 border-2 border-[var(--border-main)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] transition-colors font-bold'
            >
              ×
            </button>
          </div>

          {/* Items */}
          <div className='flex-1 overflow-y-auto divide-y-2 divide-[var(--border-subtle)]'>
            {items.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center text-center p-8'>
                <p className='font-editorial-serif text-4xl text-[var(--text-faint)] mb-3'>
                  Empty Shelf
                </p>
                <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8'>
                  No titles in your cart
                </p>
                <button
                  onClick={closeCartDrawer}
                  className='neo-btn-accent px-6 py-3 text-[10px] font-bold uppercase tracking-wider inline-block'
                >
                  Explore Books ↗
                </button>
              </div>
            ) : (
              items.map((item) => {
                const dp = item.book.discount
                  ? Math.round(item.book.price * (1 - item.book.discount / 100))
                  : item.book.price;

                return (
                  <div key={item.bookId} className='py-4 px-5 flex gap-4 items-start'>
                    {/* Cover */}
                    <div className='w-12 h-16 border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] overflow-hidden shrink-0'>
                      {item.book.coverImage ? (
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-end p-1'>
                          <span className='font-editorial-mono text-[7px] text-[var(--text-faint)] leading-tight line-clamp-3'>
                            {item.book.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-editorial-serif text-sm text-[var(--text-main)] truncate'>
                        {item.book.title}
                      </h4>
                      <p className='font-editorial-mono text-[9px] uppercase tracking-widest text-[var(--text-faint)] truncate mt-0.5'>
                        {item.book.author}
                      </p>

                      {/* Price */}
                      <div className='flex items-baseline gap-1.5 mt-1.5'>
                        <span className='font-editorial-serif text-base font-bold text-[var(--text-main)]'>
                          {rupee}{dp}
                        </span>
                        {item.book.discount > 0 && (
                          <span className='font-editorial-mono text-[9px] text-[var(--text-faint)] line-through'>
                            {rupee}{item.book.price}
                          </span>
                        )}
                      </div>

                      {/* Qty + Remove */}
                      <div className='flex items-center gap-2 mt-2'>
                        <div className='flex items-center border border-[var(--border-main)]'>
                          <button
                            onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                            className='px-2 py-0.5 font-editorial-mono font-bold text-sm text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] transition-colors border-r border-[var(--border-subtle)]'
                          >
                            −
                          </button>
                          <span className='px-2.5 py-0.5 font-editorial-mono text-[10px] font-bold text-[var(--text-main)] min-w-[1.5rem] text-center'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                            className='px-2 py-0.5 font-editorial-mono font-bold text-sm text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] transition-colors border-l border-[var(--border-subtle)]'
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.bookId)}
                          className='font-editorial-mono text-[9px] uppercase tracking-wider text-[var(--bg-accent-pink)] hover:underline'
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className='text-right shrink-0'>
                      <span className='font-editorial-serif text-base font-bold text-[var(--text-main)]'>
                        {rupee}{dp * item.quantity}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary + CTA */}
          {items.length > 0 && (
            <div className='border-t-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] px-5 py-5'>
              <div className='space-y-2 mb-4'>
                <div className='flex justify-between'>
                  <span className='font-editorial-mono text-[9px] uppercase tracking-wider text-[var(--text-faint)]'>Subtotal</span>
                  <span className='font-editorial-mono text-[10px] font-bold text-[var(--text-main)]'>{rupee}{subtotal}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className='flex justify-between'>
                    <span className='font-editorial-mono text-[9px] uppercase tracking-wider text-[var(--bg-accent-mint)]'>Savings</span>
                    <span className='font-editorial-mono text-[10px] font-bold text-[var(--bg-accent-mint)]'>
                      −{rupee}{Math.round(totalDiscount)}
                    </span>
                  </div>
                )}
                <div className='flex justify-between pt-2 border-t border-[var(--border-subtle)]'>
                  <span className='font-editorial-mono text-[9px] uppercase tracking-widest font-bold text-[var(--text-main)]'>Total</span>
                  <span className='font-editorial-serif text-xl font-bold text-[var(--text-main)]'>
                    {rupee}{Math.round(totalAmount)}
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <Link
                  href='/cart'
                  onClick={closeCartDrawer}
                  className='neo-btn-secondary py-3 text-center text-[9px] font-bold uppercase tracking-widest'
                >
                  View Cart
                </Link>
                <Link
                  href='/cart'
                  onClick={closeCartDrawer}
                  className='neo-btn-accent py-3 text-center text-[9px] font-bold uppercase tracking-widest'
                >
                  Checkout →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
