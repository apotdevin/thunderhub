import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetUtxosQuery } from '../../../graphql/queries/__generated__/getUtxos.generated';
import {
  SubTitle,
  Card,
  CardWithTitle,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { UtxoCard } from './UtxoCard';

export const ChainUtxos = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { loading, data } = useGetUtxosQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getUtxos) {
    return <LoadingCard title={'Unspent Utxos'} />;
  }

  return (
    <CardWithTitle>
      <SubTitle>Unspent Utxos</SubTitle>
      <Card mobileCardPadding={'0'} mobileNoBackground={true}>
        {data.getUtxos.map((utxo, index: number) => (
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
