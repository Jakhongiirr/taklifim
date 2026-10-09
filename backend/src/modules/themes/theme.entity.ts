import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('themes')
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Stable key the frontend uses to pick the design, e.g. `classic`. */
  @Index({ unique: true })
  @Column({ length: 50 })
  themeId: string;

  /** Whole so'm (UZS). */
  @Column({ type: 'integer' })
  price: number;

  /** Set when archived; archived themes are hidden from regular users. */
  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  archivedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
