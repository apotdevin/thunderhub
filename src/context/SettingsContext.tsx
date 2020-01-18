import React, { createContext, useState, useContext } from 'react';
import merge from 'lodash.merge';

interface ChangeProps {
    price?: number;
    symbol?: string;
    currency?: string;
    theme?: string;
}

interface SettingsProps {
    price: number;
    symbol: string;
    currency: string;
    theme: string;
    setSettings: (newProps: ChangeProps) => void;
}

export const SettingsContext = createContext<SettingsProps>({
    price: 0,
    symbol: '',
    currency: '',
    theme: '',
    setSettings: () => {},
});

const SettingsProvider = ({ children }: any) => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedCurrency = localStorage.getItem('currency') || 'sat';

    const setSettings = ({ price, symbol, currency, theme }: ChangeProps) => {
        updateSettings((prevState: any) => {
            const newState = { ...prevState };
            return merge(newState, {
                price,
                symbol,
                currency,
                theme,
            });
        });
    };

    const settingsState = {
        price: 0,
        symbol: '',
        currency: savedCurrency,
        theme: savedTheme,
        setSettings,
    };

    const [settings, updateSettings] = useState(settingsState);

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
};

const useSettings = () => useContext(SettingsContext);

export { SettingsProvider, useSettings };
