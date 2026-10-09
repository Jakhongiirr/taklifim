"use client";

import { type FormEvent, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { Theme } from "@/lib/api-types";
import { Alert, Button, Field, Input } from "./ui";

// Mirrors the backend's THEME_ID_PATTERN; the backend validates too.
const THEME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Mirrors the backend's MAX_PRICE.
const MAX_PRICE = 1_000_000_000;

/** Create a theme (`theme` omitted) or rename one. */
export default function ThemeForm({
  theme,
  onDone,
  onCancel,
}: {
  theme?: Theme;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [themeId, setThemeId] = useState(theme?.themeId ?? "");
  const [price, setPrice] = useState(theme ? String(theme.price) : "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const value = themeId.trim().toLowerCase();
    if (!value) return setError("Theme ID is required");
    if (!THEME_ID_PATTERN.test(value)) {
      return setError(
        "Use lowercase letters, digits and single hyphens, e.g. spring-2026",
      );
    }
    // Allow "150 000" / "150,000" as typed by hand.
    const amount = Number(price.replace(/[\s,]/g, ""));
    if (!price.trim() || !Number.isInteger(amount) || amount < 0) {
      return setError("Price must be a whole number of so'm, 0 or more");
    }
    if (amount > MAX_PRICE) {
      return setError("Price is too large");
    }
    const changes = theme
      ? {
          ...(value !== theme.themeId && { themeId: value }),
          ...(amount !== theme.price && { price: amount }),
        }
      : { themeId: value, price: amount };
    if (!Object.keys(changes).length) return onCancel();

    setPending(true);
    try {
      await api<Theme>(theme ? `/themes/${theme.id}` : "/themes", {
        method: theme ? "PATCH" : "POST",
        json: changes,
      });
      onDone();
    } catch (e) {
      setError(
        e instanceof ApiError ? e.fullMessage : "Could not save the theme",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        label="Theme ID"
        hint={
          theme
            ? "The frontend looks themes up by this key, so renaming affects anything that uses it."
            : "Unique key, e.g. classic. Lowercase letters, digits and hyphens."
        }
      >
        <Input
          value={themeId}
          onChange={(e) => setThemeId(e.target.value)}
          maxLength={50}
          placeholder="classic"
          autoComplete="off"
          spellCheck={false}
          required
          autoFocus
          className="font-mono"
        />
      </Field>

      <Field label="Price" hint="Whole so'm (UZS). 0 makes the theme free.">
        <div className="relative">
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            placeholder="150000"
            autoComplete="off"
            required
            className="pr-14 tabular-nums"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-zinc-500">
            UZS
          </span>
        </div>
      </Field>

      <Alert>{error}</Alert>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {theme ? "Save changes" : "Add theme"}
        </Button>
      </div>
    </form>
  );
}
