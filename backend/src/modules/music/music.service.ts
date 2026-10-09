import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { isPgError, PG_UNIQUE_VIOLATION } from '../../database/pg-errors';
import type { JwtPayload } from '../auth/auth.types';
import { AUDIO_FILE_TYPES } from '../files/file-types';
import { FilesService } from '../files/files.service';
import { Role } from '../users/role.enum';
import { CreateMusicDto } from './dto/create-music.dto';
import { ListMusicQueryDto } from './dto/list-music-query.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { MusicDto } from './dto/music.dto';
import { Music } from './music.entity';

const ARCHIVED_FILTER = {
  active: { archivedAt: IsNull() },
  archived: { archivedAt: Not(IsNull()) },
  all: {},
};

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music) private readonly music: Repository<Music>,
    private readonly files: FilesService,
  ) {}

  async create(dto: CreateMusicDto): Promise<MusicDto> {
    await this.assertAudioFile(dto.fileId);
    const { id } = await this.write(() =>
      this.music.save(
        this.music.create({
          title: dto.title,
          artist: dto.artist ?? null,
          fileId: dto.fileId,
        }),
      ),
    );
    return this.toDto(await this.findOrFail(id));
  }

  async update(id: string, dto: UpdateMusicDto): Promise<MusicDto> {
    const track = await this.findOrFail(id);
    const changes: Partial<Music> = {};
    if (dto.title !== undefined) changes.title = dto.title;
    if (dto.artist !== undefined) changes.artist = dto.artist;
    if (dto.fileId !== undefined && dto.fileId !== track.fileId) {
      await this.assertAudioFile(dto.fileId);
      changes.fileId = dto.fileId;
    }

    if (Object.keys(changes).length) {
      await this.write(() => this.music.update(id, changes));
    }
    return this.toDto(await this.findOrFail(id));
  }

  async list(query: ListMusicQueryDto, user?: JwtPayload): Promise<MusicDto[]> {
    if (query.status !== 'active' && user?.role !== Role.Admin) {
      throw new ForbiddenException('Only admins can list archived music');
    }
    const tracks = await this.music.find({
      where: ARCHIVED_FILTER[query.status],
      relations: { file: true },
      order: { createdAt: 'DESC' },
    });
    return tracks.map((track) => this.toDto(track));
  }

  /** Archived tracks are only visible to admins. */
  async findOne(id: string, user?: JwtPayload): Promise<MusicDto> {
    const track = await this.findOrFail(id);
    if (track.archivedAt && user?.role !== Role.Admin) {
      throw new NotFoundException('Music not found');
    }
    return this.toDto(track);
  }

  async archive(id: string): Promise<MusicDto> {
    return this.setArchived(id, true);
  }

  async unarchive(id: string): Promise<MusicDto> {
    return this.setArchived(id, false);
  }

  private async setArchived(id: string, archived: boolean) {
    const track = await this.findOrFail(id);
    if (archived !== !!track.archivedAt) {
      track.archivedAt = archived ? new Date() : null;
      await this.music.save(track);
    }
    return this.toDto(track);
  }

  private async assertAudioFile(fileId: string) {
    const file = await this.files.findOrFail(fileId).catch(() => {
      throw new BadRequestException('fileId does not exist');
    });
    if (!(file.mimeType in AUDIO_FILE_TYPES)) {
      throw new BadRequestException('fileId must be an audio file');
    }
  }

  /** Runs a write, reporting a reused audio file as 409. */
  private async write<T>(operation: () => Promise<T>) {
    try {
      return await operation();
    } catch (err) {
      if (isPgError(err, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('This file is already used by a track');
      }
      throw err;
    }
  }

  private async findOrFail(id: string) {
    const track = await this.music.findOne({
      where: { id },
      relations: { file: true },
    });
    if (!track) throw new NotFoundException('Music not found');
    return track;
  }

  toDto(track: Music): MusicDto {
    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      file: this.files.toDto(track.file),
      archivedAt: track.archivedAt,
      createdAt: track.createdAt,
      updatedAt: track.updatedAt,
    };
  }
}
