import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_NETWORK_INFO } from '../../graphql/query';
import { Card } from '../generic/Styled';
import { getValue } from '../../helpers/Helpers';
import { SettingsContext } from '../../context/SettingsContext';
import { AccountContext } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';

export const NetworkInfo = () => {
    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { loading, error, data } = useQuery(GET_NETWORK_INFO, {
        variables: { auth },
    });

    const { price, symbol, currency } = useContext(SettingsContext);
    const priceProps = { price, symbol, currency };

    // console.log(loading, error, data);

    if (loading || !data || !data.getNetworkInfo) {
        return <Card bottom="10px">Loading....</Card>;
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

    return (
        <Card bottom="10px">
            <p>{`Total Capacity: ${getValue({
                amount: totalCapacity,
                ...priceProps,
            })}`}</p>
            <p>{`Max Channel Size: ${getValue({
                amount: maxChannelSize,
                ...priceProps,
            })}`}</p>
            <p>{`Average Channel Size: ${getValue({
                amount: averageChannelSize,
                ...priceProps,
            })}`}</p>
            <p>{`Median Channel Size: ${getValue({
                amount: medianChannelSize,
                ...priceProps,
            })}`}</p>
            <p>{`Min Channel Size: ${getValue({
                amount: minChannelSize,
                ...priceProps,
            })}`}</p>
            <p>{`Total Channels: ${channelCount}`}</p>
            <p>{`Total Nodes: ${nodeCount}`}</p>
            <p>{`Zombie Nodes: ${notRecentlyUpdatedPolicyCount}`}</p>
        </Card>
    );
};
