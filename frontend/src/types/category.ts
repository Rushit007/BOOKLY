export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string | null;
  author: string;
  isbn: string;
  publisher?: string | null;
  description: string;
  price: number;
  discount: number;
  stock: number;
  categoryId: string;
  coverImage?: string | null;
  rating: number;
  numReviews: number;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
}

export type BookSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'newest'
  | 'title';

export interface BookQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: BookSortOption;
}

export interface PaginatedBooks {
  data: Book[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
