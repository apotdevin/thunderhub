import { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_BITCOIN_PRICE } from '../../graphql/query';
import { SettingsContext } from '../../context/SettingsContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';

export const BitcoinPrice = () => {
    const { setSettings } = useContext(SettingsContext);
    const { loading, data } = useQuery(GET_BITCOIN_PRICE, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        if (!loading && data && data.getBitcoinPrice) {
            const { price, symbol } = data.getBitcoinPrice;
            setSettings({ price, symbol });
        }
    }, [data, loading, setSettings]);

    return null;
};
