import { useState } from 'react';
import { toast } from 'react-toastify';
import { Card } from '../../../components/generic/Styled';
import { InputWithDeco } from '../../../components/input/InputWithDeco';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { faucetApi } from '../../../api/FaucetApi';

export const PayInvoice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [bolt11, setBolt11] = useState<string>('');

  const handlePayInvoice = async () => {
    setLoading(true);

    try {
      await faucetApi.payInvoice({ bolt11 });
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
          value={bolt11}
          inputCallback={value => setBolt11(value)}
          onEnter={() => handlePayInvoice()}
          placeholder="lnbt..."
          title="Bolt11 Invoice"
        />
        <ColorButton
          arrow={true}
          fullWidth={true}
          disabled={loading}
          withMargin={'16px 0 0'}
          onClick={() => handlePayInvoice()}
        >
          Strike me now
        </ColorButton>
      </Card>
    </>
  );
};
