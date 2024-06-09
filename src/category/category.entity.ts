import { ApiProperty } from '@nestjs/swagger';
import { join } from 'path';
import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'categories' })
export class Category {
  @ApiProperty({
    description: 'The unique identifier of the category',
    example: 'a12ac10b-38fc-4325-c534-0e02b2b3d652',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
  })
  @Column({ length: 50, unique: true, nullable: false })
  name: string;

  @ApiProperty({
    description: 'A description of the category',
    example: 'Best electronic products',
  })
  @Column({ type: 'text', default: `Best  products` })
  description: string;

  @ApiProperty({
    description: 'The products belonging to the category',
    type: () => [Product],
  })
  @OneToMany(() => Product, (product) => product.category)
  @JoinColumn()
  product?: Product[];
}
