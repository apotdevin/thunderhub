import React, { useState } from 'react';
import { SubTitle, Card, CardWithTitle } from '../../components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { GET_CHAIN_TRANSACTIONS } from '../../graphql/query';
import { useQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { TransactionsCard } from './TransactionsCard';

export const ChainTransactions = () => {
    const [indexOpen, setIndexOpen] = useState(0);
    const { host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

    const { loading, data } = useQuery(GET_CHAIN_TRANSACTIONS, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    if (loading || !data || !data.getChainTransactions) {
        return <LoadingCard title={'Chain Transactions'} />;
    }

    console.log(loading, data);

    return (
        <CardWithTitle>
            <SubTitle>Chain Transactions</SubTitle>
            <Card>
                {data.getChainTransactions.map(
                    (transaction: any, index: number) => (
                        <TransactionsCard
                            transaction={transaction}
                            key={index}
                            index={index + 1}
                            setIndexOpen={setIndexOpen}
                            indexOpen={indexOpen}
                        />
                    ),
                )}
            </Card>
        </CardWithTitle>
    );
};
