import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { isPgError, PG_FOREIGN_KEY_VIOLATION } from '../../database/pg-errors';
import type { JwtPayload } from '../auth/auth.types';
import { StorageService } from '../storage/storage.service';
import { Role } from '../users/role.enum';
import { FileDto } from './dto/file.dto';
import { File } from './file.entity';
import {
  ALLOWED_FILE_TYPES,
  AUDIO_FILE_TYPES,
  IMAGE_FILE_TYPES,
} from './file-types';
import { UploadLimits } from './upload-limits';

const CLEANUP_BATCH_SIZE = 100;

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private readonly files: Repository<File>,
    private readonly storage: StorageService,
    private readonly limits: UploadLimits,
  ) {}

  /** `upload.mimetype` must already be verified against the file contents. */
  async upload(
    upload: Express.Multer.File,
    user: JwtPayload,
  ): Promise<FileDto> {
    if (upload.mimetype in AUDIO_FILE_TYPES && user.role !== Role.Admin) {
      throw new ForbiddenException('Only admins can upload audio');
    }
    const maxSize = this.limits.forType(upload.mimetype);
    if (upload.size > maxSize) {
      throw new PayloadTooLargeException(
        `File too large. Max ${UploadLimits.toMb(maxSize)} MB for this type`,
      );
    }

    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const ext = ALLOWED_FILE_TYPES[upload.mimetype];
    const key = `uploads/${now.getUTCFullYear()}/${month}/${randomUUID()}.${ext}`;

    await this.storage.upload(key, upload.buffer, upload.mimetype);
    try {
      const file = await this.files.save(
        this.files.create({
          key,
          // Multer decodes multipart filenames as latin1.
          originalName: Buffer.from(upload.originalname, 'latin1')
            .toString('utf8')
            .slice(0, 255),
          mimeType: upload.mimetype,
          size: upload.size,
          uploadedById: user.sub,
        }),
      );
      return this.toDto(file);
    } catch (err) {
      await this.storage.delete(key).catch(() => undefined);
      throw err;
    }
  }

  /** The uploader or an admin; 404 for anyone else (existence isn't revealed). */
  async findOne(id: string, user: JwtPayload): Promise<FileDto> {
    const file = await this.findOrFail(id);
    if (file.uploadedById !== user.sub && user.role !== Role.Admin) {
      throw new NotFoundException('File not found');
    }
    return this.toDto(file);
  }

  /** Public URL of a stored object. */
  publicUrl(key: string) {
    return this.storage.getPublicUrl(key);
  }

  /** Only the uploader or an admin can delete a file. */
  async remove(id: string, user: JwtPayload) {
    const file = await this.findOrFail(id);
    if (file.uploadedById !== user.sub && user.role !== Role.Admin) {
      throw new ForbiddenException();
    }
    await this.delete(file);
  }

  /**
   * Deletes a file without a permission check, for owners of the record that
   * used it (e.g. an invitation's removed photos). 409 if it's still in use.
   */
  async removeUnchecked(id: string) {
    await this.delete(await this.findOrFail(id));
  }

  /**
   * Deletes images uploaded before `before` that nothing references (any
   * foreign key to `files`: invitation photos, demo images, ...). Audio is
   * never touched. Returns how many were deleted; failures are skipped.
   */
  async deleteUnattachedImages(before: Date): Promise<number> {
    const { driver, entityMetadatas } = this.files.manager.connection;
    const references = entityMetadatas.flatMap((metadata) =>
      metadata.foreignKeys
        .filter((fk) => fk.referencedEntityMetadata.target === File)
        .map((fk) => ({
          table: driver.escape(metadata.tablePath),
          column: driver.escape(fk.columnNames[0]),
        })),
    );

    let deleted = 0;
    let lastId: string | undefined;
    for (;;) {
      const query = this.files
        .createQueryBuilder('file')
        .select(['file.id', 'file.key'])
        .where('file.mimeType IN (:...types)', {
          types: Object.keys(IMAGE_FILE_TYPES),
        })
        .andWhere('file.createdAt < :before', { before })
        .orderBy('file.id')
        .limit(CLEANUP_BATCH_SIZE);
      // Keyset paging, so files that fail to delete aren't picked again.
      if (lastId) query.andWhere('file.id > :lastId', { lastId });
      for (const { table, column } of references) {
        query.andWhere(
          `NOT EXISTS (SELECT 1 FROM ${table} ref WHERE ref.${column} = file.id)`,
        );
      }

      const batch = await query.getMany();
      for (const file of batch) {
        // Still guarded by the foreign keys if it got attached meanwhile.
        const ok = await this.delete(file).then(
          () => true,
          () => false,
        );
        if (ok) deleted++;
      }
      if (batch.length < CLEANUP_BATCH_SIZE) return deleted;
      lastId = batch[batch.length - 1].id;
    }
  }

  private async delete(file: File) {
    try {
      // Row first, so a file still referenced elsewhere (FK) is left untouched;
      // if the storage delete fails, the row delete is rolled back.
      await this.files.manager.transaction(async (manager) => {
        await manager.delete(File, file.id);
        await this.storage.delete(file.key);
      });
    } catch (err) {
      if (isPgError(err, PG_FOREIGN_KEY_VIOLATION)) {
        throw new ConflictException('File is in use and cannot be deleted');
      }
      throw err;
    }
  }

  async findOrFail(id: string) {
    const file = await this.files.findOneBy({ id });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  toDto(file: File): FileDto {
    return {
      id: file.id,
      url: this.storage.getPublicUrl(file.key),
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      uploadedById: file.uploadedById,
      createdAt: file.createdAt,
    };
  }
}
