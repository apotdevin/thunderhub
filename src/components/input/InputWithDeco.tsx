import * as React from 'react';
import styled from 'styled-components';
import { unSelectedNavButton, mediaWidths } from 'src/styles/Themes';
import { SingleLine } from '../generic/Styled';
import { Price } from '../price/Price';
import { Input } from '.';

const NoWrapText = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const InputTitle = styled(NoWrapText)``;

const AmountText = styled(NoWrapText)`
  color: ${unSelectedNavButton};
  margin: 0 8px 0 16px;
`;

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
  inputMaxWidth?: string;
  title: string;
  value?: string | number | null;
  noInput?: boolean;
  amount?: number | null;
  override?: string;
  customAmount?: string | JSX.Element;
  color?: string;
  placeholder?: string;
  inputType?: string;
  inputCallback?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
};

export const InputWithDeco: React.FC<InputWithDecoProps> = ({
  title,
  value,
  amount,
  override,
  customAmount,
  children,
  placeholder,
  color,
  noInput,
  inputMaxWidth,
  inputType = 'text',
  inputCallback,
  onKeyDown,
  onEnter,
}) => {
  const showAmount = !!amount || customAmount;
  let correctValue = value ? value : '';

  if (inputType === 'number' && value) {
    correctValue = value && value > 0 ? value : '';
  }

  const onKeyDownProp = onKeyDown ? { onKeyDown } : onEnter ? { onEnter } : {};
  const props = noInput ? {} : { value: correctValue };

  return (
    <InputLine>
      <InputTitleRow>
        <InputTitle>{title}</InputTitle>
        {showAmount && (
          <AmountText>
            {customAmount ? (
              customAmount
            ) : (
              <Price amount={amount} override={override} />
            )}
          </AmountText>
        )}
      </InputTitleRow>
      {!noInput && (
        <Input
          maxWidth={inputMaxWidth || '500px'}
          placeholder={placeholder}
          color={color}
          withMargin={'0 0 0 8px'}
          mobileMargin={'0'}
          type={inputType}
          onChange={e => inputCallback && inputCallback(e.target.value)}
          {...onKeyDownProp}
          {...props}
        />
      )}
      {children}
    </InputLine>
  );
};
