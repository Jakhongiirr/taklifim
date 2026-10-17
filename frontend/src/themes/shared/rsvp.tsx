"use client";

import { useTranslations } from "next-intl";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ApiBody } from "@/lib/api-types";

/** Theme colors for the RSVP section (Tailwind classes). */
export interface RsvpPalette {
  /** Text inputs and the textarea. */
  input: string;
  /** Selected and unselected attendance options. */
  optionOn: string;
  optionOff: string;
  button: string;
  muted: string;
  accent: string;
  error: string;
}

const answeredKey = (slug: string) => `rsvp:${slug}`;
const noSubscribe = () => () => {};

/** The name this browser last replied with, if any. */
function readAnswered(slug: string) {
  try {
    return localStorage.getItem(answeredKey(slug));
  } catch {
    return null; // storage blocked: the form shows again, which is fine
  }
}

/**
 * Guests reply (name, attendance, guest count, an optional wish). Replies
 * are private: only the hosts read them, in their cabinet and in Telegram,
 * so guests don't see each other's. The backend drops bot submissions (the honeypot
 * field, sending faster than a person could) and rate limits; this form
 * just measures the time and keeps the honeypot invisible to people.
 */
export default function Rsvp({
  slug,
  preview = false,
  palette: p,
  subtitle,
}: {
  slug: string;
  preview?: boolean;
  palette: RsvpPalette;
  /** The line above the form, when the theme's event isn't a wedding. */
  subtitle?: string;
}) {
  const t = useTranslations("Rsvp");
  const openedAt = useRef(0);
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [sentName, setSentName] = useState("");
  const [error, setError] = useState("");
  // A reply sent earlier from this browser shows the thank-you instead.
  const remembered = useSyncExternalStore(
    noSubscribe,
    () => readAnswered(slug),
    () => null,
  );
  const [dismissed, setDismissed] = useState(false);
  const sent = status === "sent" || (!!remembered && !dismissed);
  const thanksName = status === "sent" ? sentName : (remembered ?? "");

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (preview) return;
    if (!name.trim()) return setError(t("errors.name"));
    setError("");
    setStatus("sending");
    try {
      const res = await fetch(`/api/backend/taklif/${slug}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          attending,
          guests: attending ? guests : 1,
          message: message.trim() || undefined,
          website: honeypot || undefined,
          elapsedMs: Date.now() - openedAt.current,
        }),
      });
      if (!res.ok) {
        const body = (await res
          .json()
          .catch(() => null)) as ApiBody<unknown> | null;
        const msg = body && !body.success ? body.error.message : "";
        setError(
          res.status === 429
            ? t("errors.tooMany")
            : res.status === 409
              ? t("errors.full")
              : /link/i.test(msg)
                ? t("errors.links")
                : t("errors.generic"),
        );
        setStatus("idle");
        return;
      }
      const sent = name.trim();
      try {
        localStorage.setItem(answeredKey(slug), sent);
      } catch {
        // Not remembered; nothing else depends on it.
      }
      setSentName(sent);
      setStatus("sent");
      setName("");
      setMessage("");
    } catch {
      setError(t("errors.generic"));
      setStatus("idle");
    }
  }

  function again() {
    try {
      localStorage.removeItem(answeredKey(slug));
    } catch {
      // Nothing to forget.
    }
    openedAt.current = Date.now();
    setDismissed(true);
    setStatus("idle");
  }

  return (
    <div className="text-left">
      {sent ? (
        <div className="py-4 text-center">
          <p className={`font-serif text-2xl ${p.accent}`}>
            {t("thanks", { name: thanksName })}
          </p>
          <p className={`mt-2 text-sm ${p.muted}`}>{t("thanksText")}</p>
          <button
            type="button"
            onClick={again}
            className={`mt-4 text-sm underline underline-offset-4 ${p.muted}`}
          >
            {t("again")}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <p className={`text-center text-sm ${p.muted}`}>
            {subtitle ?? t("subtitle")}
          </p>
          <label className="flex flex-col gap-1.5">
            <span className={`text-sm ${p.muted}`}>{t("name")}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              autoComplete="name"
              placeholder={t("namePlaceholder")}
              className={`h-12 w-full rounded-2xl px-4 outline-none ${p.input}`}
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className={`mb-1.5 text-sm ${p.muted}`}>
              {t("attending")}
            </legend>
            {[true, false].map((value) => (
              <button
                key={String(value)}
                type="button"
                aria-pressed={attending === value}
                onClick={() => setAttending(value)}
                className={`flex h-12 items-center gap-3 rounded-2xl px-4 text-left text-sm transition-colors ${attending === value ? p.optionOn : p.optionOff}`}
              >
                <span
                  aria-hidden
                  className="flex size-4 shrink-0 items-center justify-center rounded-full border border-current"
                >
                  {attending === value && (
                    <span className="size-2 rounded-full bg-current" />
                  )}
                </span>
                {value ? t("yes") : t("no")}
              </button>
            ))}
          </fieldset>

          {attending && (
            <div className="flex items-center justify-between gap-4">
              <span className={`text-sm ${p.muted}`}>{t("guests")}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="−"
                  disabled={guests <= 1}
                  onClick={() => setGuests((g) => g - 1)}
                  className={`size-10 rounded-full text-lg disabled:opacity-40 ${p.optionOff}`}
                >
                  −
                </button>
                <span
                  className={`w-6 text-center font-serif text-2xl ${p.accent}`}
                >
                  {guests}
                </span>
                <button
                  type="button"
                  aria-label="+"
                  disabled={guests >= 10}
                  onClick={() => setGuests((g) => g + 1)}
                  className={`size-10 rounded-full text-lg disabled:opacity-40 ${p.optionOff}`}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className={`text-sm ${p.muted}`}>{t("wish")}</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={t("wishPlaceholder")}
              className={`w-full resize-none rounded-2xl px-4 py-3 outline-none ${p.input}`}
            />
          </label>

          {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
          <input
            aria-hidden
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute -left-[9999px] size-px opacity-0"
          />

          {error && (
            <p role="alert" className={`text-center text-sm ${p.error}`}>
              {error}
            </p>
          )}
          {preview && (
            <p className={`text-center text-xs ${p.muted}`}>
              {t("previewNote")}
            </p>
          )}
          <button
            type="submit"
            disabled={preview || status === "sending"}
            className={`h-12 rounded-full text-sm font-medium tracking-wide transition-colors disabled:opacity-60 ${p.button}`}
          >
            {status === "sending" ? t("sending") : t("send")}
          </button>
        </form>
      )}
    </div>
  );
}
