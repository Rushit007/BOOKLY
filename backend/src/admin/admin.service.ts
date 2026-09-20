import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalBooks,
      lowStockBooksCount,
      totalOrders,
      paidOrdersAggregate,
      pendingOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      recentOrders,
      lowStockBooks,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.book.count(),
      this.prisma.book.count({ where: { stock: { lte: 10 } } }),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { finalAmount: true },
      }),
      this.prisma.order.count({ where: { orderStatus: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { orderStatus: OrderStatus.SHIPPED } }),
      this.prisma.order.count({ where: { orderStatus: OrderStatus.DELIVERED } }),
      this.prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            take: 2,
            include: { book: { select: { title: true, coverImage: true } } },
          },
        },
      }),
      this.prisma.book.findMany({
        where: { stock: { lte: 10 } },
        take: 8,
        orderBy: { stock: 'asc' },
        include: { category: { select: { name: true } } },
      }),
    ]);

    const totalRevenue = paidOrdersAggregate._sum.finalAmount || 0;

    return {
      overview: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalBooks,
        totalUsers,
        lowStockCount: lowStockBooksCount,
      },
      orderStatusCounts: {
        pending: pendingOrdersCount,
        shipped: shippedOrdersCount,
        delivered: deliveredOrdersCount,
      },
      recentOrders,
      lowStockBooks,
    };
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          createdAt: true,
          _count: {
            select: { orders: true, reviews: true },
          },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async updateUserRole(userId: string, newRole: Role) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });
  }
}
