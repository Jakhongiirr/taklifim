import { visitSource } from './visit-source';

const CHROME =
  'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';

describe('visitSource', () => {
  it.each([
    ['https://chatgpt.com/', 'chatgpt'],
    ['https://www.google.com/', 'google'],
    ['https://www.google.co.uz/', 'google'],
    ['https://www.google.de/', 'google'],
    ['https://yandex.uz/search/?text=taklifnoma', 'yandex'],
    ['https://ya.ru/', 'yandex'],
    ['https://l.instagram.com/', 'instagram'],
    ['https://m.facebook.com/', 'facebook'],
    ['https://web.telegram.org/', 'telegram'],
    ['https://t.me/taklifim_uz', 'telegram'],
    ['https://www.perplexity.ai/', 'perplexity'],
    ['https://gemini.google.com/', 'gemini'],
    ['android-app://org.telegram.messenger/', 'telegram'],
    ['android-app://com.google.android.googlequicksearchbox/', 'google'],
    ['https://www.someblog.uz/post/1', 'someblog.uz'],
    ['not a url', 'direct'],
    ['file:///home/x.html', 'direct'],
  ])('%s -> %s', (referrer, source) => {
    expect(visitSource({ referrer, userAgent: CHROME })).toBe(source);
  });

  it('is direct with nothing to go on', () => {
    expect(visitSource({ userAgent: CHROME })).toBe('direct');
    expect(visitSource({})).toBe('direct');
  });

  it('knows in-app browsers that send no referrer', () => {
    expect(
      visitSource({
        userAgent: `${CHROME} Instagram 350.0.0.0 Android`,
      }),
    ).toBe('instagram');
    expect(
      visitSource({ userAgent: `${CHROME} Telegram-Android/11.2.0` }),
    ).toBe('telegram');
    expect(
      visitSource({
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 [FBAN/FBIOS;FBAV/450.0]',
      }),
    ).toBe('facebook');
  });

  it('prefers the utm tag, then the app, then the referrer', () => {
    expect(
      visitSource({
        utm: 'chatgpt.com',
        referrer: 'https://www.google.com/',
        userAgent: `${CHROME} Instagram 350.0`,
      }),
    ).toBe('chatgpt');
    expect(
      visitSource({
        referrer: 'https://www.google.com/',
        userAgent: `${CHROME} Instagram 350.0`,
      }),
    ).toBe('instagram');
  });

  it('tidies utm tags', () => {
    expect(visitSource({ utm: 'IG' })).toBe('instagram');
    expect(visitSource({ utm: ' Telegram ' })).toBe('telegram');
    expect(visitSource({ utm: 'https://www.facebook.com' })).toBe('facebook');
    expect(visitSource({ utm: 'bio_link!' })).toBe('bio_link');
    expect(visitSource({ utm: '!!!' })).toBe('direct');
  });
});
