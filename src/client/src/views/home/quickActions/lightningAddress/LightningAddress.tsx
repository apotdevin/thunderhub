import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';
import Modal from '../../../../components/modal/ReactModal';
import { useGetLightningAddressInfoLazyQuery } from '../../../../graphql/queries/__generated__/getLightningAddressInfo.generated';
import { useLocalStorage } from '../../../../hooks/UseLocalStorage';
import { useMutationResultWithReset } from '../../../../hooks/UseMutationWithReset';
import { LnPay } from '../lnurl/LnPay';
import { PreviousAddresses } from './Addresses';

export const LightningAddressCard = () => {
  const [address, setAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useLocalStorage<string[]>(
    'saved_lightning_address',
    []
  );

  const [getInfo, { data: _data, loading }] =
    useGetLightningAddressInfoLazyQuery({
      fetchPolicy: 'network-only',
      onCompleted: () => {
        const filtered = savedAddresses.filter(a => a !== address);
        const final = [address, ...filtered];
        setSavedAddresses(final);
      },
      onError: ({ graphQLErrors }) => {
        const messages = graphQLErrors.map(e => (
          <div key={e.message}>{e.message}</div>
        ));
        toast.error(<div>{messages}</div>);
      },
    });

  const [data, reset] = useMutationResultWithReset(_data);

  const handleClick = (address: string) => setAddress(address);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Lightning Address
          </label>
          <Input
            value={address}
            placeholder="user@domain.com"
            onChange={e => setAddress(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled={!address || loading}
          onClick={() => getInfo({ variables: { address } })}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Pay <ChevronRight size={18} />
            </>
          )}
        </Button>
        <PreviousAddresses handleClick={handleClick} />
      </div>
      <Modal
        isOpen={!!data?.getLightningAddressInfo}
        closeCallback={() => {
          setAddress('');
          reset();
        }}
      >
        {data?.getLightningAddressInfo ? (
          <LnPay request={data?.getLightningAddressInfo} />
        ) : null}
      </Modal>
    </>
  );
};
