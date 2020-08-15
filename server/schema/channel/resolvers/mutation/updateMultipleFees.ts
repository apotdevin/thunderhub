import { updateRoutingFees } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { logger } from 'server/helpers/logger';
import { toWithError } from 'server/helpers/async';

export const updateMultipleFees = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'updateMultipleFees');

  const { lnd } = context;

  for (let i = 0; i < params.channels.length; i++) {
    const channel = params.channels[i];

    const {
      transaction_id,
      transaction_vout,
      base_fee_tokens,
      fee_rate,
      cltv_delta,
      max_htlc_mtokens,
      min_htlc_mtokens,
    } = channel;

    if (
      !base_fee_tokens &&
      !fee_rate &&
      !cltv_delta &&
      !max_htlc_mtokens &&
      !min_htlc_mtokens
    ) {
      throw new Error('NoDetailsToUpdateChannel');
    }

    const props = {
      lnd,
      transaction_id,
      transaction_vout,
      ...(base_fee_tokens && { base_fee_tokens }),
      ...(fee_rate && { fee_rate }),
      ...(cltv_delta && { cltv_delta }),
      ...(max_htlc_mtokens && { max_htlc_mtokens }),
      ...(min_htlc_mtokens && { min_htlc_mtokens }),
    };

    const [, error] = await toWithError(updateRoutingFees(props));

    logger.debug({ error });
  }

  // const {
  //   transaction_id,
  //   transaction_vout,
  //   base_fee_tokens,
  //   fee_rate,
  //   cltv_delta,
  //   max_htlc_mtokens,
  //   min_htlc_mtokens,
  // } = params;

  // const { lnd } = context;

  // if (
  //   !base_fee_tokens &&
  //   !fee_rate &&
  //   !cltv_delta &&
  //   !max_htlc_mtokens &&
  //   !min_htlc_mtokens
  // ) {
  //   throw new Error('NoDetailsToUpdateChannel');
  // }

  // const props = {
  //   lnd,
  //   transaction_id,
  //   transaction_vout,
  //   ...(base_fee_tokens && { base_fee_tokens }),
  //   ...(fee_rate && { fee_rate }),
  //   ...(cltv_delta && { cltv_delta }),
  //   ...(max_htlc_mtokens && { max_htlc_mtokens }),
  //   ...(min_htlc_mtokens && { min_htlc_mtokens }),
  // };

  // await to(updateRoutingFees(props));
  return true;
};
