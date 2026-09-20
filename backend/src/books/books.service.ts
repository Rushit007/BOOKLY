import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookQueryDto } from './dto/book-query.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: BookQueryDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit =
      query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 10;
    const skip = (page - 1) * limit;

    const andConditions: Prisma.BookWhereInput[] = [];

    // Search across title, subtitle, author, isbn, publisher
    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      andConditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { isbn: { contains: search, mode: 'insensitive' } },
          { publisher: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    // Category filter: match categoryId or category slug or category name
    if (query.category && query.category.trim()) {
      const categoryTerm = query.category.trim();
      andConditions.push({
        OR: [
          { categoryId: categoryTerm },
          { category: { slug: { equals: categoryTerm.toLowerCase() } } },
          { category: { name: { equals: categoryTerm, mode: 'insensitive' } } },
        ],
      });
    }

    // Price filters
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceCondition: Prisma.FloatFilter = {};
      if (query.minPrice !== undefined) {
        priceCondition.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        priceCondition.lte = query.maxPrice;
      }
      andConditions.push({ price: priceCondition });
    }

    // Rating filter
    if (query.minRating !== undefined) {
      andConditions.push({ rating: { gte: query.minRating } });
    }

    // inStock filter
    if (query.inStock !== undefined) {
      if (query.inStock) {
        andConditions.push({ stock: { gt: 0 } });
      } else {
        andConditions.push({ stock: { lte: 0 } });
      }
    }

    const where: Prisma.BookWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    // Sorting
    let orderBy: Prisma.BookOrderByWithRelationInput;
    switch (query.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'title':
        orderBy = { title: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [totalItems, data] = await Promise.all([
      this.prisma.book.count({ where }),
      this.prisma.book.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
    ]);

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!book) {
      throw new NotFoundException('Book with ID ' + id + ' not found');
    }

    return book;
  }

  async create(dto: CreateBookDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category with ID ' + dto.categoryId + ' not found');
    }

    const existingIsbn = await this.prisma.book.findUnique({
      where: { isbn: dto.isbn },
    });

    if (existingIsbn) {
      throw new ConflictException('Book with ISBN ' + dto.isbn + ' already exists');
    }

    return this.prisma.book.create({
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        author: dto.author,
        isbn: dto.isbn,
        publisher: dto.publisher,
        description: dto.description,
        price: dto.price,
        discount: dto.discount ?? 0.0,
        stock: dto.stock ?? 0,
        categoryId: dto.categoryId,
        coverImage: dto.coverImage,
        rating: dto.rating ?? 0.0,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, dto: UpdateBookDto) {
    await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category with ID ' + dto.categoryId + ' not found');
      }
    }

    if (dto.isbn) {
      const existingIsbn = await this.prisma.book.findUnique({
        where: { isbn: dto.isbn },
      });

      if (existingIsbn && existingIsbn.id !== id) {
        throw new ConflictException('Book with ISBN ' + dto.isbn + ' already exists');
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
        ...(dto.author !== undefined && { author: dto.author }),
        ...(dto.isbn !== undefined && { isbn: dto.isbn }),
        ...(dto.publisher !== undefined && { publisher: dto.publisher }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.discount !== undefined && { discount: dto.discount }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.rating !== undefined && { rating: dto.rating }),
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.book.delete({
      where: { id },
    });

    return {
      message: 'Book with ID ' + id + ' deleted successfully',
    };
  }
}
