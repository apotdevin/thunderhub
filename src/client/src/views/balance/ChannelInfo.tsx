import { FC } from 'react';
import {
  DarkSubTitle,
  Separation,
  SubCard,
} from '../../components/generic/Styled';
import { Price } from '../../components/price/Price';
import styled from 'styled-components';
import { BalanceBars } from '../../components/balance';
import { renderLine } from '../../components/generic/helpers';
import { ReducedOptionsItem } from './PeerSelection';

type ChannelInfoProps = {
  channel: ReducedOptionsItem | null | undefined;
  incoming?: boolean;
};

const S = {
  row: styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
  `,
};

export const ChannelInfo: FC<ChannelInfoProps> = ({ channel, incoming }) => {
  if (!channel) {
    return null;
  }

  const { local, remote, baseFee, feeRate, amount } = channel;

  const percent = Math.round((local / (local + remote)) * 100);

  return (
    <SubCard>
      {amount > 1 && (
        <>
          {renderLine('Channels', amount)}
          <Separation />
        </>
      )}
      <S.row>
        <div>
          <DarkSubTitle as={'span'}>Local:</DarkSubTitle>
          <Price amount={local} />
        </div>
        <div>
          <DarkSubTitle as={'span'}>Remote:</DarkSubTitle>
          <Price amount={remote} />
        </div>
      </S.row>
      <BalanceBars local={percent} remote={100 - percent} />
      {incoming && (
        <>
          <Separation />
          {feeRate && renderLine('Average Fee Rate', `${feeRate} ppm`)}
          {baseFee && renderLine('Average Base Fee', `${baseFee} sats`)}
        </>
      )}
    </SubCard>
  );
};
