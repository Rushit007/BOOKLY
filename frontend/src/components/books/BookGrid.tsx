'use client';

import React from 'react';
import { Book } from '../../types/book';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
}

export function BookGrid({ books, isLoading }: BookGridProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 animate-pulse space-y-4'>
            <div className='w-full aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-xl' />
            <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4' />
            <div className='h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2' />
            <div className='h-8 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4' />
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className='py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800'>
        <div className='w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4'>
          <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
          </svg>
        </div>
        <h3 className='text-base font-bold text-slate-900 dark:text-white mb-1'>No books found</h3>
        <p className='text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6'>
          We couldn’t find any books matching your selected filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
