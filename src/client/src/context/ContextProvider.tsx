import { FC, ReactNode } from 'react';
import { PriceProvider } from './PriceContext';
import { DashProvider } from './DashContext';
import { NotificationProvider } from './NotificationContext';

export const ContextProvider: FC<{ children?: ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <DashProvider>
      <PriceProvider>{children}</PriceProvider>
    </DashProvider>
  </NotificationProvider>
);
