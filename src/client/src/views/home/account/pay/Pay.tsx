import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState, VFC } from 'react';
import { ChannelSelect } from '../../../../components/select/specific/ChannelSelect';
import { useDecodeRequestQuery } from '../../../../graphql/queries/__generated__/decodeRequest.generated';
import { renderLine } from '../../../../components/generic/helpers';
import { Price } from '../../../../components/price/Price';
import { usePayMutation } from '../../../../graphql/mutations/__generated__/pay.generated';
import { Separation } from '../../../../components/generic/Styled';
import { Center } from '../../../../components/typography/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';

interface PayProps {
  predefinedRequest?: string;
  payCallback?: () => void;
}

const DecodeInvoice: VFC<{ invoice: string | undefined | null }> = ({
  invoice,
}) => {
  const { data, loading } = useDecodeRequestQuery({
    variables: { request: invoice || '' },
    skip: !invoice,
    onError: () => toast.error('Error decoding invoice'),
  });

  if (loading) {
    return (
      <Center>
        <div style={{ display: 'flex', gap: '8px' }}>
          Decoding
          <LoadingCard noCard />
        </div>
      </Center>
    );
  }

  if (!data?.decodeRequest || !invoice) return null;

  const { description, tokens, destination_node } = data.decodeRequest;

  const { alias } = destination_node?.node || { alias: 'Unknown' };

  return (
    <>
      {renderLine('Description', description)}
      {renderLine('Value', <Price amount={tokens} />)}
      {renderLine('Destination', alias)}
      <Separation />
    </>
  );
};

export const Pay: React.FC<PayProps> = ({ predefinedRequest, payCallback }) => {
  const [request, setRequest] = useState<string>(predefinedRequest || '');
  const [peers, setPeers] = useState<string[]>([]);
  const [fee, setFee] = useState<number>(10);
  const [paths, setPaths] = useState<number>(1);

  const [pay, { loading }] = usePayMutation({
    onCompleted: () => {
      if (payCallback) payCallback();
      toast.success('Payment Sent');
      setRequest('');
    },
    onError: error => toast.error(getErrorContent(error)),
  });

  const handleEnter = () => {
    if (loading || !request) return;
    pay({
      variables: {
        max_fee: fee,
        max_paths: paths,
        request,
        ...(peers?.length && { out: peers }),
      },
    });
  };

  return (
    <>
      {!predefinedRequest && (
        <>
          <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
            <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
              <span>Request</span>
            </div>
            <Input
              className="ml-0 md:ml-2"
              style={{ maxWidth: '300px' }}
              value={request}
              placeholder={'Invoice'}
              onChange={e => setRequest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEnter()}
            />
          </div>
          <Separation />
        </>
      )}
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Max Fee</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={fee} />
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '300px' }}
          placeholder={'sats'}
          type={'number'}
          value={fee && fee > 0 ? fee : ''}
          onChange={e => setFee(Math.max(1, Number(e.target.value)))}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Max Paths</span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '300px' }}
          placeholder={'paths'}
          type={'number'}
          value={paths && paths > 0 ? paths : ''}
          onChange={e => setPaths(Math.max(1, Number(e.target.value)))}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>
      <Separation />
      <ChannelSelect
        title={'Out Channels'}
        maxWidth={'300px'}
        callback={p => setPeers(p.map(peer => peer.id))}
      />
      <Separation />
      <DecodeInvoice invoice={request || predefinedRequest} />
      <Button
        variant="outline"
        disabled={loading || !request}
        style={{ margin: '16px 0 0 0' }}
        className="w-full"
        onClick={() => handleEnter()}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Pay</>}
      </Button>
    </>
  );
};
