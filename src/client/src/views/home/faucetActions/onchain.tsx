import { useState } from 'react';
import { toast } from 'react-toastify';
import { Card } from '../../../components/generic/Styled';
import { InputWithDeco } from '../../../components/input/InputWithDeco';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { faucetApi } from '../../../api/FaucetApi';

export const Onchain = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(50000);
  const [address, setAddress] = useState<string>('');

  const handleOnchain = async () => {
    setLoading(true);

    try {
      await faucetApi.onchain({ sats: amount, address });
      toast.success('Successfully Paid to Onchain Address');
    } catch (err) {
      toast.error((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <>
      <Card>
        <InputWithDeco
          value={amount}
          inputCallback={value => setAmount(Number(value))}
          onEnter={() => handleOnchain()}
          placeholder="Amount in sats"
          title="Amount (sats)"
          inputType="number"
        />
        <InputWithDeco
          value={address}
          placeholder="tb1..."
          title="Address"
          inputCallback={value => setAddress(value)}
          onEnter={() => handleOnchain()}
        />
        <ColorButton
          arrow={true}
          fullWidth={true}
          disabled={loading}
          withMargin={'16px 0 0'}
          onClick={() => handleOnchain()}
        >
          Make it Rain
        </ColorButton>
      </Card>
    </>
  );
};
