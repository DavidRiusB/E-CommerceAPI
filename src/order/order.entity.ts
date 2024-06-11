import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/common/enums';
import { OrderDetail } from 'src/orderdetail/orderdetail.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'orders' })
export class Order {
  @ApiProperty({
    description: 'The unique identifier of the order',
    example: 'a12ac10b-38fc-4325-c534-0e02b2b3d652',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ApiProperty({
    description: 'The total price of the order',
    example: '1.049,98',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    description: 'The total price of the shipping',
    example: '49.99',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 49.99 })
  shipping: number;

  @ApiProperty({
    description: 'A general discount applied to the order',
    example: '0',
    nullable: true,
  })
  @Column({ name: 'discount', nullable: true })
  generalDiscount?: number;

  @ApiProperty({
    description: 'The date when the order was placed',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Column()
  date: Date;

  @ApiProperty({
    description: 'The user who placed the order',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ApiProperty({
    description: 'The details of the order',
    type: () => [OrderDetail],
  })
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  @JoinColumn({ name: 'order_details' })
  details: OrderDetail[];

  @ApiProperty({
    description: 'The status of the order',
    example: OrderStatus.Pending,
  })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;
}
