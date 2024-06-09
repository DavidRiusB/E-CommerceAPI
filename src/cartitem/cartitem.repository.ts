import { Injectable } from '@nestjs/common';
import { CartItem } from './cartitem.entity';

@Injectable()
export class CartItemRepository {
  findAllCartItem() {
    return 'this.mockcartItems';
  }
}
