import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetChainTransactionsQuery } from 'src/graphql/queries/__generated__/getChainTransactions.generated';
import { GetTransactionsType } from 'src/graphql/types';
import {
  SubTitle,
  Card,
  CardWithTitle,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { TransactionsCard } from './TransactionsCard';

export const ChainTransactions = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { loading, data } = useGetChainTransactionsQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data?.getChainTransactions) {
    return <LoadingCard title={'Chain Transactions'} />;
  }

  return (
    <CardWithTitle>
      <SubTitle>Chain Transactions</SubTitle>
      <Card mobileCardPadding={'0'} mobileNoBackground={true}>
        {data.getChainTransactions.map((transaction, index) => (
          <TransactionsCard
            transaction={transaction as GetTransactionsType}
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
