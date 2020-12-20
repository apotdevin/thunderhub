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

  let errors = 0;

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

    const hasBaseFee = base_fee_tokens >= 0;
    const hasFee = fee_rate >= 0;

    if (
      !hasBaseFee &&
      !hasFee &&
      !cltv_delta &&
      !max_htlc_mtokens &&
      !min_htlc_mtokens
    ) {
      throw new Error('NoDetailsToUpdateChannel');
    }

    const baseFee =
      base_fee_tokens === 0
        ? { base_fee_tokens: 0 }
        : { base_fee_mtokens: Math.trunc((base_fee_tokens || 0) * 1000) };

    const props = {
      lnd,
      transaction_id,
      transaction_vout,
      ...(hasBaseFee && baseFee),
      ...(hasFee && { fee_rate }),
      ...(cltv_delta && { cltv_delta }),
      ...(max_htlc_mtokens && { max_htlc_mtokens }),
      ...(min_htlc_mtokens && { min_htlc_mtokens }),
    };

    const [, error] = await toWithError(updateRoutingFees(props));

    if (error) {
      logger.error('Error updating channel: %o', error);
      errors = errors + 1;
    }
  }

  return errors ? false : true;
};
