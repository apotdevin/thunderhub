import * as React from 'react';
import styled from 'styled-components';
import { mediaWidths } from 'src/styles/Themes';
import { SingleLine } from '../generic/Styled';
import { Select, ValueProp } from '.';

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
  noInput?: boolean;
  options: ValueProp[];
  callback: (value: ValueProp) => void;
};

export const SelectWithDeco: React.FC<InputWithDecoProps> = ({
  children,
  title,
  noInput,
  options,
  callback,
}) => {
  return (
    <InputLine>
      <InputTitleRow>
        <InputTitle>{title}</InputTitle>
      </InputTitleRow>
      {!noInput && (
        <Select maxWidth={'500px'} options={options} callback={callback} />
      )}
      {children}
    </InputLine>
  );
};
