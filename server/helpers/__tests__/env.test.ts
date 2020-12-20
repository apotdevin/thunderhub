import { resolveEnvVarsInAccount } from '../env';
import { AccountType, UnresolvedAccountType } from '../fileHelpers';

const vars = {
  YML_ENV_1: 'firstEnv',
  YML_ENV_2: 'macaroonString',
  YML_ENV_3: 'false',
  YML_ENV_4: 'true',
};

jest.mock('next/config', () => () => ({
  serverRuntimeConfig: vars,
}));

describe('resolveEnvVarsInAccount', () => {
  it('returns resolved account', () => {
    const account: UnresolvedAccountType = {
      name: '{YML_ENV_1}',
      serverUrl: 'server.url:10009',
      macaroon: '{YML_ENV_2}',
    };

    const resolved = resolveEnvVarsInAccount(account);

    const result: AccountType = {
      name: 'firstEnv',
      serverUrl: 'server.url:10009',
      macaroon: 'macaroonString',
    };

    expect(resolved).toStrictEqual(result);
  });
  it('resolves false boolean values', () => {
    const account: UnresolvedAccountType = {
      name: '{YML_ENV_1}',
      serverUrl: 'server.url:10009',
      encrypted: '{YML_ENV_3}',
    };

    const resolved = resolveEnvVarsInAccount(account);

    const result: AccountType = {
      name: 'firstEnv',
      serverUrl: 'server.url:10009',
      encrypted: false,
    };

    expect(resolved).toStrictEqual(result);
  });
  it('resolves true boolean values', () => {
    const account: UnresolvedAccountType = {
      name: '{YML_ENV_1}',
      serverUrl: 'server.url:10009',
      encrypted: '{YML_ENV_4}',
    };

    const resolved = resolveEnvVarsInAccount(account);

    const result: AccountType = {
      name: 'firstEnv',
      serverUrl: 'server.url:10009',
      encrypted: true,
    };

    expect(resolved).toStrictEqual(result);
  });
  it('does not resolve non existing env vars', () => {
    const account: UnresolvedAccountType = {
      macaroon: '{YML_ENV_NONE}',
    };

    const resolved = resolveEnvVarsInAccount(account);

    expect(resolved).toStrictEqual({
      macaroon: '{YML_ENV_NONE}',
    });
  });
});
