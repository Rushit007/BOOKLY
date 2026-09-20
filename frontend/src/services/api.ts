import { Book, BookQueryParams, Category, PaginatedBooks } from '../types/book';
import { AuthResponse, LoginDto, RegisterDto } from '../types/user';
import { Cart } from '../types/cart';
import { Wishlist, WishlistToggleResponse } from '../types/wishlist';
import { Order, CheckoutDto, CreatePaymentOrderResponse, VerifyPaymentDto, VerifyPaymentResponse } from '../types/order';
import { MOCK_BOOKS, MOCK_CATEGORIES } from '../data/mockBooks';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('bookly_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('bookly_token', token);
      } else {
        localStorage.removeItem('bookly_token');
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('bookly_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(', ');
        }
      } catch {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    this.setToken(res.accessToken);
    return res;
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    this.setToken(res.accessToken);
    return res;
  }

  logout() {
    this.setToken(null);
  }

  async getCategories(): Promise<Category[]> {
    try {
      const data = await this.request<Category[]>('/categories');
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return MOCK_CATEGORIES;
    } catch {
      return MOCK_CATEGORIES;
    }
  }

  async getCategory(id: string): Promise<Category> {
    try {
      return await this.request<Category>(`/categories/${id}`);
    } catch {
      const found = MOCK_CATEGORIES.find((c) => c.id === id || c.slug === id);
      if (found) return found;
      throw new Error('Category not found');
    }
  }

  async getBooks(params: BookQueryParams = {}): Promise<PaginatedBooks> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.search) queryParams.set('search', params.search);
      if (params.category) queryParams.set('category', params.category);
      if (params.minPrice !== undefined) queryParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.set('maxPrice', params.maxPrice.toString());
      if (params.minRating !== undefined) queryParams.set('minRating', params.minRating.toString());
      if (params.inStock !== undefined) queryParams.set('inStock', params.inStock.toString());
      if (params.sort) queryParams.set('sort', params.sort);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/books?${queryString}` : '/books';

      const res = await this.request<PaginatedBooks>(endpoint);
      if (res && res.data && res.data.length > 0) {
        return res;
      }
      return this.filterMockBooks(params);
    } catch {
      return this.filterMockBooks(params);
    }
  }

  async getBookById(id: string): Promise<Book> {
    try {
      return await this.request<Book>(`/books/${id}`);
    } catch {
      const found = MOCK_BOOKS.find((b) => b.id === id || b.isbn === id);
      if (found) return found;
      throw new Error('Book not found');
    }
  }

  // ==========================================
  // REAL BACKEND CART API INTEGRATION
  // ==========================================

  async getCart(): Promise<Cart> {
    return this.request<Cart>('/cart');
  }

  async addToCart(bookId: string, quantity: number = 1): Promise<Cart> {
    return this.request<Cart>(`/cart/items`, {
      method: 'POST',
      body: JSON.stringify({ bookId, quantity }),
    });
  }

  async updateCartItem(bookId: string, quantity: number): Promise<Cart> {
    return this.request<Cart>(`/cart/items/${bookId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(bookId: string): Promise<Cart> {
    return this.request<Cart>(`/cart/items/${bookId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<Cart> {
    return this.request<Cart>('/cart', {
      method: 'DELETE',
    });
  }

  // ==========================================
  // REAL BACKEND WISHLIST API INTEGRATION
  // ==========================================

  async getWishlist(): Promise<Wishlist> {
    return this.request<Wishlist>('/wishlist');
  }

  async toggleWishlistItem(bookId: string): Promise<WishlistToggleResponse> {
    return this.request<WishlistToggleResponse>(`/wishlist/${bookId}/toggle`, {
      method: 'POST',
    });
  }

  async removeWishlistItem(bookId: string): Promise<{ message: string; wishlist: Wishlist }> {
    return this.request<{ message: string; wishlist: Wishlist }>(`/wishlist/${bookId}`, {
      method: 'DELETE',
    });
  }

  async clearWishlist(): Promise<{ message: string; wishlist: Wishlist }> {
    return this.request<{ message: string; wishlist: Wishlist }>('/wishlist', {
      method: 'DELETE',
    });
  }

  // ==========================================
  // REAL BACKEND ORDERS API INTEGRATION
  // ==========================================

  async checkout(dto: CheckoutDto): Promise<Order> {
    return this.request<Order>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async cancelOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async adminGetAllOrders(page?: number, limit?: number, status?: string): Promise<{ data: Order[]; meta: any }> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.set('page', page.toString());
    if (limit) queryParams.set('limit', limit.toString());
    if (status) queryParams.set('status', status);
    const qs = queryParams.toString();
    return this.request<{ data: Order[]; meta: any }>(`/orders/admin/all${qs ? `?${qs}` : ''}`);
  }

  async adminUpdateOrderStatus(id: string, status: string): Promise<Order> {
    return this.request<Order>(`/orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }


  // ==========================================
  // REAL BACKEND PAYMENTS API INTEGRATION
  // ==========================================

  async createPaymentOrder(orderId: string): Promise<CreatePaymentOrderResponse> {
    return this.request<CreatePaymentOrderResponse>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  async verifyPayment(dto: VerifyPaymentDto): Promise<VerifyPaymentResponse> {
    return this.request<VerifyPaymentResponse>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async getPaymentStatus(orderId: string): Promise<{ orderId: string; orderNumber: string; orderStatus: string; paymentStatus: string; finalAmount: number; payment: any }> {
    return this.request(`/payments/status/${orderId}`);
  }


  // ==========================================
  // REAL BACKEND ADMIN API INTEGRATION
  // ==========================================

  async getAdminStats(): Promise<{
    overview: {
      totalRevenue: number;
      totalOrders: number;
      totalBooks: number;
      totalUsers: number;
      lowStockCount: number;
    };
    orderStatusCounts: {
      pending: number;
      shipped: number;
      delivered: number;
    };
    recentOrders: any[];
    lowStockBooks: any[];
  }> {
    return this.request('/admin/stats');
  }

  async getAdminUsers(page: number = 1, limit: number = 20): Promise<{
    data: Array<{
      id: string;
      email: string;
      name: string;
      role: 'CUSTOMER' | 'ADMIN';
      phone?: string;
      createdAt: string;
      _count: { orders: number; reviews: number };
    }>;
    meta: { page: number; limit: number; totalItems: number; totalPages: number };
  }> {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }

  async updateUserRole(userId: string, role: 'CUSTOMER' | 'ADMIN'): Promise<any> {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async createBook(data: {
    title: string;
    subtitle?: string;
    author: string;
    isbn: string;
    publisher?: string;
    description: string;
    price: number;
    discount?: number;
    stock: number;
    categoryId: string;
    coverImage?: string;
  }): Promise<Book> {
    return this.request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBook(id: string, data: Partial<Book>): Promise<Book> {
    return this.request<Book>(`/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBook(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  async createCategory(data: { name: string; slug: string; description?: string }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: { name?: string; slug?: string; description?: string }): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  private filterMockBooks(params: BookQueryParams): PaginatedBooks {
    let filtered = [...MOCK_BOOKS];

    if (params.search && params.search.trim()) {
      const s = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.author.toLowerCase().includes(s) ||
          b.isbn.toLowerCase().includes(s) ||
          (b.publisher && b.publisher.toLowerCase().includes(s))
      );
    }

    if (params.category && params.category.trim()) {
      const cat = params.category.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          b.categoryId === cat ||
          (b.category && (b.category.slug === cat || b.category.id === cat || b.category.name.toLowerCase() === cat))
      );
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter((b) => b.price >= (params.minPrice as number));
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((b) => b.price <= (params.maxPrice as number));
    }
    if (params.minRating !== undefined) {
      filtered = filtered.filter((b) => b.rating >= (params.minRating as number));
    }
    if (params.inStock !== undefined) {
      filtered = filtered.filter((b) => (params.inStock ? b.stock > 0 : b.stock <= 0));
    }

    if (params.sort) {
      switch (params.sort) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'title':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'newest':
        default:
          filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          break;
      }
    }

    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      meta: { page, limit, totalItems, totalPages },
    };
  }
}

export const api = new ApiClient();
