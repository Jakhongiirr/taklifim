"use client";

import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { api, ApiError, uploadFile } from "@/lib/api-client";
import type { Demo, FileDto, Theme } from "@/lib/api-types";
import { formatBytes, formatPrice } from "@/lib/format";
import { Alert, Button, Field, Input, Select, Textarea } from "./ui";

// Mirrors the backend's IMAGE_FILE_TYPES; the backend checks the real contents.
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

const deleteFile = (id: string) =>
  api(`/files/${id}`, { method: "DELETE" }).catch(() => undefined);

/**
 * Add a demo (`demo` omitted) or edit one. A new image is uploaded first; if
 * saving the demo then fails, the upload is deleted again, and a replaced
 * image is deleted once the demo points at the new one.
 */
export default function DemoForm({
  demo,
  onDone,
  onCancel,
}: {
  demo?: Demo;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(demo?.title ?? "");
  const [text, setText] = useState(demo?.text ?? "");
  const [demoUrl, setDemoUrl] = useState(demo?.demoUrl ?? "");
  const [themeId, setThemeId] = useState(demo?.theme.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // Admins get archived themes too, so a demo's current theme stays selectable.
  const themes = useQuery({
    queryKey: ["themes", "all"],
    queryFn: () => api<Theme[]>("/themes?status=all"),
  });
  const themeOptions = (themes.data ?? []).filter(
    (theme) => !theme.archivedAt || theme.id === demo?.theme.id,
  );

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  async function save() {
    let uploaded: FileDto | null = null;
    try {
      if (file) {
        setProgress(0);
        uploaded = await uploadFile(file, setProgress);
        setProgress(null);
      }
      const fields = {
        title: title.trim(),
        text: text.trim(),
        demoUrl: demoUrl.trim(),
        themeId,
      };
      if (demo) {
        await api<Demo>(`/demos/${demo.id}`, {
          method: "PATCH",
          json: { ...fields, ...(uploaded && { imageId: uploaded.id }) },
        });
        if (uploaded) await deleteFile(demo.image.id);
      } else {
        await api<Demo>("/demos", {
          method: "POST",
          json: { ...fields, imageId: uploaded!.id },
        });
      }
      onDone();
    } catch (e) {
      if (uploaded) await deleteFile(uploaded.id);
      setProgress(null);
      setError(
        e instanceof ApiError ? e.fullMessage : "Could not save the demo",
      );
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Title is required");
    if (!text.trim()) return setError("Text is required");
    if (!demoUrl.trim()) return setError("Demo URL is required");
    if (!themeId) return setError("Choose a theme");
    if (!demo && !file) return setError("Choose an image");
    setPending(true);
    await save();
    setPending(false);
  }

  const imageSrc = preview ?? demo?.image.url;

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
      <Field label="Text">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={5000}
          rows={4}
          required
        />
      </Field>
      <Field label="Demo URL">
        <Input
          type="url"
          value={demoUrl}
          onChange={(e) => setDemoUrl(e.target.value)}
          maxLength={500}
          placeholder="https://"
          required
        />
      </Field>
      <Field
        label="Theme"
        hint={themes.isError ? "Could not load themes" : undefined}
      >
        <Select
          value={themeId}
          onChange={(e) => setThemeId(e.target.value)}
          disabled={themes.isPending}
          required
        >
          <option value="" disabled>
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
      <Field
        label={demo ? "Replace image" : "Image"}
        hint={
          file
            ? `${file.name} · ${formatBytes(file.size)}`
            : demo
              ? "Leave empty to keep the current image."
              : "JPEG, PNG or WebP, up to 10 MB"
        }
      >
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- user uploads and blob: previews
          <img
            src={imageSrc}
            alt="Demo preview"
            className="aspect-video w-full rounded-md border border-zinc-200 bg-zinc-100 object-cover dark:border-zinc-800 dark:bg-zinc-800"
          />
        )}
        <input
          type="file"
          accept={IMAGE_ACCEPT}
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
          {demo ? "Save changes" : "Add demo"}
        </Button>
      </div>
    </form>
  );
}
