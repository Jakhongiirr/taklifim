import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AUDIO_FILE_TYPES } from './file-types';

const MB = 1024 * 1024;

@Injectable()
export class UploadLimits {
  /** Bytes. */
  readonly image: number;
  /** Bytes. */
  readonly audio: number;
  /** Bytes: a user's own music for their invitation. */
  readonly userAudio: number;

  constructor(config: ConfigService) {
    this.image = config.getOrThrow<number>('upload.imageMaxSizeMb') * MB;
    this.audio = config.getOrThrow<number>('upload.audioMaxSizeMb') * MB;
    this.userAudio =
      config.getOrThrow<number>('upload.userAudioMaxSizeMb') * MB;
  }

  forType(mimeType: string, admin: boolean) {
    if (!(mimeType in AUDIO_FILE_TYPES)) return this.image;
    return admin ? this.audio : this.userAudio;
  }

  static toMb(bytes: number) {
    return Math.round((bytes / MB) * 10) / 10;
  }
}
