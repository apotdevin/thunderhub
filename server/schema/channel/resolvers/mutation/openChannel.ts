import { openChannel as lnOpenChannel } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getErrorMsg } from 'server/helpers/helpers';

type OpenChannelParams = {
  isPrivate: boolean;
  amount: number;
  partnerPublicKey: string;
  tokensPerVByte: number;
  pushTokens: number;
};

export const openChannel = async (
  _: undefined,
  params: OpenChannelParams,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'openChannel');

  const { lnd } = context;
  const {
    isPrivate,
    amount,
    partnerPublicKey,
    tokensPerVByte,
    pushTokens = 0,
  } = params;

  const openParams = {
    is_private: isPrivate,
    local_tokens: amount,
    partner_public_key: partnerPublicKey,
    chain_fee_tokens_per_vbyte: tokensPerVByte,
    give_tokens: Math.min(pushTokens, amount),
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
