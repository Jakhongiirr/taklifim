import { FileDto } from '../../files/dto/file.dto';

export class MusicDto {
  id: string;

  /** @example "Yor-yor" */
  title: string;

  /** @example "Sevara Nazarxon" */
  artist: string | null;

  file: FileDto;

  /** Null while active. */
  archivedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
