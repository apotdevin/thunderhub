import React, { createContext, useState, useContext } from 'react';
import merge from 'lodash.merge';

interface PriceProps {
    last: number;
    symbol: string;
}
interface CurrencyChangeProps {
    currency: string;
}

interface ChangeProps {
    prices?: { [key: string]: PriceProps };
    theme?: string;
    sidebar?: boolean;
}

interface SettingsProps {
    prices: { [key: string]: PriceProps };
    price: number;
    symbol: string;
    currency: string;
    theme: string;
    sidebar: boolean;
    setSettings: (newProps: ChangeProps) => void;
    updateCurrency: (newProps: CurrencyChangeProps) => void;
}

export const SettingsContext = createContext<SettingsProps>({
    prices: {},
    price: 0,
    symbol: '',
    currency: '',
    theme: '',
    sidebar: true,
    setSettings: () => {},
    updateCurrency: () => {},
});

const SettingsProvider = ({ children }: any) => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedSidebar =
        localStorage.getItem('sidebar') === 'false' ? false : true;
    const savedCurrency = localStorage.getItem('currency') || 'sat';

    const setSettings = ({ prices, theme, sidebar }: ChangeProps) => {
        let price = 0;
        let symbol = '';

        const lookupCurrency =
            savedCurrency === 'sat' || savedCurrency === 'btc'
                ? 'EUR'
                : savedCurrency;

        if (prices && prices[lookupCurrency]) {
            price = prices[lookupCurrency].last;
            symbol = prices[lookupCurrency].symbol;
        }

        updateSettings((prevState: any) => {
            const newState = { ...prevState };
            return merge(newState, {
                prices,
                ...(prices && { price, symbol }),
                theme,
                sidebar,
            });
        });
    };

    const updateCurrency = ({ currency }: CurrencyChangeProps) => {
        const prices: { [key: string]: PriceProps } = settings?.prices;
        let price = 0;
        let symbol = '';
        let isFiat = false;

        if (
            prices &&
            currency !== 'sat' &&
            currency !== 'btc' &&
            prices[currency]
        ) {
            price = prices[currency].last;
            symbol = prices[currency].symbol;
            isFiat = true;
        }

        console.log(price, symbol, isFiat);

        updateSettings((prevState: any) => {
            const newState = { ...prevState };
            return merge(newState, {
                ...(isFiat && { price, symbol }),
                currency,
            });
        });
    };

    const settingsState = {
        prices: { EUR: { last: 0, symbol: '€' } },
        price: 0,
        symbol: '',
        currency: savedCurrency,
        theme: savedTheme,
        sidebar: savedSidebar,
        setSettings,
        updateCurrency,
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
