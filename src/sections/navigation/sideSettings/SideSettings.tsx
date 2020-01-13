import React from 'react';
import { Separation } from '../../../components/generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import { IconCircle, Sun, Moon } from '../../../components/generic/Icons';
import styled from 'styled-components';
import { iconButtonBack } from '../../../styles/Themes';

const SelectedIcon = styled(IconCircle)`
    margin: 0 5px;
    cursor: pointer;
    background-color: ${({ selected }: { selected: boolean }) =>
        selected ? iconButtonBack : ''};
`;

const Symbol = styled.div`
    margin: -3px 0 0 0;
    font-weight: bold;
`;

const IconRow = styled.div`
    margin: 5px 0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const SideSettings = () => {
    const { theme, currency, setSettings } = useSettings();

    return (
        <>
            <Separation />
            <IconRow>
                <SelectedIcon
                    selected={currency === 'sat'}
                    onClick={() => {
                        localStorage.setItem('currency', 'sat');
                        setSettings({ currency: 'sat' });
                    }}
                >
                    <Symbol>S</Symbol>
                </SelectedIcon>
                <SelectedIcon
                    selected={currency === 'btc'}
                    onClick={() => {
                        localStorage.setItem('currency', 'btc');
                        setSettings({ currency: 'btc' });
                    }}
                >
                    <Symbol>₿</Symbol>
                </SelectedIcon>
                <SelectedIcon
                    selected={currency === 'EUR'}
                    onClick={() => {
                        localStorage.setItem('currency', 'EUR');
                        setSettings({ currency: 'EUR' });
                    }}
                >
                    <Symbol>€</Symbol>
                </SelectedIcon>
            </IconRow>
            <IconRow>
                <SelectedIcon
                    selected={theme === 'light'}
                    onClick={() => {
                        localStorage.setItem('theme', 'light');
                        setSettings({ theme: 'light' });
                    }}
                >
                    <Sun />
                </SelectedIcon>
                <SelectedIcon
                    selected={theme === 'dark'}
                    onClick={() => {
                        localStorage.setItem('theme', 'dark');
                        setSettings({ theme: 'dark' });
                    }}
                >
                    <Moon />
                </SelectedIcon>
            </IconRow>
        </>
    );
};
