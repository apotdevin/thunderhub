import React, { useState } from 'react';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { useBosPayMutation } from 'src/graphql/mutations/__generated__/bosPay.generated';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { Separation, SingleLine } from 'src/components/generic/Styled';
import { toast } from 'react-toastify';
import { ChannelSelect } from 'src/components/select/specific/ChannelSelect';
import { getErrorContent } from 'src/utils/error';
import Modal from 'src/components/modal/ReactModal';
import dynamic from 'next/dynamic';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { Camera } from 'react-feather';

const QRCodeReader = dynamic(() => import('src/components/qrReader'), {
  ssr: false,
  loading: function Loading() {
    return <LoadingCard noCard={true} />;
  },
});

export const Pay = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [request, setRequest] = useState<string>('');
  const [peers, setPeers] = useState<string[]>([]);
  const [fee, setFee] = useState<number>(1);
  const [paths, setPaths] = useState<number>(1);

  const [pay, { loading }] = useBosPayMutation({
    onCompleted: () => {
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
      <SingleLine>
        <InputWithDeco
          title={'Request'}
          value={request}
          placeholder={'Invoice'}
          inputCallback={value => setRequest(value)}
          onEnter={() => handleEnter()}
          inputMaxWidth={'440px'}
        />
        <ColorButton
          withMargin={'0 0 0 8px'}
          onClick={() => setModalOpen(true)}
        >
          <Camera size={18} />
        </ColorButton>
      </SingleLine>
      <Separation />
      <InputWithDeco
        title={'Max Fee'}
        value={fee}
        amount={fee}
        placeholder={'sats'}
        inputType={'number'}
        inputCallback={value => setFee(Math.max(1, Number(value)))}
        onEnter={() => handleEnter()}
      />
      <InputWithDeco
        title={'Max Paths'}
        value={paths}
        placeholder={'paths'}
        inputType={'number'}
        inputCallback={value => setPaths(Math.max(1, Number(value)))}
        onEnter={() => handleEnter()}
      />
      <Separation />
      <ChannelSelect
        title={'Out Channels'}
        isMulti={true}
        callback={p => setPeers(p.map(peer => peer.partner_public_key))}
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
