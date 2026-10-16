import type Redis from 'ioredis';
import type { FilesService } from '../files/files.service';
import { TaklifCleanupService } from './taklif-cleanup.service';
import type { TaklifService } from './taklif.service';

// Jest can't load @nestjs/schedule (ESM); the decorator is a no-op here.
jest.mock('@nestjs/schedule', () => ({ Cron: () => () => undefined }));
// Its imports are ESM too; the job only calls the cleanup methods.
jest.mock('./taklif.service', () => ({ TaklifService: class {} }));
jest.mock('../files/files.service', () => ({ FilesService: class {} }));

function setup(locked = true) {
  const taklifService = {
    deleteStaleDraftPhotos: jest.fn<Promise<number>, [Date]>(() =>
      Promise.resolve(0),
    ),
    deleteFreeEndedPhotos: jest.fn<Promise<number>, [Date]>(() =>
      Promise.resolve(0),
    ),
    deleteEndedPhotos: jest.fn<Promise<number>, [Date]>(() =>
      Promise.resolve(0),
    ),
  };
  const filesService = {
    deleteUnattachedImages: jest.fn<Promise<number>, [Date]>(() =>
      Promise.resolve(0),
    ),
  };
  const redis = { set: jest.fn(() => Promise.resolve(locked ? 'OK' : null)) };
  const service = new TaklifCleanupService(
    taklifService as unknown as TaklifService,
    filesService as unknown as FilesService,
    redis as unknown as Redis,
  );
  return { service, taklifService };
}

function monthsAgo(months: number) {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() - months);
  return date.getTime();
}

describe('TaklifCleanupService', () => {
  it('clears free invitations 3 months after the event, others after 12', async () => {
    const { service, taklifService } = setup();
    await service.cleanup();
    const [free] = taklifService.deleteFreeEndedPhotos.mock.calls[0];
    const [all] = taklifService.deleteEndedPhotos.mock.calls[0];
    expect(Math.abs(free.getTime() - monthsAgo(3))).toBeLessThan(60_000);
    expect(Math.abs(all.getTime() - monthsAgo(12))).toBeLessThan(60_000);
  });

  it('keeps going when the free step fails', async () => {
    const { service, taklifService } = setup();
    taklifService.deleteFreeEndedPhotos.mockRejectedValueOnce(new Error('db'));
    await service.cleanup();
    expect(taklifService.deleteEndedPhotos).toHaveBeenCalled();
  });

  it('does nothing when another instance holds the lock', async () => {
    const { service, taklifService } = setup(false);
    await service.cleanup();
    expect(taklifService.deleteFreeEndedPhotos).not.toHaveBeenCalled();
  });
});
