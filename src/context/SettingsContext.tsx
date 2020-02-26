import React, { createContext, useState, useContext } from 'react';
import merge from 'lodash.merge';

interface ChangeProps {
    theme?: string;
    sidebar?: boolean;
    currency?: string;
}

interface SettingsProps {
    currency: string;
    theme: string;
    sidebar: boolean;
    setSettings: (newProps: ChangeProps) => void;
}

export const SettingsContext = createContext<SettingsProps>({
    currency: '',
    theme: '',
    sidebar: true,
    setSettings: () => {},
});

const SettingsProvider = ({ children }: any) => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedSidebar =
        localStorage.getItem('sidebar') === 'false' ? false : true;
    const savedCurrency = localStorage.getItem('currency') || 'sat';

    const setSettings = ({ currency, theme, sidebar }: ChangeProps) => {
        updateSettings((prevState: any) => {
            const newState = { ...prevState };
            return merge(newState, {
                currency,
                theme,
                sidebar,
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
