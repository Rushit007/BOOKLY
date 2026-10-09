'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Book, Category, BookSortOption } from '../types/book';
import { api } from '../services/api';
import { LuminaHero } from '../components/home/LuminaHero';
import { FlyingPostersGallery } from '../components/home/FlyingPostersGallery';
import { WorksWheel } from '../components/home/WorksWheel';
import { CategoryBar } from '../components/home/CategoryBar';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { IndianLanguageSection } from '../components/home/IndianLanguageSection';
import { ExplodedBookSection } from '../components/home/ExplodedBookSection';
import { BookGrid } from '../components/books/BookGrid';
import { BookFilters } from '../components/books/BookFilters';
import { BookSort } from '../components/books/BookSort';
import { MOCK_BOOKS } from '../data/mockBooks';

function HomeContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<BookSortOption>('newest');
  const [page, setPage] = useState(1);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getBooks({
        page,
        limit: 8,
        search: search || undefined,
        category: selectedCategory || undefined,
        minPrice,
        maxPrice,
        minRating,
        inStock: inStockOnly || undefined,
        sort,
      });
      setBooks(res.data);
      setTotalItems(res.meta.totalItems);
      setTotalPages(res.meta.totalPages);
    } catch {
      setBooks([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, selectedCategory, minPrice, maxPrice, minRating, inStockOnly, sort]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinRating(undefined);
    setInStockOnly(false);
    setSearch('');
    setSort('newest');
    setPage(1);
  };

  // Books for WorksWheel and FlyingPosters
  const wheelBooks = MOCK_BOOKS.filter(
    b => b.categoryId !== 'cat-7' && b.categoryId !== 'cat-8'
  ).slice(0, 9);

  return (
    <div className='flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]'>
      {/* ── Minimalist Hero ── */}
      <LuminaHero />

      {/* ── 3D Interactive Book Wheel (Scrolling Effect) ── */}
      <WorksWheel books={wheelBooks} />

      {/* ── 3D WebGL Distortion Gallery ── */}
      <FlyingPostersGallery books={wheelBooks} />

      {/* ── 3D Exploded View Unboxing & Anatomy Section ── */}
      <ExplodedBookSection />

      {/* ── Category Bar ── */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setPage(1);
        }}
      />

      {/* ── Featured Editions ── */}
      <FeaturedSection books={books} />

      {/* ── Indian Language Books Section ── */}
      <IndianLanguageSection
        hindiBooks={MOCK_BOOKS.filter(b => b.categoryId === 'cat-7')}
        gujaratiBooks={MOCK_BOOKS.filter(b => b.categoryId === 'cat-8')}
      />

      {/* ── Catalog Section Header ── */}
      <div id='catalog' className='border-y border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <span className='tactile-pixel-badge bg-[var(--bg-surface-elevated)] text-[var(--text-main)] shadow-xs'>
              CATALOG
            </span>
            <div>
              <p className='font-sans text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-faint)]'>
                CURATED PHYSICAL EDITIONS
              </p>
              <h2 className='font-editorial-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)] mt-0.5'>
                Browse All Titles ({totalItems})
              </h2>
            </div>
          </div>
          {search && (
            <div className='flex items-center gap-2 border border-[var(--border-main)] px-3 py-1.5 bg-[var(--bg-surface-elevated)] rounded-full self-start text-xs'>
              <span className='font-sans text-xs text-[var(--text-muted)]'>Query: <strong>{search}</strong></span>
              <button onClick={() => setSearch('')} className='font-bold text-[var(--text-main)] hover:opacity-60 transition-opacity ml-1'>✕</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Catalog Grid ── */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start'>
          <div className='lg:col-span-1 sticky top-24'>
            <BookFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => { setSelectedCategory(cat); setPage(1); }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); setPage(1); }}
              minRating={minRating}
              onRatingChange={(r) => { setMinRating(r); setPage(1); }}
              inStockOnly={inStockOnly}
              onInStockChange={(stk) => { setInStockOnly(stk); setPage(1); }}
              onResetFilters={handleResetFilters}
            />
          </div>

          <div className='lg:col-span-3 space-y-6'>
            <BookSort currentSort={sort} onSortChange={(s) => { setSort(s); setPage(1); }} totalItems={totalItems} />
            <BookGrid books={books} isLoading={isLoading} />

            {totalPages > 1 && (
              <div className='pt-8 flex items-center justify-center border-t border-[var(--border-main)] gap-2'>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className={
                    'px-5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider border border-[var(--border-main)] transition ' +
                    (page <= 1
                      ? 'text-[var(--text-faint)] cursor-not-allowed bg-[var(--bg-surface-elevated)]'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer')
                  }
                >
                  ← Prev
                </button>
                <div className='px-5 py-2.5 font-sans text-xs font-semibold text-[var(--text-muted)]'>
                  {page} of {totalPages}
                </div>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className={
                    'px-5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider border border-[var(--border-main)] transition ' +
                    (page >= totalPages
                      ? 'text-[var(--text-faint)] cursor-not-allowed bg-[var(--bg-surface-elevated)]'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer')
                  }
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-[var(--bg-page)]'>
          <div className='w-8 h-8 border-2 border-[var(--border-main)] border-t-[var(--text-main)] rounded-full animate-spin' />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
