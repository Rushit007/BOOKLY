'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'discount' | 'stock' | 'category' | 'bestseller' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  let styleClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  if (variant === 'discount') {
    styleClass = 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900';
  } else if (variant === 'stock') {
    styleClass = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900';
  } else if (variant === 'category') {
    styleClass = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900';
  } else if (variant === 'bestseller') {
    styleClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900 font-bold';
  }

  return (
    <span
      className={
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' +
        styleClass +
        ' ' +
        className
      }
    >
      {children}
    </span>
  );
}
