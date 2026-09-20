// BOOKLY Order & Payment types

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  quantity: number;
  price: number;
  book?: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    coverImage?: string;
    category?: { id: string; name: string; slug: string };
  };
}

export interface Payment {
  id: string;
  orderId: string;
  paymentProvider: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment?: Payment;
}

// ── DTOs ─────────────────────────────────────────────────────────────────────

export interface CheckoutDto {
  shippingAddress: string;
}

export interface CreatePaymentOrderDto {
  orderId: string;
}

export interface CreatePaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  orderNumber: string;
  booklyOrderId: string;
}

export interface VerifyPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  booklyOrderId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  orderId: string;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}
