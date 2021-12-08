import { YamlEnvs } from '../config/configuration';
import {
  AccountType,
  UnresolvedAccountType,
} from '../modules/files/files.types';

export const resolveEnvVarsInAccount = (
  account: UnresolvedAccountType,
  yamlEnvs: YamlEnvs
): AccountType => {
  const regex = /(?<=\{)(.*?)(?=\})/;

  const resolved = Object.fromEntries(
    Object.entries(account).map(([k, v]) => {
      if (typeof v !== 'string') {
        return [k, v];
      }

      const match: string | boolean =
        yamlEnvs[v.toString().match(regex)?.[0] || ''] || v;

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
