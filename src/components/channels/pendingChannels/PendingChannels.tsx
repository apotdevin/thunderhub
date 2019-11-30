import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PENDING_CHANNELS } from '../../../graphql/query';
import { Card } from '../../generic/Styled';
import { PendingCard } from './PendingCard';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';

export const PendingChannels = () => {
    const [indexOpen, setIndexOpen] = useState(0);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { loading, error, data } = useQuery(GET_PENDING_CHANNELS, {
        variables: { auth },
    });

    // console.log(loading, error, data);

    if (loading || !data || !data.getPendingChannels) {
        return <Card bottom="10px">Loading....</Card>;
    }

    return (
        <Card>
            <h1 style={{ margin: '0', marginBottom: '10px' }}>
                Pending Channels
            </h1>
            {data.getPendingChannels.map((channel: any, index: number) => (
                <>
                    <PendingCard
                        channelInfo={channel}
                        index={index + 1}
                        setIndexOpen={setIndexOpen}
                        indexOpen={indexOpen}
                    />
                </>
            ))}
        </Card>
    );
};
