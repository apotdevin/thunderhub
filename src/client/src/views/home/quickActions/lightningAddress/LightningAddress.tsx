import { useState } from 'react';
import { toast } from 'react-toastify';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { Card } from '../../../../components/generic/Styled';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
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
        <InputWithDeco
          title={'Lightning Address'}
          value={address}
          inputCallback={v => setAddress(v)}
        />
        <ColorButton
          arrow={true}
          fullWidth={true}
          loading={loading}
          disabled={!address || loading}
          withMargin={'16px 0 0'}
          onClick={() => getInfo({ variables: { address } })}
        >
          Pay
        </ColorButton>
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
