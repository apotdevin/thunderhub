import React from 'react';
import styled from 'styled-components';
import { BitcoinFees } from 'src/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from 'src/components/bitcoinInfo/BitcoinPrice';
import { useAccountState } from 'src/context/AccountContext';
import { mediaWidths } from '../../styles/Themes';
import { Section } from '../section/Section';
import { Navigation } from '../../layouts/navigation/Navigation';
import { StatusCheck } from '../statusCheck/StatusCheck';
import { LoadingCard } from '../loading/LoadingCard';
import { ServerAccounts } from '../accounts/ServerAccounts';

const Container = styled.div`
  display: grid;
  grid-template-areas: 'nav content content';
  grid-template-columns: auto 1fr 200px;
  gap: 16px;

  @media (${mediaWidths.mobile}) {
    display: flex;
    flex-direction: column;
  }
`;

const ContentStyle = styled.div`
  grid-area: content;
`;

export const GridWrapper: React.FC = ({ children }) => {
  const { hasAccount } = useAccountState();
  const renderContent = () => {
    if (hasAccount === 'false') {
      return <LoadingCard loadingHeight={'50vh'} noCard={true} />;
    }
    return children;
  };
  return (
    <Section padding={'16px 0 32px'}>
      <Container>
        <ServerAccounts />
        <BitcoinPrice />
        <BitcoinFees />
        <StatusCheck />
        <Navigation />
        <ContentStyle>{renderContent()}</ContentStyle>
      </Container>
    </Section>
  );
};
