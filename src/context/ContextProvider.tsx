import React from 'react';
import { AccountProvider } from './AccountContext';
import { ConfigProvider } from './ConfigContext';
import { BitcoinInfoProvider } from './BitcoinContext';
import { StatusProvider } from './StatusContext';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';

export const ContextProvider: React.FC = ({ children }) => (
  <AccountProvider>
    <ConfigProvider>
      <BitcoinInfoProvider>
        <PriceProvider>
          <ChatProvider>
            <StatusProvider>{children}</StatusProvider>
          </ChatProvider>
        </PriceProvider>
      </BitcoinInfoProvider>
    </ConfigProvider>
  </AccountProvider>
);
