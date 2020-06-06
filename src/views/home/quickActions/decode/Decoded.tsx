import * as React from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import { useDecodeRequestQuery } from 'src/graphql/queries/__generated__/decodeRequest.generated';
import {
  Separation,
  Sub4Title,
  DarkSubTitle,
} from 'src/components/generic/Styled';
import { useConfigState } from 'src/context/ConfigContext';
import { usePriceState } from 'src/context/PriceContext';
import { getErrorContent } from '../../../../utils/error';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import {
  renderLine,
  getNodeLink,
  getDateDif,
  getFormatDate,
} from '../../../../components/generic/helpers';
import { Price, getPrice } from '../../../../components/price/Price';

interface DecodedProps {
  request: string;
  setShow: (show: boolean) => void;
}

export const Decoded = ({ request, setShow }: DecodedProps) => {
  const { auth } = useAccountState();

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const { data, loading } = useDecodeRequestQuery({
    fetchPolicy: 'network-only',
    variables: { auth, request },
    onError: error => {
      setShow(false);
      toast.error(getErrorContent(error));
    },
  });

  if (loading || !data || !data.decodeRequest) {
    return <LoadingCard noCard={true} />;
  }

  const {
    chain_address,
    cltv_delta,
    description,
    description_hash,
    destination,
    expires_at,
    id,
    tokens,
    destination_node,
    probe_route,
  } = data.decodeRequest;

  const alias = destination_node.node.alias;

  const renderRoute = () => {
    if (!probe_route?.route) {
      return (
        <>
          <Separation />
          <Sub4Title>Route</Sub4Title>
          <DarkSubTitle>No route found to pay this request</DarkSubTitle>
        </>
      );
    }

    const { fee, safe_fee, confidence, hops } = probe_route.route;

    return (
      <>
        <Separation />
        <Sub4Title>Route</Sub4Title>
        {renderLine('Confidence', `${Math.round(confidence / 10000)}%`)}
        {renderLine('Fee', format({ amount: fee, override: 'sat' }))}
        {renderLine('Safe Fee', format({ amount: safe_fee, override: 'sat' }))}
        {renderLine('Hops:', hops.length)}
        {hops.map((hop, index: number) => {
          return (
            <React.Fragment key={index}>
              <Separation />
              <Sub4Title>{`Hop ${index + 1}`}</Sub4Title>
              {renderLine('Fee', hop.fee)}
              {renderLine('Forwarded Tokens', hop.forward)}
              {renderLine(
                `Destination `,
                getNodeLink(destination, hop.node.node.alias)
              )}
              {renderLine('Channel', hop.channel)}
              {renderLine(
                'Channel Capacity',
                format({ amount: hop.channel_capacity })
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <>
      {renderLine('Id:', id)}
      {renderLine('Destination:', getNodeLink(destination, alias))}
      {renderLine('Description:', description)}
      {renderLine('Description Hash:', description_hash)}
      {renderLine('Chain Address:', chain_address)}
      {renderLine('CLTV Delta:', cltv_delta)}
      {renderLine(
        'Expires in:',
        `${getDateDif(expires_at)} (${getFormatDate(expires_at)})`
      )}
      {renderLine('Amount:', <Price amount={tokens} />)}
      {renderRoute()}
    </>
  );
};
