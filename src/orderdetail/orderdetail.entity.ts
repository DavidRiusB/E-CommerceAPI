import { ApiProperty } from '@nestjs/swagger';
import { OrderDetailStatus } from 'src/common/enums/order-detail-status.enum';
import { Order } from 'src/order/order.entity';
import { Product } from 'src/product/product.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'order_details' })
export class OrderDetail {
  @ApiProperty({
    description: 'The unique identifier of the order detail',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ApiProperty({
    type: () => Order,
    description: 'The order associated with the detail',
  })
  @ManyToOne(() => Order, (order) => order.details, {
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  order: Order;

  @ApiProperty({
    type: () => Product,
    description: 'The product associated with the detail',
    nullable: false,
  })
  @ManyToOne(() => Product, (product) => product.orderDetails, {
    nullable: false,
  })
  @JoinColumn({ name: 'product' })
  product: Product;

  @ApiProperty({
    description: 'The quantity of the product in the order',
    example: 1,
    default: 1,
  })
  @Column({ default: 1 })
  quantity: number;

  @ApiProperty({
    description: 'The price of the product at the time of the order',
    example: '999.99',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Any discount applied to the product',
    example: '0',
    nullable: true,
  })
  @Column({ nullable: true })
  discount: number;

  @ApiProperty({
    enum: OrderDetailStatus,
    description: 'The status of the order detail',
    example: OrderDetailStatus.Pending,
  })
  @Column({
    type: 'enum',
    enum: OrderDetailStatus,
    default: OrderDetailStatus.Pending,
  })
  status: OrderDetailStatus;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
