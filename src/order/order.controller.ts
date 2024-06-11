import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CustomParseUUIDPipe } from 'src/common/validation';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AddOrderDto } from './create-order.dto';
import { RemovePropertiesInterceptor } from 'src/common/interceptor/remove-properties.interceptor';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { OrderDto } from './order.dto';
import { UpdateOrderStatusDto } from './update-order-status.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
/* @UseGuards(AuthGuard, RolesGuard) */
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Retrieves all orders with pagination.
   * Only accessible by Admin and SuperAdmin roles.
   *
   * @param {number} page - Page number for pagination (default is 1).
   * @param {number} limit - Number of items per page (default is 5).
   * @returns {Promise<{ data: Order[], total: number, page: number, limit: number }>}
   */
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  getAllOrder(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.orderService.getAllOrder({ page, limit });
  }

  /**
   * Retrieves an order by its ID.
   * Only accessible by Admin and SuperAdmin roles.
   *
   * @param {string} id - The ID of the order to retrieve.
   * @returns {Promise<Order>}
   */
  @Get(':id')
  @Roles(Role.Admin, Role.SuperAdmin, Role.User)
  getOrderById(@Param('id', CustomParseUUIDPipe) id: string) {
    return this.orderService.findOrderById(id);
  }

  /**
   * Retrieves an order by its ID.
   * Only accessible by Admin and SuperAdmin roles.
   *
   * @param {string} id - The ID of the order to retrieve.
   * @returns {Promise<Order>}
   */
  @Post()
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseInterceptors(new RemovePropertiesInterceptor(['order']))
  addOrder(@Body() order: AddOrderDto) {
    return this.orderService.addOrder(order);
  }

  /**
   * Creates a new order.
   * Accessible by User, Admin, and SuperAdmin roles.
   * Uses an interceptor to remove the 'order' property from the response.
   *
   * @param {AddOrderDto} order - The data for the new order.
   * @returns {Promise<Order>}
   */
  @Put('status/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  async changeOrderStatus(
    @Param('id', CustomParseUUIDPipe) id: string,

    @Body() status: UpdateOrderStatusDto,
  ) {
    return await this.orderService.updateStatus(id, status);
  }

  /**
   * Updates the status of an existing order.
   * Only accessible by Admin and SuperAdmin roles.
   *
   * @param {string} id - The ID of the order to update.
   * @param {UpdateOrderStatusDto} status - The new status for the order.
   * @returns {Promise<Order>}
   */
  @Put('update/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  async updateOrder(
    @Param('id', CustomParseUUIDPipe) id: string,
    @Body() order: OrderDto,
  ) {
    return await this.orderService.updateOrder(id, order);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  async softDeleteOrder(@Param('id', CustomParseUUIDPipe) id: string) {
    return await this.orderService.softDelete(id);
  }
}
