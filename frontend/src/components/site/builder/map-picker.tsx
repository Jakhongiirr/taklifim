"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  type Pin,
  TASHKENT,
  yandexEmbedUrl,
  yandexLang,
} from "@/lib/venue-map";

// Just the parts of the Yandex Maps JS API 2.1 used here.
type Coords = [number, number]; // [lat, lng]
type YEvents = {
  add(type: string, listener: (e: { get(key: string): unknown }) => void): void;
};
type YGeoObject = {
  geometry: { getCoordinates(): Coords; setCoordinates(c: Coords): void };
  events: YEvents;
  getAddressLine?(): string;
};
type YMap = {
  events: YEvents;
  geoObjects: { add(object: YGeoObject): void };
  controls: { add(control: unknown): void };
  setCenter(center: Coords, zoom?: number): void;
  destroy(): void;
};
type YSearchControl = {
  events: YEvents;
  getResult(index: number): Promise<YGeoObject>;
};
type YMaps = {
  ready(callback: () => void, errback?: (err: unknown) => void): void;
  Map: new (el: HTMLElement, state: object, options?: object) => YMap;
  Placemark: new (at: Coords, props: object, options: object) => YGeoObject;
  control: { SearchControl: new (params: object) => YSearchControl };
  geocode(
    at: Coords,
    options: object,
  ): Promise<{ geoObjects: { get(index: number): YGeoObject | undefined } }>;
};

export type MapKeys = { apiKey: string; suggestKey?: string };

