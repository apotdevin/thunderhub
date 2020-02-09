import React from 'react';
import { AccountProvider } from './AccountContext';
import { SettingsProvider } from './SettingsContext';
import { BitcoinInfoProvider } from './BitcoinContext';
import { ConnectionProvider } from './ConnectionContext';
import { StatusProvider } from './StatusContext';

export const ContextProvider: React.FC = ({ children }) => (
    <AccountProvider>
        <SettingsProvider>
            <BitcoinInfoProvider>
                <ConnectionProvider>
                    <StatusProvider>{children}</StatusProvider>
                </ConnectionProvider>
            </BitcoinInfoProvider>
        </SettingsProvider>
    </AccountProvider>
);
