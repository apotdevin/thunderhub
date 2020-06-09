import React from 'react';
import { ForwardType } from 'src/graphql/types';
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

interface ForwardCardProps {
  forward: ForwardType;
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
    incoming_channel_info,
    outgoing_channel_info,
  } = forward;

  const formatAmount = <Price amount={tokens} />;
  const formatFee = <Price amount={fee} />;

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
              {renderLine(
                'Incoming:',
                incoming_channel_info?.channel?.partner_node_policies?.node
                  ?.node?.alias
              )}
              {renderLine(
                'Outgoing:',
                outgoing_channel_info?.channel?.partner_node_policies?.node
                  ?.node?.alias
              )}
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
