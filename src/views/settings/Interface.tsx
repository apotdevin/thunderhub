import React from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    Sub4Title,
} from '../../components/generic/Styled';
import { SettingsLine } from './Settings';
import { useSettings } from '../../context/SettingsContext';

import {
    MultiButton,
    SingleButton,
} from 'components/buttons/multiButton/MultiButton';

export const InterfaceSettings = () => {
    const { setSettings, updateCurrency } = useSettings();
    const cTheme = localStorage.getItem('theme') || 'light';
    const cCurrency = localStorage.getItem('currency') || 'sat';

    const renderButton = (
        title: string,
        value: string,
        type: string,
        current: string,
    ) => (
        <SingleButton
            selected={current === value}
            onClick={() => {
                localStorage.setItem(type, value);
                type === 'theme' && setSettings({ theme: value });
                type === 'currency' && updateCurrency({ currency: value });
            }}
        >
            {title}
        </SingleButton>
    );

    return (
        <CardWithTitle>
            <SubTitle>Interface</SubTitle>
            <Card>
                <SettingsLine>
                    <Sub4Title>Theme:</Sub4Title>
                    <MultiButton>
                        {renderButton('Light', 'light', 'theme', cTheme)}
                        {renderButton('Dark', 'dark', 'theme', cTheme)}
                    </MultiButton>
                </SettingsLine>
                <SettingsLine>
                    <Sub4Title>Currency:</Sub4Title>
                    <MultiButton margin={'0 0 0 16px'}>
                        {renderButton('Bitcoin', 'btc', 'currency', cCurrency)}
                        {renderButton('Satoshis', 'sat', 'currency', cCurrency)}
                        {renderButton('Euro', 'EUR', 'currency', cCurrency)}
                        {renderButton(
                            'US Dollar',
                            'USD',
                            'currency',
                            cCurrency,
                        )}
                    </MultiButton>
                </SettingsLine>
            </Card>
        </CardWithTitle>
    );
};
