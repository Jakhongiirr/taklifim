import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  findAll() {
    return this.users.find({ order: { createdAt: 'DESC' } });
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
}
