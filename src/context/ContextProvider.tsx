import React from 'react';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';
import { RebalanceProvider } from './RebalanceContext';
import { DashProvider } from './DashContext';

export const ContextProvider: React.FC = ({ children }) => (
  <DashProvider>
    <PriceProvider>
      <ChatProvider>
        <RebalanceProvider>{children}</RebalanceProvider>
      </ChatProvider>
    </PriceProvider>
  </DashProvider>
);
