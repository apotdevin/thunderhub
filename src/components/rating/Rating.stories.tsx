import React from 'react';
import { number } from '@storybook/addon-knobs';
import { Rating } from './Rating';

export default {
  title: 'Ratings',
};

export const Default = () => {
  const options = {
    range: true,
    min: 0,
    max: 10,
    step: 1,
  };

  const rating = number('Rating', 5, options);

  return <Rating rating={rating / 10} />;
};
