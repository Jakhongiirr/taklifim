// The sample invitation every design's built-in demo shows
// (/[locale]/designs/<themeId>/demo): made-up couple, venue and wishes, in
// every site language. Nothing here is a real person or a real card.

import type { Music, PublicTaklif, PublicWish } from "@/lib/api-types";
import { routing } from "@/i18n/routing";

interface DemoCopy {
  brideName: string;
  groomName: string;
  hostName: string;
  venueName: string;
  venueAddress: string;
  wishes: { name: string; message: string; liked: boolean }[];
}

const COPY: Record<string, DemoCopy> = {
  uz: {
    brideName: "Madina",
    groomName: "Jasur",
    hostName: "Karimovlar oilasi",
    venueName: "“Navroʻz” toʻyxonasi",
    venueAddress: "Toshkent sh., Yunusobod tumani, Amir Temur koʻchasi",
    wishes: [
      {
        name: "Dilnoza",
        message: "Baxtingiz abadiy boʻlsin! Bir umr qoʻsha qaringlar.",
        liked: true,
      },
      {
        name: "Sardor",
        message: "Tabriklayman, doʻstim! Oilangizga tinchlik va farovonlik.",
        liked: false,
      },
      {
        name: "Nigora opa",
        message: "Yangi oilangizga mehr-muhabbat va qut-baraka tilayman.",
        liked: false,
      },
    ],
  },
  ru: {
    brideName: "Мадина",
    groomName: "Жасур",
    hostName: "Семья Каримовых",
    venueName: "Ресторан «Навруз»",
    venueAddress: "г. Ташкент, Юнусабадский район, ул. Амира Темура",
    wishes: [
      {
        name: "Дилноза",
        message: "Счастья вам навсегда! Состариться вместе.",
        liked: true,
      },
      {
        name: "Сардор",
        message: "Поздравляю, друг! Мира и благополучия вашей семье.",
        liked: false,
      },
      {
        name: "Нигора опа",
        message: "Желаю вашей новой семье любви, тепла и достатка.",
        liked: false,
      },
    ],
  },
  en: {
    brideName: "Madina",
    groomName: "Jasur",
    hostName: "The Karimov family",
    venueName: "Navruz Banquet Hall",
    venueAddress: "Amir Temur Street, Yunusabad district, Tashkent",
    wishes: [
      {
        name: "Dilnoza",
        message: "Wishing you happiness forever! Grow old together.",
        liked: true,
      },
      {
        name: "Sardor",
        message:
          "Congratulations, my friend! Peace and prosperity to you both.",
        liked: false,
      },
      {
        name: "Aunt Nigora",
        message: "Love, warmth and plenty to your new family.",
        liked: false,
      },
    ],
  },
};

const DAY_MS = 24 * 60 * 60 * 1000;
const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000;

/**
 * A Saturday at 18:00 Tashkent time, about two months ahead, so the
 * countdown always has something to count. It moves on once that Saturday
 * is closer than 60 days, i.e. weekly.
 */
function sampleEventAt(now = Date.now()) {
  // Midnight in Tashkent, 60 days on, as a UTC timestamp.
  const local = new Date(now + TASHKENT_OFFSET_MS + 60 * DAY_MS);
  local.setUTCHours(0, 0, 0, 0);
  const toSaturday = (6 - local.getUTCDay() + 7) % 7;
  const at = local.getTime() + toSaturday * DAY_MS + 18 * 60 * 60 * 1000;
  return new Date(at - TASHKENT_OFFSET_MS).toISOString();
}

const copyFor = (locale: string) => COPY[locale] ?? COPY[routing.defaultLocale];

/** The sample invitation in `themeId`'s design, with `music` if there is one. */
export function demoInvitation(
  themeId: string,
  locale: string,
  music: Music | null,
): PublicTaklif {
  const copy = copyFor(locale);
  return {
    slug: `demo-${themeId}`,
    brideName: copy.brideName,
    groomName: copy.groomName,
    hostName: copy.hostName,
    eventAt: sampleEventAt(),
    venueName: copy.venueName,
    venueAddress: copy.venueAddress,
    locationUrl: "https://yandex.uz/maps/10335/tashkent/",
    photos: [],
    // An obviously made-up card and phone; only shown, never used.
    cardNumber: "8600123456789012",
    phone: "+998901234567",
    music: music && {
      title: music.title,
      artist: music.artist,
      file: { url: music.file.url },
    },
    theme: { themeId },
  };
}

/** The wishes the demo's RSVP section shows. */
export function demoWishes(locale: string): PublicWish[] {
  return copyFor(locale).wishes.map((wish, i) => ({
    id: `demo-${i}`,
    createdAt: new Date(0).toISOString(),
    ...wish,
  }));
}
