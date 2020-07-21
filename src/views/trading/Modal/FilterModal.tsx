import React, { useState, useEffect, Dispatch } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { toast } from 'react-toastify';
import {
  useGetCountriesQuery,
  useGetCurrenciesQuery,
  GetCountriesQuery,
  GetCurrenciesQuery,
} from 'src/graphql/hodlhodl/__generated__/query.generated';
import { HodlCountryType, HodlCurrencyType } from 'src/graphql/types';
import { SubTitle } from '../../../components/generic/Styled';
import { SortOptions, NewOptions } from '../OfferConfigs';
import { FilterType, FilterActionType } from '../OfferFilters';
import { themeColors } from '../../../styles/Themes';
import { OptionsLoading } from '../OfferCard.styled';
import { FilteredList, FilteredOptionsProps } from './FilteredList';

export type ModalType = 'keysend' | 'request' | 'none' | 'new' | 'sort';
interface FilterProps {
  type: string;
  dispatch: Dispatch<FilterActionType>;
  final?: { title: string; name: string; searchable?: boolean };
  newOptions?: FilterType[];
  setModalType: (type: ModalType) => void;
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
  const searchable: boolean = final?.searchable ?? false;
  const skipable: boolean = type !== 'Country' && type !== 'Currency';

  const [selected, setSelected] = useState<FilteredOptionsProps>();

  const [options, setOptions] = useState(newOptions ?? []);
  const [title, setTitle] = useState(final?.title ?? '');

  const useQuery =
    type === 'Country' ? useGetCountriesQuery : useGetCurrenciesQuery;

  const { loading, data, error } = useQuery({
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
    if (!loading && data && (data as GetCountriesQuery).getCountries) {
      const countryOptions =
        (data as GetCountriesQuery).getCountries?.map(country => {
          const { code, name, native_name } = country as HodlCountryType;
          return { name: code || '', title: `${name} (${native_name})` };
        }) || [];

      setOptions(countryOptions);
    }
    if (!loading && data && (data as GetCurrenciesQuery).getCurrencies) {
      const filtered =
        (data as GetCurrenciesQuery).getCurrencies?.filter(
          currency => currency?.type === 'fiat'
        ) || [];

      const currencyOptions = filtered.map(currency => {
        const { code, name } = currency as HodlCurrencyType;
        return { name: code || '', title: name || '' };
      });

      setOptions(currencyOptions);
    }
  }, [data, loading]);

  const handleClick = (name: string, option: FilteredOptionsProps) => () => {
    if (final) {
      dispatch({
        type: 'addFilter',
        newItem: { [final.name]: name },
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
      <FilterModal
        type={selected.title}
        dispatch={dispatch}
        final={selected}
        newOptions={selected.options}
        setModalType={setModalType}
      />
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
