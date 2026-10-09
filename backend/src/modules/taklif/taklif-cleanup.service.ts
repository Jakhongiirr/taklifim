import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';
import { FilesService } from '../files/files.service';
import { TaklifService } from './taklif.service';

/** Drafts untouched this long are deleted (they were never paid for). */
const DRAFT_MAX_AGE_HOURS = 24;
/** Every invitation is deleted this many months after its event. */
const KEEP_AFTER_EVENT_MONTHS = 1;
/** Uploaded images nothing uses are deleted after this long. */
const UNATTACHED_MAX_AGE_HOURS = 24;
const LOCK_KEY = 'cron:taklif:cleanup';
// Held until it expires, so instances with slightly skewed clocks don't rerun.
const LOCK_TTL_SECONDS = 60 * 60;

@Injectable()
export class TaklifCleanupService {
  private readonly logger = new Logger(TaklifCleanupService.name);

  constructor(
    private readonly taklifService: TaklifService,
    private readonly filesService: FilesService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  /** Every night at 03:00 Tashkent time. */
  @Cron('0 3 * * *', { name: 'taklif-cleanup', timeZone: 'Asia/Tashkent' })
  async cleanup() {
    // With several API instances, only the first to get the lock runs the job.
    const locked = await this.redis.set(
      LOCK_KEY,
      '1',
      'EX',
      LOCK_TTL_SECONDS,
      'NX',
    );
    if (!locked) return;

    const draftCutoff = new Date(
      Date.now() - DRAFT_MAX_AGE_HOURS * 60 * 60 * 1000,
    );
    await this.run(
      `draft(s) last edited before ${draftCutoff.toISOString()}`,
      () => this.taklifService.deleteStaleDrafts(draftCutoff),
    );

    const eventCutoff = new Date();
    eventCutoff.setUTCMonth(
      eventCutoff.getUTCMonth() - KEEP_AFTER_EVENT_MONTHS,
    );
    await this.run(
      `invitation(s) with an event before ${eventCutoff.toISOString()}`,
      () => this.taklifService.deleteEnded(eventCutoff),
    );

    // Last, so photos of invitations deleted above don't wait another night.
    const uploadCutoff = new Date(
      Date.now() - UNATTACHED_MAX_AGE_HOURS * 60 * 60 * 1000,
    );
    await this.run(
      `unattached image(s) uploaded before ${uploadCutoff.toISOString()}`,
      () => this.filesService.deleteUnattachedImages(uploadCutoff),
    );
  }

  /** Each step logs its own result, so one failing doesn't stop the other. */
  private async run(what: string, step: () => Promise<number>) {
    try {
      this.logger.log(`Deleted ${await step()} ${what}`);
    } catch (err) {
      this.logger.error(
        `Deleting ${what} failed`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }
}
