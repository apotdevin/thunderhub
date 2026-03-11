import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  SubTitle,
  Separation,
  Sub4Title,
} from '../../../../components/generic/Styled';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Modal from '../../../../components/modal/ReactModal';
import { Emoji } from '../../../../components/emoji/Emoji';
import { useGetLightningAddressInfoLazyQuery } from '../../../../graphql/queries/__generated__/getLightningAddressInfo.generated';
import { PayRequest } from '../../../../graphql/types';
import { LnPay } from '../lnurl/LnPay';

export const DONATE_ADDRESS = 'tony@bancolibre.com';
const DEFAULT_DONATE_AMOUNT = 20000;

export const useDonate = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [payRequest, setPayRequest] = useState<PayRequest | null>(null);

  const [getInfo, { loading }] = useGetLightningAddressInfoLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: data => {
      setPayRequest(data.getLightningAddressInfo);
      setModalOpen(true);
    },
    onError: ({ graphQLErrors }) => {
      const messages = graphQLErrors.map(e => (
        <div key={e.message}>{e.message}</div>
      ));
      toast.error(<div>{messages}</div>);
    },
  });

  const openDonate = () => getInfo({ variables: { address: DONATE_ADDRESS } });
  const closeDonate = () => setModalOpen(false);

  return { openDonate, loading, payRequest, modalOpen, closeDonate };
};

export const DonateModal = ({
  payRequest,
  modalOpen,
  closeDonate,
}: {
  payRequest: PayRequest | null;
  modalOpen: boolean;
  closeDonate: () => void;
}) => (
  <Modal isOpen={modalOpen} closeCallback={closeDonate}>
    {payRequest ? (
      <LnPay
        request={payRequest}
        defaultAmount={DEFAULT_DONATE_AMOUNT}
        title={'Donate to ThunderHub'}
      />
    ) : null}
  </Modal>
);

export const SupportBar = () => {
  const { openDonate, loading, payRequest, modalOpen, closeDonate } =
    useDonate();

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <SubTitle>This project is completely free and open-source.</SubTitle>
        <Sub4Title>
          If you have enjoyed it, please consider supporting ThunderHub with
          some sats <Emoji symbol={'❤️'} label={'heart'} />
        </Sub4Title>
      </div>
      <Separation />
      <Button
        variant="outline"
        onClick={openDonate}
        disabled={loading}
        className="w-full"
        style={{ margin: '8px 0 0 0' }}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Donate</>}
      </Button>
      <DonateModal
        payRequest={payRequest}
        modalOpen={modalOpen}
        closeDonate={closeDonate}
      />
    </>
  );
};
