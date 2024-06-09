import { Injectable } from '@nestjs/common';
import { Cart } from './cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async findCartById(id: number) {
    return await this.cartRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }
}
