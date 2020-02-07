import React from 'react';
import { AccountProvider } from './AccountContext';
import { SettingsProvider } from './SettingsContext';
import { BitcoinInfoProvider } from './BitcoinContext';
import { ConnectionProvider } from './ConnectionContext';

export const ContextProvider: React.FC = ({ children }) => (
    <AccountProvider>
        <SettingsProvider>
            <BitcoinInfoProvider>
                <ConnectionProvider>{children}</ConnectionProvider>
            </BitcoinInfoProvider>
        </SettingsProvider>
    </AccountProvider>
);
