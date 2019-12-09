import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_CHANNELS } from '../../../graphql/query';
import { Card, CardWithTitle, SubTitle } from '../../generic/Styled';
import { ChannelCard } from './ChannelCard';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';

export const Channels = () => {
    const [indexOpen, setIndexOpen] = useState(0);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { loading, error, data } = useQuery(GET_CHANNELS, {
        variables: { auth },
    });

    // console.log(loading, error, data);

    if (loading || !data || !data.getChannels) {
        return <Card>Loading....</Card>;
    }

    return (
        <CardWithTitle>
            <SubTitle>Channels</SubTitle>
            <Card>
                {data.getChannels.map((channel: any, index: number) => (
                    <ChannelCard
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
