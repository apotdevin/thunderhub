import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_BITCOIN_PRICE } from '../../graphql/query';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';

export const BitcoinPrice = () => {
    const { setSettings } = useSettings();
    const { loading, data, stopPolling } = useQuery(GET_BITCOIN_PRICE, {
        onError: error => toast.error(getErrorContent(error)),
        pollInterval: 60000,
    });

    useEffect(() => {
        if (!loading && data && data.getBitcoinPrice) {
            try {
                const prices = JSON.parse(data.getBitcoinPrice);
                setSettings({ prices });
            } catch (error) {
                stopPolling();
            }
        }
    }, [data, loading, setSettings]);

    return null;
};
