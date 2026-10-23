import type { ConfigService } from '@nestjs/config';
import type Redis from 'ioredis';
import type {
  TelegramBotService,
  TelegramUpdate,
} from '../telegram/telegram-bot.service';
import type { AuthService } from './auth.service';
import { TelegramLoginService } from './telegram-login.service';

// Jest can't load @nestjs/config (ESM); the service only needs get/getOrThrow.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));
// Its imports are ESM too; a stub logs in instead.
jest.mock('./auth.service', () => ({ AuthService: class {} }));

/** The few Redis commands the service uses, in memory (TTLs ignored). */
function fakeRedis() {
  const data = new Map<string, string | Record<string, string>>();
  const commands = {
    hset: (key: string, fields: Record<string, string>) => {
      const hash = (data.get(key) as Record<string, string>) ?? {};
      data.set(key, { ...hash, ...fields });
      return Promise.resolve(1);
    },
    hgetall: (key: string) =>
      Promise.resolve({ ...((data.get(key) as Record<string, string>) ?? {}) }),
    expire: () => Promise.resolve(1),
    set: (key: string, value: string) => {
      data.set(key, value);
      return Promise.resolve('OK');
    },
    get: (key: string) => Promise.resolve((data.get(key) as string) ?? null),
    del: (key: string) => Promise.resolve(data.delete(key) ? 1 : 0),
    getdel: (key: string) => {
      const value = (data.get(key) as string) ?? null;
      data.delete(key);
      return Promise.resolve(value);
    },
  };
  const multi = () => {
    const queued: (() => Promise<unknown>)[] = [];
    const chain = new Proxy(
      {},
      {
        get: (_, name: string) =>
          name === 'exec'
            ? async () => {
                for (const run of queued) await run();
                return [];
              }
            : (...args: unknown[]) => {
                queued.push(() =>
                  (
                    commands as Record<
                      string,
                      (...a: unknown[]) => Promise<unknown>
                    >
                  )[name](...args),
                );
                return chain;
              },
      },
    );
    return chain;
  };
  return { ...commands, multi } as unknown as Redis;
}

