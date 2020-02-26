import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_BITCOIN_PRICE } from '../../graphql/query';
import { usePriceDispatch } from '../../context/PriceContext';

export const BitcoinPrice = () => {
    const setPrices = usePriceDispatch();
    const { loading, data, stopPolling } = useQuery(GET_BITCOIN_PRICE, {
        onError: () => setPrices({ type: 'error' }),
        pollInterval: 60000,
    });

    useEffect(() => {
        if (!loading && data && data.getBitcoinPrice) {
            try {
                const prices = JSON.parse(data.getBitcoinPrice);
                setPrices({
                    type: 'fetched',
                    state: { loading: false, error: false, prices },
                });
            } catch (error) {
                stopPolling();
                setPrices({ type: 'error' });
            }
        }
    }, [data, loading, setPrices, stopPolling]);

    return null;
};
