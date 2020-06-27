import React, { useState } from 'react';
import { toast } from 'react-toastify';
import sortBy from 'lodash.sortby';
import { useAccountState } from 'src/context/AccountContext';
import { useGetChannelsQuery } from 'src/graphql/queries/__generated__/getChannels.generated';
import { ChannelType } from 'src/graphql/types';
import {
  Sub4Title,
  ResponsiveLine,
  DarkSubTitle,
  NoWrapTitle,
  Card,
} from 'src/components/generic/Styled';
import { getErrorContent } from 'src/utils/error';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { getPercent } from 'src/utils/helpers';
import { Input } from 'src/components/input/Input';
import { BalanceCard } from 'src/views/balance/BalanceCard';
import { BalanceRoute } from 'src/views/balance/BalanceRoute';
import { Price } from 'src/components/price/Price';

export const SimpleBalance = () => {
  const { auth } = useAccountState();

  const [outgoing, setOutgoing] = useState<ChannelType | null>();
  const [incoming, setIncoming] = useState<ChannelType | null>();
  const [amount, setAmount] = useState<number>();

  const [maxFee, setMaxFee] = useState<number>();

  const [blocked, setBlocked] = useState(false);

  const { loading, data } = useGetChannelsQuery({
    skip: !auth,
    variables: { auth, active: true },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getChannels) {
    return <LoadingCard noTitle={true} />;
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

  const renderChannels = (isOutgoing?: boolean) => {
    const getChannels = (side: boolean) =>
      sortBy(data.getChannels, channel => {
        const { remote_balance, local_balance } = channel;

        const middle = (remote_balance + local_balance) / 2;

        const remoteDifference = Math.abs(remote_balance - middle);
        const localDifference = Math.abs(local_balance - middle);

        const maxDifference = Math.max(remoteDifference, localDifference);

        const percent = getPercent(local_balance, remote_balance);
        const balance = side ? percent > 50 : percent < 50;

        if (balance) {
          return maxDifference * -1;
        }

        return maxDifference;
      });

    const finalChannels = getChannels(!isOutgoing).reverse();

    return finalChannels.map((channel: ChannelType, index: number) => {
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

  return (
    <Card mobileCardPadding={'0'} mobileNoBackground={true}>
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
          incoming={incoming}
          outgoing={outgoing}
          amount={amount}
          maxFee={maxFee}
          blocked={blocked}
          setBlocked={() => setBlocked(true)}
          callback={() => handleReset('all')}
        />
      )}
    </Card>
  );
};
