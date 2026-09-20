import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@CurrentUser() user: any) {
    return this.wishlistService.getWishlist(user.id);
  }

  @Post(':bookId/toggle')
  @HttpCode(HttpStatus.OK)
  async toggleWishlistItem(
    @CurrentUser() user: any,
    @Param('bookId') bookId: string,
  ) {
    return this.wishlistService.toggleWishlistItem(user.id, bookId);
  }

  @Delete(':bookId')
  async removeWishlistItem(
    @CurrentUser() user: any,
    @Param('bookId') bookId: string,
  ) {
    return this.wishlistService.removeWishlistItem(user.id, bookId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearWishlist(@CurrentUser() user: any) {
    return this.wishlistService.clearWishlist(user.id);
  }
}
