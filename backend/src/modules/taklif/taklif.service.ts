import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import {
  EntityManager,
  FindOptionsWhere,
  In,
  LessThan,
  Like,
  Repository,
} from 'typeorm';
import { isPgError, PG_UNIQUE_VIOLATION } from '../../database/pg-errors';
import type { JwtPayload } from '../auth/auth.types';
import { File } from '../files/file.entity';
import { IMAGE_FILE_TYPES } from '../files/file-types';
import { FilesService } from '../files/files.service';
import { Music } from '../music/music.entity';
import { MusicService } from '../music/music.service';
import { Theme } from '../themes/theme.entity';
import { ThemesService } from '../themes/themes.service';
import { Role } from '../users/role.enum';
import { User } from '../users/user.entity';
import { CreateTaklifDto } from './dto/create-taklif.dto';
import { ListTaklifQueryDto } from './dto/list-taklif-query.dto';
import {
  AdminTaklifPageDto,
  PublicTaklifDto,
  TaklifDto,
} from './dto/taklif.dto';
import { UpdateTaklifDto } from './dto/update-taklif.dto';
import { eventAtLimit, MAX_POSTPONE_DAYS } from './event-at-limit';
import { generateSlug } from './slug';
import { TaklifPhoto } from './taklif-photo.entity';
import { TaklifStatus } from './taklif-status.enum';
import { Taklif } from './taklif.entity';

const RELATIONS = {
  photos: { file: true },
  music: { file: true },
  theme: true,
} as const;
const ORDER = { photos: { position: 'ASC' } } as const;
const SLUG_ATTEMPTS = 5;
const MAX_DRAFTS = 30;
const CLEANUP_BATCH_SIZE = 100;

type Writable = Omit<
  UpdateTaklifDto,
  'photoIds' | 'cardNumber' | 'phone' | 'eventAt'
> & {
  cardNumber?: string | null;
  phone?: string | null;
  eventAt?: Date;
};

const isAdmin = (user?: JwtPayload) => user?.role === Role.Admin;

@Injectable()
export class TaklifService {
  constructor(
    @InjectRepository(Taklif) private readonly taklifs: Repository<Taklif>,
    @InjectRepository(Music) private readonly music: Repository<Music>,
    @InjectRepository(Theme) private readonly themes: Repository<Theme>,
    @InjectRepository(File) private readonly files: Repository<File>,
    private readonly filesService: FilesService,
    private readonly musicService: MusicService,
    private readonly themesService: ThemesService,
  ) {}

  async create(dto: CreateTaklifDto, user: JwtPayload): Promise<TaklifDto> {
    const { photoIds = [], eventAt, ...fields } = dto;
    if (fields.musicId) await this.assertMusic(fields.musicId);
    await this.assertTheme(fields.themeId);
    await this.assertPhotos(photoIds, user);

    for (let attempt = 1; ; attempt++) {
      try {
        const id = await this.write(() =>
          this.taklifs.manager.transaction(async (manager) => {
            await this.assertDraftLimit(manager, user);
            const { id } = await manager.save(
              manager.create(Taklif, {
                ...fields,
                eventAt: new Date(eventAt),
                musicId: fields.musicId ?? null,
                cardNumber: fields.cardNumber ?? null,
                phone: fields.phone ?? null,
                slug: generateSlug(),
                userId: user.sub,
              }),
            );
            await this.savePhotos(manager, id, photoIds);
            return id;
          }),
        );
        return this.toDto(await this.findOrFail(id));
      } catch (err) {
        // A slug collision is astronomically rare; just roll again.
        if (
          attempt < SLUG_ATTEMPTS &&
          isUniqueViolation(err, 'UQ_taklif_slug')
        ) {
          continue;
        }
        throw err;
      }
    }
  }

