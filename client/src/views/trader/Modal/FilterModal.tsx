import React, { useState, useEffect } from 'react';
import { ColorButton } from 'components/buttons/colorButton/ColorButton';
import { SubTitle } from 'components/generic/Styled';
import { SortOptions, NewOptions, PaymentOptions } from '../OfferConfigs';
import { OfferModalBox } from '../OfferCard.styled';
import { FilterType } from '../OfferFilters';
import { Input } from 'components/input/Input';

interface FilterProps {
    type: string;
    dispatch: any;
    newOptions: FilterType[];
    setModalType: (type: string) => void;
    setNewFilter: (type: {}) => void;
    setNewOptions: (type: FilterType[]) => void;
}

export const FilterModal = ({
    type,
    dispatch,
    newOptions,
    setModalType,
    setNewFilter,
    setNewOptions,
}: FilterProps) => {
    let options: { name: string; title: string }[] = newOptions ?? [];
    let title: string = '';
    let searchable: boolean = false;

    switch (type) {
        case 'sort':
            title = 'Sort Offers by:';
            options = SortOptions;
            break;
        case 'new':
            title = 'Add New Filter:';
            options = NewOptions;
            break;
        case 'country':
            title = 'Countries:';
            searchable = true;
            break;
        case 'currency_code':
            title = 'Currencies:';
            searchable = true;
            break;
        case 'payment_method_type':
            title = 'Payment Types:';
            searchable = true;
            break;
        default:
            break;
    }

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredOptions, setOptions] = useState<
        { name: string; title: string }[]
    >(options);

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const filtered = options.filter(
            (option: { name: string; title: string }) => {
                const inName = option.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const inTitle = option.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                return inName || inTitle;
            },
        );
        setOptions(filtered);
    }, [searchTerm, options]);

    const handleClick = (name: string, option?: {}) => () => {
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
                break;
            case 'new':
                if (name === 'payment_method_type') {
                    setNewOptions(PaymentOptions);
                }
                option && setNewFilter(option);
                break;
            case 'country':
            case 'currency_code':
            case 'payment_method_type':
                dispatch({
                    type: 'addFilter',
                    newItem: { [type]: name },
                });
                setNewFilter({});
                break;
            default:
                break;
        }
        setModalType('none');
    };

    return (
        <>
            <SubTitle>{title}</SubTitle>
            {searchable && (
                <Input
                    placeholder={'Search'}
                    fullWidth={true}
                    onChange={handleChange}
                    withMargin={'0 0 8px 0'}
                />
            )}
            <OfferModalBox>
                {filteredOptions.map(
                    (
                        option: { name: string; title: string },
                        index: number,
                    ) => (
                        <ColorButton
                            key={`${index}-${option.name}`}
                            fullWidth={true}
                            withMargin={'0 0 2px 0'}
                            onClick={handleClick(option.name, option)}
                        >
                            {option.title}
                        </ColorButton>
                    ),
                )}
            </OfferModalBox>
        </>
    );
};
