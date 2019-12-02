import React, { FunctionComponent } from 'react';
import { Loader } from '../components/generic/Icons';

interface GetNumberProps {
    amount: string | number;
    price: number;
    symbol: string;
    currency: string;
}

export const getValue = ({
    amount,
    price,
    symbol,
    currency,
}: GetNumberProps): string => {
    let value: number = 0;
    if (typeof amount === 'string') {
        value = parseInt(amount);
    } else {
        value = amount;
    }

    if (currency === 'btc') {
        const amountInBtc = value / 100000000;
        return `₿${amountInBtc}`;
    } else if (currency === 'EUR') {
        const amountInFiat = (value / 100000000) * price;
        return `${symbol}${amountInFiat.toFixed(2)}`;
    } else {
        return `${value} sats`;
    }
};

export const getPercent = (local: number, remote: number): number => {
    const total = remote + local;
    const percent = (local / total) * 100;

    if (remote === 0 && local === 0) {
        return 0;
    }

    return Math.round(percent);
};

export const getLoadingButton = (
    ButtonIcon: FunctionComponent,
    loading: boolean,
    text: string,
) => {
    if (loading) {
        return <Loader />;
    }
    return (
        <>
            <ButtonIcon />
            {text}
        </>
    );
};
