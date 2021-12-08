import React from 'react';
import { GetUtxosType } from '../../../graphql/types';
import { Separation, SubCard } from '../../../components/generic/Styled';
import { MainInfo } from '../../../components/generic/CardGeneric';
import {
  getTransactionLink,
  renderLine,
} from '../../../components/generic/helpers';
import { getPrice } from '../../../components/price/Price';
import { useConfigState } from '../../../context/ConfigContext';
import { usePriceState } from '../../../context/PriceContext';

interface TransactionsCardProps {
  utxo: GetUtxosType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const UtxoCard = ({
  utxo,
  index,
  setIndexOpen,
  indexOpen,
}: TransactionsCardProps) => {
  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const {
    address,
    address_format,
    confirmation_count,
    output_script,
    tokens,
    transaction_id,
    transaction_vout,
  } = utxo;

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
        {renderLine('Address Format:', address_format)}
        {renderLine('Confirmations: ', confirmation_count)}
        {renderLine('Output Script: ', output_script)}
        {renderLine('Transaction Id: ', getTransactionLink(transaction_id))}
        {renderLine(
          'Transaction Vout: ',
          transaction_vout >= 0 ? `${transaction_vout}` : '-'
        )}
      </>
    );
  };

  return (
    <SubCard key={index}>
      <MainInfo onClick={() => handleClick()}>
        {renderLine('Address', address)}
        {renderLine('Amount', formatAmount)}
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
