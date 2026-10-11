import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

/** Payme's transaction states. */
export enum PaymeState {
  Created = 1,
  Performed = 2,
  CancelledBeforePerform = -1,
  CancelledAfterPerform = -2,
}

/** Bigint columns as numbers (Postgres returns bigint as text). */
const bigintNumber = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? 0 : Number(value)),
};

/**
 * A Payme Merchant API transaction for an order, as Payme's server sees it:
 * times are milliseconds since the epoch, 0 when not reached.
 */
@Entity('payme_transactions')
export class PaymeTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Payme's transaction id. */
  @Index({ unique: true })
  @Column({ length: 25 })
  paymeId: string;

  @Index()
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'orderId' })
  order?: Order;

  /** In tiyin (1 so'm = 100 tiyin), as Payme sends it. */
  @Column({ type: 'bigint', transformer: bigintNumber })
  amount: number;

  @Column({ type: 'smallint' })
  state: PaymeState;

  /** Why it was cancelled (Payme's reason code); null otherwise. */
  @Column({ type: 'smallint', nullable: true })
  reason: number | null;

  /** When Payme created it (their clock). */
  @Column({ type: 'bigint', transformer: bigintNumber })
  paymeTime: number;

  @Column({ type: 'bigint', transformer: bigintNumber })
  createTime: number;

  @Column({ type: 'bigint', default: 0, transformer: bigintNumber })
  performTime: number;

  @Column({ type: 'bigint', default: 0, transformer: bigintNumber })
  cancelTime: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
