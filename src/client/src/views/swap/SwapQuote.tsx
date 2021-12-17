import {
  renderLine,
  getNodeLink,
  getAddressLink,
} from '../../components/generic/helpers';
import { Card, Separation, SubTitle } from '../../components/generic/Styled';
import { Price } from '../../components/price/Price';
import { chartColors } from '../../styles/Themes';
import styled from 'styled-components';
import { Pay } from '../home/account/pay/Pay';
import { useSwapsDispatch, useSwapsState } from './SwapContext';

const S = {
  info: styled.div`
    border: 1px solid ${chartColors.green};
    background-color: rgba(10, 255, 59, 0.05);
    padding: 8px 16px;
    border-radius: 8px;
  `,
  warning: styled.div`
    border: 1px solid ${chartColors.darkyellow};
    background-color: rgba(255, 193, 10, 0.1);
    padding: 4px 8px;
    border-radius: 8px;
    text-align: center;
    font-size: 14px;
  `,
};

export const SwapQuote = () => {
  const { swaps, open } = useSwapsState();
  const dispatch = useSwapsDispatch();

  if (typeof open !== 'number') {
    return null;
  }

  const openSwap = swaps[open];

  if (!openSwap?.decodedInvoice) {
    return (
      <Card mobileCardPadding={'0'} mobileNoBackground={true}>
        Error decoding invoice in swap.
      </Card>
    );
  }

  const { decodedInvoice, onchainAmount, receivingAddress, invoice } = openSwap;

  const handlePaid = () => {
    dispatch({ type: 'close' });
  };

  return (
    <>
      <SubTitle>{`Swap - ${openSwap.id}`}</SubTitle>
      <Separation />
      {renderLine(
        'Sending to',
        getNodeLink(
          decodedInvoice.destination,
          decodedInvoice.destination_node?.node?.alias
        )
      )}
      {renderLine('Description', decodedInvoice.description)}
      <Separation />
      <S.info>
        <SubTitle>Transaction</SubTitle>
        {renderLine('You send', <Price amount={decodedInvoice.tokens} />)}
        {renderLine(
          'Fees you pay (Boltz + Chain fee)',
          <Price amount={decodedInvoice.tokens - onchainAmount} />
        )}
        <Separation />
        {renderLine(
          'Lockup Transaction Value',
          <Price amount={onchainAmount} />
        )}
        {renderLine('At BTC Address', getAddressLink(receivingAddress))}
      </S.info>
      <Separation />
      <SubTitle>Pay Swap Invoice</SubTitle>
      <Separation />
      <Pay predefinedRequest={invoice} payCallback={handlePaid} />
      <Separation />
      <S.warning>
        It is ok to close this modal after 5 seconds of having paid even if it
        still shows as loading.
      </S.warning>
    </>
  );
};
