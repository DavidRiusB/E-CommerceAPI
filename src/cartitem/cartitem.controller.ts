import { Controller, Get } from '@nestjs/common';
import { CartItemService } from './cartitem.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart items')
@Controller('cartitem')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}
  @Get()
  getAllCartItem() {
    return this.cartItemService.getAllCartItems();
  }
}
