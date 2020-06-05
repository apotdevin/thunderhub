import React from 'react';
import styled, { css } from 'styled-components';
import { BitcoinFees } from 'src/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from 'src/components/bitcoinInfo/BitcoinPrice';
import { useAccountState } from 'src/context/AccountContext';
import { mediaWidths } from '../../styles/Themes';
import { Section } from '../section/Section';
import { Navigation } from '../../layouts/navigation/Navigation';
import { StatusCheck } from '../statusCheck/StatusCheck';
import { LoadingCard } from '../loading/LoadingCard';
import { ServerAccounts } from '../accounts/ServerAccounts';

type GridProps = {
  noNavigation?: boolean;
};

const Container = styled.div<GridProps>`
  display: grid;
  grid-template-areas: 'nav content content';
  grid-template-columns: auto 1fr 200px;
  
  ${({ noNavigation }) =>
    !noNavigation &&
    css`
      gap: 16px;
    `}

  @media (${mediaWidths.mobile}) {
    display: flex;
    flex-direction: column;
  }
`;

const ContentStyle = styled.div`
  grid-area: content;
`;

export const GridWrapper: React.FC<GridProps> = ({
  children,
  noNavigation,
}) => {
  const { hasAccount, auth } = useAccountState();
  const renderContent = () => {
    if (hasAccount === 'false') {
      return <LoadingCard loadingHeight={'50vh'} noCard={true} />;
    }
    return children;
  };
  return (
    <Section padding={'16px 0 32px'}>
      <Container noNavigation={noNavigation}>
        <ServerAccounts />
        <BitcoinPrice />
        <BitcoinFees />
        {auth && <StatusCheck />}
        {!noNavigation && <Navigation />}
        <ContentStyle>{renderContent()}</ContentStyle>
      </Container>
    </Section>
  );
};
