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
    const { price, symbol, currency } = useSettings();

    const priceProps = { price, symbol, currency };

    const getFormat = (amount: number) =>
        getValue({ amount, ...priceProps, breakNumber });

    return <>{getFormat(amount)}</>;
};
