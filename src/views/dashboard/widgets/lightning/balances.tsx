import { Price } from 'src/components/price/Price';
import { useNodeInfo } from 'src/hooks/UseNodeInfo';
import { unSelectedNavButton } from 'src/styles/Themes';
import styled from 'styled-components';

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
  const { chainBalance, chainPending, channelBalance, channelPending } =
    useNodeInfo();

  const total = chainBalance + channelBalance;
  const pending = chainPending + channelPending;

  return (
    <S.wrapper>
      <S.pending>Total Balance</S.pending>
      <S.total>
        <Price amount={total} />
      </S.total>
      {pending > 0 ? (
        <S.pending>
          <Price amount={pending} />
        </S.pending>
      ) : null}
    </S.wrapper>
  );
};

export const ChannelBalance = () => {
  const { channelBalance, channelPending } = useNodeInfo();

  return (
    <S.wrapper>
      <S.pending>Channel Balance</S.pending>
      <S.smallTotal>
        <Price amount={channelBalance} />
      </S.smallTotal>
      {channelPending > 0 ? (
        <S.pending>
          <Price amount={channelPending} />
        </S.pending>
      ) : null}
    </S.wrapper>
  );
};

export const ChainBalance = () => {
  const { chainBalance, chainPending } = useNodeInfo();

  return (
    <S.wrapper>
      <S.pending>Chain Balance</S.pending>
      <S.smallTotal>
        <Price amount={chainBalance} />
      </S.smallTotal>
      {chainPending > 0 ? (
        <S.pending>
          <Price amount={chainPending} />
        </S.pending>
      ) : null}
    </S.wrapper>
  );
};
