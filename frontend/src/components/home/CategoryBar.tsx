'use client';

import React from 'react';
import { Category } from '../../types/book';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryBar({ categories, selectedCategory, onSelectCategory }: CategoryBarProps) {
  const all = [{ id: '__all', name: 'All Editions', slug: '' }, ...categories.map((c) => ({ ...c, name: c.name }))];

  return (
    <div className='border-y border-[var(--border-main)] bg-[var(--bg-surface)]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-hide'>
          {all.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={
                  'px-4 py-2 font-sans text-xs font-semibold rounded-full whitespace-nowrap transition-all shrink-0 ' +
                  (isActive
                    ? 'bg-[var(--text-main)] text-[var(--bg-page)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]')
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
