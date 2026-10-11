"use client";

import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { api, ApiError, uploadFile } from "@/lib/api-client";
import type { FileDto, Music, Taklif, Theme } from "@/lib/api-types";
import {
  formatCardNumber,
  formatPrice,
  fromTashkentInput,
  toTashkentInput,
} from "@/lib/format";
import { Alert, Button, Field, Input, Select } from "./ui";

// Mirrors the backend's MAX_PHOTOS and IMAGE_FILE_TYPES.
const MAX_PHOTOS = 6;
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

type Photo =
  | { key: string; existing: FileDto }
  | { key: string; file: File; preview: string };

const deleteFile = (id: string) =>
  api(`/files/${id}`, { method: "DELETE" }).catch(() => undefined);

const photoSrc = (photo: Photo) =>
  "existing" in photo ? photo.existing.url : photo.preview;

/**
 * Create an invitation (`taklif` omitted) or edit one. New photos are uploaded
 * on save; if saving then fails they're deleted again. Photos removed from an
 * existing invitation are deleted by the backend.
 */
export default function TaklifForm({
  taklif,
  onDone,
  onCancel,
}: {
  taklif?: Taklif;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [fields, setFields] = useState({
    brideName: taklif?.brideName ?? "",
    groomName: taklif?.groomName ?? "",
    hostName: taklif?.hostName ?? "",
    eventAt: taklif ? toTashkentInput(taklif.eventAt) : "",
    venueName: taklif?.venueName ?? "",
    venueAddress: taklif?.venueAddress ?? "",
    locationUrl: taklif?.locationUrl ?? "",
    phone: taklif?.phone ?? "",
    cardNumber: taklif?.cardNumber ? formatCardNumber(taklif.cardNumber) : "",
    musicId: taklif?.music?.id ?? "",
    themeId: taklif?.theme.id ?? "",
  });
  const [photos, setPhotos] = useState<Photo[]>(
    taklif?.photos.map((file) => ({ key: file.id, existing: file })) ?? [],
  );
  const [upload, setUpload] = useState<{
    index: number;
    total: number;
    progress: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // Preview URLs are revoked when a photo is removed and on unmount.
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () => {
      for (const photo of photosRef.current) {
        if ("preview" in photo) URL.revokeObjectURL(photo.preview);
      }
    },
    [],
  );

  // Admins get archived items too, so an invitation's current track or theme
  // shows up even after it was archived; only active ones can be picked.
  const music = useQuery({
    queryKey: ["music", "all"],
    queryFn: () => api<Music[]>("/music?status=all"),
  });
  const themes = useQuery({
    queryKey: ["themes", "all"],
    queryFn: () => api<Theme[]>("/themes?status=all"),
  });
  const musicOptions = (music.data ?? []).filter(
    (track) => !track.archivedAt || track.id === taklif?.music?.id,
  );
  const themeOptions = (themes.data ?? []).filter(
    (theme) => !theme.archivedAt || theme.id === taklif?.theme.id,
  );

  const set =
    (key: keyof typeof fields) => (e: { target: { value: string } }) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const added = [...files].slice(0, room).map((file) => ({
      key: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    if (files.length > room) {
      setError(`Up to ${MAX_PHOTOS} photos; extra files were skipped`);
    }
    setPhotos((p) => [...p, ...added]);
  }

  function removePhoto(key: string) {
    const photo = photos.find((p) => p.key === key);
    if (photo && "preview" in photo) URL.revokeObjectURL(photo.preview);
    setPhotos((p) => p.filter((x) => x.key !== key));
  }

  function movePhoto(index: number, by: -1 | 1) {
    setPhotos((p) => {
      const next = [...p];
      [next[index], next[index + by]] = [next[index + by], next[index]];
      return next;
    });
  }

  function validate() {
    const required: [keyof typeof fields, string][] = [
      ["groomName", "Groom's name"],
      ["brideName", "Bride's name"],
      ["hostName", "Host's name"],
      ["eventAt", "Date and time"],
      ["venueName", "Venue name"],
      ["venueAddress", "Venue address"],
      ["themeId", "Theme"],
    ];
    const missing = required.find(([key]) => !fields[key].trim());
    if (missing) return `${missing[1]} is required`;
    const url = fields.locationUrl.trim();
    if (url && !/^https?:\/\/\S+$/i.test(url)) {
      return "Location URL must start with http:// or https://";
    }
    const card = fields.cardNumber.replace(/[\s-]/g, "");
    if (card && !/^\d{16}$/.test(card)) return "Card number must be 16 digits";
    return "";
  }

  async function save() {
    const uploaded: FileDto[] = [];
    try {
      const photoIds: string[] = [];
      const newCount = photos.filter((p) => "file" in p).length;
      for (const photo of photos) {
        if ("existing" in photo) {
          photoIds.push(photo.existing.id);
          continue;
        }
        const index = uploaded.length + 1;
        setUpload({ index, total: newCount, progress: 0 });
        const file = await uploadFile(photo.file, (progress) =>
          setUpload({ index, total: newCount, progress }),
        );
        uploaded.push(file);
        photoIds.push(file.id);
      }
      setUpload(null);

      const card = fields.cardNumber.replace(/[\s-]/g, "");
      const phone = fields.phone.trim();
      const body = {
        brideName: fields.brideName.trim(),
        groomName: fields.groomName.trim(),
        hostName: fields.hostName.trim(),
        eventAt: fromTashkentInput(fields.eventAt),
        venueName: fields.venueName.trim(),
        venueAddress: fields.venueAddress.trim(),
        locationUrl: fields.locationUrl.trim() || null,
        themeId: fields.themeId,
      };

      if (taklif) {
        const photosChanged =
          photoIds.join() !== taklif.photos.map((p) => p.id).join();
        await api<Taklif>(`/taklif/${taklif.id}`, {
          method: "PATCH",
          json: {
            ...body,
            cardNumber: card || null,
            phone: phone || null,
            musicId: fields.musicId || null,
            ...(photosChanged && { photoIds }),
          },
        });
      } else {
        await api<Taklif>("/taklif", {
          method: "POST",
          json: {
            ...body,
            cardNumber: card || undefined,
            phone: phone || undefined,
            musicId: fields.musicId || undefined,
            photoIds,
          },
        });
      }
      onDone();
    } catch (e) {
      await Promise.all(uploaded.map((file) => deleteFile(file.id)));
      setUpload(null);
      setError(
        e instanceof ApiError ? e.fullMessage : "Could not save the invitation",
      );
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = validate();
    setError(problem);
    if (problem) return;
    setPending(true);
    await save();
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <Field label="Groom's name">
          <Input
            value={fields.groomName}
            onChange={set("groomName")}
            maxLength={100}
            required
            autoFocus
          />
        </Field>
        <Field label="Bride's name">
          <Input
            value={fields.brideName}
            onChange={set("brideName")}
            maxLength={100}
            required
          />
        </Field>
        <Field label="Host" hint="Who is inviting, e.g. the family name">
          <Input
            value={fields.hostName}
            onChange={set("hostName")}
            maxLength={100}
            required
          />
        </Field>
        <Field label="Date and time" hint="Tashkent time (UTC+5)">
          <Input
            type="datetime-local"
            value={fields.eventAt}
            onChange={set("eventAt")}
            required
          />
        </Field>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <Field label="Venue name">
          <Input
            value={fields.venueName}
            onChange={set("venueName")}
            maxLength={200}
            required
          />
        </Field>
        <Field label="Venue address">
          <Input
            value={fields.venueAddress}
            onChange={set("venueAddress")}
            maxLength={300}
            required
          />
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Location URL"
            hint="Optional. A Google Maps or Yandex Maps link"
          >
            <Input
              type="url"
              value={fields.locationUrl}
              onChange={set("locationUrl")}
              maxLength={500}
              placeholder="https://maps.app.goo.gl/…"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Music"
          hint={music.isError ? "Could not load music" : "Optional"}
        >
          <Select
            value={fields.musicId}
            onChange={set("musicId")}
            disabled={music.isPending}
          >
            <option value="">
              {music.isPending ? "Loading…" : "No music"}
            </option>
            {musicOptions.map((track) => (
              <option key={track.id} value={track.id}>
                {track.title}
                {track.artist ? ` — ${track.artist}` : ""}
                {track.archivedAt ? " (archived)" : ""}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Theme"
          hint={themes.isError ? "Could not load themes" : undefined}
        >
          <Select
            value={fields.themeId}
            onChange={set("themeId")}
            disabled={themes.isPending}
            required
          >
            <option value="">
              {themes.isPending ? "Loading…" : "Choose a theme"}
            </option>
            {themeOptions.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.themeId} · {formatPrice(theme.price)}
                {theme.archivedAt ? " (archived)" : ""}
              </option>
            ))}
          </Select>
        </Field>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" hint="Optional. Contact number for guests">
          <Input
            type="tel"
            value={fields.phone}
            onChange={set("phone")}
            placeholder="+998 90 123 45 67"
            autoComplete="off"
          />
        </Field>
        <Field label="Card number" hint="Optional. 16 digits, for gifts">
          <Input
            value={fields.cardNumber}
            onChange={set("cardNumber")}
            inputMode="numeric"
            placeholder="8600 1234 5678 9012"
            maxLength={19}
            autoComplete="off"
            className="tabular-nums"
          />
        </Field>
      </fieldset>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-baseline justify-between">
          <span className="font-medium">Photos</span>
          <span className="text-xs text-zinc-500">
            {photos.length} / {MAX_PHOTOS} · JPEG, PNG or WebP, up to 10 MB
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {photos.map((photo, index) => (
            <div
              key={photo.key}
              className="group relative aspect-square overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- user uploads and blob: previews */}
              <img
                src={photoSrc(photo)}
                alt={`Photo ${index + 1}`}
                className="size-full object-cover"
              />
              {"file" in photo && (
                <span className="absolute top-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                  New
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 text-white opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                <PhotoAction
                  label="Move left"
                  disabled={index === 0}
                  onClick={() => movePhoto(index, -1)}
                >
                  ←
                </PhotoAction>
                <PhotoAction
                  label="Remove photo"
                  onClick={() => removePhoto(photo.key)}
                >
                  ✕
                </PhotoAction>
                <PhotoAction
                  label="Move right"
                  disabled={index === photos.length - 1}
                  onClick={() => movePhoto(index, 1)}
                >
                  →
                </PhotoAction>
              </div>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-zinc-300 text-xs text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-700 dark:hover:text-zinc-100">
              <span className="text-xl leading-none">+</span>
              Add
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                multiple
                className="sr-only"
                onChange={(e) => {
                  addPhotos(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
        {taklif && (
          <span className="text-xs text-zinc-500">
            Removed photos are deleted when you save.
          </span>
        )}
      </div>

      {upload && (
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full bg-zinc-900 transition-[width] dark:bg-zinc-100"
              style={{ width: `${Math.round(upload.progress * 100)}%` }}
            />
          </div>
          Uploading photo {upload.index} of {upload.total}
        </div>
      )}

      <Alert>{error}</Alert>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {taklif ? "Save changes" : "Create invitation"}
        </Button>
      </div>
    </form>
  );
}

function PhotoAction({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex-1 py-1 text-sm hover:bg-white/20 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
