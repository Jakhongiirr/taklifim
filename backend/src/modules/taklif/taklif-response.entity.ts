import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Taklif } from './taklif.entity';

/** A guest's RSVP: attendance, and optionally a wish shown on the invitation. */
@Entity('taklif_responses')
@Index(['taklifId', 'createdAt'])
export class TaklifResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  taklifId: string;

  @ManyToOne(() => Taklif, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taklifId' })
  taklif?: Taklif;

  @Column({ length: 60 })
  name: string;

  /** Whether the guest is coming. */
  @Column()
  attending: boolean;

  /** People coming including the guest (1 when not attending). */
  @Column({ type: 'smallint', default: 1 })
  guests: number;

  /** The wish, shown publicly on the invitation; null without one. */
  @Column({ type: 'varchar', length: 500, nullable: true })
  message: string | null;

  /** Set when the owner likes the wish (liked wishes are shown first). */
  @Column({ type: 'timestamptz', nullable: true })
  likedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
