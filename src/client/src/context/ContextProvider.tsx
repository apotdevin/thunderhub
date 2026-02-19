import { FC, ReactNode } from 'react';
import { PriceProvider } from './PriceContext';
import { ChatProvider } from './ChatContext';
import { DashProvider } from './DashContext';
import { NotificationProvider } from './NotificationContext';

export const ContextProvider: FC<{ children?: ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <DashProvider>
      <PriceProvider>
        <ChatProvider>{children}</ChatProvider>
      </PriceProvider>
    </DashProvider>
  </NotificationProvider>
);
