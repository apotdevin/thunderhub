import React from 'react';
import { text } from '@storybook/addon-knobs';
import { Link } from './Link';

export default {
  title: 'Link',
};

export const Default = () => {
  const linkText = text('Link Text', 'This is a link');

  return (
    <>
      <Link href={'google.com'}>{linkText}</Link>{' '}
      <Link to={'/'}>{linkText}</Link>
    </>
  );
};
