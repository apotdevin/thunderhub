import React from 'react';
import { Separation } from '../../../components/generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import {
    Sun,
    Moon,
    ChevronLeft,
    ChevronRight,
} from '../../../components/generic/Icons';
import styled from 'styled-components';
import {
    progressBackground,
    iconButtonHover,
    inverseTextColor,
} from '../../../styles/Themes';

const IconCircle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 100%;

    &:hover {
        background-color: ${iconButtonHover};
        color: ${inverseTextColor};
    }
`;

const SelectedIcon = styled(IconCircle)`
    margin: 0 5px;
    cursor: pointer;
    background-color: ${({ selected }: { selected: boolean }) =>
        selected ? progressBackground : ''};
`;

const Symbol = styled.div`
    margin-top: 2px;
    font-weight: bold;
`;

const IconRow = styled.div`
    margin: 5px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    ${({ center }: { center?: boolean }) => center && 'width: 100%'}
`;

const currencyArray = ['sat', 'btc', 'EUR', 'USD'];
const themeArray = ['light', 'dark'];
const currencyMap: { [key: string]: string } = {
    sat: 'S',
    btc: '₿',
    EUR: '€',
    USD: '$',
};
const themeMap: { [key: string]: string } = {
    light: Sun,
    dark: Moon,
};

const getNextValue = (array: string[], current: string): string => {
    const length = array.length;
    const index = array.indexOf(current);

    let value = '';
    if (index + 1 === length) {
        value = array[0];
    } else {
        value = array[index + 1];
    }

    return value;
};

type fn = (prev: boolean) => boolean;

interface SideSettingsProps {
    isOpen: boolean;
    setIsOpen: (state: fn) => void;
}

export const SideSettings = ({ isOpen, setIsOpen }: SideSettingsProps) => {
    const { theme, currency, updateCurrency, setSettings } = useSettings();

    const renderIcon = (
        type: string,
        value: string,
        text: string,
        on: boolean = false,
        Icon?: any,
    ) => (
        <SelectedIcon
            selected={
                (type === 'currency' ? currency === value : theme === value) ||
                on
            }
            onClick={() => {
                localStorage.setItem(type, value);
                type === 'currency' &&
                    updateCurrency({
                        currency: getNextValue(currencyArray, value),
                    });
                type === 'theme' && setSettings({ theme: value });
            }}
        >
            {type === 'currency' && <Symbol>{text}</Symbol>}
            {type === 'theme' && <Icon />}
        </SelectedIcon>
    );

    const renderContent = () => {
        if (!isOpen) {
            return (
                <>
                    <Separation />
                    <IconRow center={true}>
                        {renderIcon(
                            'currency',
                            currency,
                            currencyMap[currency],
                            true,
                        )}
                    </IconRow>
                    <IconRow center={true}>
                        {renderIcon(
                            'theme',
                            getNextValue(themeArray, theme),
                            '',
                            true,
                            themeMap[getNextValue(themeArray, theme)],
                        )}
                    </IconRow>
                </>
            );
        } else {
            return (
                <>
                    <Separation />
                    <IconRow>
                        {renderIcon('currency', 'sat', 'S')}
                        {renderIcon('currency', 'btc', '₿')}
                        {renderIcon('currency', 'EUR', '€')}
                        {renderIcon('currency', 'USD', '$')}
                    </IconRow>
                    <IconRow>
                        {renderIcon('theme', 'light', '', false, Sun)}
                        {renderIcon('theme', 'dark', '', false, Moon)}
                    </IconRow>
                </>
            );
        }
    };

    return (
        <>
            {renderContent()}
            <IconRow center={!isOpen}>
                <SelectedIcon
                    selected={true}
                    onClick={() => {
                        setIsOpen(prev => !prev);
                    }}
                >
                    {isOpen ? <ChevronLeft /> : <ChevronRight />}
                </SelectedIcon>
            </IconRow>
        </>
    );
};
