import React from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import { select, boolean } from '@storybook/addon-knobs';
import { backgroundColor, cardColor } from '../src/styles/Themes';

const StyledBackground = styled.div`
  width: 100%;
  height: 100%;
  padding: 100px 0;
  ${({ withBackground, cardBackground }) =>
    withBackground &&
    css`
      background: ${cardBackground ? cardColor : backgroundColor};
    `}
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ThemeDecorator = storyFn => {
  const background = boolean('No Background', false);
  const cardBackground = boolean('Card Background', true);
  return (
    <ThemeProvider theme={{ mode: select('Theme', ['dark', 'light'], 'dark') }}>
      <StyledBackground
        withBackground={!background}
        cardBackground={cardBackground}
      >
        {storyFn()}
      </StyledBackground>
    </ThemeProvider>
  );
};

export default ThemeDecorator;
