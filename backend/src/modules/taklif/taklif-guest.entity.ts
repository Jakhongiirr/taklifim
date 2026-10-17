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

/**
 * A guest the owner invites by name. Their personal link
 * (/taklif/{slug}/{token}) greets them by name and fills it in the RSVP.
 */
@Entity('taklif_guests')
@Index(['taklifId', 'token'], { unique: true })
export class TaklifGuest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  taklifId: string;

  @ManyToOne(() => Taklif, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taklifId' })
  taklif?: Taklif;

  /** As the invitation addresses them, e.g. "Aziza opa va oilasi". */
  @Column({ length: 60 })
  name: string;

  /** The last part of the personal link. */
  @Column({ length: 8 })
  token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
