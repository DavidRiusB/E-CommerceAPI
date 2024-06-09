import { Injectable } from '@nestjs/common';
import { OrderDetail } from './orderdetail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailsDto } from './orderDetailDto';
import { Repository } from 'typeorm';
import { UpdateDetailDto } from './update-detail.dto';

@Injectable()
export class OrderDetailRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  /**
   * Creates new order details.
   *
   * @param {OrderDetailsDto[]} orderDetails - The list of order details to create.
   * @returns {Promise<OrderDetail[]>} The created order details.
   */
  async create(orderDetails: OrderDetailsDto[]): Promise<OrderDetail[]> {
    const orderDetail = await this.orderDetailRepository.create(orderDetails);
    return orderDetail;
  }

  /*  async findById(id: string): Promise<OrderDetail> {
    console.log('Searching for detail with ID:', id);
    const detail = await this.orderDetailRepository.findOne({
      where: { id },
      relations: ['products', 'order'],
    });
    console.log('Retrieved detail from repository:', detail);
    return detail;
  } */

  /**
   * Updates an existing order detail.
   *
   * @param {string} id - The ID of the order detail to update.
   * @param {UpdateDetailDto} detail - The data to update the order detail with.
   * @returns {Promise<OrderDetail>} The updated order detail.
   */
  async update(detailToUpdate: OrderDetail): Promise<OrderDetail> {
    console.log('in repository:', detailToUpdate);
    return await this.orderDetailRepository.save(detailToUpdate);
  }

  async findById(id: string) {
    const detail = await this.orderDetailRepository.findOne({ where: { id } });
    console.log(detail);
    return detail;
  }
}
