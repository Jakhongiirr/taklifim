import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import type { JwtPayload } from '../auth/auth.types';
import { IMAGE_FILE_TYPES } from '../files/file-types';
import { FilesService } from '../files/files.service';
import { Theme } from '../themes/theme.entity';
import { ThemesService } from '../themes/themes.service';
import { Role } from '../users/role.enum';
import { CreateDemoDto } from './dto/create-demo.dto';
import { DemoDto } from './dto/demo.dto';
import { ListDemosQueryDto } from './dto/list-demos-query.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { Demo } from './demo.entity';

const ARCHIVED_FILTER = {
  active: { archivedAt: IsNull() },
  archived: { archivedAt: Not(IsNull()) },
  all: {},
};

const RELATIONS = { image: true, theme: true };

@Injectable()
export class DemosService {
  constructor(
    @InjectRepository(Demo) private readonly demos: Repository<Demo>,
    @InjectRepository(Theme) private readonly themes: Repository<Theme>,
    private readonly files: FilesService,
    private readonly themesService: ThemesService,
  ) {}

  async create(dto: CreateDemoDto): Promise<DemoDto> {
    await this.assertImageFile(dto.imageId);
    await this.assertTheme(dto.themeId);
    const { id } = await this.demos.save(
      this.demos.create({
        title: dto.title,
        text: dto.text,
        demoUrl: dto.demoUrl,
        imageId: dto.imageId,
        themeId: dto.themeId,
      }),
    );
    return this.toDto(await this.findOrFail(id));
  }

  async update(id: string, dto: UpdateDemoDto): Promise<DemoDto> {
    const demo = await this.findOrFail(id);
    const changes: Partial<Demo> = {};
    if (dto.title !== undefined) changes.title = dto.title;
    if (dto.text !== undefined) changes.text = dto.text;
    if (dto.demoUrl !== undefined) changes.demoUrl = dto.demoUrl;
    if (dto.imageId !== undefined && dto.imageId !== demo.imageId) {
      await this.assertImageFile(dto.imageId);
      changes.imageId = dto.imageId;
    }
    // Keeping an already-archived theme is allowed; switching to one is not.
    if (dto.themeId !== undefined && dto.themeId !== demo.themeId) {
      await this.assertTheme(dto.themeId);
      changes.themeId = dto.themeId;
    }

    if (Object.keys(changes).length) {
      await this.demos.update(id, changes);
    }
    return this.toDto(await this.findOrFail(id));
  }

  async list(query: ListDemosQueryDto, user?: JwtPayload): Promise<DemoDto[]> {
    if (query.status !== 'active' && user?.role !== Role.Admin) {
      throw new ForbiddenException('Only admins can list archived demos');
    }
    const demos = await this.demos.find({
      where: ARCHIVED_FILTER[query.status],
      relations: RELATIONS,
      order: { createdAt: 'DESC' },
    });
    return demos.map((demo) => this.toDto(demo));
  }

  /** Archived demos are only visible to admins. */
  async findOne(id: string, user?: JwtPayload): Promise<DemoDto> {
    const demo = await this.findOrFail(id);
    if (demo.archivedAt && user?.role !== Role.Admin) {
      throw new NotFoundException('Demo not found');
    }
    return this.toDto(demo);
  }

  async archive(id: string): Promise<DemoDto> {
    return this.setArchived(id, true);
  }

  async unarchive(id: string): Promise<DemoDto> {
    return this.setArchived(id, false);
  }

  private async setArchived(id: string, archived: boolean) {
    const demo = await this.findOrFail(id);
    if (archived !== !!demo.archivedAt) {
      demo.archivedAt = archived ? new Date() : null;
      await this.demos.save(demo);
    }
    return this.toDto(demo);
  }

  private async assertImageFile(fileId: string) {
    const file = await this.files.findOrFail(fileId).catch(() => {
      throw new BadRequestException('imageId does not exist');
    });
    if (!(file.mimeType in IMAGE_FILE_TYPES)) {
      throw new BadRequestException('imageId must be an image file');
    }
  }

  private async assertTheme(id: string) {
    const theme = await this.themes.findOneBy({ id });
    if (!theme || theme.archivedAt) {
      throw new BadRequestException('themeId must be an active theme');
    }
  }

  private async findOrFail(id: string) {
    const demo = await this.demos.findOne({
      where: { id },
      relations: RELATIONS,
    });
    if (!demo) throw new NotFoundException('Demo not found');
    return demo;
  }

  toDto(demo: Demo): DemoDto {
    return {
      id: demo.id,
      title: demo.title,
      text: demo.text,
      demoUrl: demo.demoUrl,
      image: this.files.toDto(demo.image),
      theme: this.themesService.toDto(demo.theme),
      archivedAt: demo.archivedAt,
      createdAt: demo.createdAt,
      updatedAt: demo.updatedAt,
    };
  }
}
