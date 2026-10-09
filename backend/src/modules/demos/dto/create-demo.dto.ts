import { IsUUID } from 'class-validator';
import { DemoUrl, MAX_TEXT_LENGTH, Text } from './demo-fields';

export class CreateDemoDto {
  /** @example "Classic wedding" */
  @Text(200)
  title: string;

  /** @example "An elegant invitation with gold accents." */
  @Text(MAX_TEXT_LENGTH)
  text: string;

  /** @example "https://taklifim.uz/k7m2xq9p" */
  @DemoUrl()
  demoUrl: string;

  /** Id of an image uploaded via POST /files. */
  @IsUUID()
  imageId: string;

  /** An active theme's `id` from GET /themes. */
  @IsUUID()
  themeId: string;
}
