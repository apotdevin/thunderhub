import { chartColors, themeColors } from 'src/styles/Themes';

export const getTitleColor = (
  active: boolean,
  opening: boolean,
  closing: boolean,
  isBosNode: boolean
): string | undefined => {
  switch (true) {
    case !active:
      return 'red';
    case opening:
    case closing:
      return themeColors.blue2;
    case isBosNode && active:
      return chartColors.darkyellow;
    default:
      return undefined;
  }
};
