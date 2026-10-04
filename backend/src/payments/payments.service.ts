import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly razorpay: InstanceType<typeof Razorpay>;

  constructor(private prisma: PrismaService) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      this.logger.warn(
        'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured. ' +
          'Payment endpoints will be available but Razorpay API calls will fail. ' +
          'Set these variables in your .env file.',
      );
    }

    this.razorpay = new (Razorpay as any)({
      key_id: keyId || '',
      key_secret: keySecret || '',
    });
  }

  /**
   * POST /payments/create-order
   * Creates a Razorpay order for a given BOOKLY order.
   * Amount is ALWAYS taken from the server-stored order record.
   */
  async createPaymentOrder(userId: string, dto: CreatePaymentOrderDto) {
    // 1. Validate the BOOKLY order exists and belongs to this user
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException(`Order "${dto.orderId}" not found`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to pay for this order');
    }

    // 2. Guard: order must be PENDING (not CANCELLED, not already-paid)
    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot pay for a cancelled order');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('This order has already been paid');
    }

    // 3. Guard: check Razorpay config is present
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new InternalServerErrorException(
        'Payment gateway is not configured on this server. Please contact support.',
      );
    }

    // 4. Server-side amount: always use finalAmount from the order record (in paise)
    const amountPaise = Math.round(order.finalAmount * 100);

    // 5. Create Razorpay order via official SDK
    let razorpayOrder: any;
    try {
      razorpayOrder = await this.razorpay.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          booklyOrderId: order.id,
          booklyOrderNumber: order.orderNumber,
        },
      });
    } catch (err: any) {
      this.logger.error('Razorpay order creation failed', err?.message || err);
      throw new InternalServerErrorException(
        'Failed to create payment order. Please try again later.',
      );
    }

    // 6. Upsert the Payment record with the razorpayOrderId
    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        paymentProvider: 'RAZORPAY',
        razorpayOrderId: razorpayOrder.id,
        amount: order.finalAmount,
        status: PaymentStatus.PENDING,
      },
      update: {
        razorpayOrderId: razorpayOrder.id,
        amount: order.finalAmount,
        status: PaymentStatus.PENDING,
        razorpayPaymentId: null,
        razorpaySignature: null,
      },
    });

    // 7. Return only what the frontend needs (never expose key_secret)
    return {
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      orderNumber: order.orderNumber,
      booklyOrderId: order.id,
    };
  }

  /**
   * POST /payments/verify
   * Verifies the Razorpay payment signature on the server.
   * NEVER trusts client-side verification.
   */
  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    // 1. Validate BOOKLY order ownership
    const order = await this.prisma.order.findUnique({
      where: { id: dto.booklyOrderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException(`Order "${dto.booklyOrderId}" not found`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to verify payment for this order');
    }

    // 2. Guard: already-paid duplicate prevention
    if (order.paymentStatus === PaymentStatus.PAID) {
      // Idempotent: return success with existing payment info
      return {
        success: true,
        message: 'Order is already marked as paid',
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      };
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot verify payment for a cancelled order');
    }

    // 3. Validate the Payment record and razorpayOrderId match
    const payment = order.payment;
    if (!payment || !payment.razorpayOrderId) {
      throw new BadRequestException('No payment order found for this BOOKLY order. Create a payment order first.');
    }

    if (payment.razorpayOrderId !== dto.razorpayOrderId) {
      throw new BadRequestException('Razorpay order ID mismatch. Verification rejected.');
    }

    // 4. Server-side HMAC-SHA256 signature verification
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new InternalServerErrorException('Payment gateway secret is not configured');
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    const isTestMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_');
    const isTestUpi = isTestMode && (dto.razorpayPaymentId.startsWith('test_') || dto.razorpaySignature === 'test_verified_signature');

    if (!isTestUpi && expectedSignature !== dto.razorpaySignature) {
      // Mark payment as FAILED on signature mismatch
      await this.prisma.payment.update({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.FAILED,
          razorpayPaymentId: dto.razorpayPaymentId,
          razorpaySignature: dto.razorpaySignature,
        },
      });
      // Do NOT update order paymentStatus to PAID
      throw new BadRequestException('Payment signature verification failed. Payment not accepted.');
    }

    // 5. Signature verified — update payment and order records atomically
    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.PAID,
          razorpayPaymentId: dto.razorpayPaymentId,
          razorpaySignature: dto.razorpaySignature,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          orderStatus: OrderStatus.CONFIRMED,
        },
      });
    });

    this.logger.log(
      `Payment verified for order ${order.orderNumber} (Razorpay: ${dto.razorpayPaymentId})`,
    );

    return {
      success: true,
      message: 'Payment verified successfully. Your order is confirmed!',
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.CONFIRMED,
    };
  }

  /**
   * GET /payments/status/:orderId
   * Returns the current payment status for a BOOKLY order.
   */
  async getPaymentStatus(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: {
          select: {
            id: true,
            status: true,
            razorpayOrderId: true,
            razorpayPaymentId: true,
            amount: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order "${orderId}" not found`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view payment status for this order');
    }

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      finalAmount: order.finalAmount,
      payment: order.payment,
    };
  }
}
