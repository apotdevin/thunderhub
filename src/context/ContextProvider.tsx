import React from 'react';
import { AccountProvider } from './AccountContext';
import { AccountProvider as NewAccountProvider } from './NewAccountContext';
import { BitcoinInfoProvider } from './BitcoinContext';
import { StatusProvider } from './StatusContext';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';

export const ContextProvider: React.FC = ({ children }) => (
  <NewAccountProvider>
    <AccountProvider>
      <BitcoinInfoProvider>
        <PriceProvider>
          <ChatProvider>
            <StatusProvider>{children}</StatusProvider>
          </ChatProvider>
        </PriceProvider>
      </BitcoinInfoProvider>
    </AccountProvider>
  </NewAccountProvider>
);
