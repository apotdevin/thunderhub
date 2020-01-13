import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_NETWORK_INFO } from '../../../graphql/query';
import {
    Card,
    CardWithTitle,
    SubTitle,
    SingleLine,
    Separation,
} from '../../../components/generic/Styled';
import { getValue } from '../../../helpers/Helpers';
import { useSettings } from '../../../context/SettingsContext';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import styled from 'styled-components';
import { unSelectedNavButton } from '../../../styles/Themes';
import { Globe, Cpu } from '../../../components/generic/Icons';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';

const Tile = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: ${({ start }: { start?: boolean }) =>
        start ? 'flex-start' : 'flex-end'};
`;

const TileTitle = styled.div`
    font-size: 14px;
    color: ${unSelectedNavButton};
    margin-bottom: 10px;
`;

const Title = styled.div`
    width: 120px;
`;

export const NetworkInfo = () => {
    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const { loading, data } = useQuery(GET_NETWORK_INFO, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    const { price, symbol, currency } = useSettings();
    const priceProps = { price, symbol, currency };

    if (loading || !data || !data.getNetworkInfo) {
        return <LoadingCard title={'Network Info'} />;
    }

    const {
        averageChannelSize,
        channelCount,
        maxChannelSize,
        medianChannelSize,
        minChannelSize,
        nodeCount,
        notRecentlyUpdatedPolicyCount,
        totalCapacity,
    } = data.getNetworkInfo;

    const getFormat = (amount: number) => getValue({ amount, ...priceProps });

    const capacity = getFormat(totalCapacity);
    const maxSize = getFormat(maxChannelSize);
    const averageSize = getFormat(averageChannelSize);
    const medianSize = getFormat(medianChannelSize);
    const minSize = getFormat(minChannelSize);

    return (
        <CardWithTitle>
            <SubTitle>Network Info</SubTitle>
            <Card>
                <SingleLine>
                    <Title>
                        <Globe color={'#2f6fb7'} />
                        Global
                    </Title>
                    <Tile>
                        <TileTitle>Capacity</TileTitle>
                        {capacity}
                    </Tile>
                    <Tile>
                        <TileTitle>Channels</TileTitle>
                        {channelCount}
                    </Tile>
                    <Tile>
                        <TileTitle>Nodes</TileTitle>
                        {nodeCount}
                    </Tile>
                    <Tile>
                        <TileTitle>Zombie Nodes</TileTitle>
                        {notRecentlyUpdatedPolicyCount}
                    </Tile>
                </SingleLine>
                <Separation />
                <SingleLine>
                    <Title>
                        <Cpu color={'#2f6fb7'} />
                        Channel Size
                    </Title>
                    <Tile>
                        <TileTitle>Max</TileTitle>
                        {maxSize}
                    </Tile>
                    <Tile>
                        <TileTitle>Average</TileTitle>
                        {averageSize}
                    </Tile>
                    <Tile>
                        <TileTitle>Median</TileTitle>
                        {medianSize}
                    </Tile>
                    <Tile>
                        <TileTitle>Min</TileTitle>
                        {minSize}
                    </Tile>
                </SingleLine>
            </Card>
        </CardWithTitle>
    );
};
