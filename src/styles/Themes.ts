import theme from 'styled-theming';

export const backgroundColor = theme('mode', {
    light: '#f5f7fb',
    dark: '#151727',
});

export const textColor = theme('mode', {
    light: '262626',
    dark: '#EFFFFA',
});

export const cardColor = theme('mode', {
    light: '#ffffff',
    dark: '#1b1e32',
});

export const subCardColor = theme('mode', {
    light: 'white',
    dark: '#151727',
});

export const cardBorderColor = theme('mode', {
    light: '#f5f5f5',
    dark: '#242839',
});

export const progressBackground = theme('mode', {
    light: 'rgba(0, 0, 0, 0.05)',
    dark: 'rgba(0, 0, 0, 1)',
});

export const progressFirst = theme('mode', {
    light: '#ffa940',
    dark: '#ffa940',
});

export const progressSecond = theme('mode', {
    light: '#1890ff',
    dark: '#1890ff',
});

export const iconButtonColor = theme('mode', {
    light: 'black',
    dark: 'white',
});

export const iconButtonHover = theme('mode', {
    light: '#e8e8e8',
    dark: '#e8e8e8',
});

export const iconButtonBack = theme('mode', {
    light: '#f5f5f5',
    dark: '#0D0C1D',
});

export const smallLinkColor = theme('mode', {
    light: '#9254de',
    dark: '#adc6ff',
});

export const chartLinkColor = theme('mode', {
    light: '#595959',
    dark: '#8c8c8c',
});

export const chartSelectedLinkColor = theme('mode', {
    light: '#43DDE2',
    dark: '#6938f1',
});

export const unSelectedNavButton = theme('mode', {
    light: 'grey',
    dark: 'grey',
});

export const buttonBorderColor = theme('mode', {
    light: 'black',
    dark: '#2e3245',
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
    light: '#6938f1',
    dark: '#6938f1',
};

// Flow Report Bar Colors
export const flowBarColor: { [key: string]: string } = {
    light: '#FD5F00',
    dark: '#FD5F00',
};
export const flowBarColor2: { [key: string]: string } = {
    light: '#ffd300',
    dark: '#ffd300',
};
