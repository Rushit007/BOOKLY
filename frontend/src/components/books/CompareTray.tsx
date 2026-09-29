'use client';

import React from 'react';
import Link from 'next/link';
import { useCompare } from '../../context/CompareContext';

export function CompareTray() {
  const { compareBooks, removeFromCompare, clearCompare, isTrayOpen, setIsTrayOpen } = useCompare();

  if (compareBooks.length === 0) {
    return null;
  }

  const rupee = '\u20B9';

  return (
    <div
      id='compare-floating-tray'
      className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 transition-all duration-300'
    >
      <div className='bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-200/80 dark:border-indigo-900/80 p-3 sm:p-4 text-slate-900 dark:text-white'>
        <div className='flex items-center justify-between gap-2 mb-2'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold'>
              {compareBooks.length}
            </div>
            <span className='text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200'>
              Compare Books ({compareBooks.length}/3)
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setIsTrayOpen(!isTrayOpen)}
              className='text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
            >
              {isTrayOpen ? 'Minimize' : 'Expand'}
            </button>
            <button
              onClick={clearCompare}
              className='text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40'
            >
              Clear
            </button>
          </div>
        </div>

        {isTrayOpen && (
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800'>
            {/* Books Thumbnails */}
            <div className='flex items-center gap-2.5 overflow-x-auto py-1 flex-1'>
              {compareBooks.map((book) => {
                const discountedPrice =
                  book.discount > 0
                    ? Math.round(book.price * (1 - book.discount / 100))
                    : book.price;
                return (
                  <div
                    key={'tray-' + book.id}
                    className='relative flex items-center gap-2 pr-6 pl-1.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 shrink-0 max-w-[170px]'
                  >
                    <div className='w-8 h-10 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-[8px] font-bold text-slate-500'>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className='w-full h-full object-cover' />
                      ) : (
                        <span>BOOK</span>
                      )}
                    </div>
                    <div className='overflow-hidden'>
                      <p className='text-xs font-bold truncate text-slate-800 dark:text-slate-100'>
                        {book.title}
                      </p>
                      <p className='text-[10px] text-slate-500 font-semibold'>
                        {rupee}{discountedPrice}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCompare(book.id)}
                      title='Remove book'
                      aria-label='Remove book from compare'
                      className='absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white flex items-center justify-center text-[10px] font-bold transition'
                    >
                      &times;
                    </button>
                  </div>
                );
              })}

              {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
                <div
                  key={'empty-slot-' + i}
                  className='h-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl px-3 flex items-center justify-center text-[11px] text-slate-400 font-medium shrink-0'
                >
                  + Add Book
                </div>
              ))}
            </div>

            {/* Launch Compare Button */}
            <Link
              href='/compare'
              className='shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition text-center'
            >
              <span>Compare Now</span>
              <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
