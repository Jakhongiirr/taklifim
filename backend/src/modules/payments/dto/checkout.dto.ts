import { IsIn } from 'class-validator';

export const CHECKOUT_LANGS = ['uz', 'uz-Cyrl', 'ru', 'en'] as const;

export class CheckoutDto {
  /** The language of Payme's checkout page and of the page it returns to. */
  @IsIn(CHECKOUT_LANGS)
  lang: (typeof CHECKOUT_LANGS)[number];
}

export class CheckoutResultDto {
  /** Payme's checkout page; absent when nothing was owed. */
  url?: string;

  /** True when the design is free: the invitation is already published. */
  published: boolean;
}
