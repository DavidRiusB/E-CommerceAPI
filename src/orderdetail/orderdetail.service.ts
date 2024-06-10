import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderDetailRepository } from './orderdetail.repository';

import { OrderDetail } from './orderdetail.entity';
import { UpdateDetailDto } from './update-detail.dto';
import { ProductService } from 'src/product/product.service';
import { DataSource } from 'typeorm';
import { Product } from 'src/product/product.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly productService: ProductService,
    private dataSource: DataSource,
  ) {}

  /**
   * Creates order details for the given products and associates them with the new order.
   *
   * @param {Product[]} products - The list of products to create order details for.
   * @param {Order} newOrder - The new order to associate the details with.
   * @returns {Promise<OrderDetail[]>} The created order details.
   */
  async createOrderDetail(products, newOrder): Promise<OrderDetail[]> {
    const orderDetails = products.map((product) => {
      const orderDetail = new OrderDetail();
      orderDetail.product = product;
      orderDetail.order = newOrder;
      orderDetail.price = product.price;
      orderDetail.quantity = 1;
      return orderDetail;
    });

    const newOrderDetails =
      await this.orderDetailRepository.create(orderDetails);
    return newOrderDetails;
  }

  /**
   * Updates an existing order detail with new data.
   *
   * @param {string} id - The ID of the order detail to update.
   * @param {UpdateDetailDto} detail - The data to update the order detail with.
   * @returns {Promise<OrderDetail>} The updated order detail.
   * @throws {NotFoundException} If the order detail or product is not found.
   * @throws {BadRequestException} If the product is out of stock.
   */
  async update(id: string, detailData: UpdateDetailDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { newProduct, quantity, discount } = detailData;

        const detail = await this.getById(id);

        if (newProduct) {
          const product = await this.productService.getProductById(newProduct);
          if (quantity !== undefined && quantity !== null) {
            // Ensure the quantity is within the available stock
            if (quantity > product.stock) {
              throw new BadRequestException('Insufficient product stock');
            }

            // Update product stock before saving
            product.stock -= quantity;
            await manager.save(Product, product);

            // Update the order detail with the new product and quantity
            detail.product = product;
            detail.quantity = quantity;
          } else {
            // Update the order detail with the new product only
            detail.product = product;
          }
        } else if (quantity) {
          // Update the existing product's stock and order detail quantity if quantity is provided without changing the product
          if (quantity > detail.product.stock) {
            throw new BadRequestException('Insufficient product stock');
          }

          detail.product.stock -= quantity - detail.quantity;
          await manager.save(Product, detail.product);

          detail.quantity = quantity;
        }

        // Apply discount if provided
        if (discount) {
          const discountAmount = (detail.product.price * discount) / 100;
          let finalPrice =
            (detail.product.price - discountAmount) * detail.quantity;
          detail.price = parseFloat(finalPrice.toFixed(2));
        } else {
          // Update price based on new quantity if discount is not provided
          let finalPrice = detail.product.price * detail.quantity;
          detail.price = parseFloat(finalPrice.toFixed(2));
        }

        // Save the updated order detail
        return await manager.save(OrderDetail, detail);
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update order detail ID:${id}`,
      );
    }
  }

  /*  async cancel(id: string) {
    const orderDetail = await this.orderDetailRepository.findOne(id);
    if (!orderDetail) {
      throw new NotFoundException(`Order Detail ${id} not found.`);
    }

    orderDetail.detailsStatus = 'canceled'; // Assuming 'canceled' is a valid status
    // Additional logic for soft delete like setting isActive flag or similar

    return await this.orderDetailRepository.save(orderDetail);
  } */

  /**
   * Finds an order detail by its ID.
   *
   * @param {string} id - The ID of the order detail to find.
   * @returns {Promise<OrderDetail>} The found order detail.
   * @throws {NotFoundException} If the order detail is not found.
   */
  async getById(id: string) {
    try {
      const detail = await this.orderDetailRepository.findById(id);
      if (!detail) {
        throw new NotFoundException(`Detail ID:${id}, not found.`);
      }
      return detail;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failer to retrive order detail ID:${id}`,
      );
    }
  }
}
