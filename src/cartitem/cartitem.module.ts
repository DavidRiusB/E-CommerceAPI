import { Module } from '@nestjs/common';
import { CartItemService } from './cartitem.service';
import { CartItemController } from './cartitem.controller';
import { CartItemRepository } from './cartitem.repository';

@Module({
  providers: [CartItemService, CartItemRepository],
  controllers: [CartItemController],
})
export class CartItemModule {}
