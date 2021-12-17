import * as React from 'react';
import styled from 'styled-components';
import { mediaWidths, themeColors } from '../../../src/styles/Themes';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { SingleLine } from '../generic/Styled';
import { Select, SelectWithValue, ValueProp } from '.';

const NoWrapText = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const InputTitle = styled(NoWrapText)``;

const InputTitleRow = styled.div`
  display: flex;

  @media (${mediaWidths.mobile}) {
    flex-wrap: wrap;
    margin: 8px 0;
  }
`;

const InputLine = styled(SingleLine)`
  width: 100%;
  margin: 8px 0;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
`;

type InputWithDecoProps = {
  title: string;
  options: ValueProp[];
  isMulti?: boolean;
  noInput?: boolean;
  loading?: boolean;
  maxWidth?: string;
  callback: (value: ValueProp[]) => void;
};

export const SelectWithDeco: React.FC<InputWithDecoProps> = ({
  children,
  title,
  noInput,
  options,
  isMulti,
  loading,
  maxWidth,
  callback,
}) => {
  const renderContent = () => {
    switch (true) {
      case loading:
        return <ScaleLoader height={20} color={themeColors.blue3} />;
      case !noInput:
        return (
          <Select
            isMulti={isMulti}
            maxWidth={maxWidth || '500px'}
            options={options}
            callback={callback}
          />
        );
      default:
        return null;
    }
  };
  return (
    <InputLine>
      <InputTitleRow>
        <InputTitle>{title}</InputTitle>
      </InputTitleRow>
      {renderContent()}
      {children}
    </InputLine>
  );
};

type InputWithDecoAndValueProps = {
  title: string;
  value: ValueProp | undefined;
  options: ValueProp[];
  isMulti?: boolean;
  noInput?: boolean;
  loading?: boolean;
  callback: (value: ValueProp[]) => void;
};

export const SelectWithDecoAndValue: React.FC<InputWithDecoAndValueProps> = ({
  children,
  title,
  noInput,
  options,
  isMulti,
  loading,
  callback,
  value,
}) => {
  const renderContent = () => {
    switch (true) {
      case loading:
        return <ScaleLoader height={20} color={themeColors.blue3} />;
      case !noInput:
        return (
          <SelectWithValue
            isMulti={isMulti}
            maxWidth={'500px'}
            options={options}
            callback={callback}
            value={value}
          />
        );
      default:
        return null;
    }
  };
  return (
    <InputLine>
      <InputTitleRow>
        <InputTitle>{title}</InputTitle>
      </InputTitleRow>
      {renderContent()}
      {children}
    </InputLine>
  );
};
