"use client";

import { type FormEvent, useState } from "react";
import { api, ApiError, uploadFile } from "@/lib/api-client";
import type { FileDto, Music } from "@/lib/api-types";
import { formatBytes } from "@/lib/format";
import { Alert, Button, Field, Input } from "./ui";

// Mirrors the backend's AUDIO_FILE_TYPES; the backend checks the real contents.
const AUDIO_ACCEPT =
  "audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/ogg,audio/opus,audio/flac,audio/wav,audio/x-wav,.mp3,.m4a,.aac,.ogg,.opus,.flac,.wav";

const deleteFile = (id: string) =>
  api(`/files/${id}`, { method: "DELETE" }).catch(() => undefined);

/**
 * Add a track (`track` omitted) or edit one. A new audio file is uploaded
 * first; if saving the track then fails, the upload is deleted again, and a
 * replaced file is deleted once the track points at the new one.
 */
export default function MusicForm({
  track,
  onDone,
  onCancel,
}: {
  track?: Music;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(track?.title ?? "");
  const [artist, setArtist] = useState(track?.artist ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function save() {
    let uploaded: FileDto | null = null;
    try {
      if (file) {
        setProgress(0);
        uploaded = await uploadFile(file, setProgress);
        setProgress(null);
      }
      if (track) {
        await api<Music>(`/music/${track.id}`, {
          method: "PATCH",
          json: {
            title: title.trim(),
            artist: artist.trim() || null,
            ...(uploaded && { fileId: uploaded.id }),
          },
        });
        if (uploaded) await deleteFile(track.file.id);
      } else {
        await api<Music>("/music", {
          method: "POST",
          json: {
            title: title.trim(),
            artist: artist.trim() || undefined,
            fileId: uploaded!.id,
          },
        });
      }
      onDone();
    } catch (e) {
      if (uploaded) await deleteFile(uploaded.id);
      setProgress(null);
      setError(
        e instanceof ApiError ? e.fullMessage : "Could not save the track",
      );
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Title is required");
    if (!track && !file) return setError("Choose an audio file");
    setPending(true);
    await save();
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="Title">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          autoFocus
        />
      </Field>
      <Field label="Artist" hint="Optional">
        <Input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          maxLength={200}
        />
      </Field>
      <Field
        label={track ? "Replace audio" : "Audio file"}
        hint={
          file
            ? `${file.name} · ${formatBytes(file.size)}`
            : track
              ? `Current: ${track.file.originalName}. Leave empty to keep it.`
              : "MP3, M4A, AAC, OGG, Opus, FLAC or WAV, up to 50 MB"
        }
      >
        <input
          type="file"
          accept={AUDIO_ACCEPT}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm file:mr-3 file:rounded-md file:border file:border-zinc-300 file:bg-transparent file:px-3 file:py-1.5 file:text-sm dark:file:border-zinc-700"
        />
      </Field>

      {progress !== null && (
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full bg-zinc-900 transition-[width] dark:bg-zinc-100"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          Uploading {Math.round(progress * 100)}%
        </div>
      )}

      <Alert>{error}</Alert>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {track ? "Save changes" : "Add track"}
        </Button>
      </div>
    </form>
  );
}
