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

  constructor(config: ConfigService) {
    this.image = config.getOrThrow<number>('upload.imageMaxSizeMb') * MB;
    this.audio = config.getOrThrow<number>('upload.audioMaxSizeMb') * MB;
  }

  forType(mimeType: string) {
    return mimeType in AUDIO_FILE_TYPES ? this.audio : this.image;
  }

  static toMb(bytes: number) {
    return Math.round((bytes / MB) * 10) / 10;
  }
}
