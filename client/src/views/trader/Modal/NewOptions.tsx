import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
    GET_HODL_COUNTRIES,
    GET_HODL_CURRENCIES,
} from 'graphql/hodlhodl/query';
import { ColorButton } from 'components/buttons/colorButton/ColorButton';
import { themeColors } from 'styles/Themes';
import ScaleLoader from 'react-spinners/ScaleLoader';

interface NewOptionProps {
    type: string;
    setModalType: (type: string) => void;
    setNewOptions: (type: []) => void;
}

interface CountryType {
    code: string;
    name: string;
    native_name: string;
    currency_code: string;
    currency_name: string;
}

interface CurrencyType {
    code: string;
    name: string;
    type: string;
}

export const NewOptions = ({
    type,
    setNewOptions,
    setModalType,
}: NewOptionProps) => {
    let query;
    let title;

    switch (type) {
        case 'currency_code':
            query = GET_HODL_CURRENCIES;
            title = 'Currencies';
            break;
        default:
            query = GET_HODL_COUNTRIES;
            title = 'Countries';
            break;
    }

    const [disabled, setDisabled] = useState<boolean>(true);
    const { loading, data, error } = useQuery(query);

    useEffect(() => {
        if (!loading && data && data.getCountries) {
            const countryOptions = data.getCountries.map(
                (country: CountryType) => {
                    const { code, name, native_name } = country;
                    return { name: code, title: `${name} (${native_name})` };
                },
            );

            setNewOptions(countryOptions);
            setDisabled(false);
        }
        if (!loading && data && data.getCurrencies) {
            const filtered = data.getCurrencies.filter(
                (currency: CurrencyType) => currency.type === 'fiat',
            );

            const currencyOptions = filtered.map((currency: CurrencyType) => {
                const { code, name } = currency;
                return { name: code, title: name };
            });

            setNewOptions(currencyOptions);
            setDisabled(false);
        }
    }, [data, loading, setNewOptions]);

    if (loading || !data || (!data.getCountries && !data.getCurrencies)) {
        return (
            <ColorButton disabled={true}>
                <ScaleLoader height={20} color={themeColors.blue3} />
            </ColorButton>
        );
    }

    return (
        <ColorButton
            arrow={true}
            disabled={disabled}
            onClick={() => setModalType(type)}
        >
            {title}
        </ColorButton>
    );
};
