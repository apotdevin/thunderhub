import theme from 'styled-theming';

export const themeColors = {
  white: '#fff',
  grey: '#f5f6f9',
  grey2: '#f0f2f8',
  grey3: '#e1e6ed',
  grey7: '#b0b3c7',
  grey8: '#4a5669',
  blue2: '#6284e4',
  blue3: '#5163ba',
  blue4: '#20263d',
  blue5: '#181c30',
  blue6: '#1a1f35',
  blue7: '#151727',
  black: '#212735',
};

export const chartColors = {
  darkyellow: '#ffd300',
  orange: '#ffa940',
  orange2: '#FD5F00',
  lightblue: '#1890ff',
  green: '#a0d911',
  purple: '#6938f1',
  red: 'red',
};

export const fontColors = {
  white: '#fff',
  grey3: '#e1e6ed',
  grey4: '#6e7887',
  grey5: '#5e6575',
  grey6: '#667587',
  grey7: '#b0b3c7',
  grey8: '#4a5669',
  blue: '#ccd0e7',
  blue1: '#9197b9',
  blue2: '#6284e4',
  blue3: '#5163ba',
  black: '#212735',
};

export const mediaDimensions = {
  mobile: 700,
};
export const mediaWidths = {
  mobile: `max-width: ${mediaDimensions.mobile}px`,
};

// ---------------------------------------
// APP COLORS
// ---------------------------------------
export const backgroundColor = theme('mode', {
  light: themeColors.grey,
  dark: themeColors.blue5,
});

export const textColor = theme('mode', {
  light: fontColors.black,
  dark: fontColors.white,
});

export const textColorMap: { [key: string]: string } = {
  light: fontColors.black,
  dark: fontColors.white,
};

export const inverseTextColor = theme('mode', {
  light: fontColors.white,
  dark: fontColors.black,
});

export const burgerColor = theme('mode', {
  light: themeColors.white,
  dark: themeColors.blue6,
});

export const linkHighlight = theme('mode', {
  light: fontColors.blue3,
  dark: fontColors.blue3,
});

export const separationColor = theme('mode', {
  light: themeColors.grey2,
  dark: themeColors.black,
});

export const unSelectedNavButton = theme('mode', {
  light: 'grey',
  dark: 'grey',
});

export const buttonBorderColor = theme('mode', {
  light: '#d9d9d9',
  dark: '#2e3245',
});

// ---------------------------------------
// HOMEPAGE COLORS
// ---------------------------------------
export const headerColor = theme('mode', {
  light: themeColors.blue7,
  dark: themeColors.blue7,
});

export const headerTextColor = theme('mode', {
  light: fontColors.white,
  dark: fontColors.white,
});

export const homeBackgroundColor = theme('mode', {
  light: themeColors.grey,
  dark: themeColors.grey,
});

export const homeBackgroundSecondColor = theme('mode', {
  light: themeColors.grey2,
  dark: themeColors.grey2,
});

export const homeCompatibleColor = theme('mode', {
  light: themeColors.blue5,
  dark: themeColors.blue5,
});

// ---------------------------------------
// CARD COLORS
// ---------------------------------------
export const cardColor = theme('mode', {
  light: themeColors.white,
  dark: themeColors.blue6,
});

export const subCardColor = theme('mode', {
  light: themeColors.white,
  dark: themeColors.blue7,
});

export const cardBorderColor = theme('mode', {
  light: themeColors.grey2,
  dark: themeColors.blue4,
});

// ---------------------------------------
// BUTTON COLORS
// ---------------------------------------
export const colorButtonBackground = theme('mode', {
  light: themeColors.grey,
  dark: themeColors.blue7,
});

export const colorButtonBorder = theme('mode', {
  light: themeColors.blue3,
  dark: themeColors.blue3,
});

export const colorButtonBorderTwo = theme('mode', {
  light: themeColors.grey2,
  dark: themeColors.blue7,
});

export const disabledButtonBackground = theme('mode', {
  light: themeColors.grey2,
  dark: themeColors.blue7,
});

export const disabledButtonBorder = theme('mode', {
  light: themeColors.grey,
  dark: themeColors.blue6,
});

export const disabledTextColor = theme('mode', {
  light: fontColors.grey7,
  dark: fontColors.grey8,
});

export const hoverTextColor = theme('mode', {
  light: fontColors.white,
  dark: fontColors.white,
});

// ---------------------------------------
// MULTI BUTTON COLORS
// ---------------------------------------
export const multiButtonColor = theme('mode', {
  light: themeColors.grey2,
  dark: themeColors.blue7,
});

export const multiSelectColor = theme('mode', {
  light: fontColors.black,
  dark: fontColors.white,
});

// ---------------------------------------
// NAVIGATION COLORS
// ---------------------------------------
export const navBackgroundColor = theme('mode', {
  light: themeColors.white,
  dark: themeColors.blue7,
});

export const navTextColor = theme('mode', {
  light: fontColors.black,
  dark: fontColors.white,
});

// ---------------------------------------
// INPUT COLORS
// ---------------------------------------
export const inputBackgroundColor = theme('mode', {
  light: themeColors.grey,
  dark: themeColors.blue5,
});

export const inputBorderColor = theme('mode', {
  light: themeColors.grey3,
  dark: themeColors.grey8,
});

// ---------------------------------------
// ICON COLORS
// ---------------------------------------
export const iconButtonHover = theme('mode', {
  light: themeColors.blue3,
  dark: themeColors.grey,
});

export const smallLinkColor = theme('mode', {
  light: '#9254de',
  dark: '#adc6ff',
});

// ---------------------------------------
// PROGRESS BAR COLORS
// ---------------------------------------
export const progressBackground = theme('mode', {
  light: themeColors.grey3,
  dark: themeColors.black,
});

export const progressFirst = theme('mode', {
  light: chartColors.orange,
  dark: chartColors.orange,
});

export const progressSecond = theme('mode', {
  light: chartColors.lightblue,
  dark: chartColors.lightblue,
});

// ---------------------------------------
// CHART COLORS
// ---------------------------------------
export const chartLinkColor = theme('mode', {
  light: '#595959',
  dark: '#8c8c8c',
});

export const chartAxisColor: { [key: string]: string } = {
  light: '#1b1c22',
  dark: 'white',
};

export const chartGridColor: { [key: string]: string } = {
  light: '#e8e8e8',
  dark: '#595959',
};

export const chartBarColor: { [key: string]: string } = {
  light: chartColors.purple,
  dark: chartColors.purple,
};

// ---------------------------------------
// Liquidity Report Bar Colors
// ---------------------------------------
export const liquidityBarColor: { [key: string]: string } = {
  light: chartColors.green,
  dark: chartColors.green,
};

// ---------------------------------------
// Flow Report Bar Colors
// ---------------------------------------
export const flowBarColor: { [key: string]: string } = {
  light: chartColors.orange2,
  dark: chartColors.orange2,
};
export const flowBarColor2: { [key: string]: string } = {
  light: chartColors.darkyellow,
  dark: chartColors.darkyellow,
};
