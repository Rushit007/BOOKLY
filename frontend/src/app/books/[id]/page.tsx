'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Book } from '../../../types/book';
import { api } from '../../../services/api';
import { RatingStars } from '../../../components/common/RatingStars';
import { Badge } from '../../../components/common/Badge';
import { BookCard } from '../../../components/books/BookCard';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params?.id as string;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    async function loadBook() {
      if (!bookId) return;
      setIsLoading(true);
      try {
        const found = await api.getBookById(bookId);
        setBook(found);
        const catalog = await api.getBooks({ limit: 4 });
        setRelatedBooks(catalog.data.filter((b) => b.id !== bookId).slice(0, 4));
      } catch (err) {
        console.error('Error loading book:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBook();
  }, [bookId]);

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-16 text-center'>
        <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-slate-500 font-semibold'>Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-20 text-center'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>Book Not Found</h2>
        <p className='text-slate-500 mb-6'>The requested book could not be located in our catalog.</p>
        <Link href='/' className='px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold'>
          Return to Catalog
        </Link>
      </div>
    );
  }

  const discountedPrice =
    book.discount > 0
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price;

  const isFavorite = isInWishlist(book.id);
  const isOutOfStock = book.stock <= 0;
  const rupee = '\u20B9';

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-2 text-xs font-semibold text-slate-400'>
        <Link href='/' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>Home</Link>
        <span>/</span>
        <Link href='/#catalog' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition'>Catalog</Link>
        <span>/</span>
        <span className='text-slate-700 dark:text-slate-300 truncate max-w-xs'>{book.title}</span>
      </nav>

      {/* Main Detail Section */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
        {/* Left: Cover */}
        <div className='lg:col-span-5 flex flex-col items-center'>
          <div className='relative w-full max-w-sm aspect-[3/4] rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700'>
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className='w-full h-full object-cover' />
            ) : (
              <div className='w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-indigo-950 to-slate-900 text-white text-center'>
                <span className='text-xs font-bold uppercase tracking-widest text-indigo-300'>{book.author}</span>
                <h2 className='text-xl font-bold mt-3'>{book.title}</h2>
              </div>
            )}
            {book.discount > 0 && (
              <div className='absolute top-4 left-4'>
                <Badge variant='discount'>-{book.discount}% OFF</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right: Metadata */}
        <div className='lg:col-span-7 space-y-6'>
          <div>
            <span className='inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full mb-3'>
              {book.category?.name || 'General Genre'}
            </span>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight'>
              {book.title}
            </h1>
            {book.subtitle && (
              <p className='text-base text-slate-500 dark:text-slate-400 mt-1 italic'>
                {book.subtitle}
              </p>
            )}
            <p className='text-sm text-slate-600 dark:text-slate-300 mt-2'>
              Written by <span className='font-bold text-slate-900 dark:text-white'>{book.author}</span>
            </p>
          </div>

          {/* Ratings & Stock */}
          <div className='flex items-center gap-4 py-3 border-y border-slate-200/80 dark:border-slate-800/80'>
            <RatingStars rating={book.rating} numReviews={book.numReviews} size='md' />
            <span className='text-slate-300 dark:text-slate-700'>|</span>
            <span className={
              'text-xs font-bold ' +
              (book.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500')
            }>
              {book.stock > 0 ? 'In Stock (' + book.stock + ' available)' : 'Out of Stock'}
            </span>
          </div>

          {/* Price Box */}
          <div className='flex items-baseline gap-3'>
            <span className='text-3xl sm:text-4xl font-black text-slate-900 dark:text-white'>
              {rupee}{discountedPrice}
            </span>
            {book.discount > 0 && (
              <>
                <span className='text-lg text-slate-400 line-through font-medium'>
                  {rupee}{book.price}
                </span>
                <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400'>
                  You Save {rupee}{book.price - discountedPrice} ({book.discount}%)
                </span>
              </>
            )}
          </div>

          {/* Synopsis */}
          <div className='space-y-2'>
            <h3 className='text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider'>
              Synopsis &amp; Overview
            </h3>
            <p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
              {book.description}
            </p>
          </div>

          {/* Quantity & Actions */}
          <div className='pt-4 space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800'>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold'
                >
                  -
                </button>
                <span className='px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white'>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(book.stock || 99, quantity + 1))}
                  className='px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold'
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={
                  'flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 ' +
                  (isOutOfStock
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 hover:-translate-y-0.5')
                }
              >
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
                {isOutOfStock ? 'Currently Unavailable' : 'Add To Shopping Cart'}
              </button>

              <button
                onClick={() => toggleWishlist(book)}
                aria-label='Wishlist'
                className={
                  'p-3.5 rounded-2xl border transition ' +
                  (isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800')
                }
              >
                <svg className='w-5 h-5' fill={isFavorite ? 'currentColor' : 'none'} viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                </svg>
              </button>
            </div>

            {addedMessage && (
              <div className='p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-2'>
                <span>&#10003;</span> Successfully added {quantity} copy to your shopping cart!
              </div>
            )}
          </div>

          {/* Specs */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs'>
            <div>
              <span className='text-slate-400 block'>Publisher</span>
              <span className='font-semibold text-slate-800 dark:text-slate-200'>{book.publisher || 'N/A'}</span>
            </div>
            <div>
              <span className='text-slate-400 block'>ISBN-13</span>
              <span className='font-mono font-semibold text-slate-800 dark:text-slate-200'>{book.isbn}</span>
            </div>
            <div>
              <span className='text-slate-400 block'>Format</span>
              <span className='font-semibold text-slate-800 dark:text-slate-200'>Hardcover / Paperback</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className='pt-12 border-t border-slate-200/80 dark:border-slate-800/80'>
          <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-6'>
            You Might Also Enjoy
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
