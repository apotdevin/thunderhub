import React from 'react';
import ReactSelect from 'react-select';
import styled, { css } from 'styled-components';
import {
  inputBackgroundColor,
  textColor,
  inputBorderColor,
  themeColors,
} from '../../../src/styles/Themes';

type WrapperProps = {
  maxWidth?: string;
  fullWidth?: boolean;
};

const StyledWrapper = styled.div<WrapperProps>`
  ${({ maxWidth }) =>
    maxWidth &&
    css`
      max-width: ${maxWidth};
    `}
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const StyledSelect = styled(ReactSelect)`
  & .Select__control {
    cursor: pointer;
    background-color: ${inputBackgroundColor};
    border: 1px solid ${inputBorderColor};
    font-size: 14px;

    & .Select__control--is-focused {
      border: 1px solid ${themeColors.blue2};
    }

    & .Select__single-value {
      color: ${textColor};
    }
  }

  & .Select__menu {
    font-size: 14px;
    color: black;

    & .Select__option {
      cursor: pointer;
    }

    & .Select__option--is-selected {
      background-color: ${themeColors.blue2};
    }
  }
`;

const StyledSmallSelect = styled(ReactSelect)`
  & .Select__control {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 12px;

    & .Select__control--is-focused {
      border: 1px solid ${themeColors.blue2};
    }

    & .Select__single-value {
      color: ${textColor};
    }

    & .Select__dropdown-indicator {
      padding: 0 0 0 4px;
    }
  }

  & .Select__menu {
    font-size: 14px;
    color: black;

    & .Select__option {
      cursor: pointer;
    }

    & .Select__option--is-selected {
      background-color: ${themeColors.blue2};
    }
  }
`;

export type ValueProp = {
  value: string | number;
  label: string | number;
};

type SelectProps = {
  options: ValueProp[];
  isMulti?: boolean;
  maxWidth?: string;
  callback: (value: ValueProp[]) => void;
};

export const Select = ({
  isMulti,
  options,
  maxWidth,
  callback,
}: SelectProps) => {
  const handleChange: any = (value: ValueProp | ValueProp[]) => {
    if (Array.isArray(value)) {
      callback(value);
    } else {
      callback([value]);
    }
  };
  return (
    <StyledWrapper maxWidth={maxWidth} fullWidth={true}>
      <StyledSelect
        isMulti={isMulti}
        classNamePrefix={'Select'}
        options={options}
        onChange={handleChange}
      />
    </StyledWrapper>
  );
};

type SelectWithValueProps = {
  options: ValueProp[];
  value: ValueProp | undefined;
  isMulti?: boolean;
  maxWidth?: string;
  isClearable?: boolean;
  callback: (value: ValueProp[]) => void;
};

export const SelectWithValue = ({
  isMulti,
  options,
  maxWidth,
  callback,
  value,
  isClearable = true,
}: SelectWithValueProps) => {
  const handleChange: any = (value: ValueProp | ValueProp[]) => {
    if (Array.isArray(value)) {
      callback(value);
    } else {
      callback([value]);
    }
  };
  return (
    <StyledWrapper maxWidth={maxWidth} fullWidth={true}>
      <StyledSelect
        isMulti={isMulti}
        classNamePrefix={'Select'}
        options={options}
        onChange={handleChange}
        value={value || null}
        isClearable={isClearable}
      />
    </StyledWrapper>
  );
};

export const SmallSelectWithValue = ({
  isMulti,
  options,
  maxWidth,
  callback,
  value,
  isClearable = true,
}: SelectWithValueProps) => {
  const handleChange: any = (value: ValueProp | ValueProp[]) => {
    if (Array.isArray(value)) {
      callback(value);
    } else {
      callback([value]);
    }
  };
  return (
    <StyledWrapper maxWidth={maxWidth} fullWidth={true}>
      <StyledSmallSelect
        isMulti={isMulti}
        classNamePrefix={'Select'}
        options={options}
        onChange={handleChange}
        value={value || null}
        isClearable={isClearable}
      />
    </StyledWrapper>
  );
};
