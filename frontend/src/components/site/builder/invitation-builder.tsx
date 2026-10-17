"use client";

import { useTranslations } from "next-intl";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter as useAppRouter } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { api, ApiError, uploadFile } from "@/lib/api-client";
import type { FileDto, Music, Taklif } from "@/lib/api-types";
import {
  formatCardNumber,
  fromTashkentInput,
  toTashkentInput,
} from "@/lib/format";
import { prepareImage } from "@/lib/prepare-image";
import { useTashkentDate } from "@/lib/use-tashkent-date";
import { useConfirm } from "../confirm-dialog";
import DesignPicker from "./design-picker";
import Field, { inputClass, pickerClass } from "./field";
import MusicPicker from "./music-picker";
import PhotoPicker from "./photo-picker";
import type { Design, Photo } from "./types";

type Fields = {
  themeId: string;
  brideName: string;
  groomName: string;
  hostName: string;
  eventAt: string;
  venueName: string;
  venueAddress: string;
  locationUrl: string;
  cardNumber: string;
  phone: string;
  musicId: string;
};
type FieldKey = keyof Fields;
type Errors = Partial<Record<FieldKey, string>>;

// Mirrors the backend's column limits (taklif-fields.ts / taklif.entity.ts).
const MAX_LENGTH: Partial<Record<FieldKey, number>> = {
  brideName: 100,
  groomName: 100,
  hostName: 100,
  venueName: 200,
  venueAddress: 300,
  locationUrl: 500,
};
const REQUIRED: FieldKey[] = [
  "themeId",
  "groomName",
  "brideName",
  "hostName",
  "eventAt",
  "venueName",
  "venueAddress",
];

// Mirrors the backend (event-at-limit.ts): owners set events after now, at
// most this many days ahead.
const MAX_DAYS_AHEAD = 730;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Weddings usually start in the evening. */
const DEFAULT_EVENT_TIME = "18:00";
/** A morning plov ("nahorgi osh") is served early. */
const DEFAULT_OSH_TIME = "06:00";
const latestEventAt = () => new Date(Date.now() + MAX_DAYS_AHEAD * DAY_MS);

const noSubscribe = () => () => {};
/** Today in Tashkent ("2026-10-10"); null on the server, so hydration matches. */
const tashkentToday = () =>
  toTashkentInput(new Date().toISOString()).slice(0, 10);
const noToday = () => null;

const deleteFile = (id: string) =>
  api(`/files/${id}`, { method: "DELETE" }).catch(() => undefined);

/**
 * Creates an invitation (no `taklif`) or edits one. New photos are uploaded on
 * save and deleted again if saving fails; photos removed from an existing
 * invitation are deleted by the backend. Ends on the invitation's preview.
 */
