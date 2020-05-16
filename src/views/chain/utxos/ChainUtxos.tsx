import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import {
  SubTitle,
  Card,
  CardWithTitle,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { useGetUtxosQuery } from '../../../generated/graphql';
import { UtxoCard } from './UtxoCard';

export const ChainUtxos = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const { auth } = useAccountState();

  const { loading, data } = useGetUtxosQuery({
    skip: !auth,
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getUtxos) {
    return <LoadingCard title={'Unspent Utxos'} />;
  }

  return (
    <CardWithTitle>
      <SubTitle>Unspent Utxos</SubTitle>
      <Card>
        {data.getUtxos.map((utxo: any, index: number) => (
          <UtxoCard
            utxo={utxo}
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
