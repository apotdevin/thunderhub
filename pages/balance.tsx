import React, { useState } from 'react';
import {
  CardWithTitle,
  Card,
  SubTitle,
  Sub4Title,
  ResponsiveLine,
  DarkSubTitle,
  NoWrapTitle,
  SingleLine,
} from '../src/components/generic/Styled';
import { useAccount } from '../src/context/AccountContext';
import { useQuery } from '@apollo/react-hooks';
import { GET_CHANNELS } from '../src/graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../src/utils/error';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { getPercent } from '../src/utils/Helpers';
import { Input } from '../src/components/input/Input';
import sortBy from 'lodash.sortby';
import { BalanceCard } from '../src/views/balance/BalanceCard';
import { BalanceRoute } from '../src/views/balance/BalanceRoute';
import { Price } from '../src/components/price/Price';
import { useStatusState } from '../src/context/StatusContext';
import { Text } from '../src/components/typography/Styled';

const BalanceView = () => {
  const { minorVersion } = useStatusState();
  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const [outgoing, setOutgoing] = useState<{ id: string } | null>();
  const [incoming, setIncoming] = useState();
  const [amount, setAmount] = useState<number>();

  const [maxFee, setMaxFee] = useState<number>();

  const [blocked, setBlocked] = useState(false);

  const { loading, data } = useQuery(GET_CHANNELS, {
    variables: { auth, active: true },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (minorVersion < 9) {
    return (
      <CardWithTitle>
        <SingleLine>
          <SubTitle>Channel Balancing</SubTitle>
        </SingleLine>
        <Card>
          <Text>
            Channel balancing is only available for nodes with LND versions
            0.9.0-beta and up.
          </Text>
          <Text>If you want to use this feature please update your node.</Text>
        </Card>
      </CardWithTitle>
    );
  }

  if (loading || !data || !data.getChannels) {
    return <LoadingCard title={'Channel Balancing'} />;
  }

  const handleReset = (type: string) => {
    switch (type) {
      case 'outgoing':
        setOutgoing(undefined);
        setIncoming(undefined);
        break;
      case 'incoming':
        setIncoming(undefined);
        break;
      case 'all':
        setMaxFee(undefined);
        setAmount(undefined);
        setOutgoing(undefined);
        setIncoming(undefined);
        setBlocked(false);
        break;
      default:
        break;
    }
  };

  const renderIncoming = () => {
    if (!outgoing) return null;

    return (
      <>
        <Sub4Title>Incoming Channel</Sub4Title>
        {incoming ? (
          <BalanceCard
            {...{
              index: 0,
              channel: incoming,
              withColor: true,
              closeCallback: blocked
                ? undefined
                : () => handleReset('incoming'),
            }}
          />
        ) : (
          renderChannels()
        )}
      </>
    );
  };

  const renderOutgoing = () => {
    return (
      <>
        <Sub4Title>Outgoing Channel</Sub4Title>
        {outgoing ? (
          <BalanceCard
            {...{
              index: 0,
              channel: outgoing,
              withColor: true,
              closeCallback: blocked
                ? undefined
                : () => handleReset('outgoing'),
            }}
          />
        ) : (
          renderChannels(true)
        )}
      </>
    );
  };

  const renderChannels = (isOutgoing?: boolean) => {
    const channels = sortBy(data.getChannels, [
      (channel: any) =>
        getPercent(channel.remote_balance, channel.local_balance),
    ]);

    const finalChannels = isOutgoing ? channels : channels.reverse();

    return finalChannels.map((channel: any, index: number) => {
      if (!isOutgoing && outgoing && outgoing.id === channel.id) {
        return null;
      }

      const callback = isOutgoing
        ? !outgoing && { callback: () => setOutgoing(channel) }
        : outgoing && !incoming && { callback: () => setIncoming(channel) };

      return (
        <BalanceCard
          key={`${index}-${channel.id}`}
          {...{ index, channel, withArrow: true }}
          {...callback}
        />
      );
    });
  };

  return (
    <CardWithTitle>
      <SingleLine>
        <SubTitle>Channel Balancing</SubTitle>
      </SingleLine>
      <Card>
        {renderOutgoing()}
        {renderIncoming()}
        <ResponsiveLine>
          <Sub4Title>Amount</Sub4Title>
          <DarkSubTitle>
            <NoWrapTitle>
              <Price amount={amount ?? 0} />
            </NoWrapTitle>
          </DarkSubTitle>
        </ResponsiveLine>
        {!blocked && (
          <Input
            value={amount}
            placeholder={'Sats'}
            type={'number'}
            onChange={e => {
              setAmount(Number(e.target.value));
            }}
            withMargin={'0 0 8px'}
          />
        )}
        <ResponsiveLine>
          <Sub4Title>Max Fee</Sub4Title>
          <DarkSubTitle>
            <NoWrapTitle>
              <Price amount={maxFee ?? 0} />
            </NoWrapTitle>
          </DarkSubTitle>
        </ResponsiveLine>
        {!blocked && (
          <Input
            value={maxFee}
            placeholder={'Sats (Leave empty to search all routes)'}
            type={'number'}
            onChange={e => {
              setMaxFee(Number(e.target.value));
            }}
            withMargin={'0 0 24px'}
          />
        )}
        {incoming && outgoing && amount && (
          <BalanceRoute
            {...{
              incoming,
              outgoing,
              amount,
              maxFee,
              auth,
              blocked,
              setBlocked: () => setBlocked(true),
              callback: () => handleReset('all'),
            }}
          />
        )}
      </Card>
    </CardWithTitle>
  );
};

export default BalanceView;
