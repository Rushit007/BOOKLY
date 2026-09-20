'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Book, Category, BookSortOption } from '../types/book';
import { api } from '../services/api';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryBar } from '../components/home/CategoryBar';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { BookGrid } from '../components/books/BookGrid';
import { BookFilters } from '../components/books/BookFilters';
import { BookSort } from '../components/books/BookSort';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<BookSortOption>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null && s !== search) {
      setSearch(s);
    }
    const c = searchParams.get('category');
    if (c !== null && c !== selectedCategory) {
      setSelectedCategory(c);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getBooks({
        page,
        limit: 12,
        search,
        category: selectedCategory,
        minPrice,
        maxPrice,
        minRating,
        inStock: inStockOnly ? true : undefined,
        sort,
      });
      setBooks(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalItems(res.meta.totalItems);
      if (featuredBooks.length === 0 && res.data.length > 0) {
        setFeaturedBooks(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, selectedCategory, minPrice, maxPrice, minRating, inStockOnly, sort]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinRating(undefined);
    setInStockOnly(false);
    setSort('newest');
    setPage(1);
  };

  return (
    <main className='min-h-screen'>
      <HeroSection />

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          setPage(1);
        }}
      />

      {featuredBooks.length > 0 && <FeaturedSection books={featuredBooks} />}

      <section id='catalog' className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-baseline justify-between gap-2'>
            <div>
              <span className='text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400'>
                Bookstore Catalog
              </span>
              <h2 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1'>
                Browse All Titles
              </h2>
            </div>
            {search && (
              <div className='inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold'>
                <span>Search: {search}</span>
                <button onClick={() => setSearch('')} className='hover:text-rose-500 font-bold'>x</button>
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start'>
          <div className='lg:col-span-1 sticky top-24'>
            <BookFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
                setPage(1);
              }}
              minRating={minRating}
              onRatingChange={(r) => {
                setMinRating(r);
                setPage(1);
              }}
              inStockOnly={inStockOnly}
              onInStockChange={(stk) => {
                setInStockOnly(stk);
                setPage(1);
              }}
              onResetFilters={handleResetFilters}
            />
          </div>

          <div className='lg:col-span-3 space-y-6'>
            <BookSort
              currentSort={sort}
              onSortChange={(s) => {
                setSort(s);
                setPage(1);
              }}
              totalItems={totalItems}
            />

            <BookGrid books={books} isLoading={isLoading} />

            {totalPages > 1 && (
              <div className='pt-8 flex items-center justify-center gap-2'>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className={
                    'px-4 py-2 rounded-xl text-xs font-bold border transition ' +
                    (page <= 1
                      ? 'border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                      : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200')
                  }
                >
                  Previous
                </button>
                <div className='px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400'>
                  Page <span className='font-bold text-slate-900 dark:text-white'>{page}</span> of {totalPages}
                </div>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className={
                    'px-4 py-2 rounded-xl text-xs font-bold border transition ' +
                    (page >= totalPages
                      ? 'border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                      : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200')
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>Loading BOOKLY...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