describe('TelegramLoginService', () => {
  const ALICE = 111;
  const MALLORY = 222;
  let service: TelegramLoginService;
  let handle: (update: TelegramUpdate) => Promise<void>;
  let sent: { chat: number; text: string; markup?: unknown }[];
  let loginWithPhone: jest.Mock;
  let connectTelegram: jest.Mock;

  beforeEach(() => {
    sent = [];
    const bot = {
      enabled: true,
      startLink: (token: string) => `https://t.me/TestBot?start=${token}`,
      onUpdate: (h: typeof handle) => (handle = h),
      sendMessage: (chat: number, text: string, markup?: unknown) => {
        sent.push({ chat, text, markup });
        return Promise.resolve();
      },
    } as unknown as TelegramBotService;
    loginWithPhone = jest.fn((phone: string) =>
      Promise.resolve({ user: { phone }, accessToken: 'a', refreshToken: 'r' }),
    );
    connectTelegram = jest.fn(() => Promise.resolve());
    const values: Record<string, string> = {
      siteUrl: 'https://taklifim.uz',
      nodeEnv: 'production',
    };
    const config = {
      get: (key: string) => values[key],
      getOrThrow: (key: string) => values[key],
    } as unknown as ConfigService;
    service = new TelegramLoginService(
      bot,
      { loginWithPhone, connectTelegram } as unknown as AuthService,
      fakeRedis(),
      config,
    );
    service.onModuleInit();
  });

  const message = (
    from: number,
    fields: NonNullable<TelegramUpdate['message']> extends infer M
      ? Partial<M>
      : never,
  ) =>
    handle({
      update_id: 1,
      message: {
        chat: { id: from, type: 'private' },
        from: { id: from },
        ...fields,
      },
    });

  it('logs in once the user shares their own number', async () => {
    const { token, secret, url } = await service.start('en');
    expect(url).toBe(`https://t.me/TestBot?start=${token}`);
    expect(await service.check(token, secret)).toEqual({ status: 'pending' });

    await message(ALICE, { text: `/start ${token}` });
    expect(sent.at(-1)?.text).toContain('taklifim.uz');
    expect(sent.at(-1)?.markup).toMatchObject({
      keyboard: [[{ request_contact: true }]],
    });

    await message(ALICE, {
      contact: { phone_number: '998901234567', user_id: ALICE },
    });
    expect(sent.at(-1)?.text).toContain('Done');

    const result = await service.check(token, secret);
    expect(result.status).toBe('done');
    expect(loginWithPhone).toHaveBeenCalledWith('+998901234567', {
      id: '111',
      locale: 'en',
    });
    // Used up.
    expect(await service.check(token, secret)).toEqual({ status: 'expired' });
  });

  it('rejects a contact that is not the sender’s own', async () => {
    const { token, secret } = await service.start('en');
    await message(ALICE, { text: `/start ${token}` });
    await message(ALICE, {
      contact: { phone_number: '+998901112233', user_id: MALLORY },
    });
    expect(sent.at(-1)?.text).toContain('your own number');
    expect(await service.check(token, secret)).toEqual({ status: 'pending' });
  });

  it('keeps a link to the first Telegram account that opened it', async () => {
    const { token, secret } = await service.start('en');
    await message(ALICE, { text: `/start ${token}` });
    await message(MALLORY, { text: `/start ${token}` });
    expect(sent.at(-1)?.text).toContain('another Telegram account');
    await message(MALLORY, {
      contact: { phone_number: '+998901112233', user_id: MALLORY },
    });
    expect(await service.check(token, secret)).toEqual({ status: 'pending' });
  });

  it('needs the secret, not just the token from the link', async () => {
    const { token } = await service.start('en');
    await expect(service.check(token, 'wrong')).rejects.toThrow(
      'Invalid login',
    );
  });

  it('ignores contacts shared in groups', async () => {
    const { token, secret } = await service.start('en');
    await message(ALICE, { text: `/start ${token}` });
    await handle({
      update_id: 2,
      message: {
        chat: { id: -5, type: 'group' },
        from: { id: ALICE },
        contact: { phone_number: '+998901234567', user_id: ALICE },
      },
    });
    expect(await service.check(token, secret)).toEqual({ status: 'pending' });
  });

  it('answers an unknown or expired link, in Uzbek by default', async () => {
    await message(ALICE, { text: '/start nosuchtoken12345678' });
    expect(sent.at(-1)?.text).toContain('muddati tugagan');
  });

  it('greets in the user’s language without a link', async () => {
    await message(ALICE, {
      text: '/start',
      from: { id: ALICE, language_code: 'ru' },
    });
    expect(sent.at(-1)?.text).toContain('Через этого бота');
  });

  it('connects a logged-in user’s Telegram when they press Start', async () => {
    const { url } = await service.startConnect('user-1', 'ru');
    const parameter = /start=(\S+)$/.exec(url)![1];
    expect(parameter).toMatch(/^connect_[\w-]+$/);

    await message(ALICE, { text: `/start ${parameter}` });
    expect(connectTelegram).toHaveBeenCalledWith('user-1', {
      id: '111',
      locale: 'ru',
    });
    expect(sent.at(-1)?.text).toContain('Telegram подключён');

    // Used up: a second press (or someone else) connects nothing.
    await message(MALLORY, { text: `/start ${parameter}` });
    expect(connectTelegram).toHaveBeenCalledTimes(1);
    expect(sent.at(-1)?.text).toContain('muddati tugagan');
  });

  it('does not treat a connect link as a login', async () => {
    const { url } = await service.startConnect('user-1', 'en');
    const parameter = /start=(\S+)$/.exec(url)![1];
    await message(ALICE, { text: `/start ${parameter}` });
    expect(sent.at(-1)?.markup).toBeUndefined();
    expect(loginWithPhone).not.toHaveBeenCalled();
  });
});
