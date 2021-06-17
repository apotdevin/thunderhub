import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { Link } from 'src/components/link/Link';
import styled from 'styled-components';

const S = {
  wrapper: styled.div`
    width: 100%;
    overflow: hidden;
  `,
};

export const DashSettingsLink = () => {
  return (
    <S.wrapper>
      <Link href={'/settings/dashboard'}>
        <ColorButton fullWidth={true}>Dash Settings</ColorButton>
      </Link>
    </S.wrapper>
  );
};

export const ForwardsViewLink = () => {
  return (
    <S.wrapper>
      <Link href={'/forwards'}>
        <ColorButton fullWidth={true}>Forwards</ColorButton>
      </Link>
    </S.wrapper>
  );
};

export const TransactionsViewLink = () => {
  return (
    <S.wrapper>
      <Link href={'/transactions'}>
        <ColorButton fullWidth={true}>Transactions</ColorButton>
      </Link>
    </S.wrapper>
  );
};

export const ChannelViewLink = () => {
  return (
    <S.wrapper>
      <Link href={'/channels'}>
        <ColorButton fullWidth={true}>Channels</ColorButton>
      </Link>
    </S.wrapper>
  );
};

export const RebalanceViewLink = () => {
  return (
    <S.wrapper>
      <Link href={'/rebalance'}>
        <ColorButton fullWidth={true}>Rebalance</ColorButton>
      </Link>
    </S.wrapper>
  );
};
