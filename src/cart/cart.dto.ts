import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { Product } from 'src/product/product.entity';

export class CartDto {
  @IsArray()
  @ValidateNested()
  @Type(() => Product)
  products: Product;
}
