import { Role } from '../role.enum';

/** A user as admins see it: the account plus how much they've made. */
export class AdminUserDto {
  id: string;

  /** @example "+998901234567" */
  phone: string;

  role: Role;

  lastLoginAt: Date | null;

  createdAt: Date;

  /**
   * Invitations in any status.
   * @example 3
   */
  taklifCount: number;

  /** @example 1 */
  publishedCount: number;
}
