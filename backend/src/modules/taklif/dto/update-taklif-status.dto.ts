import { IsEnum } from 'class-validator';
import { TaklifStatus } from '../taklif-status.enum';

export class UpdateTaklifStatusDto {
  @IsEnum(TaklifStatus)
  status: TaklifStatus;
}
