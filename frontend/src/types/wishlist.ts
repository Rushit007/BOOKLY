import { Book } from './book';

export interface WishlistItem {
  id: string;
  wishlistId?: string;
  bookId: string;
  book: Book;
  createdAt?: string;
}

export interface Wishlist {
  id?: string;
  userId?: string;
  items: WishlistItem[];
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistToggleResponse {
  inWishlist: boolean;
  message: string;
  wishlist: Wishlist;
}
