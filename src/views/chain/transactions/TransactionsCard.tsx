import React from 'react';
import {
  Separation,
  SubCard,
  SingleLine,
  DarkSubTitle,
  ResponsiveLine,
} from '../../../components/generic/Styled';
import { MainInfo } from '../../channels/Channels.style';
import {
  getDateDif,
  getFormatDate,
  renderLine,
} from '../../../components/generic/Helpers';
import styled from 'styled-components';
import { getPrice } from '../../../components/price/Price';
import { useSettings } from '../../../context/SettingsContext';
import { usePriceState } from '../../../context/PriceContext';

const AddMargin = styled.div`
  margin-right: 10px;
`;

interface TransactionsCardProps {
  transaction: any;
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
  const { currency } = useSettings();
  const priceContext = usePriceState();
  const format = getPrice(currency, priceContext);

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
        {renderLine('Transaction Id: ', id)}
        {renderLine('Block Id: ', block_id)}
        {renderLine('Confirmations: ', confirmation_count)}
        {renderLine('Confirmation Height: ', confirmation_height)}
        {renderLine('Fee: ', fee)}
        {renderLine('Output Addresses: ', output_addresses.length)}
        {output_addresses.map((address: any, index: number) =>
          renderLine(`${index + 1}`, address, `${index}`)
        )}
      </>
    );
  };

  return (
    <SubCard key={index}>
      <MainInfo onClick={() => handleClick()}>
        <ResponsiveLine withWrap={true}>
          <SingleLine>{`${
            fee !== null ? 'Sent' : 'Received'
          }:  ${formatAmount}`}</SingleLine>
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
