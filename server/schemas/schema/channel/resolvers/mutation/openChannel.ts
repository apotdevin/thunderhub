import { openChannel as lnOpenChannel } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from '../../../../../helpers/logger';
import { requestLimiter } from '../../../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../../../helpers/helpers';

export const openChannel = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'openChannel');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  try {
    const info = await lnOpenChannel({
      lnd,
      is_private: params.isPrivate,
      local_tokens: params.amount,
      partner_public_key: params.partnerPublicKey,
      chain_fee_tokens_per_vbyte: params.tokensPerVByte,
    });
    return {
      transactionId: info.transaction_id,
      transactionOutputIndex: info.transaction_vout,
    };
  } catch (error) {
    logger.error('Error opening channel: %o', error);
    throw new Error(getErrorMsg(error));
  }
};
