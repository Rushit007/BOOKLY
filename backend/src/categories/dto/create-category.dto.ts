import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Category name must be a string' })
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @IsString({ message: 'Category slug must be a string' })
  @IsNotEmpty({ message: 'Category slug is required' })
  slug: string;

  @IsString({ message: 'Category description must be a string' })
  @IsOptional()
  description?: string;
}
