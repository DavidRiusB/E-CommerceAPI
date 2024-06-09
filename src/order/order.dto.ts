import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { IsDecimalWithPrecision } from 'src/common/validation/validation.IsDecimalWithPrecision';
import { UpdateDetailDto } from 'src/orderdetail/update-detail.dto';

export class OrderDto {
  @ApiProperty({
    description: 'Total amount of the order',
    example: 599.99,
  })
  @IsDecimalWithPrecision(10, 2)
  @IsNotEmpty()
  total: number;

  @ApiProperty({
    description: 'Shipping cost of the order',
    example: 49.99,
  })
  @IsDecimalWithPrecision(10, 2)
  @IsNotEmpty()
  shipping: number;

  @ApiProperty({
    description: 'General discount applied to the order',
    example: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  generalDiscount?: number;
}
