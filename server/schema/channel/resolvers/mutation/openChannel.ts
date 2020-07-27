import { openChannel as lnOpenChannel } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getErrorMsg } from 'server/helpers/helpers';

export const openChannel = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'openChannel');

  const { lnd } = context;

  const openParams = {
    is_private: params.isPrivate,
    local_tokens: params.amount,
    partner_public_key: params.partnerPublicKey,
    chain_fee_tokens_per_vbyte: params.tokensPerVByte,
  };

  logger.debug('Opening channel: %o', openParams);

  try {
    const info = await lnOpenChannel({
      lnd,
      ...openParams,
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
