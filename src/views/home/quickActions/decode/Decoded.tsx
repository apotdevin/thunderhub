import * as React from 'react';
import { useAccount } from '../../../../context/AccountContext';
import { getErrorContent } from '../../../../utils/error';
import { toast } from 'react-toastify';
import { useDecodeRequestQuery } from '../../../../generated/graphql';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import {
  renderLine,
  getNodeLink,
  getDateDif,
  getFormatDate,
} from '../../../../components/generic/hhelpers';
import { Price } from '../../../../components/price/Price';

interface DecodedProps {
  request: string;
  setShow: (show: boolean) => void;
}

export const Decoded = ({ request, setShow }: DecodedProps) => {
  const { auth } = useAccount();

  const { data, loading } = useDecodeRequestQuery({
    variables: { auth, request },
    onError: error => {
      setShow(false);
      toast.error(getErrorContent(error));
    },
  });

  if (loading || !data || !data.decodeRequest) {
    return <LoadingCard noCard={true} />;
  }

  const {
    chain_address,
    cltv_delta,
    description,
    description_hash,
    destination,
    expires_at,
    id,
    tokens,
  } = data.decodeRequest;

  return (
    <>
      {renderLine('Id:', id)}
      {renderLine('Destination:', getNodeLink(destination))}
      {renderLine('Description:', description)}
      {renderLine('Description Hash:', description_hash)}
      {renderLine('Chain Address:', chain_address)}
      {renderLine('CLTV Delta:', cltv_delta)}
      {renderLine(
        'Expires in:',
        `${getDateDif(expires_at)} (${getFormatDate(expires_at)})`
      )}
      {renderLine('Amount:', <Price amount={tokens} />)}
    </>
  );
};
