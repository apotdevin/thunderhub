import * as React from 'react';
import { BosRebalanceResultType } from 'src/graphql/types';
import {
  SubCard,
  Separation,
  ResponsiveLine,
} from 'src/components/generic/Styled';
import { renderLine } from 'src/components/generic/helpers';
import { ChevronsUp, ChevronsDown } from 'react-feather';
import { chartColors } from 'src/styles/Themes';
import { Price } from 'src/components/price/Price';
import { btcToSat } from 'src/utils/helpers';
import {
  FullWidthSubCard,
  RebalanceTitle,
  WithSpaceSubCard,
} from './Balance.styled';

type AdvancedResultProps = {
  rebalanceResult: BosRebalanceResultType;
};

export const AdvancedResult: React.FC<AdvancedResultProps> = ({
  rebalanceResult,
}) => {
  const { increase, decrease, result } = rebalanceResult;

  const renderHalf = (
    inliq: string,
    inopen: string,
    inpen: string,
    outliq: string,
    outopen: string,
    outpen: string
  ) => (
    <>
      <Separation />
      {renderLine('Inbound Liquidity', <Price amount={btcToSat(inliq)} />)}
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
      <RebalanceTitle>Rebalance Result</RebalanceTitle>
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
