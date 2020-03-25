import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PEERS } from 'graphql/query';
import { useAccount } from 'context/AccountContext';
import { getAuthString } from 'utils/auth';
import { CardWithTitle, SubTitle, Card } from 'components/generic/Styled';
import { PeersCard } from './PeersCard';
import { LoadingCard } from 'components/loading/LoadingCard';
import { AddPeer } from './AddPeer';

export const PeersList = () => {
    const [indexOpen, setIndexOpen] = useState(0);
    const { host, viewOnly, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(
        host,
        viewOnly !== '' ? viewOnly : sessionAdmin,
        cert,
    );

    const { loading, data } = useQuery(GET_PEERS, {
        variables: { auth },
    });

    if (loading || !data || !data.getPeers) {
        return <LoadingCard title={'Peers'} />;
    }

    return (
        <>
            <AddPeer />
            <CardWithTitle>
                <SubTitle>Peers</SubTitle>
                <Card>
                    {data.getPeers.map((peer: any, index: number) => (
                        <PeersCard
                            peer={peer}
                            index={index + 1}
                            setIndexOpen={setIndexOpen}
                            indexOpen={indexOpen}
                            key={`${index}-${peer.public_key}`}
                        />
                    ))}
                </Card>
            </CardWithTitle>
        </>
    );
};
