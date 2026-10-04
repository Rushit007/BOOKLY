'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Book, Category, BookSortOption } from '../../types/book';
import { api } from '../../services/api';
import { BookGrid } from '../../components/books/BookGrid';
import { BookFilters } from '../../components/books/BookFilters';
import { BookSort } from '../../components/books/BookSort';

function CatalogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (s !== null && s !== search) setSearch(s);
    const c = searchParams.get('category');
    if (c !== null && c !== selectedCategory) setSelectedCategory(c);
  }, [searchParams]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getBooks({
        page, limit: 12, search, category: selectedCategory,
        minPrice, maxPrice, minRating, inStock: inStockOnly ? true : undefined, sort,
      });
      setBooks(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalItems(res.meta.totalItems);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, selectedCategory, minPrice, maxPrice, minRating, inStockOnly, sort]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleResetFilters = () => {
    setSearch(''); setSelectedCategory(''); setMinPrice(undefined);
    setMaxPrice(undefined); setMinRating(undefined); setInStockOnly(false);
    setSort('newest'); setPage(1);
    router.push('/books');
  };

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <div className="border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-editorial-mono text-[9px] uppercase tracking-[0.3em] text-[var(--bg-accent-blue)] font-bold mb-2">
                BOOKLY CATALOG
              </p>
              <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--text-main)] leading-tight">
                Full <span className="italic editorial-highlighter">Collection</span>
              </h1>
              <p className="font-editorial-sans text-sm text-[var(--text-muted)] mt-3 max-w-lg leading-relaxed">
                Browse our complete catalog of curated books across engineering, literature, business, and beyond.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 border-2 border-[var(--border-main)] bg-[var(--bg-accent-yellow)]">
                <span className="font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-main)]">
                  {totalItems} TITLES
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Active Filter Bar */}
      <div className="border-b-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
          {/* Live search */}
          <form
            onSubmit={(e) => { e.preventDefault(); setPage(1); }}
            className="flex items-center border-2 border-[var(--border-main)] bg-[var(--bg-surface)] overflow-hidden flex-1 min-w-[200px] max-w-sm"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search titles, authors..."
              className="flex-1 px-3 py-2 font-editorial-mono text-[11px] bg-transparent text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 border-l-2 border-[var(--border-main)] text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Active filters */}
          {search && (
            <div className="flex items-center gap-2 border-2 border-[var(--border-main)] px-3 py-1.5 bg-[var(--bg-accent-yellow)] animate-in fade-in">
              <span className="font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-main)]">
                SEARCH: {search}
              </span>
              <button onClick={() => { setSearch(''); setPage(1); }} className="font-bold text-[var(--text-main)] hover:text-[var(--bg-accent-pink)] transition-colors text-xs">×</button>
            </div>
          )}
          {selectedCategory && (
            <div className="flex items-center gap-2 border-2 border-[var(--border-main)] px-3 py-1.5 bg-[var(--bg-accent-blue)]">
              <span className="font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-white">
                {selectedCategory.toUpperCase()}
              </span>
              <button onClick={() => { setSelectedCategory(''); setPage(1); }} className="font-bold text-white hover:opacity-70 transition-opacity text-xs">×</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 sticky top-24">
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

          {/* Books Grid */}
          <div className="lg:col-span-3 space-y-6">
            <BookSort
              currentSort={sort}
              onSortChange={(s) => { setSort(s); setPage(1); }}
              totalItems={totalItems}
            />

            <BookGrid books={books} isLoading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center border-t-2 border-[var(--border-main)] gap-0">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className={
                    'px-5 py-2.5 font-editorial-mono text-[10px] font-bold uppercase tracking-wider border-2 border-[var(--border-main)] border-r-0 transition ' +
                    (page <= 1
                      ? 'text-[var(--text-faint)] cursor-not-allowed bg-[var(--bg-surface-elevated)]'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] cursor-pointer')
                  }
                >
                  ← PREV
                </button>
                <div className="px-6 py-2.5 font-editorial-mono text-[10px] font-bold border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                  {page} / {totalPages}
                </div>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className={
                    'px-5 py-2.5 font-editorial-mono text-[10px] font-bold uppercase tracking-wider border-2 border-[var(--border-main)] border-l-0 transition ' +
                    (page >= totalPages
                      ? 'text-[var(--text-faint)] cursor-not-allowed bg-[var(--bg-surface-elevated)]'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] cursor-pointer')
                  }
                >
                  NEXT →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-editorial-serif text-5xl text-[var(--text-faint)] animate-pulse mb-4">···</div>
          <p className="font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Loading Catalog</p>
        </div>
      </div>
    }>
      <CatalogPageContent />
    </Suspense>
  );
}
