"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import type { Photo } from "./types";

// Mirrors the backend's MAX_PHOTOS, IMAGE_FILE_TYPES and the image size limit.
export const MAX_PHOTOS = 6;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;
// Listing exact types makes iPhones convert HEIC camera photos to JPEG.
const ACCEPT = TYPES.join(",");

const photoSrc = (photo: Photo) =>
  "existing" in photo ? photo.existing.url : photo.preview;

/** Picks, orders and removes photos; uploading happens on save. */
export default function PhotoPicker({
  photos,
  onChange,
  onError,
}: {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  onError: (message: string) => void;
}) {
  const t = useTranslations("Builder.photos");
  const input = useRef<HTMLInputElement>(null);

  function add(files: FileList | null) {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const picked = [...files];
    const valid = picked.filter((f) => TYPES.includes(f.type));
    if (valid.length < picked.length) onError(t("badType"));
    const sized = valid.filter((f) => f.size <= MAX_BYTES);
    if (sized.length < valid.length) onError(t("tooBig"));
    if (sized.length > room) onError(t("tooMany"));
    const added = sized.slice(0, room).map((file) => ({
      key: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    onChange([...photos, ...added]);
  }

  function remove(key: string) {
    const photo = photos.find((p) => p.key === key);
    if (photo && "preview" in photo) URL.revokeObjectURL(photo.preview);
    onChange(photos.filter((p) => p.key !== key));
  }

  function move(index: number, by: -1 | 1) {
    const next = [...photos];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    onChange(next);
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">{t("hint")}</p>
      <ul className="grid grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <li
            key={photo.key}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream"
          >
            <Image
              src={photoSrc(photo)}
              alt=""
              fill
              unoptimized
              sizes="33vw"
              className="object-cover"
            />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 rounded-full bg-paper/90 px-2 py-0.5 text-[11px] font-medium text-ink">
                {t("main")}
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(photo.key)}
              aria-label={t("remove")}
              className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-ink/60 text-paper"
            >
              ×
            </button>
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={t("moveUp")}
                className="flex size-7 items-center justify-center rounded-full bg-paper/90 text-ink disabled:invisible"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === photos.length - 1}
                aria-label={t("moveDown")}
                className="flex size-7 items-center justify-center rounded-full bg-paper/90 text-ink disabled:invisible"
              >
                ›
              </button>
            </div>
          </li>
        ))}
        {photos.length < MAX_PHOTOS && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-line text-sm text-muted transition-colors hover:border-sage hover:text-sage"
            >
              <span className="text-2xl leading-none">+</span>
              {t("add")}
            </button>
          </li>
        )}
      </ul>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
