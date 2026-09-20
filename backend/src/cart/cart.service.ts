import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCartEntity(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  private formatCart(cart: any) {
    const items = (cart?.items || []).map((item: any) => {
      const book = item.book;
      const unitPrice =
        book.discount > 0
          ? Math.round(book.price * (1 - book.discount / 100))
          : book.price;
      const itemSubtotal = book.price * item.quantity;
      const itemTotal = unitPrice * item.quantity;
      const itemDiscount = Math.max(0, itemSubtotal - itemTotal);

      return {
        id: item.id,
        cartId: item.cartId,
        bookId: item.bookId,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        book: {
          id: book.id,
          title: book.title,
          subtitle: book.subtitle,
          author: book.author,
          isbn: book.isbn,
          publisher: book.publisher,
          description: book.description,
          price: book.price,
          discount: book.discount,
          stock: book.stock,
          categoryId: book.categoryId,
          coverImage: book.coverImage,
          rating: book.rating,
          numReviews: book.numReviews,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt,
          category: book.category,
        },
        unitPrice,
        itemSubtotal,
        itemDiscount,
        itemTotal,
      };
    });

    const subtotal = items.reduce((sum: number, it: any) => sum + it.itemSubtotal, 0);
    const totalAmount = items.reduce((sum: number, it: any) => sum + it.itemTotal, 0);
    const totalDiscount = Math.max(0, subtotal - totalAmount);
    const itemCount = items.reduce((sum: number, it: any) => sum + it.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      subtotal,
      totalDiscount,
      totalAmount,
      itemCount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  async getCart(userId: string) {
    const cartEntity = await this.getOrCreateCartEntity(userId);

    const fullCart = await this.prisma.cart.findUnique({
      where: { id: cartEntity.id },
      include: {
        items: {
          include: {
            book: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return this.formatCart(fullCart);
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const quantityToAdd = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;

    // Validate book existence
    const book = await this.prisma.book.findUnique({
      where: { id: dto.bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID "${dto.bookId}" not found`);
    }

    if (book.stock <= 0) {
      throw new BadRequestException(`"${book.title}" is currently out of stock`);
    }

    const cartEntity = await this.getOrCreateCartEntity(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_bookId: {
          cartId: cartEntity.id,
          bookId: book.id,
        },
      },
    });

    const currentQty = existingItem ? existingItem.quantity : 0;
    const targetQty = currentQty + quantityToAdd;

    if (targetQty > book.stock) {
      throw new BadRequestException(
        `Cannot add ${quantityToAdd} more copies. Requested total of ${targetQty} exceeds available stock of ${book.stock}`,
      );
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: targetQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cartEntity.id,
          bookId: book.id,
          quantity: quantityToAdd,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, bookId: string, dto: UpdateCartItemDto) {
    const cartEntity = await this.getOrCreateCartEntity(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_bookId: {
          cartId: cartEntity.id,
          bookId,
        },
      },
      include: { book: true },
    });

    if (!existingItem) {
      throw new NotFoundException(`Item with book ID "${bookId}" not found in cart`);
    }

    if (dto.quantity > existingItem.book.stock) {
      throw new BadRequestException(
        `Requested quantity of ${dto.quantity} exceeds available stock of ${existingItem.book.stock}`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId);
  }

  async removeCartItem(userId: string, bookId: string) {
    const cartEntity = await this.getOrCreateCartEntity(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_bookId: {
          cartId: cartEntity.id,
          bookId,
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException(`Item with book ID "${bookId}" not found in cart`);
    }

    await this.prisma.cartItem.delete({
      where: { id: existingItem.id },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cartEntity = await this.getOrCreateCartEntity(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cartEntity.id },
    });

    return this.getCart(userId);
  }
}
