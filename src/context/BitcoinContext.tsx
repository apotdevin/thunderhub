import React, { createContext, useState, useContext } from 'react';
import merge from 'lodash.merge';

interface ChangeProps {
    fast?: number;
    halfHour?: number;
    hour?: number;
}

interface BitcoinProps {
    fast: number;
    halfHour: number;
    hour: number;
    setInfo: (newProps: ChangeProps) => void;
}

export const BitcoinInfoContext = createContext<BitcoinProps>({
    fast: 0,
    halfHour: 0,
    hour: 0,
    setInfo: () => {},
});

const BitcoinInfoProvider = ({ children }: any) => {
    const setInfo = ({ fast, halfHour, hour }: ChangeProps) => {
        updateSettings((prevState: any) => {
            const newState = { ...prevState };
            return merge(newState, {
                fast,
                halfHour,
                hour,
            });
        });
    };

    const bitcoinInfoState = {
        fast: 0,
        halfHour: 0,
        hour: 0,
        setInfo,
    };

    const [settings, updateSettings] = useState(bitcoinInfoState);

    return (
        <BitcoinInfoContext.Provider value={settings}>
            {children}
        </BitcoinInfoContext.Provider>
    );
};

const useBitcoinInfo = () => useContext(BitcoinInfoContext);

export { BitcoinInfoProvider, useBitcoinInfo };
