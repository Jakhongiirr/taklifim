import { FileDto } from '../../files/dto/file.dto';
import { ThemeDto } from '../../themes/dto/theme.dto';

export class DemoDto {
  id: string;

  /** @example "Classic wedding" */
  title: string;

  /** @example "An elegant invitation with gold accents." */
  text: string;

  /** @example "https://taklifim.uz/k7m2xq9p" */
  demoUrl: string;

  image: FileDto;

  theme: ThemeDto;

  /** Null while active. */
  /** Order on the site: lower comes first. */
  position: number;

  archivedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
