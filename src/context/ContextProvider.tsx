import React from 'react';
import { AccountProvider } from './AccountContext';
import { SettingsProvider } from './SettingsContext';
import { BitcoinInfoProvider } from './BitcoinContext';
import { StatusProvider } from './StatusContext';
import { PriceProvider } from './PriceContext';

export const ContextProvider: React.FC = ({ children }) => (
  <AccountProvider>
    <SettingsProvider>
      <BitcoinInfoProvider>
        <PriceProvider>
          <StatusProvider>{children}</StatusProvider>
        </PriceProvider>
      </BitcoinInfoProvider>
    </SettingsProvider>
  </AccountProvider>
);
