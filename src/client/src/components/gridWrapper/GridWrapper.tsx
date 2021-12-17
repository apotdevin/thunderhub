import React from 'react';
import styled, { css } from 'styled-components';
import { BitcoinFees } from '../../../src/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from '../../../src/components/bitcoinInfo/BitcoinPrice';
import { mediaWidths } from '../../styles/Themes';
import { Section } from '../section/Section';
import { Navigation } from '../../layouts/navigation/Navigation';
import { StatusCheck } from '../statusCheck/StatusCheck';

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
}) => (
  <Section padding={'16px 0 32px'}>
    <Container noNavigation={noNavigation}>
      <BitcoinPrice />
      <BitcoinFees />
      <StatusCheck />
      {!noNavigation && <Navigation />}
      <ContentStyle>{children}</ContentStyle>
    </Container>
  </Section>
);

export const SimpleWrapper: React.FC<GridProps> = ({ children }) => (
  <Section fixedWidth={false} padding={'16px'}>
    <BitcoinPrice />
    <BitcoinFees />
    <StatusCheck />
    {children}
  </Section>
);
