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
 * A free plov ("osh") invitation, given when a paid invitation is first
 * published. Used when the owner publishes a plov draft: that publish
 * costs nothing.
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

  /** The invitation whose publishing gave it: one gift per invitation. */
  @Index({ unique: true })
  @Column({ type: 'uuid', nullable: true })
  sourceTaklifId: string | null;

  @ManyToOne(() => Taklif, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sourceTaklifId' })
  sourceTaklif?: Taklif | null;

  /** The order that paid for it, when it was paid through Payme. */
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
