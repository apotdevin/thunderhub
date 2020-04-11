import React, { useState } from 'react';
import {
  SubTitle,
  Card,
  CardWithTitle,
} from '../../../components/generic/Styled';
import { useAccount } from '../../../context/AccountContext';
import { GET_UTXOS } from '../../../graphql/query';
import { useQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { UtxoCard } from './UtxoCard';

export const ChainUtxos = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const { loading, data } = useQuery(GET_UTXOS, {
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
