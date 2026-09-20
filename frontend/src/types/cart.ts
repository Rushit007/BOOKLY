import { Book } from './book';

export interface CartItem {
  id: string;
  cartId?: string;
  bookId: string;
  quantity: number;
  book: Book;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  totalAmount: number;
  itemCount: number;
}
