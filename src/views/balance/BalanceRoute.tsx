import React from 'react';
import { toast } from 'react-toastify';
import { useGetRoutesLazyQuery } from 'src/graphql/queries/__generated__/getRoutes.generated';
import { useAccountState } from 'src/context/AccountContext';
import { useCircularRebalanceMutation } from 'src/graphql/mutations/__generated__/circularRebalance.generated';
import { ChannelType } from 'src/graphql/types';
import {
  SubCard,
  Sub4Title,
  Separation,
  SingleLine,
} from '../../components/generic/Styled';
import { getErrorContent } from '../../utils/error';
import { themeColors, chartColors } from '../../styles/Themes';
import { renderLine } from '../../components/generic/helpers';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { Price } from '../../components/price/Price';
import { getPercent } from '../../utils/helpers';
import { AdminSwitch } from '../../components/adminSwitch/AdminSwitch';
import { HopCard } from './Balance.styled';

type BalancedRouteProps = {
  incoming: ChannelType;
  outgoing: ChannelType;
  amount: number;
  maxFee?: number;
  blocked: boolean;
  setBlocked: () => void;
  callback: () => void;
};

export const BalanceRoute = ({
  incoming,
  outgoing,
  amount,
  maxFee,
  blocked,
  setBlocked,
  callback,
}: BalancedRouteProps) => {
  const { auth } = useAccountState();

  const [getRoute, { loading, data, called }] = useGetRoutesLazyQuery({
    fetchPolicy: 'no-cache',
    onError: error => {
      callback();
      toast.error(getErrorContent(error));
    },
  });

  const canShow = (): boolean =>
    !!(incoming && outgoing && amount && data?.getRoutes && blocked);

  const [payRoute, { loading: loadingP }] = useCircularRebalanceMutation({
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

  const renderHop = (hop: { channel: string; fee: number }, index: number) => (
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
    if (canShow() && data?.getRoutes) {
      const route = data.getRoutes;
      return (
        <>
          <Sub4Title>Route</Sub4Title>
          <SubCard subColor={themeColors.blue3}>
            {renderLine('Total Tokens', <Price amount={route.tokens} />)}
            {renderLine(
              'Fee %',
              `${getPercent(route.fee, route.tokens - route.fee, true)} %`
            )}
            {renderLine('Fee', `${route.fee} sats`)}
            {renderLine('Confidence', route.confidence)}
            {renderLine('Hops', route.hops.length)}
            <Separation />
            {route.hops.map((hop, index) =>
              renderLine(`${index + 1}`, renderHop(hop, index), index)
            )}
          </SubCard>
        </>
      );
    }
    return null;
  };

  const renderButton = () => {
    if (canShow() && data?.getRoutes) {
      return (
        <SingleLine>
          <ColorButton color={chartColors.orange2} onClick={callback}>
            Reset
          </ColorButton>
          <SecureButton
            callback={payRoute}
            disabled={loadingP}
            variables={{ route: JSON.stringify(data.getRoutes) }}
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
