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
import { Taklif } from '../taklif/taklif.entity';
import { Theme } from '../themes/theme.entity';
import { User } from '../users/user.entity';

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
}

/**
 * One purchase of an invitation's publication, created when the owner
 * starts paying. The price and theme are fixed here, so later price changes
 * don't affect it. Kept for accounting when the invitation or the user is
 * deleted (their ids become null).
 */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  taklifId: string | null;

  @ManyToOne(() => Taklif, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'taklifId' })
  taklif?: Taklif | null;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User | null;

  @Column({ type: 'uuid', nullable: true })
  themeId: string | null;

  @ManyToOne(() => Theme, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'themeId' })
  theme?: Theme | null;

  /** Whole so'm (UZS), the theme's price when the order was made. */
  @Column({ type: 'integer' })
  amount: number;

  /** What was bought, for receipts and the admin (the couple's names). */
  @Column({ length: 250 })
  title: string;

  @Index()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
