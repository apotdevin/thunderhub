import React, { Fragment } from 'react';
import styled from 'styled-components';
import { PaymentType } from 'src/graphql/types';
import { mediaWidths } from 'src/styles/Themes';
import {
  Separation,
  SubCard,
  DarkSubTitle,
} from '../../components/generic/Styled';
import {
  StatusLine,
  NodeTitle,
  MainInfo,
} from '../../components/generic/CardGeneric';
import {
  getStatusDot,
  getDateDif,
  getFormatDate,
  getNodeLink,
  renderLine,
} from '../../components/generic/helpers';
import { Price } from '../../components/price/Price';

interface PaymentsCardProps {
  payment: PaymentType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

const RedValue = styled.div`
  color: red;
`;

const S = {
  grid: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 3fr 2fr 1fr;

    @media (${mediaWidths.mobile}) {
      grid-template-columns: 1fr;
    }
  `,
};

export const PaymentsCard = ({
  payment,
  index,
  setIndexOpen,
  indexOpen,
}: PaymentsCardProps) => {
  const {
    created_at,
    destination,
    destination_node,
    fee,
    fee_mtokens,
    hops,
    id,
    is_confirmed,
    is_outgoing,
    mtokens,
    secret,
    tokens,
    date,
  } = payment;

  const alias = destination_node?.node?.alias;

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
        {renderLine(
          'Created:',
          `${getDateDif(created_at)} ago (${getFormatDate(created_at)})`
        )}
        {renderLine('Destination Node:', getNodeLink(destination, alias))}
        {renderLine('Fee:', formatFee)}
        {renderLine('Fee msats:', `${fee_mtokens} millisats`)}
        {renderLine('Hops:', hops.length)}
        {hops.map((hop, index: number) => (
          <Fragment key={`${index}-${hop.node.alias}}`}>
            {renderLine(
              `Hop ${index + 1}:`,
              getNodeLink(hop.node.public_key, hop.node.alias)
            )}
          </Fragment>
        ))}
        {renderLine('Id:', id)}
        {renderLine('Is Outgoing:', is_outgoing ? 'true' : 'false')}
        {renderLine('Secret:', secret)}
        {renderLine('M Tokens:', `${mtokens} millisats`)}
      </>
    );
  };

  return (
    <SubCard key={index}>
      <MainInfo onClick={() => handleClick()}>
        <StatusLine>{getStatusDot(is_confirmed, 'active')}</StatusLine>
        <S.grid>
          <NodeTitle>{`Payment to: ${alias}`}</NodeTitle>
          <DarkSubTitle>{`(${getDateDif(date)} ago)`}</DarkSubTitle>
          <RedValue>{formatAmount}</RedValue>
        </S.grid>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
