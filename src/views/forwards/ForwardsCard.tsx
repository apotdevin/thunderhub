import React from 'react';
import { Forward } from 'src/graphql/types';
import {
  Separation,
  SubCard,
  ColumnLine,
  ResponsiveLine,
  ResponsiveSingle,
} from '../../components/generic/Styled';
import { MainInfo } from '../../components/generic/CardGeneric';
import {
  getDateDif,
  getFormatDate,
  renderLine,
} from '../../components/generic/helpers';
import { Price } from '../../components/price/Price';
import { ChannelAlias } from '../home/reports/forwardReport/ChannelAlias';

interface ForwardCardProps {
  forward: Forward;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const ForwardCard = ({
  forward,
  index,
  setIndexOpen,
  indexOpen,
}: ForwardCardProps) => {
  const {
    created_at,
    fee,
    fee_mtokens,
    incoming_channel,
    outgoing_channel,
    tokens,
  } = forward;

  const formatAmount = <Price amount={tokens} />;
  const formatFee = <Price amount={fee} />;

  const incoming_name = <ChannelAlias id={incoming_channel} />;
  const outgoing_name = <ChannelAlias id={outgoing_channel} />;

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderDetails = () => {
    return (
      <>
        <Separation />
        {renderLine('Incoming Channel: ', incoming_channel)}
        {renderLine('Outgoing Channel: ', outgoing_channel)}
        {renderLine('Fee MilliTokens: ', fee_mtokens)}
        {renderLine('Date: ', getFormatDate(created_at))}
      </>
    );
  };

  return (
    <SubCard key={index}>
      <MainInfo onClick={() => handleClick()}>
        <ResponsiveLine>
          <ResponsiveSingle>
            <ColumnLine>
              {renderLine('Incoming:', incoming_name)}
              {renderLine('Outgoing:', outgoing_name)}
            </ColumnLine>
          </ResponsiveSingle>
          <ColumnLine>
            {renderLine('Amount:', formatAmount)}
            {renderLine('Fee:', formatFee)}
            {renderLine('Date:', `${getDateDif(created_at)} ago`)}
          </ColumnLine>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
