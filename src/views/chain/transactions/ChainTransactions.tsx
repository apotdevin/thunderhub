import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  SubTitle,
  Card,
  CardWithTitle,
} from '../../../components/generic/Styled';
import { useAccount } from '../../../context/AccountContext';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { useGetChainTransactionsQuery } from '../../../generated/graphql';
import { TransactionsCard } from './TransactionsCard';

export const ChainTransactions = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const { auth } = useAccount();

  const { loading, data } = useGetChainTransactionsQuery({
    skip: !auth,
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getChainTransactions) {
    return <LoadingCard title={'Chain Transactions'} />;
  }

  return (
    <CardWithTitle>
      <SubTitle>Chain Transactions</SubTitle>
      <Card>
        {data.getChainTransactions.map((transaction: any, index: number) => (
          <TransactionsCard
            transaction={transaction}
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
