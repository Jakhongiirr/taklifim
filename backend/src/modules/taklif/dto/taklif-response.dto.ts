import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;

export class CreateTaklifResponseDto {
  /** @example "Aziza opa" */
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @IsBoolean()
  attending: boolean;

  /** People coming including the guest; ignored when not attending. */
  @ValidateIf((o: CreateTaklifResponseDto) => o.attending)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  guests: number = 1;

  /** Optional wish, shown on the invitation. Links are not allowed. */
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  @IsString()
  @MaxLength(500)
  message?: string;

  /** Honeypot: hidden from people, so only bots fill it in. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;

  /** Milliseconds the form was open before sending (spam check). */
  @Type(() => Number)
  @IsInt()
  @Min(0)
  elapsedMs: number;
}

export class UpdateTaklifResponseDto {
  @IsBoolean()
  liked: boolean;
}

/** A response as the owner sees it. */
export class TaklifResponseDto {
  id: string;

  name: string;

  attending: boolean;

  /** People coming including the guest. */
  guests: number;

  /** Null when the guest left no wish. */
  message: string | null;

  liked: boolean;

  createdAt: Date;
}

export class TaklifResponsesDto {
  items: TaklifResponseDto[];

  /** Responses saying they're coming / not coming. */
  attending: number;
  declined: number;

  /** People coming in total (sum of `guests` of those attending). */
  guests: number;
}
