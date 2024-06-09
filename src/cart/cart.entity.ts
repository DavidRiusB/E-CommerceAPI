import { CartItem } from 'src/cartitem/cartitem.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: ['soft-remove'],
  })
  items: CartItem[];
}
