import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Card } from '../../../../components/generic/Styled';
import Modal from '../../../../components/modal/ReactModal';
import { useGetLightningAddressInfoLazyQuery } from '../../../../graphql/queries/__generated__/getLightningAddressInfo.generated';
import { useLocalStorage } from '../../../../hooks/UseLocalStorage';
import { useMutationResultWithReset } from '../../../../hooks/UseMutationWithReset';
import { LnPay } from '../lnurl/LnPay';
import { PreviousAddresses } from './Addresses';

export const LightningAddressCard = () => {
  const [address, setAddress] = useState<string>('');
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
      <Card>
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Lightning Address</span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled={!address || loading}
          style={{ margin: '16px 0 0' }}
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
      </Card>
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
