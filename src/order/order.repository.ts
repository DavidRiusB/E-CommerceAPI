import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { OrderDto } from './order.dto';
import { UpdateOrderStatusDto } from './update-order-status.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Retrieves all orders with pagination.
   *
   * @param {Object} pagination - Pagination details.
   * @param {number} pagination.page - Page number.
   * @param {number} pagination.limit - Number of items per page.
   * @returns {Promise<Order[]>} - A promise that resolves to an array of orders.
   */
  async findAll(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.details', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .skip(offset)
      .take(limit)
      .getMany();
  }

  /**
   * Finds an order by its ID.
   *
   * @param {string} id - The ID of the order to find.
   * @returns {Promise<Order | undefined>} - A promise that resolves to the found order or undefined if not found.
   */
  async findOrderById(id: string) {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .leftJoinAndSelect('order.details', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .getOne();
  }

  /**
   * Creates a new order.
   *
   * @param {Object} order - The order data.
   * @param {User} order.user - The user associated with the order.
   * @param {number} order.shippingCost - The shipping cost for the order.
   * @param {number} order.finalTotal - The final total cost of the order.
   * @param {number} order.discount - The discount applied to the order.
   * @returns {Promise<Order>} - A promise that resolves to the created order.
   */
  async create(order) {
    const { user, shippingCost, finalTotal, discount } = order;
    const newOrder = new Order();
    newOrder.user = user;
    newOrder.total = finalTotal;
    newOrder.generalDiscount = discount;
    newOrder.shipping = shippingCost;
    newOrder.date = new Date();
    return await this.orderRepository.create(newOrder);
  }

  async update(id: string, update: OrderDto): Promise<Order> {
    await this.orderRepository.update(id, update);
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'details'],
    });
  }

  /**
   * Updates an existing order.
   *
   * @param {string} id - The ID of the order to update.
   * @param {OrderDto} update - The updated order data.
   * @returns {Promise<Order>} - A promise that resolves to the updated order.
   */
  async updateStatus(id: string, status: UpdateOrderStatusDto) {
    await this.orderRepository.update(id, status);
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'details'],
    });
  }

  /* async softDelete(id: string) {
    const result = await this.orderRepository.softDelete(id);
    return result;
  } */
}
