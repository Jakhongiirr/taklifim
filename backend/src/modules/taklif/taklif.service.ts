import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import {
  EntityManager,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { isPgError, PG_UNIQUE_VIOLATION } from '../../database/pg-errors';
import type { JwtPayload } from '../auth/auth.types';
import { File } from '../files/file.entity';
import { AUDIO_FILE_TYPES, IMAGE_FILE_TYPES } from '../files/file-types';
import { FilesService } from '../files/files.service';
import { Music } from '../music/music.entity';
import { MusicService } from '../music/music.service';
import { GiftsService } from '../gifts/gifts.service';
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
import {
  eventAtChangesLeft,
  eventAtRangeError,
  MAX_EVENT_AT_CHANGES,
} from './event-at-limit';
import { generateSlug } from './slug';
import { TaklifPhoto } from './taklif-photo.entity';
import { TaklifResponse } from './taklif-response.entity';
import { TaklifStatus } from './taklif-status.enum';
import { Taklif } from './taklif.entity';

const RELATIONS = {
  photos: { file: true },
  music: { file: true },
  customMusicFile: true,
  theme: true,
} as const;
const ORDER = { photos: { position: 'ASC' } } as const;
const SLUG_ATTEMPTS = 5;
const MAX_DRAFTS = 30;
const CLEANUP_BATCH_SIZE = 100;

type Writable = Omit<
  UpdateTaklifDto,
  | 'photoIds'
  | 'customMusicId'
  | 'locationUrl'
  | 'latitude'
  | 'longitude'
  | 'cardNumber'
  | 'phone'
  | 'eventAt'
> & {
  locationUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  cardNumber?: string | null;
  phone?: string | null;
  eventAtChanges?: number;
  eventAt?: Date;
  customMusicFileId?: string | null;
};

const isAdmin = (user?: JwtPayload) => user?.role === Role.Admin;

@Injectable()
export class TaklifService {
  private readonly logger = new Logger(TaklifService.name);

  constructor(
    @InjectRepository(Taklif) private readonly taklifs: Repository<Taklif>,
    @InjectRepository(Music) private readonly music: Repository<Music>,
    @InjectRepository(Theme) private readonly themes: Repository<Theme>,
    @InjectRepository(File) private readonly files: Repository<File>,
    private readonly filesService: FilesService,
    private readonly musicService: MusicService,
    private readonly themesService: ThemesService,
    private readonly gifts: GiftsService,
  ) {}

  async create(dto: CreateTaklifDto, user: JwtPayload): Promise<TaklifDto> {
    const { photoIds = [], eventAt, customMusicId, ...fields } = dto;
    this.assertEventAtRange(new Date(eventAt), user);
    if (fields.musicId && customMusicId) throw bothMusic();
    if (fields.musicId) await this.assertMusic(fields.musicId);
    if (customMusicId) await this.assertCustomMusic(customMusicId, user);
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
                customMusicFileId: customMusicId ?? null,
                locationUrl: fields.locationUrl ?? null,
                latitude: fields.latitude ?? null,
                longitude: fields.longitude ?? null,
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

  /**
   * Owner or admin. Photos removed from the list, and replaced or removed own
   * music, are deleted.
   */
  async update(
    id: string,
    dto: UpdateTaklifDto,
    user: JwtPayload,
  ): Promise<TaklifDto> {
    const taklif = await this.findOrFail(id);
    this.assertCanEdit(taklif, user);

    const { photoIds, eventAt, customMusicId, ...rest } = dto;
    if (rest.musicId && customMusicId) throw bothMusic();
    const changes: Writable = {};
    if (
      customMusicId !== undefined &&
      customMusicId !== taklif.customMusicFileId
    ) {
      changes.customMusicFileId = customMusicId;
    }
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
    // Only a new date is checked: other edits keep working after the event.
    if (changes.eventAt) this.assertEventAtRange(changes.eventAt, user);
    if (changes.eventAt && !isAdmin(user)) {
      const left = eventAtChangesLeft(taklif);
      if (left === 0) {
        throw new BadRequestException(
          `eventAt can change at most ${MAX_EVENT_AT_CHANGES} times after publishing`,
        );
      }
      if (left !== null) changes.eventAtChanges = taklif.eventAtChanges + 1;
    }
    if (changes.musicId) await this.assertMusic(changes.musicId);
    if (changes.customMusicFileId) {
      await this.assertCustomMusic(changes.customMusicFileId, user);
    }
    // One kind of music at a time: choosing one replaces the other.
    if (changes.musicId && taklif.customMusicFileId) {
      changes.customMusicFileId = null;
    }
    if (changes.customMusicFileId && taklif.musicId) changes.musicId = null;
    if (changes.themeId) {
      // The price paid was for this design (admins may still switch it).
      if (taklif.paidAt && !isAdmin(user)) {
        throw new ConflictException("A paid invitation's design can't change");
      }
      await this.assertTheme(changes.themeId);
    }

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
      if (changes.customMusicFileId !== undefined && taklif.customMusicFileId) {
        await this.deleteFiles([taklif.customMusicFileId]);
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

  /**
   * Any status, including draft. Called directly by admins (checked by the
   * controller), who are named as `admin` so it's logged.
   */
  async setStatus(
    id: string,
    status: TaklifStatus,
    admin?: JwtPayload,
  ): Promise<TaklifDto> {
    const taklif = await this.findOrFail(id);
    if (admin) {
      this.logger.log(
        `Admin ${admin.sub} set the status of invitation ${id} from ${taklif.status} to ${status}`,
      );
    }
    if (taklif.status !== status) {
      const gift = await this.taklifs.manager.transaction(async (manager) => {
        await manager.update(Taklif, id, {
          status,
          // The first publish fixes the date later postponements count from.
          ...(status === TaklifStatus.Published &&
            !taklif.lockedEventAt && { lockedEventAt: taklif.eventAt }),
        });
        // A paid design going live from a draft gives a plov gift.
        return taklif.status === TaklifStatus.Draft &&
          status === TaklifStatus.Published
          ? this.gifts.grantForPublish(manager, taklif)
          : null;
      });
      if (gift) void this.gifts.announce(gift);
    }
    return this.toDto(await this.findOrFail(id));
  }

  /**
   * Owners delete their own drafts only; once published (live or hidden,
   * paid or not) only admins can delete it. Also deletes the photos and own
   * music (and, by cascade, the guests' replies).
   */
  async remove(id: string, user: JwtPayload) {
    const taklif = await this.findOrFail(id);
    this.assertCanEdit(taklif, user);
    const where: FindOptionsWhere<Taklif> = { id };
    if (!isAdmin(user)) {
      if (taklif.status !== TaklifStatus.Draft || taklif.paidAt) {
        throw new ConflictException('Only drafts can be deleted');
      }
      // Re-checked by the delete, in case it was paid (published) meanwhile.
      where.status = TaklifStatus.Draft;
      where.paidAt = IsNull();
    }
    const { affected } = await this.taklifs.delete(where);
    if (!affected) {
      // Gone meanwhile (e.g. deleted from another tab), or no longer a draft.
      if (!(await this.taklifs.existsBy({ id }))) {
        throw new NotFoundException('Invitation not found');
      }
      throw new ConflictException('Only drafts can be deleted');
    }
    await this.deleteFiles([
      ...taklif.photos.map((photo) => photo.fileId),
      ...(taklif.customMusicFileId ? [taklif.customMusicFileId] : []),
    ]);
    if (taklif.userId !== user.sub) {
      this.logger.log(
        `Admin ${user.sub} deleted invitation ${id} (${taklif.status}) of user ${taklif.userId}`,
      );
    }
  }

  /**
   * Removes the photos of drafts last edited before `before`; the drafts
   * themselves are kept.
   */
  deleteStaleDraftPhotos(before: Date): Promise<number> {
    return this.deletePhotosMatching({
      status: TaklifStatus.Draft,
      updatedAt: LessThan(before),
    });
  }

  /**
   * Removes the photos of invitations of any status whose event was before
   * `before`; the invitations themselves are kept.
   */
  deleteEndedPhotos(before: Date): Promise<number> {
    return this.deletePhotosMatching({ eventAt: LessThan(before) });
  }

  /**
   * Removes the photos of invitations published on a free design whose event
   * was before `before`; the invitations themselves are kept. Free means
   * nothing was paid: a 0 so'm order and no paid order above 0, so a design
   * made free after someone paid for it keeps their photos as long as any
   * paid invitation's.
   */
  deleteFreeEndedPhotos(before: Date): Promise<number> {
    return this.deletePhotosMatching(
      { eventAt: LessThan(before), paidAt: Not(IsNull()) },
      `EXISTS (SELECT 1 FROM orders o WHERE o."taklifId" = taklif.id AND o.status = 'paid' AND o.amount = 0)
        AND NOT EXISTS (SELECT 1 FROM orders o WHERE o."taklifId" = taklif.id AND o.status = 'paid' AND o.amount > 0)`,
    );
  }

  /**
   * Deletes the photos (and their files) and own music of the matching
   * invitations, in batches, keeping the invitations. Returns how many
   * invitations lost them. Only invitations that still have photos or own
   * music are picked, so the loop ends; one that stops matching meanwhile
   * (e.g. edited) keeps them. The music's file is left to the unattached
   * uploads cleanup.
   */
  private async deletePhotosMatching(
    where: FindOptionsWhere<Taklif>,
    /** Extra SQL on the invitation, aliased `taklif`. */
    sql = 'TRUE',
  ) {
    const hasMedia = `(EXISTS (SELECT 1 FROM taklif_photos p WHERE p."taklifId" = taklif.id) OR taklif."customMusicFileId" IS NOT NULL)`;
    let cleared = 0;
    for (;;) {
      const batch = await this.taklifs
        .createQueryBuilder('taklif')
        .select('taklif.id')
        .where(where)
        .andWhere(sql)
        .andWhere(hasMedia)
        .take(CLEANUP_BATCH_SIZE)
        .getMany();
      if (!batch.length) return cleared;

      // Re-checked here: the invitation may have changed since the select.
      const stillMatching = this.taklifs
        .createQueryBuilder('taklif')
        .select('taklif.id')
        .where(where)
        .andWhere(sql)
        .andWhere({ id: In(batch.map((row) => row.id)) });
      const result = await this.taklifs.manager
        .createQueryBuilder()
        .delete()
        .from(TaklifPhoto)
        .where(
          `"taklifId" IN (${stillMatching.getQuery()})`,
          stillMatching.getParameters(),
        )
        .returning(['taklifId', 'fileId'])
        .execute();
      const rows = result.raw as { taklifId: string; fileId: string }[];
      await this.deleteFiles(rows.map((row) => row.fileId));
      const music = await this.taklifs
        .createQueryBuilder()
        .update(Taklif)
        // Not an edit by the owner: keep updatedAt as it was.
        .set({ customMusicFileId: null, updatedAt: () => '"updatedAt"' })
        .where(
          `id IN (${stillMatching.getQuery()})`,
          stillMatching.getParameters(),
        )
        .andWhere('"customMusicFileId" IS NOT NULL')
        .returning(['id'])
        .execute();
      const musicRows = music.raw as { id: string }[];
      cleared += new Set([
        ...rows.map((row) => row.taklifId),
        ...musicRows.map((row) => row.id),
      ]).size;
      // A batch whose invitations all changed meanwhile deletes nothing and
      // would be picked again: stop instead of looping.
      if (
        (!rows.length && !musicRows.length) ||
        batch.length < CLEANUP_BATCH_SIZE
      ) {
        return cleared;
      }
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
    const { status, q, userId, themeId, page, limit } = query;
    const where: FindOptionsWhere<Taklif> = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (themeId) where.themeId = themeId;
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
    const counts = ids.length
      ? await this.taklifs.manager
          .createQueryBuilder(TaklifResponse, 'r')
          .select('r.taklifId', 'taklifId')
          .addSelect('COUNT(*)', 'count')
          .where({ taklifId: In(ids.map((row) => row.id)) })
          .groupBy('r.taklifId')
          .getRawMany<{ taklifId: string; count: string }>()
      : [];
    const responses = new Map(counts.map((c) => [c.taklifId, Number(c.count)]));
    return {
      items: taklifs.map((taklif) => ({
        ...this.toDto(taklif),
        owner: { id: taklif.userId, phone: taklif.user!.phone },
        responseCount: responses.get(taklif.id) ?? 0,
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

  /** Owners set events in the future, not too far ahead; admins anything. */
  private assertEventAtRange(eventAt: Date, user: JwtPayload) {
    if (isAdmin(user)) return;
    const error = eventAtRangeError(eventAt);
    if (error) throw new BadRequestException(error);
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

  /** Audio; users can only use files they uploaded. */
  private async assertCustomMusic(id: string, user: JwtPayload) {
    const file = await this.files.findOneBy({ id });
    if (!file) {
      throw new BadRequestException('customMusicId is an unknown file');
    }
    if (!(file.mimeType in AUDIO_FILE_TYPES)) {
      throw new BadRequestException('customMusicId must be audio');
    }
    if (!isAdmin(user) && file.uploadedById !== user.sub) {
      throw new BadRequestException('customMusicId must be audio you uploaded');
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

  /** Runs a write, reporting a file used by another invitation as 409. */
  private async write<T>(operation: () => Promise<T>) {
    try {
      return await operation();
    } catch (err) {
      if (isUniqueViolation(err, 'UQ_taklif_photos_fileId')) {
        throw new ConflictException(
          'A photo is already used by another invitation',
        );
      }
      if (isUniqueViolation(err, 'UQ_taklif_customMusicFileId')) {
        throw new ConflictException(
          'This music is already used by another invitation',
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
      eventAtChangesLeft: eventAtChangesLeft(taklif),
      paidAt: taklif.paidAt,
      venueName: taklif.venueName,
      venueAddress: taklif.venueAddress,
      locationUrl: taklif.locationUrl,
      latitude: taklif.latitude,
      longitude: taklif.longitude,
      photos: taklif.photos.map((photo) => this.filesService.toDto(photo.file)),
      cardNumber: taklif.cardNumber,
      phone: taklif.phone,
      music: taklif.music ? this.musicService.toDto(taklif.music) : null,
      customMusic: taklif.customMusicFile
        ? this.filesService.toDto(taklif.customMusicFile)
        : null,
      theme: this.themesService.toDto(taklif.theme),
      viewCount: taklif.viewCount,
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
      latitude: taklif.latitude,
      longitude: taklif.longitude,
      photos: taklif.photos.map((photo) => ({
        id: photo.fileId,
        url: url(photo.file),
      })),
      cardNumber: taklif.cardNumber,
      phone: taklif.phone,
      music: taklif.customMusicFile
        ? {
            title: customMusicTitle(taklif.customMusicFile.originalName),
            artist: null,
            file: { url: url(taklif.customMusicFile) },
          }
        : taklif.music && {
            title: taklif.music.title,
            artist: taklif.music.artist,
            file: { url: url(taklif.music.file) },
          },
      theme: { themeId: taklif.theme.themeId },
    };
  }
}

const bothMusic = () =>
  new BadRequestException('Send musicId or customMusicId, not both');

/** "Bizning qo'shig'imiz.mp3" -> "Bizning qo'shig'imiz". */
function customMusicTitle(fileName: string) {
  return fileName.replace(/\.[^.]*$/, '').trim() || fileName;
}

function isUniqueViolation(err: unknown, constraint: string) {
  return (
    isPgError(err, PG_UNIQUE_VIOLATION) &&
    (err as { driverError: { constraint?: string } }).driverError.constraint ===
      constraint
  );
}
