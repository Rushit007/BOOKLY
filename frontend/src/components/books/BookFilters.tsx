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
    <div className='neo-card-flat' style={{ borderRadius: 0 }}>
      {/* Panel Header */}
      <div className='flex items-center justify-between px-4 py-3 border-b-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)]'>
        <span className='font-editorial-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-main)]'>
          REFINE
        </span>
        <button
          onClick={onResetFilters}
          className='font-editorial-mono text-[9px] font-bold uppercase tracking-wider text-[var(--text-faint)] hover:text-[var(--bg-accent-pink)] transition-colors'
        >
          RESET
        </button>
      </div>

      {/* Categories */}
      <div className='border-b-2 border-[var(--border-subtle)]'>
        <div className='px-4 py-2 border-b border-[var(--border-subtle)]'>
          <span className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)]'>
            Genre
          </span>
        </div>
        <div className='divide-y divide-[var(--border-subtle)]'>
          <button
            onClick={() => onSelectCategory('')}
            className={
              'w-full text-left px-4 py-2.5 font-editorial-mono text-[10px] font-bold transition flex items-center justify-between ' +
              (selectedCategory === ''
                ? 'bg-[var(--text-main)] text-[var(--bg-page)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]')
            }
          >
            <span>All Categories</span>
            {selectedCategory === '' && <span>✓</span>}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={
                'w-full text-left px-4 py-2.5 font-editorial-mono text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-between ' +
                (selectedCategory === cat.slug
                  ? 'bg-[var(--text-main)] text-[var(--bg-page)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]')
              }
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.slug && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className='border-b-2 border-[var(--border-subtle)]'>
        <div className='px-4 py-2 border-b border-[var(--border-subtle)]'>
          <span className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)]'>
            Price Range (₹)
          </span>
        </div>
        <div className='px-4 py-3 grid grid-cols-2 gap-2'>
          <div>
            <label className='font-editorial-mono text-[8px] text-[var(--text-faint)] uppercase tracking-wider block mb-1'>
              Min
            </label>
            <input
              type='number'
              min='0'
              placeholder='0'
              value={minPrice ?? ''}
              onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)}
              className='w-full px-2 py-1.5 text-xs font-editorial-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--border-main)]'
            />
          </div>
          <div>
            <label className='font-editorial-mono text-[8px] text-[var(--text-faint)] uppercase tracking-wider block mb-1'>
              Max
            </label>
            <input
              type='number'
              min='0'
              placeholder='1500'
              value={maxPrice ?? ''}
              onChange={(e) => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : undefined)}
              className='w-full px-2 py-1.5 text-xs font-editorial-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--border-main)]'
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className='border-b-2 border-[var(--border-subtle)]'>
        <div className='px-4 py-2 border-b border-[var(--border-subtle)]'>
          <span className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)]'>
            Min. Rating
          </span>
        </div>
        <div className='divide-y divide-[var(--border-subtle)]'>
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => onRatingChange(minRating === r ? undefined : r)}
              className={
                'w-full text-left px-4 py-2.5 font-editorial-mono text-[10px] font-bold transition flex items-center justify-between ' +
                (minRating === r
                  ? 'bg-[var(--bg-accent-yellow)] text-[var(--text-main)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]')
              }
            >
              <span>★ {r}+ Stars</span>
              {minRating === r && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className='px-4 py-3'>
        <label className='flex items-center gap-3 cursor-pointer group'>
          <div
            onClick={() => onInStockChange(!inStockOnly)}
            className={
              'w-8 h-4 border-2 border-[var(--border-main)] relative transition-colors cursor-pointer ' +
              (inStockOnly ? 'bg-[var(--text-main)]' : 'bg-[var(--bg-surface-elevated)]')
            }
          >
            <span
              className={
                'absolute top-0 w-3 h-3 border border-[var(--border-main)] transition-all ' +
                (inStockOnly
                  ? 'left-3.5 bg-[var(--bg-page)]'
                  : 'left-0 bg-[var(--text-muted)]')
              }
            />
          </div>
          <span className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors'>
            In-Stock Only
          </span>
        </label>
      </div>
    </div>
  );
}
