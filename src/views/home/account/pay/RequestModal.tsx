import * as React from 'react';
import styled from 'styled-components';
import { useDecodeRequestQuery } from 'src/graphql/queries/__generated__/decodeRequest.generated';
import { useAccountState } from 'src/context/AccountContext';
import { XCircle, ChevronDown, ChevronUp } from 'react-feather';
import { useConfigState } from 'src/context/ConfigContext';
import { usePriceState } from 'src/context/PriceContext';
import { Clickable } from 'src/views/stats/styles';
import { usePayViaRouteMutation } from 'src/graphql/mutations/__generated__/payViaRoute.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { SecureButton } from 'src/components/buttons/secureButton/SecureButton';
import { ProbedRouteHop } from 'src/graphql/types';
import {
  SingleLine,
  SubTitle,
  Separation,
  DarkSubTitle,
  Sub4Title,
} from '../../../../components/generic/Styled';
import { Price, getPrice } from '../../../../components/price/Price';
import {
  renderLine,
  getNodeLink,
  getDateDif,
  getFormatDate,
} from '../../../../components/generic/helpers';
import { LoadingCard } from '../../../../components/loading/LoadingCard';

export const WithMargin = styled.div`
  margin-right: 4px;
`;

export const Centered = styled.div`
  text-align: center;
`;

type FormatProps = {
  amount: number;
  override?: string;
};

type HopProps = {
  hop: ProbedRouteHop;
  index: number;
  format: (props: FormatProps) => string;
};

const HopCard = ({ hop, index, format }: HopProps) => {
  const [openHop, openHopSet] = React.useState<boolean>(false);
  const renderInfo = () => (
    <>
      {renderLine('Fee', hop.fee)}
      {renderLine(
        'Forwarded Tokens',
        format({ amount: hop.forward, override: 'sat' })
      )}
      {renderLine(
        `Destination `,
        getNodeLink(hop.public_key, hop.node.node.alias)
      )}
      {renderLine('Channel', hop.channel)}
      {renderLine('Channel Capacity', format({ amount: hop.channel_capacity }))}
    </>
  );
  return (
    <>
      <Separation />
      <Clickable onClick={() => openHopSet(o => !o)}>
        <SingleLine>
          <Sub4Title>{`Hop ${index + 1}`}</Sub4Title>
          {openHop ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </SingleLine>
      </Clickable>
      {openHop && renderInfo()}
    </>
  );
};

interface DecodeProps {
  request: string;
  handleReset: () => void;
}

export const RequestModal: React.FC<DecodeProps> = ({
  request,
  handleReset,
}) => {
  const { auth } = useAccountState();

  const { data, loading, error } = useDecodeRequestQuery({
    fetchPolicy: 'network-only',
    variables: { auth, request },
  });

  const [makePayment, { loading: payLoading }] = usePayViaRouteMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent');
      handleReset();
    },
    refetchQueries: ['GetInOut', 'GetNodeInfo', 'GetBalances'],
  });

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  if (error) {
    return (
      <Centered>
        <SubTitle>Error decoding the Invoice</SubTitle>
        <DarkSubTitle>
          Please verify you have correctly copied the Invoice.
        </DarkSubTitle>
      </Centered>
    );
  }

  if (loading || !data?.decodeRequest) {
    return <LoadingCard noCard={true} />;
  }

  const {
    description,
    destination,
    expires_at,
    tokens,
    probe_route,
    destination_node,
    id,
  } = data.decodeRequest;

  const alias = destination_node?.node?.alias;
  const foundRoute = probe_route?.route;

  if (!foundRoute) {
    return (
      <>
        <SingleLine>
          <SubTitle>No route found to pay this invoice</SubTitle>
          <XCircle color={'red'} />
        </SingleLine>
        <Separation />
        {renderLine('Description:', description)}
        {renderLine('Destination:', getNodeLink(destination, alias))}
      </>
    );
  }

  const renderRoute = () => (
    <>
      {renderLine('Hops:', foundRoute.hops.length)}
      {foundRoute.hops.map((hop, index: number) => (
        <React.Fragment key={index}>
          <HopCard hop={hop} index={index} format={format} />
        </React.Fragment>
      ))}
    </>
  );

  return (
    <>
      <SingleLine>
        <SubTitle>Pay Invoice</SubTitle>
        <Price amount={tokens} />
      </SingleLine>
      {renderLine('Fee:', format({ amount: foundRoute.fee, override: 'sat' }))}
      <Separation />
      {renderLine('Description:', description)}
      {renderLine('Destination:', getNodeLink(destination, alias))}
      {renderLine(
        'Expires in:',
        `${getDateDif(expires_at)} (${getFormatDate(expires_at)})`
      )}
      {renderLine(
        'Safe Fee:',
        format({ amount: foundRoute.safe_fee, override: 'sat' })
      )}
      {renderRoute()}
      <SecureButton
        callback={makePayment}
        variables={{ route: JSON.stringify(foundRoute), id }}
        disabled={payLoading || loading}
        withMargin={'16px 0 0'}
        loading={payLoading}
        fullWidth={true}
      >
        Send
      </SecureButton>
    </>
  );
};
