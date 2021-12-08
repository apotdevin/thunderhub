import { ParsedAccount } from '../files/files.types';

export type EnrichedAccount = {
  lnd: any;
} & ParsedAccount;
