'use client';

import React from 'react';
import { BookSortOption } from '../../types/book';

interface BookSortProps {
  currentSort: BookSortOption;
  onSortChange: (sort: BookSortOption) => void;
  totalItems: number;
}

const SORT_LABELS: Record<BookSortOption, string> = {
  newest: 'NEWEST FIRST',
  rating: 'TOP RATED',
  price_asc: 'PRICE ↑',
  price_desc: 'PRICE ↓',
  title: 'A → Z',
};

export function BookSort({ currentSort, onSortChange, totalItems }: BookSortProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b-2 border-[var(--border-main)]'>
      <p className='font-editorial-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]'>
        <span className='text-[var(--text-main)] text-sm font-editorial-serif font-normal'>{totalItems}</span>
        {' '}TITLES FOUND
      </p>

      <div className='flex items-center gap-0 border-2 border-[var(--border-main)] overflow-hidden'>
        {(Object.entries(SORT_LABELS) as [BookSortOption, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => onSortChange(value)}
            className={
              'px-3 py-1.5 font-editorial-mono text-[9px] font-bold tracking-[0.12em] border-r border-[var(--border-subtle)] last:border-r-0 transition-colors ' +
              (currentSort === value
                ? 'bg-[var(--text-main)] text-[var(--bg-page)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-main)]')
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
