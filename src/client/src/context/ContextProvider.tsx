import React, { ReactNode } from 'react';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';
import { RebalanceProvider } from './RebalanceContext';
import { DashProvider } from './DashContext';
import { NotificationProvider } from './NotificationContext';
import { GatewayProvider } from './GatewayContext';

export const ContextProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => (
  <NotificationProvider>
    <DashProvider>
      <PriceProvider>
        <ChatProvider>
          <RebalanceProvider>
            <GatewayProvider>{children}</GatewayProvider>
          </RebalanceProvider>
        </ChatProvider>
      </PriceProvider>
    </DashProvider>
  </NotificationProvider>
);
