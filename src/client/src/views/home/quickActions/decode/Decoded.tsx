import toast from 'react-hot-toast';
import { useDecodeRequestQuery } from '../../../../graphql/queries/__generated__/decodeRequest.generated';
import { getErrorContent } from '../../../../utils/error';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import {
  renderLine,
  getNodeLink,
  getDateDif,
  getFormatDate,
} from '../../../../components/generic/helpers';
import { Price } from '../../../../components/price/Price';

interface DecodedProps {
  request: string;
  setShow: (show: boolean) => void;
}

export const Decoded = ({ request, setShow }: DecodedProps) => {
  const { data, loading } = useDecodeRequestQuery({
    fetchPolicy: 'network-only',
    variables: { request },
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
    destination_node,
  } = data.decodeRequest;

  const alias = destination_node?.node?.alias || 'Unknown';

  return (
    <>
      {renderLine('Id:', id)}
      {renderLine('Destination:', getNodeLink(destination, alias))}
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
