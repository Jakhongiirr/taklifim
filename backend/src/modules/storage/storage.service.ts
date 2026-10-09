import {
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * S3-compatible object storage (MinIO locally; AWS S3, Cloudflare R2, etc.
 * in production). Files are publicly readable at `S3_PUBLIC_URL/<key>`.
 */
@Injectable()
export class StorageService implements OnApplicationShutdown {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(config: ConfigService) {
    this.bucket = config.getOrThrow<string>('storage.bucket');
    this.publicUrl = config
      .getOrThrow<string>('storage.publicUrl')
      .replace(/\/+$/, '');
    this.s3 = new S3Client({
      endpoint: config.get<string>('storage.endpoint'),
      region: config.getOrThrow<string>('storage.region'),
      forcePathStyle: config.get<boolean>('storage.forcePathStyle'),
      credentials: {
        accessKeyId: config.getOrThrow<string>('storage.accessKey'),
        secretAccessKey: config.getOrThrow<string>('storage.secretKey'),
      },
    });
  }

  async upload(key: string, body: Buffer, contentType: string) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        // Keys are unique and never overwritten, so caches can keep them forever.
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  }

  async delete(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  getPublicUrl(key: string) {
    return `${this.publicUrl}/${key}`;
  }

  /** Throws if the bucket is unreachable. */
  async ping() {
    await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));
  }

  onApplicationShutdown() {
    this.s3.destroy();
  }
}
