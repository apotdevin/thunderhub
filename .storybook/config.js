import { configure, addDecorator, addParameters } from '@storybook/react';
import themeDecorator from './themeDecorator';
import { withKnobs } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  smallScreen: {
    name: 'Small Screen',
    styles: {
      width: '578px',
      height: '100%',
    },
  },
};

addParameters({
  viewport: {
    viewports: { ...INITIAL_VIEWPORTS, ...customViewports },
  },
});
addDecorator(themeDecorator);
addDecorator(withKnobs);

configure(require.context('../src/', true, /\.stories\.tsx?$/), module);
