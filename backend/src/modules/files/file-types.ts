/** Accepted upload types, detected from file contents. Maps MIME type to extension. */
export const IMAGE_FILE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** Only admins can upload these. */
export const AUDIO_FILE_TYPES: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/ogg; codecs=opus': 'opus',
  'audio/flac': 'flac',
  'audio/wav': 'wav',
};

export const ALLOWED_FILE_TYPES: Record<string, string> = {
  ...IMAGE_FILE_TYPES,
  ...AUDIO_FILE_TYPES,
};

export const ALLOWED_FILE_TYPES_PATTERN = new RegExp(
  `^(${Object.keys(ALLOWED_FILE_TYPES)
    .map((type) => type.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'))
    .join('|')})$`,
);
