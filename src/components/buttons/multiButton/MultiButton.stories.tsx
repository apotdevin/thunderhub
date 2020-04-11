import React, { useState } from 'react';
import { boolean, color } from '@storybook/addon-knobs';
import { MultiButton, SingleButton } from './MultiButton';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Multi Button',
};

export const Default = () => {
  const withColor = boolean('With Color', false);

  const buttonColor = withColor ? { color: color('Color', 'yellow') } : {};

  const [selected, setSelected] = useState(0);

  return (
    <MultiButton>
      <SingleButton
        {...buttonColor}
        selected={selected === 0}
        onClick={() => {
          action('Button 1 clicked')();
          setSelected(0);
        }}
      >
        Button 1
      </SingleButton>
      <SingleButton
        {...buttonColor}
        selected={selected === 1}
        onClick={() => {
          action('Button 2 clicked')();
          setSelected(1);
        }}
      >
        Button 2
      </SingleButton>
      <SingleButton
        {...buttonColor}
        selected={selected === 2}
        onClick={() => {
          action('Button 3 clicked')();
          setSelected(2);
        }}
      >
        Button 3
      </SingleButton>
    </MultiButton>
  );
};
