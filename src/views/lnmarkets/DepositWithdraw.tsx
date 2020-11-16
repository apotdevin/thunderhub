import { useState } from 'react';
import { toast } from 'react-toastify';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import {
  Separation,
  SingleLine,
  SubTitle,
} from 'src/components/generic/Styled';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import Modal from 'src/components/modal/ReactModal';
import {
  useLnMarketsDepositMutation,
  useLnMarketsWithdrawMutation,
} from 'src/graphql/mutations/__generated__/lnMarkets.generated';

export const DepositWithdraw = () => {
  const [type, setType] = useState<string>('none');
  const [amount, setAmount] = useState<number | undefined>();

  const [withdraw, { loading }] = useLnMarketsWithdrawMutation({
    onCompleted: () => {
      toast.success('Withdrawn');
      setAmount(undefined);
      setType('none');
    },
    refetchQueries: ['GetLnMarketsUserInfo'],
  });
  const [deposit, { loading: loadingDeposit }] = useLnMarketsDepositMutation({
    onCompleted: () => {
      toast.success('Deposited');
      setAmount(undefined);
      setType('none');
    },
    refetchQueries: ['GetLnMarketsUserInfo'],
  });

  return (
    <>
      <SingleLine>
        <ColorButton
          fullWidth={true}
          withMargin={'8px 8px 16px 0'}
          onClick={() => setType('deposit')}
        >
          Deposit
        </ColorButton>
        <ColorButton
          fullWidth={true}
          withMargin={'8px 0 16px 8px'}
          onClick={() => setType('withdraw')}
        >
          Withdraw
        </ColorButton>
      </SingleLine>
      <Modal
        isOpen={type !== 'none'}
        closeCallback={() => {
          setAmount(undefined);
          setType('none');
        }}
      >
        <SubTitle>
          {type === 'deposit'
            ? 'Deposit to LnMarkets'
            : 'Withdraw from LnMarkets'}
        </SubTitle>
        <Separation />
        <InputWithDeco
          value={amount}
          amount={amount}
          title={'Amount'}
          inputType={'number'}
          inputCallback={value => setAmount(Number(value))}
          inputMaxWidth={'320px'}
        />
        <ColorButton
          loading={loading || loadingDeposit}
          disabled={!amount || amount <= 0}
          fullWidth={true}
          withMargin={'16px 0 0'}
          onClick={() => {
            if (!amount) return;
            type === 'deposit'
              ? deposit({ variables: { amount } })
              : withdraw({ variables: { amount } });
          }}
        >
          {type === 'deposit' ? 'Deposit' : 'Withdraw'}
        </ColorButton>
      </Modal>
    </>
  );
};
