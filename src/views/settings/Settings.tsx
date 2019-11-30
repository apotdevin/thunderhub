import React, { useContext, useState } from 'react';
import { Card } from '../../components/generic/Styled';
import { SettingsContext } from '../../context/SettingsContext';
import { getStorageSaved, getNextAvailable } from '../../utils/storage';
import { AccountContext } from '../../context/AccountContext';
import { LoginForm } from '../../components/auth/NormalLogin';
import { ConnectLoginForm } from '../../components/auth/ConnectLogin';

export const SettingsView = () => {
    const [willAdd, setWillAdd] = useState(false);
    const { theme, currency, setSettings } = useContext(SettingsContext);
    const { changeAccount } = useContext(AccountContext);

    const available = getNextAvailable();

    return (
        <Card>
            <div>
                Theme: {theme}
                <button
                    onClick={() => {
                        localStorage.setItem('theme', 'light');
                        setSettings({ theme: 'light' });
                    }}
                >
                    Light theme
                </button>
                <button
                    onClick={() => {
                        localStorage.setItem('theme', 'dark');
                        setSettings({ theme: 'dark' });
                    }}
                >
                    Dark theme
                </button>
            </div>
            <div>
                Currency: {currency}
                <button
                    onClick={() => {
                        localStorage.setItem('currency', 'btc');
                        setSettings({ currency: 'btc' });
                    }}
                >
                    BTC
                </button>
                <button
                    onClick={() => {
                        localStorage.setItem('currency', 'sat');
                        setSettings({ currency: 'sat' });
                    }}
                >
                    SAT
                </button>
                <button
                    onClick={() => {
                        localStorage.setItem('currency', 'EUR');
                        setSettings({ currency: 'EUR' });
                    }}
                >
                    EUR
                </button>
            </div>
            <div>
                Change Account
                {getStorageSaved().map((entry, index) => {
                    return (
                        <button
                            onClick={() => changeAccount(entry.index)}
                            key={index}
                        >
                            {entry.index}
                            {entry.name}
                        </button>
                    );
                })}
            </div>
            <div>
                Delete Account
                {getStorageSaved().map((entry, index) => {
                    return (
                        <button
                            onClick={() =>
                                localStorage.removeItem(`auth${entry.index}`)
                            }
                            key={index}
                        >
                            {entry.index}
                            {entry.name}
                        </button>
                    );
                })}
            </div>
            {available && (
                <div>
                    Add Account
                    <button onClick={() => setWillAdd(prev => !prev)}>
                        {willAdd ? 'Cancel' : 'Add New Account'}
                    </button>
                    {willAdd && (
                        <>
                            <LoginForm available={available} />
                            <ConnectLoginForm available={available} />
                        </>
                    )}
                </div>
            )}
        </Card>
    );
};
