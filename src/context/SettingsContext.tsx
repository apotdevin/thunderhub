import React, { createContext, useState, useContext, useEffect } from 'react';
import merge from 'lodash.merge';

interface ChangeProps {
  theme?: string;
  sidebar?: boolean;
  currency?: string;
  nodeInfo?: boolean;
}

interface SettingsProps {
  currency: string;
  theme: string;
  sidebar: boolean;
  nodeInfo: boolean;
  setSettings: (newProps: ChangeProps) => void;
  refreshSettings: () => void;
}

export const SettingsContext = createContext<SettingsProps>({
  currency: '',
  theme: '',
  sidebar: true,
  nodeInfo: false,
  setSettings: () => {},
  refreshSettings: () => {},
});

const SettingsProvider = ({ children }: any) => {
  // const savedTheme = localStorage.getItem('theme') || 'light';
  // const savedSidebar = localStorage.getItem('sidebar') === 'false' ? false : true;
  // const savedCurrency = localStorage.getItem('currency') || 'sat';
  // const savedNodeInfo = localStorage.getItem('nodeInfo') === 'true' ? true : false;

  useEffect(() => {
    refreshSettings();
  }, []);

  const refreshSettings = (account?: string) => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedSidebar =
      localStorage.getItem('sidebar') === 'false' ? false : true;
    const savedCurrency = localStorage.getItem('currency') || 'sat';
    const savedNodeInfo =
      localStorage.getItem('nodeInfo') === 'true' ? true : false;

    updateSettings((prevState: any) => {
      const newState = { ...prevState };
      return merge(newState, {
        currency: savedCurrency,
        theme: savedTheme,
        sidebar: savedSidebar,
        nodeInfo: savedNodeInfo,
      });
    });
  };

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
    currency: 'sat',
    theme: 'dark',
    sidebar: true,
    nodeInfo: false,
    setSettings,
    refreshSettings,
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
