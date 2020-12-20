import { updateRoutingFees } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';

type ParamsType = {
  transaction_id: string;
  transaction_vout: number;
  base_fee_tokens: number;
  fee_rate: number;
  cltv_delta: number;
  max_htlc_mtokens: string;
  min_htlc_mtokens: string;
};

export const updateFees = async (
  _: undefined,
  {
    transaction_id,
    transaction_vout,
    base_fee_tokens,
    fee_rate,
    cltv_delta,
    max_htlc_mtokens,
    min_htlc_mtokens,
  }: ParamsType,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'updateFees');

  const { lnd } = context;

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
    transaction_id,
    transaction_vout,
    ...(hasBaseFee && baseFee),
    ...(hasFee && { fee_rate }),
    ...(cltv_delta && { cltv_delta }),
    ...(max_htlc_mtokens && { max_htlc_mtokens }),
    ...(min_htlc_mtokens && { min_htlc_mtokens }),
  };

  logger.debug('Updating channel details with props: %o', props);

  await to(updateRoutingFees({ lnd, ...props }));
  return true;
};
