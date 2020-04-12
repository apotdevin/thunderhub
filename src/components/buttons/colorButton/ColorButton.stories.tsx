import React from 'react';
import { action } from '@storybook/addon-actions';
import { ColorButton } from './ColorButton';
import { text, boolean, color } from '@storybook/addon-knobs';

export default {
  title: 'Color Button',
};

export const Default = () => {
  const withColor = boolean('With Color', false);

  const buttonColor = withColor ? { color: color('Color', 'yellow') } : {};

  return (
    <ColorButton
      {...buttonColor}
      loading={boolean('Loading', false)}
      disabled={boolean('Disabled', false)}
      arrow={boolean('With Arrow', false)}
      selected={boolean('Selected', false)}
      onClick={action('clicked')}
      withMargin={text('Margin', '')}
      withBorder={boolean('With Border', false)}
      fullWidth={boolean('Full Width', false)}
      width={text('Width', '')}
    >
      {text('Text', 'Button')}
    </ColorButton>
  );
};
