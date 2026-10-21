/** Where a visitor came from: one of these, or another site's domain. */
export const DIRECT = 'direct';

// Referrer domains (and their subdomains) by source; checked in order.
const SITES: [source: string, domains: string[]][] = [
  ['chatgpt', ['chatgpt.com', 'chat.openai.com', 'openai.com']],
  ['perplexity', ['perplexity.ai']],
  ['gemini', ['gemini.google.com', 'bard.google.com']],
  ['claude', ['claude.ai']],
  ['copilot', ['copilot.microsoft.com']],
  ['deepseek', ['deepseek.com']],
  ['google', ['google.com', 'google.co.uz', 'google.ru', 'googleapis.com']],
  ['yandex', ['yandex.ru', 'yandex.uz', 'yandex.com', 'ya.ru']],
  ['bing', ['bing.com']],
  ['telegram', ['t.me', 'telegram.org', 'telegram.me']],
  ['instagram', ['instagram.com']],
  ['facebook', ['facebook.com', 'fb.com', 'messenger.com']],
  ['youtube', ['youtube.com', 'youtu.be']],
  ['tiktok', ['tiktok.com']],
  ['twitter', ['x.com', 'twitter.com', 't.co']],
  ['vk', ['vk.com', 'vk.ru']],
  ['whatsapp', ['whatsapp.com', 'wa.me']],
];

// In-app browsers that usually send no referrer, by their user agent.
const APPS: [source: string, pattern: RegExp][] = [
  ['instagram', /\bInstagram\b/i],
  ['facebook', /\bFB(?:AN|AV|_IAB)\b|\bFBIOS\b/],
  ['telegram', /\bTelegram/i],
  ['tiktok', /\b(?:musical_ly|TikTok|BytedanceWebview)\b/i],
  ['whatsapp', /\bWhatsApp\b/i],
];

// Android apps that open links in Chrome name themselves in the referrer
// (android-app://org.telegram.messenger/).
const ANDROID_APPS: Record<string, string> = {
  'org.telegram.messenger': 'telegram',
  'org.telegram.plus': 'telegram',
  'org.thunderdog.challegram': 'telegram',
  'com.instagram.android': 'instagram',
  'com.facebook.katana': 'facebook',
  'com.facebook.orca': 'facebook',
  'com.whatsapp': 'whatsapp',
  'com.google.android.googlequicksearchbox': 'google',
  'com.google.android.gm': 'gmail',
  'com.openai.chatgpt': 'chatgpt',
  'com.google.android.youtube': 'youtube',
  'com.zhiliaoapp.musically': 'tiktok',
  'ru.yandex.searchplugin': 'yandex',
};

// Short or odd utm_source values people use, mapped to a source.
const UTM_ALIASES: Record<string, string> = {
  ig: 'instagram',
  insta: 'instagram',
  fb: 'facebook',
  tg: 'telegram',
  yt: 'youtube',
  wa: 'whatsapp',
  openai: 'chatgpt',
};

function siteSource(host: string) {
  for (const [source, domains] of SITES) {
    if (domains.some((d) => host === d || host.endsWith(`.${d}`))) {
      return source;
    }
  }
  // Country Google and Yandex domains (google.de, yandex.kz, ...).
  if (/(?:^|\.)google\.[a-z.]+$/.test(host)) return 'google';
  if (/(?:^|\.)yandex\.[a-z.]+$/.test(host)) return 'yandex';
  return undefined;
}

/**
 * Names the source of a visit from the page's `utm_source` (or `ref`), the
 * in-app browser it opened in, or the referring site, in that order. Links
 * from apps like Telegram or WhatsApp often carry nothing at all: those are
 * "direct", same as typing the address.
 */
export function visitSource({
  utm,
  referrer,
  userAgent,
}: {
  utm?: string;
  referrer?: string;
  userAgent?: string;
}): string {
  const tag = utm
    ?.trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 40);
  if (tag) return UTM_ALIASES[tag] ?? siteSource(tag) ?? tag;

  if (userAgent) {
    const app = APPS.find(([, pattern]) => pattern.test(userAgent));
    if (app) return app[0];
  }

  if (referrer) {
    let url: URL;
    try {
      url = new URL(referrer);
    } catch {
      return DIRECT;
    }
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (url.protocol === 'android-app:') {
      return ANDROID_APPS[host] ?? host.slice(0, 64);
    }
    if (!/^https?:$/.test(url.protocol) || !host.includes('.')) return DIRECT;
    return siteSource(host) ?? host.slice(0, 64);
  }
  return DIRECT;
}
