import React from 'react';
import { AccountProvider } from './AccountContext';
import { SettingsProvider } from './SettingsContext';
import { BitcoinInfoProvider } from './BitcoinContext';
import { StatusProvider } from './StatusContext';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';

export const ContextProvider: React.FC = ({ children }) => (
  <AccountProvider>
    <SettingsProvider>
      <BitcoinInfoProvider>
        <PriceProvider>
          <ChatProvider>
            <StatusProvider>{children}</StatusProvider>
          </ChatProvider>
        </PriceProvider>
      </BitcoinInfoProvider>
    </SettingsProvider>
  </AccountProvider>
);
