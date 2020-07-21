import React from 'react';
import styled from 'styled-components';
import { HodlOfferPaymentType } from 'src/graphql/types';
import { themeColors, subCardColor } from '../../styles/Themes';

interface MethodProps {
  id: string;
  payment_method_type: string;
  payment_method_name: string;
}

interface MethodBoxesProps {
  methods?: HodlOfferPaymentType[] | null;
}

const StyledMethodBoxes = styled.div`
  width: 100%;
  position: relative;
  right: -16px;
  top: -26px;
  display: flex;
  justify-content: flex-end;
  margin: 0 0 -24px 0;
  flex-wrap: wrap;
  overflow: hidden;
  height: 23px;
`;

const StyledMethod = styled.div`
  font-size: 12px;
  margin: 0 0 0 8px;
  border: 1px solid ${themeColors.blue2};
  border-radius: 4px;
  padding: 2px 4px;
  background: ${subCardColor};
  white-space: nowrap;
`;

export const MethodBoxes = ({ methods }: MethodBoxesProps) => {
  if (!methods?.length) return null;

  return (
    <StyledMethodBoxes>
      {methods.map((method, index) => (
        <StyledMethod key={`${method.payment_method_name}/${index}`}>
          {method.payment_method_name}
        </StyledMethod>
      ))}
    </StyledMethodBoxes>
  );
};
