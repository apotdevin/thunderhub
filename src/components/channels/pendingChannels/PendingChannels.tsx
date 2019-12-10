import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PENDING_CHANNELS } from '../../../graphql/query';
import { Card, CardWithTitle, SubTitle } from '../../generic/Styled';
import { PendingCard } from './PendingCard';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';

export const PendingChannels = () => {
    const [indexOpen, setIndexOpen] = useState(0);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { loading, data } = useQuery(GET_PENDING_CHANNELS, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    if (loading || !data || !data.getPendingChannels) {
        return null;
    }

    if (
        data &&
        data.getPendingChannels &&
        data.getPendingChannels.length <= 0
    ) {
        return null;
    }

    return (
        <CardWithTitle>
            <SubTitle>Pending Channels</SubTitle>
            <Card>
                {data.getPendingChannels.map((channel: any, index: number) => (
                    <PendingCard
                        channelInfo={channel}
                        key={index}
                        index={index + 1}
                        setIndexOpen={setIndexOpen}
                        indexOpen={indexOpen}
                    />
                ))}
            </Card>
        </CardWithTitle>
    );
};
