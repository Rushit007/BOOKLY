'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Book } from '../types/book';
import { Wishlist, WishlistItem } from '../types/wishlist';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  items: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (bookId: string) => boolean;
  addToWishlist: (book: Book) => Promise<void>;
  removeFromWishlist: (bookId: string) => Promise<void>;
  toggleWishlist: (book: Book) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const applyBackendWishlist = (wishlist: Wishlist) => {
    setItems(wishlist.items || []);
  };

  const refreshWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const backendWishlist = await api.getWishlist();
        applyBackendWishlist(backendWishlist);
        return;
      } catch (err) {
        console.warn('Could not fetch backend wishlist, falling back to localStorage:', err);
      }
    }

    // Guest / Local Mode
    try {
      const saved = localStorage.getItem('bookly_wishlist');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load guest wishlist from localStorage:', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist().finally(() => setIsInitialized(true));
  }, [refreshWishlist]);

  // Persist guest wishlist
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      try {
        localStorage.setItem('bookly_wishlist', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save guest wishlist to localStorage:', e);
      }
    }
  }, [items, isInitialized, isAuthenticated]);

  const isInWishlist = (bookId: string) => {
    return items.some((item) => item.bookId === bookId);
  };

  const addToWishlist = async (book: Book) => {
    if (isInWishlist(book.id)) return;
    await toggleWishlist(book);
  };

  const removeFromWishlist = async (bookId: string) => {
    if (isAuthenticated) {
      try {
        const res = await api.removeWishlistItem(bookId);
        applyBackendWishlist(res.wishlist);
        return;
      } catch (err) {
        console.error('Failed to remove wishlist item on server:', err);
      }
    }

    // Guest Mode fallback
    setItems((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const toggleWishlist = async (book: Book) => {
    if (isAuthenticated) {
      try {
        const res = await api.toggleWishlistItem(book.id);
        applyBackendWishlist(res.wishlist);
        return;
      } catch (err) {
        console.error('Failed to toggle wishlist on server:', err);
      }
    }

    // Guest Mode fallback
    setItems((prev) => {
      if (prev.some((item) => item.bookId === book.id)) {
        return prev.filter((item) => item.bookId !== book.id);
      }
      const newItem: WishlistItem = {
        id: 'wish-item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        bookId: book.id,
        book,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newItem];
    });
  };

  const clearWishlist = async () => {
    if (isAuthenticated) {
      try {
        const res = await api.clearWishlist();
        applyBackendWishlist(res.wishlist);
        return;
      } catch (err) {
        console.error('Failed to clear wishlist on server:', err);
      }
    }

    // Guest Mode fallback
    setItems([]);
  };

  const wishlistCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
