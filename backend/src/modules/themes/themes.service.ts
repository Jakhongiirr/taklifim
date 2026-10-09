import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { isPgError, PG_UNIQUE_VIOLATION } from '../../database/pg-errors';
import type { JwtPayload } from '../auth/auth.types';
import { Role } from '../users/role.enum';
import { CreateThemeDto } from './dto/create-theme.dto';
import { ListThemesQueryDto } from './dto/list-themes-query.dto';
import { ThemeDto } from './dto/theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme } from './theme.entity';

const ARCHIVED_FILTER = {
  active: { archivedAt: IsNull() },
  archived: { archivedAt: Not(IsNull()) },
  all: {},
};

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme) private readonly themes: Repository<Theme>,
  ) {}

  async create(dto: CreateThemeDto): Promise<ThemeDto> {
    const theme = await this.write(() =>
      this.themes.save(
        this.themes.create({ themeId: dto.themeId, price: dto.price }),
      ),
    );
    return this.toDto(theme);
  }

  async update(id: string, dto: UpdateThemeDto): Promise<ThemeDto> {
    const theme = await this.findOrFail(id);
    const changes: Partial<Theme> = {};
    if (dto.themeId !== undefined && dto.themeId !== theme.themeId) {
      changes.themeId = dto.themeId;
    }
    if (dto.price !== undefined && dto.price !== theme.price) {
      changes.price = dto.price;
    }

    if (Object.keys(changes).length) {
      await this.write(() => this.themes.save(Object.assign(theme, changes)));
    }
    return this.toDto(theme);
  }

  async list(
    query: ListThemesQueryDto,
    user?: JwtPayload,
  ): Promise<ThemeDto[]> {
    if (query.status !== 'active' && user?.role !== Role.Admin) {
      throw new ForbiddenException('Only admins can list archived themes');
    }
    const themes = await this.themes.find({
      where: ARCHIVED_FILTER[query.status],
      order: { createdAt: 'DESC' },
    });
    return themes.map((theme) => this.toDto(theme));
  }

  /** Archived themes are only visible to admins. */
  async findOne(id: string, user?: JwtPayload): Promise<ThemeDto> {
    const theme = await this.findOrFail(id);
    if (theme.archivedAt && user?.role !== Role.Admin) {
      throw new NotFoundException('Theme not found');
    }
    return this.toDto(theme);
  }

  async archive(id: string): Promise<ThemeDto> {
    return this.setArchived(id, true);
  }

  async unarchive(id: string): Promise<ThemeDto> {
    return this.setArchived(id, false);
  }

  private async setArchived(id: string, archived: boolean) {
    const theme = await this.findOrFail(id);
    if (archived !== !!theme.archivedAt) {
      theme.archivedAt = archived ? new Date() : null;
      await this.themes.save(theme);
    }
    return this.toDto(theme);
  }

  /** Runs a write, reporting a taken themeId as 409. */
  private async write<T>(operation: () => Promise<T>) {
    try {
      return await operation();
    } catch (err) {
      if (isPgError(err, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('This themeId is already taken');
      }
      throw err;
    }
  }

  private async findOrFail(id: string) {
    const theme = await this.themes.findOneBy({ id });
    if (!theme) throw new NotFoundException('Theme not found');
    return theme;
  }

  toDto(theme: Theme): ThemeDto {
    return {
      id: theme.id,
      themeId: theme.themeId,
      price: theme.price,
      archivedAt: theme.archivedAt,
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt,
    };
  }
}
