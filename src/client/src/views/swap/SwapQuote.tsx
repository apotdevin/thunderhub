import {
  renderLine,
  getNodeLink,
  getAddressLink,
} from '../../components/generic/helpers';
import { Card, Separation, SubTitle } from '../../components/generic/Styled';
import { Price } from '../../components/price/Price';
import { useChartColors } from '../../lib/chart-colors';
import { Pay } from '../home/account/pay/Pay';
import { useSwapsDispatch, useSwapsState } from './SwapContext';

export const SwapQuote = () => {
  const chartColors = useChartColors();
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
      <div
        className="rounded-lg p-2 px-4"
        style={{
          border: `1px solid ${chartColors.green}`,
          backgroundColor: 'rgba(10, 255, 59, 0.05)',
        }}
      >
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
      </div>
      <Separation />
      <SubTitle>Pay Swap Invoice</SubTitle>
      <Separation />
      <Pay predefinedRequest={invoice} payCallback={handlePaid} />
      <Separation />
      <div
        className="border rounded-lg p-1 px-2 text-center text-sm"
        style={{
          borderColor: chartColors.darkyellow,
          backgroundColor: 'rgba(255, 193, 10, 0.1)',
        }}
      >
        It is ok to close this modal after 5 seconds of having paid even if it
        still shows as loading.
      </div>
    </>
  );
};
