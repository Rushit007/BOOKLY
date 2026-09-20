'use client';

import React from 'react';
import { Category } from '../../types/book';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryBar({ categories, selectedCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      <div className='flex items-center gap-2 overflow-x-auto pb-2'>
        <button
          onClick={() => onSelectCategory('')}
          className={
            'px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ' +
            (selectedCategory === ''
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700')
          }
        >
          All Genres
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={
              'px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ' +
              (selectedCategory === cat.slug
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700')
            }
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
