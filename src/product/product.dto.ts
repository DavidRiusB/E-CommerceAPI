import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { IsDecimalWithPrecision } from 'src/common/validation/validation.IsDecimalWithPrecision';

export class ProductDto {
  @ApiProperty({
    description: 'Name of the product',
    maxLength: 50,
    example: 'Smartphone',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Product name must be less than 50 characters' })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Latest model with advanced features',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'UUID of the category the product belongs to',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Price of the product',
    type: 'number',
    format: 'decimal',
    example: 199.99,
  })
  @IsNumber()
  @IsDecimalWithPrecision(10, 2)
  price: number;

  @ApiProperty({
    description: 'Stock quantity of the product, must be a positive integer',
    example: 150,
  })
  @IsInt()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/product-image.jpg',
    required: false,
  })
  @IsString()
  imgUrl?: string;
}
