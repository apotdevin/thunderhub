import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_BITCOIN_FEES } from '../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { useBitcoinInfo } from '../../context/BitcoinContext';

export const BitcoinFees = () => {
    const { setInfo } = useBitcoinInfo();
    const { loading, data } = useQuery(GET_BITCOIN_FEES, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        if (!loading && data && data.getBitcoinFees) {
            const { fast, halfHour, hour } = data.getBitcoinFees;
            setInfo({ fast, halfHour, hour });
        }
    }, [data, loading, setInfo]);

    return null;
};
