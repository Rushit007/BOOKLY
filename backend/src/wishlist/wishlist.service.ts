import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateWishlistEntity(userId: string) {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
      });
    }

    return wishlist;
  }

  async getWishlist(userId: string) {
    const wishlistEntity = await this.getOrCreateWishlistEntity(userId);

    const fullWishlist = await this.prisma.wishlist.findUnique({
      where: { id: wishlistEntity.id },
      include: {
        items: {
          include: {
            book: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const items = (fullWishlist?.items || []).map((item) => ({
      id: item.id,
      wishlistId: item.wishlistId,
      bookId: item.bookId,
      createdAt: item.createdAt,
      book: {
        id: item.book.id,
        title: item.book.title,
        subtitle: item.book.subtitle,
        author: item.book.author,
        isbn: item.book.isbn,
        publisher: item.book.publisher,
        description: item.book.description,
        price: item.book.price,
        discount: item.book.discount,
        stock: item.book.stock,
        categoryId: item.book.categoryId,
        coverImage: item.book.coverImage,
        rating: item.book.rating,
        numReviews: item.book.numReviews,
        createdAt: item.book.createdAt,
        updatedAt: item.book.updatedAt,
        category: item.book.category,
      },
    }));

    return {
      id: wishlistEntity.id,
      userId: wishlistEntity.userId,
      items,
      itemCount: items.length,
      createdAt: wishlistEntity.createdAt,
      updatedAt: wishlistEntity.updatedAt,
    };
  }

  async toggleWishlistItem(userId: string, bookId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID "${bookId}" not found`);
    }

    const wishlistEntity = await this.getOrCreateWishlistEntity(userId);

    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_bookId: {
          wishlistId: wishlistEntity.id,
          bookId: book.id,
        },
      },
    });

    let inWishlist: boolean;
    let message: string;

    if (existingItem) {
      await this.prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
      inWishlist = false;
      message = `"${book.title}" removed from your wishlist`;
    } else {
      await this.prisma.wishlistItem.create({
        data: {
          wishlistId: wishlistEntity.id,
          bookId: book.id,
        },
      });
      inWishlist = true;
      message = `"${book.title}" added to your wishlist`;
    }

    const updatedWishlist = await this.getWishlist(userId);

    return {
      inWishlist,
      message,
      wishlist: updatedWishlist,
    };
  }

  async removeWishlistItem(userId: string, bookId: string) {
    const wishlistEntity = await this.getOrCreateWishlistEntity(userId);

    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_bookId: {
          wishlistId: wishlistEntity.id,
          bookId,
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException(`Book with ID "${bookId}" not found in your wishlist`);
    }

    await this.prisma.wishlistItem.delete({
      where: { id: existingItem.id },
    });

    const updatedWishlist = await this.getWishlist(userId);

    return {
      message: 'Item removed from wishlist',
      wishlist: updatedWishlist,
    };
  }

  async clearWishlist(userId: string) {
    const wishlistEntity = await this.getOrCreateWishlistEntity(userId);

    await this.prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlistEntity.id },
    });

    const updatedWishlist = await this.getWishlist(userId);

    return {
      message: 'Wishlist cleared successfully',
      wishlist: updatedWishlist,
    };
  }
}
