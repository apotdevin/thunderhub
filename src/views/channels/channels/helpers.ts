import { extraColumnsType } from 'src/context/ConfigContext';
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

export const getColumnTemplate = (extraColumns: extraColumnsType) => {
  switch (extraColumns) {
    case 'incoming':
      return '2fr 2fr 80px';
    case 'outgoing':
      return '2fr 80px 2fr';
    case 'both':
      return '2fr 80px 2fr 80px';
    default:
      return undefined;
  }
};
