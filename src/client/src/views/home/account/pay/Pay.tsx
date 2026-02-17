import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { useState, VFC } from 'react';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
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
      payCallback && payCallback();
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
          <InputWithDeco
            title={'Request'}
            value={request}
            placeholder={'Invoice'}
            inputCallback={value => setRequest(value)}
            onEnter={() => handleEnter()}
            inputMaxWidth={'300px'}
          />
          <Separation />
        </>
      )}
      <InputWithDeco
        title={'Max Fee'}
        value={fee}
        amount={fee}
        placeholder={'sats'}
        inputType={'number'}
        inputMaxWidth={'300px'}
        inputCallback={value => setFee(Math.max(1, Number(value)))}
        onEnter={() => handleEnter()}
      />
      <InputWithDeco
        title={'Max Paths'}
        value={paths}
        placeholder={'paths'}
        inputType={'number'}
        inputMaxWidth={'300px'}
        inputCallback={value => setPaths(Math.max(1, Number(value)))}
        onEnter={() => handleEnter()}
      />
      <Separation />
      <ChannelSelect
        title={'Out Channels'}
        maxWidth={'300px'}
        callback={p => setPeers(p.map(peer => peer.id))}
      />
      <Separation />
      <DecodeInvoice invoice={request || predefinedRequest} />
      <ColorButton
        loading={loading}
        disabled={loading || !request}
        withMargin={'16px 0 0 0'}
        fullWidth={true}
        onClick={() => handleEnter()}
      >
        Pay
      </ColorButton>
    </>
  );
};
