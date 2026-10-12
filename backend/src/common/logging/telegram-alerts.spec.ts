import { telegramAlertStream } from './telegram-alerts';

const write = (stream: NodeJS.WritableStream, line: object) =>
  new Promise<void>((resolve) =>
    stream.write(JSON.stringify(line) + '\n', () => resolve()),
  );

describe('telegramAlertStream', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock;
  });

  const stream = () =>
    telegramAlertStream({
      botToken: 'TOKEN',
      chatId: '42',
      source: 'taklifim.uz api',
    });

  const sentText = (call = 0) =>
    (
      JSON.parse(
        (fetchMock.mock.calls[call] as [string, { body: string }])[1].body,
      ) as { text: string }
    ).text;

  it('posts an error with its context, request ID and stack', async () => {
    await write(stream(), {
      level: 50,
      context: 'ExceptionFilter',
      reqId: 'abc12345',
      msg: 'GET /themes -> 500',
      err: { stack: 'Error: boom\n    at x' },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.telegram.org/botTOKEN/sendMessage',
      expect.anything(),
    );
    const text = sentText();
    expect(text).toContain('taklifim.uz api · ERROR · ExceptionFilter');
    expect(text).toContain('GET /themes -> 500');
    expect(text).toContain('Request: abc12345');
    expect(text).toContain('Error: boom');
  });

  it('skips request lines', async () => {
    await write(stream(), {
      level: 50,
      msg: 'GET /themes 500',
      res: { statusCode: 500 },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports the same problem once per window, IDs aside', async () => {
    const s = stream();
    await write(s, {
      level: 50,
      context: 'Payme',
      msg: 'Order 1a2b3c4d5e failed',
    });
    await write(s, {
      level: 50,
      context: 'Payme',
      msg: 'Order 9f8e7d6c5b failed',
    });
    await write(s, { level: 50, context: 'Redis', msg: 'Connection lost' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('caps alerts per hour', async () => {
    const s = stream();
    for (let i = 0; i < 40; i++) {
      await write(s, {
        level: 50,
        context: `Ctx${'x'.repeat(i)}`,
        msg: 'Boom',
      });
    }
    expect(fetchMock).toHaveBeenCalledTimes(30);
  });

  it('ignores lines that are not JSON', async () => {
    const s = stream();
    await new Promise<void>((resolve) =>
      s.write('not json\n', () => resolve()),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
