import React, { useState, useEffect } from 'react';
import { SubTitle } from '../../../components/generic/Styled';
import { SortOptions, NewOptions } from '../OfferConfigs';
import { FilterType } from '../OfferFilters';
import { useQuery } from '@apollo/react-hooks';
import {
  GET_HODL_COUNTRIES,
  GET_HODL_CURRENCIES,
} from '../../../graphql/hodlhodl/query';
import { themeColors } from '../../../styles/Themes';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { FilteredList } from './FilteredList';
import { OptionsLoading } from '../OfferCard.styled';
import { toast } from 'react-toastify';

interface FilterProps {
  type: string;
  dispatch: any;
  final?: {};
  newOptions?: FilterType[];
  setModalType: (type: string) => void;
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

export const FilterModal = ({
  type,
  dispatch,
  final,
  newOptions,
  setModalType,
}: FilterProps) => {
  const searchable: boolean = final?.['searchable'] || false;
  const skipable: boolean = type !== 'Country' && type !== 'Currency';

  const [selected, setSelected] = useState<{} | undefined>();

  const [options, setOptions] = useState(newOptions ?? []);
  const [title, setTitle] = useState(final?.['title'] || '');

  const query = type === 'Country' ? GET_HODL_COUNTRIES : GET_HODL_CURRENCIES;

  const { loading, data, error } = useQuery(query, {
    skip: skipable,
    onError: () => toast.error('Error Loading Options. Please try again.'),
  });

  useEffect(() => {
    switch (type) {
      case 'sort':
        setTitle('Sort Offers by:');
        setOptions(SortOptions);
        break;
      case 'new':
        setTitle('Add New Filter:');
        setOptions(NewOptions);
        break;
      default:
        break;
    }
  }, [type]);

  useEffect(() => {
    if (!loading && data && data.getCountries) {
      const countryOptions = data.getCountries.map((country: CountryType) => {
        const { code, name, native_name } = country;
        return { name: code, title: `${name} (${native_name})` };
      });

      setOptions(countryOptions);
    }
    if (!loading && data && data.getCurrencies) {
      const filtered = data.getCurrencies.filter(
        (currency: CurrencyType) => currency.type === 'fiat'
      );

      const currencyOptions = filtered.map((currency: CurrencyType) => {
        const { code, name } = currency;
        return { name: code, title: name };
      });

      setOptions(currencyOptions);
    }
  }, [data, loading]);

  const handleClick = (name: string, option?: {}) => () => {
    if (final) {
      dispatch({
        type: 'addFilter',
        newItem: { [final['name']]: name },
      });
      setModalType('none');
    }
    switch (type) {
      case 'sort':
        if (name === 'none') {
          dispatch({
            type: 'removeSort',
          });
        } else {
          dispatch({
            type: 'addSort',
            newItem: { by: name },
          });
        }
        setModalType('none');
        break;
      case 'new':
        setSelected(option);
        break;
      default:
        break;
    }
  };

  if (error) {
    return null;
  }

  if (selected) {
    return (
      <>
        <FilterModal
          type={selected['title']}
          dispatch={dispatch}
          final={selected}
          newOptions={selected['options']}
          setModalType={setModalType}
        />
      </>
    );
  }

  return (
    <>
      <SubTitle>{title}</SubTitle>
      <FilteredList
        searchable={searchable}
        options={options}
        handleClick={handleClick}
      />
      <OptionsLoading>
        {loading && <ScaleLoader height={20} color={themeColors.blue3} />}
      </OptionsLoading>
    </>
  );
};
