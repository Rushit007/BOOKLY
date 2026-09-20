import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * POST /payments/create-order
   * Creates a Razorpay payment order for a BOOKLY order.
   * Amount is always taken server-side from the order record.
   */
  @Post('create-order')
  @HttpCode(HttpStatus.CREATED)
  async createPaymentOrder(
    @CurrentUser() user: any,
    @Body() dto: CreatePaymentOrderDto,
  ) {
    return this.paymentsService.createPaymentOrder(user.id, dto);
  }

  /**
   * POST /payments/verify
   * Verifies the Razorpay payment signature on the server.
   * NEVER accepts frontend-side verification.
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(
    @CurrentUser() user: any,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentsService.verifyPayment(user.id, dto);
  }

  /**
   * GET /payments/status/:orderId
   * Returns current payment status for a BOOKLY order.
   */
  @Get('status/:orderId')
  async getPaymentStatus(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.getPaymentStatus(user.id, orderId);
  }
}
