import { openChannel as lnOpenChannel } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { OpenChannelType } from 'server/types/ln-service.types';

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

  logger.info('Opening channel with params: %o', openParams);

  const info = await to<OpenChannelType>(
    lnOpenChannel({
      lnd,
      ...openParams,
    })
  );

  logger.info('Channel opened');

  return {
    transactionId: info.transaction_id,
    transactionOutputIndex: info.transaction_vout,
  };
};
