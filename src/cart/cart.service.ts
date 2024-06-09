import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async findCartById(id: number) {
    const cart = await this.cartRepository.findCartById(id);
    if (!cart) {
      throw new NotFoundException(`Cart id: ${id} not found`);
    }
    return cart;
  }

  getAllCarts() {
    return 'this.cartRepository.findAllCart()';
  }

  updateCart(id: number) {
    throw new Error('Method not implemented.');
  }
}
