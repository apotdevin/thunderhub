import React from 'react';
import { action } from '@storybook/addon-actions';
import { select, color, boolean, text } from '@storybook/addon-knobs';
import { Input } from './Input';

export default {
    title: 'Input',
};

export const Default = () => {
    const withColor = boolean('With Color', false);

    const buttonColor = withColor ? { color: color('Color', 'yellow') } : {};

    return (
        <Input
            {...buttonColor}
            placeholder={text('Placeholder', 'placeholder')}
            fullWidth={boolean('Full Width', false)}
            type={select('Type', ['normal', 'number'], 'normal')}
            onChange={action('change')}
        />
    );
};
