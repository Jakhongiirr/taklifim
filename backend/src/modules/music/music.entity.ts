import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { File } from '../files/file.entity';

@Entity('music')
export class Music {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  artist: string | null;

  /** The audio file. A file can back at most one track. */
  @Index({ unique: true })
  @Column({ type: 'uuid' })
  fileId: string;

  // RESTRICT: a file can't be deleted while a track uses it.
  @ManyToOne(() => File, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'fileId' })
  file: File;

  /** Set when archived; archived tracks are hidden from regular users. */
  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  archivedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
