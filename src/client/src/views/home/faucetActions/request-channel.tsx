import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Card } from '../../../components/generic/Styled';
import { InputWithDeco } from '../../../components/input/InputWithDeco';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { faucetApi } from '../../../api/FaucetApi';
import { useGetNodeInfoQuery } from '../../../graphql/queries/__generated__/getNodeInfo.generated';

export const RequestChannel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [capacity, setCapacity] = useState<number>(50000);
  const [push_amount, setPushAmount] = useState<number>(25000);
  const [pubkey, setPubkey] = useState<string>('');
  const [host, setHost] = useState<string>('');
  const port = 9735; // LND default

  const { data } = useGetNodeInfoQuery();

  const handleRequestChannel = async () => {
    setLoading(true);

    try {
      await faucetApi.requestChannel({
        capacity,
        push_amount,
        pubkey,
        host: host + ':' + port,
      });
      toast.success('Channel Opened');
    } catch (err) {
      toast.error((err as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      data?.getNodeInfo?.public_key &&
      typeof data.getNodeInfo.public_key === 'string' &&
      pubkey.length === 0
    ) {
      setPubkey(data.getNodeInfo.public_key);
    }
  }, [data, pubkey]);

  return (
    <>
      <Card>
        <InputWithDeco
          value={capacity}
          inputCallback={value => setCapacity(Number(value))}
          onEnter={() => handleRequestChannel()}
          placeholder="50000"
          title="Capacity (sats)"
          inputType="number"
        />
        <InputWithDeco
          value={push_amount}
          inputCallback={value => setPushAmount(Number(value))}
          onEnter={() => handleRequestChannel()}
          placeholder="25000"
          title="Push Amount (Sats)"
          inputType="number"
        />
        <InputWithDeco
          value={host}
          inputCallback={value => setHost(value)}
          onEnter={() => handleRequestChannel()}
          placeholder="127.0.0.1"
          title="Host"
        />

        <ColorButton
          arrow={true}
          fullWidth={true}
          disabled={loading}
          withMargin={'16px 0 0'}
          onClick={() => handleRequestChannel()}
        >
          Gimme a lightning channel
        </ColorButton>
      </Card>
    </>
  );
};
