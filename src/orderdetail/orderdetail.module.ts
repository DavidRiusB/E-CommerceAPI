import { Module } from '@nestjs/common';
import { OrderDetailService } from './orderdetail.service';
import { OrderDetailController } from './orderdetail.controller';
import { OrderDetailRepository } from './orderdetail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './orderdetail.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail]), ProductModule],
  providers: [OrderDetailService, OrderDetailRepository],
  controllers: [OrderDetailController],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
