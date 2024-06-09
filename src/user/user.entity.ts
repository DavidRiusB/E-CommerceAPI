import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Credential } from 'src/auth/auth.entity';

import { Cart } from 'src/cart/cart.entity';
import { Role } from 'src/common/enums';
import { Order } from 'src/order/order.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// Import Credential entity once defined

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'c8d4562e-4c92-4a6e-a452-df69e5b0799e',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ApiHideProperty()
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @ApiProperty({
    description: 'Email of the user',
    example: 'bartolomiaw@example.com',
    uniqueItems: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'Bartolomiaw',
    maxLength: 50,
  })
  @Column({ length: 50 })
  name: string;

  @ApiHideProperty()
  @OneToOne(() => Credential, { cascade: ['soft-remove'] })
  @JoinColumn()
  credential: Credential;

  @ApiProperty({
    description: 'Address of the user',
    minLength: 1,
    maxLength: 50,
    example: '123 Miaw St, Catcity',
  })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1-770-212-6011',
  })
  @Column({ nullable: false })
  phone: string;

  @ApiProperty({
    description: "User's country, must be at least 5 chars long",
    example: 'Catland',
    required: false,
  })
  @Column({ nullable: true, length: 20 })
  country?: string | null;

  @ApiProperty({
    description: "User's city",
    example: 'Catland',
    required: false,
  })
  @Column({ nullable: true, length: 20 })
  city?: string | null;

  @ApiHideProperty()
  @OneToMany(() => Order, (order) => order.user, { cascade: ['soft-remove'] })
  orders?: Order[];

  @ApiHideProperty()
  @OneToOne(() => Cart, (cart) => cart.user)
  cart?: Cart;

  @ApiHideProperty()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
