import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/common/enums';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
