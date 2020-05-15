import React from 'react';
import styled from 'styled-components';
import { Section } from '../section/Section';
import { Title } from '../typography/Styled';
import { textColor, mediaWidths } from '../../styles/Themes';
import { LoadingCard } from './LoadingCard';

const StyledTitle = styled(Title)`
  font-size: 28px;
  color: ${textColor};

  @media (${mediaWidths.mobile}) {
    font-size: 16px;
  }
`;

export const LoadingView = () => (
  <Section padding={'40px 0 60px'}>
    <StyledTitle>Connecting to your node...</StyledTitle>
    <Section padding={'16px 0 0'}>
      <LoadingCard noCard={true} />
    </Section>
  </Section>
);