  /** Owner or admin. Photos removed from the list are deleted. */
  async update(
    id: string,
    dto: UpdateTaklifDto,
    user: JwtPayload,
  ): Promise<TaklifDto> {
    const taklif = await this.findOrFail(id);
    this.assertCanEdit(taklif, user);

    const { photoIds, eventAt, ...rest } = dto;
    const changes: Writable = {};
    if (eventAt !== undefined) {
      const date = new Date(eventAt);
      if (date.getTime() !== taklif.eventAt.getTime()) changes.eventAt = date;
    }
    for (const [key, value] of Object.entries(rest) as [
      keyof Writable,
      unknown,
    ][]) {
      if (value !== undefined && value !== taklif[key]) {
        Object.assign(changes, { [key]: value });
      }
    }
    if (changes.eventAt && !isAdmin(user)) {
      const limit = eventAtLimit(taklif);
      if (limit && changes.eventAt > limit) {
        throw new BadRequestException(
          `eventAt can be at most ${MAX_POSTPONE_DAYS} days after the date it had when published`,
        );
      }
    }
    if (changes.musicId) await this.assertMusic(changes.musicId);
    if (changes.themeId) await this.assertTheme(changes.themeId);

    const currentIds = taklif.photos.map((photo) => photo.fileId);
    const photosChanged =
      photoIds !== undefined && photoIds.join() !== currentIds.join();
    if (photosChanged) {
      const added = photoIds.filter((fileId) => !currentIds.includes(fileId));
      await this.assertPhotos(added, user);
    }

    if (Object.keys(changes).length || photosChanged) {
      await this.write(() =>
        this.taklifs.manager.transaction(async (manager) => {
          await manager.update(Taklif, id, {
            ...changes,
            updatedAt: new Date(),
          });
          if (photosChanged) {
            await manager.delete(TaklifPhoto, { taklifId: id });
            await this.savePhotos(manager, id, photoIds);
          }
        }),
      );
      if (photosChanged) {
        const removed = currentIds.filter(
          (fileId) => !photoIds.includes(fileId),
        );
        await this.deleteFiles(removed);
      }
    }
    return this.toDto(await this.findOrFail(id));
  }

