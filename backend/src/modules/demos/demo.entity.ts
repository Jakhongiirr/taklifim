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
import { Theme } from '../themes/theme.entity';

/** A showcase of a theme: preview image, description and a live demo link. */
@Entity('demos')
export class Demo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ length: 500 })
  demoUrl: string;

  /** The preview image. */
  @Column({ type: 'uuid' })
  imageId: string;

  // RESTRICT: a file can't be deleted while a demo uses it.
  @ManyToOne(() => File, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'imageId' })
  image: File;

  @Index()
  @Column({ type: 'uuid' })
  themeId: string;

  @ManyToOne(() => Theme, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'themeId' })
  theme: Theme;

  /** Set when archived; archived demos are hidden from regular users. */
  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  archivedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
