import React from 'react';
import { CardWithTitle, SubTitle, Card } from '../../components/generic/Styled';
import { SettingsLine, ButtonRow } from './Settings';
import { useSettings } from '../../context/SettingsContext';

import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { colorButtonBorder } from '../../styles/Themes';

export const InterfaceSettings = () => {
    const { setSettings, theme, updateCurrency } = useSettings();
    const cTheme = localStorage.getItem('theme') || 'light';
    const cCurrency = localStorage.getItem('currency') || 'sat';

    const renderButton = (
        title: string,
        value: string,
        type: string,
        current: string,
    ) => (
        <ColorButton
            withMargin={'0 0 0 8px'}
            color={colorButtonBorder[theme]}
            selected={current === value}
            onClick={() => {
                localStorage.setItem(type, value);
                type === 'theme' && setSettings({ theme: value });
                type === 'currency' && updateCurrency({ currency: value });
            }}
        >
            {title}
        </ColorButton>
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
                        {renderButton(
                            'US Dollar',
                            'USD',
                            'currency',
                            cCurrency,
                        )}
                    </ButtonRow>
                </SettingsLine>
            </Card>
        </CardWithTitle>
    );
};
