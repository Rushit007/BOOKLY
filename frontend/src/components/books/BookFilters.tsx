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
  selectedTier?: string;
  onTierChange?: (tier: string | undefined) => void;
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
  selectedTier,
  onTierChange,
  inStockOnly,
  onInStockChange,
  onResetFilters,
}: BookFiltersProps) {
  return (
    <div className='border border-[var(--border-main)] bg-[var(--bg-surface)] rounded-2xl overflow-hidden shadow-xs'>
      {/* Panel Header */}
      <div className='flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/50'>
        <span className='font-sans text-xs uppercase font-bold tracking-wider text-[var(--text-main)]'>
          Filters
        </span>
        <button
          onClick={onResetFilters}
          className='font-sans text-xs font-semibold text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors cursor-pointer'
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div className='p-4 border-b border-[var(--border-subtle)]'>
        <p className='font-sans text-xs uppercase tracking-wider font-semibold text-[var(--text-faint)] mb-3'>
          Categories
        </p>
        <div className='space-y-1'>
          <button
            onClick={() => onSelectCategory('')}
            className={
              'w-full text-left px-3 py-2 rounded-lg font-sans text-xs font-medium transition flex items-center justify-between cursor-pointer ' +
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
                'w-full text-left px-3 py-2 rounded-lg font-sans text-xs font-medium transition flex items-center justify-between cursor-pointer ' +
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
      <div className='p-4 border-b border-[var(--border-subtle)]'>
        <p className='font-sans text-xs uppercase tracking-wider font-semibold text-[var(--text-faint)] mb-3'>
          Price Range (₹)
        </p>
        <div className='grid grid-cols-2 gap-2'>
          <div>
            <label className='font-sans text-[10px] text-[var(--text-faint)] uppercase font-semibold block mb-1'>
              Min
            </label>
            <input
              type='number'
              min='0'
              placeholder='0'
              value={minPrice ?? ''}
              onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)}
              className='w-full px-3 py-1.5 text-xs font-sans bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--text-main)]'
            />
          </div>
          <div>
            <label className='font-sans text-[10px] text-[var(--text-faint)] uppercase font-semibold block mb-1'>
              Max
            </label>
            <input
              type='number'
              min='0'
              placeholder='1500'
              value={maxPrice ?? ''}
              onChange={(e) => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : undefined)}
              className='w-full px-3 py-1.5 text-xs font-sans bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--text-main)]'
            />
          </div>
        </div>
      </div>

      {/* 4-Tier Reader Consensus Filter */}
      <div className='p-4 border-b border-[var(--border-subtle)]'>
        <div className='flex items-center justify-between mb-2'>
          <p className='font-sans text-xs uppercase tracking-wider font-semibold text-[var(--text-faint)]'>
            Reader Consensus Verdict
          </p>
          {selectedTier && (
            <button
              type='button'
              onClick={() => onTierChange?.(undefined)}
              className='text-[10px] text-amber-500 hover:underline font-mono'
            >
              Clear
            </button>
          )}
        </div>
        <div className='space-y-1.5'>
          {[
            { key: 'perfection', label: '👑 Perfection (Masterpiece)', color: '#10b981' },
            { key: 'go_for_it', label: '⚡ Go For It (Recommended)', color: '#3b82f6' },
            { key: 'timepass', label: '☕ Timepass (Casual)', color: '#f59e0b' },
            { key: 'skip', label: '⛔ Skip (Not Recommended)', color: '#ef4444' },
          ].map((tier) => {
            const isSelected = selectedTier === tier.key;
            return (
              <button
                key={tier.key}
                type='button'
                onClick={() => onTierChange?.(isSelected ? undefined : tier.key)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between cursor-pointer border ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs font-bold'
                    : 'border-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className='flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full shrink-0' style={{ backgroundColor: tier.color }} />
                  <span className='truncate'>{tier.label}</span>
                </div>
                {isSelected && <span className='text-xs'>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className='p-4 border-b border-[var(--border-subtle)]'>
        <p className='font-sans text-xs uppercase tracking-wider font-semibold text-[var(--text-faint)] mb-3'>
          Minimum Star Rating
        </p>
        <div className='space-y-1'>
          {[4.5, 4.0, 3.5].map((r) => (
            <button
              key={r}
              onClick={() => onRatingChange(minRating === r ? undefined : r)}
              className={
                'w-full text-left px-3 py-2 rounded-lg font-sans text-xs font-medium transition flex items-center justify-between cursor-pointer ' +
                (minRating === r
                  ? 'bg-[var(--text-main)] text-[var(--bg-page)]'
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
      <div className='p-4'>
        <label className='flex items-center justify-between cursor-pointer group'>
          <span className='font-sans text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors'>
            In Stock Only
          </span>
          <input
            type='checkbox'
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className='w-4 h-4 rounded text-neutral-900 border-[var(--border-main)] focus:ring-0 cursor-pointer'
          />
        </label>
      </div>
    </div>
  );
}
