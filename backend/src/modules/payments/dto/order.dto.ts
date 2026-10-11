import { OrderStatus } from '../order.entity';
import { PaymeState } from '../payme-transaction.entity';

/** An order as admins see it, with its latest Payme transaction. */
export class AdminOrderDto {
  id: string;

  /** @example "Taklifnoma: Jasur & Madina" */
  title: string;

  /** Whole so'm. */
  amount: number;

  status: OrderStatus;

  paidAt: Date | null;

  createdAt: Date;

  /** Null once the invitation is deleted. */
  taklif: { id: string; slug: string } | null;

  /** Null once the user is deleted. */
  user: { id: string; phone: string } | null;

  /** @example "aurora" */
  themeId: string | null;

  /** The newest Payme transaction for it, if any. */
  payme: { id: string; state: PaymeState; reason: number | null } | null;
}

export class AdminOrderPageDto {
  /** Newest first. */
  items: AdminOrderDto[];
  total: number;
  page: number;
  limit: number;
}
