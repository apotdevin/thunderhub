import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { ChevronRight, Loader2 } from 'lucide-react';
import Modal from '../../../../components/modal/ReactModal';
import { useGetLightningAddressInfoLazyQuery } from '../../../../graphql/queries/__generated__/getLightningAddressInfo.generated';
import { useLocalStorage } from '../../../../hooks/UseLocalStorage';
import { useMutationResultWithReset } from '../../../../hooks/UseMutationWithReset';
import { LnPay } from '../lnurl/LnPay';

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

  return (
    <>
      <div className="flex gap-2">
        {savedAddresses.length > 0 && (
          <NativeSelect value="" onChange={e => setAddress(e.target.value)}>
            <NativeSelectOption value="" disabled>
              Recent
            </NativeSelectOption>
            {savedAddresses.map(a => (
              <NativeSelectOption key={a} value={a}>
                {a}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        )}
        <Input
          className="flex-1"
          value={address}
          placeholder="user@domain.com"
          onChange={e => setAddress(e.target.value)}
          onKeyDown={e =>
            e.key === 'Enter' && address && getInfo({ variables: { address } })
          }
        />
        <Button
          variant="outline"
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