export default function InvitationBuilder({
  designs,
  tracks,
  taklif,
  initialThemeId,
}: {
  designs: Design[];
  tracks: Music[];
  taklif?: Taklif;
  initialThemeId?: string;
}) {
  const t = useTranslations("Builder");
  const router = useRouter();
  // For hrefs that already carry the locale (from links on the page).
  const appRouter = useAppRouter();
  const { confirm, dialog } = useConfirm();
  const [fields, setFields] = useState<Fields>({
    themeId: taklif?.theme.id ?? initialThemeId ?? "",
    brideName: taklif?.brideName ?? "",
    groomName: taklif?.groomName ?? "",
    hostName: taklif?.hostName ?? "",
    eventAt: taklif ? toTashkentInput(taklif.eventAt) : "",
    venueName: taklif?.venueName ?? "",
    venueAddress: taklif?.venueAddress ?? "",
    locationUrl: taklif?.locationUrl ?? "",
    cardNumber: taklif?.cardNumber ? formatCardNumber(taklif.cardNumber) : "",
    phone: taklif?.phone ?? "",
    musicId: taklif?.music?.id ?? "",
  });
  // The plov design is an osh, not a wedding party: its own wording.
  const osh =
    designs.find((design) => design.id === fields.themeId)?.key === "plov";
  // The event's time of day, kept while no date is picked yet: weddings
  // usually start in the evening, so a new invitation starts at 18:00 (an
  // osh at 06:00).
  const [eventTime, setEventTime] = useState(
    taklif
      ? toTashkentInput(taklif.eventAt).slice(11, 16)
      : osh
        ? DEFAULT_OSH_TIME
        : DEFAULT_EVENT_TIME,
  );
  const eventDate = fields.eventAt.slice(0, 10);
  const [photos, setPhotos] = useState<Photo[]>(
    taklif?.photos.map((file) => ({ key: file.id, existing: file })) ?? [],
  );
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [progress, setProgress] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const when = useTashkentDate();
  // A published invitation's date can change 5 times in all (backend rule).
  const changesLeft = taklif?.eventAtChangesLeft ?? null;
  // Bounds for the date picker (the real check is in validate()).
  const today = useSyncExternalStore(noSubscribe, tashkentToday, noToday);
  const rangeError = () =>
    t("errors.eventRange", { date: when(latestEventAt()) });

  // Warn before leaving with unsaved changes. Reloading, closing the tab and
  // going to another site only allow the browser's own prompt; links within
  // the site navigate without unloading, so those ask with our dialog.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    const onClick = async (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return; // opens in a new tab: nothing is lost
      }
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") {
        return;
      }
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return; // beforeunload asks
      // Capture phase on document: runs before the Link's own handler.
      e.preventDefault();
      e.stopPropagation();
      const leave = await confirm({
        title: t("leave.title"),
        message: t("leave.text"),
        confirmLabel: t("leave.confirm"),
        cancelLabel: t("leave.cancel"),
      });
      if (!leave) return;
      setDirty(false);
      appRouter.push(url.pathname + url.search + url.hash);
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty, confirm, appRouter, t]);

  // Preview URLs of picked photos are released on unmount.
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

  function set<K extends FieldKey>(key: K, value: Fields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setDirty(true);
  }
  const input = (key: FieldKey) => ({
    value: fields[key],
    onChange: (e: { target: { value: string } }) => set(key, e.target.value),
    "aria-invalid": !!errors[key],
    name: key,
  });

  function validate(): Errors {
    const found: Errors = {};
    for (const key of REQUIRED) {
      if (!fields[key].trim()) {
        found[key] =
          key === "themeId" ? t("errors.design") : t("errors.required");
      }
    }
    for (const [key, max] of Object.entries(MAX_LENGTH) as [
      FieldKey,
      number,
    ][]) {
      if (!found[key] && fields[key].trim().length > max) {
        found[key] = t("errors.tooLong");
      }
    }
    const url = fields.locationUrl.trim();
    if (
      url &&
      !found.locationUrl &&
      !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(url)
    ) {
      found.locationUrl = t("errors.url");
    }
    // Only a new date: an invitation whose event has passed stays editable.
    const eventChanged =
      !taklif || fields.eventAt !== toTashkentInput(taklif.eventAt);
    if (fields.eventAt && eventChanged) {
      // NaN (an unparseable date) fails both comparisons, so it's caught too.
      const at = new Date(fromTashkentInput(fields.eventAt)).getTime();
      if (!(at > Date.now() && at <= latestEventAt().getTime())) {
        found.eventAt = rangeError();
      }
    }
    if (changesLeft === 0 && fields.eventAt && eventChanged) {
      found.eventAt = t("errors.postpone");
    }
    const card = fields.cardNumber.replace(/[\s-]/g, "");
    if (card && !/^\d{16}$/.test(card)) found.cardNumber = t("errors.card");
    const phoneDigits = fields.phone.replace(/\D/g, "");
    if (
      fields.phone.trim() &&
      (phoneDigits.length < 9 || phoneDigits.length > 15)
    ) {
      found.phone = t("errors.phone");
    }
    return found;
  }

  function showErrors(found: Errors) {
    setErrors(found);
    setFormError(t("errors.form"));
    // Bring the first problem into view (the design picker has no input).
    const first = Object.keys(found)[0];
    const el = form.current?.querySelector<HTMLElement>(
      first === "themeId" ? "#section-design" : `[name="${first}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el instanceof HTMLInputElement) el.focus({ preventScroll: true });
  }

  /** Maps a backend rejection to field errors where we can tell the field. */
  function showApiError(error: unknown) {
    if (!(error instanceof ApiError)) return setFormError(t("errors.generic"));
    if (error.status === 409 && !taklif && /draft/i.test(error.message)) {
      return setFormError(t("errors.draftLimit"));
    }
    if (
      /^eventAt (must be in the future|can be .* days ahead)/.test(
        error.message,
      )
    ) {
      return showErrors({ eventAt: rangeError() });
    }
    if (/^eventAt can change at most/.test(error.message)) {
      return showErrors({ eventAt: t("errors.postpone") });
    }
    if (error.code === "VALIDATION_FAILED" && Array.isArray(error.details)) {
      const found: Errors = {};
      for (const detail of error.details as string[]) {
        const key = detail.split(" ")[0] as FieldKey;
        if (key === "phone") found.phone = t("errors.phone");
        else if (key === "cardNumber") found.cardNumber = t("errors.card");
        else if (key === "locationUrl") found.locationUrl = t("errors.url");
        else if (key in fields) found[key] = t("errors.required");
      }
      if (Object.keys(found).length) return showErrors(found);
    }
    setFormError(t("errors.generic"));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const found = validate();
    if (Object.keys(found).length) return showErrors(found);

    const uploaded: FileDto[] = [];
    try {
      const photoIds: string[] = [];
      const total = photos.filter((p) => "file" in p).length;
      for (const photo of photos) {
        if ("existing" in photo) {
          photoIds.push(photo.existing.id);
          continue;
        }
        setProgress(t("save.uploading", { index: uploaded.length + 1, total }));
        let file: FileDto;
        try {
          file = await uploadFile(await prepareImage(photo.file));
        } catch (err) {
          // Upload errors get their own message, not a field mapping.
          throw Object.assign(new Error("upload"), { cause: err });
        }
        uploaded.push(file);
        photoIds.push(file.id);
      }

      setProgress(t("save.saving"));
      const card = fields.cardNumber.replace(/[\s-]/g, "");
      const phone = fields.phone.trim();
      const body = {
        themeId: fields.themeId,
        brideName: fields.brideName.trim(),
        groomName: fields.groomName.trim(),
        hostName: fields.hostName.trim(),
        eventAt: fromTashkentInput(fields.eventAt),
        venueName: fields.venueName.trim(),
        venueAddress: fields.venueAddress.trim(),
        // Optional: empty saves as none (and clears an earlier one).
        locationUrl: fields.locationUrl.trim() || null,
      };

      let saved: Taklif;
      if (taklif) {
        const photosChanged =
          photoIds.join() !== taklif.photos.map((p) => p.id).join();
        saved = await api<Taklif>(`/taklif/${taklif.id}`, {
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
        saved = await api<Taklif>("/taklif", {
          method: "POST",
          json: {
            ...body,
            ...(card && { cardNumber: card }),
            ...(phone && { phone }),
            ...(fields.musicId && { musicId: fields.musicId }),
            ...(photoIds.length && { photoIds }),
          },
        });
      }
      setDirty(false);
      router.push(`/taklif/${saved.slug}/preview`);
    } catch (err) {
      await Promise.all(uploaded.map((file) => deleteFile(file.id)));
      setProgress(null);
      if (err instanceof Error && err.message === "upload") {
        setFormError(t("errors.upload"));
      } else {
        showApiError(err);
      }
    }
  }

  const busy = progress !== null;

  return (
    <form ref={form} onSubmit={save} noValidate className="pb-32">
      {dialog}
      {/* min-w-0: a fieldset is as wide as its content by default, so the
          design picker's scrolling row would widen the whole page. */}
      <fieldset disabled={busy} className="flex min-w-0 flex-col gap-4">
        <Section n={1} title={t("sections.design")} id="section-design">
          <DesignPicker
            designs={designs}
            value={fields.themeId}
            onChange={(id) => set("themeId", id)}
            locked={!!taklif?.paidAt}
          />
          {errors.themeId && (
            <p className="mt-2 text-sm text-red-700">{errors.themeId}</p>
          )}
        </Section>

        <Section
          n={2}
          title={t(osh ? "osh.sections.couple" : "sections.couple")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("fields.groomName")} error={errors.groomName}>
              <input
                className={inputClass}
                autoComplete="off"
                {...input("groomName")}
              />
            </Field>
            <Field label={t("fields.brideName")} error={errors.brideName}>
              <input
                className={inputClass}
                autoComplete="off"
                {...input("brideName")}
              />
            </Field>
          </div>
          <Field
            label={t(osh ? "osh.fields.hostName" : "fields.hostName")}
            hint={t(osh ? "osh.fields.hostHint" : "fields.hostHint")}
            error={errors.hostName}
          >
            <input
              className={inputClass}
              autoComplete="off"
              {...input("hostName")}
            />
          </Field>
        </Section>

        <Section n={3} title={t(osh ? "osh.sections.event" : "sections.event")}>
          <Field
            label={t(osh ? "osh.fields.eventAt" : "fields.eventAt")}
            hint={
              changesLeft !== null
                ? `${t(osh ? "osh.fields.eventHint" : "fields.eventHint")}. ${t("fields.eventChangesHint", { count: changesLeft })}`
                : t(osh ? "osh.fields.eventHint" : "fields.eventHint")
            }
            error={errors.eventAt}
          >
            {/* Date and time apart, so the time can start at 18:00 (a
                datetime picker's clock can't be given a default). */}
            {/* inputClass is full width: the wrappers size them. */}
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <input
                  className={pickerClass}
                  type="date"
                  name="eventAt"
                  aria-invalid={!!errors.eventAt}
                  min={today || undefined}
                  max={
                    today
                      ? toTashkentInput(latestEventAt().toISOString()).slice(
                          0,
                          10,
                        )
                      : undefined
                  }
                  value={eventDate}
                  onChange={(e) =>
                    set(
                      "eventAt",
                      e.target.value && eventTime
                        ? `${e.target.value}T${eventTime}`
                        : "",
                    )
                  }
                />
              </div>
              <div className="w-32 shrink-0">
                <input
                  className={pickerClass}
                  type="time"
                  aria-label={t("fields.eventTime")}
                  aria-invalid={!!errors.eventAt}
                  value={eventTime}
                  onChange={(e) => {
                    setEventTime(e.target.value);
                    if (eventDate) {
                      set(
                        "eventAt",
                        e.target.value ? `${eventDate}T${e.target.value}` : "",
                      );
                    }
                  }}
                />
              </div>
            </div>
          </Field>
          <Field
            label={t(osh ? "osh.fields.venueName" : "fields.venueName")}
            error={errors.venueName}
          >
            <input className={inputClass} {...input("venueName")} />
          </Field>
          <Field label={t("fields.venueAddress")} error={errors.venueAddress}>
            <input
              className={inputClass}
              autoComplete="street-address"
              {...input("venueAddress")}
            />
          </Field>
          <Field
            label={t("fields.locationUrl")}
            hint={t("fields.locationHint")}
            error={errors.locationUrl}
          >
            <input
              className={inputClass}
              type="url"
              inputMode="url"
              placeholder="https://maps.app.goo.gl/…"
              {...input("locationUrl")}
            />
          </Field>
        </Section>

        <Section n={4} title={t("sections.photos")}>
          <PhotoPicker
            photos={photos}
            onChange={(next) => {
              setPhotos(next);
              setDirty(true);
              setFormError("");
            }}
            onError={setFormError}
          />
        </Section>

        <Section n={5} title={t("sections.music")}>
          <MusicPicker
            tracks={tracks}
            value={fields.musicId}
            onChange={(id) => set("musicId", id)}
          />
        </Section>

        <Section n={6} title={t("sections.extras")}>
          <Field
            label={t("fields.cardNumber")}
            hint={t("fields.cardHint")}
            error={errors.cardNumber}
          >
            <input
              className={`${inputClass} font-mono tracking-wider`}
              inputMode="numeric"
              autoComplete="off"
              placeholder="8600 0000 0000 0000"
              maxLength={19}
              {...input("cardNumber")}
              onChange={(e) =>
                set(
                  "cardNumber",
                  formatCardNumber(
                    e.target.value.replace(/\D/g, "").slice(0, 16),
                  ),
                )
              }
            />
          </Field>
          <Field
            label={t("fields.phone")}
            hint={t("fields.phoneHint")}
            error={errors.phone}
          >
            <input
              className={inputClass}
              type="tel"
              autoComplete="tel"
              placeholder="+998 90 123 45 67"
              {...input("phone")}
            />
          </Field>
        </Section>
      </fieldset>

      {/* Always in reach on a phone. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          {formError && (
            <p role="alert" className="text-sm text-red-700">
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-12 items-center justify-center rounded-full bg-sage font-medium text-paper transition-colors hover:bg-sage-dark disabled:opacity-70"
          >
            {busy && (
              <span className="mr-2 size-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
            )}
            {progress ?? (taklif ? t("save.edit") : t("save.create"))}
          </button>
        </div>
      </div>
    </form>
  );
}

function Section({
  n,
  title,
  id,
  children,
}: {
  n: number;
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex scroll-mt-24 flex-col gap-4 rounded-3xl bg-white/70 p-4 ring-1 ring-line sm:p-6"
    >
      <h2 className="flex items-center gap-3 font-serif text-2xl text-ink">
        <span className="flex size-7 items-center justify-center rounded-full bg-cream font-sans text-xs font-medium text-gold ring-1 ring-line">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
