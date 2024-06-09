import { Injectable } from '@nestjs/common';
import { CartItemRepository } from './cartitem.repository';

@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepository: CartItemRepository) {}

  getAllCartItems() {
    return this.cartItemRepository.findAllCartItem();
  }
}
