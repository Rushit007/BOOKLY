'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Book } from '../types/book';
import { Cart, CartItem } from '../types/cart';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  totalDiscount: number;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (book: Book, quantity?: number) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Recalculate totals for guest mode
  const recalculateGuestTotals = (currentItems: CartItem[]) => {
    const count = currentItems.reduce((sum, it) => sum + it.quantity, 0);
    const sub = currentItems.reduce((sum, it) => {
      const price = it.book ? it.book.price : 0;
      return sum + price * it.quantity;
    }, 0);
    const tot = currentItems.reduce((sum, it) => {
      if (!it.book) return sum;
      const unit =
        it.book.discount > 0
          ? Math.round(it.book.price * (1 - it.book.discount / 100))
          : it.book.price;
      return sum + unit * it.quantity;
    }, 0);
    const disc = Math.max(0, sub - tot);

    setItemCount(count);
    setSubtotal(sub);
    setTotalDiscount(disc);
    setTotalAmount(tot);
  };

  // Sync state from real backend Cart response
  const applyBackendCart = (cart: Cart) => {
    setItems(cart.items || []);
    setSubtotal(cart.subtotal || 0);
    setTotalDiscount(cart.totalDiscount || 0);
    setTotalAmount(cart.totalAmount || 0);
    setItemCount(cart.itemCount || 0);
  };

  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const backendCart = await api.getCart();
        applyBackendCart(backendCart);
        return;
      } catch (err) {
        console.warn('Could not fetch backend cart, falling back to local storage:', err);
      }
    }

    // Guest / Local Mode
    try {
      const saved = localStorage.getItem('bookly_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed);
        recalculateGuestTotals(parsed);
      }
    } catch (e) {
      console.error('Failed to load guest cart:', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart().finally(() => setIsInitialized(true));
  }, [refreshCart]);

  // Persist guest cart
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      try {
        localStorage.setItem('bookly_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save guest cart to localStorage:', e);
      }
    }
  }, [items, isInitialized, isAuthenticated]);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = async (book: Book, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await api.addToCart(book.id, quantity);
        applyBackendCart(updatedCart);
        setIsCartDrawerOpen(true);
        return;
      } catch (err: any) {
        console.error('Failed to add to real cart:', err);
      }
    }

    // Guest Mode fallback
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.bookId === book.id);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: book.stock ? Math.min(newQty, book.stock) : newQty,
        };
      } else {
        const newItem: CartItem = {
          id: 'cart-item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          bookId: book.id,
          quantity: book.stock ? Math.min(quantity, book.stock) : quantity,
          book,
        };
        updated = [...prev, newItem];
      }
      recalculateGuestTotals(updated);
      return updated;
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(bookId);
      return;
    }

    if (isAuthenticated) {
      try {
        const updatedCart = await api.updateCartItem(bookId, quantity);
        applyBackendCart(updatedCart);
        return;
      } catch (err) {
        console.error('Failed to update cart item on server:', err);
      }
    }

    // Guest Mode fallback
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.bookId === bookId) {
          const maxStock = item.book?.stock || 99;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      });
      recalculateGuestTotals(updated);
      return updated;
    });
  };

  const removeFromCart = async (bookId: string) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await api.removeCartItem(bookId);
        applyBackendCart(updatedCart);
        return;
      } catch (err) {
        console.error('Failed to remove cart item on server:', err);
      }
    }

    // Guest Mode fallback
    setItems((prev) => {
      const updated = prev.filter((item) => item.bookId !== bookId);
      recalculateGuestTotals(updated);
      return updated;
    });
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        const updatedCart = await api.clearCart();
        applyBackendCart(updatedCart);
        return;
      } catch (err) {
        console.error('Failed to clear cart on server:', err);
      }
    }

    // Guest Mode fallback
    setItems([]);
    recalculateGuestTotals([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        totalDiscount,
        totalAmount,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
