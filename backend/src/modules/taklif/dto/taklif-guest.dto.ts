import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaklifGuestsDto {
  /**
   * One or more names, each as the invitation should address the guest.
   * @example ["Aziza opa va oilasi", "Jasur aka"]
   */
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.map((v: unknown) =>
          typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : v,
        )
      : value,
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(60, { each: true })
  names: string[];
}

/** A named guest as the owner sees it. */
export class TaklifGuestDto {
  id: string;

  /** @example "Aziza opa va oilasi" */
  name: string;

  /**
   * The personal link is /{locale}/taklif/{slug}/{token}.
   * @example "k7m2xq9p"
   */
  token: string;

  /** Their latest reply from the personal link; null before they reply. */
  reply: { attending: boolean; guests: number; createdAt: Date } | null;

  createdAt: Date;
}

/** What a personal link shows to its guest. */
export class PublicTaklifGuestDto {
  /** @example "Aziza opa va oilasi" */
  name: string;
}
