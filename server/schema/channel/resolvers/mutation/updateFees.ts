import { updateRoutingFees } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';

export const updateFees = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'updateFees');

  const {
    transaction_id,
    transaction_vout,
    base_fee_tokens,
    fee_rate,
    cltv_delta,
    max_htlc_mtokens,
    min_htlc_mtokens,
  } = params;

  const { lnd } = context;

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

  await to(updateRoutingFees(props));
  return true;
};
