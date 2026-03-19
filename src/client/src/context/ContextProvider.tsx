import { FC, ReactNode } from 'react';
import { PriceProvider } from './PriceContext';
import { DashProvider } from './DashContext';
import { NotificationProvider } from './NotificationContext';
import { BoltzSwapProvider } from './BoltzSwapContext';

export const ContextProvider: FC<{ children?: ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <DashProvider>
      <PriceProvider>
        <BoltzSwapProvider>{children}</BoltzSwapProvider>
      </PriceProvider>
    </DashProvider>
  </NotificationProvider>
);
