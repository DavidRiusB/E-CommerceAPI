import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

import { v4 } from 'uuid';

export class UpdateDetailDto {
  @ApiProperty({
    description: 'The product id associated with the order detail',
    example: '322e7162-37ad-420d-834f-800de67d7ffa',
  })
  @IsUUID()
  newProduct?: string;

  @ApiProperty({
    description: 'The quantity of the product in the order',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'The discount applied to the product',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsOptional()
  discount?: number;
}
