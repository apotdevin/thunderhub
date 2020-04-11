import React, { useState, useEffect } from 'react';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { OfferModalBox } from '../OfferCard.styled';
import { Input } from '../../../components/input/Input';
import { Sub4Title } from '../../../components/generic/Styled';

interface FilteredProps {
  searchable: boolean;
  options: any;
  handleClick: any;
}

interface FilteredOptionsProps {
  name: string;
  title: string;
}

export const FilteredList = ({
  searchable,
  options,
  handleClick,
}: FilteredProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredOptions, setOptions] = useState<FilteredOptionsProps[]>(
    options
  );

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
      }
    );
    setOptions(filtered);
  }, [searchTerm, options]);

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      {searchable && (
        <Input
          placeholder={'Search'}
          fullWidth={true}
          onChange={handleChange}
          withMargin={'0 0 8px 0'}
        />
      )}
      <OfferModalBox>
        {filteredOptions.length > 0 ? (
          filteredOptions.map(
            (option: { name: string; title: string }, index: number) => (
              <ColorButton
                key={`${index}-${option.name}`}
                fullWidth={true}
                withMargin={'0 0 2px 0'}
                onClick={handleClick(option.name, option)}
              >
                {option.title}
              </ColorButton>
            )
          )
        ) : (
          <Sub4Title>No results</Sub4Title>
        )}
      </OfferModalBox>
    </>
  );
};
