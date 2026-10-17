import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../payments/order.entity';
import { Taklif } from '../taklif/taklif.entity';
import { User } from '../users/user.entity';

/**
 * A free plov ("osh") invitation, given for each paid order. Used when the
 * owner publishes a plov draft: that publish costs nothing.
 */
@Entity('gifts')
export class Gift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  /** The paid order it came with: one gift per order. */
  @Index({ unique: true })
  @Column({ type: 'uuid', nullable: true })
  orderId: string | null;

  @ManyToOne(() => Order, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orderId' })
  order?: Order | null;

  /** The invitation it published, once used. */
  @Column({ type: 'uuid', nullable: true })
  taklifId: string | null;

  @ManyToOne(() => Taklif, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'taklifId' })
  taklif?: Taklif | null;

  @Column({ type: 'timestamptz', nullable: true })
  usedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
