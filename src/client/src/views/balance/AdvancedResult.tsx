import * as React from 'react';
import { BosRebalanceResult } from '../../graphql/types';
import {
  SubCard,
  Separation,
  ResponsiveLine,
} from '../../components/generic/Styled';
import { renderLine } from '../../components/generic/helpers';
import { ChevronsUp, ChevronsDown } from 'lucide-react';
import { chartColors } from '../../styles/Themes';
import { Price } from '../../components/price/Price';
import { btcToSat } from '../../utils/helpers';
import {
  FullWidthSubCard,
  RebalanceTitle,
  WithSpaceSubCard,
} from './Balance.styled';

type AdvancedResultProps = {
  rebalanceResult: BosRebalanceResult;
};

export const AdvancedResult: React.FC<AdvancedResultProps> = ({
  rebalanceResult,
}) => {
  const { increase, decrease, result } = rebalanceResult;

  if (!increase || !decrease || !result) {
    return null;
  }

  const renderHalf = (
    inliq: string | null | undefined,
    inopen: string | null | undefined,
    inpen: string | null | undefined,
    outliq: string | null | undefined,
    outopen: string | null | undefined,
    outpen: string | null | undefined
  ) => (
    <>
      <Separation />
      {renderLine(
        'Inbound Liquidity',
        inliq && <Price amount={btcToSat(inliq)} />
      )}
      {renderLine(
        'Opening Inbound Liquidity',
        inopen && <Price amount={btcToSat(inopen)} />
      )}
      {renderLine(
        'Pending Inbound Liquidity',
        inpen && <Price amount={btcToSat(inpen)} />
      )}
      <Separation />
      {renderLine('Outbound Liquidity', <Price amount={btcToSat(outliq)} />)}
      {renderLine(
        'Opening Outbound Liquidity',
        outopen && <Price amount={btcToSat(outopen)} />
      )}
      {renderLine(
        'Pending Outbound Liquidity',
        outpen && <Price amount={btcToSat(outpen)} />
      )}
    </>
  );

  return (
    <>
      <RebalanceTitle>Result</RebalanceTitle>
      <ResponsiveLine>
        <WithSpaceSubCard>
          <RebalanceTitle>
            <ChevronsUp size={24} color={chartColors.green} />
            Inbound
          </RebalanceTitle>
          {renderLine('Partner', increase.increased_inbound_on)}
          {renderHalf(
            increase.liquidity_inbound,
            increase.liquidity_inbound_opening,
            increase.liquidity_inbound_pending,
            increase.liquidity_outbound,
            increase.liquidity_outbound_opening,
            increase.liquidity_outbound_pending
          )}
        </WithSpaceSubCard>
        <FullWidthSubCard>
          <RebalanceTitle>
            <ChevronsDown size={24} color={chartColors.red} />
            Inbound
          </RebalanceTitle>
          {renderLine('Partner', decrease.decreased_inbound_on)}
          {renderHalf(
            decrease.liquidity_inbound,
            decrease.liquidity_inbound_opening,
            decrease.liquidity_inbound_pending,
            decrease.liquidity_outbound,
            decrease.liquidity_outbound_opening,
            decrease.liquidity_outbound_pending
          )}
        </FullWidthSubCard>
      </ResponsiveLine>
      <SubCard>
        {renderLine(
          'Rebalanced',
          <Price amount={btcToSat(result.rebalanced)} />
        )}
        {renderLine(
          'Fee Paid',
          <Price amount={btcToSat(result.rebalance_fees_spent)} />
        )}
      </SubCard>
    </>
  );
};
