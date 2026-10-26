import { FilesService, PRE_PASS_STRING } from './files.service';
import { getSHA256Hash, isCorrectPassword } from 'src/server/utils/crypto';
import { AccountConfigType } from './files.types';

const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
const configService = { get: jest.fn() };

const baseConfig = (): AccountConfigType =>
  ({
    users: [
      'header-only@example.com',
      { id: 'you@example.com', name: 'You', password: 'hunter2' },
      { id: 'done', password: `${PRE_PASS_STRING}already` },
    ],
    accounts: [],
  }) as unknown as AccountConfigType;

describe('FilesService.hashPasswords', () => {
  const service = new FilesService(configService as any, logger as any);
  const save = jest
    .spyOn(service, 'saveHashedYaml')
    .mockImplementation(() => undefined);

  beforeEach(() => save.mockClear());

  it('hashes the digest of a plain user password and saves the file', () => {
    const hashed = service.hashPasswords(false, baseConfig(), 'thub.yaml');
    const users = hashed.users as Array<{ id?: string; password?: string }>;

    expect(users[0]).toBe('header-only@example.com');
    expect(users[1].password).toMatch(new RegExp(`^${PRE_PASS_STRING}`));
    expect(
      isCorrectPassword(getSHA256Hash('hunter2'), users[1].password as string)
    ).toBe(true);
    expect(isCorrectPassword('hunter2', users[1].password as string)).toBe(
      false
    );
    expect(users[2].password).toBe(`${PRE_PASS_STRING}already`);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('leaves an already hashed file alone', () => {
    const config = baseConfig();
    expect(service.hashPasswords(true, config, 'thub.yaml')).toBe(config);
    expect(save).not.toHaveBeenCalled();
  });
});
