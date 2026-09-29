'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { RatingStars } from '../../components/common/RatingStars';
import { Badge } from '../../components/common/Badge';
import { Book } from '../../types/book';
import { api } from '../../services/api';

export default function ComparePage() {
  const { compareBooks, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [selectedBookToAdd, setSelectedBookToAdd] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const rupee = '\u20B9';

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await api.getBooks({ limit: 50 });
        setAvailableBooks(res.data);
      } catch (err) {
        console.error('Failed to load books for comparison picker', err);
      }
    }
    loadCatalog();
  }, []);

  const handleAddFromDropdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookToAdd) return;
    const book = availableBooks.find((b) => b.id === selectedBookToAdd);
    if (book) {
      const res = addToCompare(book);
      setFeedbackMessage(res.message);
      setSelectedBookToAdd('');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleAddToCartWithFeedback = (book: Book) => {
    addToCart(book, 1);
    setFeedbackMessage(`Added "${book.title}" to cart!`);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  // If no books are in compare
  if (compareBooks.length === 0) {
    return (
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6'>
        <div className='w-20 h-20 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400'>
          <svg className='w-10 h-10' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.75}
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
        </div>
        <div className='max-w-md mx-auto space-y-2'>
          <h1 className='text-3xl font-black text-slate-900 dark:text-white'>Compare Books</h1>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            You have not selected any books to compare yet. Browse our catalog and click &ldquo;Compare&rdquo; on any book to see a side-by-side spec comparison.
          </p>
        </div>
        <div className='pt-2 flex justify-center gap-4'>
          <Link
            href='/#catalog'
            className='px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition'
          >
            Explore Catalog
          </Link>
          <Link
            href='/book-match'
            className='px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition'
          >
            Try BOOK MATCH
          </Link>
        </div>
      </main>
    );
  }

  // Candidates available to add into comparison that aren't already included
  const candidatesToAdd = availableBooks.filter(
    (b) => !compareBooks.some((cb) => cb.id === b.id)
  );

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8'>
      {/* Header and Breadcrumbs */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80'>
        <div>
          <nav className='flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1'>
            <Link href='/' className='hover:text-indigo-600 dark:hover:text-indigo-400'>Home</Link>
            <span>/</span>
            <span className='text-slate-700 dark:text-slate-300'>Compare Books</span>
          </nav>
          <h1 className='text-3xl font-black text-slate-900 dark:text-white'>
            Compare Books
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
            Detailed side-by-side comparison of selected titles (up to 3 books).
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={clearCompare}
            className='px-4 py-2 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition'
          >
            Clear All
          </button>
          <Link
            href='/#catalog'
            className='px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition'
          >
            + Browse More
          </Link>
        </div>
      </div>

      {feedbackMessage && (
        <div className='p-3.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold flex items-center justify-between'>
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className='text-xs font-bold ml-2'>&times;</button>
        </div>
      )}

      {/* Quick Add Bar if less than 3 books */}
      {compareBooks.length < 3 && candidatesToAdd.length > 0 && (
        <form
          onSubmit={handleAddFromDropdown}
          className='p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center gap-3'
        >
          <div className='flex-1 w-full'>
            <label htmlFor='add-book-select' className='text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1'>
              Add another book to compare ({compareBooks.length}/3 slots used):
            </label>
            <select
              id='add-book-select'
              value={selectedBookToAdd}
              onChange={(e) => setSelectedBookToAdd(e.target.value)}
              className='w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              <option value=''>-- Select a book from catalog --</option>
              {candidatesToAdd.map((b) => (
                <option key={'opt-' + b.id} value={b.id}>
                  {b.title} by {b.author} ({rupee}{b.price})
                </option>
              ))}
            </select>
          </div>
          <button
            type='submit'
            disabled={!selectedBookToAdd}
            className='sm:self-end px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition shrink-0'
          >
            Add to Compare
          </button>
        </form>
      )}

      {/* Comparison Grid */}
      <div className='overflow-x-auto pb-4'>
        <div className='min-w-[680px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm'>
          {/* Book Cards Top Header Row */}
          <div className='grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'>
            <div className='p-6 font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center'>
              Features &amp; Specs
            </div>
            {compareBooks.map((book) => {
              const discountedPrice =
                book.discount > 0
                  ? Math.round(book.price * (1 - book.discount / 100))
                  : book.price;
              const isFavorite = isInWishlist(book.id);
              const isOutOfStock = book.stock <= 0;

              return (
                <div key={'col-header-' + book.id} className='p-6 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 relative'>
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCompare(book.id)}
                    aria-label={`Remove ${book.title} from comparison`}
                    title='Remove from comparison'
                    className='absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white flex items-center justify-center text-xs font-bold transition'
                  >
                    &times;
                  </button>

                  <div className='flex flex-col items-center text-center space-y-3 mb-4'>
                    <div className='w-24 h-32 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-md flex items-center justify-center relative'>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className='w-full h-full object-cover' />
                      ) : (
                        <div className='p-2 text-center text-[10px] font-bold text-indigo-400 bg-slate-900 w-full h-full flex flex-col items-center justify-center'>
                          <span>{book.author}</span>
                          <span className='line-clamp-2 mt-1 text-white font-extrabold'>{book.title}</span>
                        </div>
                      )}
                      {book.discount > 0 && (
                        <div className='absolute top-1 left-1'>
                          <Badge variant='discount'>-{book.discount}%</Badge>
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/books/${book.id}`}
                        className='font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2'
                      >
                        {book.title}
                      </Link>
                      <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate'>
                        by {book.author}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Add to Cart & Wishlist */}
                  <div className='space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80'>
                    <button
                      onClick={() => handleAddToCartWithFeedback(book)}
                      disabled={isOutOfStock}
                      className={
                        'w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ' +
                        (isOutOfStock
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs')
                      }
                    >
                      <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                      </svg>
                      {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>

                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => toggleWishlist(book)}
                        className={
                          'flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition ' +
                          (isFavorite
                            ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800')
                        }
                      >
                        <svg className='w-3.5 h-3.5' fill={isFavorite ? 'currentColor' : 'none'} viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                        </svg>
                        <span>{isFavorite ? 'Saved' : 'Wishlist'}</span>
                      </button>

                      <Link
                        href={`/books/${book.id}`}
                        className='py-1.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition'
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty slots placeholders */}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div
                key={'empty-slot-col-' + i}
                className='p-6 flex flex-col items-center justify-center border-l border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-2'
              >
                <div className='w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xl font-bold'>
                  +
                </div>
                <p className='text-xs font-semibold'>Empty Slot</p>
                <p className='text-[10px] text-slate-400'>Select another book above to compare</p>
              </div>
            ))}
          </div>

          {/* Row: Title */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Title
            </div>
            {compareBooks.map((b) => (
              <div key={'title-' + b.id} className='text-xs font-bold text-slate-900 dark:text-white px-2'>
                {b.title}
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-title-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: Author */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center bg-slate-50/40 dark:bg-slate-800/20'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Author
            </div>
            {compareBooks.map((b) => (
              <div key={'author-' + b.id} className='text-xs font-semibold text-slate-800 dark:text-slate-200 px-2'>
                {b.author}
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-author-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: Category */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Category
            </div>
            {compareBooks.map((b) => (
              <div key={'category-' + b.id} className='px-2'>
                <span className='inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'>
                  {b.category?.name || 'General'}
                </span>
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-cat-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: Price & Discount */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center bg-slate-50/40 dark:bg-slate-800/20'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Price
            </div>
            {compareBooks.map((b) => {
              const discountedPrice =
                b.discount > 0
                  ? Math.round(b.price * (1 - b.discount / 100))
                  : b.price;
              return (
                <div key={'price-' + b.id} className='px-2'>
                  <div className='flex items-baseline gap-1.5'>
                    <span className='text-base font-black text-slate-900 dark:text-white'>
                      {rupee}{discountedPrice}
                    </span>
                    {b.discount > 0 && (
                      <span className='text-xs text-slate-400 line-through'>
                        {rupee}{b.price}
                      </span>
                    )}
                  </div>
                  {b.discount > 0 && (
                    <span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400'>
                      Save {b.discount}%
                    </span>
                  )}
                </div>
              );
            })}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-price-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: Rating & Reviews */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Rating
            </div>
            {compareBooks.map((b) => (
              <div key={'rating-' + b.id} className='px-2'>
                <div className='flex items-center gap-1.5'>
                  <span className='font-black text-amber-500 text-sm'>★ {b.rating}</span>
                  <span className='text-[11px] text-slate-400'>({b.numReviews} reviews)</span>
                </div>
                <div className='mt-1'>
                  <RatingStars rating={b.rating} size='sm' />
                </div>
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-rating-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: Stock & Availability */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center bg-slate-50/40 dark:bg-slate-800/20'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Stock Status
            </div>
            {compareBooks.map((b) => (
              <div key={'stock-' + b.id} className='px-2'>
                {b.stock > 0 ? (
                  <span className='inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500' />
                    In Stock ({b.stock} units)
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-1 text-xs font-bold text-rose-500'>
                    <span className='w-2 h-2 rounded-full bg-rose-500' />
                    Out of Stock
                  </span>
                )}
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-stock-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: Publisher */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Publisher
            </div>
            {compareBooks.map((b) => (
              <div key={'pub-' + b.id} className='text-xs font-semibold text-slate-700 dark:text-slate-300 px-2'>
                {b.publisher || 'N/A'}
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-pub-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: ISBN */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center bg-slate-50/40 dark:bg-slate-800/20'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              ISBN
            </div>
            {compareBooks.map((b) => (
              <div key={'isbn-' + b.id} className='text-xs font-mono font-medium text-slate-700 dark:text-slate-300 px-2'>
                {b.isbn}
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-isbn-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: Format */}
          <div className='grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 py-3.5 px-6 items-center'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Format
            </div>
            {compareBooks.map((b) => (
              <div key={'format-' + b.id} className='text-xs font-semibold text-slate-700 dark:text-slate-300 px-2'>
                Paperback / Hardcover
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-format-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>

          {/* Row: Description Summary */}
          <div className='grid grid-cols-4 py-4 px-6 items-start bg-slate-50/40 dark:bg-slate-800/20'>
            <div className='font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
              Description
            </div>
            {compareBooks.map((b) => (
              <div key={'desc-' + b.id} className='text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-2 line-clamp-4'>
                {b.description}
              </div>
            ))}
            {Array.from({ length: 3 - compareBooks.length }).map((_, i) => (
              <div key={'empty-desc-' + i} className='text-xs text-slate-300 dark:text-slate-700 px-2'>-</div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
