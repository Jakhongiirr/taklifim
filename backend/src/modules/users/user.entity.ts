import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * E.164 format.
   * @example "+998901234567"
   */
  @Column({ unique: true, length: 20 })
  phone: string;

  /**
   * Their Telegram account (also their private chat with the bot), saved at
   * Telegram login; guests' replies are sent there. Null until they log in
   * with Telegram.
   */
  @Column({ type: 'bigint', nullable: true })
  telegramId: string | null;

  /** The language they logged in to the site in; the bot writes in it. */
  @Column({ type: 'varchar', length: 8, nullable: true })
  locale: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
