import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { CHANNEL_FEES } from '../../graphql/query';
import { Card, CardWithTitle, SubTitle } from '../../components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { FeeCard } from './FeeCard';

export const FeesView = () => {
    const [indexOpen, setIndexOpen] = useState(0);

    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const { loading, data } = useQuery(CHANNEL_FEES, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    if (loading || !data || !data.getChannelFees) {
        return <LoadingCard title={'Fees'} />;
    }

    return (
        <CardWithTitle>
            <SubTitle>Fees</SubTitle>
            <Card>
                {data.getChannelFees.map((channel: any, index: number) => (
                    <FeeCard
                        channelInfo={channel}
                        index={index + 1}
                        setIndexOpen={setIndexOpen}
                        indexOpen={indexOpen}
                        key={index}
                    />
                ))}
            </Card>
        </CardWithTitle>
    );
};
