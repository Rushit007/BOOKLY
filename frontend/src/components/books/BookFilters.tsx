'use client';

import React from 'react';
import { Category } from '../../types/book';

interface BookFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  minRating: number | undefined;
  onRatingChange: (rating: number | undefined) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  onResetFilters: () => void;
}

export function BookFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
  onResetFilters,
}: BookFiltersProps) {
  return (
    <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800'>
        <div className='flex items-center gap-2'>
          <svg className='w-4 h-4 text-indigo-600 dark:text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
          </svg>
          <h3 className='font-bold text-sm text-slate-900 dark:text-white'>Filter Books</h3>
        </div>
        <button onClick={onResetFilters} className='text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline'>
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className='text-xs font-bold uppercase tracking-wider text-slate-400 mb-3'>Categories</h4>
        <div className='space-y-1'>
          <button
            onClick={() => onSelectCategory('')}
            className={
              'w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ' +
              (selectedCategory === ''
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800')
            }
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={
                'w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ' +
                (selectedCategory === cat.slug
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800')
              }
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className='text-xs font-bold uppercase tracking-wider text-slate-400 mb-3'>Price Range</h4>
        <div className='grid grid-cols-2 gap-2'>
          <div>
            <label className='text-[10px] text-slate-400'>Min Price</label>
            <input
              type='number'
              min='0'
              placeholder='0'
              value={minPrice ?? ''}
              onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)}
              className='w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500'
            />
          </div>
          <div>
            <label className='text-[10px] text-slate-400'>Max Price</label>
            <input
              type='number'
              min='0'
              placeholder='1500'
              value={maxPrice ?? ''}
              onChange={(e) => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : undefined)}
              className='w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500'
            />
          </div>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className='text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>Minimum Rating</h4>
        <div className='space-y-1'>
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => onRatingChange(minRating === r ? undefined : r)}
              className={
                'w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition ' +
                (minRating === r
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800')
              }
            >
              <span className='text-amber-400 font-bold'>{r} stars &amp; above</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock Toggle */}
      <div className='pt-2 border-t border-slate-100 dark:border-slate-800'>
        <label className='flex items-center gap-2.5 cursor-pointer'>
          <input
            type='checkbox'
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className='w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 border-slate-300 dark:border-slate-700 dark:bg-slate-800'
          />
          <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>In-Stock Only</span>
        </label>
      </div>
    </div>
  );
}
