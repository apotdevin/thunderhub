import styled from 'styled-components';
import { mediaWidths, themeColors } from '@/styles/Themes';
import { Loader2 } from 'lucide-react';
import { SingleLine } from '../generic/Styled';
import { Select, SelectWithValue, ValueProp } from '.';
import { FC, ReactNode } from 'react';

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
  noInput?: boolean;
  loading?: boolean;
  maxWidth?: string;
  callback: (value: ValueProp[]) => void;
  children?: ReactNode;
};

export const SelectWithDeco: FC<InputWithDecoProps> = ({
  children,
  title,
  noInput,
  options,
  loading,
  maxWidth,
  callback,
}) => {
  const renderContent = () => {
    switch (true) {
      case loading:
        return (
          <Loader2
            className="animate-spin"
            size={20}
            style={{ color: themeColors.blue3 }}
          />
        );
      case !noInput:
        return (
          <Select
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
  noInput?: boolean;
  loading?: boolean;
  callback: (value: ValueProp[]) => void;
  children?: React.ReactNode;
};

export const SelectWithDecoAndValue: React.FC<InputWithDecoAndValueProps> = ({
  children,
  title,
  noInput,
  options,
  loading,
  callback,
  value,
}) => {
  const renderContent = () => {
    switch (true) {
      case loading:
        return (
          <Loader2
            className="animate-spin"
            size={20}
            style={{ color: themeColors.blue3 }}
          />
        );
      case !noInput:
        return (
          <SelectWithValue
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
