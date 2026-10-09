import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from '../files/file.entity';
import { Taklif } from './taklif.entity';

/** An invitation's photo; `position` keeps their order. */
@Entity('taklif_photos')
@Index(['taklifId', 'position'], { unique: true })
export class TaklifPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  taklifId: string;

  @ManyToOne(() => Taklif, (taklif) => taklif.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taklifId' })
  taklif?: Taklif;

  /** A file can be a photo of at most one invitation. */
  @Index('UQ_taklif_photos_fileId', { unique: true })
  @Column({ type: 'uuid' })
  fileId: string;

  // RESTRICT: a file can't be deleted while an invitation uses it.
  @ManyToOne(() => File, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'fileId' })
  file: File;

  @Column({ type: 'smallint' })
  position: number;
}