let loading: Promise<YMaps> | null = null;
/** Loads the API once per page; a failed load can be retried. */
function loadYandexMaps({ apiKey, suggestKey }: MapKeys, locale: string) {
  loading ??= new Promise<YMaps>((resolve, reject) => {
    const query = new URLSearchParams({
      apikey: apiKey,
      lang: yandexLang(locale),
    });
    if (suggestKey) query.set("suggest_apikey", suggestKey);
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?${query}`;
    script.async = true;
    script.onload = () => {
      const ymaps = (window as unknown as { ymaps?: YMaps }).ymaps;
      if (ymaps) ymaps.ready(() => resolve(ymaps), reject);
      else reject(new Error("ymaps missing"));
    };
    script.onerror = reject;
    document.head.append(script);
  }).catch((err) => {
    loading = null;
    throw err;
  });
  return loading;
}

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * The venue's pin: a preview with change/remove, or a button that opens a
 * full-screen Yandex map. The map starts on the saved pin, else where the
 * owner stands (they're often at the venue), else Tashkent. `address` is the
 * pin's street address, for an empty address field.
 */
export default function MapPicker({
  keys,
  value,
  onChange,
}: {
  keys: MapKeys;
  value: Pin | null;
  onChange: (pin: Pin | null, address?: string) => void;
}) {
  const t = useTranslations("Builder.map");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">{t("label")}</span>
      {value ? (
        <div className="overflow-hidden rounded-2xl ring-1 ring-line">
          {/* Only a preview: moving the pin happens in the picker. */}
          <iframe
            src={yandexEmbedUrl(value, locale)}
            title={t("label")}
            tabIndex={-1}
            className="pointer-events-none block aspect-[16/9] w-full border-0"
          />
          <div className="flex gap-2 border-t border-line bg-white p-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="h-10 flex-1 rounded-full bg-cream text-sm font-medium text-ink ring-1 ring-line hover:bg-white"
            >
              {t("change")}
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="h-10 rounded-full px-4 text-sm text-muted hover:text-red-700"
            >
              {t("remove")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-dashed border-sage bg-white text-base font-medium text-sage-dark hover:bg-cream"
        >
          <PinIcon />
          {t("choose")}
        </button>
      )}
      <span className="text-sm text-muted">{t("hint")}</span>
      {open &&
        createPortal(
          <PickerDialog
            keys={keys}
            initial={value}
            onClose={() => setOpen(false)}
            onPick={(pin, address) => {
              setOpen(false);
              onChange(pin, address);
            }}
          />,
          // Outside the builder's <form>: Enter in the map's search box
          // mustn't submit the invitation.
          document.body,
        )}
    </div>
  );
}

function PickerDialog({
  keys,
  initial,
  onClose,
  onPick,
}: {
  keys: MapKeys;
  initial: Pin | null;
  onClose: () => void;
  onPick: (pin: Pin, address?: string) => void;
}) {
  const t = useTranslations("Builder.map");
  const locale = useLocale();
  const box = useRef<HTMLDivElement>(null);
  const ymapsRef = useRef<YMaps | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [pin, setPin] = useState<Pin | null>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const scroll = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = scroll;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    let map: YMap | null = null;
    let cancelled = false;
    // The owner hasn't placed the pin themselves yet (their location may).
    let touched = !!initial;

    loadYandexMaps(keys, locale).then(
      (ymaps) => {
        if (cancelled || !box.current) return;
        ymapsRef.current = ymaps;
        const start = initial ?? TASHKENT;
        map = new ymaps.Map(
          box.current,
          {
            center: [start.lat, start.lng],
            zoom: initial ? 17 : 12,
            controls: ["zoomControl", "geolocationControl"],
          },
          { suppressMapOpenBlock: true },
        );
        const search = new ymaps.control.SearchControl({
          options: { noPlacemark: true, float: "left" },
        });
        map.controls.add(search);

        let mark: YGeoObject | null = null;
        const place = (at: Coords) => {
          if (!mark) {
            mark = new ymaps.Placemark(
              at,
              {},
              { draggable: true, preset: "islands#redDotIcon" },
            );
            mark.events.add("dragend", () => {
              touched = true;
              const [lat, lng] = mark!.geometry.getCoordinates();
              setPin({ lat, lng });
            });
            map!.geoObjects.add(mark);
          } else {
            mark.geometry.setCoordinates(at);
          }
          setPin({ lat: at[0], lng: at[1] });
        };
        if (initial) place([initial.lat, initial.lng]);

        map.events.add("click", (e) => {
          touched = true;
          place(e.get("coords") as Coords);
        });
        search.events.add("resultselect", (e) => {
          search.getResult(e.get("index") as number).then((found) => {
            if (cancelled) return;
            touched = true;
            const at = found.geometry.getCoordinates();
            place(at);
            map?.setCenter(at, 17);
          });
        });
        setState("ready");

        if (!initial && "geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              if (cancelled || touched) return;
              const at: Coords = [coords.latitude, coords.longitude];
              map?.setCenter(at, 17);
              place(at);
            },
            () => {}, // denied or unavailable: stays on Tashkent
            { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
          );
        }
      },
      () => !cancelled && setState("failed"),
    );
    return () => {
      cancelled = true;
      map?.destroy();
    };
  }, [keys, locale, initial]);

  async function confirm() {
    if (!pin) return;
    const picked = { lat: round(pin.lat), lng: round(pin.lng) };
    setSaving(true);
    let address: string | undefined;
    try {
      const result = await ymapsRef.current?.geocode([pin.lat, pin.lng], {
        results: 1,
      });
      address = result?.geoObjects.get(0)?.getAddressLine?.();
    } catch {
      // The address is only a convenience.
    }
    onPick(picked, address);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      className="fixed inset-0 z-50 flex flex-col bg-paper"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="font-serif text-2xl text-ink">{t("title")}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("cancel")}
          className="flex size-10 items-center justify-center rounded-full text-2xl text-muted hover:bg-cream hover:text-ink"
        >
          ×
        </button>
      </div>
      <div className="relative flex-1">
        <div ref={box} className="absolute inset-0" />
        {state !== "ready" && (
          <p
            role={state === "failed" ? "alert" : undefined}
            className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted"
          >
            {t(state === "failed" ? "failed" : "loading")}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="text-sm text-muted">{t("tapHint")}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full px-5 text-sm text-muted ring-1 ring-line hover:text-ink"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={!pin || saving || state !== "ready"}
            className="h-12 flex-1 rounded-full bg-sage font-medium text-paper transition-colors hover:bg-sage-dark disabled:opacity-50"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
