import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class ListOrdersQueryDto {
  /** Omit for all. */
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  /** 1-based. */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
