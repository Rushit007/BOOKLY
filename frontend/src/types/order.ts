// BOOKLY Order & Payment types

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURN_PICKED'
  | 'RETURN_IN_TRANSIT'
  | 'RETURN_RECEIVED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'CARD' | 'COD' | 'UPI' | 'NET_BANKING';

export interface ReturnDetails {
  reason: string;
  comments?: string;
  upiId?: string;
  bankDetails?: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'PICKED_UP' | 'IN_TRANSIT' | 'RECEIVED' | 'REFUNDED';
  refundAmount?: number;
}

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
  paymentMethod?: PaymentMethod | string;
  shippingAddress: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingCity?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  returnDetails?: ReturnDetails;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment?: Payment;
}


// ── DTOs ─────────────────────────────────────────────────────────────────────

export interface CheckoutDto {
  shippingAddress: string;
  paymentMethod?: PaymentMethod | string;
  items?: any[];
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  shippingName?: string;
  shippingPhone?: string;
  shippingCity?: string;
  userId?: string;
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
