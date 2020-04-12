import React from 'react';
import {
  SubCard,
  Sub4Title,
  Separation,
  SingleLine,
} from '../../components/generic/Styled';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { themeColors, chartColors } from '../../styles/Themes';
import { renderLine } from '../../components/generic/Helpers';
import { HopCard } from './Balance.styled';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { PAY_VIA_ROUTE } from '../../graphql/mutation';
import { GET_ROUTES } from '../../graphql/query';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { Price } from '../../components/price/Price';
import { getPercent } from '../../utils/Helpers';
import { AdminSwitch } from '../../components/adminSwitch/AdminSwitch';

type BalancedRouteProps = {
  incoming: any;
  outgoing: any;
  amount: number;
  maxFee?: number;
  auth: {};
  blocked: boolean;
  setBlocked: () => void;
  callback: () => void;
};

export const BalanceRoute = ({
  incoming,
  outgoing,
  amount,
  maxFee,
  auth,
  blocked,
  setBlocked,
  callback,
}: BalancedRouteProps) => {
  const [getRoute, { loading, data, called }] = useLazyQuery(GET_ROUTES, {
    fetchPolicy: 'no-cache',
    onError: error => {
      callback();
      toast.error(getErrorContent(error));
    },
  });

  const canShow = (): boolean =>
    incoming && outgoing && amount && data && data.getRoutes && blocked;

  const [payRoute, { loading: loadingP }] = useMutation(PAY_VIA_ROUTE, {
    onError: error => {
      callback();
      toast.error(getErrorContent(error));
    },
    onCompleted: () => {
      callback();
      toast.success('Balancing finished');
    },
    refetchQueries: ['GetChannels'],
  });

  const renderHop = (hop: any, index: number) => (
    <HopCard key={index}>
      {renderLine('Channel', hop.channel)}
      {renderLine('Fee', hop.fee)}
    </HopCard>
  );

  const renderGetRoute = () => (
    <ColorButton
      disabled={!incoming || !outgoing || !amount || amount <= 0}
      fullWidth={true}
      loading={loading}
      onClick={() => {
        setBlocked();
        getRoute({
          variables: {
            auth,
            outgoing: outgoing.id,
            incoming: incoming.partner_public_key,
            tokens: amount,
            ...(maxFee && { maxFee }),
          },
        });
      }}
    >
      {called ? 'Get Another Route' : 'Get Route'}
    </ColorButton>
  );

  const renderRoute = () => {
    if (canShow()) {
      const route = JSON.parse(data.getRoutes);
      return (
        <>
          <Sub4Title>Route</Sub4Title>
          <SubCard color={themeColors.blue3}>
            {renderLine('Total Tokens', <Price amount={route.tokens} />)}
            {renderLine(
              'Fee %',
              `${getPercent(route.fee, route.tokens - route.fee, true)} %`
            )}
            {renderLine('Fee', `${route.fee} sats`)}
            {renderLine('Confidence', route.confidence)}
            {renderLine('Hops', route.hops.length)}
            <Separation />
            {route.hops.map((hop: any, index: number) =>
              renderLine(`${index + 1}`, renderHop(hop, index), index)
            )}
          </SubCard>
        </>
      );
    }
    return null;
  };

  const renderButton = () => {
    if (canShow()) {
      return (
        <SingleLine>
          <ColorButton color={chartColors.orange2} onClick={callback}>
            Reset
          </ColorButton>
          <SecureButton
            callback={payRoute}
            disabled={loadingP}
            variables={{ route: data.getRoutes }}
            fullWidth={true}
            arrow={true}
            withMargin={'0 0 0 8px'}
          >
            Balance Channel
          </SecureButton>
        </SingleLine>
      );
    }
    return null;
  };

  return (
    <>
      {renderGetRoute()}
      {renderRoute()}
      <AdminSwitch>{renderButton()}</AdminSwitch>
    </>
  );
};
