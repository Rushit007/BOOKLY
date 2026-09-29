'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/book';

interface CompareContextType {
  compareBooks: Book[];
  addToCompare: (book: Book) => { success: boolean; message: string };
  removeFromCompare: (bookId: string) => void;
  isInCompare: (bookId: string) => boolean;
  clearCompare: () => void;
  isTrayOpen: boolean;
  setIsTrayOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = 'bookly_compare_books';
const MAX_COMPARE_BOOKS = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareBooks, setCompareBooks] = useState<Book[]>([]);
  const [isTrayOpen, setIsTrayOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareBooks(parsed.slice(0, MAX_COMPARE_BOOKS));
        }
      }
    } catch (e) {
      console.warn('Failed to load compare list from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareBooks));
    } catch (e) {
      console.warn('Failed to save compare list to storage', e);
    }
  }, [compareBooks, isLoaded]);

  const addToCompare = (book: Book): { success: boolean; message: string } => {
    if (compareBooks.some((b) => b.id === book.id)) {
      return { success: false, message: `"${book.title}" is already in your comparison.` };
    }
    if (compareBooks.length >= MAX_COMPARE_BOOKS) {
      return {
        success: false,
        message: `Comparison limit reached (max ${MAX_COMPARE_BOOKS} books). Remove a book before adding another.`,
      };
    }

    setCompareBooks((prev) => [...prev, book]);
    setIsTrayOpen(true);
    return {
      success: true,
      message: `Added "${book.title}" to comparison (${compareBooks.length + 1}/${MAX_COMPARE_BOOKS}).`,
    };
  };

  const removeFromCompare = (bookId: string) => {
    setCompareBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const isInCompare = (bookId: string) => {
    return compareBooks.some((b) => b.id === bookId);
  };

  const clearCompare = () => {
    setCompareBooks([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareBooks,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        isTrayOpen,
        setIsTrayOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
