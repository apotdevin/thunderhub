import React from 'react';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';
import { RebalanceProvider } from './RebalanceContext';
import { DashProvider } from './DashContext';
import { NotificationProvider } from './NotificationContext';

export const ContextProvider: React.FC = ({ children }) => (
  <NotificationProvider>
    <DashProvider>
      <PriceProvider>
        <ChatProvider>
          <RebalanceProvider>{children}</RebalanceProvider>
        </ChatProvider>
      </PriceProvider>
    </DashProvider>
  </NotificationProvider>
);
