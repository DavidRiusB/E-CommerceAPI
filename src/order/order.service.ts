import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { AddOrderDto } from './create-order.dto';
import { DataSource } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { OrderDetailService } from 'src/orderdetail/orderdetail.service';
import { ProductService } from 'src/product/product.service';
import { OrderDetail } from 'src/orderdetail/orderdetail.entity';
import { Order } from './order.entity';
import { Product } from 'src/product/product.entity';
import { OrderDto } from './order.dto';
import { UpdateOrderStatusDto } from './update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userService: UserService,
    private readonly orderDetailService: OrderDetailService,
    private readonly productService: ProductService,
    private dataSource: DataSource,
  ) {}

  async getAllOrder(pagination: { page: number; limit: number }) {
    return await this.orderRepository.findAll(pagination);
  }

  /**
   * Finds an order by its ID.
   *
   * @param {string} id - The ID of the order to find.
   * @returns {Promise<Order>} The found order.
   * @throws {NotFoundException} If the order is not found.
   */
  async findOrderById(id: string) {
    const order = await this.orderRepository.findOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order ID: ${id}, not found.`);
    }
    return order;
  }

  /**
   * Adds a new order.
   *
   * @param {AddOrderDto} order - The data to create the new order.
   * @returns {Promise<Order>} The created order.
   * @throws {BadRequestException} If one or more items are out of stock.
   * @throws {InternalServerErrorException} If there is an error creating the order.
   */
  async addOrder(order: AddOrderDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const {
          userId,
          products: productIds,
          shipping,
          generalDiscount,
        } = order;

        // Explicitly assign default values if they are not provided
        const shippingCost = shipping !== undefined ? shipping : 49.99;
        const discount = generalDiscount !== undefined ? generalDiscount : 0;

        // Fetch the user
        const user = await this.userService.getUserById(userId);

        // Fetch products and calculate total price
        const { products } =
          await this.productService.getProductsByIds(productIds);

        // Reduce stock of products within the transaction
        for (const product of products) {
          product.stock -= 1; // Adjust the quantity as needed
          await manager.save(Product, product); // Save the updated product with reduced stock
        }

        if (products.length < productIds.length) {
          throw new BadRequestException('One or more Items Out of stock');
        }

        // Calculate total price
        const totalPrice = products.reduce(
          (sum, products) => sum + parseFloat(products.price.toString()),
          0,
        );

        // Apply the discount
        const discountFactor = 1 - discount / 100;
        const discountedTotal = totalPrice * discountFactor;

        // Add shipping to the total
        const finalTotal = discountedTotal + shippingCost;

        const orderData = {
          user,
          generalDiscount,
          shippingCost,
          discount,
          finalTotal,
        };

        // Create new Order entity
        const newOrder = await this.orderRepository.create(orderData);
        if (!newOrder) {
          throw new InternalServerErrorException('Error creating order');
        }

        // Save the new Order entity
        await manager.save(Order, newOrder);

        // Save OrderDetail entities in bulk
        const orderDetails = await this.orderDetailService.createOrderDetail(
          products,
          newOrder,
        );

        // Commit the transaction by saving changes to the database
        await manager.save(OrderDetail, orderDetails);

        newOrder.details = orderDetails;

        return newOrder;
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Fail to process order',
        error.message,
      );
    }
  }

  /**
   * Updates an existing order.
   *
   * @param {string} id - The ID of the order to update.
   * @param {OrderDto} update - The data to update the order with.
   * @returns {Promise<Order>} The updated order.
   * @throws {NotFoundException} If the order is not found.
   * @throws {InternalServerErrorException} If there is an error updating the order.
   */
  async updateOrder(id: string, update: OrderDto) {
    try {
      await this.findOrderById(id);

      return await this.orderRepository.update(id, update);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Fail to update order');
    }
  }

  /**
   * Updates the status of an existing order.
   *
   * @param {string} id - The ID of the order to update.
   * @param {UpdateOrderStatusDto} status - The new status of the order.
   * @returns {Promise<Order>} The updated order with new status.
   * @throws {NotFoundException} If the order is not found.
   * @throws {InternalServerErrorException} If there is an error updating the order status.
   */
  async updateStatus(id: string, status: UpdateOrderStatusDto) {
    try {
      await this.findOrderById(id);
      return await this.orderRepository.updateStatus(id, status);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Fail to update order Status');
    }
  }
}
