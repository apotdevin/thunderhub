import { authenticatedLndGrpc } from 'ln-service';
import { SSOType, AccountType } from 'server/types/apiTypes';
import { LndObject } from 'server/types/ln-service.types';
import { v5 as uuidv5 } from 'uuid';
import { logger } from './logger';

type LndAuthType = {
  cert: string | null;
  macaroon: string;
  socket: string;
};

const THUNDERHUB_NAMESPACE = '00000000-0000-0000-0000-000000000000';

export const getUUID = (text: string): string =>
  uuidv5(text, THUNDERHUB_NAMESPACE);

export const getAuthLnd = (
  id: string,
  sso: SSOType | null,
  accounts: AccountType[]
): LndObject | null => {
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

  logger.silly('Auth details: %o', authDetails);

  const { lnd } = authenticatedLndGrpc(authDetails);
  return lnd;
};
