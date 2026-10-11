import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AdminUserDto } from './dto/admin-user.dto';
import { Role } from './role.enum';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  /** Newest first, with each user's invitation counts. */
  async findAll(): Promise<AdminUserDto[]> {
    const { entities, raw } = await this.withCounts(
      this.users.createQueryBuilder('user'),
    )
      .orderBy('user.createdAt', 'DESC')
      .getRawAndEntities<CountsRow>();
    return entities.map((user, i) => this.toAdminDto(user, raw[i]));
  }

  /** One user with their invitation counts (admin). */
  async findOneForAdmin(id: string): Promise<AdminUserDto> {
    const { entities, raw } = await this.withCounts(
      this.users.createQueryBuilder('user'),
    )
      .where('user.id = :id', { id })
      .getRawAndEntities<CountsRow>();
    if (!entities.length) throw new NotFoundException('User not found');
    return this.toAdminDto(entities[0], raw[0]);
  }

  /**
   * Makes a user an admin or a regular user. Admins can't change their own
   * role, so the last admin can't lock everyone out. Takes effect on the
   * user's next token refresh (at most an access token's lifetime).
   */
  async setRole(id: string, role: Role, actorId: string) {
    if (id === actorId) {
      throw new BadRequestException("You can't change your own role");
    }
    const { affected } = await this.users.update({ id }, { role });
    if (!affected) throw new NotFoundException('User not found');
    return this.findOneForAdmin(id);
  }

  async findById(id: string) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Returns the user with this phone, creating a regular user on first login. */
  async findOrCreateByPhone(phone: string) {
    await this.users
      .createQueryBuilder()
      .insert()
      .values({ phone })
      .orIgnore()
      .execute();
    const user = await this.users.findOneByOrFail({ phone });
    user.lastLoginAt = new Date();
    return this.users.save(user);
  }

  private withCounts(query: SelectQueryBuilder<User>) {
    return query
      .addSelect(
        '(SELECT COUNT(*) FROM taklif t WHERE t."userId" = user.id)',
        'taklif_count',
      )
      .addSelect(
        `(SELECT COUNT(*) FROM taklif t WHERE t."userId" = user.id AND t.status = 'published')`,
        'published_count',
      );
  }

  private toAdminDto(user: User, counts: CountsRow): AdminUserDto {
    return {
      id: user.id,
      phone: user.phone,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      taklifCount: Number(counts.taklif_count),
      publishedCount: Number(counts.published_count),
    };
  }
}

interface CountsRow {
  taklif_count: string;
  published_count: string;
}
