import React from 'react';
import { AccountProvider } from './AccountContext';
import { BitcoinInfoProvider } from './BitcoinContext';
import { StatusProvider } from './StatusContext';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';
import { RebalanceProvider } from './RebalanceContext';

export const ContextProvider: React.FC = ({ children }) => (
  <AccountProvider>
    <BitcoinInfoProvider>
      <PriceProvider>
        <ChatProvider>
          <StatusProvider>
            <RebalanceProvider>{children}</RebalanceProvider>
          </StatusProvider>
        </ChatProvider>
      </PriceProvider>
    </BitcoinInfoProvider>
  </AccountProvider>
);
