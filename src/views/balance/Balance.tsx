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
} from 'components/generic/Styled';
import { useAccount } from 'context/AccountContext';
import { getAuthString } from 'utils/auth';
import { useQuery } from '@apollo/react-hooks';
import { GET_CHANNELS } from 'graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from 'utils/error';
import { LoadingCard } from 'components/loading/LoadingCard';
import { getPercent } from 'helpers/Helpers';
import { Input } from 'components/input/Input';
import sortBy from 'lodash.sortby';
import { BalanceCard } from './BalanceCard';
import { BalanceRoute } from './BalanceRoute';
import { Price } from 'components/price/Price';
import { useStatusState } from 'context/StatusContext';
import { Text } from 'views/other/OtherViews.styled';

export const BalanceView = () => {
    const { version } = useStatusState();
    const { host, viewOnly, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(
        host,
        viewOnly !== '' ? viewOnly : sessionAdmin,
        cert,
    );

    const [outgoing, setOutgoing] = useState();
    const [incoming, setIncoming] = useState();
    const [amount, setAmount] = useState();

    const [maxFee, setMaxFee] = useState();

    const [blocked, setBlocked] = useState(false);

    const { loading, data } = useQuery(GET_CHANNELS, {
        variables: { auth, active: true },
        onError: error => toast.error(getErrorContent(error)),
    });

    if (version !== '0.9.0-beta') {
        return (
            <CardWithTitle>
                <SingleLine>
                    <SubTitle>Channel Balancing</SubTitle>
                </SingleLine>
                <Card>
                    <Text>
                        Channel balancing is only available for nodes with LND
                        versions 0.9.0-beta and up.
                    </Text>
                    <Text>
                        If you want to use this feature please update your node.
                    </Text>
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
                : outgoing &&
                  !incoming && { callback: () => setIncoming(channel) };

            return (
                <BalanceCard
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
                            <Price amount={amount} />
                        </NoWrapTitle>
                    </DarkSubTitle>
                </ResponsiveLine>
                {!blocked && (
                    <Input
                        value={amount}
                        placeholder={'Sats'}
                        type={'number'}
                        onChange={e => {
                            setAmount(parseInt(e.target.value));
                        }}
                        withMargin={'0 0 8px'}
                    />
                )}
                <ResponsiveLine>
                    <Sub4Title>Max Fee</Sub4Title>
                    <DarkSubTitle>
                        <NoWrapTitle>
                            <Price amount={maxFee} />
                        </NoWrapTitle>
                    </DarkSubTitle>
                </ResponsiveLine>
                {!blocked && (
                    <Input
                        value={maxFee}
                        placeholder={'Sats (Leave empty to search all routes)'}
                        type={'number'}
                        onChange={e => {
                            setMaxFee(parseInt(e.target.value));
                        }}
                        withMargin={'0 0 24px'}
                    />
                )}
                {incoming && outgoing && (
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
