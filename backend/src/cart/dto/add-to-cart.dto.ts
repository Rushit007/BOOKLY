import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty({ message: 'bookId is required' })
  @IsString({ message: 'bookId must be a string' })
  bookId: string;

  @IsOptional()
  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity?: number = 1;
}
