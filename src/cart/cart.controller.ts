import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './cart.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('carts')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  async getCartByID(@Param('id') id: number) {
    return await this.cartService.findCartById(id);
  }

  @Put(':id')
  async updateCart(@Param('id') id: number, @Body() cart: CartDto) {
    return await this.cartService.updateCart(id);
  }
}
