import { themeColors } from 'src/styles/Themes';

export const getTitleColor = (
  active: boolean,
  opening: boolean,
  closing: boolean
): string | undefined => {
  switch (true) {
    case active:
      return undefined;
    case opening:
    case closing:
      return themeColors.blue2;
    default:
      return 'red';
  }
};
