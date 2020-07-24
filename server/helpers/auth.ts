import { authenticatedLndGrpc } from 'ln-service';
import { SSO_ACCOUNT } from 'src/context/AccountContext';
import { SSOType, AccountType } from 'server/types/apiTypes';
import { LndObject } from 'server/types/ln-service.types';
import { logger } from './logger';

type LndAuthType = {
  cert: string | null;
  macaroon: string;
  socket: string;
};

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

  if (id === SSO_ACCOUNT && !sso) {
    logger.debug('SSO Account is not verified');
    throw new Error('AccountNotAuthenticated');
  }

  if (id === SSO_ACCOUNT && sso) {
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
