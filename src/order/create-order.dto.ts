import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsDecimalWithPrecision } from 'src/common/validation/validation.IsDecimalWithPrecision';

export class AddOrderDto {
  @ApiProperty({
    description: 'UUID of the user placing the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID('4')
  userId: string;

  @ApiProperty({
    description: 'Array of product UUIDs included in the order',
    example: [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  products: string[];

  @ApiProperty({
    description: 'Shipping cost for the order',
    example: 49.99,
    required: false,
  })
  @IsNumber()
  @IsDecimalWithPrecision(10, 2)
  @IsNotEmpty()
  @IsOptional()
  shipping?: number;

  @ApiProperty({
    description: 'General discount for the order',
    example: 10,
    required: false,
  })
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  generalDiscount?: number;
}