  /**
   * Owner or admin. Republishes an unpublished invitation; publishing again is
   * a no-op. A draft is published only by paying for it (admins can still
   * force any status via setStatus).
   */
  async publish(id: string, user: JwtPayload): Promise<TaklifDto> {
    const taklif = await this.findOrFail(id);
    this.assertCanEdit(taklif, user);
    if (taklif.status === TaklifStatus.Draft) {
      throw new HttpException(
        'A draft is published after payment',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
    return this.setStatus(id, TaklifStatus.Published);
  }

  /** Owner or admin. Only a published invitation can be unpublished. */
  async unpublish(id: string, user: JwtPayload): Promise<TaklifDto> {
    const taklif = await this.findOrFail(id);
    this.assertCanEdit(taklif, user);
    if (taklif.status === TaklifStatus.Draft) {
      throw new ConflictException('A draft has not been published yet');
    }
    return this.setStatus(id, TaklifStatus.Unpublished);
  }

  /** Admin only (checked by the controller): any status, including draft. */
  async setStatus(id: string, status: TaklifStatus): Promise<TaklifDto> {
    const taklif = await this.findOrFail(id);
    if (taklif.status !== status) {
      await this.taklifs.update(id, {
        status,
        // The first publish fixes the date later postponements count from.
        ...(status === TaklifStatus.Published &&
          !taklif.lockedEventAt && { lockedEventAt: taklif.eventAt }),
      });
    }
    return this.toDto(await this.findOrFail(id));
  }

  /**
   * Admins delete any invitation; owners only their drafts (paid ones are
   * kept). Also deletes the photos.
   */
  async remove(id: string, user: JwtPayload) {
    const taklif = await this.findOrFail(id);
    this.assertCanEdit(taklif, user);
    const where: FindOptionsWhere<Taklif> = { id };
    if (!isAdmin(user)) {
      if (taklif.status !== TaklifStatus.Draft) {
        throw new ConflictException('Only drafts can be deleted');
      }
      // Re-checked by the delete, in case it was published meanwhile.
      where.status = TaklifStatus.Draft;
    }
    const { affected } = await this.taklifs.delete(where);
    if (!affected) {
      if (isAdmin(user)) throw new NotFoundException('Invitation not found');
      throw new ConflictException('Only drafts can be deleted');
    }
    await this.deleteFiles(taklif.photos.map((photo) => photo.fileId));
  }

  /** Deletes drafts last edited before `before`, with their photos. */
  deleteStaleDrafts(before: Date): Promise<number> {
    return this.deleteMatching({
      status: TaklifStatus.Draft,
      updatedAt: LessThan(before),
    });
  }

  /** Deletes invitations of any status whose event was before `before`. */
  deleteEnded(before: Date): Promise<number> {
    return this.deleteMatching({ eventAt: LessThan(before) });
  }

  /**
   * Deletes the matching invitations with their photos, in batches. Returns
   * how many were deleted. One that stops matching meanwhile (e.g. edited or
   * published) is kept.
   */
  private async deleteMatching(where: FindOptionsWhere<Taklif>) {
    let deleted = 0;
    for (;;) {
      const batch = await this.taklifs.find({
        select: { id: true },
        where,
        take: CLEANUP_BATCH_SIZE,
      });
      if (!batch.length) return deleted;

      const ids = batch.map((row) => row.id);
      const photos = await this.taklifs.manager.find(TaklifPhoto, {
        select: { taklifId: true, fileId: true },
        where: { taklifId: In(ids) },
      });
      // Re-checked here: the row may have changed since the select.
      const result = await this.taklifs
        .createQueryBuilder()
        .delete()
        .from(Taklif)
        .where({ ...where, id: In(ids) })
        .returning('id')
        .execute();
      const rows = result.raw as { id: string }[];
      const removed = new Set(rows.map((row) => row.id));
      await this.deleteFiles(
        photos
          .filter((photo) => removed.has(photo.taklifId))
          .map((photo) => photo.fileId),
      );
      deleted += removed.size;
      if (batch.length < CLEANUP_BATCH_SIZE) return deleted;
    }
  }

  /** For the public invitation page: published only, whoever asks. */
  async findPublishedBySlug(slug: string): Promise<PublicTaklifDto> {
    const taklif = await this.taklifs.findOne({
      where: { slug, status: TaklifStatus.Published },
      relations: RELATIONS,
      order: ORDER,
    });
    if (!taklif) throw new NotFoundException('Invitation not found');
    return this.toPublicDto(taklif);
  }

  /** Any status, for the owner and admins; 404 for everyone else. */
  async previewBySlug(slug: string, user: JwtPayload): Promise<TaklifDto> {
    const taklif = await this.taklifs.findOne({
      where: { slug },
      relations: RELATIONS,
      order: ORDER,
    });
    if (!taklif || (taklif.userId !== user.sub && !isAdmin(user))) {
      throw new NotFoundException('Invitation not found');
    }
    return this.toDto(taklif);
  }

  async listMine(user: JwtPayload): Promise<TaklifDto[]> {
    const taklifs = await this.taklifs.find({
      where: { userId: user.sub },
      relations: RELATIONS,
      order: { createdAt: 'DESC', ...ORDER },
    });
    return taklifs.map((taklif) => this.toDto(taklif));
  }

  /** Newest first; `id` breaks ties so pages never overlap. */
  async listAll(query: ListTaklifQueryDto): Promise<AdminTaklifPageDto> {
    const { status, q, page, limit } = query;
    const where: FindOptionsWhere<Taklif> = {};
    if (status) where.status = status;
    if (q) {
      if (isUUID(q)) where.id = q;
      // Slugs are [a-z0-9]; escape LIKE wildcards in anything else typed.
      else where.slug = Like(`${q.replace(/[\\%_]/g, '\\$&')}%`);
    }
    // Page the ids alone: TypeORM's skip/take with joined, nested-ordered
    // relations can repeat or skip rows across pages.
    const [ids, total] = await this.taklifs.findAndCount({
      select: { id: true },
      where,
      order: { createdAt: 'DESC', id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const rows = ids.length
      ? await this.taklifs.find({
          where: { id: In(ids.map((row) => row.id)) },
          relations: { ...RELATIONS, user: true },
          order: ORDER,
        })
      : [];
    const byId = new Map(rows.map((taklif) => [taklif.id, taklif]));
    // flatMap: a row deleted between the two queries is skipped.
    const taklifs = ids.flatMap((row) => byId.get(row.id) ?? []);
    return {
      items: taklifs.map((taklif) => ({
        ...this.toDto(taklif),
        owner: { id: taklif.userId, phone: taklif.user!.phone },
      })),
      total,
      page,
      limit,
    };
  }

  private canView(taklif: Taklif, user?: JwtPayload) {
    return (
      taklif.status === TaklifStatus.Published ||
      taklif.userId === user?.sub ||
      isAdmin(user)
    );
  }

  private assertCanEdit(taklif: Taklif, user: JwtPayload) {
    if (taklif.userId === user.sub || isAdmin(user)) return;
    if (this.canView(taklif, user)) throw new ForbiddenException();
    throw new NotFoundException('Invitation not found');
  }

  /**
   * Users can have at most MAX_DRAFTS drafts; admins aren't limited. Locks the
   * user's row until the transaction ends, so concurrent creates can't both
   * pass the count.
   */
  private async assertDraftLimit(manager: EntityManager, user: JwtPayload) {
    if (isAdmin(user)) return;
    await manager.findOne(User, {
      select: { id: true },
      where: { id: user.sub },
      lock: { mode: 'pessimistic_write' },
    });
    const drafts = await manager.countBy(Taklif, {
      userId: user.sub,
      status: TaklifStatus.Draft,
    });
    if (drafts >= MAX_DRAFTS) {
      throw new ConflictException(
        `You can have at most ${MAX_DRAFTS} drafts. Drafts not edited for 24 hours are deleted automatically`,
      );
    }
  }

  private async assertMusic(id: string) {
    const track = await this.music.findOneBy({ id });
    if (!track || track.archivedAt) {
      throw new BadRequestException('musicId must be an active track');
    }
  }

  private async assertTheme(id: string) {
    const theme = await this.themes.findOneBy({ id });
    if (!theme || theme.archivedAt) {
      throw new BadRequestException('themeId must be an active theme');
    }
  }

  /** Images only; users can only attach files they uploaded. */
  private async assertPhotos(ids: string[], user: JwtPayload) {
    if (!ids.length) return;
    const files = await this.files.findBy({ id: In(ids) });
    if (files.length !== ids.length) {
      throw new BadRequestException('photoIds contains an unknown file');
    }
    if (files.some((file) => !(file.mimeType in IMAGE_FILE_TYPES))) {
      throw new BadRequestException('photoIds must be images');
    }
    if (
      !isAdmin(user) &&
      files.some((file) => file.uploadedById !== user.sub)
    ) {
      throw new BadRequestException(
        'photoIds may only contain images you uploaded',
      );
    }
  }

  private async savePhotos(
    manager: EntityManager,
    taklifId: string,
    fileIds: string[],
  ) {
    if (!fileIds.length) return;
    await manager.insert(
      TaklifPhoto,
      fileIds.map((fileId, position) => ({ taklifId, fileId, position })),
    );
  }

  /** Best effort: a file that can't be deleted is left in storage. */
  private async deleteFiles(ids: string[]) {
    for (const id of ids) {
      await this.filesService.removeUnchecked(id).catch(() => undefined);
    }
  }

  /** Runs a write, reporting a photo used by another invitation as 409. */
  private async write<T>(operation: () => Promise<T>) {
    try {
      return await operation();
    } catch (err) {
      if (isUniqueViolation(err, 'UQ_taklif_photos_fileId')) {
        throw new ConflictException(
          'A photo is already used by another invitation',
        );
      }
      throw err;
    }
  }

  private async findOrFail(id: string) {
    const taklif = await this.taklifs.findOne({
      where: { id },
      relations: RELATIONS,
      order: ORDER,
    });
    if (!taklif) throw new NotFoundException('Invitation not found');
    return taklif;
  }

  private toDto(taklif: Taklif): TaklifDto {
    return {
      id: taklif.id,
      slug: taklif.slug,
      status: taklif.status,
      userId: taklif.userId,
      brideName: taklif.brideName,
      groomName: taklif.groomName,
      hostName: taklif.hostName,
      eventAt: taklif.eventAt,
      eventAtLimit: eventAtLimit(taklif),
      venueName: taklif.venueName,
      venueAddress: taklif.venueAddress,
      locationUrl: taklif.locationUrl,
      photos: taklif.photos.map((photo) => this.filesService.toDto(photo.file)),
      cardNumber: taklif.cardNumber,
      phone: taklif.phone,
      music: taklif.music ? this.musicService.toDto(taklif.music) : null,
      theme: this.themesService.toDto(taklif.theme),
      createdAt: taklif.createdAt,
      updatedAt: taklif.updatedAt,
    };
  }

  private toPublicDto(taklif: Taklif): PublicTaklifDto {
    const url = (file: { key: string }) =>
      this.filesService.publicUrl(file.key);
    return {
      slug: taklif.slug,
      brideName: taklif.brideName,
      groomName: taklif.groomName,
      hostName: taklif.hostName,
      eventAt: taklif.eventAt,
      venueName: taklif.venueName,
      venueAddress: taklif.venueAddress,
      locationUrl: taklif.locationUrl,
      photos: taklif.photos.map((photo) => ({
        id: photo.fileId,
        url: url(photo.file),
      })),
      cardNumber: taklif.cardNumber,
      phone: taklif.phone,
      music: taklif.music && {
        title: taklif.music.title,
        artist: taklif.music.artist,
        file: { url: url(taklif.music.file) },
      },
      theme: { themeId: taklif.theme.themeId },
    };
  }
}

function isUniqueViolation(err: unknown, constraint: string) {
  return (
    isPgError(err, PG_UNIQUE_VIOLATION) &&
    (err as { driverError: { constraint?: string } }).driverError.constraint ===
      constraint
  );
}
