import React from 'react';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';
import { RebalanceProvider } from './RebalanceContext';

export const ContextProvider: React.FC = ({ children }) => (
  <PriceProvider>
    <ChatProvider>
      <RebalanceProvider>{children}</RebalanceProvider>
    </ChatProvider>
  </PriceProvider>
);
