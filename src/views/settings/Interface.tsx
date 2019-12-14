import React from 'react';
import { CardWithTitle, SubTitle, Card } from '../../components/generic/Styled';
import { SettingsLine, ButtonRow, SettingsButton } from './Settings';
import { useSettings } from '../../context/SettingsContext';

export const InterfaceSettings = () => {
    const { setSettings } = useSettings();
    const cTheme = localStorage.getItem('theme') || 'dark';
    const cCurrency = localStorage.getItem('currency') || 'sat';

    const renderButton = (
        title: string,
        value: string,
        type: string,
        current: string,
    ) => (
        <SettingsButton
            enabled={current === value}
            onClick={() => {
                localStorage.setItem(type, value);
                setSettings({ [type]: value });
            }}
        >
            {title}
        </SettingsButton>
    );

    return (
        <CardWithTitle>
            <SubTitle>Interface</SubTitle>
            <Card>
                <SettingsLine>
                    <SubTitle>Theme:</SubTitle>
                    <ButtonRow>
                        {renderButton('Light', 'light', 'theme', cTheme)}
                        {renderButton('Dark', 'dark', 'theme', cTheme)}
                    </ButtonRow>
                </SettingsLine>
                <SettingsLine>
                    <SubTitle>Currency:</SubTitle>
                    <ButtonRow>
                        {renderButton('Bitcoin', 'btc', 'currency', cCurrency)}
                        {renderButton('Satoshis', 'sat', 'currency', cCurrency)}
                        {renderButton('Euro', 'EUR', 'currency', cCurrency)}
                    </ButtonRow>
                </SettingsLine>
            </Card>
        </CardWithTitle>
    );
};
