import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export const MAX_TEXT_LENGTH = 5000;

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Required (or, in PATCH, non-null) trimmed text. */
export const Text = (maxLength: number) =>
  applyDecorators(
    Transform(trim),
    IsString(),
    IsNotEmpty(),
    MaxLength(maxLength),
  );

export const DemoUrl = () =>
  applyDecorators(
    Transform(trim),
    IsUrl(
      // No TLD required, so dev links like http://localhost:3001/... work.
      {
        require_protocol: true,
        protocols: ['http', 'https'],
        require_tld: false,
      },
      { message: 'demoUrl must be an http(s) URL' },
    ),
    MaxLength(500),
  );
