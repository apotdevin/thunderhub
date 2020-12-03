import { authenticatedLndGrpc } from 'ln-service';
import { SSOType } from 'server/types/apiTypes';
import { LndObject } from 'server/types/ln-service.types';
import { v5 as uuidv5 } from 'uuid';
import { getSHA256Hash } from './crypto';
import { ParsedAccount } from './fileHelpers';
import { logger } from './logger';
import { SavedLnd } from './savedLnd';

type LndAuthType = {
  cert: string | null;
  macaroon: string;
  socket: string;
};

const THUNDERHUB_NAMESPACE = '00000000-0000-0000-0000-000000000000';

export const saved = new SavedLnd();

export const getUUID = (text: string): string =>
  uuidv5(text, THUNDERHUB_NAMESPACE);

export const getAuthLnd = (
  id: string,
  sso: SSOType | null,
  accounts: ParsedAccount[]
): LndObject | null => {
  const hash = getSHA256Hash(JSON.stringify({ id, sso, accounts }));

  if (saved.isSame(hash)) {
    logger.silly('Using recycled LND Object');
    return saved.lnd;
  }

  if (!id) {
    logger.silly('Account not authenticated');
    return null;
  }

  let authDetails: LndAuthType | null = null;

  if (id === 'test') {
    authDetails = {
      socket: process.env.TEST_HOST || '',
      macaroon: process.env.TEST_MACAROON || '',
      cert: process.env.TEST_CERT || '',
    };
  }

  if (id === 'sso' && !sso) {
    logger.debug('SSO Account is not verified');
    throw new Error('AccountNotAuthenticated');
  }

  if (id === 'sso' && sso) {
    authDetails = sso;
  }

  if (!authDetails) {
    const verifiedAccount = accounts.find(a => a.id === id) || null;

    if (!verifiedAccount) {
      logger.debug('Account not found in config file');
      throw new Error('AccountNotAuthenticated');
    }

    authDetails = verifiedAccount;
  }

  logger.debug('Creating a new LND object');
  const { lnd } = authenticatedLndGrpc(authDetails);

  saved.save(hash, lnd);

  return lnd;
};
