import { Price } from '../../../../components/price/Price';
import { useNodeBalances } from '../../../../hooks/UseNodeBalances';
import { unSelectedNavButton } from '../../../../styles/Themes';
import styled from 'styled-components';
import Big from 'big.js';
import { useGatewayEcashTotal } from '../../../../hooks/UseGatewayEcashTotal';

const S = {
  wrapper: styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  total: styled.h2`
    margin: 0;
  `,
  smallTotal: styled.h3`
    margin: 0;
  `,
  pending: styled.div`
    color: ${unSelectedNavButton};
    font-size: 14px;
  `,
};

export const TotalBalance = () => {
  const { onchain, lightning } = useNodeBalances();

  const total = new Big(onchain.confirmed).add(lightning.confirmed).toString();
  const pending = new Big(onchain.pending).add(lightning.pending).toString();

  return (
    <S.wrapper>
      <S.pending>Total Balance</S.pending>
      <S.total>
        <Price amount={total} />
      </S.total>
      {Number(pending) > 0 ? (
        <S.pending>
          <Price amount={pending} />
        </S.pending>
      ) : null}
    </S.wrapper>
  );
};

export const ChannelBalance = () => {
  const { lightning } = useNodeBalances();

  return (
    <S.wrapper>
      <S.pending>Channel Balance</S.pending>
      <S.smallTotal>
        <Price amount={lightning.confirmed} />
      </S.smallTotal>
      {Number(lightning.pending) > 0 ? (
        <S.pending>
          <Price amount={lightning.pending} />
        </S.pending>
      ) : null}
    </S.wrapper>
  );
};

export const ChainBalance = () => {
  const { onchain } = useNodeBalances();

  return (
    <S.wrapper>
      <S.pending>Chain Balance</S.pending>
      <S.smallTotal>
        <Price amount={onchain.confirmed} />
      </S.smallTotal>
      {Number(onchain.pending) > 0 ? (
        <S.pending>
          <Price amount={onchain.pending} />
        </S.pending>
      ) : null}
    </S.wrapper>
  );
};

export const FedimintBalance = () => {
  const totalFedimintEcash = useGatewayEcashTotal();

  return (
    <S.wrapper>
      <S.pending>Fedimint Balance</S.pending>
      <S.smallTotal>
        <Price amount={totalFedimintEcash} />
      </S.smallTotal>
    </S.wrapper>
  );
};
