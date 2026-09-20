import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, PaymentStatus, Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BKLY-${dateStr}-${randStr}`;
  }

  async checkout(userId: string, dto: CheckoutDto) {
    // 1. Fetch user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cannot checkout with an empty cart');
    }

    // 2. Perform atomic transaction: validate stock, recalculate prices, create order & order items, decrement stock, clear cart
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      let finalAmount = 0;
      const orderItemsData: Array<{
        bookId: string;
        quantity: number;
        price: number;
      }> = [];

      for (const cartItem of cart.items) {
        // Fetch latest book from database within transaction
        const book = await tx.book.findUnique({
          where: { id: cartItem.bookId },
        });

        if (!book) {
          throw new NotFoundException(`Book with ID "${cartItem.bookId}" no longer exists`);
        }

        if (book.stock < cartItem.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${book.title}". Requested: ${cartItem.quantity}, Available: ${book.stock}`,
          );
        }

        // Server-side price calculation (never trust frontend prices)
        const unitPrice =
          book.discount > 0
            ? Math.round(book.price * (1 - book.discount / 100))
            : book.price;

        const itemSubtotal = book.price * cartItem.quantity;
        const itemFinalTotal = unitPrice * cartItem.quantity;

        totalAmount += itemSubtotal;
        finalAmount += itemFinalTotal;

        orderItemsData.push({
          bookId: book.id,
          quantity: cartItem.quantity,
          price: unitPrice,
        });

        // Decrement book stock safely
        await tx.book.update({
          where: { id: book.id },
          data: {
            stock: {
              decrement: cartItem.quantity,
            },
          },
        });
      }

      const discountAmount = Math.max(0, totalAmount - finalAmount);
      const orderNumber = this.generateOrderNumber();

      // Create Order and OrderItems
      const createdOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          totalAmount,
          discountAmount,
          finalAmount,
          shippingAddress: dto.shippingAddress.trim(),
          orderStatus: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          items: {
            create: orderItemsData.map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              book: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return createdOrder;
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(userId: string, userRole: Role, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            book: {
              include: {
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  async adminGetAllOrders(page = 1, limit = 20, status?: OrderStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { orderStatus: status } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              book: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async adminUpdateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      // If transitioning to CANCELLED from non-cancelled status, restore stock
      if (dto.status === OrderStatus.CANCELLED && order.orderStatus !== OrderStatus.CANCELLED) {
        for (const item of order.items) {
          await tx.book.update({
            where: { id: item.bookId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      // If transitioning from CANCELLED to active status, re-decrement stock if possible
      if (order.orderStatus === OrderStatus.CANCELLED && dto.status !== OrderStatus.CANCELLED) {
        for (const item of order.items) {
          const currentBook = await tx.book.findUnique({ where: { id: item.bookId } });
          if (!currentBook || currentBook.stock < item.quantity) {
            throw new BadRequestException(
              `Cannot reactivate order: insufficient stock for book "${currentBook?.title || item.bookId}"`,
            );
          }
          await tx.book.update({
            where: { id: item.bookId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return tx.order.update({
        where: { id: orderId },
        data: { orderStatus: dto.status },
        include: {
          items: {
            include: {
              book: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });
  }

  async cancelOrder(userId: string, userRole: Role, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found`);
    }

    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to cancel this order');
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.orderStatus === OrderStatus.SHIPPED || order.orderStatus === OrderStatus.DELIVERED) {
      throw new BadRequestException(`Cannot cancel order that has already been ${order.orderStatus.toLowerCase()}`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Restore inventory
      for (const item of order.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: OrderStatus.CANCELLED,
        },
        include: {
          items: {
            include: {
              book: true,
            },
          },
        },
      });
    });
  }

}
