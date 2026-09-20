import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CheckoutDto {
  @IsNotEmpty({ message: 'Shipping address is required' })
  @IsString({ message: 'Shipping address must be a string' })
  @MinLength(5, { message: 'Shipping address must be at least 5 characters long' })
  shippingAddress: string;
}
