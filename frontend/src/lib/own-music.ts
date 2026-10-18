import type { PublicTaklif, Taklif } from "./api-types";

/** "Bizning qo'shig'imiz.mp3" -> "Bizning qo'shig'imiz" (as the backend titles it). */
export function ownMusicTitle(fileName: string) {
  return fileName.replace(/\.[^.]*$/, "").trim() || fileName;
}

/**
 * The music guests hear: the couple's own upload, else the library track.
 * The owner's preview gets a full Taklif, where the two are separate fields.
 */
export function guestMusic(taklif: Taklif): PublicTaklif["music"] {
  if (taklif.customMusic) {
    return {
      title: ownMusicTitle(taklif.customMusic.originalName),
      artist: null,
      file: taklif.customMusic,
    };
  }
  return taklif.music;
}
