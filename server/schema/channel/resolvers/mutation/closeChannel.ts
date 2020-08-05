import { closeChannel as lnCloseChannel } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { CloseChannelType } from 'server/types/ln-service.types';
import { logger } from 'server/helpers/logger';

export const closeChannel = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'closeChannel');

  const { lnd } = context;

  const closeParams = {
    id: params.id,
    target_confirmations: params.targetConfirmations,
    tokens_per_vbyte: params.tokensPerVByte,
    is_force_close: params.forceClose,
  };

  logger.info('Closing channel with params: %o', closeParams);

  const info = await to<CloseChannelType>(
    lnCloseChannel({
      lnd,
      ...closeParams,
    })
  );

  logger.info('Channel closed: %o', params.id);

  return {
    transactionId: info.transaction_id,
    transactionOutputIndex: info.transaction_vout,
  };
};
