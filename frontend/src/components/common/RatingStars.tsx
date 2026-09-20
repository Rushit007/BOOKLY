'use client';

import React from 'react';

interface RatingStarsProps {
  rating: number;
  numReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function RatingStars({ rating, numReviews, size = 'sm', showCount = true }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const starSizeClass = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  const starPath =
    'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

  return (
    <div className='flex items-center gap-1.5'>
      <div className='flex items-center text-amber-400'>
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= fullStars || (star === fullStars + 1 && hasHalfStar)) {
            return (
              <svg key={star} className={starSizeClass} fill='currentColor' viewBox='0 0 20 20'>
                <path d={starPath} />
              </svg>
            );
          }
          return (
            <svg
              key={star}
              className={starSizeClass + ' text-slate-300 dark:text-slate-700'}
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d={starPath} />
            </svg>
          );
        })}
      </div>
      {showCount && (
        <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
          {rating.toFixed(1)}
          {numReviews !== undefined && (
            <span className='text-slate-400 font-normal ml-1'>
              ({numReviews})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
