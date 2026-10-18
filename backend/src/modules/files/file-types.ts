/** Accepted upload types, detected from file contents. Maps MIME type to extension. */
export const IMAGE_FILE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** Admins can upload any of these (the music library). */
export const AUDIO_FILE_TYPES: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/x-m4a': 'm4a',
  // M4A from many Android recorders and converters doesn't mark itself as
  // audio, so it's detected as MP4; it's stored as .m4a and played as audio.
  'audio/mp4': 'm4a',
  'video/mp4': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/ogg; codecs=opus': 'opus',
  'audio/flac': 'flac',
  'audio/wav': 'wav',
};

/** Users can upload these as their invitation's own music. */
export const USER_AUDIO_FILE_TYPES: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/x-m4a': 'm4a',
  'audio/mp4': 'm4a',
  'video/mp4': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/ogg; codecs=opus': 'opus',
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
