import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug: dto.slug.toLowerCase() },
    });

    if (existingSlug) {
      throw new ConflictException(`Category with slug "${dto.slug}" already exists`);
    }

    const existingName = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existingName) {
      throw new ConflictException(`Category with name "${dto.name}" already exists`);
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug.toLowerCase(),
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existingSlug = await this.prisma.category.findUnique({
        where: { slug: dto.slug.toLowerCase() },
      });

      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException(`Category with slug "${dto.slug}" already exists`);
      }
    }

    if (dto.name) {
      const existingName = await this.prisma.category.findUnique({
        where: { name: dto.name },
      });

      if (existingName && existingName.id !== id) {
        throw new ConflictException(`Category with name "${dto.name}" already exists`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug.toLowerCase() }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const associatedBooksCount = await this.prisma.book.count({
      where: { categoryId: id },
    });

    if (associatedBooksCount > 0) {
      throw new ConflictException(
        `Cannot delete category because it contains ${associatedBooksCount} associated book(s). Remove or reassign books first.`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: `Category with ID "${id}" deleted successfully`,
    };
  }
}
