import { ArrayMinSize, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class ReorderDemosDto {
  /** Demo ids in the order they should appear on the site, first to last. */
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('all', { each: true })
  ids: string[];
}
