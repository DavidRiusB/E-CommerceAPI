import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { OrderDetailService } from './orderdetail.service';
import { UpdateDetailDto } from './update-detail.dto';
import { CustomParseUUIDPipe } from 'src/common/validation';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('order details')
@Controller('detail')
/* @UseGuards(AuthGuard, RolesGuard) */
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  /**
   * Update an order detail by ID.
   *
   * @param {string} id - The UUID of the order detail to update.
   * @param {UpdateDetailDto} detail - The DTO containing updated order detail information.
   * @returns {Promise<OrderDetail>} The updated order detail entity.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an order detail by ID' })
  @ApiParam({ name: 'id', description: 'ID of the order detail' })
  @ApiResponse({ status: 200, description: 'The updated order detail.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @Roles(Role.Admin, Role.SuperAdmin)
  async updateOrderDetail(
    @Param('id', CustomParseUUIDPipe) id: string,
    @Body() detail: UpdateDetailDto,
  ) {
    console.log('in controller', detail);
    return await this.orderDetailService.update(id, detail);
  }

  /*   @Patch(':id/cancel')
  async cancelOrderDetail(@Param('id') id: string) {
    return await this.orderDetailService.cancel(id);
  } */

  @Get(':id')
  async getDetailById(@Param('id') id: string) {
    return await this.orderDetailService.getById(id);
  }
}
