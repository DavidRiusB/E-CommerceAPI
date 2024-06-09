import { Order } from 'src/order/order.entity';
import { Product } from 'src/product/product.entity';

export class OrderDetailsDto {
  order: Order;

  product: Product;

  quantity?: number;

  discount?: number;
}
