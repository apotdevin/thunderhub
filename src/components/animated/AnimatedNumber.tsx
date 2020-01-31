import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import { getValue } from 'helpers/Helpers';
import { useSettings } from 'context/SettingsContext';

interface AnimatedProps {
    amount: number;
}

export const AnimatedNumber = ({ amount }: AnimatedProps) => {
    const { value } = useSpring({
        from: { value: 0 },
        value: amount,
    });
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

    return (
        <animated.div>
            {value.interpolate(amount => getValue({ amount, ...priceProps }))}
        </animated.div>
    );
};
