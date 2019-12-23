import React, { useState } from 'react';
import { DarkSubTitle, ColorButton, SingleLine } from '../../generic/Styled';
import { useQuery } from '@apollo/react-hooks';
import { GET_FORWARD_CHANNELS_REPORT } from '../../../graphql/query';
import { getValue } from '../../../helpers/Helpers';
import { useSettings } from '../../../context/SettingsContext';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { ChannelRow, CardContent } from '.';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { GitCommit, DownArrow, UpArrow } from '../../generic/Icons';
import styled from 'styled-components';
import { LoadingCard } from '../../loading/LoadingCard';

const ButtonRow = styled.div`
    display: flex;
    margin-bottom: 5px;
`;

const TriButton = styled(ColorButton)`
    margin: 0;
    border-radius: 0;
`;

const LeftButton = styled(TriButton)`
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
`;

const RightButton = styled(TriButton)`
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
`;

const TableLine = styled.div`
    width: 35%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const LastTableLine = styled(TableLine)`
    width: auto;
    text-align: right;
`;

interface Props {
    isTime: string;
    isType: string;
    color: string;
}

export const ForwardChannelsReport = ({ isTime, isType, color }: Props) => {
    const [type, setType] = useState('route');

    const { price, symbol, currency } = useSettings();

    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const { data, loading } = useQuery(GET_FORWARD_CHANNELS_REPORT, {
        variables: { time: isTime, order: isType, auth, type },
        onError: error => toast.error(getErrorContent(error)),
    });

    if (!data || loading) {
        return <LoadingCard noCard={true} title={'Forward Report'} />;
    }

    const report = data.getForwardChannelsReport;

    const fillArray = (array: {}[]) => {
        const lengthMissing = 10 - array.length;
        if (lengthMissing > 0) {
            for (let i = 0; i < lengthMissing; i++) {
                array.push({
                    aliasIn: '-',
                    aliasOut: '-',
                    alias: '-',
                    name: '-',
                    amount: '',
                    fee: '',
                    tokens: '',
                });
            }
        }
        return array;
    };

    const parsed = fillArray(JSON.parse(report));

    const getFormatString = (amount: number | string) => {
        if (typeof amount === 'string') return amount;
        if (isType !== 'amount') {
            return getValue({ amount, price, symbol, currency });
        }
        return amount;
    };

    const renderRoute = (parsed: {}[]) => {
        const routes = parsed.map((channel: any, index: number) => (
            <ChannelRow key={index}>
                <TableLine>{channel.aliasIn}</TableLine>
                <TableLine>{channel.aliasOut}</TableLine>
                <LastTableLine>
                    {getFormatString(channel[isType])}
                </LastTableLine>
            </ChannelRow>
        ));

        return (
            <>
                <ChannelRow>
                    <DarkSubTitle>Incoming</DarkSubTitle>
                    <DarkSubTitle>Outgoing</DarkSubTitle>
                    <DarkSubTitle></DarkSubTitle>
                </ChannelRow>
                {routes}
            </>
        );
    };

    const renderChannels = (parsed: {}[]) => {
        const channels = parsed.map((channel: any, index: number) => (
            <ChannelRow key={index}>
                <TableLine>{`${channel.alias}`}</TableLine>
                <DarkSubTitle>{`${channel.name}`}</DarkSubTitle>
                <LastTableLine>
                    {getFormatString(channel[isType])}
                </LastTableLine>
            </ChannelRow>
        ));

        return (
            <>
                <ChannelRow>
                    <DarkSubTitle>Alias</DarkSubTitle>
                    <DarkSubTitle>ID</DarkSubTitle>
                    <DarkSubTitle></DarkSubTitle>
                </ChannelRow>
                {channels}
            </>
        );
    };

    const renderContent = (parsed: {}[]) => {
        switch (type) {
            case 'route':
                return renderRoute(parsed);
            default:
                return renderChannels(parsed);
        }
    };

    const renderButtons = () => (
        <ButtonRow>
            <LeftButton
                color={color}
                selected={type === 'incoming'}
                onClick={() => setType('incoming')}
            >
                <DownArrow />
            </LeftButton>
            <TriButton
                selected={type === 'route'}
                onClick={() => setType('route')}
                color={color}
            >
                <GitCommit />
            </TriButton>
            <RightButton
                selected={type === 'outgoing'}
                color={color}
                onClick={() => setType('outgoing')}
            >
                <UpArrow />
            </RightButton>
        </ButtonRow>
    );

    const renderTop = (title: string) => (
        <SingleLine>
            <DarkSubTitle>{title}</DarkSubTitle>
            {renderButtons()}
        </SingleLine>
    );

    const renderTitle = () => {
        switch (type) {
            case 'route':
                return renderTop('Routes');
            case 'incoming':
                return renderTop('Incoming');
            default:
                return renderTop('Outgoing');
        }
    };

    return (
        <CardContent>
            {renderTitle()}
            {renderContent(parsed)}
        </CardContent>
    );
};
