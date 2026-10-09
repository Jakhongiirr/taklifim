import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { trim } from './create-music.dto';

/** Only the fields sent are changed. */
export class UpdateMusicDto {
  /** @example "Yor-yor" */
  @Transform(trim)
  @ValidateIf((_, value) => value !== undefined) // null is rejected
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  /**
   * Send null to clear.
   * @example "Sevara Nazarxon"
   */
  @Transform(trim)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  artist?: string | null;

  /** Replace the audio with another file uploaded via POST /files. */
  @ValidateIf((_, value) => value !== undefined) // null is rejected
  @IsUUID()
  fileId?: string;
}
