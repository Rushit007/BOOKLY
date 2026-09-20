'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '../../types/book';
import { BookCard } from '../books/BookCard';

interface FeaturedSectionProps {
  books: Book[];
}

export function FeaturedSection({ books }: FeaturedSectionProps) {
  const featured = books.slice(0, 4);

  return (
    <section id='featured' className='py-12 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4'>
          <div>
            <span className='text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'>
              {"Editor's Choice"}
            </span>
            <h2 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1'>
              Featured Bestsellers
            </h2>
          </div>
          <Link
            href='#catalog'
            className='text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1'
          >
            Explore All 10,000+ Books
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {featured.map((book) => (
            <BookCard key={'feat-' + book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
