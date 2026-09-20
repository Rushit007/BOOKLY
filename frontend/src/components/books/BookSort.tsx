'use client';

import React from 'react';
import { BookSortOption } from '../../types/book';

interface BookSortProps {
  currentSort: BookSortOption;
  onSortChange: (sort: BookSortOption) => void;
  totalItems: number;
}

export function BookSort({ currentSort, onSortChange, totalItems }: BookSortProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800'>
      <p className='text-sm text-slate-500 dark:text-slate-400 font-medium'>
        Showing <span className='font-bold text-slate-900 dark:text-white'>{totalItems}</span> books
      </p>

      <div className='flex items-center gap-2'>
        <label className='text-xs font-semibold text-slate-500 whitespace-nowrap'>Sort By:</label>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as BookSortOption)}
          className='px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer'
        >
          <option value='newest'>Newest Arrivals</option>
          <option value='rating'>Highest Customer Rating</option>
          <option value='price_asc'>Price: Low to High</option>
          <option value='price_desc'>Price: High to Low</option>
          <option value='title'>Alphabetical Title (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
