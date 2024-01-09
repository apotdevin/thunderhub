import { useState } from 'react';
import { toast } from 'react-toastify';
import { Card } from '../../../components/generic/Styled';
import { InputWithDeco } from '../../../components/input/InputWithDeco';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { faucetApi } from '../../../api/FaucetApi';
import { usePayMutation } from '../../../graphql/mutations/__generated__/pay.generated';

export const RefundFaucet = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [amount_sats, setAmount] = useState<number>(50000);

  const [pay] = usePayMutation();

  const handleRefundFaucet = async () => {
    setLoading(true);

    try {
      const request = await faucetApi.refundFaucet({ amount_sats });
      await pay({
        variables: {
          request,
          max_fee: 1000,
          max_paths: 10,
        },
      });
    } catch (err) {
      toast.error((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <>
      <Card>
        <InputWithDeco
          value={amount_sats}
          inputCallback={value => setAmount(Number(value))}
          onEnter={() => handleRefundFaucet()}
          placeholder="Amount in sats"
          title="Amount (sats)"
          inputType="number"
        />
        <ColorButton
          arrow={true}
          fullWidth={true}
          disabled={loading}
          withMargin={'16px 0 0'}
          onClick={() => handleRefundFaucet()}
        >
          Make it Rain
        </ColorButton>
      </Card>
    </>
  );
};
