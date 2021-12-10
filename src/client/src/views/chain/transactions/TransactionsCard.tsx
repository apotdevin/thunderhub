import React from 'react';
import styled from 'styled-components';
import { ChainTransaction } from '../../../graphql/types';
import {
  Separation,
  SubCard,
  SingleLine,
  DarkSubTitle,
  ResponsiveLine,
} from '../../../components/generic/Styled';
import { MainInfo } from '../../../components/generic/CardGeneric';
import {
  getDateDif,
  getFormatDate,
  getTransactionLink,
  renderLine,
} from '../../../components/generic/helpers';
import { getPrice } from '../../../components/price/Price';
import { useConfigState } from '../../../context/ConfigContext';
import { usePriceState } from '../../../context/PriceContext';

const AddMargin = styled.div`
  margin-right: 10px;
`;

interface TransactionsCardProps {
  transaction: Omit<ChainTransaction, 'is_confirmed' | 'is_outgoing'>;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const TransactionsCard = ({
  transaction,
  index,
  setIndexOpen,
  indexOpen,
}: TransactionsCardProps) => {
  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const {
    block_id,
    confirmation_count,
    confirmation_height,
    created_at,
    fee,
    id,
    output_addresses,
    tokens,
  } = transaction;

  const formatAmount = format({ amount: tokens });

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
        {renderLine('Transaction Id: ', getTransactionLink(id))}
        {renderLine('Block Id: ', block_id)}
        {renderLine('Confirmations: ', confirmation_count)}
        {renderLine('Confirmation Height: ', confirmation_height)}
        {renderLine('Fee: ', fee)}
        {renderLine('Output Addresses: ', output_addresses.length)}
        {output_addresses.map((address, index: number) =>
          renderLine(`${index + 1}`, address, `${index}`)
        )}
      </>
    );
  };

  return (
    <SubCard key={index}>
      <MainInfo onClick={() => handleClick()}>
        <ResponsiveLine withWrap={true}>
          <SingleLine>
            {`${fee !== null ? 'Sent' : 'Received'}:  `}
            {formatAmount}
          </SingleLine>
          <ResponsiveLine>
            <AddMargin>
              <DarkSubTitle>{`(${getDateDif(created_at)} ago)`}</DarkSubTitle>
            </AddMargin>
            {getFormatDate(created_at)}
          </ResponsiveLine>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
