import React, { useContext } from 'react';
import { DarkSubTitle } from '../../generic/Styled';
import { useQuery } from '@apollo/react-hooks';
import { GET_FORWARD_CHANNELS_REPORT } from '../../../graphql/query';
import { getValue } from '../../../helpers/Helpers';
import { SettingsContext } from '../../../context/SettingsContext';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { ChannelRow, CardContent } from '.';

interface Props {
    isTime: string;
    isType: string;
}

export const ForwardChannelsReport = ({ isTime, isType }: Props) => {
    const { price, symbol, currency } = useContext(SettingsContext);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { data, loading, error } = useQuery(GET_FORWARD_CHANNELS_REPORT, {
        variables: { time: isTime, order: isType, auth },
    });

    if (!data || loading) {
        return <div>Loading</div>;
    }

    const { incoming, outgoing } = data.getForwardChannelsReport;

    const fillArray = (array: {}[]) => {
        const lengthMissing = 5 - array.length;
        if (lengthMissing > 0) {
            for (let i = 0; i < lengthMissing; i++) {
                array.push({ name: '-', amount: '', fee: '', tokens: '' });
            }
        }
        return array;
    };

    const parse = (json: string) => JSON.parse(json);

    if (parse(incoming) <= 0 || parse(outgoing) <= 0) {
        return null;
    }

    const parsedIncoming = fillArray(parse(incoming));
    const parsedOutgoing = fillArray(parse(outgoing));

    const getFormatString = (amount: number | string) => {
        if (typeof amount === 'string') return amount;
        if (isType !== 'amount') {
            return getValue({ amount, price, symbol, currency });
        }
        return amount;
    };

    return (
        <CardContent>
            <DarkSubTitle>Incoming</DarkSubTitle>
            {parsedIncoming.map((channel: any, index: number) => (
                <ChannelRow key={index}>
                    <div>{channel.name}</div>
                    <div>{getFormatString(channel[isType])}</div>
                </ChannelRow>
            ))}
            <DarkSubTitle>Outgoing</DarkSubTitle>
            {parsedOutgoing.map((channel: any, index: number) => (
                <ChannelRow key={index}>
                    <div>{channel.name}</div>
                    <div>{getFormatString(channel[isType])}</div>
                </ChannelRow>
            ))}
        </CardContent>
    );
};
