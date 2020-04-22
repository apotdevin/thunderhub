import React from 'react';
import styled from 'styled-components';
import { mediaWidths } from '../../styles/Themes';

import { Section } from '../section/Section';
import { Navigation } from '../../layouts/navigation/Navigation';
import { StatusCheck } from '../statusCheck/StatusCheck';

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
  return (
    <Section padding={'16px 0 32px'}>
      <Container>
        <StatusCheck />
        <Navigation />
        <ContentStyle>{children}</ContentStyle>
      </Container>
    </Section>
  );
};
