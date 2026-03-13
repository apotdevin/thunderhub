import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
  <Dialog open={modalOpen} onOpenChange={open => !open && closeDonate()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10">
            <Heart size={16} className="text-pink-500" />
          </div>
          <div>
            <DialogTitle>Support ThunderHub</DialogTitle>
            <DialogDescription>
              ThunderHub is free and open-source. Your donation helps keep it
              that way.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      {payRequest ? (
        <LnPay request={payRequest} defaultAmount={DEFAULT_DONATE_AMOUNT} />
      ) : null}
    </DialogContent>
  </Dialog>
);

export const SupportBar = () => {
  const { openDonate, loading, payRequest, modalOpen, closeDonate } =
    useDonate();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded border border-pink-500/20 bg-pink-500/5 px-3 py-2 text-xs text-muted-foreground">
          <Heart size={14} className="shrink-0 text-pink-500" />
          <span>
            ThunderHub is free and open-source. Consider sending a few sats to
            support development.
          </span>
        </div>
        <Button
          variant="outline"
          onClick={openDonate}
          disabled={loading}
          className="shrink-0"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Heart size={14} className="text-pink-500" />
              Donate
            </>
          )}
        </Button>
      </div>
      <DonateModal
        payRequest={payRequest}
        modalOpen={modalOpen}
        closeDonate={closeDonate}
      />
    </div>
  );
};
