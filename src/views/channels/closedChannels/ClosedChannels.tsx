import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_CLOSED_CHANNELS } from '../../../graphql/query';
import {
    Card,
    CardWithTitle,
    SubTitle,
} from '../../../components/generic/Styled';
import { ClosedCard } from './ClosedCard';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';

export const ClosedChannels = () => {
    const [indexOpen, setIndexOpen] = useState(0);

    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const { loading, data } = useQuery(GET_CLOSED_CHANNELS, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    if (loading || !data || !data.getClosedChannels) {
        return null;
    }

    return (
        <CardWithTitle>
            <SubTitle>Closed Channels</SubTitle>
            <Card>
                {data.getClosedChannels.map((channel: any, index: number) => (
                    <ClosedCard
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
