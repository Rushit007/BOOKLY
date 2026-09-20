import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
