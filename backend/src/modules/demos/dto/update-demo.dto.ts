import { IsUUID, ValidateIf } from 'class-validator';
import { DemoUrl, MAX_TEXT_LENGTH, Text } from './demo-fields';

const sent = (_: object, value: unknown) => value !== undefined; // null is rejected

/** Only the fields sent are changed. */
export class UpdateDemoDto {
  /** @example "Classic wedding" */
  @ValidateIf(sent)
  @Text(200)
  title?: string;

  /** @example "An elegant invitation with gold accents." */
  @ValidateIf(sent)
  @Text(MAX_TEXT_LENGTH)
  text?: string;

  /** @example "https://taklifim.uz/k7m2xq9p" */
  @ValidateIf(sent)
  @DemoUrl()
  demoUrl?: string;

  /** Replace the image with another one uploaded via POST /files. */
  @ValidateIf(sent)
  @IsUUID()
  imageId?: string;

  /** An active theme's `id`. */
  @ValidateIf(sent)
  @IsUUID()
  themeId?: string;
}
