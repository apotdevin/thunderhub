import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { useEffect, useState } from 'react';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import { ChannelSelect } from '../../../../components/select/specific/ChannelSelect';
import { useDecodeRequestLazyQuery } from '../../../../graphql/queries/__generated__/decodeRequest.generated';
import { renderLine } from '../../../../components/generic/helpers';
import { Price } from '../../../../components/price/Price';
import { Camera } from 'react-feather';
import Modal from '../../../../components/modal/ReactModal';
import dynamic from 'next/dynamic';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { usePayMutation } from '../../../../graphql/mutations/__generated__/pay.generated';
import { SingleLine, Separation } from '../../../../components/generic/Styled';

const QRCodeReader = dynamic(() => import('../../../../components/qrReader'), {
  ssr: false,
  loading: function Loading() {
    return <LoadingCard noCard={true} />;
  },
});

interface PayProps {
  predefinedRequest?: string;
  payCallback?: () => void;
}

export const Pay: React.FC<PayProps> = ({ predefinedRequest, payCallback }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [request, setRequest] = useState<string>(predefinedRequest || '');
  const [peers, setPeers] = useState<string[]>([]);
  const [fee, setFee] = useState<number>(10);
  const [paths, setPaths] = useState<number>(1);

  const [decode, { data, loading: decodeLoading }] = useDecodeRequestLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => toast.error('Error decoding invoice'),
  });

  const [pay, { loading }] = usePayMutation({
    onCompleted: () => {
      payCallback && payCallback();
      toast.success('Payment Sent');
      setRequest('');
    },
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (predefinedRequest) {
      decode({ variables: { request: predefinedRequest } });
    }
  }, []);

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

  const renderDecoded = () => {
    if (decodeLoading) {
      return <>Decoding invoice...</>;
    }

    if (!data?.decodeRequest) return null;

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

  return (
    <>
      {!predefinedRequest && (
        <>
          <SingleLine>
            <InputWithDeco
              title={'Request'}
              value={request}
              placeholder={'Invoice'}
              inputCallback={value => setRequest(value)}
              onEnter={() => handleEnter()}
              inputMaxWidth={'240px'}
              blurCallback={() => {
                if (!request) return;
                decode({ variables: { request } });
              }}
            />
            <ColorButton
              withMargin={'0 0 0 8px'}
              onClick={() => setModalOpen(true)}
            >
              <Camera size={18} />
            </ColorButton>
          </SingleLine>
          <Separation />
        </>
      )}
      {renderDecoded()}
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
        isMulti={true}
        maxWidth={'300px'}
        callback={p => setPeers(p.map(peer => peer.id))}
      />
      <Separation />
      <ColorButton
        loading={loading}
        disabled={loading || !request}
        withMargin={'16px 0 0 0'}
        fullWidth={true}
        onClick={() => handleEnter()}
      >
        Pay
      </ColorButton>
      <Modal
        isOpen={modalOpen}
        closeCallback={() => {
          setModalOpen(false);
        }}
      >
        <QRCodeReader
          onScan={value => {
            setRequest(value);
            setModalOpen(false);
          }}
          onError={() => {
            toast.error(
              'Error loading QR Reader. Check your browser permissions'
            );
            setModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
};
