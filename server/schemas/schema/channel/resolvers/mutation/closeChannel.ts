import { closeChannel as lnCloseChannel } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from '../../../../../helpers/logger';
import { requestLimiter } from '../../../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../../../helpers/helpers';

export const closeChannel = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'closeChannel');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  try {
    const info = await lnCloseChannel({
      lnd,
      id: params.id,
      target_confirmations: params.targetConfirmations,
      tokens_per_vbyte: params.tokensPerVByte,
      is_force_close: params.forceClose,
    });
    return {
      transactionId: info.transaction_id,
      transactionOutputIndex: info.transaction_vout,
    };
  } catch (error) {
    logger.error('Error closing channel: %o', error);
    throw new Error(getErrorMsg(error));
  }
};
