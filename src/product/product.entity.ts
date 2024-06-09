import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CartItem } from 'src/cartitem/cartitem.entity';
import { Category } from 'src/category/category.entity';
import { OrderDetail } from 'src/orderdetail/orderdetail.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

const DEFAULTIMG =
  'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png';

@Entity({ name: 'products' })
@Check(`"stock" >= 0`)
export class Product {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 'c8d4562e-4c92-4a6e-a452-df69e5b0799e',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ApiProperty({
    description: 'Name of the product',
    example: 'Laptop',
    maxLength: 50,
    uniqueItems: true,
  })
  @Column({ length: 50, nullable: false, unique: true })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-performance laptop for gaming and work',
  })
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Amaunt of avalible items',
    example: 100,
  })
  @Column('int', { nullable: false, select: false })
  stock: number;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/laptop.png',
    default: DEFAULTIMG,
  })
  @Column({ default: DEFAULTIMG })
  imgUrl?: string;

  @ApiHideProperty()
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails?: OrderDetail[];

  @ApiHideProperty()
  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItem: CartItem[];

  @ApiProperty({
    description: 'Category the product belongs to',
    type: () => Category,
  })
  @ManyToOne(() => Category, (categorie) => categorie.product)
  category: Category;
}
