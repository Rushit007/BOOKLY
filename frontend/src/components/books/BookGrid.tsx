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
      <div className='border-l-2 border-t-2 border-[var(--border-main)]'>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className='border-r-2 border-b-2 border-[var(--border-main)] animate-pulse bg-[var(--bg-surface)]'
            >
              <div className='w-full aspect-[3/4] bg-[var(--bg-surface-elevated)]' />
              <div className='p-4 space-y-2 border-t-2 border-[var(--border-main)]'>
                <div className='h-3 bg-[var(--bg-surface-elevated)] w-3/4' />
                <div className='h-3 bg-[var(--bg-surface-elevated)] w-1/2' />
                <div className='h-8 bg-[var(--bg-surface-elevated)] mt-3' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className='border-2 border-[var(--border-main)] bg-[var(--bg-surface)] py-16 text-center'>
        <p className='font-editorial-serif text-4xl text-[var(--text-faint)] mb-3'>No Titles Found</p>
        <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]'>
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className='border-l-2 border-t-2 border-[var(--border-main)]'>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {books.map((book) => (
          <div key={book.id} className='border-r-2 border-b-2 border-[var(--border-main)]'>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}
