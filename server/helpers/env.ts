import getConfig from 'next/config';
import { AccountType, UnresolvedAccountType } from './fileHelpers';

const { serverRuntimeConfig } = getConfig() || { serverRuntimeConfig: {} };
const { YML_ENV_1, YML_ENV_2, YML_ENV_3, YML_ENV_4 } = serverRuntimeConfig;

const env: { [key: string]: string } = {
  YML_ENV_1,
  YML_ENV_2,
  YML_ENV_3,
  YML_ENV_4,
};

export const resolveEnvVarsInAccount = (
  account: UnresolvedAccountType
): AccountType => {
  const regex = /(?<=\{)(.*?)(?=\})/;

  const resolved = Object.fromEntries(
    Object.entries(account).map(([k, v]) => {
      if (typeof v !== 'string') {
        return [k, v];
      }

      const match: string | boolean =
        env[v.toString().match(regex)?.[0] || ''] || v;

      if (match === 'true') {
        return [k, true];
      }

      if (match === 'false') {
        return [k, false];
      }

      return [k, match];
    })
  );

  return resolved;
};
