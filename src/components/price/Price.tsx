import React from 'react';
import { useSettings } from 'context/SettingsContext';
import { getValue } from 'helpers/Helpers';

export const Price = ({
    amount,
    breakNumber = false,
}: {
    amount: number;
    breakNumber?: boolean;
}) => {
    const { currency, prices } = useSettings();

    const current: { last: number; symbol: string } = prices[currency] ?? {
        last: 0,
        symbol: '',
    };
    const priceProps = {
        price: current.last,
        symbol: current.symbol,
        currency,
    };

    const getFormat = (amount: number) =>
        getValue({ amount, ...priceProps, breakNumber });

    return <>{getFormat(amount)}</>;
};
