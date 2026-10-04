'use client';

import React from 'react';
import { Category } from '../../types/book';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryBar({ categories, selectedCategory, onSelectCategory }: CategoryBarProps) {
  const all = [{ id: '__all', name: 'ALL GENRES', slug: '' }, ...categories.map((c) => ({ ...c, name: c.name.toUpperCase() }))];

  return (
    <div className='border-y-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-0 overflow-x-auto scrollbar-hide'>
          {all.map((cat, i) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={
                  'px-5 py-3.5 font-editorial-mono text-[10px] font-bold tracking-[0.18em] whitespace-nowrap transition-all border-r-2 border-[var(--border-main)] shrink-0 ' +
                  (isActive
                    ? 'bg-[var(--text-main)] text-[var(--bg-page)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]') +
                  (i === 0 ? ' border-l-0' : '')
                }
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
