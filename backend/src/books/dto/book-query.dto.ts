import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export type BookSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'newest'
  | 'title';

export const ALLOWED_SORT_OPTIONS: BookSortOption[] = [
  'price_asc',
  'price_desc',
  'rating',
  'newest',
  'title',
];

export class BookQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  @IsOptional()
  limit?: number = 10;

  @IsString({ message: 'Search term must be a string' })
  @IsOptional()
  search?: string;

  @IsString({ message: 'Category filter must be a string' })
  @IsOptional()
  category?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice must be a number' })
  @Min(0, { message: 'minPrice cannot be negative' })
  @IsOptional()
  minPrice?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice must be a number' })
  @Min(0, { message: 'maxPrice cannot be negative' })
  @IsOptional()
  maxPrice?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'minRating must be a number' })
  @Min(0, { message: 'minRating cannot be negative' })
  @Max(5, { message: 'minRating cannot exceed 5' })
  @IsOptional()
  minRating?: number;

  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === '1' || value === 1) return true;
    if (value === 'false' || value === false || value === '0' || value === 0) return false;
    return value;
  })
  @IsBoolean({ message: 'inStock must be a boolean' })
  @IsOptional()
  inStock?: boolean;

  @IsIn(ALLOWED_SORT_OPTIONS, {
    message: 'sort must be one of: ' + ALLOWED_SORT_OPTIONS.join(', '),
  })
  @IsOptional()
  sort?: BookSortOption = 'newest';
}
