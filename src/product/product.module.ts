import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProducController } from './product.controller';
import { ProductRepository } from './product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CategoryModule } from 'src/category/category.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    CloudinaryModule,
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProducController],
  exports: [ProductService],
})
export class ProductModule {}
